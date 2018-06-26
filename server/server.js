var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var app = express();

app.use(bodyParser.json());

app.post('/todos',(request,response) => {
  //console.log(request.body);
  var todo = new Todo({text:request.body.text});
  todo.save().then((doc) => {
  response.send(doc);}, (err) => {
    response.status(400).send(err);
  });
});

app.get('/todos',(request,response) => {
  Todo.find({}).then((todos) => {
    response.send({todos});
  }, (err) => {
    response.status(400).send(err);
  });
});

app.get('/todos/:id',(request,response) => {
  var id = request.params.id;
  
  if(!ObjectID.isValid(id)){
    return response.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      return response.status(404).send();
    }

    response.send({todo});
  }).catch((err) => {
    response.status(404).send(err);
  });
});

app.listen(3000,() => {
  console.log('Server starts up on port 3000');
});

module.exports= {app};
