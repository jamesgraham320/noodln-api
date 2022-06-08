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
const getChatterById = async(req, res) => {
}
const createMeet = async(req, res) => {
}

module.exports = {
  getChatters,
  createChatter,
  getChatterById,
}

const meets = [
  {
    id: 0,
    talkerID1: 0,
    talkerID2: 1,
    date: new Date(),
  },{
    id: 1,
    talkerID1: 2,
    talkerID2: 3,
    date: new Date(),
  },
]

const chatters = [
  {
    id: 0,
    firstName: '',
    lastName: '',
    interest: '',
    email: '',
  },{
    id: 1,
    firstName: '',
    lastName: '',
    interest: '',
    email: '',
  },{
    id: 2,
    firstName: '',
    lastName: '',
    interest: '',
    email: '',
  },{
    id: 3,
    firstName: '',
    lastName: '',
    interest: '',
    email: '',
  },
]
