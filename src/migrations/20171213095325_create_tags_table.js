/**
 * Create tags table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('tags', table => {
    table.increments('id').primary();
    table.string('tag').notNull();
  });
}

/**
 * Drop tags table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('tags');
}
