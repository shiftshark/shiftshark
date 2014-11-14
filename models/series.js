var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/**
 * Series - A link between shift instances representing a recurrence.
 *
 * Author: gendron@mit.edu
 */

var seriesSchema = mongoose.Schema({
  schedule: {
    type: mongoose.Schema.ObjectId,
    ref: 'Schedule',
    required: true
  }
});

var Series = mongoose.model('Series', seriesSchema);

module.exports = Series;