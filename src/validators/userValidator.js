import Joi from 'joi';
import validate from '../utils/validate';
import * as userService from '../services/userService';

const SCHEMA = {
  firstname: Joi.string()
    .label('Firstname')
    .max(90)
    .required(),
  lastname: Joi.string()
    .label('Lastname')
    .max(90)
    .required(),
  username: Joi.string()
    .label('Username')
    .max(90)
    .required(),
  email: Joi.string().email()
    .label('Email')
    .max(90)
    .required(),
  password: Joi.string()
    .label('Password')
    .max(90)
    .required(),
  hobby: Joi.string()
    .label('Hobby')
    .max(90)
    .required()
};
const PUT_SCHEMA = {
  userId: Joi.number()
    .label("User Id")
    .required(),
  firstname: Joi.string()
    .label('Firstname')
    .max(90),
  lastname: Joi.string()
    .label('Lastname')
    .max(90),

  hobby: Joi.string()
    .label('Hobby')
    .max(90)

};
/**
 * Validate create/update user request.
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 * @return {Promise}
 */
function userValidator(req, res, next) {
  return validate(req.body, SCHEMA)
    .then(() => next())
    .catch(err => next(err));
}

function userPutValidator(req, res, next) {
  return validate(req.body, PUT_SCHEMA)
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
function findUser(req, res, next) {
  return userService
    .getUser(req.params.id)
    .then(() => next())
    .catch(err => next(err));
}

export {
  findUser,
  userPutValidator,
  userValidator
};
