$(document).ready(function() {
  var deleteShiftForm = $('.ui.modify.delete.form');
  var recurring = false;

  var startMonthDropdown = $('.modify.delete.form [name="start-month"]').parent();
  var startDayDropdown   = $('.modify.delete.form [name="start-day"]').parent();
  var startYearDropdown  = $('.modify.delete.form [name="start-year"]').parent();

  var endMonthDropdown   = $('.modify.delete.form [name="end-month"]').parent();
  var endDayDropdown     = $('.modify.delete.form [name="end-day"]').parent();
  var endYearDropdown    = $('.modify.delete.form [name="end-year"]').parent();


  // form validation rules
  var rules = {
    startMonth: {
      identifier  : 'start-month',
      rules : [
        {
          type    : 'emptyRecurring[false]',
          prompt  : 'Please enter a start month'
        },
        {
          type    : 'validDate[.ui.modify.delete.form, start, false]',
          prompt  : 'Invalid start date'
        },
        {
          type    : 'startDateBeforeEndDate[.ui.modify.delete.form, false]',
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
          type    : 'validDate[.ui.modify.delete.form, end, false]',
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

  deleteShiftForm.form(rules, settings);

  var updateRules = function () {
    rules.startMonth.rules = [
      {
        type    : 'emptyRecurring[' + recurring + ']',
        prompt  : 'Please enter an start month'
      },
      {
        type    : 'validDate[.ui.modify.delete.form,start,' + recurring + ']',
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
        type    : 'validDate[.ui.modify.delete.form,end,' + recurring + ']',
        prompt  : 'Invalid end date'
      },
      {
        type    : 'startDateBeforeEndDate[.ui.modify.delete.form,' + recurring + ']',
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

  deleteShiftForm.form('setting', 'onFailure', function(){
    $.fancybox.update();
  });

  deleteShiftForm.form('setting', 'onSuccess', function(){
    $.fancybox.update();
  });


  $('.modify.delete.form .checkbox.toggle').checkbox('setting', 'onEnable', function(evt) {
    recurring = true;
    updateRules();
    var $recurring = $('.modify.delete.form .recurring');
    $recurring.removeClass('hidden');
    $.fancybox.update();
  });

  $('.modify.delete.form .checkbox.toggle').checkbox('setting', 'onDisable', function(evt) {
    recurring = false;
    updateRules();
    var $recurring = $('.modify.delete.form .recurring');
    $recurring.addClass('hidden');
    $.fancybox.update();
  });

  $('#deleteShiftPrevious').on('click', function(){
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

  $('.modify.delete.form .submit.button').on('click', function() {
    deleteShiftForm.form('validate form');
    var isValid = !deleteShiftForm.hasClass('error');
    $.fancybox.update();

    if (isValid) {
      var startMonth = startMonthDropdown.dropdown('get value');
      var startDay   = startDayDropdown.dropdown('get value');
      var startYear  = startYearDropdown.dropdown('get value');

      var endMonth   = endMonthDropdown.dropdown('get value');
      var endDay     = endDayDropdown.dropdown('get value');
      var endYear    = endYearDropdown.dropdown('get value');

      var success = function(result, status, xhr) {
        $('.ui.error.message').html('');
        deleteShiftForm.removeClass('loading');
        $('.fancybox-close').trigger('click');
        var shift = result.shift;
        $('.modify.delete.form .dropdown').dropdown('restore defaults');
        //TODO: Interact with Michael's calendar
      };

      var failure = function(xhr, status, err) {
        $('.ui.error.message').html('<ul class="list"><li>Validation error. Please log in again.</li></ul>');
        deleteShiftForm.removeClass('loading');
      };

      //TODO: find real id of the shift
      var shiftId = '546ad8a43f01a023115d36ef';

      if (recurring) {
        lastSMonth = startMonth;
        lastSDay   = startDay;
        lastSYear  = startYear;
        lastEMonth = endMonth;
        lastEDay   = endDay;
        lastEYear  = endYear;

        var startDate = new Date(parseInt(startYear), parseInt(startMonth), parseInt(startDay));
        var endDate = new Date(parseInt(endYear), parseInt(endMonth), parseInt(endDay));

        var query = {
          startDate : startDate,
          endDate   : endDate
        };

        client_shifts_remove(shiftId, query, success, failure);
      } else {
        client_shifts_remove(shiftId, null, success, failure);
      }
    }
  });
});