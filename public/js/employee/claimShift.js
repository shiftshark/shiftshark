$(document).ready(function() {
  var claimShiftForm = $('.ui.claim.shift.form');
  var entireShift = true;

  var employeeDropdown = $('.ui.claim.shift.form [name="select-employee"]').parent();

  var startHourDropdown     = $('.ui.claim.shift.form [name="start-hour"]').parent();
  var startMinuteDropdown   = $('.ui.claim.shift.form [name="start-minute"]').parent();
  var startMeridianDropdown = $('.ui.claim.shift.form [name="start-meridian"]').parent();

  var endHourDropdown     = $('.ui.claim.shift.form [name="end-hour"]').parent();
  var endMinuteDropdown   = $('.ui.claim.shift.form [name="end-minute"]').parent();
  var endMeridianDropdown = $('.ui.claim.shift.form [name="end-meridian"]').parent();

  $('.ui.claim.shift.form .meridian').dropdown('set value', 'am');
  $('.ui.claim.shift.form .meridian').dropdown('set selected', 'AM');

  var rules;
  var settings = {
    inline  : false
  };

  var updateRules = function () {
    console.log(entireShift);
    // form validation rules
    rules = {
      startHour: {
        identifier  : 'start-hour',
        rules : [
          {
            type    : 'emptyEntireShift[' + entireShift + ']',
            prompt  : 'Please enter a start hour'
          },
          {
            type    : 'startTimeBeforeEnd[.ui.claim.shift.form]',
            prompt  : 'Start time is before or same as end time'
          }
        ]
      },
      startMinue: {
        identifier  : 'start-minute',
        rules : [
          {
            type    : 'emptyEntireShift[' + entireShift + ']',
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
            type    : 'emptyEntireShift[' + entireShift + ']',
            prompt  : 'Please enter an end hour'
          }
        ]
      },
      endMinute: {
        identifier  : 'end-minute',
        rules : [
          {
            type    : 'emptyEntireShift[' + entireShift + ']',
            prompt  : 'Please enter an end minute'
          }
        ]
      },
      endMeridian: {
        identifier  : 'end-meridian'
      }
    };

    claimShiftForm.form(rules, settings);
  }

  updateRules();

  claimShiftForm.form('setting', 'onFailure', function(){
    $.fancybox.update();
  });

  claimShiftForm.form('setting', 'onSuccess', function(){
    $.fancybox.update();
  });


  // $('.ui.claim.shift.form .checkbox.toggle').checkbox('setting', 'onEnable', function(evt) {
  //   entireShift = true;
  //   updateRules();
  //   var $entireShift = $('.ui.claim.shift.form .entireShift');
  //   $entireShift.addClass('hidden');
  //   $.fancybox.update();
  // });

  // $('.ui.claim.shift.form .checkbox.toggle').checkbox('setting', 'onDisable', function(evt) {
  //   entireShift = false;
  //   updateRules();
  //   var $entireShift = $('.ui.claim.shift.form .entireShift');
  //   $entireShift.removeClass('hidden');
  //   $.fancybox.update();
  // });

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

  $('.ui.claim.shift.form .submit.button').on('click', function() {
    claimShiftForm.form('validate form');
    var isValid = !claimShiftForm.hasClass('error');
    $.fancybox.update();

    if (isValid) {
      var employee = startHourDropdown.dropdown('get value');

      var startHour     = startHourDropdown.dropdown('get value');
      var startMinute   = startMinuteDropdown.dropdown('get value');
      var startMeridian = startMeridianDropdown.dropdown('get value');

      var endHour     = endHourDropdown.dropdown('get value');
      var endMinute   = endMinuteDropdown.dropdown('get value');
      var endMeridian = endMeridianDropdown.dropdown('get value');

      //TODO: get actual shift id
      var shiftId = 'asdfasdfasdf'
      var query = {
        trading : false
      }

      var success = function(result, status, xhr) {
        $('.ui.error.message').html('');
        claimShiftForm.removeClass('loading');
        $('.fancybox-close').trigger('click');
        $('.ui.claim.shift.form .dropdown').dropdown('restore defaults');
        //TODO: Interact with Michael's calendar
      };

      var failure = function(xhr, status, err) {
        $('.ui.error.message').html('<ul class="list"><li>Unspecified Error. :/</li></ul>');
        $.fancybox.update();
        claimShiftForm.removeClass('loading');
      };

      if (entireShift) {
        client_shifts_change(shiftId, query, success, failure);
      } else {

      }
    }
  });
});