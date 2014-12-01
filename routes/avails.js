var express = require('express');
var router = express.Router();
var Shift = require('../models/shift');
var Employee = require('../models/employee');
var Avail = require('../models/availability');
var Series = require('../models/series');
var Position = require('../models/position');
/**
 * API Specification Authors: aandre@mit.edu, gendron@mit.edu
 */

/**
 * Availability Object Specification
 *
 * Avail: {
 *   _id: AvailID,
 *   employee: Employee,
 *   day: [0,6],
 *   startTime: [0, 1439],
 *   endTime: [0, 1439]
 * }
 */

/**
 * GET /avails/
 *
 * Description: Retrieves specified availibilities.
 *
 * Permissions:
 *   * Employer can retrieve any employee's availibility.
 *   * Employee can retrieve own availability.
 *
 * Query Params:
 *   * employee - Employee identifier
 *   * day - weekday that employees are available [0,6]
 *
 * Response: {
 *   avails: Avail[]
 * }
 *
 */

router.get('/', function(req, res) {
  var filters = {};
  if (req.query.day) {
    filters.day = req.query.day;
  }
  if (req.user.employer) {
    if (req.query.employee) {
      filters.employee = req.query.employee;
    }
  } else {
    filters.employee = req.user._id;
  }
  Avail.find(filters).populate('employee').exec(function(err, avails) {
    if (err) {
      return req.status(500).end();
    } else {
      return res.json({ avails: avails });
    }
  });
});

 /**
 * POST /avails/
 *
 * Description: Create a new availability object.
 *
 * Permissions:
 *   * An employer can create availability for any employee.
 *   * An employee can create availability for themselves.
 *
 * Notes:
 *   * startTime < endTime
 *   * cannot conflict with existing availability objects' times
 *
 * Request: {
 *   avail: Avail
 * }
 *
 * Response: {
 *   avail: Avail
 * }
 *
 */

router.post('/', function(req, res) {
  // check permissions
  if (req.user.employer || String(req.user._id) === String(req.body.avail.employee)) {
    var fields = req.body.avail;
    fields.schedule = req.user.employee.schedule;
    // find conflicting availability objects
    Avail.find({ employee: req.user._id, day: fields.day,
      "$and": [{ endTime: { "$gte": fields.startTime } }, { startTime: { "$lte": fields.endTime } }] },
      function(err, avails) {
        if (err) {
          return res.status(500).end();
        } else if (avails) {
          // conflicts found, don't create
          return res.status(400).end();
        } else {
          var newAvail = new Avail(fields);
          newAvail.save(function(err, avail) {
            if (err) {
              return res.status(500).end();
            } else {
              res.json({ avail: avail });
            }
          });
        }
    });
  } else {
    // permission denied
    res.status(401).end();
  }
});

 /**
 * GET /avails/:id
 *
 * Description: Retrieve a specific availability object.
 *
 * Permissions:
 *   * Employer can retrieve any employee's availibility.
 *   * Employee can retrieve own availability.
 *
 * Path Params:
 *   id - Availibility identifier
 *
 * Response: {
 *   avail: Avail
 * }
 *
 */

router.get('/:id', function(req, res) {
  if (req.user.employer || String(req.user._id) === String(req.params.id)) {
    Avail.findById(req.params.id).populate('employee').exec(function(err, avail) {
      if (err) {
        return res.status(500).end();
      } else {
        res.json({ avail: avail });
      }
    });
  }
});

 /**
 * PUT /avails/:id
 *
 * Description: Modify the specified availability.
 *
 * Permissions: Only employee can modify own availability.
 *
 * Path Params:
 *   id - Availibility identifier
 *
 * Notes:
 *   * startTime < endTime
 *   * only startTime and endTime are mutable
 *   * cannot conflict with existing availability objects' times
 *
 * Request: {
 *   avail: Avail
 * }
 *
 * Response: {
 *   avail: Avail
 * }
 *
 */

router.put('/:id', function(req, res) {
  Avail.findById(req.params.id, function(err, avail) {
    if (err) {
      return res.status(500).end();
    } else {
      if (String(req.user._id) === String(avail.employee)) {
        Avail.find({ employee: req.user._id, day: avail.day,
          "$and": [{ endTime: { "$gte": req.body.startTime || (avail.startTime + 1) } }, { startTime: { "$lte": req.body.endTime || (avail.endTime - 1) } }] },
          function(err, avails) {
            if (err) {
              return res.status(500).end();
            } else if (avails) {
              // conflicts found, don't create
              return res.status(400).end();
            } else {
              avail.update(req.query, function(err, _avail) {
                if (err) {
                  return res.status(500).end();
                } else {
                  res.json({ avail: _avail });
                }
              });
            }
        });
      } else {
        // permission denied
        return res.status(401).end();
      }
    }
  });
});

 /**
 * DELETE /avails/:id
 *
 * Description: Delete specified availability.
 *
 * Permissions: Only employee can delete own availability.
 *
 * Path Params:
 *   id - Availibility identifier
 *
 * Response: {
 *   availId: AvailID
 * }
 *
 */

router.delete('/:id', function(req, res) {
  Avail.findById(req.params.id, function(err, avail) {
    if (err) {
      return res.status(500).end();
    } else {
      if (String(avail.employee) === String(req.user._id)) {
        avail.remove(function(err, _avail) {
          if (err) {
            return res.status(500).end();
          } else {
            return res.json({ availId: avail._id });
          }
        });
      } else {
        // permission denied
        return res.status(401).end(); 
      }
    }
  });
});


module.exports = router;