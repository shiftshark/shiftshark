function bindScheduleListeners() {
  var fillInInfo = function($this){
    // get clicked shift
    var shiftId   = $this.attr('shiftid');
    var series    = client_shifts_get_one(shiftId).data;
    var shift     = series.shift;
    var startTime = new Time(shift.startTime);
    var endTime   = new Time(shift.endTime);
    var startDate = new Date(series.startDate);
    var endDate   = new Date(series.endDate);

    // populate the appropriate fields in the form
    $('#claimShift .startDate .datePicker, #tradeShift .startDate .datePicker').val(formatDate(startDate));
    $('#claimShift .endDate .datePicker, #tradeShift .endDate .datePicker').val(formatDate(endDate));
    $('#claimShift .startTime .timePicker, #tradeShift .startTime .timePicker').val(startTime.formatted);
    $('#claimShift .endTime .timePicker, #tradeShift .endTime .timePicker').val(endTime.formatted);
  }

  var $shifts = $('#schedule .block-shift');
  for(var i = 0; i < $shifts.length; i++) {
    var $shift = $($shifts[i]);
    var curUser = $('#curUser').attr('userId');
    var claimant = $shift.attr('claimant');
    var assignee = $shift.attr('assignee');
    var owner = claimant ? claimant : assignee;

    if (owner == curUser) {
      $shift.addClass('owned');
    }
  }

  // open the claiming modal
  $('.block-shift.trading').on('click', function() {
    $this = $(this);

    fillInInfo($this);

    $('#claimShiftTrigger').trigger('click');
    $this.addClass('active');
  });

  // open the trading shift modal
  $('.owned').not('.trading').on('click', function() {
    $this = $(this);
    var claimant = $this.attr('claimant');
    var assignee = $this.attr('assignee');
    var owner = claimant ? claimant : assignee;
    var curUser = $('#curUser').attr('userId');
    var tradeRadio = $('.modify .tradeOwn.field');

    fillInInfo($this);

    // open the modal via emulated click
    $('#tradeShiftTrigger').trigger('click');
    $this.addClass('active');
  });
}

$(document).ready(function() {
  // get the current date and create a timetable from that
  var curDate = $('#currentDate').attr('date');
  schedule = Timetable(new Date(curDate));
  // add the schedule to the page 
  $('#schedule').append(schedule);

  // get all positions
  var positions = client_positions_get_all().data.positions;

  // all positions are added to the schedule
  var i;
  var position;
  for(i = 0; position = positions[i]; i++) {
    schedule.position_add_update(position);
  }

  // gets all shifts
  var shifts = client_shifts_get_all({}).data.shifts;

  // all shifts are added to the schedule
  i = undefined;
  var shift;
  for (i = 0; shift = shifts[i]; i++) {
    shift.date = new Date(shift.date);
    schedule.shift_add_update(shift);
  }

  bindScheduleListeners();
});