var {SHA256} = require('crypto-js');
var jwt = require('jsonwebtoken');

//var message = 'I am user 3';

//console.log(message);
//console.log(SHA256(message).toString());

//var data = {
//  id: 4
//};

//var token = SHA256(JSON.stringify(data)+'somesecret').toString();

//console.log(token);

var data = {
  id: 10
};

var token = jwt.sign(data,'123abc');
//console.log(token);
jwt.sign(data,'123abc').then(() => {
  console.log('xxx');
});


var decode = jwt.verify(token,'123abc');
//console.log(decode);
