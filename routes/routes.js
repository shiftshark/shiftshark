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
      res.status(500).end();
    } if (!user) {
      res.status(401).send(info.message);
    } else {
      req.login(user, function(err) {
        if (err) {
          res.status(500).end();
        } else {
          res.status(200).end();
        }
      });
    }
  })(req, res, next);
});

router.post('/logout', function(req, res) {
  req.logout();
  res.status(200).end();
});

module.exports = router;
