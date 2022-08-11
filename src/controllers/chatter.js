const pg = require("../db/client.js").pg;
const requestIp = require("request-ip");

const create = (chatter, organizationId) => {
  let c;
  try {
    pg.transaction(async (trx) => {
      [c] = await pg("chatter")
        .insert(chatter, ["*"])
        .transacting(trx)
        .onConflict("email")
        .merge();
      await pg("chatter_organization").transacting(trx).insert({
        chatter_id: c.id,
        organization_id: organizationId,
        role: "general_noodlr",
      });
    });
  } catch (err) {
    return { error: { message: "failed to create chatter" } };
  }
  return { data: c };
};

const getByOrgId = async (orgId) => {
  let c;
  try {
    c = await pg
      .select("c.id", "c.full_name", "co.role", "c.interest", "c.email")
      .from("chatter_organization as co")
      .join("chatter as c", "co.chatter_id", "c.id")
      .where({ organization_id: orgId });
    return { data: c };
  } catch (err) {
    return { error: { message: "invalid organization ID" } };
  }
};


module.exports = {
  create,
  getByOrgId,
};
