const express = require('express');

const apiRouter = require('../routes/api.route');

require('../database/mongodb');

const app = express();
const http = require('http').createServer(app);
const socketIo = require('socket.io')(http, {
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
});

require('../socket/socket')(socketIo);

app.set('socketIo', socketIo);


app.use(express.urlencoded({ extended: true }));


//#region <API Router>
app.use(apiRouter);

//error handling
app.use(function (err, req, res, next) {
  if (!CL_ARGS.has('show-error-stack')) {
    console.error(`\n${new Date()} : ${err.name} \n${err.message}`);
  } else console.error(err);
  const { name, message } = err;

  let status = 0,
    displayMsg = '';
  switch (name) {
    case 'request entity too large':
      status = 400;
      displayMsg = OOPS_OVERWORKED;
      break;
    case 'ValidationError':
    case 'BSONTypeError':
    case 'Error':
      status = 400;
      displayMsg = message;
      break;
    case 'MongoServerError':
      status = 500;
      displayMsg = MONGO_SERVER_ERROR;
      break;
    case 'ReferenceError':
      status = 500;
      displayMsg = PROGRAMMING_ERROR;
      break;
    case 'JsonWebTokenError':
    case 'ApiKeyError':
      status = 403;
      displayMsg = message;
      break;
    case 'TokenExpiredError':
      status = 403;
      displayMsg = SESSION_EXPIRE;
      break;
    default:
      status = 500;
      displayMsg = OOPS_OVERWORKED;
  }
  res.status(status).json({ message: displayMsg });
});
module.exports = http;
