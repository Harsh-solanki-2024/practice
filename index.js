const express = require('express');
const app = express()
var fs = require("fs");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const port = 3050;
const ShortUniqueId = require('short-unique-id');
const coni = require("./database/data_config")
var md5 = require('md5');
const pagination = require("./Controllers/pagination.js");
const delimeter = require('./Controllers/delimeter_search.js');
const json_task = require("./Controllers/json_task.js");
const attendance_task = require("./Controllers/attendance_master.js");
const result_master_task = require("./Controllers/result_master.js");
const job_appli_ajax = require('./Controllers/job_appli_ajax.js');
const simple_job_application = require("./Controllers/Crud_job_form.js");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const verify = require('./middleware.js');
const dynamic_query = require('./Controllers/dynamic_grid_query_with_sorting.js');
const simple = require ('./Controllers/simple_grid_with_pagination_and_also_sorting.js');

const uid = new ShortUniqueId();

var lastid, str, str2,secretkey=process.env.SECRET_KEY;

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(pagination);
app.use(dynamic_query);
app.use(delimeter);
app.use(json_task);
app.use(attendance_task);
app.use(result_master_task);
app.use(job_appli_ajax);
app.use(simple_job_application);
app.use(simple);





const executequery = (str) => {
  return new Promise((resolve, reject) => {
    coni.conn.query(str, (err, result) => {
      if (err) reject(err);

      resolve(result);
      console.log(result);
    })
  })
}

app.get("/Home", verify,(req, res) => {
  res.render("main");
})

app.get("/clock",async (req,res)=>{
  res.render('clock');
})




app.get("/checkemail/:email", async (req, res) => {

  q = `select count(*) as counter from user_registration where email = '${req.params.email}'`;

  result = await executequery(q);


  const exist = result[0].counter >= 1;

  console.log("hello");

  console.log(exist);

  res.send(exist);

})



app.get("/", async (req, res) => {
  res.render('index');
})

app.get("/login", (req, res) => {
  res.render("login");
})



app.post("/login", async (req, res) => {
  var body = req.body;

  if (body.email && body.password) {

    q = `select count(*) as counter from user_registration where email='${body.email}'`;

    result = await executequery(q);

    if (result[0].counter == 1) {

      q = `select id,pw_salt,password from user_registration where email='${body.email}';`

      result2 = await executequery(q);

      var salt = result2[0].pw_salt;

      var str = md5(body.password + salt);

      if (str == result2[0].password) {
        const token = jwt.sign({id:result2[0].id},secretkey, {
          expiresIn: '1h' 
        });
        res.cookie('token',token, {
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
})

app.get("/page", (req, res) => {
  res.render("thank", { str });
})



app.post("/thank", async (req, res) => {
  var body = req.body;

  str = uid.rnd(12);

  q = `insert into user_registration (first_name,last_name,email,contact_no,activation_code) values
  ('${body.first_name}','${body.last_name}','${body.email}','${body.contact_no}','${str}')`

  var result = await executequery(q);

  lastid = result.insertId;

  console.log(lastid);

  res.redirect();
})




app.get("/verify/:code", async (req, res) => {

  q = `select count(*) as counter from user_registration where activation_code='${req.params.code}'`
  var result = await executequery(q);

  q = `select id from user_registration where activation_code='${req.params.code}'`

  var result2 = await executequery(q);

  if (result[0].counter == 1) {

    res.render('password', { id: result2[0].id });
  }
  else {
    res.end("activation code link invalid");
  }

})

app.post("/", async (req, res) => {
  var body = req.body;

  console.log(body);

  q = `select created_at from user_registration where id = ${body.id};`

  var result = await executequery(q);

  const date = new Date();

  var str = result[0].created_at.toString().slice(4, 24);

  var dat = new Date(str);

  var str2 = (date.getTime() - dat.getTime()) / 60000;

  console.log(str2);

  if (str2 < 30) {

    salt = uid.rnd(4)

    console.log(body.password);

    var str3 = md5(body.password + salt);

    q = `update user_registration
      set password='${str3}',pw_salt="${salt}",active=1
      where id=${body.id}`;

    var result = await executequery(q);

    console.log(result);
    res.end("verified");
  }
  else {
    await executequery(`delete from user_registration where id = ${body.id}`);
    res.redirect("/");
  }

})
app.get("/forgotpass", (req, res) => {
  res.render("forgotpass");
})

app.get("/forgotthank", (req, res) => {

  res.render("thank", { str: str2 });
})

app.post("/forgotpass", async (req, res) => {
  var body = req.body;

  str2 = uid.rnd(12);

  q = `update user_registration
  set activation_code='${str2}',created_at = current_timestamp()
  where email='${body.email}'`

  var result = await executequery(q);

  res.redirect('/forgotthank');
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


