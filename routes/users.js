var express = require('express');
var router = express.Router();
var Employee = require('../models/employee');
var Schedule = require('../models/schedule');
var words = require('random-words');

/**
 * API Specification Authors: aandre@mit.edu, gendron@mit.edu
 */

/**
 * Employee Object Specification
 *
 * Employee: {
 *   _id: EmployeeID,
 *   firstName: String,
 *   lastName: String.
 *   email: String
 * }
 */

/**
 * POST /users/employers/
 *
 * Description: Create a new employer account with a schedule.
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

router.post('/employers', function(req, res) {
  // TEST ME
  // TODO: validate
  var userAttributes = {
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    username: req.body.email
  };
  Employee.register(new Employee(userAttributes), req.body.password, function(err, user) {
    if (err) {
      // handle error
    } else {
      var newSchedule = new Schedule({ name: req.body.schedule_name, owner: user._id });
      newSchedule.save(function(err) {
        if (err) {
          // handle error
        } else {
          res.status(200);
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
 */

router.post('/employees', function(req, res) {
  // TEST ME
  // check permissions
  // TODO: validate
  var userAttributes = {
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    username: req.body.email
    schedule: req.user.schedule._id; // use employer's schedule
  };
  var generatedPassword = words({ min: 3, max: 5, join: '' });
  Employee.register(new Employee(userAttributes), generatedPassword, function(err, user) {
    if (err) {
      // handle error
    } else {
      // send employee an email
      res.send(200);
    }
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

router.get('/employees', function(req, res) {
  // TEST ME
  // check permissions
  Employee.find({ "schedule._id": req.user.schedule._id }, function(err, employees) {
    if (err) {
      // handle error
    } else {
      req.json({ employees: employees });
    }
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
 * Permissions: Employers only.
 *
 * Response: {
 *   employee: Employee
 * }
 *
 */

router.get('/:id', function(req, res) {
  // TEST ME
  // check permissions
  Employee.findById(req.params.id, function(err, employee) {
    if (err) {
      // handle error
    } else {
      res.json({ employee: employee });
    }
  });
});

module.exports = router;
