


'use strict';

//var mongoose = require("mongoose");
//var config = require("express-config");
  


var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/carDB');

var db = mongoose.connection;

db.on('error', console.error.bind( console, 'connection Error:' ));

db.once('open', function(callback){
	console.log(callback);
	console.log( "connection successful....");
});


// test 
exports.Database = db;


///////////////////////////////////////////////////////////////////////
// Regist Collection  Schema

var Schema = mongoose.Schema;

//unique_id:Schema.Types.ObjectId,
var SIGNUP = mongoose.Schema({	
	unique_id:Schema.Types.ObjectId,
	user_id:String,
	user_pw:String,
	car_name:String,
	car_birth:String,
	updated:{type:Date, default: Date.now }	
});

//var SignUpCollection = mongoose.model('SignUp', SignUp, 'SignUp');
exports.SignUp = mongoose.model('SignUp', SIGNUP, 'SignUp');


var PAGELIST = mongoose.Schema({
	unique_id:Schema.Types.ObjectId,
	user_id:String,
	title:String,
	contents:String,
	img_path:String,
	replylist:[]
}, {collection:"PageList"});

//var PageListCollection = mongoose.model('PageList', SignUp);
exports.PageList = mongoose.model('PageList', PAGELIST);

var ReplyData = {
	unique_id:Schema.Types.ObjectId,
	user_id:String,
	contents:String,
	updated:{type:Date, default: Date.now }	
};

exports.Reply = ReplyData;





