const router = require('express').Router();
const verify = require('../middlewares/authorization.js');
const connection = require('../database/data_config.js');


let search, q = `select * from student_master limit 200`;

router.get("/delimeter", verify,(req, res) => {
  try {
    connection.conn.query(q, (err, result) => {
      if (err) throw err;

          else if(result.length==0){
            res.render("../views/delimeter_search/index", { result,msg:"Not valid try other",search:""})
          }
          else {
              res.render("../views/delimeter_search/index", { result,msg:"",search:""})
          }
  })
  } catch (error) {
    res.send(error);
  }
})


router.post("/delimeter", (req, res) => {

  try {
    
    search =req.body.searchall || "_";

    let arr=[],firstname=[] , lastname=[] , age=[] , email=[] , moblieno=[] , city=[];;

    for(let i=0;i<search.length;i++){
      if(search[i]=="_" || search[i]=="^" || search[i]=="$" || search[i]=="}" || search[i]=="{" || search[i]==":" || search[i]==""){
        arr.push(i);
      }
    }

    let j=0;

    for(let i=0;i<search.length;i++){

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
       for(let i=0;i<firstname.length;i++){
        q+=` FirstName LIKE '%${firstname[i]}%' or`
       }
       q=q.slice(0,q.length-3) +" and";
    }

    if(lastname.length>=1){
      for(let i=0;i<lastname.length;i++){
       q+=` LastName LIKE '%${lastname[i]}%' or`
      }
      q=q.slice(0,q.length-3) +"  and";
    }

    if(email.length>=1){
    for(let i=0;i<email.length;i++){
     q+=` email LIKE '%${email[i]}%' or`
    }
    q=q.slice(0,q.length-3) +"  and";
    }

    if(age.length>=1){
    for(let i=0;i<age.length;i++){
    q+=` Age LIKE ${age[i]} or`
    }
    q=q.slice(0,q.length-3) +" and ";
    }
   if(moblieno.length>=1){
   for(let i=0;i<moblieno.length;i++){

   q+=` MobNo LIKE '${moblieno[i]}' or`
   }
   q=q.slice(0,q.length-3) +" and ";
   }

  if(city.length>=1){
   for(let i=0;i<city.length;i++){
    q+=`City LIKE '%${city[i]}%' or`
   }
   q=q.slice(0,q.length-3) +" and";
  }

  q=q.slice(0,q.length-4)

  connection.conn.query(q, (err, result) => {
        if (err) throw err;

           else if(result.length==0){
            res.render("../views/delimeter_search/index", { result,msg:"Not valid try other",search:search.toString()})
          }
          else {
               res.render("../views/delimeter_search/index", { result,msg:" ",search:search.toString()})
           }
         })    
  } catch (error) {
    res.send(error);
  }

})


module.exports = router;