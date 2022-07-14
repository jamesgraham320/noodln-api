const fetch = require('node-fetch');

function getNewRoom(user) {
  const roomName = `Welcome to ${user.fullName}'s room!'`
  return fetch(process.env.SMALLTALK_CREATE_TALK_EP, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SMALLTALK_PRIVATE}`
    },
    body: JSON.stringify(talkObject(roomName)),
  }).then(res => res.json()).then(json => {
    //console.log('in getNewRoom promise json: ', json);
    return json.talk;
    }
  );

}

const talkObject = function(name) {
  return {
    name: name,
    access: 'anyone',
    mic_behavior: 'start_off',
    partner_id: process.env.NOODLN_ID
  }
}

module.exports = {getNewRoom}
