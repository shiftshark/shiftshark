var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('auth', {authType:"login"});
});

router.get('/signup', function(req, res) {
    res.render('auth', {authType:"employerSignup"});
});

router.get('/scheduleTest', function(req, res) {
    res.render('schedule', {title:"schedule"});
});

module.exports = router;
