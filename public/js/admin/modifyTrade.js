$(document).ready(function() {
  var tradeShiftForm = $('.ui.modify.trade.form');
  
  var startHourDropdown     = $('.ui.modify.trade.form [name="start-hour"]').parent();
  var startMinuteDropdown   = $('.ui.modify.trade.form [name="start-minute"]').parent();
  var startMeridianDropdown = $('.ui.modify.trade.form [name="start-meridian"]').parent();

  var endHourDropdown     = $('.ui.modify.trade.form [name="end-hour"]').parent();
  var endMinuteDropdown   = $('.ui.modify.trade.form [name="end-minute"]').parent();
  var endMeridianDropdown = $('.ui.modify.trade.form [name="end-meridian"]').parent();


  $('.ui.modify.trade.form .meridian').dropdown('set value', 'am')
  $('.ui.modify.trade.form .meridian').dropdown('set selected', 'AM')

  // form validation rules
  var rules = {
    startHour: {
      identifier  : 'start-hour',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter a start hour'
        },
        {
          type    : 'startTimeBeforeEnd[.ui.modify.trade.form]',
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
    inline  : false
  };

  tradeShiftForm.form(rules, settings);


  tradeShiftForm.form('setting', 'onFailure', function(){
    $.fancybox.update();
  });

  tradeShiftForm.form('setting', 'onSuccess', function(){
    $.fancybox.update();
  });

  $('.ui.modify.trade.form .submit.button').on('click', function() {
    var validForm = tradeShiftForm.form('validate form');
    $.fancybox.update();

    if (validForm) {
      var startHour     = startHourDropdown.dropdown('get value');
      var startMinute   = startMinuteDropdown.dropdown('get value');
      var startMeridian = startMeridianDropdown.dropdown('get value');

      var endHour     = endHourDropdown.dropdown('get value');
      var endMinute   = endMinuteDropdown.dropdown('get value');
      var endMeridian = endMeridianDropdown.dropdown('get value');
    }
  });
});