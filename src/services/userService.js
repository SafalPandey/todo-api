import Boom from 'boom';
import User from '../models/user';

/**
 * Get all users.
 *
 * @return {Promise}
 */
export function getAllUsers(pageNumber) {
  return User.fetchPage({
    withRelated: ['todos'],
    pageSize: 10,
    page: pageNumber
  }).then(users => {
    if (users.models.length === 0) {
      throw new Boom.notFound('Users not found');
    }

    return {
      data: users.models,
      metadata: {
        totalCount: users.pagination.rowCount,
        nextPage:
          users.pagination.pageCount - users.pagination.page <= 0
            ? null
            : users.pagination.page + 1,
        prevPage: users.pagination.page <= 1 ? null : users.pagination.page - 1
      }
    };
  });
}

/**
 * Get a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function getUser(id) {
  return new User({ id }).fetch({ withRelated: ['todos'] }).then(user => {
    if (!user) {
      throw new Boom.notFound('User not found');
    }

    return user;
  });
}

/**
 * Create new user.
 *
 * @param  {Object}  user
 * @return {Promise}
 */
export function createUser(user) {
  return new User({
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    password: user.password,
    hobby: user.hobby,
    email: user.email
  })
    .save()
    .then(user => user.refresh());
}

/**
 * Update a user.
 *
 * @param  {Number|String}  id
 * @param  {Object}         user
 * @return {Promise}
 */
export function updateUser(id, user) {
  return new User({ id })
    .save(
      { firstname: user.firstname, lastname: user.lastname, hobby: user.hobby },
      { method: 'update' }
    )
    .then(user => user.refresh());
}

/**
 * Delete a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function deleteUser(id) {
  return new User({ id }).fetch().then(user => user.destroy());
}
