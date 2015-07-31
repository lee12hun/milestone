
'use strict';

function sendJSON ( log, res, item ){
	console.log(log , item )
	res.writeHead(200,{'Content-Type':'application/json'});
	res.end( JSON.stringify( item ) );
	//res.json( item );
}

exports.sendJSON = sendJSON;

exports.checkErrData = function (typelog, reqQuery, res, err, pkData ){

	if(err){
		sendJSON("Error Page", res, {"RESULT":false , "CONTENTS" :{ "MSG_TYPE":typelog , "Error_Database":err} });
		return false; // error
	}
	else if( pkData == null && pkData == undefined ){// json data error 		
		sendJSON("Error Page", res, {"RESULT":false , "CONTENTS" :{ "MSG_TYPE":typelog , "Error_ClientQuery":reqQuery} });
		return false; // error
	}	
	return true; // success 
};

exports.checkErr = function (typelog, res, err ){

	if( err ){
		sendJSON("Error Page", res, {"RESULT":false , "CONTENTS" :{ "MSG_TYPE":typelog , "Error_Database":err} });
		return false; // error
	}
	return true; // success 
};


exports.success = function (typelog, res, pkData){

	if( pkData ){
		sendJSON( "Success Page", res, {"RESULT":true , "CONTENTS":pkData , "MSG_TYPE":typelog } );	
	}
	else{
		sendJSON( "Success Page", res, {"RESULT":true , "MSG_TYPE":typelog} );		
	}
	return true;
};