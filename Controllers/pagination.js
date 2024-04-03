const router = require('express').Router();
const verify = require('../middlewares/authorization.js');
const connection = require('../database/data_config.js');

let recordsperpage = '20';
let page = 1, len, q = `select * from student_master`, temp = 0;
let search, search2, search3, search4;



router.get("/pagination", verify, (req, res) => {
  try {

    if (temp == 0) {

      connection.conn.query(q, (err, result) => {
        if (err) throw err;

        else {
          len = result.length;

          if (req.query.recordsperpage) recordsperpage = req.query.recordsperpage || 1;

          if (req.query.page) page = req.query.page || 1;

          connection.conn.query(q + " limit ?,? ;", [(page - 1) * recordsperpage, parseInt(recordsperpage)], (errQuery, resQuery) => {
            if (errQuery) {
              throw err;
            }
            else if (resQuery.length == 0) {
              res.render('../views/pagination/index', { resQuery, currentpage: page, recordsperpage, len, url: "/pagination", msg: "Not valid try other" })
            }
            else {
              res.render("../views/pagination/index", { resQuery, currentpage: page, recordsperpage, len, url: "/pagination", msg: "" })
            }
          })
        }
      })
    }

    else if (temp >= 1) {
      if (req.body.recordsperpage) recordsperpage = req.body.recordsperpage || 1;

      if (req.query.page) page = req.query.page || 1;


      connection.conn.query(`SELECT * FROM student_master WHERE FirstName LIKE '%${search}%' AND Age LIKE '%${search2}%' AND MobNo LIKE '%${search3}%' AND email LIKE '%${search4}%'   limit ? , ?`, [(page - 1) * recordsperpage, parseInt(recordsperpage)], (err, resQuery) => {
        if (err) throw err;
        else if (resQuery.length == 0) {
          res.render('../views/pagination/index', { resQuery, currentpage: page, recordsperpage, len, url: "/pagination", msg: "Not valid try other" })
        }

        res.render('../views/pagination/index', { resQuery, currentpage: page, recordsperpage, len, url: "/pagination", msg: "" })
      })
    }

    else {
      res.redirect("/pagination")
      temp = 0;
    }

  } catch (error) {
    res.send(error);
  }

})


router.post("/pagination", (req, res) => {
  try {
    search = req.body.searchId


    q = `SELECT * FROM student_master WHERE Id='${search}'`

    connection.conn.query(q, (err, resQuery) => {
      if (err) throw err;

      else if (resQuery.length == 0) {
        res.render('../views/pagination/index', { resQuery, currentpage: page, recordsperpage, len, url: "/pagination", msg: "Not valid Id" });
      }
      else if (resQuery.length == 1) {
        res.render('../views/pagination/index', { resQuery, currentpage: page, recordsperpage, len, url: "/pagination", msg: "" })
      }
      else {
        res.redirect("/pagination");
      }
    })


  } catch (error) {
    res.send(error);
  }
})

router.post("/pagination/all", (req, res) => {
  try {
    search = req.body.searchName || "_"
    search2 = req.body.searchAge || "_"
    search3 = req.body.searchMobNo || "_"
    search4 = req.body.searchemail || "_"

    q = `SELECT * FROM student_master WHERE FirstName LIKE '%${search}%' AND Age LIKE '%${search2}%' AND MobNo LIKE '%${search3}%' AND email LIKE '%${search4}%'  `

    connection.conn.query(q, (err, result) => {
      if (err) throw err;

      else {
        len = result.length;

        if (req.body.recordsperpage) recordsperpage = req.body.recordsperpage || 1;

        if (req.query.page) page = req.query.page || 1;


        connection.conn.query(q + " limit ?,? ; ", [(page - 1) * recordsperpage, parseInt(recordsperpage)], function (errQuery, resQuery) {
          if (errQuery) {
            throw err;
          }
          else if (resQuery.length == 0) {
            res.render('../views/pagination/index', { resQuery, currentpage: page, recordsperpage, len, url: "/pagination", msg: "Not valid try other" })
          }
          else {
            res.render('../views/pagination/index', { resQuery, currentpage: page, recordsperpage, len, url: "/pagination", msg: " " })
          }
        })
      }
    })


    temp++;

  } catch (error) {
    res.send(error);
  }


})


module.exports = router;