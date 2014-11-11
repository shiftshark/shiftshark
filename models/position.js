var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/**
 * Position - A spectific role existing within a schdule that can be assigned to an employee during a given shift.
 *
 * Author: aandre@mit.edu
 */

var positionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  schedule: {
    type: mongoose.Schema.ObjectId,
    ref: 'Schedule',
    required: true
  }
});

var Position = mongoose.model('Position', positionSchema);

module.exports = Position;