import Boom from 'boom';
import Todo from '../models/todo';
import * as tagService from '../services/tagService';
/**
 * Get all todos of a user.
 *
 * @return {Promise}
 */
export function getTodos(userId, pageNumber) {
  return new Todo()
    .query({
      where: {
        user_id: userId
      }
    })
    .orderBy('updated_at', 'DESC')
    .fetchPage({
      withRelated: ['tags'],
      pageSize: 10,
      page: pageNumber
    })
    .then(todos => {
      if (todos.models.length === 0) {
        throw new Boom.notFound('Todos not found');
      }

      return {
        data: todos.models,
        metadata: {
          totalCount: todos.pagination.rowCount,
          nextPage:
            todos.pagination.pageCount - todos.pagination.page <= 0
              ? null
              : todos.pagination.page + 1,
          prevPage:
            todos.pagination.page <= 1 ? null : todos.pagination.page - 1
        }
      };
    });
}

/**
 * Get a todo.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function getTodo(id) {
  return new Todo({
    id
  })
    .fetch()
    .then(todo => {
      if (!todo) {
        throw new Boom.notFound('Todo not found');
      }

      return todo;
    });
}

export function getTodoForUser(userId, todoId) {
  return new Todo()
    .query({
      where: {
        id: todoId,
        user_id: userId
      }
    })
    .fetchAll({ withRelated: ['tags'] })
    .then(todo => {
      // return new Todo().fetch().then(todo => {
      if (todo.length === 0) {
        throw new Boom.notFound('Todo not found');
      }

      return todo;
    });
}

export function searchTodo(userId, query) {
  if (!query.page) {
    query.page = 1;
  }
  let pageNumber = query.page;

  return new Todo()
    .query(qb => {
      qb
        .where('user_id', '=', userId)
        .andWhere('todo', 'LIKE', '%' + query.search + '%')
        .orWhere('description', 'LIKE', '%' + query.search + '%');
    })
    .fetchPage({
      withRelated: ['tags'],
      pageSize: 10,
      page: pageNumber
    })
    .then(todos => {
      if (todos.models.length === 0) {
        throw new Boom.notFound('Todos not found');
      }

      return {
        data: todos.models,
        metadata: {
          totalCount: todos.pagination.rowCount,
          nextPage:
            todos.pagination.pageCount - todos.pagination.page <= 0
              ? null
              : todos.pagination.page + 1,
          prevPage:
            todos.pagination.page <= 1 ? null : todos.pagination.page - 1
        }
      };
    });
}
/**
 * Create new todo.
 *
 * @param  {Object}  todo
 * @return {Promise}
 */
export function createTodo(bodyTodo) {
  return new Todo({
    user_id: bodyTodo.userId,
    todo: bodyTodo.todo,
    description: bodyTodo.description
  })
    .save()
    .then(todo => {
      let relatedTags = bodyTodo.tags;

      return {
        todo: todo,
        tags:
          relatedTags &&
          relatedTags.map(bodyTag => {
            tagService.handleTags(bodyTag).then(tag => {
              todo.tags().attach(tag);

              return tag.refresh();
            });

            return bodyTag;
          })
      };
    });
}

/**
 * Update a todo.
 *
 * @param  {Number|String}  id
 * @param  {Object}         user
 * @return {Promise}
 */
export function updateTodo(id, todo) {
  if (todo.description) {
    return Todo.where({
      id
    })
      .save(
        {
          todo: todo.todo,
          description: todo.description
        },
        { method: 'update' }
      )
      .then(todo => todo.refresh());
  } else {
    return Todo()
      .where({
        id
      })
      .save(
        {
          todo: todo.todo
        },
        { method: 'update' }
      )
      .then(todo => todo.refresh());
  }
}

/**
 * Delete a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function deleteTodo(id) {
  return new Todo({
    id
  })
    .fetch()
    .then(todo => todo.destroy());
}
