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
    $('#modifyShift .startDate .datePicker, #assignOffered .startDate .datePicker').val(formatDate(startDate));
    $('#modifyShift .endDate .datePicker, #assignOffered .endDate .datePicker').val(formatDate(endDate));
    $('#modifyShift .startTime .timePicker, #assignOffered .startTime .timePicker').val(startTime.formatted);
    $('#modifyShift .endTime .timePicker, #assignOffered .endTime .timePicker').val(endTime.formatted);
  }

  // open the trading modal
  $('.block-shift.trading').on('click', function() {
    $this = $(this);

    fillInInfo($this);

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

    fillInInfo($this);

    // open the modal via emulated click
    $('#modifyShiftTrigger').trigger('click');
    $this.addClass('active');
  });

  // opens create shift when clicking on an empty box
  $('.block-empty').not('.trading').on('click', function() {
    $this = $(this);
    // get the hours and the minutes
    var hour = parseInt($this.attr('hour'));
    var mins = parseInt($this.attr('quarter')) * 15;
    var position = $this.attr('position');
    // parse the time
    var time = moment(hour + " " + mins, "H m").format("hh:mm a");

    // set the start time value
    $('#createShift .startTime .timePicker').val(time);

    // get the position list
    var $positionList = $('#createShift .positionList div');

    // iterate through all positions
    for (var i = 0; i < $positionList.length; i++) {
      var $position = $($positionList[i]);
      var positionId = $position.attr('positionid');

      // make sure it is not selected
      $position.removeClass('active');

      // check if the position id matches what we clicked on
      if (positionId == position) {
        // get the position name
        var positionName = $position.html();
        // make it selected
        $position.addClass('active');

        // select the position and set the value
        $('#createShift [name="select-position"]').parent().dropdown('set value', positionName.toLowerCase());    
        $('#createShift [name="select-position"]').parent().dropdown('set selected', positionName);
      }
    }

    // open the modal via emulated click
    $('#createShiftTrigger').trigger('click');
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