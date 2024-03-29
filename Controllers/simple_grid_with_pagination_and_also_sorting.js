const router = require('express').Router();

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database:"main"
});

con.connect(function(err) {
    if (err) console.log("error");
});




var ct=0;
let temp=0;
let srt=`Id`;



router.get("/simple",(req,res)=>{
  
  if(temp!=0){
    srt=req.query.id;
  }

   con.query(`select * from student_master ORDER BY ${srt} limit 200 `,(err,result)=>{
        if(err) throw err;

        else{
            let no =1;
            res.render('../views/simple_grid_with_pagination_and_also_sorting/index',{result:result,no:no});
        }
   })

   temp++;
})

router.get('/simple/first',(req,res)=>{
    ct=0;
    con.query("select * from student_master limit 200 offset ?",[ct],(err,result)=>{
      if(err) throw err;
  
      else{
          let no =1;
          res.render('../views/simple_grid_with_pagination_and_also_sorting/index',{result:result,no:no});
      }
})
  
})

router.get('/simple/prev',(req,res)=>{
    ct-=200;
    con.query("select * from student_master limit 200 offset ?",[ct],(err,result)=>{
      if(err) throw err;
  
      else{
          let no = (ct/200)-1;
          res.render('../views/simple_grid_with_pagination_and_also_sorting/index',{result:result,no:no});
      }
})
  
})

router.get('/simple/next',(req,res)=>{
  ct+=200;
  con.query("select * from student_master limit 200 offset ?",[ct],(err,result)=>{
    if(err) throw err;

    else{
        let no = (ct/200)+1;
        res.render('../views/simple_grid_with_pagination_and_also_sorting/index',{result:result,no:no});
    }
})

})

router.get('/simple/last',(req,res)=>{
    ct=99800;
    con.query("select * from student_master limit 200 offset ?",[ct],(err,result)=>{
      if(err) throw err;
  
      else{
          let no =(ct/200)+1;
          res.render('../views/simple_grid_with_pagination_and_also_sorting/index',{result:result,no:no});
      }
})
  
})


module.exports = router;




  