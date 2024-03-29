const router = require('express').Router();
var fs = require("fs");
var bodyParser = require('body-parser')
const port = 3020
var search, q = `select * from student_master limit 200`;
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database:"main"
});

con.connect(function(err) {
    if (err) console.log("error");
    // else{
    //     con.query("select * from student_master",(err,result)=>{
    //         console.log(result)
    //     })
    // }
});


router.get("/delimeter", (req, res) => {

    con.query(q, (err, result) => {
          if (err) throw err;

              else if(result.length==0){
                res.render("../views/delimeter_search/index", { result,msg:"Not valid try other",search:""})
              }
              else {
                  res.render("../views/delimeter_search/index", { result,msg:"",search:""})
              }
      })
})


router.post("/delimeter", (req, res) => {

        search =req.body.searchall || "_";

        var arr=[],firstname=[] , lastname=[] , age=[] , email=[] , moblieno=[] , city=[];;

        for(var i=0;i<search.length;i++){
          if(search[i]=="_" || search[i]=="^" || search[i]=="$" || search[i]=="}" || search[i]=="{" || search[i]==":" || search[i]==""){
            arr.push(i);
          }
        }

        var j=0;

        for(var i=0;i<search.length;i++){

          switch(search[i]){
             case "_":
               firstname.push(search.substring(arr[j]+1,arr[j+1]));
               j++;
               break;
             case "^":
               lastname.push(search.substring(arr[j]+1,arr[j+1]));
               j++;
               break;
             case "$":
              email.push(search.substring(arr[j]+1,arr[j+1]));
              j++;
              break;
             case "}":
               age.push(search.substring(arr[j]+1,arr[j+1]));
                j++;
               break;
             case "{":
               moblieno.push(search.substring(arr[j]+1,arr[j+1]));
               j++;
               break;
             case":":
              city.push(search.substring(arr[j]+1,arr[j+1]));
              j++;
              break;
              default:
                continue;
         }
        }


        q =`SELECT * FROM student_master WHERE `


        if(firstname.length>=1){
           for(var i=0;i<firstname.length;i++){
            q+=` FirstName LIKE '%${firstname[i]}%' or`
           }
           q=q.slice(0,q.length-3) +" and";
        }

        if(lastname.length>=1){
          for(var i=0;i<lastname.length;i++){
           q+=` LastName LIKE '%${lastname[i]}%' or`
          }
          q=q.slice(0,q.length-3) +"  and";
        }

        if(email.length>=1){
        for(var i=0;i<email.length;i++){
         q+=` email LIKE '%${email[i]}%' or`
        }
        q=q.slice(0,q.length-3) +"  and";
        }

        if(age.length>=1){
        for(var i=0;i<age.length;i++){
        q+=` Age LIKE ${age[i]} or`
        }
        q=q.slice(0,q.length-3) +" and ";
        }
       if(moblieno.length>=1){
       for(var i=0;i<moblieno.length;i++){

       q+=` MobNo LIKE '${moblieno[i]}' or`
       }
       q=q.slice(0,q.length-3) +" and ";
       }

      if(city.length>=1){
       for(var i=0;i<city.length;i++){
        q+=`City LIKE '%${city[i]}%' or`
       }
       q=q.slice(0,q.length-3) +" and";
      }

      q=q.slice(0,q.length-4)

        con.query(q, (err, result) => {
            if (err) throw err;

               else if(result.length==0){
                res.render("../views/delimeter_search/index", { result,msg:"Not valid try other",search:search.toString()})
              }
              else {
                   res.render("../views/delimeter_search/index", { result,msg:" ",search:search.toString()})
               }
             })    
})


module.exports = router;