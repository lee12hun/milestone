var express = require('express');
var db = require('./innerdata/database');
var router = express.Router();

function sendJSON( log, res, item ) 
{
	console.log(log , item )
	res.writeHead(200,{'Content-Type':'application/json'});
	res.end( JSON.stringify( item ) );
};

router.post('/signup', function(req, res, next) {
	db.SignUp.create( req.body , function( err, item ){	
		if( err ){
			console.log('error create = ', err );
			//return handleError(err);
		}
		else{
			sendJSON( "Success ITEM : ", res , item );
		}
	});
	res.send("end");
});

/* GET home page. */
router.get('/page/:page_number', function(req, res, next) {

	consoel.log( "req.params : " , req.params );

	db.PageList.findOne( req.params ,function(err,data){
		if( err ){
			sendJSON("Error Page", res, {"RESULT":false , "RESULT_MSG":err} );
		}			
		else{
			sendJSON("Success Page", res, {"RESULT":true, "CONTENTS":data} );
		}
	});

	res.send("end");
});

router.post('/page/write', function(req, res, next) {

	console.log(req.body);

	/*
		PAGELIST
		
		user_id
		title
		contents
		img_path

	*/

	db.PageList.create( req.body , function( err, item ){	

		if( err ){			
			sendJSON("Error Page", res, {"RESULT":false , RESULT_MSG:err} );
		}
		else{
			sendJSON( "Success Page", res, {"RESULT":true} );
		}
	});	
});


router.post('/page/fix', function(req, res, next) {

	console.log(req.body);

	/*
		PAGELIST
		
		page_uid  // page_number
		user_id
		title
		contents
		img_path

	*/

	db.PageList.findOneAndUpdate( {page_number:req.body.page_number}, req.body, function(err, data, raw){
    	console.log(err);
    	console.log(data);
    	console.log(raw);

    	if( err ){			
			sendJSON("Error Page", res, {"RESULT":false , "RESULT_MSG":err} );
		}
		else{
			sendJSON( "Success Page", res, {"RESULT":true} );
		}
	});

	/*
	db.PageList
	.findOne(req.body.page_number)//.findOne(req.body.page_uid)
	.select(req.body)
	.exec(function(err,doc){
		if(err){
			console.log(err);
		}
		else{				
			console.log( "PRE ", doc  );

			doc = req.body;

			console.log( "POST" , doc  );

			//  doc.save() Error 만들어진 객체가 조건의 만족하는 객체가 생성되어서 save() 함수가 없다. 
			doc.save(function(err){  
				if(err){
					console.log("ERR" , err );
				}
				else{
					res.writeHead(200,{'Content-Type':'application/json'});
					res.end(JSON.stringify({'Success ITEM':doc}));
				}
			});
		}				
	});
	*/
});

router.post('/page/delete', function(req, res, next) {

	console.log(req.body);

	/*	
		PAGELIST
		
		signup_uid // page_number
		user_id
	*/

	db.PageList
	.findOne({ page_number: req.body.page_number , user_id : req.body.user_id })
	.exec(function(err,doc){
		if(err){
			console.log(err);
		}
		else{
			console.log(doc);				

			doc.remove(function(err){
				if(err){
					console.log("ERR" , err );
					res.send("end");
				}					
				else{
					res.send("end" , doc);
				}
			});
		}			
	});	
	//res.send("end");
});


router.post('/reply/insert', function(req, res, next) {

	console.log(req.body);

	/*	
		PAGELIST
		
		page_uid // page_number

		replylist : {
			user_id
			contents
		}
	*/

	db.PageList
	.findOne({ page_number: req.body.page_number })
	.exec(function(err,doc){
		if(err){
			console.log(err);
		}
		else{				
			// 댓글별 auto _increment 추가 
			var replyObject = req.body.replylist;
			replyObject.reply_number = doc.Replyincrement++;
			console.log("replyObject : ",replyObject);

			doc.Replylist.push(replyObject);

			doc.save(function(err){
				if( err ){			
					sendJSON("Error Page", res, {"RESULT":false , "RESULT_MSG":err} );
				}
				else{
					sendJSON( "Success Page", res, {"RESULT":true} );
				}
			});
		}		
	});
});


router.post('/replay/delete', function(req, res, next) {

	console.log(req.body);
	//console.log(db.Database.collections);

	///////////////////////////////////////////////////////////////////////
	// save or create
	
	db.PageList
	.findOne({ user_id: 'lee@test.com' })
	.exec(function(err,doc){
			if(err){
				console.log(err);
			}
			else{
				console.log(doc);

				// var id = req.body.unique_id;
				// console.log(id);
/*
				for(var index = 0 ; index < doc.replylist.length ; index++){					
					if( item.user_id;
				}

				doc.replylist.some( function( item ){
					var result = item.user_id;

					if( result ){
						doc.replylist.splice(  )
					}
					
					return result;
				} ); 

				doc.save(function(err){
					if(err)
						console.log("ERR" , err );

				});
	*/
			}		
	});
	
	res.end("end");
});


router.post('/search', function(req, res, next) {

	//console.log("db.PageList" , db.PageList);

	var searchValue = req.body.a;

	db.PageList.find( {"title": {'$regex':searchValue}}, {'_id':false},function( err, data ){
		console.log(data);
	});

	res.send('aaaa');
	
});




module.exports = router;


