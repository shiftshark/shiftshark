$(document).ready(function() {
  var selector         = '.ui.modify.assignOffered.form';
  var $form            = $(selector);
  var $employeeDropdown = $(selector + ' [name="select-employee"]').parent();
  var recurring        = false;
  var $startDate       = $(selector + ' .startDate .datePicker');
  var $endDate         = $(selector + ' .endDate .datePicker');
  var components       = ['employees'];
  var rules;

  var settings = {
    inline  : false
  };

  // generate a set of rules and apply them tot he form
  var updateRules = function () {
    rules = rulesGenerator(components, selector, recurring);
    $form.form(rules, settings);
  }

  // instantiate the rules
  updateRules();

  // reisize the fancybox on failure or success
  $form.form('setting', 'onFailure', function(){
    $.fancybox.update();
  });

  $form.form('setting', 'onSuccess', function(){
    $.fancybox.update();
  });

  // submit on submit button pressed
  $(selector + ' .submit.button').on('click', function() {
    $form.form('validate form');
    var validForm = !$form.hasClass('error');
    $.fancybox.update();

    // if valid, submit
    if (validForm) {
      // parse the start and end dates
      var employee  = $(selector + ' .employeeList .active').attr('employeeId');
      // get the shiftId
      var shiftId = $('#schedule .active').attr('shiftid');

      var newShift = {
        claimant : employee,
        trading   : false
      }

      // if success, update the schedule
      var success = function(result, status, xhr) {
        // clear the error message
        $('.ui.error.message').html('');
        // remove the loading animation
        $form.removeClass('loading');
        // close the fancybox
        $('.fancybox-close').trigger('click');

        // get the shift and set the date as a date object
        for (var i = 0; i < result.shifts.length; i++) {
          var shift = result.shifts[i];
          shift.date = new Date(shift.date);
          // update the schedule
          schedule.shift_add_update(shift);
        }
      };

      // do show error on failure
      var failure = function(xhr, status, err) {
        // show an error message
        $('.ui.error.message').html('<ul class="list"><li>' + err + '</li></ul>');
        $form.addClass('error');
        // resize fancybox
        $.fancybox.update();
        // removing loading animation
        $form.removeClass('loading');
      };

      // add a loading animation
      $form.addClass('loading');

      // submit to server
      client_shifts_change (shiftId, null, newShift, success, failure);
    }
  });
});