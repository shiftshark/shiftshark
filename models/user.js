var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

/**
 * User
 *
 * Author: gendron@mit.edu
 */

var userSchema = mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    required: true
  }
});

userSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', userSchema);

module.exports = User;