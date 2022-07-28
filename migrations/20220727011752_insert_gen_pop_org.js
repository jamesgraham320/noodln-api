/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  let org_id = await knex("organization").insert(
    {
      name: "general Noodls",
      contact_email: "james@imonsmalltalk.com",
      noodln_time: 12,
      contact_name: "JJ Graham",
      timezone: "America/New_York",
    },
    ["id"]
  );
  let chatterIds = await knex("chatter").select("id");
  let chatters_organizations = chatterIds.map((chatterId) => {
    let newChatterOrg = {
      chatter_id: chatterId.id,
      organization_id: org_id[0].id,
      role: "general_noodlr",
    };
    return newChatterOrg;
  });
  return knex("chatter_organization").insert(chatters_organizations);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.raw("DELETE FROM organization WHERE id > 0");
  return knex.raw("DELETE FROM chatter_organization WHERE id > 0");
};
