
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tags_todos', table => {
    table.increments();

    table.integer('todo_id').references('todos.id').onDelete('CASCADE').notNull();
    table.integer('tag_id').references('tags.id').onDelete('CASCADE').notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tags_todos')

};
