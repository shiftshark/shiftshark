/**
 * Basic client-side functions for interacting with API endpoints using AJAX.
 * Author: aandre@mit.edu
 */

/**
 * Function: ajax_call
 *
 * Description: General function to handle AJAX calls.
 *
 * Parameters:
 *   method           - String: {'POST', 'PUT', 'GET', 'DELETE'}
 *   url              - String: full URI
 *   data             - Object: request body
 *   callback_success - function (optional): success callback
 *   callback_error   - function (optional): failure callback
 *
 * Returns:
 *   Only returns data if used synchonously, neither callback specified.
 *     * success: { success: true, data: {...} }
 *     * failure: { success: false, statusCode, statusText, responseText }
 *
 */
function ajax_call (method, url, data, callback_success, callback_error) {
  var req = {
    url : url,
    type: method
  };

  if ((method === 'POST' || method === 'PUT') && data !== undefined && data !== null) {
    req.contentType = "application/json";
    req.data = JSON.stringify(data);
  }

  // asychronous
  if (typeof callback_success === 'function') {
    req.success = callback_success;
    if (typeof callback_error === 'function') {
      req.error = callback_error;
    }
    $.ajax(req);
  }
  // synchronous
  else {
    req.async = false;
    var response = "sdfdfdfsdf";
    req.success = function(result, status, xhr) {
      response = {
        success: true,
        data: result
      };
    };
    req.error = function(xhr, status, err) {
      response = {
        success: false,
        statusCode: xhr.status,
        statusText: xhr.statusText,
        responseText: xhr.responseText
      };
    };
    $.ajax(req); // blocks, because used synchronously
    return response;
  }
}