const { knexSnakeCaseMappers } = require('objection');
const pg = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: '5432',
    database: 'smalltalks',
    password: 'smalltalk',
  },
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

