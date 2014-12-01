$(document).ready(function() {
  var selector         = '.ui.delete.form';
  var $form            = $(selector);
  var recurring        = false;
  var $startTime       = $(selector + ' .startTime .timePicker');
  var $endTime         = $(selector + ' .endTime .timePicker');
  var components       = ['startTime', 'endTime'];
  var rules;
  var date = $('#schedule .active').attr('date');
  
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
      var availId = $('#schedule .active').attr('availid');

      // if success, update the schedule
      var success = function(result, status, xhr) {
        // clear the error message
        $('.ui.error.message').html('');
        // remove the loading animation
        $form.removeClass('loading');
        $form.removeClass('error');
        // close the fancybox
        $('.fancybox-close').trigger('click');

        // get the shift and set the date as a date object
        var availId  = result.availId;

        // update the schedule
        schedule.avail_remove(availId);
        bindScheduleListeners();
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
      client_avails_remove(availId, success, failure);
    }
  });
});