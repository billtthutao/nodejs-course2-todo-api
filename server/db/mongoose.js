var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI,(err) => {
  if(err){
    console.log('Unable to connect to mongodb',err);
  } else {
    console.log('Connect to mongodb successfully');
  }
});

module.exports={mongoose};
