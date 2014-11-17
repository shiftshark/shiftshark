/**
 * Client-side functions for interacting with /positions API endpoints.
 * Author: aandre@mit.edu
 */

/**
 * Function: client_positions_get_all
 *
 * Call: GET /positions/
 *
 * Parameters:
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_positions_get_all (callback_success, callback_error) {
  return ajax_call('GET', '/positions/', null, callback_success, callback_error);
}

/**
 * Function: client_positions_create
 *
 * Call: POST /positions/
 *
 * Parameters:
 *   position         - Object: { name: String }
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_positions_create (position, callback_success, callback_error) {
  return ajax_call('POST', '/positions/', { position: position }, callback_success, callback_error);
}

/**
 * Function: client_positions_get_one
 *
 * Call: GET /positions/:id
 *
 * Parameters:
 *   id               - PositionID
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_positions_get_one (id, callback_success, callback_error) {
  return ajax_call('GET', '/positions/' + String(id), null, callback_success, callback_error);
}

/**
 * Function: client_positions_change
 *
 * Call: PUT /positions/:id
 *
 * Parameters:
 *   id               - PositionID
 *   position         - Object: { name: String }
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_positions_change (id, position, callback_success, callback_error) {
  return ajax_call('PUT', '/positions/' + String(id), { position: position }, callback_success, callback_error);
}

/**
 * Function: client_positions_remove
 *
 * Call: DELETE /positions/:id
 *
 * Parameters:
 *   id               - PositionID
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_positions_remove (id, position, callback_success, callback_error) {
  return ajax_call('DELETE', '/positions/' + String(id), null, callback_success, callback_error);
}