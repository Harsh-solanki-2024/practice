const router = require('express').Router();
const verify = require('../middlewares/authorization.js');



router.get("/json",  verify,(req, res) => {
  res.render("../views/json_task/index");
})

router.get("/json/user",(req,res)=>{
  let Id=req.query.userId
  res.render("../views/json_task/all_detail_user",{id:Id});
})

module.exports = router;
