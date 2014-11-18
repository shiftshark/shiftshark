$(document).ready(function() {
  var createShiftForm = $('.ui.createShift.form');
  var recurring = false;

  var employeeDropdown = $('.createShift.form [name="select-employee"]').parent();

  var startHourDropdown     = $('.createShift.form [name="start-hour"]').parent();
  var startMinuteDropdown   = $('.createShift.form [name="start-minute"]').parent();
  var startMeridianDropdown = $('.createShift.form [name="start-meridian"]').parent();

  var endHourDropdown     = $('.createShift.form [name="end-hour"]').parent();
  var endMinuteDropdown   = $('.createShift.form [name="end-minute"]').parent();
  var endMeridianDropdown = $('.createShift.form [name="end-meridian"]').parent();

  var startMonthDropdown = $('.createShift.form [name="start-month"]').parent();
  var startDayDropdown   = $('.createShift.form [name="start-day"]').parent();
  var startYearDropdown  = $('.createShift.form [name="start-year"]').parent();

  var endMonthDropdown   = $('.createShift.form [name="end-month"]').parent();
  var endDayDropdown     = $('.createShift.form [name="end-day"]').parent();
  var endYearDropdown    = $('.createShift.form [name="end-year"]').parent();


  $('.ui.createShift.form .meridian').dropdown('set value', 'am');
  $('.ui.createShift.form .meridian').dropdown('set selected', 'AM');

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
    inline  : false
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
    var $recurring = $('.ui.createShift.form .recurring');
    $recurring.removeClass('hidden');
    $.fancybox.update();
  });

  $('.createShift.form .checkbox.toggle').checkbox('setting', 'onDisable', function(evt) {
    recurring = false;
    updateRules();
    var $recurring = $('.ui.createShift.form .recurring');
    $recurring.addClass('hidden');
    $.fancybox.update();
  });

  $('#createShiftPrevious').on('click', function(){
    if (lastSMonth != "" && lastSDay   != "" && lastSYear  != "" && lastEMonth != "" && lastEDay   != "" && lastEYear  != "") {
      startMonthDropdown.dropdown('set value', lastSMonth);
      startMonthDropdown.dropdown('set selected', lastSMonth);

      startDayDropdown.dropdown('set value', lastSDay);
      startDayDropdown.dropdown('set selected', lastSDay);

      startYearDropdown.dropdown('set value', lastSYear);
      startYearDropdown.dropdown('set selected', lastSYear);


      endMonthDropdown.dropdown('set value', lastEMonth);
      endMonthDropdown.dropdown('set selected', lastEMonth);

      endDayDropdown.dropdown('set value', lastEDay);
      endDayDropdown.dropdown('set selected', lastEDay);

      endYearDropdown.dropdown('set value', lastEYear);
      endYearDropdown.dropdown('set selected', lastEYear);
    }
  });

  $('.createShift.form .submit.button').on('click', function() {
    var validForm = createShiftForm.form('validate form');
    $.fancybox.update();

    if (validForm) {
      var employee = startHourDropdown.dropdown('get value');

      var startHour     = startHourDropdown.dropdown('get value');
      var startMinute   = startMinuteDropdown.dropdown('get value');
      var startMeridian = startMeridianDropdown.dropdown('get value');

      var endHour     = endHourDropdown.dropdown('get value');
      var endMinute   = endMinuteDropdown.dropdown('get value');
      var endMeridian = endMeridianDropdown.dropdown('get value');

      var startMonth = startMonthDropdown.dropdown('get value');
      var startDay   = startDayDropdown.dropdown('get value');
      var startYear  = startYearDropdown.dropdown('get value');

      var endMonth   = endMonthDropdown.dropdown('get value');
      var endDay     = endDayDropdown.dropdown('get value');
      var endYear    = endYearDropdown.dropdown('get value');

      if (recurring) {
        lastSMonth = startMonth;
        lastSDay   = startDay;
        lastSYear  = startYear;
        lastEMonth = endMonth;
        lastEDay   = endDay;
        lastEYear  = endYear;
      }
    }
  });
});