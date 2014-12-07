$(document).ready(function() {
  // init Weekday to Monday
  $('#weekday').attr('weekday', 0);
  $('#weekDisplay').html('Monday');

  // date navigation
  $('.dayNavigation').on('click', function() {
    $this = $(this);

    var isLeft = $this.hasClass('left');
    var weekday = parseInt($('#weekday').attr('weekday'),10);

    if (isLeft) {
      var weekday = (weekday + 6) % 7;
    } else {
      var weekday = (weekday + 1) % 7;
    }

    $('#weekday').attr('weekday', weekday);
    var date = new Date(1970, 1, 2 + weekday);
    $('#weekday').html(moment(date).format('dddd'));

    // re-create schedule
    $('#schedule').html("");
    initSchedule();
  });

  $('#weekday').dropdown({
    onChange: function (val) {
      var weekday = parseInt(val, 10);
      $('#weekday').attr('weekday', weekday);
      var date = new Date(1970, 1, 2 + weekday);
      $('#weekDisplay').html(moment(date).format('dddd'));

      // re-create schedule
      $('#schedule').html("");
      initSchedule();
    },
    transition: 'fade',
    duration: 50
  });
});