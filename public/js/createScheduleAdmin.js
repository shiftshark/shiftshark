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

  // open the trading modal
  $('.block-shift.trading').on('click', function() {
    $this = $(this);
    $('#assignOfferedTrigger').trigger('click');
    $this.addClass('active');
  });

  // open the modify shift modal
  $('.block-shift').not('.trading').on('click', function() {
    $this = $(this);
    var claimant = $this.attr('claimant');
    var assignee = $this.attr('assignee');
    var owner = claimant ? claimant : assignee;
    var curUser = $('#curUser').attr('userId');
    var tradeRadio = $('.modify .tradeOwn.field');

    // checks if shift belongs to user and shows appropriate radio buttons
    if (owner == curUser) {
        tradeRadio.removeClass('hidden');
    } else {
        tradeRadio.removeClass('hidden');
        tradeRadio.addClass('hidden');
        var editRadio = $('.modify.action [value="edit"]').parent();
        var deleteRadio = $('.modify.action [value="delete"]').parent();
        deleteRadio.checkbox('enable');
        editRadio.checkbox('enable');
    }

    // get clicked shift
    var shiftId   = $this.attr('shiftid');
    var series    = client_shifts_get_one(shiftId).data;
    var shift     = series.shift;
    var startTime = new Time(shift.startTime);
    var endTime   = new Time(shift.endTime);
    var startDate = new Date(series.startDate);
    var endDate   = new Date(series.endDate);

    // populate the appropriate fields in the form
    $('#modifyShift .startDate .datePicker').val(formatDate(startDate));
    $('#modifyShift .endDate .datePicker').val(formatDate(endDate));
    $('#modifyShift .startTime .timePicker').val(startTime.formatted);
    $('#modifyShift .endTime .timePicker').val(endTime.formatted);

    // open the modal via emulated click
    $('#modifyShiftTrigger').trigger('click');
    $this.addClass('active');
  });
});