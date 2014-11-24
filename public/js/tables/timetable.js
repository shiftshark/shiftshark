/**
 * Modular DOM-based timetable view.
 * Author: aandre@mit.edu
 */

/**
 * Function: Timetable
 *
 * A "class" for creating and manipulating single-day timetables.
 *
 * Parameters:
 *   table_date       - Date: timetable date
 *
 * Returns: jQuery HTML table element
 *
 * Dependencies:
 *   * jQuery
 *   * seedrandom
 *
 * Usage:
 *   var t = Timetable(new Date());
 *   $('#container').append(t);
 *   t.someFunction();
 */
function Timetable (table_date) {
  // create HTML table and initialize
  var table = create_elem('table');
  table.addClass('timetable');
  init_table(table);  // construct header

  var date = table_date;

  // adjust displayed start/end times
  var time_start = 8, time_end = 18;
  show_hours_between(table, time_start, time_end);

  /**
   * Function: shift_add_update
   *
   * Adds a Shift to the timetable or modifies existing shift.
   *
   * Parameters:
   *   shift - Shift: occurrs on same date as timetable, else ignored
   *
   * Returns: (Boolean) successful insertion
   *
   * Behavioral Notes:
   *   * Shift blocks are not split.
   *   * Shift date must match timetable date, else ignored.
   *   * Shift with existing ShiftID will delete existing shift block before re-adding.
   *   * Shift replaces and spans accross empty blocks.
   *   * New row within position is created if shift cannot fit in any of the existing rows.
   *   * Displayed start and end boundaries of timetalbe adapt if shift bleeds beyond boundaries.
   */
  table.shift_add_update = function (shift) {
    var shiftID = shift._id;

    // ignore wrong date
    if (date_equals(shift.date, date))
      return false; // failure

    // if already exists, remove before re-creating
    var existing_shift = $('.timetable td[shiftID=' + shiftID + ']');
    if (existing_shift.length !== 0) existing_shift.remove();

    // adjust boundaries if necessary
    var startHour = Math.floor(shift.startTime / 60),
        endHour = Math.floor(shift.endTime / 60),
        endMin = Math.round(shift.endTime % 60);
    if (endMin === 0) endHour -= 1; // ends on boundary
    if (startHour < time_start) {
      time_start = startHour;
      extend_hours_left(table, time_start);
    }
    if (endHour > time_end) {
      time_end = endHour;
      extend_hours_right(table, time_end);
    }

    shift_insert(table, shift);
    show_hours_between(table, time_start, time_end); // adjust boundaries for possible new row

    return true; // sucess
  };

  /**
   * Function: shift_remove
   *
   * Removes shift from timetable.
   *
   * Parameters:
   *   shiftID - shiftID: exists in table, else ignored
   *
   * Behavioral Notes:
   *   * Empty blocks are re-populated, spanning the area of the removed shift.
   *   * If only shift on position's row (and multiple position rows), blank row will be removed.
   */
  table.shift_remove = function (shiftID) {
    var row = shift_delete(table, shiftID);

    // check if row empty (and only row) and remove
    if (table.find('tr[positionID=' + row.attr('positionID') + ']').length > 1 &&
        row.find('.block-empty').length === 24 * 4) {
      console.log(table.find('tr[positionID=' + row.attr('positionID') + ']').length);
      position_row_subtract(table, row);
    }
  };

  /**
   * Function: shift_contains
   *
   * Checks whether shift exists in timetable.
   *
   * Parameters:
   *   shiftID - shiftID
   *
   * Returns: (Boolean) true if shift appears on timetable
   */
  table.shift_contains = function (shiftID) {
    return table.find('.block-shift[shiftID=' + shiftID + ']').length !== 0;
  };

  /**
   * Function: position_add_update
   *
   * Adds a Position to the timetable or modifies existing position.
   *
   * Parameters:
   *   position - Position
   *
   * Behavioral Notes:
   *   * Position with existing PositionID will replace name only.
   */
  table.position_add_update = function (position) {
    var positionID = position._id;
    var existing_position = table.find('tr[positionID=' + positionID + ']');

    if (existing_position.length === 0) { // does not exist
      var row = position_new_create(table, position);
      show_hours_between(table, time_start, time_end); // adjust boundaries
    } else { // exists, modify name
      var label = existing_position.children('td.label-position').first();
      label.html(position.name);
    }
  };

  /**
   * Function: position_remove
   *
   * Removes position and its corresponding shifts from the timetable.
   *
   * Parameters:
   *   positionID - positionID: exists in table, else ignored
   */
  table.position_remove = function (positionID) {
    table.find('tr[positionID=' + positionID + ']').remove();
  };

  /**
   * Function: position_contains
   *
   * Checks whether position exists in timetable.
   *
   * Parameters:
   *   positionID - positionID
   *
   * Returns: (Boolean) true if position appears on timetable
   */
  table.position_contains = function (positionID) {
    return table.find('tr[positionID=' + positionID + ']').length !== 0;
  };

  return table;
}

