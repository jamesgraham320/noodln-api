const { knexSnakeCaseMappers } = require('objection');
const isProd = process.env.NODE_ENV === 'production';
const con = !isProd ? {
    host: 'localhost',
    port: '5432',
    database: 'smalltalks',
    password: 'smalltalk',
} : {
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false}
} 
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
    db => {
      const options = {
        maxAge: 1000 * 60 * 60 * 24 * 5, //expires after 5 days
        path: "/",
        withCredentials: true,
      }
      res.cookie("accountMade", "true", options);
      res.status(200);
      res.send("account made");
    }
  );
}

module.exports = {
  getChatters,
  createChatter,
}

