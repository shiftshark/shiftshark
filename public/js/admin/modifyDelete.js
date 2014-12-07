$(document).ready(function() {
  var selector         = '.ui.modify.delete.form';
  var $form            = $(selector);
  var recurring        = false;
  var $startDate       = $(selector + ' .startDate .datePicker');
  var $endDate         = $(selector + ' .endDate .datePicker');
  var components       = ['startDate', 'endDate'];
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

  // if the toggle is set to true set recurring to true, update the rules, and show the recurring content
  $(selector + ' .checkbox.toggle').checkbox('setting', 'onEnable', function(evt) {
    recurring = true;
    updateRules();
    var $recurring = $(selector + ' .recurring');
    $recurring.removeClass('hidden');
    $.fancybox.update();
  });

  // if the toggle is set to true set recurring to false, update the rules, and hide the recurring content
  $(selector + ' .checkbox.toggle').checkbox('setting', 'onDisable', function(evt) {
    recurring = false;
    updateRules();
    var $recurring = $(selector + ' .recurring');
    $recurring.addClass('hidden');
    $.fancybox.update();
  });

  // submit on submit button pressed
  $(selector + ' .submit.button').on('click', function() {
    $form.form('validate form');
    var validForm = !$form.hasClass('error');
    $.fancybox.update();

    // if valid, submit
    if (validForm) {
      // get the shiftId
      var shiftId = $('#schedule .active').attr('shiftid');

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
        for (i = 0; i < result.shiftIds.length; i++) {
          var shiftId = result.shiftIds[i];
          // update the schedule
          schedule.shift_remove(shiftId);
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

      // if recurring then submit with start and end dates
      if (recurring) {
        // parse the start and end dates
        var startDate = new Date($startDate.val());
        var endDate = new Date($endDate.val());

        var query = {
          startDate : startDate,
          endDate   : endDate
        };

        // submit to server
        client_shifts_remove(shiftId, query, success, failure);
      } else {
        // submit not recurring to server
        client_shifts_remove(shiftId, null, success, failure);
      }
    }
  });
});