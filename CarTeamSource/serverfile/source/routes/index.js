var express = require('express');

var db = require('./innerdata/database.js');
var packet = require('./innerdata/packetmethod.js');

var router = express.Router();


/*

{
    "user_id":"testID",
    "user_pw":"1234"
}

*/
router.post('/login', function(req, res, next) {

	var login = req.body;

	db.SignUp.findOne(req.body, function( err, data){
		console.log( err );
		console.log( data );

		if( packet.checkErrData("login", req.body, res, err, data ) ){

			packet.success("login", res );
		}
	});
});

/*

{
    "user_id":"testID12",
    "user_pw":"1234",
    "car_name":"SONATA",
    "car_career":100
}

*/
router.post('/signup', function(req, res, next) {

	var duplicationcheck = {
		user_id : req.body.user_id
	}

	db.SignUp.findOne(duplicationcheck, function( err, data){
		console.log( err );
		console.log( data );

		if( packet.checkErr("signup", err ) ){

			if( data == null || data == undefined ){ // users already exists with user_id

				db.SignUp.create( req.body , function( err, item ){

					if( packet.checkErrData("signup", req.body, res, err, item ) ){

						packet.success("signup", res );
					}
				});
			}else{				
				sendJSON("Error Page", res, {"RESULT":false , "CONTENTS" :{ "Type":"signup" , "Error_DuplicationID":duplicationcheck} });
			}		
		}
	});	
});


router.get('/page/:page_number', function(req, res, next)
 {

	var page_package = {	
		_id :0,	//page_uid :0,	// database error
		page_number : 1,
		user_id :1,
		title :1,
		contents : 1,
		img_path:1,
		replylist:1
	};	

	// find 1 type
	db.PageList.findOne( req.params , page_package , function( err, pkData ){

		if( packet.checkErrData("page ", req.params, res, err, pkData ) ){

			packet.success("page ", res, pkData );
		}
	});

	// find 2 type
	//db.PageList.findOne( req.params ).select(page_package).exec( function(err,data){
});

/*	client protocol

{
    "user_id" : "testID12",
    "title" : "ABCBDBREEE1234title",
    "contents" : "contnjdkfjklaeji12jkljklsdjilwe23jkl",
    "img_path" : "ajkl.jpeg"
}

*/

router.post('/page/write', function(req, res, next){

	console.log(req.body);

	db.PageList.create( req.body , function( err, item ){
		
		if( packet.checkErrData("page write", req.body, res, err, item ) ){

			packet.success("page write", res );
			//sendJSON( "Success Page", res, {"RESULT":true} );
		}
	});	
});



// form-data type
//router.post('/page/write/upload', filemanager.fileupload );



/*	client protocol
	
	page_uid  // page_number

{
    "page_number":0,
    "title" : "ABCBDBREEE1234title",
    "contents" : "contnjdkfjklaeji12jkljklsdjilwe23jkl",
    "img_path" : "ajkl.jpeg"
}

*/
router.post('/page/fix', function(req, res, next) {

	console.log(req.body);

	db.PageList.findOneAndUpdate( {page_number:req.body.page_number}, req.body, function(err, data, raw){
    	
		if( packet.checkErrData("page fix", req.body, res, err, data ) ){

			packet.success("page fix", res );
		}
	});

	/*	//문제점   doc.save() Error 만들어진 객체가 조건의 만족하는 객체가 생성되어서 save() 함수가 없다.  ( 위 findOneAndUpdate 로 변경 함  )
	db.PageList
	.findOne(req.body.page_number)//.findOne(req.body.page_uid)
	.select(req.body)
	.exec(function(err,doc){
		if(err){
			console.log(err);
		}
		else{		
			doc = req.body;			
			doc.save(function(err){  
				if(err){
					console.log("ERR" , err );
				}
				else{
					sendJSON()
				}
			});
		}				
	});	*/
});


