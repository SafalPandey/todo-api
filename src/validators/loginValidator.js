import Joi from 'joi';
import validate from '../utils/validate';
import * as loginService from '../services/loginService';

const SCHEMA = {

  password: Joi.string()
    .label('Password')
    .max(90)
    .required(),
  username: Joi.string()
    .label('username')
    .max(90)
    .required()

};

/**
 * Validate create/update user request.
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 * @return {Promise}
 */
function loginValidator(req, res, next) {
  return validate(req.body, SCHEMA)
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
function findLogin(req, res, next) {

  return loginService
    .getSessionFromToken(req.query.refreshToken)
    .then(() => next())
    .catch(err => next(err));
}

export {
  findLogin,
  loginValidator
};
