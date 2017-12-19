import bookshelf from '../db';
import Todo from './todo';

const TABLE_NAME = 'tags';

/**
 * User model.
 */
class Tag extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }

  todos(){
    return this.belongsToMany(Todo)
  }

}

export default Tag;
