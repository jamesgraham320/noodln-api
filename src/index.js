// ./src/index.js
// importing the dependencies
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const api = require("./api");

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

// defining endpoints
app.post("/chatters/", api.createChatter);
app.post("/organizations/", api.createOrganization);
app.get("/organizations/:orgId", api.getOrganization);

// starting the server
app.listen(process.env.PORT || 3001, () => {
  console.log("current ENV: ", process.env.NODE_ENV);
});
