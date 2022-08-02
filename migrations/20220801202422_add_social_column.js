/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('chatter', 
    function(t) {
      t.string('social_link');
      t.string('email').unique().alter();
    }
  )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('chatter', 
    function(t) {
      t.dropColumns('social_link');
    }
  )
  
};
