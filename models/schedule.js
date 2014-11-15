var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var relationship = require('mongoose-relationship');

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
    ref: 'Employee',
    required: true,
    childPath: 'schedule'
  }
});

scheduleSchema.plugin(relationship, { relationshipPathName: 'owner' });
var Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;