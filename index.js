require('./helpers/utils');

const env = CL_ARGS.get('env') || 'test';
require('dotenv').config({ path: `.env/${env}.env` });

const { app } = require('./loaders/app');
const { shuffle } = require('./socket/tournament');

app.listen(process.env.PORT, () => {
  console.log('Server is up and listening on port : ' + process.env.PORT);
});

// shuffle()
