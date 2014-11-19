$(document).ready(function() {
  var tradeOwnShiftForm = $('.ui.modify.tradeOwn.form');
  var entireShift = true;

  var employeeDropdown = $('.ui.modify.tradeOwn.form [name="select-employee"]').parent();

  var startHourDropdown     = $('.ui.modify.tradeOwn.form [name="start-hour"]').parent();
  var startMinuteDropdown   = $('.ui.modify.tradeOwn.form [name="start-minute"]').parent();
  var startMeridianDropdown = $('.ui.modify.tradeOwn.form [name="start-meridian"]').parent();

  var endHourDropdown     = $('.ui.modify.tradeOwn.form [name="end-hour"]').parent();
  var endMinuteDropdown   = $('.ui.modify.tradeOwn.form [name="end-minute"]').parent();
  var endMeridianDropdown = $('.ui.modify.tradeOwn.form [name="end-meridian"]').parent();

  $('.ui.modify.tradeOwn.form .meridian').dropdown('set value', 'am');
  $('.ui.modify.tradeOwn.form .meridian').dropdown('set selected', 'AM');

  var rules;
  var settings = {
    inline  : false
  };

  var updateRules = function () {
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
            type    : 'startTimeBeforeEnd[.ui.modify.tradeOwn.form]',
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

    tradeOwnShiftForm.form(rules, settings);
  }

  updateRules();

  tradeOwnShiftForm.form('setting', 'onFailure', function(){
    $.fancybox.update();
  });

  tradeOwnShiftForm.form('setting', 'onSuccess', function(){
    $.fancybox.update();
  });


  // $('.ui.modify.tradeOwn.form .checkbox.toggle').checkbox('setting', 'onEnable', function(evt) {
  //   entireShift = true;
  //   updateRules();
  //   var $entireShift = $('.ui.modify.tradeOwn.form .entireShift');
  //   $entireShift.addClass('hidden');
  //   $.fancybox.update();
  // });

  // $('.ui.modify.tradeOwn.form .checkbox.toggle').checkbox('setting', 'onDisable', function(evt) {
  //   entireShift = false;
  //   updateRules();
  //   var $entireShift = $('.ui.modify.tradeOwn.form .entireShift');
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

  $('.ui.modify.tradeOwn.form .submit.button').on('click', function() {
    tradeOwnShiftForm.form('validate form');
    var isValid = !tradeOwnShiftForm.hasClass('error');
    $.fancybox.update();

    if (isValid) {
      var employee = startHourDropdown.dropdown('get value');

      var startHour     = startHourDropdown.dropdown('get value');
      var startMinute   = startMinuteDropdown.dropdown('get value');
      var startMeridian = startMeridianDropdown.dropdown('get value');

      var endHour     = endHourDropdown.dropdown('get value');
      var endMinute   = endMinuteDropdown.dropdown('get value');
      var endMeridian = endMeridianDropdown.dropdown('get value');

      var shiftId    = $('.scheduleWrapper .active').parent().attr('shift');
      var query = {
        trade : 'offer'
      }

      var success = function(result, status, xhr) {
        ("success");
        $('.ui.error.message').html('');
        $('.ui.modify.tradeOwn.form').removeClass('error');
        tradeOwnShiftForm.removeClass('loading');
        $('.fancybox-close').trigger('click');
        $('.ui.modify.tradeOwn.form .dropdown').dropdown('restore defaults');
        //TODO: Interact with Michael's calendar
        window.location.reload();
      };

      var failure = function(xhr, status, err) {
        $('.ui.modify.tradeOwn.form').removeClass('success');
        $('.ui.modify.tradeOwn.form').addClass('error');
        $('.ui.error.message').html('<ul class="list"><li>You are unauthorized to do this.</li></ul>');
        $.fancybox.update();
        tradeOwnShiftForm.removeClass('loading');
      };

      if (entireShift) {
        client_shifts_change(shiftId, query, null, success, failure);
      } else {

      }
    }
  });
});