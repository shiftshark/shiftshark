$(document).ready(function() {
  var assignOfferForm = $('.ui.assignOffered.form');

  var employeeDropdown = $('.ui.assignOffered.form [name="select-employee"]').parent();

  var startHourDropdown     = $('.ui.assignOffered.form [name="start-hour"]').parent();
  var startMinuteDropdown   = $('.ui.assignOffered.form [name="start-minute"]').parent();
  var startMeridianDropdown = $('.ui.assignOffered.form [name="start-meridian"]').parent();

  var endHourDropdown     = $('.ui.assignOffered.form [name="end-hour"]').parent();
  var endMinuteDropdown   = $('.ui.assignOffered.form [name="end-minute"]').parent();
  var endMeridianDropdown = $('.ui.assignOffered.form [name="end-meridian"]').parent();

  var startMonthDropdown = $('.ui.assignOffered.form [name="start-month"]').parent();
  var startDayDropdown   = $('.ui.assignOffered.form [name="start-day"]').parent();
  var startYearDropdown  = $('.ui.assignOffered.form [name="start-year"]').parent();

  var endMonthDropdown   = $('.ui.assignOffered.form [name="end-month"]').parent();
  var endDayDropdown     = $('.ui.assignOffered.form [name="end-day"]').parent();
  var endYearDropdown    = $('.ui.assignOffered.form [name="end-year"]').parent();


  $('.ui.assignOffered.form .meridian').dropdown('set value', 'am');
  $('.ui.assignOffered.form .meridian').dropdown('set selected', 'AM');

  // form validation rules
  var rules = {
    selectEmployee : {
      identifier  : 'select-employee',
      rules: [
        {
          type  : 'empty',
          prompt: 'Please select an employee'
        }
      ]
    },
    startHour: {
      identifier  : 'start-hour',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter a start hour'
        },
        {
          type    : 'startTimeBeforeEnd[.ui.assignOffered.form]',
          prompt  : 'Start time is before or same as end time'
        }
      ]
    },
    startMinue: {
      identifier  : 'start-minute',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter a start minute'
        }
      ]
    },
    startMeridian: {
      identifier  : 'start-meridian'
    },
    endHour: {
      identifier  : 'end-hour',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter an end hour'
        }
      ]
    },
    endMinute: {
      identifier  : 'end-minute',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter an end minute'
        }
      ]
    },
    endMeridian: {
      identifier  : 'end-meridian'
    }
  };

  var settings = {
    inline  : false,
    on      : 'blur'
  };

  assignOfferForm.form(rules, settings);

  assignOfferForm.form('setting', 'onFailure', function(){
    $.fancybox.update();
  });

  assignOfferForm.form('setting', 'onSuccess', function(){
    $.fancybox.update();
  });

  $('.ui.assignOffered.form .submit.button').on('click', function() {
    var validForm = assignOfferForm.form('validate form');
    $.fancybox.update();

    if (validForm) {
      var employee = startHourDropdown.dropdown('get value');

      var startHour     = startHourDropdown.dropdown('get value');
      var startMinute   = startMinuteDropdown.dropdown('get value');
      var startMeridian = startMeridianDropdown.dropdown('get value');

      var endHour     = endHourDropdown.dropdown('get value');
      var endMinute   = endMinuteDropdown.dropdown('get value');
      var endMeridian = endMeridianDropdown.dropdown('get value');
    }
  });
});