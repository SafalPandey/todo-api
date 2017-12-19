import bookshelf from '../db';
import Tag from './tag';

const TABLE_NAME = 'todos';

/**
 * User model.
 */
class Todo extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }

  tags() {
    return this.belongsToMany(Tag)
  }

  users() {
    return this.belongsTo(User)
  }
}

export default Todo;
