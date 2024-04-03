const router = require('express').Router();
const verify = require('../middlewares/authorization.js');
const connection = require("../database/data_config");

var ct = 0;

let m = 12, y = 2023;

var q;


router.get("/attendance", verify, (req, res) => {
    try {

        ct = 0;


        if (req.query.month || req.query.year) {
            m = req.query.month
            y = req.query.year
        }
        else {
            m = 12;
            y = 2023;
        }

        q = `select student_master.Id,FirstName,year(attendance_master.attendance_date) As year ,month(attendance_master.attendance_date) as month,` +
            `count( if(attendance_master.attendance_status='P',attendance_master.attendance_date,NULL)) as total_present,` +
            `count( if(attendance_master.attendance_status='P', attendance_master.attendance_date,NULL)) * 100/30 as percentage from student_master` +
            ` inner join attendance_master on student_master.Id=attendance_master.student_id where year(attendance_master.attendance_date)=${y} and month(attendance_master.attendance_date)=${m}` +
            `  group by year,month,student_master.Id`

        connection.conn.query(q + " limit 50", (err, result) => {
            if (err) throw err;

            else {
                let no = 1;
                res.render('../views/attendance_result_master/attendance', { result: result, no: no, month: m, year: y });
            }
        })


    } catch (error) {
        res.send(error);
    }


})

router.get('/attendance/first', (req, res) => {
    try {

        ct = 0;

        if (req.query.month || req.query.year) {
            m = req.query.month
            y = req.query.year
        }


        connection.conn.query(q + " limit 50 offset ?", [ct], (err, result) => {
            if (err) throw err;

            else {
                let no = 1;
                res.render('../views/attendance_result_master/attendance', { result: result, no: no, month: m, year: y });
            }
        })

    } catch (error) {
        res.send(error);
    }



})

router.get('/attendance/prev', (req, res) => {
    try {
        ct -= 50;


        if (req.query.month || req.query.year) {
            m = req.query.month
            y = req.query.year
        }


        connection.conn.query(q + " limit 50  offset ?", [ct], (err, result) => {
            if (err) throw err;

            else {
                let no = (ct / 50) - 1;
                res.render('../views/attendance_result_master/attendance', { result: result, no: no, month: m, year: y });
            }
        })
    } catch (error) {
        res.send(error);
    }


})

router.get('/attendance/next', (req, res) => {
    try {
        ct += 50;

        if (req.query.month || req.query.year) {
            m = req.query.month
            y = req.query.year
        }


        connection.conn.query(q + " limit 50 offset ?", [ct], (err, result) => {
            if (err) throw err;

            else {
                let no = (ct / 50) + 1;
                res.render('../views/attendance_result_master/attendance', { result: result, no: no, month: m, year: y });
            }
        })
    } catch (error) {
        res.send(error);
    }

})

router.get('/attendance/last', (req, res) => {
  try {
    ct = 150;

    if (req.query.month || req.query.year) {
        m = req.query.month
        y = req.query.year
    }


    connection.conn.query(q + " limit 50 offset ?", [ct], (err, result) => {
        if (err) throw err;

        else {
            let no = (ct / 50) + 1;
            res.render('../views/attendance_result_master/attendance', { result: result, no: no, month: m, year: y });
        }
    })

    
  } catch (error) {
    res.send(error);
  }
 
})



module.exports = router;