import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/index';
import bookshelf from '../../src/db';

let id;
/**
 * Tests for '/api/users'
 */
describe('Users Controller Test', () => {
  before(done => {
    bookshelf
      .knex('users')
      .del()
      .then(() => done());
  });

  it('should return list of users', done => {
    request(app)
      .get('/api/users')
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(404);

        done();
      });
  });

  it('should not create a new user if name is not provided', done => {
    let user = {
      noname: 'Jane Doe'
    };

    request(app)
      .post('/api/users')
      .send(user)
      .end((err, res) => {
        let { code, message, details } = res.body.error;

        expect(res.statusCode).to.be.equal(400);
        expect(code).to.be.equal(400);
        expect(message).to.be.equal('Bad Request');
        expect(details).to.be.an('array');
        expect(details[0]).to.have.property('message');
        expect(details[0]).to.have.property('param', 'firstname');

        done();
      });
  });

  it('should create a new user with valid data', done => {
    let user = {
      firstname: 'Safal',
      lastname: 'pandey',
      username: 'safal',
      email: 'as@aa',
      password: 'password',
      hobby: 'abc'
    };

    request(app)
      .post('/api/users')
      .send(user)
      .end((err, res) => {
        let { data } = res.body;

        expect(res.statusCode).to.be.equal(201);
        expect(data).to.be.an('object');
        expect(data).to.have.property('id');
        expect(data).to.have.property('username');
        expect(data).to.have.property('createdAt');
        expect(data).to.have.property('updatedAt');
        expect(data.username).to.be.equal(user.username);
        id = data.id;
        done();
      });
  });

  it('should get information of user', done => {
    request(app)
      .get('/api/users/' + id)
      .end((err, res) => {
        let { data } = res.body;

        expect(res.statusCode).to.be.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.have.property('id');
        expect(data).to.have.property('username');
        expect(data).to.have.property('createdAt');
        expect(data).to.have.property('updatedAt');

        done();
      });
  });

  it('should respond with not found error if random user id is provided', done => {
    request(app)
      .get('/api/users/1991')
      .end((err, res) => {
        let { code, message } = res.body.error;

        expect(res.statusCode).to.be.equal(404);
        expect(code).to.be.equal(404);
        expect(message).to.be.equal('User not found');

        done();
      });
  });

  it('should update a user if name is provided', done => {
    let user = {
      firstname: 'John Doe'
    };

    request(app)
      .put('/api/users/' + id)
      .send(user)
      .end((err, res) => {
        let { data } = res.body;

        expect(res.statusCode).to.be.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.have.property('id');
        expect(data).to.have.property('firstname');
        expect(data).to.have.property('createdAt');
        expect(data).to.have.property('updatedAt');
        expect(data.firstname).to.be.equal(user.firstname);

        done();
      });
  });

  it('should not update a user if name is not provided', done => {
    let user = {
      noname: 'John Doe'
    };

    request(app)
      .put('/api/users/' + id)
      .send(user)
      .end((err, res) => {
        let { code, message, details } = res.body.error;

        expect(res.statusCode).to.be.equal(400);
        expect(code).to.be.equal(400);
        expect(message).to.be.equal('Bad Request');
        expect(details).to.be.an('array');
        expect(details[0]).to.have.property('message');
        expect(details[0]).to.have.property('param', 'noname');

        done();
      });
  });

  it('should delete a user if valid id is provided', done => {
    request(app)
      .delete('/api/users/' + id)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(204);

        done();
      });
  });

  it('should respond with not found error if random user id is provided for deletion', done => {
    request(app)
      .delete('/api/users/1991')
      .end((err, res) => {
        let { code, message } = res.body.error;

        expect(res.statusCode).to.be.equal(404);
        expect(code).to.be.equal(404);
        expect(message).to.be.equal('User not found');

        done();
      });
  });

  it('should respond with bad request for empty JSON in request body', done => {
    let user = {};

    request(app)
      .post('/api/users')
      .send(user)
      .end((err, res) => {
        let { code, message } = res.body.error;

        expect(res.statusCode).to.be.equal(400);
        expect(code).to.be.equal(400);
        expect(message).to.be.equal('Empty JSON');

        done();
      });
  });
});
