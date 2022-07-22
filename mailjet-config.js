const emails = require('./email-bodies');
const Mailjet = require('node-mailjet');
const smt = require('./smalltalk-adapter');
const mj = new Mailjet({
  apiKey: process.env.MAILJET_PUBLIC,
  apiSecret: process.env.MAILJET_PRIVATE
})

const sendWelcome = async function(user){
  const roomName = `${user.fullName}'s 24/7 Noodln Spot`
  let newTalk = await smt.getNewRoom(roomName);

  return mj.post("send", {'version': 'v3.1'})
    .request(emails.welcomeMessage(user, newTalk.short_url))
    .then((result) => {
    console.log("welcome email sent status: ", result.response.status);
  })
  .catch((err) => {
    console.log('Error while sending email: ', err.code)
  })
}

const sendNoodln = async function(users) {
  let messages = [];
  const max = users.length;
  for (let i = 0; i < max-3; i=i+2){
    //const roomName = `${users[i].fullName} and ${users[i+1].fullName}'s 24/7 Noodln Spot'`
    //let newTalk = await smt.getNewRoom(roomName);
    messages.push(matchBody(users[i], users[i+1], 'https://atslt.com/o4P5o5'));
    messages.push(matchBody(users[i+1], users[i], 'https://atslt.com/o4P5o5'));
  };
  if (max % 2 === 1) {
    const roomName = `${users[max-3].fullName}, ${users[max-2].fullName} and ${users[max-1].fullName}'s 24/7 Noodln Spot'`
    //let newTalk = await smt.getNewRoom(roomName);
    messages.push(threeWayBody(users[max-3], users[max-2], users[max-1], 'https://atslt.com/o4P5o5'));
    messages.push(threeWayBody(users[max-2], users[max-1], users[max-3], 'https://atslt.com/o4P5o5'));
    messages.push(threeWayBody(users[max-1], users[max-3], users[max-2], 'https://atslt.com/o4P5o5'));
  } else if (max % 2 === 0) {
    const roomName = `${users[max-1].fullName} and ${users[max-2].fullName}'s 24/7 Noodln Spot'`
    //let newTalk = await smt.getNewRoom(roomName);
    messages.push(matchBody(users[max-1], users[max-2], 'https://atslt.com/o4P5o5'));
    messages.push(matchBody(users[max-2], users[max-1], 'https://atslt.com/o4P5o5'));
  }

  return mj.post("send", {'version': 'v3.1'})
    .request({
      "Messages": messages
    })
    .then((result) => {
    console.log("succesfully sent Noodln emails: ", result.response.status);
  })
  .catch((err) => {
    console.log('Error while sending email: ', err)
  })


}

const matchBody = function(user, match, roomLink) {
  return {
    "From": {
      "Email": "james@imonsmalltalk.com",
      "Name": "Noodln @ Smalltalk"
    },
    "To": [
      {
        "Email": user.email,
        "Name": user.fullName
      }
    ],
    "Subject": `${match.fullName} wants to Noodl with you!`,
    "TextPart": "Find your new lunch buddy.",
    "HTMLPart": emails.matchMessage(user, match, roomLink),
  }
}
const threeWayBody = function(user, match1, match2, roomLink) {
  return {
    "From": {
      "Email": "james@imonsmalltalk.com",
      "Name": "Noodln @ Smalltalk"
    },
    "To": [
      {
        "Email": user.email,
        "Name": user.fullName
      }
    ],
    "Subject": `${match1.fullName} and ${match2.fullName} want to Noodl with you!`,
    "TextPart": "Find your new lunch buddy.",
    "HTMLPart": emails.threeWayMessage(user, match1, match2, roomLink),
  }
}

module.exports = {
  sendWelcome,
  sendNoodln
};
