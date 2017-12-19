import Boom from 'boom';
import User from '../models/user';
import Session from '../models/session';
import jwt from 'jsonwebtoken';


export function getUser(username) {
  return new User({
    username: username
  }).fetch().then(user => {
    if (!user) {
      throw new Boom.notFound('User not found');
    }
    let userObj = user.attributes;
    delete userObj.password;
    return userObj;
  });
}

export function getSessionFromToken(refreshToken) {
  return new Session({
    refresh_token: refreshToken
  }).fetch().then(session => {
    if (!session) {
      throw new Boom.notFound('User Session Not Found!');
    }
    return session.attributes;
  })
}

export async function createAuth(user) {
  this.token = {
    refresh_token: jwt.sign({
      email: user.email
    }, process.env.REFRESH_JWT_SECRET, {
      expiresIn: 60 * 60
    }),
    access_token: jwt.sign({
      userId: user.id
    }, process.env.ACCESS_JWT_SECRET, {
      expiresIn: 300
    })

  };

  await new Session({
    user_id: user.id,
    refresh_token: this.token.refresh_token
  }).save().then(session => {
    session.refresh()
  }).catch((err) => {
    throw err;
  });
  return this.token;
}

export async function removeSession(bodySession) {

  return new Session({
    user_id: bodySession.userId
  }).fetch().then(session => {
    session.destroy()
  }).catch((err) => {
    throw err;
  });
}

export function createAccessToken(userId) {
  let token = jwt.sign({
    userId: userId
  }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: 300
  });
  return token;
}
