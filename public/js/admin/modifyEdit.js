$(document).ready(function() {
  var editShiftForm = $('.ui.modify.edit.form');

  var startMonthDropdown = $('.ui.modify.edit.form [name="start-month"]').parent();
  var startDayDropdown   = $('.ui.modify.edit.form [name="start-day"]').parent();
  var startYearDropdown  = $('.ui.modify.edit.form [name="start-year"]').parent();

  var endMonthDropdown   = $('.ui.modify.edit.form [name="end-month"]').parent();
  var endDayDropdown     = $('.ui.modify.edit.form [name="end-day"]').parent();
  var endYearDropdown    = $('.ui.modify.edit.form [name="end-year"]').parent();


  // form validation rules
  var rules = {
    startMonth: {
      identifier  : 'start-month',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter a start month'
        },
        {
          type    : 'validDate[.ui.ui.modify.edit.form, start, true]',
          prompt  : 'Invalid start date'
        }
      ]
    },
    startDay: {
      identifier  : 'start-day',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter a start eay'
        }
      ]
    },
    startYear: {
      identifier  : 'start-year',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter a start year'
        }
      ]
    },
    endMonth: {
      identifier  : 'end-month',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter an end month'
        },
        {
          type    : 'validDate[.ui.ui.modify.edit.form, end, true]',
          prompt  : 'Invalid end date'
        },
        {
          type    : 'startDateBeforeEndDate[.ui.ui.modify.edit.form, true]',
          prompt  : 'Start date is after end date'
        }
      ]
    },
    endDay: {
      identifier  : 'end-day',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter an end day'
        }
      ]
    },
    endYear: {
      identifier  : 'end-year',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter an end year'
        }
      ]
    }
  };

  var settings = {
    inline  : false
  };

  editShiftForm.form(rules, settings);

  editShiftForm.form('setting', 'onFailure', function(){
    $.fancybox.update();
  });

  editShiftForm.form('setting', 'onSuccess', function(){
    $.fancybox.update();
  });


  $('.ui.modify.edit.form .submit.button').on('click', function() {
    editShiftForm.form('validate form');
    var isValid = !editShiftForm.hasClass('error');
    $.fancybox.update();

    if (isValid) {
      var startMonth = startMonthDropdown.dropdown('get value');
      var startDay   = startDayDropdown.dropdown('get value');
      var startYear  = startYearDropdown.dropdown('get value');

      var endMonth   = endMonthDropdown.dropdown('get value');
      var endDay     = endDayDropdown.dropdown('get value');
      var endYear    = endYearDropdown.dropdown('get value');

      //TODO: find the real shift ID
      var shiftId = '546ad8a43f01a023115d36ce';
      var adjustStart = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
      var adjustEnd = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay));
      //TODO: find out if it was traded beforehand
      var trade = false;

      var query = {
        adjustStart:adjustStart,
        adjustEnd:adjustEnd,
        trade:trade
      }

      var shift = {
      }

      var success = function(result, status, xhr) {
        $('.ui.error.message').html('');
        editShiftForm.removeClass('loading');
        $('.fancybox-close').trigger('click');
        var shift = result.shift;
        $('.ui.modify.edit.form .dropdown').dropdown('restore defaults');
        //TODO: Interact with Michael's calendar
      };

      var failure = function(xhr, status, err) {
        $('.ui.error.message').html('<ul class="list"><li>Validation error. Please log in again.</li></ul>');
        editShiftForm.removeClass('loading');
      };

      client_shifts_change (shiftId, query, shift, success, failure);
    }
  });
});