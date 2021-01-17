var mysql = require('mysql');
var db = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '101Jay',
	database : 'opentutorials'
});
db.connect();

module.exports = db; //just one property