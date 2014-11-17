/**
 * Client-side functions for interacting with /user API endpoints.
 * Author: aandre@mit.edu
 */

// function ajax_call (method, url, data, callback_success, callback_error)

/**
 * Function: client_login
 *
 * Call: POST /login
 *
 * Parameters:
 *   email            - String: user email
 *   password         - String: user password
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_login (email, password, callback_success, callback_error) {
  return ajax_call('POST', '/login', { username: email, password: password }, callback_success, callback_error);
}

/**
 * Function: client_logout
 *
 * Call: POST /logout
 *
 * Parameters:
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_logout (callback_success, callback_error) {
  return ajax_call('POST', '/logout', {}, callback_success, callback_error);
}

/**
 * Function: client_signup_employer
 *
 * Call: POST /users/employers/
 *
 * Parameters:
 *   data             - Object: { first_name, last_name, email, schedule_name, password }
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_signup_employer (data, callback_success, callback_error) {
  return ajax_call('POST', '/users/employers/', data, callback_success, callback_error);
}

/**
 * Function: client_signup_employee
 *
 * Call: POST /users/employers/
 *
 * Parameters:
 *   data             - Object: { first_name, last_name, email }
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns: Only returns when used synchronously; see definition for ajax_call(...).
 */
function client_signup_employee (data, callback_success, callback_error) {
  return ajax_call('POST', '/users/employees/', data, callback_success, callback_error);
}