/**
 * Create users table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.raw('getdate()'));
    table.timestamp('updated_at').notNull();
    table.string('firstname').notNull();
    table.string('lastname').notNull();
    table
      .string('username')
      .unique()
      .notNull();
    table.string('password').notNull();
    table
      .string('email')
      .unique()
      .notNull();
    table.string('hobby');
  });
}

/**
 * Drop users table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('users');
}
