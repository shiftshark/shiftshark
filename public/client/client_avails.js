/**
 * Client-side functions for interacting with /avails API endpoints.
 * Author: gendron@mit.edu
 */

/**
 * Function: client_avails_create
 *
 * Call: POST /avails
 *
 * Parameters:
 *   data             - Object: { employee, day, startTime, endTime }
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_avails_create (data, callback_success, callback_error) {
  return ajax_call('POST', '/avails', data, callback_success, callback_error);
}

/**
 * Function: client_avails_get_all
 *
 * Call: GET /avails
 *
 * Parameters:
 *   query            - Object (optional): { employee, day }
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_avails_get_all (query, callback_success, callback_error) {
  var url = '/avails/';
  if (typeof query === "object" && query !== null && ! $.isEmptyObject(query))
    url += '?' + $.param(query);

  return ajax_call('GET', url, null, callback_success, callback_error);
}

/**
 * Function: client_avails_get_one
 *
 * Call: GET /avails/:id
 *
 * Parameters:
 *   id               - String: availability ID
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_avails_get_one (id, callback_success, callback_error) {
  return ajax_call('GET', '/avails/' + String(id), null, callback_success, callback_error);
}

/**
 * Function: client_avails_change
 *
 * Call: PUT /avails/:id
 *
 * Parameters:
 *   id               - String: availability ID
 *   data             - Object: { startTime, endTime }
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_avails_change (id, data, callback_success, callback_error) {
  return ajax_call('PUT', '/avails/' + String(id), data, callback_success, callback_error);
}

/**
 * Function: client_avails_remove
 *
 * Call: DELETE /avails/:id
 *
 * Parameters:
 *   id               - String: availability ID
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_avails_remove (id, callback_success, callback_error) {
  return ajax_call('DELETE', '/avails/' + String(id), null, callback_success, callback_error);
}
