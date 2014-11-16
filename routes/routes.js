var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('auth', {authType:"login"});
});

router.get('/signup', function(req, res) {
    res.render('auth', {authType:"employerSignup"});
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      res.send(err);
    } else {
      req.logIn(user, function(err) {
        if (err) {
          res.send(err);
        } else {
          res.status(200).end();
        }
      });
    }
  })(req, res, next);
});

module.exports = router;
