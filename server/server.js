require('./config/config.js');
var _ = require('lodash');
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate.js');
var bcrypt = require('bcryptjs');

var port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

app.post('/todos',authenticate,(request,response) => {
  //console.log(request.body);
  var todo = new Todo({text:request.body.text,_creator:request.user._id});
  todo.save().then((doc) => {
  response.send(doc);}, (err) => {
    response.status(400).send(err);
  });
});

app.get('/todos',authenticate,(request,response) => {
  Todo.find({_creator:request.user._id}).then((todos) => {
    response.send({todos});
  }, (err) => {
    response.status(400).send(err);
  });
});

app.get('/todos/:id',authenticate,(request,response) => {
  var id = request.params.id;
  
  if(!ObjectID.isValid(id)){
    return response.status(404).send();
  }

  Todo.findOne({_id:id,_creator:request.user._id}).then((todo) => {
    if(!todo){
      return response.status(404).send();
    }

    response.send({todo});
  }).catch((err) => {
    response.status(404).send(err);
  });
});

app.delete('/todos/:id', authenticate,(request,response) => {
  var id= request.params.id;

  if(!ObjectID.isValid(id)){
    return response.status(404).send();
  }

  Todo.findOneAndDelete({_id:id,_creator:request.user._id}).then((todo) => {
    if(!todo){
      return response.status(404).send();
    }
    
    response.send({todo});
  }).catch((err) => {
    console.log(err);
  });
});

app.patch('/todos/:id', authenticate, (request,response) => {
  var id = request.params.id;
  var body = _.pick(request.body,['text','completed']);

  if(!ObjectID.isValid(id)){
    return response.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){ 
    body.completedAt = new Date().getTime();
  }else {
    body.completedAt = null;
    body.completed = false;
  }
  Todo.findOneAndUpdate({_id:id,_creator:request.user._id},{$set:body},{new:true}).then((todo) => {
    if(!todo){
      return response.status(404).send();
    }

    response.send({todo});
  }).catch((err) => {
    console.log(err);
  });
});

app.post('/users',(request,response) => {
  var body = _.pick(request.body,['email','password']);
  //body.tokens = [{access:'web',token:new ObjectID().toHexString()}];
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    response.header('x-auth',token).send(user.toJSON());
  }).catch((err) => {
    response.status(400).send(err);
  });
});

app.get('/users/me',authenticate,(request,response) => {
  response.send(request.user);
});

app.post('/users/login',(request,response) => {
  var body = _.pick(request.body,['email','password']);
  var email = body.email;
  var password = body.password;

  User.findByCredentials(email,password).then((user) => {
    user.generateAuthToken().then((token) => {
      response.header('x-auth',token).send(user.toJSON());
    })
  }).catch((err) => {
    response.status(400).send(err);
  });
});

app.post('/users/logout/token',authenticate,(request,response) => {
  request.user.removeToken(request.token).then(() => {
    response.status(200).send();
  },() => {
    response.status(400).send();
  });
});

app.listen(port,() => {
  console.log(`Server starts up on port ${port}`);
});

module.exports= {app};
