/**
 * API Specification Authors: aandre@mit.edu, gendron@mit.edu
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
 * GET /avails/
 *
 * Description: Retrieves specified availibilities.
 *
 * Permissions:
 *   * Employer can retrieve any employee's availibility.
 *   * Employee can retrieve own availability.
 *
 * Query Params:
 *   * employee - Employee identifier
 *   * day - weekday that employees are available [0,6]
 *   * startTime - avails occurring after or on Time [0, 1439]
 *   * endTime - avails occurring before or on Time [0, 1439]
 *
 * Notes:
 *   * availibilites lasting over period between startTime and endTime may
 *     include those starting/ending outside of this period
 *
 * Response: {
 *   avails: Avail[]
 * }
 *
 */

 /**
 * POST /avails/
 *
 * Description: Create a new availability object.
 *
 * Permissions:
 *   * An employer can create availability for any employee.
 *   * An employee can create availability for themselves.
 *
 * Notes:
 *   * startTime < endTime
 *   * cannot conflict with existing availability objects' times
 *
 * Request: {
 *   avail: Avail
 * }
 *
 * Response: {
 *   avail: Avail
 * }
 *
 */

 /**
 * GET /avails/:id
 *
 * Description: Retrieve a specific availability object.
 *
 * Permissions:
 *   * Employer can retrieve any employee's availibility.
 *   * Employee can retrieve own availability.
 *
 * Path Params:
 *   id - Availibility identifier
 *
 * Response: {
 *   avail: Avail
 * }
 *
 */

 /**
 * POST /avails/:id
 *
 * Description: Modify the specified availability.
 *
 * Permissions: Only employee can modify own availability.
 *
 * Path Params:
 *   id - Availibility identifier
 *
 * Notes:
 *   * startTime < endTime
 *   * only startTime and endTime are mutable
 *   * cannot conflict with existing availability objects' times
 *
 * Request: {
 *   avail: Avail
 * }
 *
 * Response: {
 *   avail: Avail
 * }
 *
 */

 /**
 * DELETE /avails/:id
 *
 * Description: Delete specified availability.
 *
 * Permissions: Only employee can delete own availability.
 *
 * Path Params:
 *   id - Availibility identifier
 *
 * Response: {
 *   availId: AvailID
 * }
 *
 */