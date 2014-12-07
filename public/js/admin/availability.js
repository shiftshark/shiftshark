$(document).ready(function() {
  // date navigation
  $('.dateNavigation').on('click', function() {
    $this = $(this);

    var isLeft = $this.hasClass('left');
    var weekday = parseInt($('#weekday').attr('weekday'),10);

    if (isLeft) {
      var weekday = (weekday + 6) % 7;
    } else {
      var weekday = (weekday + 1) % 7;
    }

    $('#weekday').attr('weekday', weekday);

    // re-create schedule
    $('#schedule').html("");
    initSchedule();
  });
});