const emails = require("./email-bodies");
const Mailjet = require("node-mailjet");
const smt = require("./smalltalk-adapter");
const mj = new Mailjet({
  apiKey: process.env.MAILJET_PUBLIC,
  apiSecret: process.env.MAILJET_PRIVATE,
});

const sendWelcome = async function (user) {
  const roomName = `${user.fullName}'s 24/7 Noodln Spot`;
  const roomDesc = roomDescription(user);
  let newTalk = await smt.getNewRoom(roomName, roomDesc);

  return mj
    .post("send", { version: "v3.1" })
    .request(emails.welcomeBody(user, newTalk.short_url))
    .then((result) => {
      console.log("welcome email sent status: ", result.response.status);
    })
    .catch((err) => {
      console.log("Error while sending email: ", err.code);
    });
};

const sendOrgWelcome = async function (org) {
  mj.post("send", { version: "v3.1" })
    .request(emails.orgWelcomeBody(org))
    .then((result) => {
      console.log("welcome org email sent status: ", result.response.status);
    })
    .catch((err) => {
      console.log("Error while sending email: ", err.code);
    });
};

const sendNoodln = async function (users) {
  let messages = [];
  const max = users.length;
  for (let i = 0; i < max - 3; i = i + 2) {
    const roomName = `${users[i].fullName} and ${
      users[i + 1].fullName
    }'s 24/7 Noodln Spot'`;
    const roomDesc = roomDescription(users[i], users[i + 1]);
    let newTalk = await smt.getNewRoom(roomName, roomDesc);
    messages.push(emails.matchBody(users[i], users[i + 1], newTalk.short_url));
    messages.push(emails.matchBody(users[i + 1], users[i], newTalk.short_url));
  }
  if (max % 2 === 1) {
    const roomName = `${users[max - 3].fullName}, ${
      users[max - 2].fullName
    } and ${users[max - 1].fullName}'s 24/7 Noodln Spot'`;
    const roomDesc = roomDescription(
      users[max - 3],
      users[max - 2],
      users[max - 1]
    );
    let newTalk = await smt.getNewRoom(roomName);
    messages.push(
      emails.threeWayBody(
        users[max - 3],
        users[max - 2],
        users[max - 1],
        newTalk.short_url
      )
    );
    messages.push(
      emails.threeWayBody(
        users[max - 2],
        users[max - 1],
        users[max - 3],
        newTalk.short_url
      )
    );
    messages.push(
      emails.threeWayBody(
        users[max - 1],
        users[max - 3],
        users[max - 2],
        newTalk.short_url
      )
    );
  } else if (max % 2 === 0) {
    const roomDesc = roomDescription(users[max - 2], users[max - 1]);
    const roomName = `${users[max - 1].fullName} and ${
      users[max - 2].fullName
    }'s 24/7 Noodln Spot'`;
    let newTalk = await smt.getNewRoom(roomName);
    messages.push(
      emails.matchBody(users[max - 1], users[max - 2], newTalk.short_url)
    );
    messages.push(
      emails.matchBody(users[max - 2], users[max - 1], newTalk.short_url)
    );
  }

  return mj
    .post("send", { version: "v3.1" })
    .request({
      Messages: messages,
    })
    .then((result) => {
      console.log("succesfully sent Noodln emails: ", result.response.status);
    })
    .catch((err) => {
      console.log("Error while sending email: ", err);
    });
};

function roomDescription(user1, user2, user3) {
  let roomDesc;
  if (user1?.socialLink || user2?.socialLink || user3?.socialLink) {
    roomDesc = "Check out eachother's socials: ";
  }
  user1?.socialLink
    ? (roomDesc += `\n${user1.fullName}: ${user1.socialLink}`)
    : "";
  user2?.socialLink
    ? (roomDesc += `\n${user2.fullName}: ${user2.socialLink}`)
    : "";
  user3?.socialLink
    ? (roomDesc += `\n${user3.fullName}: ${user3.socialLink}`)
    : "";
  return roomDesc;
}

module.exports = {
  sendWelcome,
  sendNoodln,
  sendOrgWelcome,
};
