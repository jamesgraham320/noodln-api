const pg = require("./src/db/client.js")
const mj = require("./mailjet-config");

async function dailyJob() {
  const orgs = await pg("organization").select("id");
  orgs.forEach(async (org) => {
    const chatters = await pg
      .select("c.id", "c.full_name", "co.role", "c.interest", "c.email")
      .from("chatter_organization as co")
      .join("chatter as c", "co.chatter_id", "c.id")
      .where({ organization_id: org.id });
    
    if (chatters.length > 2) {
      const randomized = shuffleArray(chatters.slice(0));
      mj.sendNoodln(randomized);
    }
  });
}

dailyJob();

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

