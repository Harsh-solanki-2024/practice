var mysql = require('mysql');

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database:"main"
});

conn.connect(function(err) {
    if (err) console.log("error");
});

module.exports={conn}

