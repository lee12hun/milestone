
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');


var Cat = mongoose.model("User", {name:String});

var kitty = new Cat({name:"kitty"});

kitty.save(function(err){
	if(err)		throw err;
	else{
		console.log('저장 성공!')
	}
});


// var options = {
//   db: { native_parser: true },
//   server: { poolSize: 5 },
//   replset: { rs_name: 'myReplicaSetName' },
//   user: 'lee12hun',
//   pass: '1234'
// }
// mongoose.connect("mongodb://locahost/test", option);




//var mongo = mongoose.mongo;



//var db = mongo.connection;



//var datastore = require('./datastore.js');