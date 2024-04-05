const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const pagination = require("../Controllers/pagination.js");
const delimeter = require('../Controllers/delimeter_search.js');
const json_task = require("../Controllers/json_task.js");
const attendance_task = require("../Controllers/attendance_master.js");
const result_master_task = require("../Controllers/result_master.js");
const job_routerli_ajax = require('../Controllers/job_appli_ajax.js');
const simple_job_routerlication = require("../Controllers/Crud_job_form.js");
require('dotenv').config();
const dynamic_query = require('../Controllers/dynamic_grid_query_with_sorting.js');
const simple = require ('../Controllers/simple_grid_with_pagination_and_also_sorting.js');
const register_login = require('../Controllers/register_login.js');
const state_cities = require('../Controllers/state_cities.js');


router.use(express.static('public'))
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))
router.use(cookieParser());
router.use(pagination);
router.use(dynamic_query);
router.use(delimeter);
router.use(json_task);
router.use(attendance_task);
router.use(result_master_task);
router.use(job_routerli_ajax);
router.use(simple_job_routerlication);
router.use(simple);
router.use(register_login);
router.use(state_cities);

module.exports = router;