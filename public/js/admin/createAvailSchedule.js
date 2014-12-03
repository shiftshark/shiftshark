$(document).ready(function() {
  // get the weekday
  var weekday = $('#weekday').attr('weekday');
  // create an admin availability table for that day
  schedule = AvailabilityAdminTable(weekday);
  // place the schedule into the HTML
  $('#schedule').append(schedule);
  // get all availabilities
  var avails = client_avails_get_all().data.avails;

  // add each availability to the schedule
  for (var i = 0; i < avails.length; i++) {
    schedule.avail_add_update(avails[i]);
  }
});