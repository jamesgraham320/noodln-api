const db_con = require("../../knexfile.js");
const { knexSnakeCaseMappers } = require("objection");
const pg = require("knex")({
  ...db_con[process.env.NODE_ENV],
  ...knexSnakeCaseMappers(),
});

module.exports = { pg }
