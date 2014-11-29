/**
 * Modular DOM-based availability table views.
 * Author: aandre@mit.edu
 */

/**
 * Availability Object Specification
 *
 * Avail: {
 *   _id: AvailID,
 *   employee: Employee,
 *   day: [0,6],
 *   startTime: [0, 1439],
 *   endTime: [0, 1439]
 * }
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
 *   * seedrandom
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

    return avail_delete(table, availID);
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
  for (var h = 0; h < 24; h++) {
    var timestring = time_string(h % 24);

    var heading = create_elem('td');
    heading.attr('colspan', '4');
    heading.addClass('label-time');
    heading.attr('hour', h);
    heading.html(timestring);
    header.append(heading);
  }

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

  // show table once created
  table.show(0);
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
function avail_delete (table, availID) {
  var availBlock = table.find('.block-avail[availID=' + availID + ']').first();
  var hour = parseInt(availBlock.attr('hour'), 10);
  var quarter = parseInt(availBlock.attr('quarter'), 10);
  var numQuarters = availBlock.attr('colspan');

  // insert empty blocks
  var last_block = availBlock;
  for (i = 0; i < numQuarters; i++) {
    var block = create_elem('td').addClass('time-block block-empty');
    block.attr({hour: hour, quarter: quarter});
    block.attr('day', availBlock.attr('day'));
    block.insertAfter(last_block);
    last_block = block;

    quarter += 1;
    if (quarter > 3) { quarter = 0; hour += 1; }
  }

  availBlock.remove();

  return true;
}











// create new position with single row
function position_new_create (table, position) {
  // create row with ID
  var row = create_elem('tr');
  row.attr('positionID', position._id);

  // position name/label on left
  var label = create_elem('td');
  label.addClass('label-position');
  label.attr('rowspan', '1');
  label.html(position.name);
  row.append(label);

  // create 15-minute block
  row_blocks_create(row);

  // append to timetable
  table.append(row);

  return row;
}

// add row to existing position
function position_row_add (table, positionID) {
  // locate position label and expand
  var label = table.find('tr[positionID=' + positionID + ']').find('.label-position').first();
  label.attr('rowspan', parseInt(label.attr('rowspan'), 10) + 1);

  // create row and 15-minute blocks
  var row = create_elem('tr');
  row.attr('positionID', positionID);
  row_blocks_create(row);

  // insert after last row in position
  var last = table.find('tr[positionID=' + positionID + ']').last();
  row.insertAfter(last);

  return row;
}

// remove row from existing position
function position_row_subtract (table, position_row) {
  // locate position label and contract
  var positionID = position_row.attr('positionID');
  var label = table.find('tr[positionID=' + positionID + ']').find('.label-position').first();
  label.attr('rowspan', parseInt(label.attr('rowspan'), 10) - 1);
  label.remove();

  // remove row
  position_row.remove();

  // re-insert label in position's first row
  var first_row = table.find('tr[positionID=' + positionID + ']').first();
  var first_block = first_row.find('.time-block').first();
  label.insertBefore(first_block);
}

// determine if block is vacant
function block_check (table, block, availability) {
  // attmept to find existing row to accomodate blocks
  var rows = table.find('tr[positionID=' + shift.position + ']');

  for (var i = 0; i < rows.length; i++) {
    var row = $(rows[i]);
    var quarter = row.find('.time-block[hour=' + block.start.hour + '][quarter=' + block.start.quarter + ']').first();

    if (quarter.length === 0) continue; // middle of other shift

    var fits = true;
    for (var b = 0; b < block.numQuarters; b++) {
      if (quarter.hasClass('block-empty')) {
        quarter = quarter.next('.time-block');
        continue;
      }
      else {
        fits = false;
        break;
      }
    }

    if (fits) return row;
  }

  return position_row_add(table, shift.position);
}


// remove shift and (possibly) its row
function shift_delete (table, shiftID) {
  var shiftBlock = table.find('.block-shift[shiftID=' + shiftID + ']').first();
  var hour = parseInt(shiftBlock.attr('hour'), 10);
  var quarter = parseInt(shiftBlock.attr('quarter'), 10);
  var numQuarters = shiftBlock.attr('colspan');

  // insert empty blocks
  var last_block = shiftBlock;
  for (i = 0; i < numQuarters; i++) {
    var block = create_elem('td').addClass('time-block block-empty');
    block.attr({hour: hour, quarter: quarter});
    block.insertAfter(last_block);
    last_block = block;

    quarter += 1;
    if (quarter > 3) { quarter = 0; hour += 1; }
  }

  var row = shiftBlock.parent('tr').first();
  shiftBlock.remove();
  return row;
}