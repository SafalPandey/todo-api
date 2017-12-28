import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/index';
import bookshelf from '../../src/db';

let id;
let userId;
/**
 * Tests for '/api/todos'
 */
describe('Todos Controller Test', () => {
  before(done => {
    bookshelf
      .knex('todos')
      .del()
      .then(() => done());
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
        userId = data.id;
        done();
      });
  });

  it('should return list of todos', done => {
    request(app)
      .get('/api/users/' + userId + '/todos')
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(404);

        done();
      });
  });

  it('should not create a new todo if todo is not provided', done => {
    let user = {
      notodo: 'Jane Doe'
    };

    request(app)
      .post('/api/users/' + userId + '/todos')
      .send(user)
      .end((err, res) => {
        let { code, message, details } = res.body.error;

        expect(res.statusCode).to.be.equal(400);
        expect(code).to.be.equal(400);
        expect(message).to.be.equal('Bad Request');
        expect(details).to.be.an('array');
        expect(details[0]).to.have.property('message');
        expect(details[0]).to.have.property('param', 'todo');

        done();
      });
  });

  it('should create a new todo with valid data', done => {
    let user = {
      todo: 'test todo'
    };

    request(app)
      .post('/api/users/' + userId + '/todos')
      .send(user)
      .end((err, res) => {
        let { todo } = res.body;

        expect(res.statusCode).to.be.equal(201);
        expect(todo).to.be.an('object');
        expect(todo).to.have.property('id');
        expect(todo).to.have.property('todo');
        expect(todo).to.have.property('created_at');
        expect(todo).to.have.property('updated_at');
        expect(todo.todo).to.be.equal(user.todo);
        id = todo.id;
        done();
      });
  });

  it('should get information of todo', done => {
    request(app)
      .get('/api/users/' + userId + '/todos/' + id)
      .end((err, res) => {
        let { data } = res.body;

        expect(res.statusCode).to.be.equal(200);
        expect(data[0]).to.be.an('object');
        expect(data[0]).to.have.property('id');
        expect(data[0]).to.have.property('todo');
        expect(data[0]).to.have.property('createdAt');
        expect(data[0]).to.have.property('updatedAt');

        done();
      });
  });

  it('should respond with not found error if random todo id is provided', done => {
    request(app)
      .get('/api/users/' + userId + '/todos/1991')
      .end((err, res) => {
        let { code, message } = res.body.error;

        expect(res.statusCode).to.be.equal(404);
        expect(code).to.be.equal(404);
        expect(message).to.be.equal('Todo not found');

        done();
      });
  });

  it('should update a todo if todo is provided', done => {
    let user = {
      todo: 'John Doe'
    };

    request(app)
      .put('/api/users/' + userId + '/todos/' + id)
      .send(user)
      .end((err, res) => {
        let { data } = res.body;

        expect(res.statusCode).to.be.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.have.property('id');
        expect(data).to.have.property('todo');
        expect(data).to.have.property('createdAt');
        expect(data).to.have.property('updatedAt');
        expect(data.todo).to.be.equal(user.todo);

        done();
      });
  });

  it('should not update a todo if todo is not provided', done => {
    let user = {
      notodo: 'John Doe'
    };

    request(app)
      .put('/api/users/' + userId + '/todos/' + id)
      .send(user)
      .end((err, res) => {
        let { code, message, details } = res.body.error;

        expect(res.statusCode).to.be.equal(400);
        expect(code).to.be.equal(400);
        expect(message).to.be.equal('Bad Request');
        expect(details).to.be.an('array');
        expect(details[0]).to.have.property('message');
        expect(details[0]).to.have.property('param', 'todo');

        done();
      });
  });

  it('should delete a todo if valid id is provided', done => {
    request(app)
      .delete('/api/users/' + userId + '/todos/' + id)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(204);

        done();
      });
  });

  it('should respond with not found error if random user id is provided for deletion', done => {
    request(app)
      .delete('/api/users/' + userId + '/todos/1991')
      .end((err, res) => {
        let { code, message } = res.body.error;

        expect(res.statusCode).to.be.equal(404);
        expect(code).to.be.equal(404);
        expect(message).to.be.equal('Todo not found');

        done();
      });
  });

  it('should respond with bad request for empty JSON in request body', done => {
    let user = {};

    request(app)
      .post('/api/users/' + userId + '/todos')
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
