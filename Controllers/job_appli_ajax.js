const router = require('express').Router();
var fs = require("fs");
var bodyParser = require('body-parser')
const port = 3080
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
    //     conn.query("select * from form_name",(err,result)=>{
    //         console.log(result)
    //     })
    // }
});


var lastid = 0;
const executequery = (str) => {
  return new Promise((resolve, reject) => {
    con.query(str, (err, result) => {
      if (err) reject(err);

      resolve(result);
      console.log(result);
    })
  })
}

router.get("/job_application_form", (req, res) => {
  res.render('../views/job_appli_ajax/index');

})

router.get("/job_application_form/id", async (req, res) => {
  return new Promise(async (resolve, rejects) => {
    console.log(req.query);
    try {
      if (req.query.id) {

        let count = await executequery(`select count(*) as counter from basic_details where basic_id=${req.query.id};`);


        console.log(count[0]);

        if (count[0].counter >= 1) {
          console.log("i'm in");
          let result = await executequery(`select * from basic_details where basic_id=${req.query.id}`)
          let result2 = await executequery(`select * from education_details where ref_id=${req.query.id};`)
          let result3 = await executequery(`select * from work_experience where emp_id=${req.query.id};`)
          let result4 = await executequery(`select * from language_knowledge where emp_id=${req.query.id};`)
          let result5 = await executequery(`select * from technology_knowledge where emp_id=${req.query.id};`)
          let result6 = await executequery(`select * from referances where emp_id=${req.query.id}`);
          let result7 = await executequery(`select * from prefernces where emp_id=${req.query.id}`);

          let obj = {
            result: result,
            result2: result2,
            result3: result3,
            result4: result4,
            result5: result5,
            result6: result6,
            result7: result7
          }


          return resolve(res.json(obj));
        }
      }

    } catch (err) {
      return rejects(res.json(err.message))
    }
  })

})

