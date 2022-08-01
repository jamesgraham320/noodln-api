const fetch = require("node-fetch");

function getNewRoom(roomName) {
  return fetch(process.env.SMALLTALK_CREATE_TALK_EP, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SMALLTALK_PRIVATE}`,
    },
    body: JSON.stringify(talkObject(roomName)),
  })
    .then((res) => {
      console.log(res.body.error);
      return res.json();
    })
    .then((json) => json.talk);
}

const talkObject = function (name) {
  return {
    name: name,
    access: "anyone",
    mic_behavior: "start_on",
    partner_id: process.env.NOODLN_ID,
    theme_id: "836aa177-a620-4d89-a67c-ebf530cb6cfa",
    subscriptions_allowed: true,
    cta_ids: ["dae36c71-1ca9-430c-8292-921c32a1c2c3"],
  };
};

module.exports = { getNewRoom };
