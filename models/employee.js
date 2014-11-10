var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

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
    required: true
  }
});


var Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;