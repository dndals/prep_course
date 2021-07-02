var mysql = require('mysql');

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'rldndals',
  database : 'dndals_db'
});
db.connect();

module.exports = db;
