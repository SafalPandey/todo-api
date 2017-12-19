import {
  Router
} from 'express';
import HttpStatus from 'http-status-codes';
import * as todoService from '../services/todoService';
import {
  findTodo,
  todoValidator
} from '../validators/todoValidator';
import {
  authenticateUser
} from '../authenticators/userAuthenticator';

const router = Router();

router.get('/', (req, res, next) => {
  if (!req.query.page) {
    req.query.page = 1;
  }
  todoService
    .getTodos(req.body.userId, req.query.page)
    .then(data => {
      res.json(
        data
      )
    })
    .catch(err => next(err));
});
router.get('/search', (req, res, next) => {
  if (!req.query.search) {
    res.send('Insert query to search...');
  }

  todoService
    .searchTodo(req.body.userId, req.query)
    .then(data => res.json(
      data
    ))
    .catch(err => next(err));
});


router.get('/:id', (req, res, next) => {
  todoService
    .getTodoForUser(req.body.userId, req.params.id)
    .then(data => res.json({

      data
    }
    ))
    .catch(err => next(err));
});


router.post('/', todoValidator, /*authenticateUser,*/ (req, res, next) => {
  console.log(req.body);
  todoService
    .createTodo(req.body)
    .then(data => {
      // tagsService.addTags(req.body.tags)
      res.status(HttpStatus.CREATED).json(
        data
      )
    })
    .catch(err => next(err));
});

router.put('/:id', findTodo, todoValidator, /*authenticateUser,*/ (req, res, next) => {
  todoService
    .updateTodo(req.params.id, req.body)
    .then(data => res.json({
      data
    }))
    .catch(err => next(err));
});

router.delete('/:id', findTodo, /*authenticateUser,*/ (req, res, next) => {
  todoService
    .deleteTodo(req.params.id)
    .then(data => res.status(HttpStatus.NO_CONTENT).json({
      data
    }))
    .catch(err => next(err));
});

export default router;
