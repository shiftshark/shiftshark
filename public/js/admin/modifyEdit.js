$(document).ready(function() {
  var editShiftForm = $('.ui.modify.edit.form');
  
  var employeeDropdown = $('.ui.modify.edit.form [name="select-employee"]').parent();

  var startHourDropdown     = $('.ui.modify.edit.form [name="start-hour"]').parent();
  var startMinuteDropdown   = $('.ui.modify.edit.form [name="start-minute"]').parent();
  var startMeridianDropdown = $('.ui.modify.edit.form [name="start-meridian"]').parent();

  var endHourDropdown     = $('.ui.modify.edit.form [name="end-hour"]').parent();
  var endMinuteDropdown   = $('.ui.modify.edit.form [name="end-minute"]').parent();
  var endMeridianDropdown = $('.ui.modify.edit.form [name="end-meridian"]').parent();

  $('.ui.modify.edit.form .meridian').dropdown('set value', 'am')
  $('.ui.modify.edit.form .meridian').dropdown('set selected', 'AM')

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
          type    : 'startTimeBeforeEnd[.ui.modify.edit.form]',
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

  editShiftForm.form(rules, settings);

  editShiftForm.form('setting', 'onFailure', function(){
    $.fancybox.update();
  });

  editShiftForm.form('setting', 'onSuccess', function(){
    $.fancybox.update();
  });

  $('.ui.modify.edit.form .submit.button').on('click', function() {
    var validForm = editShiftForm.form('validate form');

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