import bookshelf from '../db';
import User from './user';

const TABLE_NAME = 'sessions';

/**
 * User model.
 */
class Session extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }
  user(){
    return this.belongsTo(User)
  }

}

export default Session;
