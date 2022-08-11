const pg = require("../db/client.js").pg;

const create = async (orgData) => {
  let o;
  try {
    [o] = await pg("organization")
      .insert(orgData)
      .returning(["name", "id", "contact_name", "contact_email"]);
  } catch (err) {
    return { error: { message: "failed to create organization" } };
  }
  o.signupUrl = "https://noodln.com/signup/" + o.id;
  return { data: o };
};

const getById = async (id) => {
  let o;
  try {
    [o] = await pg("organization").select("id", "name").where({ id: id });
  } catch (err) {
    return { error: { message: "invalid organization" } };
  }
  return { data: o };
};

module.exports = {
  getById,
  create,
};
