var mysql = require('mysql');

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database:"user_details"
});

conn.connect(function(err) {
    if (err) console.log("error");
    // else{
    //     conn.query("select * from form_name",(err,result)=>{
    //         console.log(result)
    //     })
    // }
});

module.exports={conn}