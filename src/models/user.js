import bookshelf from '../db';
import Session from './session';
import Todo from './todo';

const TABLE_NAME = 'users';

/**
 * User model.
 */
class User extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }

  session(){
    return this.hasOne(Session)
  }

  todos(){
    return this.hasMany(Todo)
  }
}

export default User;
