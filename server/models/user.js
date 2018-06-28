var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    trim:true,
    minlength:1,
    unique:true,
    validate:{
      validator:validator.isEmail,
      message:'Invalid email address'
    }
  },
  password:{
    type:String,
    required:true,
    trim:true,
    minlength:6
  },
  tokens:[
    {
      access:{
        type:String,
        require:true
      },
      token:{
        type:String,
        require:true
      }
    }
  ]
});

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';

  var token = jwt.sign({_id: user._id.toHexString(),access},'abc123').toString();

  
  user.tokens.push({access,token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.toJSON = function () {
  var user = this;
  //var userObject = user.toObject();
  var userObject = user;

  return _.pick(userObject,['email','password']);
};

var User = mongoose.model('User',UserSchema);

module.exports={User};
