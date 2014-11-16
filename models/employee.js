var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

/**
 * Employee - A user working within a schedule.
 *
 * Author: aandre@mit.edu
 */

var employeeSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  schedule: {
    type: mongoose.Schema.ObjectId,
    ref: 'Schedule'
  },
  employer: {
    type: Boolean,
    required: true,
    default: false
  }
});

employeeSchema.plugin(passportLocalMongoose);
var Employee = mongoose.model('Employee', employeeSchema);

Employee.schema.path('username').validate(function(username) {
  return /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/.test(username);
}, 'malformed email');

module.exports = Employee;