const emails = require('./email-bodies');
const Mailjet = require('node-mailjet');
const smt = require('./smalltalk-adapter');
const mj = new Mailjet({
  apiKey: process.env.MAILJET_PUBLIC,
  apiSecret: process.env.MAILJET_PRIVATE
})

const sendWelcome = async function(user){
  let newTalk = await smt.getNewRoom(user);
  console.log('smalltalk api response: ', newTalk.short_url);

  return mj.post("send", {'version': 'v3.1'})
    .request(emails.welcomeMessage(user, newTalk.short_url))
    .then((result) => {
    console.log("welcome email sent status: ", result.response.status);
  })
  .catch((err) => {
    console.log('Error while sending email: ', err)
  })
}
//nested non async version
//const sendWelcome = function(user){
  //return smt.getNewRoom(user).then(newTalk => {
    //console.log('logging new talk: ', newTalk);
    //return mj.post("send", {'version': 'v3.1'})
      //.request(emails.welcomeMessage(user, newTalk.short_url))
      //.then((result) => {
        //console.log("welcome email sent status: ", result.response.status);
        //return result;
    //})
    //.catch((err) => {
      //console.log('Error while sending email: ', err)
    //})
  //});
//}

module.exports = {sendWelcome};
