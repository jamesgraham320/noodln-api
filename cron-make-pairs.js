const cron = require('node-cron');
const api = require('./src/api');
const mj = require('./mailjet-config');

//cron.schedule('56 11 * * *', function() {
//})
async function dailyJob() {
  const chatters = await api.pg.select('*').from("chatters");
  const randomized = shuffleArray(chatters.slice(0));

  mj.sendNoodln(randomized);
}

dailyJob()

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  return array;
}
