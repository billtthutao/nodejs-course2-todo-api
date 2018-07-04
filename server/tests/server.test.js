const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');
const _ = require('lodash');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id',() => {
  it('should delete todo by id', (done) => {
    var hexID = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexID}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexID)
    })
    .end((err,res) => {
      if(err){
        return done(err);
      }

     Todo.findById(hexID).then((todo) => {
       expect(todo).toNotExist();
       done();
     }).catch((err) => {
       done(err);
     });
    });
  });

 it('should return 404 if todo not found to delete', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids while delete', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
 
});


describe('Patch /todos/:id', () => {
  it('should update todo with completed = true', (done) => {
    var hexID = todos[1]._id.toHexString();
    var newTodo = {text: 'updated from test', completed:true};
    request(app)
    .patch(`/todos/${hexID}`)
    .send(newTodo)
    .expect(200)
    .expect((response) => {
      expect(response.body.todo._id).toBe(hexID);
    })
    .end((err,res) => {
      if(err){
        done(err);
      }

      Todo.findById(hexID).then((todo) => {
        expect(todo.text).toBe(newTodo.text);
        expect(todo.completed).toBe(true);
        expect(todo.completedAt).toBeA('number');
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

it('should update todo with completed = false', (done) => {
    var hexID = todos[1]._id.toHexString();
    var newTodo = {text: 'updated from test', completed:false};
    request(app)
    .patch(`/todos/${hexID}`)
    .send(newTodo)
    .expect(200)
    .expect((response) => {
      expect(response.body.todo._id).toBe(hexID);
    })
    .end((err,res) => {
      if(err){
        done(err);
      }

      Todo.findById(hexID).then((todo) => {
        expect(todo.text).toBe(newTodo.text);
        expect(todo.completed).toBe(false);
        expect(todo.completedAT).toNotExist();
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
});

describe('GET /users/me', () => {
  it('should return authorized user',(done) => {
    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((response) => {
      expect(response.body._id).toBe(users[0]._id.toHexString());
      expect(response.body.email).toBe(users[0].email);
    })
    .end(done)
  });
 
  it('should return 401 with unauthorized user',(done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((response) => {
      expect(response.body).toEqual({});
    })
    .end(done)
  });
});

describe('POST /users', () => {
  it('should create a user',(done) => {
    var email = 'example@163.com';
    var password = '123mnb';

    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((response) => {
      expect(response.headers['x-auth']).toExist();
      expect(response.body._id).toExist();
      expect(response.body.email).toBe(email);
    })
    .end((err) => {
      if(err){
        return done(err);
      }

      User.find({email}).then((user) => {
        expect(user).toExist(); 
        expect(user.password).toNotBe(password);
        done();
      });
    });
  });

  it('should not create user with invalid email',(done) => { 
    request(app)
    .post('/users')
    .send({email:'and',password:'1'})
    .expect(400)
    .end(done);
  });
 
  it('should not create user if email is in use',(done) => { 
    request(app)
    .post('/users')
    .send(users[0])
    .expect(400)
    .end(done);
  });
});

describe('POST /users/login',() => {
  it('should login successfully',(done) => {
    var body = _.pick(users[1],['email','password']);
    request(app)
    .post('/users/login')
    .send(body)
    .expect(200)
    .expect((response) => {
      expect(response.header['x-auth']).toExist();
    })
    .end((err,res) => {
      if(err){
       return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[0]).toInclude({
          access:'auth',
          token:res.header['x-auth']
        });
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  it('should login failed',(done) => {
    request(app)
    .post('/users/login')
    .send({email:users[1].email,
           password:users[1].password+'1'})
    .expect(400)
    .expect((response) => {
      expect(response.header['x-auth']).toNotExist();
    })
    .end((err,res) => {
      if(err){
        return done(err);
      }
      
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
});

describe('DELETE /users/logout/token', () => {
  it('should logout successfully',(done) => {
    request(app)
    .post('/users/logout/token')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .end((err,res) => {
      if(err){
        return done(err);
      }

      User.findById(users[0]._id).then((user) => {
        expect(user.tokens).toNotInclude({access:'auth',
                                          token:users[0].tokens[0].token});
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  it('should not logout with invalid token',(done) => {
    request(app)
    .post('/users/logout/token')
    .set('x-auth','xxxxx')
    .expect(401)
    .end(done);
  });
});
