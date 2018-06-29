var {SHA256} = require('crypto-js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

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
console.log(token);

var decode = jwt.verify(token,'123abc');
console.log(decode);

console.log('start');
var password = '123abc!';

bcrypt.genSalt(10)
.then((salt) => {
  console.log('salt',salt);
  console.log('password',password);
  return bcrypt.hash(password,salt);
}).then((hashedPassword) => {
  console.log('hashedPassword',hashedPassword);
  return bcrypt.compare(password,hashedPassword);
}).then((res) => {
  console.log('compare result',res);
}).catch((err) => {
  console.log(err);
});

