//const mongoClient = require('mongodb').MongoClient;
//console.log(require('mongodb'));
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) =>{
  if(err){
    return console.log('Unable connect to mongodb server');
  }

  console.log('Connect to mongodb server');
  
  //db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result) => {
  //  console.log(result);
  //}, (err) => {
  //  console.log('Unable to deleteMany from Todos',err);
  //});

  //db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result) => {
  //  console.log(result);
  //}, (err) => {
  //  console.log('Unable to deleteOne from Todos',err);
  //});

  db.collection('Todos').findOneAndDelete({completed:false}).then((result) => {
    console.log(result);
  }, (err) => {
    console.log('Unable to findOneAndDelete from Todos',err);
  });
  
  db.close();
});
