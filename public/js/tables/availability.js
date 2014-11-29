/**
 * Modular DOM-based availability table views.
 * Author: aandre@mit.edu
 */

/**
 * Function: AvailabilityEmployeeTable
 *
 * A "class" for creating and manipulating availability tables for employees to declare hours they are willing to work. Days of the week are displayed vertially.
 *
 * Returns: jQuery HTML table element
 *
 * Dependencies:
 *   * jQuery
 *   * momentJS
 *   * timetable
 *
 * Usage:
 *   var t = AvailabilityEmployeeTable();
 *   $('#container').append(t);
 *   t.someFunction();
 */
function AvailabilityEmployeeTable () {
  // create HTML table and initialize
  var table = create_elem('table');
  table.addClass('timetable avail-table-employee');
  init_table(table);  // construct header and rows
  init_day_rows(table);

  /**
   * Function: avail_add_update
   *
   * Adds an Availability to the table or modifies existing.
   *
   * Parameters:
   *   avail - Availability: does not conflict with existing availability block, else ignored
   *
   * Returns: (Boolean) successful insertion
   */
  table.avail_add_update = function (avail) {
    var availID = avail._id;

    // if already exists, remove before re-creating
    var existing_avail = table.find('.block-avail[availID=' + availID + ']');
    if (existing_avail.length !== 0) table.avail_remove(availID);

    var block = shift_block_needed(avail);
    var row = table.find('tr[day=' + avail.day + ']');

    return avail_insert(avail, row, block);
  };

  /**
   * Function: avail_remove
   *
   * Removes availability from timetable.
   *
   * Parameters:
   *   availID - availID: exists in table, else ignored
   *
   * Returns: (Boolean) successful removal
   */
  table.avail_remove = function (availID) {
    if ( ! table.avail_contains(availID) )
      return false;

    avail_delete(table, availID, function (block, availBlock) {
      block.attr('day', availBlock.attr('day'));
    });

    return true;
  };

  /**
   * Function: avail_contains
   *
   * Checks whether availability exists in timetable.
   *
   * Parameters:
   *   availID - availID
   *
   * Returns: (Boolean) true if exists in table
   */
  table.avail_contains = function (availID) {
    return table.find('.block-avail[availID=' + availID + ']').length !== 0;
  };

  return table;
}


/**
 * Function: AvailabilityAdminTable
 *
 * A "class" for creating and manipulating availability tables for employers to view available working hours for multiple employees at once. Employees are displayed vertically for one weekday at a time.
 *
 * Parameters:
 *   table_day       - Number: [0,6] day of the week
 *
 * Returns: jQuery HTML table element
 *
 * Dependencies:
 *   * jQuery
 *   * seedrandom
 *   * momentJS
 *   * timetable
 *
 * Usage:
 *   var t = AvailabilityAdminTable();
 *   $('#container').append(t);
 *   t.someFunction();
 */
function AvailabilityAdminTable (table_day) {
  // create HTML table and initialize
  var table = create_elem('table');
  table.addClass('timetable avail-table-admin');
  init_table(table);  // construct header and rows

  var day = table_day;

  /**
   * Function: avail_add_update
   *
   * Adds an Availability to the table or modifies existing.
   *
   * Parameters:
   *   avail - Availability: does not conflict with existing availability block for given employee, else ignored
   *
   * Returns: (Boolean) successful insertion
   */
  table.avail_add_update = function (avail) {
    var availID = avail._id;

    // ignore wrong day
    if (avail.day !== day)
      return false;

    // if already exists, remove before re-creating
    var existing_avail = table.find('.block-avail[availID=' + availID + ']');
    if (existing_avail.length !== 0) table.avail_remove(availID);

    var row = employee_row_locate_create(table, avail);
    var block = shift_block_needed(avail);

    return avail_insert(avail, row, block);
  };

  /**
   * Function: avail_remove
   *
   * Removes availability from timetable.
   *
   * Parameters:
   *   availID - availID: exists in table, else ignored
   *
   * Returns: (Boolean) successful removal
   */
  table.avail_remove = function (availID) {
    if ( ! table.avail_contains(availID) )
      return false;

    var row = avail_delete(table, availID, function (block, availBlock) {
      block.attr('employee', availBlock.attr('employee'));
    });

    // remove row if empty
    if (row.find('.block-empty').length === 4 * 24)
      row.remove();

    return true;
  };

  /**
   * Function: avail_contains
   *
   * Checks whether availability exists in timetable.
   *
   * Parameters:
   *   availID - availID
   *
   * Returns: (Boolean) true if exists in table
   */
  table.avail_contains = function (availID) {
    return table.find('.block-avail[availID=' + availID + ']').length !== 0;
  };

  return table;
}

