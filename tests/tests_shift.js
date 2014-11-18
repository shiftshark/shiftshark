/**
 * Automated tests for Shifts.
 * Author:
*/


////////////////
// POST Shift //
////////////////

test('Shift - POST /shifts/', function () {
  // Employer Test Account LOGIN
  test_employer_login();

  // create an employee
  var tim = client_signup_employee({
    first_name: "Tim",
    last_name: "Beaver",
    email: "tim-the-beaver@beavers.com"
  });
  var timID = tim.data.employee._id;

  // create their position
  var position = client_positions_create({ name: "Mascot" });

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
  deepEqual(typeof _shift.assignee, "object", "assignee field populates");
  for(var field in shift) {
    if (field == "date") deepEqual(shift[field].getTime(), new Date(_shift[field]).getTime(), "date verified");
    else if (field != "assignee") deepEqual(shift[field], _shift[field], field + " verified");
  }

  // create multiple shifts in a series by specifying start and end dates
  var multiShiftCreateBoth = client_shifts_create(shift, new Date("Jan 01 2014"), new Date("Feb 4 2014"));
  var _shift = multiShiftCreateBoth.data.shift;
  deepEqual(typeof _shift.assignee, "object", "assignee field populates");
  for(var field in shift) {
    if (field == "date") deepEqual(shift[field].getTime(), new Date(_shift[field]).getTime(), "date verified");
    else if (field != "assignee") deepEqual(shift[field], _shift[field], field + " verified");
  }

  // test dates with times

  // create multiple shifts in a series with start date only
  var multiShiftCreateStart = client_shifts_create(shift, new Date(2014, 0, 1, 5, 2), null);
  var _shift = multiShiftCreateStart.data.shift;
  deepEqual(typeof _shift.assignee, "object", "assignee field populates");
  for(var field in shift) {
    if (field == "date") deepEqual(shift[field].getTime(), new Date(_shift[field]).getTime(), "date verified");
    else if (field != "assignee") deepEqual(shift[field], _shift[field], field + " verified");
  }

  // create multiple shifts in a series with end date only
  var multiShiftCreateEnd = client_shifts_create(shift, null, new Date(2014, 1, 6, 4, 39));  
  var _shift = multiShiftCreateEnd.data.shift;
  deepEqual(typeof _shift.assignee, "object", "assignee field populates");
  for(var field in shift) {
    if (field == "date") deepEqual(shift[field].getTime(), new Date(_shift[field]).getTime(), "date verified");
    else if (field != "assignee") deepEqual(shift[field], _shift[field], field + " verified");
  }

  clear_employer();
  // ok(true);
});

///////////////
// GET Shift //
///////////////

test('Shift - GET /shifts/', function () {
  clear_employer();
  ok(true);
});

test('Shift - GET /shifts/:id', function () {
  clear_employer();
  ok(true);
});

///////////////
// PUT Shift //
///////////////

test('Shift - PUT /shifts/:id', function () {
  clear_employer();
  ok(true);
});

//////////////////
// DELETE Shift //
//////////////////

test('Shift - DELETE /shifts/:id', function() {
  clear_employer();
  ok(true);

  // Employer Test Account LOGOUT
  client_logout();
});