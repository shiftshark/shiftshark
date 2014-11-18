var express = require('express');
var router = express.Router();
var Shift = require('../models/shift');
var Employee = require('../models/employee');
var Avail = require('../models/availability');
var Series = require('../models/series');
var Position = require('../models/position');

var fieldsToReturn = 'assignee claimant position date startTime endTime trading';
var userFieldsToHide = '-hash -salt -schedule';


/**
 * API Specification Authors: aandre@mit.edu, gendron@mit.edu
 * API Implementation Author: gendron@mit.edu
 */

/**
 * Shift Object Specification
 *
 * Shift: {
 *   _id: ShiftID,
 *   assignee: EmployeeID,
 *   claimant: EmployeeID || null,
 *   position: PositionID,
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
  var filters = { schedule: req.user.schedule };
  var dateFilter = {};
  if (req.query.trading != undefined) {
    if (req.query.trading === '1' || req.query.trading === 'true') {
      filters.trading = true;
    } else if (req.query.trading === '0' || req.query.trading === 'false') {
      filters.trading = false;
    } else {
      return res.status(400).send("Unable to parse 'trading' parameter value.");
    }
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

  Shift.find(filters, fieldsToReturn).populate('assignee claimant', userFieldsToHide).exec(function(err, shifts) {
    if (err) {
      return res.status(500).end();
    } else {
      return res.json({ shifts: shifts });
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
 *   * assignee and claimant fields are populated in returned objects
 *   * response.shift contains the shift specified in the request body only, even if other shifts were created
 *
 * Request: {
 *   shift: Shift,
 *   startDate: (optional) Date,
 *   endDate: (optional) Date
 * }
 *
 * Response: {
 *   shift: Shift
 * }
 *
 */

