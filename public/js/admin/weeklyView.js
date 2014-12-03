function changeWeeklyView() {
  // get the current date and create a timetable from that
  var curDate = $('#currentDate').attr('date');
  dailyView = !(dailyView);  //should be a global variable created in createSchedule

  if(dailyView){ //TODO: is calendar view? add to routes then end date => +7   //
    schedule = Calendar(new Date(curDate), new Date(curDate)); 
  }
  else{
    var weekDate = new Date(curDate);
    weekDate.setDate(weekDate.getDate() + 6); //plus 6 because end date is inclusive; last day of the 7-day week
    schedule = Calendar(new Date(curDate), weekDate);
  }

  // add the schedule to the page 
  $('#schedule').empty();
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

  console.log(schedule);

  bindScheduleListeners();
}