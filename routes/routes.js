var express = require('express');
var router = express.Router();
var passport = require('passport');

var Employee = require('../models/employee');
var Position = require('../models/position');
var Schedule = require('../models/schedule');
var Shift = require('../models/shift');
var Availability = require('../models/availability');

/* Home Page -- (Dynamically) Login, Admin, or Employee */
router.get('/', function(req, res) {
  if (req.user === undefined || req.user === null) {
    // unauthorized
    res.render('auth', {formType:'login'});
  } else if (req.user.employer === true) {
    // employer
    Employee.find({ schedule: req.user.schedule }, 'firstName lastName username', function(err, employees) {
      if (err) return res.status(500).end();

      Shift.find({ schedule: req.user.schedule }, function(err, shifts) {
        if (err) return res.status(500).end();
        if (shifts == undefined || shifts == null) { shifts = []; }
          Position.find({ schedule: req.user.schedule }, function(err, positions) {
            if (err) return res.status(500).end();
            if (positions == undefined || positions == null) { positions = []; }
            // determine date
            var date = new Date(); // today
            if (req.query.date !== undefined && req.query.date !== null) {
              date = new Date(String(req.query.date));
            }
            res.render('admin', {req:req, isAdmin:true, employees:employees, positions:positions, schedule:shifts, dateToCheck: date});
            // res.render('employee', {req:req, isAdmin:false, positions:positions, schedule:shifts, dateToCheck:Date("Mon Nov 18 2014")});
          });
      });
    });
  } else {
    // employee
    Shift.find({ schedule: req.user.schedule }, function(err, shifts) {
      if (err) return res.status(500).end();
      if (shifts == undefined || shifts == null) { shifts = []; }
        Position.find({ schedule: req.user.schedule }, function(err, positions) {
          if (err) return res.status(500).end();
          if (positions == undefined || positions == null) { positions = []; }
          // determine date
          var date = new Date(); // today
          if (req.query.date !== undefined && req.query.date !== null) {
            date = new Date(String(req.query.date));
          }
          res.render('employee', {req:req, isAdmin:false, positions:positions, schedule:shifts, dateToCheck: date});
          // res.render('employee', {isAdmin:false, schedule:shifts, dateToCheck:Date("Mon Nov 18 2014")});
        });
    });
  }
});

/* Availability -- Employee or Admin View */
router.get('/availability', function(req, res) {
  if (req.user === undefined || req.user === null) { // unauthorized
    res.redirect('/');
  } else if (req.user.employer === true) { // Employer Permissions
    // parse params
    var weekday = req.query.weekday;
    var adminView = req.query.admin === '1' || req.query.admin === 'true';
    if (!weekday || parseInt(weekday) < 0 || parseInt(weekday) > 6) {
      weekday = ((new Date()).getDay() + 6) % 7;
    }

    // render admin or employee view
    if (adminView) {
      res.render('adminAvail', {req:req, isAdmin:true, weekday:weekday});
    } else {
      res.render('employeeAvail', {req:req, isAdmin:false, employer:true});
    }
  } else { // Employee Only
    res.render('employeeAvail', {req:req, isAdmin:false, employer:false});
  }
});

//////////
// AUTH //
//////////

router.get('/signup', function(req, res) {
    res.render('auth', {formType:'employerSignup'});
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      res.status(500).end();
    } if (!user) {
      res.status(401).send(info.message).end();
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

/////////////
// TESTING //
/////////////

// Clears all data pertaining to employer's schedule.
router.delete('/clear_all', function(req, res){
  // check permissions - employers only
  if (req.user === undefined || req.user === null || !req.user.employer)
    return res.status(401).end();

  // remove all shifts wihtin schedule
  Shift.remove({ schedule: req.user.schedule }, function(err) {
    if(err) return res.status(500);
    // remove all positions within schedule
    Position.remove({ schedule: req.user.schedule }, function(err) {
      if(err) return res.status(500);
      // remove all availibities within schedule
      Availability.remove({ schedule: req.user.schedule }, function(err) {
        if(err) return res.status(500);
        // remove employees if specified
        if ( req.query.employees !== undefined &&
            (req.query.employees === '1' || req.query.employees === 'true') ) {
          var empl_id_sel = { '$ne': req.user._id }; // all employees except self
          Employee.remove({ _id: empl_id_sel, schedule: req.user.schedule }, function(err) {
            if(err) return res.status(500);
            return res.status(200).end();
          });
        // else return without removing employees
        } else {
          return res.status(200).end();
        }
      });
    });
  });
});

module.exports = router;
