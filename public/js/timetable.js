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
 * GET /positions/
 *
 * Description: Retrieves all positions.
 *
 * Permissions: All users can retrieve positions in their schedule.
 *
 * Response: {
 *   positions: Position[]
 * }
 *
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
  // create HTML table within container
  var table = $(document.createElement('table'));
  table.addClass('timetable');
  init_table(table);

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

  };

  return table;
}

//////////////////////
// Helper Functions //
//////////////////////

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

function init_table (table_sel) {

}