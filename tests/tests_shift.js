/**
 * Automated tests for Shifts.
 * Author:
*/


function compare_shifts(first, second) {
  deepEqual(typeof second.assignee, "object", "assignee field populates");
  for(var field in first) {
    if (field == "date") deepEqual((new Date(first[field])).getTime(), new Date(second[field]).getTime(), "date verified");
    else if (field != "assignee") deepEqual(first[field], second[field], field + " verified");
  }
}


////////////////
// POST Shift //
////////////////

test('Shift - POST /shifts/', function () {
  // Employer Test Account LOGIN
  test_employer_login();

  // create an employee
  tim = client_signup_employee({
    first_name: "Tim",
    last_name: "Beaver",
    email: "tim-the-beaver@beavers.com"
  });
  timID = tim.data.employee._id;

  // create their position
  position = client_positions_create({ name: "Mascot" });

  var shift = {
    assignee: timID,
    claimant: null,
    position: position.data.position._id,
    startTime: 0,
    endTime: 60,
    date: new Date("Jan 14 2014"),
    trading: false
  };

  // create a single shift
  var singleShiftCreate = client_shifts_create(shift, null, null);
  var _shift = singleShiftCreate.data.shift;
  compare_shifts(shift, _shift);

  // create multiple shifts in a series by specifying start and end dates
  var multiShiftCreateBoth = client_shifts_create(shift, new Date("Jan 01 2014"), new Date("Feb 4 2014"));
  var _shift = multiShiftCreateBoth.data.shift;
  compare_shifts(shift, _shift);

  // test dates with times

  // create multiple shifts in a series with start date only
  var multiShiftCreateStart = client_shifts_create(shift, new Date(2014, 0, 1, 5, 2), null);
  var _shift = multiShiftCreateStart.data.shift;
  compare_shifts(shift, _shift);

  // create multiple shifts in a series with end date only
  var multiShiftCreateEnd = client_shifts_create(shift, null, new Date(2014, 1, 6, 4, 39));  
  var _shift = multiShiftCreateEnd.data.shift;
  compare_shifts(shift, _shift);

  clear_employer();

  // ok(true);
});

///////////////
// GET Shift //
///////////////

test('Shift - GET /shifts/', function () {

  // new shift, using previous data
  var mayShift = {
    assignee: timID,
    claimant: null,
    position: position.data.position._id,
    startTime: 600,
    endTime: 700,
    date: new Date("May 1 2014"),
    trading: true
  };
  var januaryShift = {
    assignee: timID,
    claimant: null,
    position: position.data.position._id,
    startTime: 600,
    endTime: 700,
    date: new Date("Jan 1 2014"),
    trading: false
  };

  var maySavedShift = client_shifts_create(mayShift, null, null);
  var januarySavedShift = client_shifts_create(januaryShift, null, null);
  
  // filter by trading
  var getTradingShift = client_shifts_get_all({ trading: true });
  deepEqual(maySavedShift.data.shift, getTradingShift.data.shifts[0], "filter by trading");

  // filter by employee
  var getTimsShifts = client_shifts_get_all({ employee: timID });
  deepEqual([maySavedShift.data.shift, januarySavedShift.data.shift], getTimsShifts.data.shifts, "filter by employee");

  // filter by start date
  var getMayShift = client_shifts_get_all({ startDate: new Date("May 1 2014") });
  deepEqual(maySavedShift.data.shift, getMayShift.data.shifts[0], "filter by start date");

  // filter by end date
  var getJanShift = client_shifts_get_all({ endDate: new Date("Jan 1 2014") });
  deepEqual(januarySavedShift.data.shift, getJanShift.data.shifts[0], "filter by end date");

  // filter by both start and end dates 
  var getBothShifts = client_shifts_get_all({ startDate: new Date("Jan 1 2014"), endDate: new Date("May 1 2014") });
  deepEqual([maySavedShift.data.shift, januarySavedShift.data.shift], getBothShifts.data.shifts, "filter by start and end dates");

  clear_employer();

});

test('Shift - GET /shifts/:id', function () {

  // new shift, using previous data
  var shift = {
    assignee: timID,
    claimant: null,
    position: position.data.position._id,
    startTime: 600,
    endTime: 700,
    date: new Date("Jan 2 2014"),
    trading: false
  };

  var savedShift = client_shifts_create(shift, new Date("Jan 1 2014"), new Date("Jan 30 2014"));
  var getShift = client_shifts_get_one(savedShift.data.shift._id);
  compare_shifts(getShift.data.shift, savedShift.data.shift, "shift object correct");
  equal( (new Date(getShift.data.startDate)).getTime(), (new Date("Jan 2 2014")).getTime(), "startDate correct");
  equal( (new Date(getShift.data.endDate)).getTime(), (new Date("Jan 30 2014")).getTime(), "endDate correct");

  clear_employer();
  // ok(true);
});

