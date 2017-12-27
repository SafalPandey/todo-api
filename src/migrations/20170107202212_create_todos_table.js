/**
 * Create users table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('todos', table => {
    table.increments();
    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.raw('getdate()'));
    table.timestamp('updated_at').notNull();
    table
      .integer('user_id')
      .references('users.id')
      .onDelete('CASCADE')
      .notNull();
    table.string('todo').notNull();
    table.string('description');
  });
}

/**
 * Drop users table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('todos');
}
