
	///////////////////////////////////////////////////////////////////////////
	// find or update
	
	// db.PageList.find( {user_id:req.body.user_id} ).exec(function (err, doc) {
	//    console.log(doc);
	// });	
	
	// db.PageList.findOne().select('user_id').exec(function (err, doc) {
	//    console.log(doc);
	//    console.log(doc.isSelected('user_id')); // true
	//    console.log(doc.isSelected('title'));  // false
	// });

	// db.PageList.find().select('user_id').select('title').exec(function (err, doc) {
	//    console.log(doc);
	//    //console.log(doc.isSelected('user_id'));  undefined
	// });		

	///////////////////////////////////////////////////////////////////////////
	//  Update

	//Tank.update({ _id: id }, { $set: { size: 'large' }}, callback);

	//////
	// var thingSchema = new Schema({
	//     _id: String,
	//     flag: {
	//         type: Boolean,
	//         "default": false
	//     }
	// });
	
	// var Thing = mongoose.model('Thing', thingSchema);
	// var key = 'some-id';

	// Thing.findOneAndUpdate({_id: key}, {$set: {flag: false}}, {upsert: true, "new": false}).exec(function(err, thing) {
	//     console.dir(thing);
	// });


	///////////////
	// var conditions = { user_id: 'leee@test.com' }
	// 		, update = { $set: { user_id: 'll@test.com' }} // , update = { $inc: { visits: 1 }}
	// 		, options = { multi: true };

	// db.PageList.update(conditions, update, options, function (err, numAffected) {
		
	// 	console.log(err);
	// 	console.log(numAffected);

	// });

	///////////////
	//  var conditions = { user_id: 'll@test.com' }
	//  		, update = { $set: { user_id: 'lee@test.com' }} // , update = { $inc: { visits: 1 }}
	//  		, options = {};

	// db.PageList.findOneAndUpdate(conditions, update, options, function (err, doc) {
	// 		console.log(doc);
	// });


	///////////////
	// db.PageList.find().select('unique_id').exec(function(err,doc){
	// 		console.log(doc);
	// });



	///////////////////////////////////////////////////////////////////////
	// save or create

	db.SignUp.create( req.body , function( err, item ){	
		if( err ){
			console.log('error create = ', err );
			//return handleError(err);
		}
		else{
			sendJSON( "Success ITEM : ", res , item );
		}
	});

	///////////////
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




////////////////////////////////////////////////////////
// 자동 카운트 

	// var InvoiceSchema = new Schema({
 //    reference: {type: Number, default: 0}, // The property I want to auto-incr.

 //    dates: {
 //        created:  {type: Date, default: Date.now},
 //        expire: {type: Date, default: expiryDate()}
 //    },

 //    amount: {type: Number, default: 0}
 //    // And so on
	// });	
	// Controller.findByIdAndUpdate({ _id: ID_HERE }, {$inc: {next:1}}, function (err, data) {
	// });