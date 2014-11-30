$(document).ready(function() {
  var selector         = '.ui.claim.shift.form';
  var $form            = $(selector);
  var entireShift      = false;
  var $startTime       = $(selector + ' .startTime .timePicker');
  var $endTime         = $(selector + ' .endTime .timePicker');
  var components       = [];
  var rules;

  var settings = {
    inline  : false
  };

  // generate a set of rules and apply them tot he form
  var updateRules = function () {
    rules = rulesGenerator(components, selector, entireShift);
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

  // if the toggle is set to true set entireShift to true, update the rules, and show the entireShift content
  $(selector + ' .checkbox.toggle').checkbox('setting', 'onEnable', function(evt) {
    entireShift = true;
    updateRules();
    var $entireShift = $(selector + ' .entireShift');
    $entireShift.removeClass('hidden');
    $.fancybox.update();
  });

  // if the toggle is set to true set entireShift to false, update the rules, and hide the entireShift content
  $(selector + ' .checkbox.toggle').checkbox('setting', 'onDisable', function(evt) {
    entireShift = false;
    updateRules();
    var $entireShift = $(selector + ' .entireShift');
    $entireShift.addClass('hidden');
    $.fancybox.update();
  });

  // submit on submit button pressed
  $(selector + ' .submit.button').on('click', function() {
    $form.form('validate form');
    var validForm = !$form.hasClass('error');
    $.fancybox.update();

    // if valid, submit
    if (validForm) {
      // get start and end times
      var startTime = (new Time($startTime.val())).totalMinutes;
      var endTime   = (new Time($endTime.val())).totalMinutes;
      // get the shiftId
      var shiftId = $('#schedule .active').attr('shiftid');

      var query = {
        trade : 'claim'
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
        var i;
        var shift;
        for (i = 0; shift = result.shifts[i]; i++) {
          shift.date = new Date(shift.date);
          // update the schedule
          schedule.shift_add_update(shift);
        }
        bindScheduleListeners();
      };

      // do show error on failure
      var failure = function(xhr, status, err) {
        console.log(status,err);
        // show an error message
        $('.ui.error.message').html('<ul class="list"><li>Validation error. Please log in again.</li></ul>');
        // resize fancybox
        $.fancybox.update();
        // removing loading animation
        $form.removeClass('loading');
      };

      // add a loading animation
      $form.addClass('loading');

      // if entireShift then submit with start and end dates
      if (entireShift) {
        // submit to server
        client_shifts_change(shiftId, query, null, success, failure);
      } else {
        // submit not entireShift to server
        client_shifts_change(shiftId, query, null, success, failure);
      }
    }
  });
});