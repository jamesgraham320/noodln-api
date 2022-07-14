/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex, Promise) {
  return knex.schema.createTable('chatters', 
    function(t) {
      t.increments('id').unsigned().primary();
      t.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
      t.string('full_name').notNullable();
      t.string('interest').notNullable();
      t.string('email').notNullable();
      t.boolean('subscribed').notNullable().defaultTo('true');
    }
  )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('chatters');
  
};
