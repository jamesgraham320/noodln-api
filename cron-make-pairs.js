const cron = require('node-cron');
const api.pg = require('./api');

cron.schedule('30 11 * * 1-5', function() {
  const chatters = pg.select('*').from("chatters");
  chatters.map(c => {console.log(c.id)});
  const randomized = shuffleArray(chatters.slice(0));
  randomized.map(c => {console.log(c.id)});
  let pairs = [];

})

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
