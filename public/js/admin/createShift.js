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

  $(selector + ' .meridian').dropdown('set value', 'am');
  $(selector + ' .meridian').dropdown('set selected', 'AM');

  var settings = {
    inline  : false
  };

  var updateRules = function () {
    rules = rulesGenerator(components, selector, recurring);
    $form.form(rules, settings);
  }

  updateRules();

  $form.form('setting', 'onFailure', function(){
    $.fancybox.update();
  });

  $form.form('setting', 'onSuccess', function(){
    $.fancybox.update();
  });


  $(selector + ' .checkbox.toggle').checkbox('setting', 'onEnable', function(evt) {
    recurring = true;
    updateRules();
    var $recurring = $(selector + ' .recurring');
    $recurring.removeClass('hidden');
    $.fancybox.update();
  });

  $(selector + ' .checkbox.toggle').checkbox('setting', 'onDisable', function(evt) {
    recurring = false;
    updateRules();
    var $recurring = $(selector + ' .recurring');
    $recurring.addClass('hidden');
    $.fancybox.update();
  });

  $(selector + ' .lastButton').on('click', function(){
    if (lastSDate != "" && lastEDate != "") {
      $startDate.val(lastSDate);
      $endDate.val(lastEDate);
    }
  });

  $(selector + ' .submit.button').on('click', function() {
    $form.form('validate form');
    var validForm = !$form.hasClass('error');
    $.fancybox.update();

    if (validForm) {
      var employee = $(selector + ' .employeeList .active').attr('employeeId');

      var startTime = (new Time($startTime.val())).totalMinutes;
      var endTime   = (new Time($endTime.val())).totalMinutes;
      var position  = $(selector + ' .positionList .active').attr('positionId');
      var date      = $('#currentDate').attr('date');

      date = new Date(date);

      var data = {
        assignee  : employee,
        position  : position,
        startTime : startTime,
        endTime   : endTime,
        date      : date
      }

      console.log(startTime);

      var success = function(result, status, xhr) {
        $('.ui.error.message').html('');
        $form.removeClass('loading');
        $('.fancybox-close').trigger('click');
        var shift = result.shift;
        shift.date = new Date(shift.date);
        $(selector + ' .dropdown').dropdown('restore defaults');
        console.log(shift);
        schedule.shift_add_update(shift);
      };

      var failure = function(xhr, status, err) {
        console.log(status, err);
        $('.ui.error.message').html('<ul class="list"><li>Validation error. Please log in again.</li></ul>');
        $.fancybox.update();
        $form.removeClass('loading');
      };

      $form.addClass('loading');

      if (recurring) {
        lastSDate = $startDate.val();
        lastEDate = $endDate.val();

        var startDate = new Date($startDate.val());
        var endDate = new Date($endDate.val());

        client_shifts_create(data, startDate, endDate, success, failure);
      } else {
        client_shifts_create (data, null, null, success, failure);
      }
    }
  });
});