router.post('/', function(req, res) {
  // check permissions
  if (! req.user.employer) return res.status(401).end();

  var series = new Series({ schedule: req.user.schedule });
  series.save(function(err, _series) {
    if (err) {
      console.log("save series", err);
      return res.status(500).end();
    } else {
      if (req.body.startDate || req.body.endDate) {
        var startDate = new Date(req.body.startDate || req.body.shift.date);
        var endDate = new Date(req.body.endDate || req.body.shift.date);
        var specifiedDate = new Date(req.body.shift.date);

        // strip dates down to only year, month, day
        // NOTE: sometimes setting to UTC changes what day of the week it is - using setHours instead
        startDate.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);
        specifiedDate.setHours(0,0,0,0);

        millisecsInDay = 24 * 60 * 60 * 1000;
        var specifiedDay = specifiedDate.getDay();

        if (startDate.getDay() < specifiedDay) {
          startDate = new Date(Math.abs(startDate.getDay() - specifiedDay) * millisecsInDay + startDate.getTime());
        } else if (startDate.getDay() > specifiedDay) {
          startDate = new Date(Math.abs(- startDate.getDay() + specifiedDay + 7) * millisecsInDay + startDate.getTime());
        }

        var shiftTemplate = req.body.shift;
        shiftTemplate.series = _series._id;
        shiftTemplate.schedule = req.user.schedule;
        var millisecsInWeek = 7 * millisecsInDay;

        var allShifts = [];
        for (var currentDate = startDate; currentDate.getTime() <= endDate.getTime(); currentDate = new Date(currentDate.getTime() + millisecsInWeek)) {
          shiftTemplate.date = currentDate;
          allShifts.push(new Shift(shiftTemplate));
        }
        Shift.create(allShifts, function(err) {
          console.log("inside create");
          if (err) {
            console.log("create allShifts");
            return res.status(500).end();
          } else {
            for(var i = 1; i < arguments.length; i++) {
              var shift = arguments[i];
              if (new Date(shift.date).getTime() == specifiedDate.getTime()) {
                Shift.findOne(shift, fieldsToReturn).populate('assignee claimant', userFieldsToHide).exec(function(err, _shift) {
                  if (err) {
                    console.log("populate specified shift in multishift creation");
                    return res.status(500).end();
                  } else {
                    return res.json({ shift: _shift });
                  }
                });
              }
            }
          }
        });
      } else {
        // create a single shift
        var shiftTemplate = req.body.shift;
        shiftTemplate.schedule = req.user.schedule;
        shiftTemplate.series = _series._id;

        var newShift = new Shift(shiftTemplate);
        newShift.save(function(err, shift) {
          if (err) {
            console.log("saving new shift", err);
            return res.status(500).end();
          } else {
            Shift.findOne(shift, fieldsToReturn).populate('assignee claimant', userFieldsToHide).exec(function(err, _shift) {
              if (err) {
                console.log("populate new shift", err);
                return res.status(500).end();
              } else {
                return res.json({ shift: _shift });
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
  Shift.findOne({ _id: req.params.id, schedule: req.user.schedule }).populate('assignee claimant', userFieldsToHide).exec(function(err, shift) {
    Shift.find({ series: shift.series }, function(err, shifts) {
      var dates = shifts.map(function(obj) { return new Date(obj.date).getTime(); });
      var startDate = new Date(Math.min.apply(null, dates));
      var endDate = new Date(Math.max.apply(null, dates));
      // remove fields frontend shouldn't access
      var secureShift = {};
      var fields = fieldsToReturn.split(' ');
      for(var i = 0; i < fields.length; i++) {
        secureShift[fields[i]] = shift[fields[i]];
      }
      return res.json({
        shift: secureShift,
        startDate: startDate,
        endDate: endDate
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
 *   * Employer will be able to use query params adjustStart and adjustEnd, and claim a trade for someone else through the request body.
 *   * Assignee will be able to trade shift (change 'trading' if no 'claimant') using 'trade' query param.
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
 *   * employer sends 
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
  if (req.query.adjustStart || req.query.adjustEnd) {
    // check permissions - only employer can adjust start/end dates
    if (! req.user.employer) return res.status(401).end();

    var millisecsInWeek = 7 * 24 * 60 * 60 * 1000;

    Shift.findOne({ _id: req.params.id, schedule: req.user.schedule }).exec(function(err, shift) {
      Shift.find({ series: shift.series }, function(err, shifts) {
        if (err) {
          console.log("find shifts with series", err);
          return res.status(500).end();
        } else {
          var dates = shifts.map(function(obj) { return new Date(obj.date).getTime(); });

          // TODO: check for malformed query params
          var seriesStart = new Date(Math.min.apply(null, dates));
          var seriesEnd = new Date(Math.max.apply(null, dates));
          var specifiedDate = new Date(shift.date);
          specifiedDate.setHours(0,0,0,0);
          var specifiedDay = specifiedDate.getDay();

          // create new shifts in accordance with adjustStart/adjustEnd query params
          var shiftTemplate = {
            assignee: shift.assignee,
            claimant: null,
            schedule: shift.schedule,
            position: shift.position,
            series: shift.series,
            startTime: shift.startTime,
            endTime: shift.endTime
          }
          var allShifts = [];

          if (req.query.adjustStart) {
            var startDate = new Date(req.query.adjustStart);
            var endDate = new Date(seriesStart.getTime() - millisecsInWeek);

            startDate.setHours(0,0,0,0);
            endDate.setHours(0,0,0,0);

            if (startDate.getDay() < specifiedDay) {
              startDate = new Date(Math.abs(startDate.getDay() - specifiedDay) * millisecsInDay + startDate.getTime());
            } else if (startDate.getDay() > specifiedDay) {
              startDate = new Date(Math.abs(- startDate.getDay() + specifiedDay + 7) * millisecsInDay + startDate.getTime());
            }

            console.log("adjustStart:");
            console.log("startDate", startDate);
            console.log("endDate", endDate);
            console.log("specifiedDate", specifiedDate);

            for (var currentDate = startDate; currentDate.getTime() <= endDate.getTime(); currentDate = new Date(currentDate.getTime() + millisecsInWeek)) {
              shiftTemplate.date = currentDate;
              allShifts.push(new Shift(shiftTemplate));
            }

          }
          if (req.query.adjustEnd) {
            var startDate = new Date(seriesEnd.getTime() + millisecsInWeek);
            var endDate = new Date(req.query.adjustEnd);

            startDate.setHours(0,0,0,0);
            endDate.setHours(0,0,0,0);
            console.log("adjustEnd:");
            console.log("startDate", startDate);
            console.log("endDate", endDate);
            console.log("specifiedDate", specifiedDate);

            for (var currentDate = startDate; currentDate.getTime() <= endDate.getTime(); currentDate = new Date(currentDate.getTime() + millisecsInWeek)) {
              shiftTemplate.date = currentDate
              allShifts.push(new Shift(shiftTemplate));
            }

          }

          console.log("dates of allShifts", allShifts.map(function(obj) { return obj.date; }));

          Shift.create(allShifts, function(err) {
            if (err) {
              console.log("create all shifts", err);
              return res.status(500).end();
            } else {
              var shifts = [];
              for(var i = 1; i < arguments.length; i++) {
                var secureShift = {};
                var fields = fieldsToReturn.split(' ');
                for(var j = 0; j < fields.length; j++) {
                  secureShift[fields[j]] = arguments[i][fields[j]];
                }
                shifts.push(secureShift);
              }
              return res.json({ shifts: shifts });
            }
          });
        }
      });
    });

  } else if (req.query.trade) {
    Shift.findById(req.params.id, function(err, shift) {
      if (req.query.trade == "offer") {
        console.log("claimant", shift.claimant);
        console.log("me", req.user._id);
        if ((shift.assignee === req.user._id && !shift.claimant) || String(shift.claimant) === String(req.user._id) ) {
          doc = { trading: true };
          shift.trading = true;
        } else {
          return res.status(401).end();
        } 
      } else if (req.query.trade == "claim") {
        if (!shift.claimant && shift.trading) {
          shift.trading = false;
          shift.claimant = req.user._id;
        } else {
          return res.status(403).send('ALREADY_CLAIMED');
        }
      }
      shift.save(function(err, _shift) {
        if (err) {
          console.log("save shift after trade", err);
          res.status(500).end();
        } else {
          Shift.findOne(_shift, fieldsToReturn).populate('assignee claimant', userFieldsToHide).exec(function(err, tradedShift) {
            if (err) {
              return res.status(500).end();
            } else {
              return res.json({ shifts: [tradedShift] });
            }
          });
        }
      });
    });
  } else {
    // no query params - look at body, but only if employer sent request
    if (! req.user.employer) return res.status(401).end();

    var update = req.body.shift;
    var doc = {
      trading: update.trading,
      claimant: update.claimant
    };

    Shift.findOneAndUpdate({ _id: req.params.id }, doc, function(err, shift) {
      if (err) {
        console.log("employer only body", err);
        res.status(500).end();
      } else {
        Shift.findOne(shift, fieldsToReturn).populate('assignee claimant', userFieldsToHide).exec(function(err, _shift) {
          if (err) {
            console.log("populating employer-forced updated shift", err);
            res.status(500).end();
          } else {
            return res.json({ shifts: [_shift] });
          }
        });
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
  // check permissions
  if (! req.user.employer) return res.status(401).end();

  if (req.query.startDate || req.query.endDate) {
    Shift.findById(req.params.id, function(err, shift) {
      if (err) {
        return res.status(500).end();
      } else {
        var startDate = req.query.startDate || shift.date;
        var endDate = req.query.endDate || shift.date;
        var filters = {series: shift.series};
        filters.date = {"$gte": startDate, "$lte": endDate};
        Shift.remove(filters, function(err, shifts) {
          if (err) {
            return res.status(500).end();
          } else {
            var shiftIds = shifts.map(function(obj) { return obj._id; });
            return res.json({ shiftIds: shiftIds });
          }
        });
      }

    });
  } else {
    Shift.remove({ _id: req.params.id }, function(err, shift) {
      if (err) {
        return res.status(500).end();
      } else {
        return res.json({ shiftIds: [shift._id] });
      }
    });
  }
});

module.exports = router;