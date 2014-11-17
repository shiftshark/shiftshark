$(document).ready(function() {
  var createShiftForm = $('.ui.createShift.form');
  var recurring = false;

  $('.ui.createShift.form .meridian').dropdown('set value', 'am')
  $('.ui.createShift.form .meridian').dropdown('set selected', 'AM')

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
          type    : 'startTimeBeforeEnd[.ui.createShift.form]',
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
    },
    startMonth: {
      identifier  : 'start-month',
      rules : [
        {
          type    : 'emptyRecurring[false]',
          prompt  : 'Please enter a start month'
        },
        {
          type    : 'validDate[.ui.createShift.form, start, false]',
          prompt  : 'Invalid start date'
        },
        {
          type    : 'startDateBeforeEndDate[.ui.createShift.form, false]',
          prompt  : 'Start date is after end date'
        }
      ]
    },
    startDay: {
      identifier  : 'start-day',
      rules : [
        {
          type    : 'emptyRecurring[false]',
          prompt  : 'Please enter a start eay'
        }
      ]
    },
    startYear: {
      identifier  : 'start-year',
      rules : [
        {
          type    : 'emptyRecurring[false]',
          prompt  : 'Please enter a start year'
        }
      ]
    },
    endMonth: {
      identifier  : 'end-month',
      rules : [
        {
          type    : 'emptyRecurring[false]',
          prompt  : 'Please enter an end month'
        },
        {
          type    : 'validDate[.ui.createShift.form, end, false]',
          prompt  : 'Invalid end date'
        }
      ]
    },
    endDay: {
      identifier  : 'end-day',
      rules : [
        {
          type    : 'emptyRecurring[false]',
          prompt  : 'Please enter an end day'
        }
      ]
    },
    endYear: {
      identifier  : 'end-year',
      rules : [
        {
          type    : 'emptyRecurring[false]',
          prompt  : 'Please enter an end year'
        }
      ]
    }
  };

  var settings = {
    inline  : false,
    on      : 'blur'
  };

  createShiftForm.form(rules, settings);

  var updateRules = function () {
    rules.startMonth.rules = [
      {
        type    : 'emptyRecurring[' + recurring + ']',
        prompt  : 'Please enter an start month'
      },
      {
        type    : 'validDate[.ui.createShift.form,start,' + recurring + ']',
        prompt  : 'Invalid start Date'
      }
    ];
    rules.startDay.rules = [
      {
        type    : 'emptyRecurring[' + recurring + ']',
        prompt  : 'Please enter start day'
      }
    ];
    rules.startYear.rules = [
      {
        type    : 'emptyRecurring[' + recurring + ']',
        prompt  : 'Please enter a start year'
      }
    ];

    rules.endMonth.rules = [
      {
        type    : 'emptyRecurring[' + recurring + ']',
        prompt  : 'Please enter an end month'
      },
      {
        type    : 'validDate[.ui.createShift.form,end,' + recurring + ']',
        prompt  : 'Invalid end date'
      },
      {
        type    : 'startDateBeforeEndDate[.ui.createShift.form,' + recurring + ']',
        prompt  : 'Start date is after end date'
      }
    ];
    rules.endDay.rules = [
      {
        type    : 'emptyRecurring[' + recurring + ']',
        prompt  : 'Please enter an end day'
      }
    ];
    rules.endYear.rules = [
      {
        type    : 'emptyRecurring[' + recurring + ']',
        prompt  : 'Please enter an end year'
      }
    ];
  }

  createShiftForm.form('setting', 'onFailure', function(){
    $.fancybox.update();
  });

  createShiftForm.form('setting', 'onSuccess', function(){
    $.fancybox.update();
  });


  $('.createShift.form .checkbox.toggle').checkbox('setting', 'onEnable', function(evt) {
    recurring = true;
    updateRules();
    var $recurring = $('.recurring');
    $recurring.removeClass('hidden');
    $.fancybox.update();
  });

  $('.createShift.form .checkbox.toggle').checkbox('setting', 'onDisable', function(evt) {
    recurring = false;
    updateRules();
    var $recurring = $('.recurring');
    $recurring.addClass('hidden');
    $.fancybox.update();
  });
});