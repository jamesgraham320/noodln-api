const { knexSnakeCaseMappers } = require('objection');
const isProd = process.env.NODE_ENV === 'production';
const con = !isProd ? {
    host: 'localhost',
    port: '5432',
    database: 'smalltalks',
    password: 'smalltalk',
  } : process.env.DATABASE_URL+"?ssl=true";
const pg = require('knex')({
  client: 'pg',
  connection: con,
  ...knexSnakeCaseMappers()
})


const getChatters = async (req, res) => {
  const chatters = pg.select('*').from("chatters").then(
    chatters => res.status(200).json(chatters)
  );
}
const createChatter = async(req, res) => {
  const chatter = req.body;
  pg.insert(chatter).into('chatters').then(
    db => res.status(200)
  );
}

module.exports = {
  getChatters,
  createChatter,
}