// ----------------------------------------------------------------------------

///////////////////////
// Utility Functions //
///////////////////////

/**
 * Function: date_equals
 *
 * Compares Dates for equality on basis of date, excluding time.
 *
 * Parameters:
 *   a - Date
 *   b - Date
 *
 * Returns: Boolean
 */
function date_equals (a, b) {
  return a.toDateString() === b.toDateString();
}

/**
 * Function: create_elem
 *
 * Creates a jQuery DOM element.
 *
 * Parameters:
 *   elem - HTML tag
 *
 * Returns: jQuery DOM element
 */
function create_elem (elem) {
  return $(document.createElement(elem));
}

function show_hours_between (table, start, end) {
  hide_hours_left(table, start);
  hide_hours_right(table, end);
}

function hide_hours_left (table, hour) {
  table.ready(function() {
    for (var h = hour - 1; h >= 0; h--) {
      var hour_col = table.find('td[hour='+ h + ']');
      hour_col.addClass('hidden-cell');
    }
  });
}

function hide_hours_right (table, hour) {
  table.ready(function() {
    for (var h = hour + 1; h < 24; h++) {
      var hour_col = table.find('td[hour='+ h + ']');
      hour_col.addClass('hidden-cell');
    }
  });
}

function extend_hours_left (table, hour) {
  table.ready(function() {
    for (var h = hour; h <= 12; h++) {
      var hour_col = table.find('td[hour='+ h + ']');
      hour_col.removeClass('hidden-cell');
    }
  });
}

function extend_hours_right (table, hour) {
  table.ready(function() {
    for (var h = hour; h >= 12; h--) {
      var hour_col = table.find('td[hour='+ h + ']');
      hour_col.removeClass('hidden-cell');
    }
  });
}

/**
 * Function: name_string
 *
 * Formats a compact name string for an employee.
 *
 * Parameters:
 *   employee - Employee
 *
 * Returns: String
 */
function name_string (employee) {
  return employee.firstName[0] + '. ' + employee.lastName;
}

/**
 * Function: generate_color
 *
 * Generates color from string.
 *
 * Parameters:
 *   str - String
 *
 * Returns: (String) hex color
 */
 function generate_color (str) {
  Math.seedrandom(str);
  var rand = Math.random() * Math.pow(255,3);
  Math.seedrandom(); // don't leave a non-random seed in the generator
  for (var i = 0, color = "#"; i < 3; color += ("00" + ((rand >> i++ * 8) & 0xFF).toString(16)).slice(-2));

  // if too similar to trading color, try again
  if (color_distance(color, '#FFDD00') < 80) return generate_color(str + 'ta');
  return color;
}

/**
 * Function: font_color_compliment
 *
 * Determines whether to use white or black text on given color background.
 *
 * Parameters:
 *   hex_color - String: hex color value
 *
 * Returns: (String) #000000 or #ffffff
 */
function font_color_compliment (hex_color) {
  var clr = color_decompose(hex_color);

  return (clr.red*0.299 + clr.green*0.587 + clr.blue*0.114) > 186 ? '#000000' : '#ffffff';
}

/**
 * Function: color_distance
 *
 * Determines similarity between two colors.
 *
 * Parameters:
 *   c1 - String: HEX color value
 *   c2 - String: HEX color value
 *
 * Returns: (float)
 */
