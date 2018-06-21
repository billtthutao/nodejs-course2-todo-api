//const mongoClient = require('mongodb').MongoClient;
//console.log(require('mongodb'));
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) =>{
  if(err){
    return console.log('Unable connect to mongodb server');
  }

  console.log('Connect to mongodb server');
  
  db.collection('Todos').findOneAndUpdate({
    _id:new ObjectID('5b2b161378349d2e9f7142b3')},{
      $set:{
        completed:true
      }
    },{returnOriginal:false}).then((result) =>{
      console.log(result);
    });

  db.collection('Users').findOneAndUpdate({
    _id:new ObjectID('5b29ba172110080dc9363943')},{
      $set:{name:'Hu Tao'},
      $inc:{age:1}
    },{returnOriginal:false}).then((result) => {
      console.log(result);
  });
  db.close();
});