/*	client protocol
	
	signup_uid // page_number

{
    "page_number" : 5,
    "user_id" : "djsfhjlae@test.com"
}
*/
router.post('/page/terminate', function(req, res, next) {

	console.log(req.body);

	db.PageList
	.findOne({ page_number: req.body.page_number , user_id : req.body.user_id })
	.exec(function(err,doc){
		
		if( packet.checkErrData("page terminate", req.body, res, err, doc ) ){

			doc.remove(function(removeErr){

				if( packet.checkErr("page terminate", res, err ) ){

					packet.success("page terminate", res );					
				}
			});
		}	
	});
});


/*	client protocol

	page_uid // page_number

{
    "page_number" : 0,
    "replylist" : {
        "user_id" : "FixId@test.com",
        "contents" : "hahahahahahah!"
    }
}

*/

router.post('/reply/write', function(req, res, next) {

	console.log(req.body);

	db.PageList
	.findOne({ page_number: req.body.page_number })
	.exec(function(err,doc){

		if( packet.checkErrData("reply write", req.body, res, err, doc ) ){

			// 댓글별 auto _increment 추가 
			var replyObject = req.body.replylist;
			replyObject.reply_number = doc.replyincrement++;
			doc.replylist.push(replyObject);

			console.log("replyObject : ",replyObject);

			doc.save(function(save_err){

				console.log( "errerrerr" ,save_err );

				if( packet.checkErr("reply write", res, save_err ) ){

					packet.success("reply write", res );
				}
			});
		}	
	});
});

/*  DELETE
	page_uid  // page_number

{
    "page_number" : "0",
    "replylist" : {
        "reply_number" : "1"
    }
}

*/

router.post('/reply/terminate', function(req, res, next) {

	console.log(req.body);	
	
	db.PageList
	.findOne({ page_number: req.body.page_number })
	.exec(function(err,doc){
		if( packet.checkErrData("reply terminate", req.body, res, err, doc ) ){
			
			var index = 0;
			for( ; index < doc.replylist.length ; index++)
			{
				if( req.body.replylist.reply_number == doc.replylist[index].reply_number ){

					doc.replylist.splice(index,1);
					//delete doc.replylist[index];
					break;
				}
			}
			if( index == doc.replylist.length ){
				// nothing delete item
				sendJSON("Error Page", res, {"RESULT":false , "CONTENTS" :{ "Type":"reply terminate" , "Error_nothingItem":req.body} });
			}
			else{
				doc.save( function(err){

					if( packet.checkErr("reply terminate", err ) ){

						packet.success("reply terminate", res );
					}
				});
			}			
		}		
	});
});

// 검색어의  전체 리스트 갯수 를 전달한다 .
router.get('/search', function(req, res, next){

	var finder = {};
	var selecter = {'_id':false};	
	var order = { sort:{ updated: -1 } };//Sort by Date Added DESC 

	console.log(req.query);

	if( req.query.keyword )
	{
		finder = {"title": {'$regex':req.params.keyword}};
	}

	db.PageList.find( finder,selecter,order)
	.count(function(err,page_totalcount){

		if( packet.checkErrData("search t", req.query, res, err, page_totalcount ) ){

			var packagedata = {
				totalcount : page_totalcount
			};
			
			packet.success("search t", res, packagedata );
		}
    	//sendJSON("Success Page", res, {"RESULT":true , "Contents":page_totalcount } );
    });
});

// 검색어 리스트 전달 
/*  	

{
    "keyword":"",
    "page_count":4
}

*/
router.post('/search', function(req, res, next) {

	var finder = {};		
	if( req.body.keyword )
	{
		finder = {"title": {'$regex':req.body.keyword}};
	}

	// selecter 
	var search_package = {	
		_id :0,	
		page_number : 1,
		title :1
	};
	
	// 정렬 	
	var page_count = parseInt(req.body.page_count);
	var page_viewCount = parseInt(req.body.page_count) + 5;
	
	var order = {
		skip:page_count, // Starting Row
		limit:page_viewCount, // Ending Row
	 	sort:{
	 	 	updated: -1 //Sort by Date Added DESC 
	 	}
	};

	db.PageList.find( finder, search_package, order, function(err,pk){

		if( packet.checkErrData("search", req.body, res, err, pk ) ){

			packet.success("search", res, pk );
		}
	});
});

module.exports = router;