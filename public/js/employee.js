$(document).ready(function() {
    // instantiate the semantic checkboxes and dropdowns
    $('.ui.dropdown').dropdown();

    // week navigation
    $('.weekNavigation').on('click', function() {
        $this = $(this);

        var isLeft = $this.hasClass('left');
        var currentDate = $('#currentDate').attr('date');
        currentDate = new Date(currentDate);

        var date = currentDate;
        if (isLeft) {
            date.setDate(currentDate.getDate()-7);
        } else {
            date.setDate(currentDate.getDate()+7);
        }
        $('#currentDate').attr('date', date);

        // re-create schedule
        $('#schedule').html("");
        initSchedule();
    });
});