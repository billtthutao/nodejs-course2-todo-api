var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var bcryptjs = require('bcryptjs');

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

  return _.pick(userObject,['_id','email']);
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  try{
    var decoded = jwt.verify(token,'abc123');
  }catch(e){
  //add error handle
   // return Promise.reject(e);
   return new Promise((resolve,reject) => {
     reject();
     //reject(e);
   });
  }

  return User.findOne({'_id':decoded._id,
             'tokens.access':'auth',
             'tokens.token':token
  });
}

UserSchema.statics.findByCredentials = function (email,password) {
  return User.findOne({email}).then((user) => {
      if(!user){
        return Promise.reject();
      }

      return new Promise((resolve,reject) => {
        bcryptjs.compare(password,user.password,(err,res) => {
        //console.log(res);
          if(res){
            resolve(user);
          }else{
            reject('Invalid password!');
          }
        });
      });
  });
};

//setup middleware for Model.save()
UserSchema.pre('save',function (next) {
  var user = this;
  
  if(user.isModified('password')){
    bcryptjs.genSalt(10)
    .then((salt) => {
      //console.log(salt);
      return bcryptjs.hash(user.password,salt);
    }).then((hashedPassword) => {
      //console.log(hashedPassword);
      user.password = hashedPassword;
      next();
    }).catch((err) => {
      console.log(err);
    });
  }else {
    next();
  }
});

var User = mongoose.model('User',UserSchema);

module.exports={User};
