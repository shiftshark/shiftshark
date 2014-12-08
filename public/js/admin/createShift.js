$(document).ready(function() {
  var selector         = '.ui.createShift.form';
  var $form            = $(selector);
  var recurring        = false;
  var employeeDropdown = $(selector + ' [name="select-employee"]').parent();
  var $startTime       = $(selector + ' .startTime .timePicker');
  var $endTime         = $(selector + ' .endTime .timePicker');
  var $startDate       = $(selector + ' .startDate .datePicker');
  var $endDate         = $(selector + ' .endDate .datePicker');
  var components       = ['positions', 'employees', 'startTime', 'endTime', 'startDate', 'endDate'];
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
    $('.shiftInfo').html('A shift is being created for <b>' + moment(date).format('dddd') + '</b>.');
    recurring = true;
    updateRules();
    var $recurring = $(selector + ' .recurring');
    $recurring.removeClass('hidden');
    $.fancybox.update();
  });

  // if the toggle is set to true set recurring to false, update the rules, and hide the recurring content
  $(selector + ' .checkbox.toggle').checkbox('setting', 'onDisable', function(evt) {
    $('.shiftInfo').html('A shift is being created for <b>' + (new Date(date)).toDateString() + '</b>.');
    recurring = false;
    updateRules();
    var $recurring = $(selector + ' .recurring');
    $recurring.addClass('hidden');
    $.fancybox.update();
  });

  // if the last button is pressed, then populate the date values
  $(selector + ' .lastButton').on('click', function(){
    if (lastSDate != "" && lastEDate != "") {
      $startDate.val(lastSDate);
      $endDate.val(lastEDate);
    }
  });

  // submit on submit button pressed
  $(selector + ' .submit.button').on('click', function() {
    $form.form('validate form');
    var validForm = !$form.hasClass('error');
    $.fancybox.update();

    // if valid, submit
    if (validForm) {
      var employee  = $(selector + ' .employeeList .active').attr('employeeId');
      var startTime = (new Time($startTime.val())).totalMinutes;
      var endTime   = (new Time($endTime.val())).totalMinutes;
      var position  = $(selector + ' .positionList .active').attr('positionId');
      var date = $('#schedule .active').attr('date');


      // selected day's date
      date = new Date(date);

      var data = {
        assignee  : employee,
        position  : position,
        startTime : startTime,
        endTime   : endTime,
        date      : date
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
        var shift  = result.shift;
        shift.date = new Date(shift.date);

        // restore dropdown defaults
        $(selector + ' .dropdown').dropdown('restore defaults');
        // update the schedule
        schedule.shift_add_update(shift);
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
        // save the start and end dates
        lastSDate = $startDate.val();
        lastEDate = $endDate.val();

        // parse the start and end dates
        var startDate = new Date($startDate.val());
        var endDate = new Date($endDate.val());

        // submit to server
        client_shifts_create(data, startDate, endDate, success, failure);
      } else {
        // submit not recurring to server
        client_shifts_create (data, null, null, success, failure);
      }
    }
  });
});