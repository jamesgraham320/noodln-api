// ./src/index.js
// importing the dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const api = require('./api');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));


// defining endpoints
app.get('/chatters/', api.getChatters);
app.get('/chatters/:id', api.getChatterById);
app.post('/chatters/', api.createChatter);

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});

