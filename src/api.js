const { knexSnakeCaseMappers } = require('objection');
const requestIp = require('request-ip');
const db_con = require('../knexfile.js') 
const mj = require('../mailjet-config');
const fetch = require('node-fetch');
const pg = require('knex')({ 
  ...db_con[process.env.NODE_ENV], 
  ...knexSnakeCaseMappers() });

const getChatters = (req, res) => { 
  const chatters = pg.select('*')
    .from("chatters")
    .then( chatters => res.status(200).json(chatters)
    );
}
const createChatter = async (req, res) => {
  const chatter = req.body;
  const clientIp = requestIp.getClientIp(req);
  const clientInfo = await fetch(`https://ipinfo.io/json?token=${process.env.IPINFO_SECRET}`)
    .then(res=>res.json());
  Object.assign(chatter, {
    last_accessed_ip: clientInfo.ip,
    city: clientInfo.city,
    timezone: clientInfo.timezone,
    }
  );
    console.log(chatter)
  try{
    await pg.insert(chatter).into('chatters');
    res.status(200);
    res.send("account made");
    mj.sendWelcome(chatter);
  } catch(err) {
    console.log(err);
    res.status(500);
    res.send('error inserting chatter');
  }

  //trying stuff with a cookie
    //.then(
    //db => {
      //const options = {
        //maxAge: 1000 * 60 * 60 * 24 * 5, //expires after 5 days
        //path: "/",
        //withCredentials: true,
      //}
      //res.cookie("accountMade", "true", options);
      //res.status(200);
      //res.send("account made");
    //}
  //);
}

module.exports = {
  getChatters,
  createChatter,
  pg
}

