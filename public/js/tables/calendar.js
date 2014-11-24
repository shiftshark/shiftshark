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
  table.addClass('timetable');
  var dates = init_cal_dates(table, date_start, date_end);

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

  table.addClass('calendar');

  // contruct table with dates
  while(true) {
    var timetable = Timetable(iter_date);

    var row = create_elem('tr');
    row.attr('date', iter_date.toDateString());

    // day label on left
    var label = create_elem('td').addClass('label-day');
    row.append(label.html(iter_date.toDateString()));

    // timetable on right
    var table_cell = create_elem('td');
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
}