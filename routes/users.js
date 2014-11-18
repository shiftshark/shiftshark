var express = require('express');
var router = express.Router();
var Employee = require('../models/employee');
var Schedule = require('../models/schedule');
var words = require('random-words');

/**
 * API Specification Authors: aandre@mit.edu, gendron@mit.edu
 * Authors: gendron@mit.edu, aandre@mit.edu
 */

/**
 * Employee Object Specification
 *
 * Employee: {
 *   _id: EmployeeID,
 *   firstName: String,
 *   lastName: String.
 *   username: String
 * }
 */

/**
 * POST /users/employers/
 *
 * Description: Create a new employer account with a schedule, and login this account.
 *
 * Permissions: Any unauthenticated user.
 *
 * Request: {
 *   schedule_name: String,
 *   first_name: String,
 *   last_name: String,
 *   email: Email,
 *   password: String
 * }
 *
 * Error:
 *   400 - Validation error.
 *
 */

router.post('/employers/', function(req, res) {
  // TODO: validate
  var userAttributes = {
    firstName: String(req.body.first_name),
    lastName: String(req.body.last_name),
    username: String(req.body.email),
    employer: true
  };
  // create Employee
  Employee.register(new Employee(userAttributes), String(req.body.password), function(err, user) {
    if (err) {
      res.status(400).send('USER_EXISTS');
    } else {
      // create Schedule owner by this employee
      var newSchedule = new Schedule({ name: String(req.body.schedule_name), owner: user._id });
      newSchedule.save(function(err, schedule) {
        if (err) {
          res.status(500).end();
        } else {
          // link employee back to schedule
          user.schedule = schedule;
          user.save(function(err) {
            if (err) {
              res.status(500).end();
            } else {
              // login employer
              req.login(user, function(err) {
                if (err) {
                  res.status(500).end();
                } else {
                  res.status(200).end();
                }
              });
            }
          });
        }
      });
    }
  });
});

 /**
 * POST /users/employees/
 *
 * Description: Creates an employee within the schedule, generates password, and sends email notification.
 *
 * Permissions: An employer may create an employee within the schedule.
 *
 * Request: {
 *   first_name: String,
 *   last_name: String,
 *   email: Email
 * }
 *
 * Error:
 *   400 - Validation error.
 *
 * Response: {
 *   employee: Employee
 * }
 *
 */

router.post('/employees/', function(req, res) {
  // check permissions
  if (! req.user.employer) return res.status(401).end();

  // TODO: validate
  var userAttributes = {
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    username: req.body.email,
    schedule: req.user.schedule // use employer's schedule
  };
  var generatedPassword = words({ min: 3, max: 5 }).join("");
  Employee.register(new Employee(userAttributes), generatedPassword, function(err, user) {
    if (err) {
      return res.status(400).send('USER_EXISTS');
    }

    // send employee an email
    var body = "Welcome to ShiftShark. An employee account has been \
      created on your behalf. Please login with the following credentials: \n\n\n" +
      "email: " + req.body.email +
      "\npassword: " + generatedPassword;
    res.mailer.sendMail({
      to: req.body.email,
      replyTo: 'shiftshark@mit.edu',
      subject: 'ShiftShark Employee Account',
      text: body
    });
    return res.json({ employee: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username
    } });
  });
});

/**
 * GET /users/employees/
 *
 * Description: Retrieves all employees within the schedule.
 *
 * Permissions: Employers only.
 *
 * Response: {
 *   employees: Employee[]
 * }
 *
 */

router.get('/employees/', function(req, res) {
  // check permissions
  if (! req.user.employer) return res.status(401).end();

  Employee.find({ schedule: req.user.schedule }, 'firstName lastName username', function(err, employees) {
    if (err) return res.status(500).end();
    return res.json({ employees: employees });
  });
});

 /**
 * GET /users/:id
 *
 * Description: Retrieves information about specified user.
 *
 * Path Params:
 *   id - EmployeeID
 *
 * Permissions: Employers can retrive any user within schedule, and employees can retrieve only themselves.
 *
 * Response: {
 *   employee: Employee
 * }
 *
 */

router.get('/:id', function(req, res) {
  // check permissions -- employer or self
  if (! req.user.employer && String(req.user._id) !== String(req.params.id)) {
    return res.status(401).end();
  }

  Employee.findOne({ _id: String(req.params.id), schedule: req.user.schedule }, 'firstName lastName username', function(err, employee) {
    if (err) {
      return res.status(500).end();
    } else {
      return res.json({ employee: employee });
    }
  });
});

module.exports = router;
