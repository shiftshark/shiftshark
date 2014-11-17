var express = require('express');
var router = express.Router();
var Shift = require('../models/shift');
var Employee = require('../models/employee');
var Avail = require('../models/availability');
var Series = require('../models/series');
var Position = require('../models/position');

/**
 * API Specification Author: aandre@mit.edu
 * API Implementation Author: gendron@mit.edu
 */

/**
 * Position Object Specification
 *
 * Position: {
 *   _id: PositionID,
 *   name: String
 * }
 */

/**
 * GET /positions/
 *
 * Description: Retrieves all positions.
 *
 * Permissions: All users can retrieve positions in their schedule.
 *
 * Response: {
 *   positions: Position[]
 * }
 *
 */

router.get('/', function(req, res) {
  var schedule = req.user.schedule._id;
  Position.find({ schedule: schedule }, function(err, positions) {
    if (err) {
      // handle error
    } else {
      res.json({ positions: positions });
    }
  });
});

 /**
 * POST /positions/
 *
 * Description: Create a new position.
 *
 * Permissions: Employers only.
 *
 * Request: {
 *   position: Position
 * }
 *
 * Response: {
 *   position: Position
 * }
 *
 */

router.post('/', function(req, res) {
  //TODO: check permissions
  var position = new Position(req.body.position);
  position.save(function(err, _position) {
    if (err) {
      // handle error
    } else {
      res.json({ position: _position });
    }
  });
});

 /**
 * GET /positions/:id
 *
 * Description: Retrieve the specific position.
 *
 * Permissions: All users can retrieve positions in their schedule.
 *
 * Path Params:
 *   id - Availibility identifier
 *
 * Response: {
 *   position: Position
 * }
 *
 */

router.get('/:id', function(req, res) {
  var schedule = req.user.schedule._id;
  Position.findById(req.params.id, function(err, position) {
    if (err) {
      // handle error
    } else {
      if(position.schedule._id == schedule) {
        res.json({ position: position });
      } else {
        res.status(403).send('Permission denied. This position is outside of your schedule.');
      }
    }
  });
});

 /**
 * PUT /positions/:id
 *
 * Description: Modify the specified position.
 *
 * Permissions: Employers only.
 *
 * Path Params:
 *   id - Availibility identifier
 *
 * Request: {
 *   position: Position
 * }
 *
 * Response: {
 *   position: Position
 * }
 *
 */

router.put('/:id', function(req, res) {
  // TODO: check permissions
  Position.findOneAndUpdate(req.params.id, req.body.position, function(err, position) {
    if (err) {
      // handle error
    } else {
      res.json({ position: position });
    }
  });
});

 /**
 * DELETE /positions/:id
 *
 * Description: Delete specified position and associated shifts.
 *
 * Permissions: Employers only.
 *
 * Path Params:
 *   id - Availibility identifier
 *
 * Response: {
 *   positionId: PositionID
 * }
 *
 */

router.delete('/:id', function(req, res) {
  // TODO: check permissions
  Position.remove({ _id: req.params.id }, function(err, position) {
    if (err) {
      // handle error
    } else {
      Shift.remove({ position: req.params.id }, function(err, shift) {
        if (err) {
          // handle error
        } else {
          res.json({ positionId: req.params.id });
        }
      });
    }
  });
});

module.exports = router;