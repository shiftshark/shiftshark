/**
 * Automated tests for Availability.
 * Author:
*/

//////////////////////
// GET Availability //
//////////////////////

test('Availability - GET /avails/', function () {
  // Employer Test Account LOGIN
  test_employer_login();

  clear_employer();
  ok(true);
});

test('Availability - GET /avails/:id', function () {
  clear_employer();
  ok(true);
});

///////////////////////
// POST Availability //
///////////////////////

test('Availability - POST /avails/', function () {
  clear_employer();
  ok(true);
});

//////////////////////
// PUT Availability //
//////////////////////

test('Availability - PUT /avails/:id', function () {
  clear_employer();
  ok(true);
});

/////////////////////////
// DELETE Availability //
/////////////////////////

test('Availability - DELETE /avails/:id', function() {
  clear_employer();
  ok(true);

  // Employer Test Account LOGOUT
  client_logout();
});