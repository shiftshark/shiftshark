var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('admin', {employees:['Elliott','Andre','Cathleen','Michael']});
});

router.get('/signup', function(req, res) {
    res.render('auth', {formType:"employerSignup"});
});

router.get('/signupee', function(req, res) {
    res.render('auth', {formType:"employeeSignup"});
});

module.exports = router;
