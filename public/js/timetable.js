/**
 * Modular DOM-based timetable view.
 * Author: aandre@mit.edu
 */

/**
 * Shift Object Specification
 *
 * Shift: {
 *   _id: ShiftID,
 *   assignee: EmployeeID,
 *   claimant: EmployeeID || null,
 *   position: PositionID,
 *   startTime: [0, 1439],
 *   endTime: [0, 1439],
 *   date: Date,
 *   trading: Boolean
 * }
 */

/**
 * Position Object Specification
 *
 * Position: {
 *   _id: PositionID,
 *   name: String
 * }
 */

/**
 * Function: Timetable
 *
 * A "class" for creating and manipulating single-day timetables.
 *
 * Parameters:
 *   date          - Date: timetable date
 *
 * Returns: jQuery HTML table element
 *
 * Usage:
 *   var t = Timetable(new Date());
 *   $('#container').append(t);
 *   t.someFunction();
 */
function Timetable (date) {
  // create HTML table and initialize
  var table = create_elem('table');
  table.addClass('timetable');
  init_table(table);  // construct header

  var time_start = 8, time_end = 18;
  hide_hours_left(time_start); hide_hours_right(time_end);

  /**
   * Function: shift_add_update
   *
   * Adds a Shift to the timetable or modifies existing shift. Shifts are identified by their ShiftID.
   *
   * Parameters:
   *   shift - Shift: occurrs on same date as timetable, else ignored
   */
  table.shift_add_update = function (shift) {

  };

  /**
   * Function: shift_remove
   *
   * Removes shift from timetable.
   *
   * Parameters:
   *   shiftID - shiftID: exists in table, else ignored
   */
  table.shift_remove = function (shiftID) {

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

  };

  /**
   * Function: position_add_update
   *
   * Adds a Position to the timetable or modifies existing position. Positions are identified by their positionID.
   *
   * Parameters:
   *   position - Position
   */
  table.position_add_update = function (position) {
    var row = position_row(position);
    table.append(row);

    hide_hours_left(time_start); hide_hours_right(time_end);
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
    $('.timetable tr[positionID=' + positionID + ']').remove();
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
    return $('.timetable tr[positionID=' + positionID + ']').length !== 0;
  };

  return table;
}

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

function hide_hours_left (hour) {
  $('.timetable').ready(function() {
    for (var h = hour - 1; h >= 0; h--) {
      var hour_col = $('.timetable td[hour='+ h + ']');
      if (hour_col.first().css('display') !== 'none') {
        hour_col.css('display', 'none');
      } else break;
    }
  });
}

function hide_hours_right (hour) {
  $('.timetable').ready(function() {
    for (var h = hour + 1; h < 24; h++) {
      var hour_col = $('.timetable td[hour='+ h + ']');
      if (hour_col.first().css('display') !== 'none') {
        hour_col.css('display', 'none');
      } else break;
    }
  });
}

function extend_hours_left (hour) {
  $('.timetable').ready(function() {
    for (var h = hour; h < 24; h++) {
      var hour_col = $('.timetable td[hour='+ h + ']');
      if (hour_col.first().css('display') === 'none') {
        hour_col.css('display', '');
      } else break;
    }
  });
}

function extend_hours_right (hour) {
  $('.timetable').ready(function() {
    for (var h = hour; h >= 0; h--) {
      var hour_col = $('.timetable td[hour='+ h + ']');
      if (hour_col.first().css('display') === 'none') {
        hour_col.css('display', '');
      } else break;
    }
  });
}

///////////////////////
// Helper Procedures //
///////////////////////

function init_table (table) {
  // hide table during consturction
  table.hide(0);

  // construct time header
  header = create_elem('tr').addClass('header-row');
  header.append(create_elem('td').css('border','none')); // empty square
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

function position_row (position) {
  // create row with ID
  var row = create_elem('tr');
  row.attr('positionID', position._id);

  // position name/label on left
  var label = create_elem('td');
  label.addClass('label-position');
  label.html(position.name);
  row.append(label);

  // crete 15-minute blocks
  for (var h = 0; h < 24; h++) {
    for (var m = 0; m < 4; m++) {
      var block = create_elem('td').addClass('time-block');
      block.attr({hour: h, quarter: m});
      row.append(block);
    }
  }

  return row;
}