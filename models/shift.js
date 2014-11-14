var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var timestamps = require('mongoose-times');

/**
 * Shift - A single time block during which a particular employee works within a schedule.
 *
 * assignee:     the original employee that an employer assigned to the shift
 *               if null, this is an open shift
 *
 * claimant:     the current employee who has claimed this shift
 *
 * schedule:     the schedule within which the shift occurs
 *
 * position:     the position worked during this shift
 *
 * series:       an identifier linking instances of a recurring shift together
 *
 * date:         the date on which this shift occurs
 *
 * startTime:    the number of minutes from midnight (00:00) that this shift begins
 *
 * endTime:      the number of minutes from midnight (00:00) that this shift ends
 *
 * trading:      true if this shift is offered for trading and can be claimed by another user
 *
 * ---
 *
 * created:      timestamp denoting when shift was initially created
 *
 * lastUpdated:  timestamp denoting when shift was last updated
 *
 * Authors: gendron@mit.edu, aandre@mit.edu
 */

var shiftSchema = mongoose.Schema({
  assignee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    required: true
  },
  claimant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    default: null,
    required: true
  },
  schedule: {
    type: mongoose.Schema.ObjectId,
    ref: 'Schedule',
    required: true
  },
  position: {
    type: mongoose.Schema.ObjectId,
    ref: 'Position',
    required: true
  },
  series: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  startTime: {
    type: Number,
    min: 0,
    max: (60*24 - 1),
    required: true
  },
  endTime: {
    type: Number,
    min: 0,
    max: (60*24 - 1),
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  trading: {
    type: Boolean,
    default: false,
    required: true
  }
});

shiftSchema.plugin(timestamps);
var Shift = mongoose.model('Shift', shiftSchema);

// validate that the end time/date is after the start time/date
Shift.schema.path('endTime').validate(function (endTime) {
  return endTime > this.startTime;
});

Shift.schema.path('startTime').validate(function (startTime) {
  return startTime < this.endTime;
});

module.exports = Shift;