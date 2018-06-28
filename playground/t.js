var walk = (a) => {
  return new Promise((resolve,reject) => { 
    console.log('original',a);
    resolve(a+1);
  });
};

var a= 1;

var x = walk(a).then((a) => {
  return new Promise((resolve,reject) => {
  setTimeout(() => {
    console.log('one:first then starts',a);
    resolve(a+1);
  },1000);
  });
}).then((a) => {
  console.log('one:second then starts',a);
}).catch((e) => console.log(e));


var y = walk(a).then((a) => {
  console.log('two: first then',a);
  return a+1;
}).then((a) => {
  console.log('two: second then',a);
}).then(() => {
  console.log('two: third then, no args');
}).catch((err) => {
  console.log(err);
});
