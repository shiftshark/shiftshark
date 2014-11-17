/**
 * Automated tests for Position.
 * Author:
*/

//////////////////
// GET Position //
//////////////////

test('Position - GET /positions/', function () {
  // Employer Test Account LOGIN
  test_employer_login();

  clear_employer();
  ok(true);

});

test('Position - GET /positions/:id', function () {
  clear_employer();
  ok(true);
});

///////////////////
// POST Position //
///////////////////

test('Position - POST /positions/', function () {
  clear_employer();
  ok(true);
});

//////////////////
// PUT Position //
//////////////////

test('Position - PUT /positions/:id', function () {
  clear_employer();
  ok(true);
});

/////////////////////
// DELETE Position //
/////////////////////

test('Position - DELETE /positions/:id', function() {
  clear_employer();
  ok(true);

  // Employer Test Account LOGOUT
  client_logout();
});
