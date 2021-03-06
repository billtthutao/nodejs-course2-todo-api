const {ObjectID} = require('mongodb');
const {Todo} = require('../../models/todo.js');
const {User} = require('../../models/user.js');

var jwt = require('jsonwebtoken');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator:userOneId
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator:userTwoId
}];

const users = [{
  _id: userOneId,
  email: 'bill1@163.com',
  password:'userOnePsw',
  tokens:[{access:'auth',
           token: jwt.sign({_id:userOneId,access:'auth'},process.env.JWT_SECRET).toString()
          }]
  
},{_id:userTwoId,
   email:'bill2@163.com',
   password:'userTwoPsw',
   tokens:[{access:'auth',
           token: jwt.sign({_id:userTwoId,access:'auth'},process.env.JWT_SECRET).toString()
          }]
}];

var populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
}
 
var populateUsers = (done) => {
  User.remove({}).then(() => {
    //return User.insertMany(users);
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne,userTwo]);
  }).then(() => done());
}

module.exports = {todos,populateTodos,users,populateUsers};
