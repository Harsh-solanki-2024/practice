const router = require('express').Router();
const coni = require("../database/data_config");
const verify = require('../middlewares/authorization.js');


let lastid = 0;

const executequery = (str) => {
    return new Promise((resolve, reject) => {
      coni.conn.query(str, (err, result) => {
        if (err) reject(err);
  
        resolve(result);
        console.log(result);
  
      })
    })
  }


router.get("/state",verify,async (req,res)=>{
    q=`select id,name from states`;
    let result=await executequery(q);

    res.render('../views/state_cities',{result:result});
})

router.get("/state/get_cities/:id",async (req,res)=>{

    let id=req.params.id;

    q=`select name from cities where state_id=${id};`

    let result = await executequery(q);

   res.send(result);
})

module.exports = router;