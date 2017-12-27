import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as userService from '../services/userService';
import {
  findUser,
  userPutValidator,
  userValidator
} from '../validators/userValidator';
// import { authenticateUser } from '../authenticators/userAuthenticator';

import todosController from './todos';

const router = Router();

/**
 * GET /api/users
 */
router.get('/', (req, res, next) => {
  if (!req.query.page) {
    req.query.page = 1;
  }
  userService
    .getAllUsers(req.query.page)
    .then(data => res.json(data))
    .catch(err => next(err));
});

/**
 * GET /api/users/:id
 */
router.get('/:id', (req, res, next) => {
  userService
    .getUser(req.params.id)
    .then(data =>
      res.json({
        data
      })
    )
    .catch(err => next(err));
});

/**
 * POST /api/users
 */
router.post('/', userValidator, (req, res, next) => {
  userService
    .createUser(req.body)
    .then(data =>
      res.status(HttpStatus.CREATED).json({
        data
      })
    )
    .catch(err => next(err));
});

router.use('/:id', (req, res, next) => {
  req.body.userId = req.params.id;
  next();
});

/**
 * PUT /api/users/:id
 */
router.put(
  '/:id',
  findUser,
  userPutValidator,
  /* authenticateUser,*/ (req, res, next) => {
    userService
      .updateUser(req.params.id, req.body)
      .then(data =>
        res.json({
          data
        })
      )
      .catch(err => next(err));
  }
);

/**
 * DELETE /api/users/:id
 */
router.delete(
  '/:id',
  findUser,
  /* authenticateUser,*/ (req, res, next) => {
    userService
      .deleteUser(req.params.id)
      .then(data =>
        res.status(HttpStatus.NO_CONTENT).json({
          data
        })
      )
      .catch(err => next(err));
  }
);

router.use(
  '/:id/todos',
  findUser,
  (req, res, next) => {
    req.body.userId = req.params.id;
    next();
  },
  todosController
);

export default router;
