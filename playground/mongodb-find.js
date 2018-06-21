//const mongoClient = require('mongodb').MongoClient;
//console.log(require('mongodb'));
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) =>{
  if(err){
    return console.log('Unable connect to mongodb server');
  }

  console.log('Connect to mongodb server');
  
  db.collection('Todos').find({completed:true}).toArray().then((docs) => {
    console.log(JSON.stringify(docs,undefined,2));
  },(err) => {
    console.log('Unable to to find Todos',err);
  });

  db.collection('Users').find().count().then((count) => {
    console.log('The total count of Users is',count);
  }, (err) => {
    console.log('Unable to get count of Users',err);
  });
  db.close();
});
