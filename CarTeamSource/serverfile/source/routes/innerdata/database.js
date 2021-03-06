
'use strict';

var mongoose = require('mongoose');
var autoincrement = require('mongoose-auto-increment');

mongoose.connect('mongodb://localhost/carDB');

var db = mongoose.connection;

autoincrement.initialize(db);

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

var SIGNUP = mongoose.Schema({	
	signup_uid:Schema.Types.ObjectId,
	signup_number:Number,
	user_id:String,
	user_pw:String,
	car_name:String,
	car_career:Number,
	updated:{type:Date, default: Date.now }	
});

//var SignUpCollection = mongoose.model('SignUp', SignUp, 'SignUp');
SIGNUP.plugin(autoincrement.plugin, {
	model : 'SignUp',
	field : 'signup_number',
	startAt : 0,
	incrementBy: 1
});
exports.SignUp = mongoose.model('SignUp', SIGNUP, 'SignUp');

/*
var REPLY = mongoose.Schema({
	reply_uid:Schema.Types.ObjectId,
	reply_number:Number, // test increment 
	user_id:String,
	contents:String,
	updated:{type:Date, default: Date.now }	
},{collection:"Reply"});

REPLY.plugin(autoincrement.plugin, {
	model : 'Reply',
	field : 'reply_number',
	startAt : 0,
	incrementBy: 1
});
mongoose.model('Reply', REPLY);
*/
var PAGELIST = mongoose.Schema({
	page_uid:Schema.Types.ObjectId,
	page_number:Number,
	user_id:String,
	//title:{type:String,validate:NameAlphabeticValidator},
	title:String,
	contents:String,
	img_path:String,	
	replylist:[{
			reply_uid:Schema.Types.ObjectId,
			reply_number:{type:Number, default:0} , // test increment 
			user_id:String,
			contents:String,
			updated:{type:Date, default: Date.now }	
	}],
	replyincrement:{type:Number, default:0},
	updated:{type:Date, default: Date.now }	
}, {collection:"PageList"});

//var PageListCollection = mongoose.model('PageList', SignUp);
PAGELIST.plugin(autoincrement.plugin, {
	model : 'PageList',
	field : 'page_number',
	startAt : 0,
	incrementBy: 1
});

exports.PageList = mongoose.model('PageList', PAGELIST);

/////////////////////////////////////////////////////////////////////////
// define validator  // http://bcho.tistory.com/890

function NameAlphabeticValidator(val){
    return val.match("^[a-zA-Z\(\)]+$");
}

function MemoLengthValidator(val){
    if(val.length>10) return null;
    return val;
}

////////////////////////
// example

// schema definition with validation
// var MemoSchema= mongoose.Schema({
//     username:{type:String,validate:NameAlphabeticValidator}
//     ,memo:{type:String,validate:[
//                     {validator:MemoLengthValidator,msg:'memo length should be less than 10'},
//                     {validator:NameAlphabeticValidator,msg:'PATH `{PATH}` should be alphabet only. Current value is `{VALUE}` '}
//                     ]}
// });

