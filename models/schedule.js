var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/**
 * Schedule - A scheduling calendar, typically associated with a single organization.
 *
 * Author: aandre@mit.edu
 */

var scheduleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

var Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;