router.post("/job_application_form/regorup", async (req, res) => {
  var body = req.body;

  if (body.id == "") {
    console.log("i'm in the insert");
    //basic_details
    if (body.first_name.trim() != "" && body.last_name.trim() != "" && body.designation.trim() != "" && body.address.trim() != "" && body.phone_number.trim() != "" && body.email.trim() != "" && body.city.trim() != "" && body.Zip_code.trim() != "" && body.DOB.trim() != "" && body.relationship_status.length != 0 && body._gender.trim() != "" && body.state.trim() != "") {

      q1 = `insert into basic_details(first_name,last_name,designation,address_1,phone_number,email,city,Zip_code,DOB,Relationship_status,
      Gender,state) values ('${body.first_name}','${body.last_name}','${body.designation}','${body.address}','${body.phone_number}','${body.email}','${body.city}','${body.Zip_code}','${body.DOB}','${body.relationship_status}','${body._gender}','${body.state}')`

      let result = await executequery(q1);
      lastid = result.insertId;
      console.log(lastid);
    }
    else {
      res.end("please fill all the fields of basic details");
    }

    //education_details

    if (body.name_board.length != 0 && body.passing_year.length != 0 && body.percentage.length != 0) {

      q2 = `insert into education_details(ref_id,education_course_name,education_year,percentage) values`

      for (var i = 0; i < body.name_board.length; i++) {
        if (body.name_board[i].trim() != "" && body.passing_year[i].trim() != "" && body.percentage[i].trim() != "") {
          q2 += `(${lastid},'${body.name_board[i]}','${body.passing_year[i]}','${body.percentage[i]}'),`
        }
      }
      q2 = q2.slice(0, q2.length - 1) + ";";

      con.query(q2, (err, result2) => {
        if (err) throw err;

        console.log(result2);
      })
    }

    //work experience

    if (typeof (body.company) == 'object' && body.company.length != 0 && body.designation2.length != 0 && body.From.length != 0 && body.To.length != 0) {

      q3 = `insert into work_experience(company_name,company_designation,emp_id,starting_date,ending_date) values`;

      for (var i = 0; i < body.company.length; i++) {
        if (body.company[i].trim() != "" && body.designation2[i].trim() != "" && body.From[i].trim() != "" && body.To[i].trim() != "") {
          q3 += `('${body.company[i]}','${body.designation2[i]}',${lastid},'${body.From[i]}','${body.To[i]}'),`
        }
      }

      q3 = q3.slice(0, q3.length - 1) + ";";


      con.query(q3, (err, result) => {
        if (err) throw err;

        console.log(result);

      })
    }
    else if (typeof (body.company) == 'string' && body.company.trim() != "" && body.designation2.trim() != "" && body.From.trim() != "" && body.To.trim() != "") {

      q3 = `insert into work_experience(company_name,company_designation,emp_id,starting_date,ending_date) values
    ('${body.company}','${body.designation2}',${lastid},'${body.From}','${body.To}')`;


      con.query(q3, (err, result3) => {
        if (err) throw err;

        console.log(result3);

      })
    }
    //language_query


    if (typeof (body.language) == 'object' && body.language.length != 0) {
      q4 = `insert into language_knowledge(emp_id,language_name,language_check) values`;

      for (var i = 0; i < body.language.length; i++) {

        var a = body.language[i];

        if (body[a].length != 0) {

          q4 += `(${lastid},'${body.language[i]}','${body[a]}'),`
        }
      }

      q4 = q4.slice(0, q4.length - 1);

      con.query(q4, (err, result4) => {
        if (err) throw err;

        console.log(result4);
      })
    }
    else if (typeof (body.language) == 'string' && body.language.length != 0) {

      var a = body.language;

      if (body.a != undefined) {

        q4 = `insert into language_knowledge(emp_id,language_name,language_check) values
      (${lastid},'${body.language}','${body.a}') ;`
      }

      con.query(q4, (err, result4) => {
        if (err) throw err;

        console.log(result4);
      })

    }

    //techonology_query

    if (typeof (body.technology) == 'object' && body.technology.length != 0) {

      q5 = `insert into technology_knowledge(emp_id,technology_name,technology_check) values`;

      console.log(body.technology)
      for (var i = 0; i < body.technology.length; i++) {
        
        console.log("hello");
        var a = body.technology[i];
        if (a != undefined) {

          q5 += `(${lastid},'${body.technology[i]}','${body[a]}'),`
        }
      }

      q5 = q5.slice(0, q5.length - 1);


      con.query(q5, (err, result5) => {
        if (err) throw err;

        console.log(result5);
      })
    }
    else if (typeof (body.technology) == 'string') {

      var a = body.technology;
      if (body.a != undefined) {
        q5 = `insert into technology_knowledge(emp_id,technology_name,technology_check) values
       (${lastid},'${body.technology}',${body.a})`;
      }
      con.query(q5, (err, result5) => {
        if (err) throw err;

        console.log(result5);
      })
    }



    if (body.pref_name.length && body.pref_contact.length && body.pref_relation.length) {

      q6 = `insert into referances(emp_id,pref_name,pref_contact,pref_relation) values`

      for (var i = 0; i < body.pref_name.length; i++) {
        if (body.pref_name[i].trim() != "" && body.pref_contact[i].trim() != "" && body.pref_relation[i].trim() != "") {

          q6 += `(${lastid},'${body.pref_name[i]}','${body.pref_contact[i]}','${body.pref_relation[i]}'),`
        }
      }

      q6 = q6.slice(0, q6.length - 1);


      con.query(q6, (err, result6) => {
        if (err) throw err;

        console.log(result6);
      })

    }

    if (body.location) {
      if (body.location.length != 0 && body.notice_period.trim() != "" && body.expected_ctc.trim() != "" && body.current_ctc.trim() != "" && body.department.length != 0) {
        q7 = `insert into prefernces(emp_id,location,notice_period,expected_ctc,current_ctc,department)
    values (${lastid},'${body.location}','${body.notice_period}','${body.expected_ctc}','${body.current_ctc}','${body.department}')`;

        con.query(q7, (err, result7) => {
          if (err) throw err;

          console.log(result7);
        })
      }
    }
    res.end("register successfully");
  }
  else {
    console.log(body);

    console.log("i'm in the update");
    //update section

    // basic_details

    if (body.first_name.trim() != "" && body.last_name.trim() != "" && body.designation.trim() != "" && body.address.trim() != "" && body.phone_number.trim() != "" && body.email.trim() != "" && body.city.trim() != "" && body.Zip_code.trim() != "" && body.DOB.trim() != "" && body.relationship_status.length != 0 && body._gender.trim() != "" && body.state.trim() != "") {

      q = `update basic_details
     set first_name='${body.first_name}',last_name='${body.last_name}', designation='${body.designation}',
     address_1='${body.address}',phone_number='${body.phone_number}',email='${body.email}',city='${body.city}',
     Zip_code='${body.Zip_code}',DOB='${body.DOB}',Relationship_status='${body.relationship_status}',Gender='${body._gender}',
     state='${body.state}'
     where basic_id=${body.id};`

      result = await executequery(q);
    }
    //education_details

    if (body.name_board.length != 0 && body.passing_year.length != 0 && body.percentage.length != 0) {

      q = `select education_id from education_details where ref_id=${body.id};`

      var val = await executequery(q);

      for (var i = 0; i < val.length; i++) {

        if (body.name_board[i].trim() != "" && body.passing_year[i].trim() != "" && body.percentage[i].trim() != "") {
          q = `update education_details
           set education_course_name='${body.name_board[i]}',education_year='${body.passing_year[i]}',percentage='${body.percentage[i]}'
           where education_id=${val[i].education_id}`
        }

        console.log(q);
        result = await executequery(q);
        console.log(result);
      }
    }

    //work experience

    if (typeof (body.company) == 'object' &&  body.company.length != 0 && body.designation2.length != 0 && body.From.length != 0 && body.To.length != 0) {

      q = `select work_id from work_experience where emp_id=${body.id}`;

      var val2 = await executequery(q);

      console.log(val2);

      for (var i = 0; i < val2.length; i++) {

        q = `update work_experience
          set company_name='${body.company[i]}', company_designation='${body.designation2[i]}',starting_date='${body.From[i]}',ending_date='${body.To[i]}'
          where work_id=${val2[i].work_id}`

        result = await executequery(q);
      }
    }
  

    //language_knowledge


    if (body.language.length != 0) {
      q = `select id from language_knowledge where emp_id=${body.id};`

      var val3 = await executequery(q);


      for (var i = 0; i < val3.length; i++) {
        var a = body.language[i];

        q = `update language_knowledge
          set language_name='${body.language[i]}',language_check='${body[a]}'
          where id=${val3[i].id}`

        result = await executequery(q);
      }
    }

    //technology_knowledge
    if (typeof (body.technology) == 'object' && body.technology.length != 0) {
      q = `select id from technology_knowledge where emp_id=${body.id};`

      var val4 = await executequery(q);

      for (var i = 0; i < val4.length; i++) {
        var a = body.technology[i];
        q = `update technology_knowledge
             set technology_name='${body.technology[i]}',technology_check='${body.a}'
             where id=${val4[i].id}`

        result = await executequery(q);
      }
    }


    //referances
    if (body.pref_name.length && body.pref_contact.length && body.pref_relation.length) {

      q = `select id from referances where emp_id=${body.id};`

      var val5 = await executequery(q);

      for (var i = 0; i < val5.length; i++) {
        q = `update referances 
    set pref_name='${body.pref_name[i]}',pref_contact='${body.pref_contact[i]}',pref_relation='${body.pref_relation[i]}'
    where id=${val4[i].id}`

        result = await executequery(q);
      }
    }

    //prefernces
    if (body.location.length != 0 && body.notice_period.trim() != "" && body.expected_ctc.trim() != "" && body.current_ctc.trim() != "" && body.department.length != 0) {

      q = `select id from prefernces where emp_id=${body.id}`

      var val6 = await executequery(q);

      for (var i = 0; i < val6.length; i++) {
        q = `update prefernces
     set location='${body.location}',notice_period='${body.notice_period}',expected_ctc='${body.expected_ctc}',current_ctc='${body.current_ctc}',department='${body.department}'
     where id=${val6[i].id}`

        result = await executequery(q);
      }
    }

    res.end("updated");
  }
})

module.exports = router;