var express = require('express');
var db = require('./innerdata/database');
var router = express.Router();

function successCheck( reqQuery, res, err, pkData ){

	if(err){
		sendJSON("Error Page", res, {"RESULT":false , "CONTENTS" :{"Error_Database":err} });
		return false; // error
	}
	else if( pkData == null && pkData == undefined ){// json data error 		
		sendJSON("Error Page", res, {"RESULT":false , "CONTENTS" :{"Error_ClientQuery":reqQuery} });
		return false; // error
	}	
	return true; // success 
};

function successCheck2( res, err ){

	if( err ){
		sendJSON("Error Page", res, {"RESULT":false , "CONTENTS" :{"Error_Database":err} });
		return false; // error
	}
	return true; // success 
};


function successPacket(res, pkData){

	if( pkData ){
		sendJSON( "Success Page", res, {"RESULT":true , "CONTENTS":pkData } );	
	}
	else{
		sendJSON( "Success Page", res, {"RESULT":true} );		
	}
	return true;
};


function sendJSON( log, res, item ) 
{
	console.log(log , item )
	res.writeHead(200,{'Content-Type':'application/json'});
	res.end( JSON.stringify( item ) );
	//res.json( item );
};

router.post('/signup', function(req, res, next) {
	db.SignUp.create( req.body , function( err, item ){	
		if( err ){
			console.log('error create = ', err );
		}
		else{
			sendJSON( "Success ITEM : ", res , item );
		}
	});
	res.send("end");
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

		if( successCheck( req.params, res, err, pkData ) ){

			successPacket( res, pkData );
		}
	});

	// find 2 type
	//db.PageList.findOne( req.params ).select(page_package).exec( function(err,data){
});

/*	client protocol
	
	PAGELIST
	
	user_id
	title
	contents
	img_path

*/

router.post('/page/write', function(req, res, next){

	console.log(req.body);

	db.PageList.create( req.body , function( err, item ){
		
		if( successCheck( req.body, res, err, item ) ){

			sendJSON( "Success Page", res, {"RESULT":true} );
		}
	});	
});


/*	client protocol
	
	page_uid  // page_number
	user_id
	title
	contents
	img_path

*/
router.post('/page/fix', function(req, res, next) {

	console.log(req.body);

	db.PageList.findOneAndUpdate( {page_number:req.body.page_number}, req.body, function(err, data, raw){
    	
		if( successCheck( req.body, res, err, data ) ){

			successPacket( res );
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
	user_id
*/
router.post('/page/terminate', function(req, res, next) {

	console.log(req.body);

	db.PageList
	.findOne({ page_number: req.body.page_number , user_id : req.body.user_id })
	.exec(function(err,doc){
		
		if( successCheck( req.body, res, err, doc ) ){

			doc.remove(function(removeErr){

				if( successCheck2( res, err ) ){

					successPacket( res );					
				}
			});
		}	
	});
});


/*	client protocol

	page_uid // page_number

	replylist : {
		user_id
		contents
	}
*/

router.post('/reply/write', function(req, res, next) {

	console.log(req.body);

	db.PageList
	.findOne({ page_number: req.body.page_number })
	.exec(function(err,doc){

		if( successCheck( req.body, res, err, doc ) ){

			// 댓글별 auto _increment 추가 
			var replyObject = req.body.replylist;
			replyObject.reply_number = doc.replyincrement++;
			doc.replylist.push(replyObject);

			console.log("replyObject : ",replyObject);

			doc.save(function(save_err){

				console.log( "errerrerr" ,save_err );

				if( successCheck2( res, save_err ) ){

					successPacket( res );
				}
			});
		}	
	});
});


router.post('/replay/terminate', function(req, res, next) {

	console.log(req.body);
	
	/*  DELETE
		page_uid  // page_number

		replylist : {
			reply_uid // reply_number
		}
	*/
	
	db.PageList
	.findOne({ page_number: req.body.page_number })
	.exec(function(err,doc){
		if( successCheck( req.body, res, err, doc ) ){
			
			var index = 0;
			for( ; index < doc.replylist.length ; index++)
			{
				if( req.body.replylist.reply_number == doc.replylist[index].reply_number ){

					console.log("pre delete " , doc.replylist);
					doc.replylist.splice(index,1);
					//delete doc.replylist[index];
					console.log("post delete " , doc.replylist);
					break;
				}
			}

			console.log("index",index);

			doc.save( function(err){
				if( successCheck2( err ) ){
					successPacket( res );
				}
			});		
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

		if( successCheck( req.query, res, err, page_totalcount ) ){

			successPacket( res, page_totalcount );
		}
    	//sendJSON("Success Page", res, {"RESULT":true , "Contents":page_totalcount } );
    });
});

// 검색어 리스트 전달 
/*  	
	keyword
	page_count
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

		if( successCheck( req.body, res, err, pk ) ){

			successPacket( res, pk );
		}
	});
});

module.exports = router;