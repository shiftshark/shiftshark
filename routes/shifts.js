/**
 * METHOD /u/r/i
 *
 * Description:
 *
 * Path Params:
 *
 * Query Args:
 *
 * Request: {
 *
 * }
 *
 * Response: {
 *
 * }
 *
 */

 // -----------------------

/**
 * Shift Object Specification
 *
 * Shift: {
 *   assignee: Employee,
 *   claimant: Employee || null,
 *   schedule: Schedule,
 *   position: Position,
 *   day: [0,6],
 *   startTime: [0, 1439],
 *   endTime: [0, 1439],
 *   startDate: Date,
 *   endDate: Date || null,
 *   trading: Boolean
 * }
 */

/**
 * GET /shifts
 *
 * Description: Retrieve specified shifts within the schedule.
 *
 * Permissions: An employee within a schedule may retrieve information about any shift within that schedule.
 *
 * Query Params:
 *   startDate - shifts occurring after or on Date
 *   endDate - shifts occurring before or on Date
 *   trading - include shifts currently offered for trading (options: 0 or 1, default: Any)
 *   day - day of the week (options: [0, 6] , default: Any)
 *   assignee - Employee assigned to shift
 *   claimant - Employee claiming shift
 *
 * Response: {
 *   shifts: Shift[]
 * }
 *
 */

/**
 * POST /shifts
 *
 * Description: Create a new shift.
 *
 * Permissions: Schedule's owner (employer) may create shift with any employees and positions within their own schedule.
 *
 * Request: {
 *   shift: Shift
 * }
 *
 * Response: {
 *   shift: Shift
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
 *   shift: Shift
 * }
 *
 */

/**
 * POST /shifts/:id
 *
 * Description:
 *
 * Path Params:
 *   id - Shift identifier
 *
 * Query Args:
 *
 * Request: {
 *
 * }
 *
 * Response: {
 *
 * }
 *
 */

 /**
 * GET /shifts/:id/:date
 *
 * Description: Retrieves specified shift.
 *
 * Path Params:
 *   id - Shift identifier
 *
 * Response: {
 *   shift: Shift
 * }
 *
 */