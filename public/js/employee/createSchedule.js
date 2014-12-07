function findOwner() {
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
}

function bindScheduleListeners() {
  findOwner();

  var fillInInfo = function($this){
    $this.addClass('active');

    // get clicked shift
    var shiftId   = $this.attr('shiftid');
    var series    = client_shifts_get_one(shiftId).data;
    var shift     = series.shift;
    var startTime = new Time(shift.startTime);
    var endTime   = new Time(shift.endTime);
    var startDate = new Date(series.startDate);
    var endDate   = new Date(series.endDate);
    var shiftId   = $('#schedule .active').attr('shiftid');
    var series    = client_shifts_get_one(shiftId);
    var startTime = (new Time(series.data.shift.startTime)).formatted;
    var endTime   = (new Time(series.data.shift.endTime)).formatted;
    var ownerName = getOwnerFromShift(series.data.shift);

    // populate the appropriate fields in the form
    $('#modifyShift .startDate .datePicker, #assignOffered .startDate .datePicker').val(formatDate(startDate));
    $('#modifyShift .endDate .datePicker, #assignOffered .endDate .datePicker').val(formatDate(endDate));
    $('#modifyShift .startTime .timePicker, #assignOffered .startTime .timePicker').val(startTime.formatted);
    $('#modifyShift .endTime .timePicker, #assignOffered .endTime .timePicker').val(endTime.formatted);
    $('.ownerIndicator').html('You have selected ' + ownerName + ' shift from ' + startTime + ' to ' + endTime + '.');
  }

  // open the claiming modal
  $(document).on('click', '.block-shift.trading', function() {
    $this = $(this);

    fillInInfo($this);

    $('#claimShiftTrigger').trigger('click');
  });

  // open the trading shift modal
  $(document).on('click', '.owned', function() {
    $this = $(this);
    if($this.hasClass('trading')) {
      return;
    }
    var claimant = $this.attr('claimant');
    var assignee = $this.attr('assignee');
    var owner = claimant ? claimant : assignee;
    var curUser = $('#curUser').attr('userId');
    var tradeRadio = $('.modify .tradeOwn.field');

    fillInInfo($this);

    // open the modal via emulated click
    $('#tradeShiftTrigger').trigger('click');
  });
}

$(document).ready(function() {
  // get the current date and create weekly calendar from that
  var curDate = $('#currentDate').attr('date');
  dailyView = true;

  var curWeek = weekOf(new Date(curDate));
  $('#currentDate').html(moment(curWeek.start).format('ddd, ll') + "-<br>" +
                         moment(curWeek.end).format('ddd, ll'));
  schedule = Calendar(curWeek.start, curWeek.end);

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