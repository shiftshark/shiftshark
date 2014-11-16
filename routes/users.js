var express = require('express');
var router = express.Router();
var Employee = require('../models/employee');
var Schedule = require('../models/schedule');

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

 /**
 * POST /users/employees/
 *
 * Description: Creates an employee wihtin the schedule, generates password, and sends email notification.
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

 module.exports = router;