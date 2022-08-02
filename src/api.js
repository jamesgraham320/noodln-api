const { knexSnakeCaseMappers } = require("objection");
const requestIp = require("request-ip");
const db_con = require("../knexfile.js");
const mj = require("../mailjet-config");
const fetch = require("node-fetch");
const pg = require("knex")({
  ...db_con[process.env.NODE_ENV],
  ...knexSnakeCaseMappers(),
});
const smt = require("../smalltalk-adapter.js");

const getChatters = (req, res) => {
  const chatters = pg
    .select("*")
    .from("chatter")
    .then((chatters) => res.status(200).json(chatters));
};

const createChatter = async (req, res) => {
  const chatter = req.body;
  const clientIp = requestIp.getClientIp(req);

  const orgId = await pg("organization")
    .select("id")
    .where({ name: "general Noodls" });

  const clientInfo = await fetch(
    `https://ipinfo.io/json?token=${process.env.IPINFO_SECRET}`
  ).then((res) => res.json());

  Object.assign(chatter, {
    last_accessed_ip: clientInfo.ip,
    city: clientInfo.city,
    timezone: clientInfo.timezone,
  });

  try {
    let chatterId = await pg.insert(chatter, ["id"]).into("chatter");
    await pg.insert({
      chatter_id: chatterId[0].id,
      organization_id: orgId[0].id,
      role: "general_noodlr",
    }).into("chatter_organization");
    res.status(200);
    res.send("account made");
    mj.sendWelcome(chatter);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send("error inserting chatter");
  }
};

const getChattersByOrgId = async (orgId) => {
  return await pg
    .select("c.id", "c.full_name", "co.role", "c.interest", "c.email")
    .from("chatter_organization as co")
    .join("chatter as c", "co.chatter_id", "c.id")
    .where({ organization_id: orgId });
};

const sendChattersByOrgId = (req, res) => {
  getChattersByOrgId(req.params.orgId);
  res.json(chatters);
  res.status(200);
};

const createOrganization = async (req, res) => {
  const orgData = req.body.organization;
  const chatterData = req.body.chatters.map((c) => {
    return { full_name: c["Name"], email: c["Email"], interest: orgData.name };
  });
  try {
    let org_id = await pg("organization").insert(orgData, ["id"]);
    let chatterIds = await pg("chatter").insert(chatterData, ["id"]);
    let co = chatterIds.map((c) => {
      return {
        chatter_id: c.id,
        organization_id: org_id[0].id,
      };
    });
    console.log(co);
    await pg("chatter_organization").insert(co);
    res.status(200);
    res.send("org made");
  } catch (err) {
    console.log("error while inserting organization", err);
  }
};

module.exports = {
  getChatters,
  createChatter,
  sendChattersByOrgId,
  pg,
  createOrganization,
};
