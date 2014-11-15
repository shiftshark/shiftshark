var express = require('express');
var router = express.Router();
var Shift = require('../models/shift');
var Employee = require('../models/employee');
var Avail = require('../models/availability');
var Series = require('../models/series');
var Position = require('../models/position');


/**
 * API Specification Authors: aandre@mit.edu, gendron@mit.edu
 * API Implementation Author: gendron@mit.edu
 */

/**
 * Shift Object Specification
 *
 * Shift: {
 *   _id: ShiftID,
 *   assignee: Employee,
 *   claimant: Employee || null,
 *   position: Position,
 *   startTime: [0, 1439],
 *   endTime: [0, 1439],
 *   date: Date,
 *   trading: Boolean
 * }
 */

/**
 * GET /shifts/
 *
 * Description: Retrieve specified shifts within the schedule.
 *
 * Permissions: An employee within a schedule may retrieve information about any shift within that schedule.
 *
 * Query Params:
 *   startDate - shifts occurring after or on Date
 *   endDate - shifts occurring before or on Date
 *   trading - include shifts currently offered for trading (options: 0 or 1, default: Any)
 *   assignee - Employee assigned to shift
 *   claimant - Employee claiming shift
 *
 * Response: {
 *   shifts: Shift[]
 * }
 *
 */

router.get('/', function(req, res) {
  // TEST ME
  // TODO: check permissions
  var filters = {};
  var dateFilter = {};
  if (req.query.trading != undefined) {
    if (req.query.trading === '1' || req.query.trading === 'true') filters.trading = true;
    if (req.query.trading === '0' || req.query.trading === 'false') filters.trading = false;
    return res.status(400).send("Unable to parse 'trading' parameter value.")
  }
  if (req.query.assignee) {
    filters.assignee = req.query.assignee;
  }
  if (req.query.claimant) {
    filters.claimant = req.query.claimant;
  }
  if (req.query.startDate) {
    dateFilter["$gte"] = req.query.startDate;
  }
  if (req.query.endDate) {
    dateFilter["$lte"] = req.query.endDate;
  }
  if (req.query.startDate || req.query.endDate) {
    filters.date = dateFilter;
  }

  Shift.find(filters, function(err, shifts) {
    if (err) {
      // handle error
    } else {
      res.json({ shifts: shifts });
    }
  });
});


/**
 * POST /shifts/
 *
 * Description: Create a single shift or a series of recurring shifts.
 *
 * Permissions: Schedule's owner (employer) may create shift with any employees and positions within their own schedule.
 *
 * Notes:
 *   * shift.assignee: must not have conflicting shift
 *   * shift.claimant: (optional) must not have conflicting shift
 *   * shift.startTime must occur before shift.endTime
 *   * startDate and endDate: multiple Shifts will be created on same weekday within date range
 *   * startDate <= shift.date; endDate >= shift.date
 *
 * Request: {
 *   shift: Shift,
 *   startDate: (optional) Date,
 *   endDate: (optional) Date
 * }
 *
 * Response: {
 *   shifts: Shift[]
 * }
 *
 */

router.post('/', function(req, res) {
  // TEST ME
  // TODO: check permissions
  var series = new Series({ schedule: req.user.schedule._id });
  series.save(function(err, _series) {
    if (err) {
      // handle error
    } else {
      if (req.body.startDate || req.body.endDate) {
        // TODO?: parse these dates.
        var firstDate = req.body.startDate || req.body.shift.date;
        var lastDate = req.body.endDate || req.body.shift.date;
        var endDate = new Date(lastDate);

        var shiftTemplate = req.body.shift;
        shiftTemplate.series = _series._id;
        var allShifts = [];
        var millisecsInWeek = 7 * 24 * 60 * 60 * 1000;

        for (var currentDate = new Date(firstDate); currentDate < endDate; currentDate = new Date(currentDate.getTime() + millisecsInWeek)) {
          shiftTemplate.date = currentDate;
          var newShift = new Shift(shiftTemplate);
          newShift.save(function(err, _shift) {
            if (err) {
              // handle error
            } else {
              allShifts.push(_shift);
              if(endDate - currentDate < millisecsInWeek) {
                res.json({ shifts: allShifts });
              }
            }
          });
        }

      } else {
        // create a single shift
        var newShift = new Shift(req.body.shift);
        newShift.save(function(err, shift) {
          if (err) {
            // handle error
          } else {
            shift.populate('assignee claimant schedule position').exec(function(err, _shift) {
              if (err) {
                // handle error
              } else {
                res.json({ shifts: [_shift] });
              }
            });
          }
        });
      }
    }
  });
});


/**
 * GET /shifts/:id
 *
 * Description: Retrieves specified shift.
 *
 * Permissions: User must be an employee within the schedule.
 *
 * Path Params:
 *   id - Shift identifier
 *
 * Response: {
 *   shift: Shift,
 *   startDate: Date,
 *   endDate: Date
 * }
 *
 */

