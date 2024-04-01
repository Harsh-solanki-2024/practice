const router = require('express').Router();
var fs = require("fs");
var bodyParser = require('body-parser')
const verify = require('../middleware.js');


router.get("/json",  verify,(req, res) => {
  res.render("../views/json_task/index");
})

router.get("/json/user",(req,res)=>{
  Id=req.query.userId
  res.render("../views/json_task/all_detail_user",{id:Id});
})

module.exports = router;
