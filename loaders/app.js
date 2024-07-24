//#region <Library Imports>
const express = require('express');



const path = require('path');
const fs = require('fs');
//#region <Project Imports>

const apiRouter = require('../routes/api.route');

require('../database/mongodb');
//#endregion

//#region <Instances>
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

//#region Socket Listener
if (!CL_ARGS.has('no-redis')) {
  console.log('Redis enabled');
  const pubClient = createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    legacyMode: true,
    tls: {
      key: fs.readFileSync(
        path.join(
          __dirname,
          '..',
          'redis_credentials',
          process.env.REDIS_CREDENTIALS,
          'redislabs_user_private.key'
        )
      ),
      cert: fs.readFileSync(
        path.join(
          __dirname,
          '..',
          'redis_credentials',

          process.env.REDIS_CREDENTIALS,
          'redislabs_user.crt'
        )
      ),
      ca: fs.readFileSync(
        path.join(
          __dirname,
          '..',
          'redis_credentials',
          process.env.REDIS_CREDENTIALS,
          'redislabs_ca.pem'
        )
      ),
    },
  });
  const subClient = pubClient.duplicate();

  socketIo.adapter(createAdapter(pubClient, subClient));
}
//#endregion

//#region <X-Powered-By>
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'PHP');
  next();
});
//#region <CORS>
app.use(cors());
//#endregion

//#region <Helmet Security Packages>
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.hsts());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.xssFilter());
//#endregion

//#region <Body parser and formdata>
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '1024mb' }));
//#endregion

//#region <Process Error handling>
if (!CL_ARGS.has('show-error-stack')) {
  process.on('uncaughtException', (err) => {
    console.error(
      'UNCAUGHT EXCEPTION! Shutting down...',
      err.name,
      err.message
    );
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    console.error(
      'UNHANDLED REJECTION! Shutting down...',
      err.name,
      err.message
    );
    process.exit(1);
  });
}
//#endregion

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
