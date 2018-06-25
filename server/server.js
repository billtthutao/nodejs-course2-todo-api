var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var express = require('express');
var bodyParser = require('body-parser');

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

app.get('/list',(request,response) => {
  //Todo.find({text:'sent from postman'},(err,doc) =>{
  Todo.find({},(err,doc) =>{
    if(err){
      console.log(err);
    } else {
      response.send(JSON.stringify(doc,undefined,2));
    }
  });
});

app.listen(3000,() => {
  console.log('Server starts up on port 3000');
});

module.exports= {app};
