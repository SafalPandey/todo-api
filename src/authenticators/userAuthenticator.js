import User from '../models/user';
import jwt from 'jsonwebtoken';

function authenticateUser(req, res, next) {
  if (req.query.auth) {
    let token = req.query.auth;
    jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, decoded) => {
      if (!err) {
        if(decoded.userId == req.body.userId) next();
        else {
          res.json({
            error: {
              code: 401,
              message: "Invalid User Token!!! "
            }
          });
        }
      } else {
        res.json({
          error: {
            code: 401,
            message: "Invalid Auth Token!!! "
          }
        });
      }
    })
  } else {
    let id = req.body.userId
    new User({
      id
    }).fetch().then(user => {
      if (req.body.password == user.attributes.password) {
        next();
      } else {
        res.json({
          error: {
            code:401,
            message: "Invalid Username or Password!!! "
          }
        });
      }
    })
  }
};

export {
  authenticateUser
}
