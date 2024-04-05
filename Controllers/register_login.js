const router = require('express').Router();
const connection = require("../database/data_config");
var md5 = require('md5');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const verify = require('../middlewares/authorization.js');
const { route } = require('./Crud_job_form.js');
const pino = require('pino-http')();

router.use(pino);

let lastid, str, str2, secretkey = process.env.SECRET_KEY;

const executequery = (str) => {
  return new Promise((resolve, reject) => {
    connection.conn.query(str, (err, result) => {
      if (err) reject(err);

      resolve(result);
      console.log(result);
    })
  })
}

const executequery2 = (str,x) => {
  return new Promise((resolve, reject) => {
    connection.conn.query(str,x,(err, result) => {
      if (err) reject(err);

      resolve(result);
      console.log(result);
    })
  })
}


router.get("/", (req, res) => {
  if(!req.cookies.token)
  {
  res.render("../views/login");
  }
  else{
    res.redirect("/Home");
  }
})




router.get("/Home", verify, (req, res) => {
  res.render('../views/main');
})

router.get("/clock", verify, async (req, res) => {
  res.render('../views/clock');
})



// verify email

router.get("/checkemail/:email", async (req, res) => {

  try {
    q = `select count(*) as counter from user_registration where email = '${req.params.email}'`;

    result = await executequery(q);

    const exist = result[0].counter >= 1;

    res.send(exist);

  } catch (error) {

    res.send(error);

  }

})

router.get("/logout", verify, (req, res) => {
  res.clearCookie("token").status(200).redirect("/");
})

router.get("/register", async (req, res) => {
  res.render('../views/index');
})



// with parameterized query 

router.post("/login", async (req, res) => {
  let body = req.body;

  try {
    if (body.email && body.password) {

      q = `select count(*) as counter from user_registration where email= ? `;

      result = await executequery2(q,body.email);

      if (result[0].counter == 1) {

        q = `select id,pw_salt,password from user_registration where email= ? ;`

        result2 = await executequery2(q,body.email);

        let salt = result2[0].pw_salt;

        let str = md5(body.password + salt);

        if (str == result2[0].password) {
          const token = jwt.sign({ id: result2[0].id }, secretkey, {
            expiresIn: '1h'
          });
          res.cookie('token', token, {
            maxAge: 3600 * 1000,
          });
          res.send({ msg: "login successfully" });
        }
        else {
          res.send({ msg: "Invalid creditianals" });
        }
      }
      else {
        res.send({ msg: "Invalid creditianls" });
      }
    }
    else {
      res.send({ msg: "please go back and fill the values" });
    }

  } catch (error) {
    res.send(error);
  }
})

router.get("/page", (req, res) => {
  res.render("../views/thank", { str });
})



router.post("/thank", async (req, res) => {
  let body = req.body;

  try {

    str = uid.rnd(12);

    q = `insert into user_registration (first_name,last_name,email,contact_no,activation_code) values
    ('${body.first_name}','${body.last_name}','${body.email}','${body.contact_no}','${str}')`

    let result = await executequery(q);

    lastid = result.insertId;

    res.redirect();

  } catch (error) {
    res.send(error);
  }

})




router.get("/verify/:code", async (req, res) => {
  try {
    q = `select count(*) as counter from user_registration where activation_code='${req.params.code}'`
    let result = await executequery(q);

    q = `select id from user_registration where activation_code='${req.params.code}'`

    let result2 = await executequery(q);

    if (result[0].counter == 1) {

      res.render('../views/password', { id: result2[0].id });
    }
    else {
      res.end("activation code link invalid");
    }
  } catch (error) {
    res.send(error);
  }


})

router.post("/", async (req, res) => {
  let body = req.body;

  try {
    q = `select created_at from user_registration where id = ${body.id};`

    let result = await executequery(q);

    const date = new Date();

    let str = result[0].created_at.toString().slice(4, 24);

    let dat = new Date(str);

    let str2 = (date.getTime() - dat.getTime()) / 60000;


    if (str2 < 30) {

      salt = uid.rnd(4)

      let str3 = md5(body.password + salt);

      q = `update user_registration
          set password='${str3}',pw_salt="${salt}",active=1
          where id=${body.id}`;

      let result = await executequery(q);

      res.redirect("/");
    }
    else {
      await executequery(`delete from user_registration where id = ${body.id}`);
      res.redirect("/register");
    }

  } catch (error) {
    res.send(error);
  }
})
router.get("/forgotpass", (req, res) => {
  res.render("../views/forgotpass");
})

router.get("/forgotthank", (req, res) => {

  res.render("../views/thank", { str: str2 });
})

router.post("/forgotpass", async (req, res) => {
  let body = req.body;

  try {
    str2 = uid.rnd(12);

    q = `update user_registration
    set activation_code='${str2}',created_at = current_timestamp()
    where email='${body.email}'`

    let result = await executequery(q);

    res.redirect('/forgotthank');

  } catch (error) {
    res.send(error);
  }

})

module.exports = router;