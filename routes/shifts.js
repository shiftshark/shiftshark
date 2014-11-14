/**
 * API Specification Authors: aandre@mit.edu, gendron@mit.edu
 */

/**
 * Shift Object Specification
 *
 * Shift: {
 *   _id: ShiftID,
 *   assignee: Employee,
 *   claimant: Employee || null,
 *   position: Position,
 *   startTime: [0, 1439],
 *   endTime: [0, 1439],
 *   date: Date,
 *   trading: Boolean
 * }
 */

/**
 * GET /shifts/
 *
 * Description: Retrieve specified shifts within the schedule.
 *
 * Permissions: An employee within a schedule may retrieve information about any shift within that schedule.
 *
 * Query Params:
 *   startDate - shifts occurring after or on Date
 *   endDate - shifts occurring before or on Date
 *   trading - include shifts currently offered for trading (options: 0 or 1, default: Any)
 *   assignee - Employee assigned to shift
 *   claimant - Employee claiming shift
 *
 * Response: {
 *   shifts: Shift[]
 * }
 *
 */

/**
 * POST /shifts/
 *
 * Description: Create a single shift or a series of recurring shifts.
 *
 * Permissions: Schedule's owner (employer) may create shift with any employees and positions within their own schedule.
 *
 * Notes:
 *   * shift.assignee: must not have conflicting shift
 *   * shift.claimant: (optional) must not have conflicting shift
 *   * shift.startTime must occur before shift.endTime
 *   * startDate and endDate: multiple Shifts will be created on same weekday within date range
 *   * startDate <= shift.date; endDate >= shift.date
 *
 * Request: {
 *   shift: Shift,
 *   startDate: (optional) Date,
 *   endDate: (optional) Date
 * }
 *
 * Response: {
 *   shifts: Shift[]
 * }
 *
 */

/**
 * GET /shifts/:id
 *
 * Description: Retrieves specified shift.
 *
 * Permissions: User must be an employee within the schedule.
 *
 * Path Params:
 *   id - Shift identifier
 *
 * Response: {
 *   shift: Shift,
 *   startDate: Date,
 *   endDate: Date
 * }
 *
 */

/**
 * POST /shifts/:id
 *
 * Description: Modify specified shift or modify range over which shift series occurs.
 *
 * Permissions:
 *   * Employer will be able to modify entire shift and use all query params.
 *   * Assignee will be able to trade shift (change 'trading' if no 'claimant').
 *   * Any Employee will be able to claim offered ('trading') shift.
 *
 * Path Params:
 *   id - Shift identifier
 *
 * Query Params:
 *   adjustStart - (optional) Date to extend start of shift series
 *   adjustEnd - (optional) Date to extend end of shift series
 *   trade - (optional) trade the shift as requestor (options: offer, claim)
 *
 * Notes:
 *   * claimant: (optional) must not have conflicting shift
 *   * startTime must occur before endTime
 *   * all fields immutable (ingored) except claimant, startTime, endTime, trading
 *   * adjustStart <= startDate of series; adjustEnd >= startDate of series
 *   * request body ignored if query params specified
 *
 * Request: {
 *   shift: (optional) Shift
 * }
 *
 * Response: {
 *   shifts: Shift[]
 * }
 *
 */

/**
 * DELETE /shifts/:id
 *
 * Description: Delete specified shift (single shift) or partial series of shifts.
 *
 * Path Params:
 *   id - Shift identifier
 *
 * Query Params:
 *   startDate - (optional) shifts in series to delete after or on Date
 *   endDate - (optional) shifts in series to delete before or on Date
 *
 * Response: {
 *   shiftIds: ShiftID[]
 * }
 *
 * Notes:
 *   * startDate and endDate: multiple Shifts will be deleted within the series
 *   * startDate <= shift.date; endDate >= shift.date
 *
 */