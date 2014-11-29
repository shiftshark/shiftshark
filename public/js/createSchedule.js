$(document).ready(function() {
  // get the current date and create a timetable from that
  var curDate = $('#currentDate').attr('date');
  var schedule = Timetable(new Date(curDate));
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

  $('.block-shift.trading').on('click', function() {
    $('#assignOfferedTrigger').trigger('click');
    $(this).addClass('active');
  });

  $('.block-shift').not('.trading').on('click', function() {
    $('#modifyShiftTrigger').trigger('click');
    $(this).addClass('active');
  });
});