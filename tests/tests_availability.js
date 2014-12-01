/**
 * Automated tests for Availability.
 * Author:
*/

///////////////////////
// POST Availability //
///////////////////////

test('Availability - POST /avails/', function () {
  // Employer Test Account LOGIN
  test_employer_login();
  employees = client_employee_get_all().data.employees;

  // create an availability object 
  var avail_one = {
    employee: employees[0]._id,
    day: 0,
    startTime: 200,
    endTime: 800
  }
  avail_create = client_avails_create({ avail: avail_one });
  ok(avail_create.success);

  // conflicting availability object - reject
  var avail_two = {
    employee: employees[0]._id,
    day: 0,
    startTime: 500,
    endTime: 800
  }
  ok(!client_avails_create({ avail: avail_two }).success);

  // create availability for someone else - reject
  var avail_three = {
    employee: employees[1]._id,
    day: 0,
    startTime: 500,
    endTime: 800
  }
  ok(!client_avails_create({ avail: avail_three }).success);

});

//////////////////////
// GET Availability //
//////////////////////

test('Availability - GET /avails/', function () {
  ok(client_avails_get_all().success);
});

test('Availability - GET /avails/:id', function () {
  ok(client_avails_get_one(avail_create.data.avail._id).success);
});

//////////////////////
// PUT Availability //
//////////////////////

test('Availability - PUT /avails/:id', function () {
  var avail_four = {
    employee: employees[0]._id,
    day: 0,
    startTime: 900,
    endTime: 1000
  }

  // create availability
  create_four = client_avails_create({ avail: avail_four });
  ok(create_four.success);

  var change_four = client_avails_change(create_four.data.avail._id, { avail: { startTime: 950, endTime: 1400, day: "this is ignored" } });
  var get_four = client_avails_get_one(change_four.data.avail._id);
  console.log(get_four);
  ok(get_four.data.avail.startTime == 950);
  ok(get_four.data.avail.endTime == 1400);
  ok(get_four.data.avail.day == avail_four.day);
});

/////////////////////////
// DELETE Availability //
/////////////////////////

test('Availability - DELETE /avails/:id', function() {
  var remove = client_avails_remove(create_four.data.avail._id);
  ok(remove.success);

  // try to get the object just deleted - returns null
  ok(!client_avails_get_one(remove.data.availId).data.avail);

  // Employer Test Account LOGOUT
  client_logout();
  clear_employer();
});