function color_distance (c1, c2) {
  var clr1 = color_decompose(c1);
  var clr2 = color_decompose(c2);

  // pythagorean distance
  var r_dist = Math.pow(clr1.red - clr2.red, 2);
  var g_dist = Math.pow(clr1.green - clr2.green, 2);
  var b_dist = Math.pow(clr1.blue - clr2.blue, 2);
  return Math.sqrt(r_dist + g_dist + b_dist);
}

/**
 * Function: color_decompose
 *
 * Splits color into chanels.
 *
 * Parameters:
 *   hex_color - String: HEX color value
 *
 * Returns: (Object) {red, green, blue) with values
 */
function color_decompose (hex_color) {
  var hex = parseInt(hex_color.substring(1), 16);
  return {
    red: (hex & 0xFF0000) >> 16,
    green: (hex & 0xFF00) >> 8,
    blue: hex & 0xFF
  };
}

///////////////////////
// Helper Procedures //
///////////////////////

// initialize table with time headings
function init_table (table) {
  // hide table during consturction
  table.hide(0);

  // construct time header
  header = create_elem('tr').addClass('header-row');
  header.append(create_elem('td').addClass('top-square')); // empty square
  table.append(header);

  for (var h = 0; h < 24; h++) {
    var timestring = "";
    // hour
    if (h % 12 == 0)
      timestring = "12:00";
    else
      timestring = String(h % 12) + ":00";
    // meridian
    if (h < 12)
      timestring += " am";
    else
      timestring += " pm";
    // time heading
    var heading = create_elem('td');
    heading.attr('colspan', '4');
    heading.addClass('label-time');
    heading.attr('hour', h);
    heading.html(timestring);
    header.append(heading);
  }

  // show table once created
  table.show(0);
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

function row_blocks_create (row) {
  // create 15-minute blocks
  for (var h = 0; h < 24; h++) {
    for (var m = 0; m < 4; m++) {
      var block = create_elem('td').addClass('time-block block-empty');
      block.attr({hour: h, quarter: m});
      row.append(block);
    }
  }
}

// determine which time blocks needed
function shift_block_needed (shift) {
  var startTime = shift.startTime,
      endTime = shift.endTime;

  // round to nearest time block
  var startRem = Math.round(startTime % 15);
  if (startRem !== 0) {
    startTime -= startRem;
  }
  var endRem = Math.round(endTime % 15);
  if (endRem !== 0) {
    endTime += (15 - endRem);
  }

  return {
    start: {
      hour: Math.floor(startTime / 60),
      quarter: Math.round((startTime % 60) / 15)
    },
    end: {
      hour: Math.floor(endTime / 60),
      quarter: Math.round((endTime % 60) / 15)
    },
    numQuarters: Math.round((endTime - startTime) / 15)
  };
}

// locate/create a row (in position) to accomodate this shift
function shift_row_locate (table, block, shift) {
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

// insert shift within availble row
function shift_insert (table, shift) {
  var block = shift_block_needed(shift);
  var row = shift_row_locate(table, block, shift);

  // stretch/delete blocks
  var shiftBlock = row.find('.time-block[hour=' + block.start.hour + '][quarter=' + block.start.quarter + ']').first();
  shiftBlock.attr('colspan', block.numQuarters);
  shiftBlock.attr('shiftID', shift._id);
  shiftBlock.attr('date', shift.date.toDateString());
  shiftBlock.removeClass('block-empty').addClass('block-shift');
  for (i = 1; i < block.numQuarters; i++) {
    var blockRight = shiftBlock.next();
    blockRight.remove();
  }

  // display and embed attributes
  shiftBlock.attr('assignee', shift.assignee._id);
  var color = ""; // color code
  if (shift.claimant !== null) {
    shiftBlock.attr('claimant', shift.claimant._id);
    // display text
    shiftBlock.html(
      name_string(shift.claimant) + ' [' + name_string(shift.assignee) + ']'
    );
    // color code
    color = generate_color(shift.claimant._id);
  } else {
    // display text
    shiftBlock.html(name_string(shift.assignee));
    // color code
    color = generate_color(shift.assignee._id);
  }

  if (shift.trading) {
    shiftBlock.addClass('trading');
  } else {
    // apply color code
    shiftBlock.css('background-color', color);
    shiftBlock.css('color', font_color_compliment(color));
  }
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