// ----------------------------------------------------------------------------

///////////////////////
// Utility Functions //
///////////////////////


///////////////////////
// Helper Procedures //
///////////////////////

// initialize table with time headings
function init_table (table) {
  // hide table during consturction
  table.hide(0);

  // construct time header
  header = create_elem('tr').addClass('header-row');
  header.append(create_elem('td').addClass('top-square-left')); // empty square
  table.append(header);

  // time heading
  time_heading(header);

  // show table once created
  table.show(0);
}

function init_day_rows (table) {
  var header = table.find('.header-row').first();
  header.append(create_elem('td').addClass('top-square-right'));

  // day rows
  for (var d = 0; d < 7; d++) {
    var row = create_elem('tr');
    row.attr('day', d);

    // day of week label
    var label = create_elem('td');
    label.addClass('label-day');
    var date = new Date(1970, 1, 2 + d);
    day = moment(date).format('ddd');
    label.html(day);
    row.append(label);

    // create 15-minute blocks
    row_blocks_create(row, function (block) {
      block.attr('day', d);
    });

    var label = create_elem('td');
    label.addClass('label-day');
    var date = new Date(1970, 1, 2 + d);
    day = moment(date).format('ddd');
    label.html(day);
    row.append(label);

    // append to table
    table.append(row);
  }
}

// insert availability if possible
function avail_insert(avail, row, block) {

  var quarter = row.find('.time-block[hour=' + block.start.hour + '][quarter=' + block.start.quarter + ']').first();
  for (var b = 0; b < block.numQuarters; b++) {
    if (quarter.hasClass('block-empty')) {
      quarter = quarter.next('.time-block');
      continue;
    }
    else {
      return false; // conflicting avail
    }
  }

  // stretch/delete blocks
  var availBlock = row.find('.time-block[hour=' + block.start.hour + '][quarter=' + block.start.quarter + ']').first();
  availBlock.attr('colspan', block.numQuarters);
  availBlock.removeClass('block-empty').addClass('block-avail');
  for (i = 1; i < block.numQuarters; i++) {
    var blockRight = availBlock.next();
    blockRight.remove();
  }

  // display and embed attributes
  availBlock.attr('availID', avail._id);
  availBlock.attr('employee', avail.employee._id);
  availBlock.attr('day', avail.day);

  return true;
}

// remove availability
function avail_delete (table, availID, recreate_callback) {
  var availBlock = table.find('.block-avail[availID=' + availID + ']').first();
  var hour = parseInt(availBlock.attr('hour'), 10);
  var quarter = parseInt(availBlock.attr('quarter'), 10);
  var numQuarters = availBlock.attr('colspan');

  // insert empty blocks
  var last_block = availBlock;
  for (i = 0; i < numQuarters; i++) {
    var block = create_elem('td').addClass('time-block block-empty');
    block.attr({hour: hour, quarter: quarter});

    if (recreate_callback !== undefined)
      recreate_callback(block, availBlock);

    block.insertAfter(last_block);
    last_block = block;

    quarter += 1;
    if (quarter > 3) { quarter = 0; hour += 1; }
  }

  var row = availBlock.parent('tr').first();

  availBlock.remove();

  return row;
}

// create new employee row or return existing
function employee_row_locate_create (table, avail) {
  var row = table.find('tr[employee=' + avail.employee._id + ']').first();

  if (row.length !== 0)
    return row;

  // create row with ID
  row = create_elem('tr');
  row.attr('employee', avail.employee._id);

  // employee name/label on left
  var label = create_elem('td');
  label.addClass('label-employee');
  label.html(name_string(avail.employee) || "-");
  row.append(label);

  // create 15-minute block
  row_blocks_create(row, function (block) {
    block.attr('employee', avail.employee._id);
  });

  // append to timetable
  table.append(row);

  return row;
}