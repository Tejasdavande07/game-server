const mongoose = require('mongoose');

const db = mongoose.connection;

const databaseOptions = {
  useNewUrlParser: true,
  keepAlive: true,
  useUnifiedTopology: true,
};

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);

mongoose.connect(
  process.env.DATABASE_URL + process.env.DATABASE_NAME,
  databaseOptions
);

db.on('open', () => {
  console.log('Database successfully connected.');
})
  .on('error', () => {
    console.log('Error in connecting database.');
  })
  .on('close', () => {
    console.log('Database disconnected.');
  });

module.exports = mongoose;
