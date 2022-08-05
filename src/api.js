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

const createChatter = async (req, res) => {
  const chatter = req.body.chatter;
  const organizationId = req.body.organizationId;
  const clientIp = requestIp.getClientIp(req);

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
    await pg
      .insert({
        chatter_id: chatterId[0].id,
        organization_id: organizationId,
        role: "general_noodlr",
      })
      .into("chatter_organization");
    res.status(200);
    res.send("account made");
    mj.sendWelcome(chatter);
  } catch (err) {
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
  let data;
  try {
    [data] = await pg("organization").insert(orgData).returning(["name", "id"]);
  } catch (err) {
    res
      .status(400)
      .json({ data: null, error: { message: "invalid organization" } });
  }
  data.signupUrl = "https://noodln.com/signup/" + data.id;
  res.status(200).json({ data: data || null, error: null });
};

const getOrganization = async (req, res) => {
  let { orgId } = req.params;
  let data, error;
  try {
    [data] = await pg("organization").select("id", "name").where({ id: orgId });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: { message: "invalid organization" } });
  }
  if (data) {
    return res
      .status(200)
      .json({ data: data || null, error: error ? error.message : null });
  } else {
    return res
      .status(401)
      .send({ data: null, error: { message: "organization not found" } });
  }
};

module.exports = {
  createChatter,
  sendChattersByOrgId,
  pg,
  createOrganization,
  getOrganization,
};
