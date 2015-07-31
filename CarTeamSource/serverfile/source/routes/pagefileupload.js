var express = require('express');

var fs = require('fs');
var aws = require('aws-sdk');	

aws.config.region = "ap-northeast-1";
aws.config.accessKeyId = "AKIAI7OVYRRKVFL5LUUA";
aws.config.secretAccessKey = "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";

var s3 = new aws.S3();

var formidable = require('formidable');
var form = new formidable.IncomingForm();

form.encoding = 'utf-8';
form.uploadDir = __dirname + '/upload';
form.keepExtentions = true;

var easyimage = require('easyimage');

var router = express.Router();

console.log('endpoint', s3.endpoint);

// s3.listBuckets( function(err, data){
// 	if( err ){
// 		console.error("log", err);
// 	}
// 	console.log(data);
// });

// var params = {Bucket:'leestore'};  // object bucket 

// s3.listObjects( params, function(err,data){
// 	if( err ) {
// 		console.error('Error',err);
// 	}

// 	console.log("data", data);
// });


// exports.fileupload = function (req, res){
	
// 	form.parse(req, function(err, fields, files){

// 		console.log('fields',fields);
// 		console.log('files',files);

// 		// easyimg.thumbnail({
// 		// 	src:filePath,
// 		// 	dst:thumbnailFilePath,
// 		// 	width:100
// 		// });

// 		res.send("aaa");
// 	});
// };

router.post('/page/write/upload',function (req, res){
	
	form.parse(req, function(err, fields, files){

		// easyimg.thumbnail({
		// 	src:filePath,
		// 	dst:thumbnailFilePath,
		// 	width:100
		// });		

		console.log('files.file  ',files);
		
		var body = fs.createReadStream(files.path);

		console.log('files.body  ',body);

		var buckeName = 'leestore';
		var itemKey = 'image/jpeg4.jpg';

		var params2 = {
			Bucket:buckeName,
			Key:itemKey,
			ACL:'public-read',
			ContentType:file.type,
			Body:body
		};

		console.log('params2  ',params2);


		s3.putObject( params2, function(err,data){
			console.log("err : ", err);
			console.log("data : ", data);
			console.log("href : ", s3.endpoint.href);

			fileList.push(s3.endpoint.href + '/' + itemKey);
			fs.unlinkSync(file);

			//var url = s3.getSignedUrl('getObject',{Bucket:'',Key:''});  // bucket 과 키를 통해 url를 얻을수 있다. 

			res.end('success');
		});

		//res.send("aaa");
	});
});

module.exports = router;