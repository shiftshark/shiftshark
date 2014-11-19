/**
 * Automated tests for Position.
 * Author: aandre@mit.edu
*/

//////////////////
// GET Position //
//////////////////

test('Position - GET /positions/', function () {
  // Employer Test Account LOGIN
  test_employer_login();

  // Clear Employer Account
  clear_employer();

  // Create Positions
  var positions = [];
  positions.push(client_positions_create({ name: "Position One" }).data.position);
  positions.push(client_positions_create({ name: "Position Two" }).data.position);
  positions.push(client_positions_create({ name: "Position Three" }).data.position);

  deepEqual(client_positions_get_all().data, { positions: positions }, "retrieve newly created positions");

  positions.push(client_positions_create({ name: "Position Four" }).data.position);
  positions.push(client_positions_create({ name: "Position Five" }).data.position);

  deepEqual(client_positions_get_all().data, { positions: positions }, "retrieve additional positions");
});

test('Position - GET /positions/:id', function () {
  // Clear Employer Account
  clear_employer();

  // Create Positions
  var positions = [];
  positions.push(client_positions_create({ name: "Position One" }).data.position);
  positions.push(client_positions_create({ name: "Position Two" }).data.position);
  positions.push(client_positions_create({ name: "Position Three" }).data.position);

  // Retrieve each ID
  deepEqual(client_positions_get_one(String(positions[0]._id)).data, {position: positions[0]}, "retrieve position by ID - I");
  deepEqual(client_positions_get_one(String(positions[1]._id)).data, {position: positions[1]}, "retrieve position by ID - II");
  deepEqual(client_positions_get_one(String(positions[2]._id)).data, {position: positions[2]}, "retrieve position by ID - III");
});

///////////////////
// POST Position //
///////////////////

test('Position - POST /positions/', function () {
  // Clear Employer Account
  clear_employer();

  // Create Positions
  var positions = [];
  positions.push(client_positions_create({ name: "Position One" }).data.position);
  positions.push(client_positions_create({ name: "Position Two" }).data.position);
  positions.push(client_positions_create({ name: "Position Three" }).data.position);

  // Verify Created
  deepEqual(client_positions_get_all().data, { positions: positions }, "verify created positions");

  var pos = client_positions_create({ name: "Position One" });
  positions.push(pos.data.position);
  ok(pos.success, "No name conflict.");

  positions.push(client_positions_create({ name: "Position Five" }).data.position);

  deepEqual(client_positions_get_all().data, { positions: positions }, "retrieve additional positions");
});

//////////////////
// PUT Position //
//////////////////

test('Position - PUT /positions/:id', function () {
  // Clear Employer Account
  clear_employer();

  // Create Positions
  var positions = [];
  positions.push(client_positions_create({ name: "Position One" }).data.position);
  positions.push(client_positions_create({ name: "Position Two" }).data.position);

  // Verify Created
  deepEqual(client_positions_get_all().data, { positions: positions }, "verify created positions");

  // Change One and Verify Other
  positions[0].name = "Position Three";
  deepEqual(client_positions_change(positions[0]._id, positions[0]).data.position, positions[0], "position change returned correct Position Object");
  deepEqual(client_positions_get_one(positions[0]._id).data.position, positions[0], "successfully modified position name");
  deepEqual(client_positions_get_one(positions[1]._id).data.position, positions[1], "remaining position left unmodified");
});

/////////////////////
// DELETE Position //
/////////////////////

test('Position - DELETE /positions/:id', function() {
  // Clear Employer Account
  clear_employer();

  // Create Positions
  var positions = [];
  positions.push(client_positions_create({ name: "Position One" }).data.position);
  positions.push(client_positions_create({ name: "Position Two" }).data.position);

  // Verify Created
  deepEqual(client_positions_get_all().data, { positions: positions }, "verify created positions");

  // Delete One and Verify Other
  client_positions_remove(positions[0]._id);
  var pos0 = client_positions_get_one(positions[0]._id).success;
  var pos1 = client_positions_get_one(positions[1]._id).success;
  ok(!pos0, "unable to locate deleted position");
  ok(pos1, "remaining position can still be found, not deleted");
});
