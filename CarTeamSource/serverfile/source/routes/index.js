var express = require('express');
var db = require('./innerdata/database');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	res.render('index', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {

	console.log(req.body);
	//console.log(db.Database.collections);

	///////////////////////////////////////////////////////////////////////
	// save or create

	db.SignUp.create( req.body , function( err, item )
	{	
		if( err ){
			console.log('error create = ', err );
			//return handleError(err);
		}
		else{
			console.log('create sucess ',item );
			//res.end(JSON.stringify());
			res.writeHead(200,{'Content-Type':'application/json'});
			res.end(JSON.stringify({'Success ITEM':item}));
		}
	});

	// var person = new db.SignUp( signup );

	// person.save( function( err ) {
	// 	if( err ){
	// 		console.log('error save = ' + err );
	// 	}
	// 	else{
	// 		// SignUpCollection.find({})
	// 		// .populate('user_id')
	// 		// .populate('test_comments.postedBy')
	// 		// .exec(function(err,item){
	// 		// 	console.log( JSON.stringify(item, null, "\t"));
	// 		// });
	// 	}
	// });

});


router.post('/pageWrite', function(req, res, next) {

	console.log(req.body);
	//console.log(db.Database.collections);

	///////////////////////////////////////////////////////////////////////
	// save or create

	console.log("db.PageList" , db.PageList);

	db.PageList.create( req.body , function( err, item )
	{	
		if( err ){
			console.log('error create = ', err );
			//return handleError(err);
		}
		else{
			console.log('create sucess ',item );
			//res.end(JSON.stringify());
			res.writeHead(200,{'Content-Type':'application/json'});
			res.end(JSON.stringify({'Success ITEM':item}));
		}
	});
});


router.post('/replay/insert', function(req, res, next) {

	console.log(req.body);
	//console.log(db.Database.collections);

	///////////////////////////////////////////////////////////////////////
	// save or create

	db.PageList.find( req.body.user_id )

	db.PageList.create( req.body , function( err, item )
	{	
		if( err ){
			console.log('error create = ', err );
			//return handleError(err);
		}
		else{
			console.log('create sucess ',item );
			//res.end(JSON.stringify());
			res.writeHead(200,{'Content-Type':'application/json'});
			res.end(JSON.stringify({'Success ITEM':item}));
		}
	});
});

module.exports = router;


