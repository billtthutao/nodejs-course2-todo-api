const request = require('supertest');
const expect = require('expect');
var {Todo} = require('./../models/todo.js');
var {app} = require('./../server.js');

var todos = [{text:'first todo test'},
             {text:'second todo test'}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then((docs) => {
    //console.log(docs);
    done();
  }).catch((e) => done(e));
});

describe('Server POST /todos',() => {
  it('should create a new todo',(done) => {  
    var text = 'New added todo';
    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((response) => {
      expect(response.body.text).toBe(text);
    })
    .end((err,response) => {
      if(err){
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => {done(e);});
    });
  });
});

describe('Server POST /todos with bad data',() => {
  it('should not create a new todo',(done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err,response) => {
      if(err){
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => {done(e);});
    });
  });
});

describe('Server GET /todos',() => {
  it('should return todos',(done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((response) => {
      expect(response.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

