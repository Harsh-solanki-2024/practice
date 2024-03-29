const router = require('express').Router();
var fs = require("fs");
var bodyParser = require('body-parser')
const port = 3010
const { dirname } = require('path');

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




var recordsperpage = '20';
var page=1, len, search, q = `select * from student_master`,temp=0;
var search,search2,search3,search4;



router.get("/pagination", (req, res) => {

    if(temp==0){

    con.query(q, (err, result) => {
          if (err) throw err;
   
          else {
              len = result.length;
   
              if (req.query.recordsperpage) recordsperpage = req.query.recordsperpage || 1;
   
              if (req.query.page) page = req.query.page || 1;
   
              con.query(q  + " limit ?,? ;", [(page - 1) * recordsperpage, parseInt(recordsperpage)], (errQuery, resQuery)=> {
                  if (errQuery) {
                        throw err;
                  } 
                  else if(resQuery.length==0){
                    res.render('../views/pagination/index', { resQuery, currentpage: page, recordsperpage, len, url: "/pagination",msg:"Not valid try other"})
                  }
                  else {
                      res.render("../views/pagination/index", { resQuery, currentpage: page, recordsperpage, len, url: "/pagination" ,msg:""})
                  }
              })
          }
       })
    }

      else if(temp >= 1 ){
        if (req.body.recordsperpage) recordsperpage = req.body.recordsperpage || 1;
    
        if (req.query.page) page = req.query.page || 1;
    
    
        con.query(`SELECT * FROM student_master WHERE FirstName LIKE '%${search}%' AND Age LIKE '%${search2}%' AND MobNo LIKE '%${search3}%' AND email LIKE '%${search4}%'   limit ? , ?` ,[(page - 1) * recordsperpage, parseInt(recordsperpage)],(err,resQuery)=>{
            if(err) throw err;
            else if(resQuery.length==0){
                res.render('../views/pagination/index', { resQuery, currentpage: page, recordsperpage, len, url: "/pagination",msg:"Not valid try other"})
              }
    
            res.render('../views/pagination/index',{resQuery,currentpage:page,recordsperpage,len,url:"/pagination",msg:""})
        })
       }

       else{
         res.redirect("/pagination")
         temp=0;
       }
})


router.post("/pagination", (req, res) => {

    search = req.body.searchId
  

    q =`SELECT * FROM student_master WHERE Id='${search}'`

    con.query(q, (err, resQuery) => {
        if (err) throw err;

        else if(resQuery.length==0 ){
            res.render('../views/pagination/index',{resQuery , currentpage:page,recordsperpage , len , url:"/pagination",msg:"Not valid Id"});
        }
        else if(resQuery.length == 1){
        res.render('../views/pagination/index', { resQuery, currentpage: page, recordsperpage, len, url:"/pagination" ,msg:""})
        }
        else{
            res.redirect("/pagination");
        }
    })
  
 
})

router.post("/pagination/all", (req, res) => {

        search =req.body.searchName || "_"
        search2=req.body.searchAge || "_"
        search3=req.body.searchMobNo || "_"
        search4=req.body.searchemail || "_"

        q =`SELECT * FROM student_master WHERE FirstName LIKE '%${search}%' AND Age LIKE '%${search2}%' AND MobNo LIKE '%${search3}%' AND email LIKE '%${search4}%'  `

        con.query(q, (err, result) => {
            if (err) throw err;
    
            else {
                len = result.length;

             if (req.body.recordsperpage) recordsperpage = req.body.recordsperpage || 1;

             if (req.query.page) page = req.query.page || 1;

          
             con.query(q+" limit ?,? ; ", [(page - 1) * recordsperpage, parseInt(recordsperpage)], function (errQuery, resQuery) {
               if (errQuery) {
                   throw err;
               } 
               else if(resQuery.length==0){
                res.render('../views/pagination/index', { resQuery, currentpage: page, recordsperpage, len, url: "/pagination",msg:"Not valid try other"})
              }
              else {
                   res.render('../views/pagination/index', { resQuery, currentpage: page, recordsperpage, len, url: "/pagination" ,msg:" "})
               }
             })
           }
        })


  temp++;
})


module.exports = router;