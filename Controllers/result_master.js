const router = require('express').Router();
var fs = require("fs");
var bodyParser = require('body-parser')
const port = 3070
const verify = require('../middlewares/authorization.js');
const connection = require('../database/data_config.js');   

let u= 1;

const executequery = (str,x,y) => {
    return new Promise((resolve, reject) => {
      connection.conn.query(str,[x,y],(err, result) => {
        if (err) reject(err);
  
        resolve(result);
      })
    })
  }

  const executequery2 = (str,x) => {
    return new Promise((resolve, reject) => {
      connection.conn.query(str,x,(err, result) => {
        if (err) reject(err);
  
        resolve(result);
      })
    })
  }

  let q1=`select student_master.Id,student_master.FirstName,sum(result_master.theory_marks) as theory,
    sum(result_master.practical_marks) as practical,sum(result_master.theory_marks + result_master.practical_marks) as totalmarks
    from result_master join student_master join exam_master join subject_master on student_master.Id=result_master.student_id and 
    exam_master.exam_id = result_master.exam_id and subject_master.subject_id = result_master.subject_id
    where exam_type= ?
    group by student_master.Id,student_master.FirstName limit ?;`


  let q2=`select student_master.FirstName,student_master.LastName, student_master.Id,subject_master.subject_name,sum(result_master.theory_marks) as theory,
    sum(result_master.practical_marks) as practical,sum(result_master.theory_marks + result_master.practical_marks) as totalmarks
    from result_master join student_master join exam_master join subject_master on student_master.Id=result_master.student_id and 
    exam_master.exam_id = result_master.exam_id and subject_master.subject_id = result_master.subject_id
    where student_master.Id= ? and exam_type=?
    group by student_master.Id,subject_master.subject_id;`


  let q3=`select student_master.FirstName,student_master.LastName, student_master.Id, sum(result_master.theory_marks + result_master.practical_marks)*6 /100 as percentage
    from result_master join student_master on student_master.Id=result_master.student_id
    where student_master.Id= ?`


router.get('/result',verify,async (req,res)=>{

    let result = await executequery(q1,'terminal',100);

    let result2 = await executequery(q1,'prelim',100);

    let result3 = await executequery(q1,'final',100);

    res.render('../views/attendance_result_master/result',{result,result2,result3})
})    

router.get("/result/user",async (req,res)=>{

    u=req.query.userid

    let result = await executequery(q2,u,'terminal');

    let result2 = await executequery(q2,u,'prelim');

    let result3 = await executequery(q2,u,'final');

    let result4 = await executequery2(q3,u);

    res.render('../views/attendance_result_master/detailed_result_user',{result,result2,result3,result4})

})

module.exports = router;