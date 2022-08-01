/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("chatter_organization").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("chatter_organization", function (t) {
        t.increments("id").unsigned().primary();
        t.dateTime("created_at")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
        t.integer("chatter_id").notNullable();
        t.uuid("organization_id").notNullable();
        t.string("role");
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("chatter_organization");
};
