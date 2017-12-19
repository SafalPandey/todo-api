import {
  Router
} from 'express';
import HttpStatus from 'http-status-codes';
import * as loginService from '../services/loginService';
import {
  findUser,
  userValidator
} from '../validators/userValidator';
import {
  findLogin,
  loginValidator
} from '../validators/loginValidator';
import {
  authenticateUser
} from '../authenticators/userAuthenticator';

const router = Router();

router.post('/', loginValidator, (req, res, next) => {
    loginService.getUser(req.body.username).then((user) => {
      req.user = user;
      req.body.userId = user.id;
      next();
    }).catch((err) => next(err));
  }, authenticateUser,
  (req, res, next) => {
    let token = loginService.createAuth(req.user).then((token) => {
      res.json(token)
    }).catch((err) => res.json({
      code: 403,
      message: err.detail
    }));
  });
router.get('/refresh', findLogin, (req, res, next) => {
  loginService.getSessionFromToken(req.query.refreshToken).then((session) => {
    req.body.userId = session.userId;
    next();
  });
}, (req, res, next) => {
  let token = loginService.createAccessToken(req.body.userId)
  res.json({
    access_token: token
  });

});

router.delete('/', findLogin, (req, res, next) => {
  loginService.getSessionFromToken(req.query.refreshToken).then((session) => {
    req.body.userId = session.userId;
    next();
  });
}, (req, res, next) => {
  loginService.removeSession(req.body).then(() => {
    res.json({
      code: 200,
      message: 'Logged Out Successfully'
    });
  }).catch((err) => res.send(err.detail));
});

export default router;
