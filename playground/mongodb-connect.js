//const mongoClient = require('mongodb').MongoClient;
//console.log(require('mongodb'));
const {mongoClient,objectID} = require('mongodb');

mongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) =>{
  if(err){
    return console.log('Unable connect to mongodb server');
  }

  console.log('Connect to mongodb server');
  
  db.collection('Todos').insertOne({text:'Something to do',completed:false},
    (err,result) =>{
      if(err){
        return console.log('Unable to insert Todo',err);
      }
      
      console.log(JSON.stringify(result.ops,undefined,2));
  });
  
  db.collection('Users').insertOne({name:'Bill Hu',age:35,location:'WuHan'
  },(err,result) =>{
    if(err){
      return console.log('Unable to insert user',err);
    }
    
    console.log(JSON.stringify(result.ops,undefined,2));
  });

  db.close();
});
