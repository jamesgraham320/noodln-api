const emails = require('./email-bodies');
const Mailjet = require('node-mailjet');
const smt = require('./smalltalk-adapter');
const mj = new Mailjet({
  apiKey: process.env.MAILJET_PUBLIC,
  apiSecret: process.env.MAILJET_PRIVATE
})

const sendWelcome = async function(user){
  console.log('in mailjet-config: ', user);
  let newTalk = await smt.getNewRoom(user);
  console.log('smalltalk api response: ', newTalk.short_url);

  return mj.post("send", {'version': 'v3.1'})
    .request(emails.welcomeMessage(user, newTalk.short_url))
    .then((result) => {
    console.log("welcome email sent status: ", result.Messages[0].status);
  })
  .catch((err) => {
    console.log('Error while sending email: ', err)
  })
}

module.exports = {sendWelcome};