router.get('/:id', function(req, res) {
  // TEST ME
  // TODO: check permissions
  Shift.findById(req.params.id, function(err, shift) {
    Shift.find({ series: shift.series }, function(err, shifts) {
      var dates = shifts.map(function(obj) { return obj.date; });
      res.json({
        shift: shift,
        startDate: Math.min(dates),
        endDate: Math.max(dates)
      });
    });
  });
});

/**
 * PUT /shifts/:id
 *
 * Description: Modify specified shift or modify range over which shift series occurs.
 *
 * Permissions:
 *   * Employer will be able to modify entire shift and use all query params.
 *   * Assignee will be able to trade shift (change 'trading' if no 'claimant').
 *   * Any Employee will be able to claim offered ('trading') shift.
 *
 * Path Params:
 *   id - Shift identifier
 *
 * Query Params:
 *   adjustStart - (optional) Date to extend start of shift series
 *   adjustEnd - (optional) Date to extend end of shift series
 *   trade - (optional) trade the shift as requestor (options: offer, claim)
 *
 * Notes:
 *   * claimant: (optional) must not have conflicting shift
 *   * startTime must occur before endTime
 *   * all fields immutable (ingored) except claimant, trading
 *   * adjustStart <= startDate of series; adjustEnd >= startDate of series
 *   * adjustStart and adjustEnd ignored if trade specified
 *   * request body ignored if any query params specified
 *
 * Request: {
 *   shift: (optional) Shift
 * }
 *
 * Response: {
 *   shifts: Shift[]
 * }
 *
 */

 router.put('/:id', function(req, res) {
  // TEST ME
  // TODO: check permissions
  if (req.query.adjustStart || req.query.adjustEnd) {
    // TODO?: parse these dates.
    var millisecsInWeek = 7 * 24 * 60 * 60 * 1000;
    var firstDate = req.body.startDate || req.body.shift.date + millisecsInWeek;
    var lastDate = req.body.endDate || req.body.shift.date - millisecsInWeek;
    var endDate = new Date(lastDate);
    var allShifts = [];

    Shift.findById(req.params.id, function(err, shiftTemplate) {

      for (var currentDate = new Date(firstDate); currentDate <= endDate; currentDate = new Date(currentDate.getTime() + millisecsInWeek)) {
        shiftTemplate.date = currentDate;
        var newShift = new Shift(shiftTemplate);
        newShift.save(function(err, _shift) {
          if (err) {
            // handle error
          } else {
            allShifts.push(_shift);
            if(endDate - currentDate < millisecsInWeek) {
              res.json({ shifts: allShifts });
            }
          }
        });
      }
    });

  } else {
    if (req.query.trade) {
      if (req.query.trade == "offer") {
        doc = { trading: true };
      } else if (req.query.trade == "claim") {
        doc = { trading: false, claimant: req.user._id };
      }
    } else {
      var update = req.body.shift;
      var doc = {
        trading: update.trading,
        claimant: update.claimant
      };
    }
    Shift.findOneAndUpdate({ _id: req.params.id }, doc, function(err, shift) {
      if (err) {
        // handle error
      } else {
        res.json({ shifts: [shift] });
      }
    });
  }
 });

/**
 * DELETE /shifts/:id
 *
 * Description: Delete specified shift (single shift) or partial series of shifts.
 *
 * Path Params:
 *   id - Shift identifier
 *
 * Query Params:
 *   startDate - (optional) shifts in series to delete after or on Date
 *   endDate - (optional) shifts in series to delete before or on Date
 *
 * Response: {
 *   shiftIds: ShiftID[]
 * }
 *
 * Notes:
 *   * startDate and endDate: multiple Shifts will be deleted within the series
 *   * startDate <= shift.date; endDate >= shift.date
 *
 */

router.delete('/:id', function(req, res) {
  // TEST ME
  // TODO: check permissions
  if (req.query.startDate || req.query.endDate) {
    Shift.findById(req.params.id, function(err, shift) {
      if (err) {
        // handle error
      } else {
        var startDate = req.query.startDate || shift.date;
        var endDate = req.query.endDate || shift.date;
        var filters = {series: shift.series};
        filters.date = {"$gte": startDate, "$lte": endDate};
        Shift.remove(filters, function(err, shifts) {
          if (err) {
            // handle error
          } else {
            var shiftIds = shifts.map(function(obj) { return obj._id; });
            res.json({ shiftIds: shiftIds });
          }
        });
      }

    });
  } else {
    Shift.remove({ _id: req.params.id }, function(err, shift) {
      if (err) {
        // handle error
      } else {
        res.json({ shiftIds: [shift._id] });
      }
    });
  }
});

module.exports = router;