import Joi from 'joi';
import validate from '../utils/validate';
import * as todoService from '../services/todoService';

const SCHEMA = {
  userId: Joi.string()
    .label('UserId')
    .max(90)
    .required(),
  password: Joi.string()
    .label('Password')
    .max(90),
  todo: Joi.string()
    .label('Todo')
    .max(90)
    .required(),
  description: Joi.string()
    .label('Description'),
  tags: Joi.array()
    .label('Tags Array')
};

const PUT_SCHEMA = {
  userId: Joi.string()
    .label('UserId')
    .max(90)
    .required(),
  password: Joi.string()
    .label('Password')
    .max(90),
  todo: Joi.string()
    .label('Todo')
    .max(90)
    .required(),
  description: Joi.string()
    .allow("")
    .label('Description'),
  tags: Joi.array()
    .label('Tags Array')
};

/**
 * Validate create/update user request.
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 * @return {Promise}
 */
function todoValidator(req, res, next) {
  console.log(req.body);
  if (req.body.description === "") {
    delete req.body.description
  }
  let schema = req.method == 'POST'? SCHEMA : PUT_SCHEMA;
  return validate(req.body, schema)
    .then(() => next())
    .catch(err => next(err));
}

/**
 * Validate users existence.
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 * @return {Promise}
 */
function findTodo(req, res, next) {
  return todoService
    .getTodo(req.params.id)
    .then(() => next())
    .catch(err => next(err));
}

export {
  findTodo,
  todoValidator
};