///////////////
// PUT Shift //
///////////////

test('Shift - PUT /shifts/:id', function () {

  var shift = {
    assignee: timID,
    claimant: null,
    position: position.data.position._id,
    startTime: 600,
    endTime: 700,
    date: new Date("Nov 4 2014"),
    trading: false
  };

  // extend a single shift
  var savedShift = client_shifts_create(shift, null, null);
  var start = new Date(2014, 9, 3, 14, 2);
  var end = new Date(2014, 11, 4, 4, 1);
  var extendBothWays = client_shifts_change(savedShift.data.shift._id, {
    adjustStart: start,
    adjustEnd: end
  }, null);

  // dates we expect to create shifts on
  var dateStrings = ["Oct 07 2014", "Oct 14 2014", "Oct 21 2014", "Oct 28 2014",
  "Nov 11 2014", "Nov 18 2014", "Nov 25 2014", "Dec 02 2014"];

  var dateTimes = dateStrings.map(function(date) {
    return (new Date(date)).getTime();
  });
  var returnedTimes = extendBothWays.data.shifts.map(function(obj) {
    return (new Date(obj.date)).getTime();
  });

  deepEqual(returnedTimes, dateTimes, "objects created on correct dates");

  // adjust start date to AFTER shift - should not add anything
  var savedShift = client_shifts_create(shift, null, null);
  var badStart = new Date(2015, 9, 3, 14, 2);  
  var extendStartBad = client_shifts_change(savedShift.data.shift._id, {
    adjustStart: badStart
  }, null);

  equal(extendStartBad.data.shifts.length, 0, "no shifts created on incorrect adjustStart");

  // adjust end date to BEFORE shift - should not add anything
  var badEnd = new Date(2013, 9, 3, 14, 2);  
  var extendEndBad = client_shifts_change(savedShift.data.shift._id, {
    adjustEnd: badEnd
  }, null);

  equal(extendEndBad.data.shifts.length, 0, "no shifts created on incorrect adjustEnd");

  // offer a shift up for trade - should fail because Tim isn't signed in
  var offerShiftFail = client_shifts_change(savedShift.data.shift._id, {
    trade: "offer"
  }, null);

  equal(offerShiftFail.statusCode, 401, "prevent user from trading another's shift");

  // create a shift up for trade, and then claim it
  shift.trading = true;
  var tradingShift = client_shifts_create(shift, null, null);
  var claimShift = client_shifts_change(tradingShift.data.shift._id, {
    trade: "claim"
  }, null);

  equal(claimShift.data.shifts[0].trading, false, "trading flag false");
  equal(typeof claimShift.data.shifts[0].claimant, "object", "claimant field populated");

  // now that I'm claimant, offer up for trade again
  var offerShiftSucceed = client_shifts_change(claimShift.data.shifts[0]._id, {
    trade: "offer"
  }, null);
  equal(offerShiftSucceed.data.shifts[0].trading, true, "claimant offer successful");

  // as employer, give Tim's shift to Ben
  var ben = client_signup_employee({
    first_name: "Ben",
    last_name: "Bitdiddle",
    email: "hacker4lyfe@hardkore.org"
  });

  var timsShift = client_shifts_create(shift, null, null);
  var forceGiveToBen = client_shifts_change(timsShift.data.shift._id, null, {
    claimant: ben.data.employee._id
  });

  equal(forceGiveToBen.data.shifts[0].claimant._id, ben.data.employee._id, "give shift to a different employee as employer");

  clear_employer();
});

//////////////////
// DELETE Shift //
//////////////////

test('Shift - DELETE /shifts/:id', function() {

  var shift = {
    assignee: timID,
    claimant: null,
    position: position.data.position._id,
    startTime: 600,
    endTime: 700,
    date: new Date("Feb 4 2014"),
    trading: false
  };

  // remove single shift
  var savedShift = client_shifts_create(shift, new Date("Jan 15 2014"), new Date("Mar 3 2014"));  
  var deleteShift = client_shifts_remove(savedShift.data.shift._id, null);

  equal(savedShift.data.shift._id, deleteShift.data.shiftIds[0], "single shift deleted");

  // remove multiple (6) shifts
  var savedShift = client_shifts_create(shift, new Date("Jan 15 2014"), new Date("Mar 3 2014"));  
  var deleteMultiple = client_shifts_remove(savedShift.data.shift._id, {
    startDate: new Date("Jan 15 2014"),
    endDate: new Date("Mar 3 2014")
  });

  equal(deleteMultiple.data.shiftIds.length, 6, "deleted multiple shifts");

  // Employer Test Account LOGOUT
  client_logout();
});