const router = require('express').Router();
const verify = require('../middlewares/authorization.js');
const connection = require('../database/data_config.js');



let temp = 0;
let recordsperpage = '20';
let page = 1;
let q, len;


router.get("/dynamic", verify, (req, res) => {
    try {

        if (temp == 0) {
            res.render('../views/dynamic_grid_query_with_sorting/index');
            temp++;
        }
        else {

            if (req.body.recordsperpage) recordsperpage = req.body.recordsperpage;

            if (req.query.page) page = req.query.page;

            connection.conn.query(q, [(page - 1) * recordsperpage, parseInt(recordsperpage)], (err, result, fields) => {
                if (err) res.end(err.message);
                else if (result.fieldCount == 0) res.end("Query successful");
                else res.render('../views/dynamic_grid_query_with_sorting/dynamic', { result, fields, currentpage: page, q, len, url: "/dynamic", recordsperpage })
            })
        }

    } catch (error) {
        res.send(error);
    }
})

router.post("/dynamic", (req, res) => {
    try {

        q = req.body.search;

        if (req.body.recordsperpage) recordsperpage = req.body.recordsperpage;

        page = req.query.page || 1;

        connection.conn.query(q, (err, result, fields) => {
            if (err) res.end(err.message)

            else {
                len = result.length;
                if (q.search("limit") == -1) {
                    if (req.query.page) page = req.query.page;
                    if (q.search(";") != -1) {
                        q = q.replace(";", "  limit ?,? ; ")
                    }
                    else q += " limit ?,? ";

                    connection.conn.query(q, [(page - 1) * recordsperpage, parseInt(recordsperpage)], (err, result) => {

                        if (err) res.end(err.message);
                        else if (result.fieldCount == 0) res.end("Query successful");
                        else res.render('../views/dynamic_grid_query_with_sorting/dynamic', { result, fields, currentpage: page, q, len, url: "/dynamic", recordsperpage })
                    })
                }
                else {
                    connection.conn.query(q, (err, limit) => {
                        if (err) res.end(err.message);
                        const len = limit.length;
                        q = q.replace("limit", " limit ?,? ; ");

                        q = q.substring(0, q.indexOf(";") + 1);

                        connection.conn.query(q, [(page - 1) * recordsperpage, parseInt(recordsperpage)], (err, result) => {

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
    } catch (error) {
        res.send(error);
    }
})


module.exports = router;