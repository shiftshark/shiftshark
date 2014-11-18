/**
 * Client-side functions for interacting with /positions API endpoints.
 * Author: aandre@mit.edu
 */

/**
 * Function: client_shifts_get_all
 *
 * Call: GET /shifts/
 *
 * Parameters:
 *   query            - Object: any of { startDate, endDate, trading, assignee, claimant } (resolves to querystring)
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_shifts_get_all (query, callback_success, callback_error) {
  // form url string with (optional) query paramters
  var url = '/shifts/';
  if (typeof query === "object" && query !== null && ! $.isEmptyObject(query))
    url += '?' + $.param(query);

  return ajax_call('GET', url, null, callback_success, callback_error);
}

/**
 * Function: client_shifts_create
 *
 * Call: POST /shifts/
 *
 * Parameters:
 *   shift            - Object: { assignee, claimant, position, startTime, endTime, date, trading }
 *   startDate        - Date: (null for unspecified)
 *   endDate          - Date: (null for unspecified)
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_shifts_create (shift, startDate, endDate, callback_success, callback_error) {
  // form request body with (optional) start/end dates
  var req = { shift: shift };
  if (typeof startDate === 'object' && startDate instanceof Date)
    req.startDate = startDate;
  if (typeof endDate === 'object' && endDate instanceof Date)
    req.endDate = endDate;
  return ajax_call('POST', '/shifts/', req, callback_success, callback_error);
}

/**
 * Function: client_shifts_get_one
 *
 * Call: GET /shifts/:id
 *
 * Parameters:
 *   id               - ShiftID
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_shifts_get_one (id, callback_success, callback_error) {
  return ajax_call('GET', '/shifts/' + String(id), null, callback_success, callback_error);
}

/**
 * Function: client_shifts_change
 *
 * Call: PUT /shifts/:id
 *
 * Parameters:
 *   id               - ShiftID
 *   query            - Object: any of { adjustStart, adjustEnd, trade }
 *   shift            - Object: { claimant: EmployeeID, trading: Boolean }
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Note on use cases:
 *   (combination will yeild unspecified consequences)
 *   * POST with Shift object only
 *   * POST with adjustStart and/or adjustEnd only
 *   * POST with trade query only
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_shifts_change (id, query, shift, callback_success, callback_error) {
  // form url string with (optional) query paramters
  var url = '/shifts/' + String(id);
  if (typeof query === "object" && query !== null && ! $.isEmptyObject(query))
    url += '?' + $.param(query);

  return ajax_call('PUT', url, { shift: shift }, callback_success, callback_error);
}

/**
 * Function: client_shifts_remove
 *
 * Call: DELETE /shifts/:id
 *
 * Parameters:
 *   id               - ShiftID
 *   query            - Object   (optional): any of { startDate, endDate }
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_shifts_remove (id, query, callback_success, callback_error) {
  // form url string with (optional) query paramters
  var url = '/shifts/' + String(id);
  if (typeof query === "object" && query !== null && ! $.isEmptyObject(query))
    url += '?' + $.param(query);

  return ajax_call('DELETE', url, null, callback_success, callback_error);
}