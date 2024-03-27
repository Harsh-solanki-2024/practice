const express = require('express')
const app = express()
var fs = require("fs");
var bodyParser = require('body-parser')
const port = 3050;
const ShortUniqueId = require('short-unique-id');
const coni = require("./database/data_config")
var md5 = require('md5');

const uid = new ShortUniqueId();

var lastid, str, str2;

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


const executequery = (str) => {
  return new Promise((resolve, reject) => {
    coni.conn.query(str, (err, result) => {
      if (err) reject(err);

      resolve(result);
      console.log(result);
    })
  })
}

app.get("/Home", (req, res) => {
  res.render("main");
})

//11 exercise

app.get("/1_dynamic_table", (req, res) => {
  res.render("1_dynamic_table");
})

app.get("/2_Kuku_cube", (req, res) => {
  res.render("2_cube_table_game");
})

app.get("/3_tic_tac_toe", (req, res) => {
  res.render("3_tic_tac_toe");
})

app.get("/4_sorting", (req, res) => {
  res.render("4_sorting");
})

app.get("/5_",(req,res)=>{

})

app.get("/6",(req,res)=>{

})

app.get("/7",(req,res)=>{

})

app.get("/8",(req,res)=>{

})

app.get("/9",(req,res)=>{

})

app.get("/10",(req,res)=>{

})

app.get("/11",(req,res)=>{

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

      q = `select pw_salt,password from user_registration where email='${body.email}';`

      result2 = await executequery(q);

      var salt = result2[0].pw_salt;

      var str = md5(body.password + salt);

      if (str == result2[0].password) {
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


