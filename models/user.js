var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var employeeSchema = mongoose.Schema({
  name: String
});

var employerSchema = mongoose.Schema({
  name: String
});

var userSchema = mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    required: true
  },
  employer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employer'
  },
});

userSchema.plugin(passportLocalMongoose);
var Employee = mongoose.model('Employee', employeeSchema);
var Employer = mongoose.model('Employer', employerSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
  Employee: Employee,
  Employer: Employer,
  User: User
};