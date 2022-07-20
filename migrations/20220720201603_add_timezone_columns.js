/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('chatters', 
    function(t) {
      t.string('timezone').defaultTo('America/New_York');
      t.string('last_accessed_ip');
      t.string('city');
    }
  )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('chatters', 
    function(t) {
      t.dropColumns('timezone', 'last_accessed_ip', 'city');
    }
  )
  
};
