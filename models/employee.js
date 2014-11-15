var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var relationship = require('mongoose-relationship');
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
    ref: 'Schedule',
    childPath: 'owner'
  }
});

employeeSchema.plugin(passportLocalMongoose);
employeeSchema.plugin(relationship, { relationshipPathName: 'schedule' });
var Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;