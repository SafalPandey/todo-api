/**
 * Create sessions table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('sessions', table => {
    table.increments('id').primary();
    table.integer('user_id').references('users.id').unique().onDelete('CASCADE').notNull();
    table.string('refresh_token').notNull();
  });
}

/**
 * Drop sessions table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('sessions');
}
