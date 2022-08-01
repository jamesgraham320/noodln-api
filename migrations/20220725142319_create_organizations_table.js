/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  return knex.schema.hasTable("organization").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("organization", function (t) {
        t.uuid("id")
          .primary()
          .notNullable()
          .unique()
          .defaultTo(knex.raw("uuid_generate_v4()"));
        t.dateTime("created_at")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
        t.string("name").notNullable();
        t.string("contact_email").notNullable();
        t.string("contact_name").notNullable();
        t.integer("noodln_time").notNullable().defaultsTo(12);
        t.string("timezone").defaultTo("America/New_York");
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("organization");
};
