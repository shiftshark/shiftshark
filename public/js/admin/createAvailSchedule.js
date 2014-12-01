$(document).ready(function() {
  var weekday = $('#weekday').attr('weekday');
  schedule = AvailabilityAdminTable(weekday);
  $('#schedule').append(schedule);
  var avails = client_avails_get_all().data.avails;

  for (var i = 0; i < avails.length; i++) {
    schedule.avail_add_update(avails[i]);
  }
});