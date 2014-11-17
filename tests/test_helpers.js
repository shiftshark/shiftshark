/**
 * Client-side helper functions for basic authentication and account creation.
 * Author: aandre@mit.edu
*/

/**
 * Sample non-async ajax call. Do no use synchronous for testing.
 */
// function sample_ajax(username, password) {
//     var data;
//     $.ajax({
//         url : '/u/r/l',
//         type: 'POST',
//         async: false,
//         contentType: "application/json",
//         data: JSON.stringify({}),
//         success: function (result, status, xhr) {
//             data = result;
//         }
//     });
//     return data;
// }

function clear_employer (del_employees) {
  var url = (del_employees === undefined || del_employees === false) ?
              '/clear_all' : '/clear_all?employees=true';
  var success = false;
  $.ajax({
      url : url,
      type: 'DELETE',
      async: false,
      success: function (xhr, status, error) { success = true; }
  });
  return success;
}

function test_employer_login () {
  return client_login("employer-one@andreaboulian.com", "thisPasswd").success;
}

/////////////////////
// Configure QUnit //
/////////////////////

QUnit.config.reorder = false;
