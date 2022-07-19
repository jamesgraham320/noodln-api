// ./src/index.js
// importing the dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const api = require('./api');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));
app.use(cookieParser());


// defining endpoints
app.post('/chatters/', api.createChatter);

// starting the server
app.listen(process.env.PORT || 3001, () => {
  console.log("current ENV: ", process.env.NODE_ENV)
});

