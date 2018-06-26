var {Todo} = require('../server/models/todo.js');
var {User} = require('../server/models/user.js');
var {mongoose} = require('../server/db/mongoose.js');
var {ObjectID} = require('mongodb');

var id = '5b30b0762aec771423797de6';

if(!ObjectID.isValid(id)){
  return console.log('Invalid todo objectID');
}

Todo.find({_id:id}).then((docs) => {
  console.log('find:',docs);
}).catch((e) => {
  console.log('find failed');
});


Todo.findOne({_id:id}).then((doc) => {
  console.log('findOne:',doc);
}).catch((e) => {
  console.log('findOne failed');
});

Todo.findById(id).then((doc) => {
  if(!doc){
    console.log('Id not found');
  }else{
    console.log('findById:',doc);
  }
}).catch((err) => {
  console.log('findById failed');
});

var id = '5b2caf7842452b0dc22d606e';

if(!ObjectID.isValid(id)){
  return console.log('Invalid user objectID');
}

User.find({_id:id}).then((docs) => {
  console.log('find:',docs);
}).catch((e) => {
  console.log('find failed');
});


User.findOne({_id:id}).then((doc) => {
  console.log('findOne:',doc);
}).catch((e) => {
  console.log('findOne failed');
});


User.findById(id).then((doc) => {
  if(!doc){
    console.log('Id not found');
  }else{
    console.log('findById:',doc);
  }
}).catch((err) => {
  console.log('findById failed');
});

