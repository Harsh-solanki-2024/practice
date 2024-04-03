const router = require('express').Router();
const connection = require('../database/data_config.js');
const verify = require('../middlewares/authorization.js');

let ct = 0, temp = 0, srt = `Id`;


router.get("/grid/", verify, (req, res) => {
  try {
    if (temp != 0) {
      srt = req.query.id;
    }

    connection.conn.query(`select * from student_master ORDER BY ${srt} limit 200 `, (err, result) => {
      if (err) throw err;

      else {
        let no = 1;
        res.render('../views/simple_grid_with_pagination_and_also_sorting/index', { result: result, no: no });
      }
    })

    temp++;

  } catch (error) {
    res.send(error);
  }


})

router.get('/grid/first', (req, res) => {
  try {
    ct = 0;
    connection.conn.query("select * from student_master limit 200 offset ?", [ct], (err, result) => {
      if (err) throw err;

      else {
        let no = 1;
        res.render('../views/simple_grid_with_pagination_and_also_sorting/index', { result: result, no: no });
      }
    })
  } catch (error) {
    res.send(error);
  }



})

router.get('/grid/prev', (req, res) => {
  try {
    ct -= 200;
    connection.conn.query("select * from student_master limit 200 offset ?", [ct], (err, result) => {
      if (err) throw err;

      else {
        let no = (ct / 200) - 1;
        res.render('../views/simple_grid_with_pagination_and_also_sorting/index', { result: result, no: no });
      }
    })

  } catch (error) {
    res.send(error);
  }


})

router.get('/grid/next', (req, res) => {
  try {
    ct += 200;
    connection.conn.query("select * from student_master limit 200 offset ?", [ct], (err, result) => {
      if (err) throw err;

      else {
        let no = (ct / 200) + 1;
        res.render('../views/simple_grid_with_pagination_and_also_sorting/index', { result: result, no: no });
      }
    })

  } catch (error) {
    res.send(error);
  }
})

router.get('/grid/last', (req, res) => {
  try {
    ct = 99800;
    connection.conn.query("select * from student_master limit 200 offset ?", [ct], (err, result) => {
      if (err) throw err;

      else {
        let no = (ct / 200) + 1;
        res.render('../views/simple_grid_with_pagination_and_also_sorting/index', { result: result, no: no });
      }
    })
  } catch (error) {
    res.send(error);
  }
})


module.exports = router;




