/**
 * Automated tests for Shifts.
 * Author:
*/


///////////////
// GET Shift //
///////////////

test('Shift - GET /shifts/', function () {
  // Employer Test Account LOGIN
  test_employer_login();

  clear_employer();
  ok(true);
});

test('Shift - GET /shifts/:id', function () {
  clear_employer();
  ok(true);
});

////////////////
// POST Shift //
////////////////

test('Shift - POST /shifts/', function () {
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