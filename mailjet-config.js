const emails = require('./email-bodies');
const Mailjet = require('node-mailjet');
const smt = require('./smalltalk-adapter');
const mj = new Mailjet({
  apiKey: process.env.MAILJET_PUBLIC,
  apiSecret: process.env.MAILJET_PRIVATE
})

const sendWelcome = async function(user){
  let newTalk = await smt.getNewRoom(user);

  return mj.post("send", {'version': 'v3.1'})
    .request(emails.welcomeMessage(user, newTalk.short_url))
    .then((result) => {
    console.log("welcome email sent status: ", result.Messages[0].status);
  })
  .catch((err) => {
    console.log(err.statusCode)
  })
}

module.exports = {sendWelcome};
