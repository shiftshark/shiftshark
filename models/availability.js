var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var timestamps = require('mongoose-times');

/**
 * Availability - A time block during which an employee is willing to work.
 *
 * Author: aandre@mit.edu
 */
var availabilitySchema = mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    required: true
  },
  schedule: {
    type: mongoose.Schema.ObjectId,
    ref: 'Schedule',
    required: true
  },
  day: {
    type: Number,
    min: 0,
    max: 6,
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
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null, // null = indefinitely recurring
    required: true
  }
});

availabilitySchema.plugin(timestamps);
var Availability = mongoose.model('Availability', availabilitySchema);

// validate that the end time/date is after the start time/date
Availability.schema.path('endTime').validate(function (endTime) {
  return endTime > this.startTime;
});

Availability.schema.path('startTime').validate(function (startTime) {
  return startTime < this.endTime;
});

Availability.schema.path('startDate').validate(function (startDate) {
  return this.endDate === null || startDate < this.endDate;
});

Availability.schema.path('endDate').validate(function (endDate) {
  return endDate === null || endDate > this.startDate;
});

module.exports = Availability;