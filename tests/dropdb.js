var mongodb = require('mongodb');
var mongoose = require('mongoose');

////////////////
// CONNECT DB //
////////////////

var connection_string = 'localhost:27017/shiftshark';



var db = mongoose.connect(connection_string);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
	db.db.dropDatabase(function(err) {
		if (err) throw err;
		mongoose.connection.close();
	});
});