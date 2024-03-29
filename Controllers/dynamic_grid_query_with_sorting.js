const router = require('express').Router();

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database:"main"
});

con.connect(function(err) {
    if (err) console.log("error");
});



var temp = 0;
var recordsperpage = '20';
var page = 1;
var q, len;


router.get("/dynamic", (req, res) => {
    if (temp == 0) {
        res.render('../views/dynamic_grid_query_with_sorting/index');
        temp++;
    }
    else {

        if (req.body.recordsperpage) recordsperpage = req.body.recordsperpage;

        if (req.query.page) page = req.query.page;

        con.query(q, [(page - 1) * recordsperpage, parseInt(recordsperpage)], (err, result, fields) => {
            if (err) res.end(err.message);
            else if (result.fieldCount == 0) res.end("Query successful");
            else res.render('../views/dynamic_grid_query_with_sorting/dynamic', { result, fields, currentpage: page, q, len, url: "/dynamic", recordsperpage })     
        })
    }
})

router.post("/dynamic", (req, res) => {

    q = req.body.search;

    if (req.body.recordsperpage) recordsperpage = req.body.recordsperpage;

    page = req.query.page || 1;

    con.query(q, (err, result, fields) => {
        if (err) res.end(err.message)

        else {
            len = result.length;
            if (q.search("limit") == -1) {
                if (req.query.page) page = req.query.page;
                if (q.search(";") != -1) {
                    q = q.replace(";", "  limit ?,? ; ")
                }
                else q += " limit ?,? ";

                con.query(q, [(page - 1) * recordsperpage, parseInt(recordsperpage)], (err, result) => {
                
                    if (err) res.end(err.message);
                    else if (result.fieldCount == 0) res.end("Query successful");
                    else res.render('../views/dynamic_grid_query_with_sorting/dynamic', { result, fields, currentpage: page, q, len, url: "/dynamic", recordsperpage })
                })
            }
            else {
                con.query(q, (err, limit) => {
                    if (err) res.end(err.message);
                    const len = limit.length;
                    q = q.replace("limit", " limit ?,? ; ");

                    q = q.substring(0, q.indexOf(";") + 1);

                    con.query(q, [(page - 1) * recordsperpage, parseInt(recordsperpage)], (err, result) => {
                   
                        if (err) res.end("Error :" + err.message);
                        else if (result.fieldCount == 0) res.end("Query successful");
                        else {
                            res.render('../views/dynamic_grid_query_with_sorting/dynamic', { result, fields, len, currentpage: page, recordsperpage, q, url: "/dynamic" })
                        }
                    })
                })
            }
        }
    })
})


module.exports = router;