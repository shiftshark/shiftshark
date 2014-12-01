/**
 * DOM-based multi-day calendar view of multiple timetables.
 * Author: aandre@mit.edu
 */

/**
 * Function: Calendar
 *
 * A "class" for creating and manipulating multi-day calendars, comprised of single-day timetables.
 *
 * Parameters:
 *   date_start       - Date: start date of calendar, inclusive
 *   date_end         - Date: end date of calendar, >= date_start
 *
 * Returns: jQuery HTML table element
 *
 * Dependencies:
 *   * Timetable
 *   * momentJS
 *   * jQuery
 *   * seedrandom
 *
 * Usage:
 *   var t = Calendar(new Date(2014, 11, 22), new Date(2014, 11, 27));
 *   $('#container').append(t);
 *   t.someFunction();
 */
function Calendar (date_start, date_end) {
  if (!validate_dates(date_start, date_end)) throw "End date before start date.";

  // create HTML table with dates
  var table = create_elem('table');
  table.addClass('calendar');
  var dates = init_cal_dates(table, date_start, date_end);

  /**
   * Function: shift_add_update
   *
   * Adds a Shift to appropriate timetable or modifies existing shift.
   *
   * Parameters:
   *   shift - Shift: occurrs on a date covered by calendar, else ignored
   *
   * Returns: (Boolean) successful insertion
   */
  table.shift_add_update = function (shift) {
    if (dates[shift.date.toDateString()] === undefined) return false;
    var timetable = dates[shift.date.toDateString()].table;

    return timetable.shift_add_update(shift);
  };

  /**
   * Function: shift_remove
   *
   * Removes shift from a timetable within calendar.
   *
   * Parameters:
   *   shiftID - shiftID: exists in table, else ignored
   *
   * Returns: (Boolean) successful removal
   */
  table.shift_remove = function (shiftID) {
    for (var datestring in dates) {
      var date = dates[datestring];
      if (date.table.shift_remove(shiftID)) return true;
    }
    return false;
  };

  /**
   * Function: shift_contains
   *
   * Checks whether shift exists in a timetable.
   *
   * Parameters:
   *   shiftID - shiftID
   *
   * Returns: (Boolean) true if shift appears on any timetable in calendar
   */
  table.shift_contains = function (shiftID) {
    return table.find('.block-shift[shiftID=' + shiftID + ']').length !== 0;
  };

  /**
   * Function: position_add_update
   *
   * Adds a Position to each timetable or modifies existing position.
   *
   * Parameters:
   *   position - Position
   */
  table.position_add_update = function (position) {
    for (var datestring in dates) {
      var date = dates[datestring];
      date.table.position_add_update(position);
    }
  };

  /**
   * Function: position_remove
   *
   * Removes position and its corresponding shifts from each timetable.
   *
   * Parameters:
   *   positionID - positionID: exists in table, else ignored
   *
   * Returns: (Boolean) true for success
   */
  table.position_remove = function (positionID) {
    for (var datestring in dates) {
      var date = dates[datestring];
      if (!date.table.position_remove(positionID)) return false;
    }
    return true;
  };

  /**
   * Function: position_contains
   *
   * Checks whether position exists in a timetable.
   *
   * Parameters:
   *   positionID - positionID
   *
   * Returns: (Boolean) true if position appears on any timetable in calendar
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

function validate_dates (date_start, date_end) {
  // strip times
  var start = new Date(date_start.toDateString());
  var end = new Date(date_end.toDateString());

  return start.getTime() <= end.getTime();
}

///////////////////////
// Helper Procedures //
///////////////////////

function init_cal_dates(table, start_date, end_date) {
  var dates = {};
  var iter_date = new Date(start_date.toDateString()); // strip time

  // contruct table with dates
  while(true) {
    var timetable = Timetable(iter_date);

    var row = create_elem('tr');
    row.attr('date', iter_date.toDateString());

    // date label on left
    var label = create_elem('td').addClass('label-date');
    var momentdate = moment(iter_date);
    var datestring = momentdate.format("dddd") + "<br>" + momentdate.format("MMM Do, YYYY");
    row.append(label.html(datestring));

    // timetable on right
    var table_cell = create_elem('td').addClass('container-timetable');
    table_cell.append(timetable);
    row.append(table_cell);

    table.append(row);

    dates[iter_date.toDateString()] = { date: iter_date, table: timetable };

    // copy and increment date
    iter_date = new Date(iter_date.toDateString());
    iter_date.setDate(iter_date.getDate() + 1);
    if (iter_date.getTime() > (new Date(end_date.toDateString())).getTime())
      break;
  }

  return dates;
}