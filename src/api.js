const Pool = require('pg').Pool

const cn = new Pool({
  user: 'smalltalker',
  host: 'localhost',
  database: 'smalltalks',
  password: 'smalltalk',
  port: '5432'
});

const getChatters = async (req, res) => {
  res.status(200).json(chatters);
}
const createChatter = async(req, res) => {
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
