
const { Namespace } = require('socket.io');
const { GUEST_ROOM, USER_ROOM } = require('../constants/common');



function checkSocketToken(namespace, socket, next, socketIo) {
  try {
    const socketsConnected = namespace.adapter.sids.size;
    // console.log(
    // '🌿 => checkSocketToken => socketsConnected:',
    // socketsConnected
    // );

    if (socketsConnected > process.env.SERVER_LIMIT) {
      next(error.OverWorked);
    } else {
      const { auth, type } = socket.handshake.query || {};
      // console.log(
      // '🌿 => checkSocketToken => socket.handshake.query:',
      // socket.handshake.query
      // );

      if (auth) {
        jwt.verify(
          auth,
          process.env.JWT_SECRET,
          async function (err, authorizedData) {
            if (!err) {
              socket.data = authorizedData;
              if (type) {
              } else {
              }
              next();
            } else {
              let errMessage = error[err.name];
              if (errMessage) next(errMessage);
            }
          }
        );
      } else {
        next(error.SessionTimeout);
      }
    }
  } catch (e) {
    console.log(e);
    next(error.OverWorked);
  }
}

async function sendLiveStreamVideoToggle(socket) {
  const data = await DbGetToggle({
    project: { _id: 0 },
  });

  socket.emit('live-stream-Video', {
    data: data,
  });
}

let rooms = {
  guest: GUEST_ROOM,
  user: USER_ROOM,
};

module.exports = (socketIo) => {
  /**
   * @type {Namespace}
   */
  const appNameSpace = socketIo.of('/heftyverse');

  appNameSpace
    .use(checkSocketToken.bind(null, appNameSpace))
    .on('connection', function (socket) {
      sendLiveStreamVideoToggle(socket);

      if (socket.data) {
        let room = rooms[socket.data.role];
        if (room) socket.join([room]);
      }

      socket.on('email', (email) => {
        socket.join(email);
      });

      socket.on('bonus-hour', (bonus_hour) => {
        socket.join(bonus_hour);
      });

      socket.on('disconnect', async function () {
        if (socket.data) {
          socket.emit('peer-left', socket.data);
        }
      });
    });

  const checkNameSpace = socketIo.of('/ai');

  checkNameSpace.use(checkSocketToken.bind(null, checkNameSpace));

  checkNameSpace.on('connection', (socket) => {
    socket.on('status', (data) => {
      socket.emit('socketid', socket.id);
      appNameSpace.emit('status', { message: 'Photobooth is live now' });
    });

    socket.on('aiimage', (data) => {
      appNameSpace.emit('aiimg', {
        message: 'Your Ai Image was ready',
        data,
      });
    });

    socket.on('aiimagetoDB', (data) => {
      appNameSpace.emit('aiimagetoDB', {
        message: 'aiimage updated into DB',
      });
    });

    socket.on('queue', (data) => {
      appNameSpace.emit('queue', {
        message: data,
      });
    });

    socket.on('jobs-pending', (data) => {
      appNameSpace.emit('status', { message: 'Photobooth is live now' });
      appNameSpace.emit('jobs-pending', {
        message: 'Pending jobs are =>',
        data,
      });
    });

    socket.on('disconnect', async function () {
      appNameSpace.emit('status', {
        message: 'Photobooth is offline',
      });
    });
  });
};
