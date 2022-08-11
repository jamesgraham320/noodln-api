const fetch = require("node-fetch");
const requestIp = require("request-ip");
const smt = require("../smalltalk-adapter.js");
const pg = require("./db/client.js").pg;
const mj = require("../mailjet-config.js");
const org = require("./controllers/organization.js");
const cha = require("./controllers/chatter.js");

const createChatter = async (req, res) => {
  let { chatter, organizationId } = req.body;
  const clientIp = requestIp.getClientIp(req);

  const clientInfo = await fetch(
    `https://ipinfo.io/json?token=${process.env.IPINFO_SECRET}`
  ).then((res) => res.json());

  Object.assign(chatter, {
    last_accessed_ip: clientInfo.ip,
    city: clientInfo.city,
    timezone: clientInfo.timezone,
  });
  let { data, error } = await cha.create(chatter, organizationId);

  if (data) {
    mj.sendWelcome(data);
  }
  if (error) {
    return res
      .status(400)
      .json({ talk: data || null, error: error ? error.message : null });
  } else {
    return res.json({ chatter: data || null, error: null });
  }
};

const sendChattersByOrgId = async (req, res) => {
  let { data, error } = await cha.getChattersByOrgId(req.params.orgId);
  if (error) {
    return res
      .status(400)
      .json({ talk: data || null, error: error.message || null });
  } else {
    return res.json({ chatters: data || null, error: null });
  }
};

const getOrganization = async (req, res) => {
  let { data, error } = await org.getById(req.params.orgId);
  console.log(data, error);
  if (error) {
    res.status(400).json({ data: data || null, error: error.message || null });
  } else {
    res.status(200).json({ data: data || null, error: null });
  }
};
const createOrganization = async (req, res) => {
  const { organization } = req.body;
  let { data, error } = await org.create(organization);
  if (error) {
    res.status(400).json({ data: data || null, error: error.message || null });
  } else {
    mj.sendOrgWelcome(data);
    res.status(200).json({ data: data || null, error: null });
  }
};

module.exports = {
  createChatter,
  sendChattersByOrgId,
  createOrganization,
  getOrganization,
};
