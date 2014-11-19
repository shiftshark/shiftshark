var express = require('express');
var router = express.Router();
var Shift = require('../models/shift');
var Employee = require('../models/employee');
var Avail = require('../models/availability');
var Series = require('../models/series');
var Position = require('../models/position');

/**
 * API Specification Author: aandre@mit.edu
 * API Implementation Author: gendron@mit.edu, aandre@mit.edu
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
  Position.find({ schedule: req.user.schedule }, "_id name", function(err, positions) {
    if (err) {
      return res.status(500).end();
    } else {
      return res.json({ positions: positions });
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
  var position = new Position({
    name: req.body.position.name,
    schedule: req.user.schedule
  });
  position.save(function(err, _position) {
    if (err) {
      return res.status(500).end();
    } else {
      return res.json({ position: { _id: _position._id, name: _position.name } });
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
 *   id - Position identifier
 *
 * Response: {
 *   position: Position
 * }
 *
 */

router.get('/:id', function(req, res) {
  Position.findById(req.params.id, function(err, position) {
    if (err) {
      return res.status(500).end();
    } else {
      if (!position) return res.status(400).end();
      if(String(position.schedule) === String(req.user.schedule)) {
        return res.json({ position: { _id: position._id, name: position.name } });
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
 *   id - Position identifier
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
  if (! typeof req.body.position.name === "string") return res.status(400).end();
  Position.findOneAndUpdate({ _id: req.params.id }, { name: req.body.position.name }, function(err, position) {
    if (err) return res.status(500).end();
    return res.json({ position: { _id: position._id, name: position.name } });
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
 *   id - Position identifier
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
      return res.status(500).end();
    } else {
      Shift.remove({ position: req.params.id }, function(err, shift) {
        if (err) {
          return res.status(500).end();
        } else {
          res.json({ positionId: req.params.id });
        }
      });
    }
  });
});

module.exports = router;