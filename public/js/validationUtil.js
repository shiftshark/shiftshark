var lastSDate = "";
var lastEDate = "";


var validMeridian = function(meridian) {
  return meridian == 'am' || meridian == 'pm';
}


var validTime = function(value) {
  // splits amongst the hh:mm aa
  var reg = new RegExp('[\:\\s]')
  var time    = value.split(reg);

  // if there are not 3 sections, fail
  if (time.length != 3) {
    return false;
  }

  // get hours minutes and meridian
  var hour     = parseInt(time[0]);
  var minute   = parseInt(time[1]);
  var meridian = time[2].toLowerCase();

  // check if am or pm
  var isValidMeridian = validMeridian(meridian);

  // check if any are NaN or if invalid meridian
  if (isNaN(hour + minute) || !isValidMeridian) {
    return false;
  }

  // check if hours and minutes are in range
  if (hour > 12 || hour < 1 || minute < 0 || minute > 59) {
    return false;
  }

  return true;
}

$.fn.form.settings.rules.validTime = validTime;

$.fn.form.settings.rules.startTimeBeforeEnd = function (value, selector) {
  var $startTime = $(selector + ' .startTime .timePicker');
  var $endTime   = $(selector + ' .endTime .timePicker');
  var startTime = $startTime.val();
  var endTime   = $endTime.val();

  // ignore if this is any are an invalid time
  if (!validTime(startTime) || !validTime(endTime)) {
    return true;
  }

  // split amongst rules
  var reg       = new RegExp('[\:\\s]')
  startTime     = startTime.split(reg);
  endTime       = endTime.split(reg);

  var startHour     = parseInt(startTime[0]);
  var startMinute   = parseInt(startTime[1]);
  var startMeridian = startTime[2].toLowerCase();

  var endHour     = parseInt(endTime[0]);
  var endMinute   = parseInt(endTime[1]);
  var endMeridian = endTime[2].toLowerCase();

  // get and compare total minutes past midnight
  var startMinutes = Time(startHour, startMinute, startMeridian).totalMinutes;
  var endMinutes = Time(endHour, endMinute, endMeridian).totalMinutes;

  if (startMinutes >= endMinutes) {
    $endTime.parent().parent().addClass('error');
    return false;

  } else {
    $endTime.parent().parent().removeClass('error');
    return true;
  }
}

var validDate = function (value, recurring) {
  var date = value.split('/');

  // parses the recurring variable
  recurring = recurring == "true" || recurring == true ? true : false;

  // ignore if it is not recurring
  if (!recurring) {
    return true;
  }

  // wrong format fail
  if (date.length != 3) {
    return false
  }

  month = parseInt(date[0]);
  day   = parseInt(date[1]);
  year  = parseInt(date[2]);

  // if any are not a number fail
  if(isNaN(month + day + year)) {
    return false
  }

  // readjust the month to be zero indexed
  month = month - 1;

  var current = new Date(year, month, day);

  // check if the dates dont match (from month / day overflow)
  var correctYear  = current.getFullYear() == year;
  var correctMonth = current.getMonth()    == month;
  var correctDay   = current.getDate()     == day;

  if (correctMonth && correctDay && correctYear) {
    return true;

  } else {
    return false;
  }
}

$.fn.form.settings.rules.validDate = validDate;

$.fn.form.settings.rules.startDateBeforeEndDate = function (value, vars) {
  var params    =  vars.split(',');
  var selector  = params[0].trim();
  var recurring = params[1].trim();

  // parse recurring
  recurring = recurring == "true" || recurring == true ? true : false;

  var $startDate = $(selector + ' .startDate .datePicker');
  var $endDate   = $(selector + ' .endDate .datePicker');
  var startDate  = $startDate.val();
  var endDate    = $endDate.val();

  // if not recurring or not valid date, ignore this test
  if (!recurring || !validDate(startDate, recurring) || !validDate(endDate, recurring)) {
    return true;
  }

  // split amongst the slashes
  startDate = startDate.split('/');
  endDate   = endDate.split('/');

  startMonth = parseInt(startDate[0]);
  startDay   = parseInt(startDate[1]);
  startYear  = parseInt(startDate[2]);
  endMonth   = parseInt(endDate[0]);
  endDay     = parseInt(endDate[1]);
  endYear    = parseInt(endDate[2]);

  // Month is zero indexed
  var startDate = new Date(startYear, startMonth - 1, startDay);
  var endDate = new Date(endYear, endMonth - 1, endDay);

  // if start date is after end date, then return failure
  if (startDate > endDate) {
    $endDate.parent().parent().addClass('error');
    return false;

  } else {
    $endDate.parent().parent().removeClass('error');
    return true;
  }
};

// returns true if not recurring, else it checks if value is empty
$.fn.form.settings.rules.emptyRecurring = function(value, recurring) {
  recurring = recurring == "true" || recurring == true ? true : false;

  if (recurring) {
    return !(value === undefined || value === "");
  }

  return true;
};

// returns true if entire shift is selected, else it checks if value is empty
$.fn.form.settings.rules.emptyEntireShift = function(value, entireShift) {
  entireShift = entireShift == "true" || entireShift == true ? true : false;

  if (!entireShift) {
    return !(value === undefined || value === "");
  }

  return true;
};

// generates a set of validation rules based on a list of component names
rulesGenerator = function(components, selector, recurring) {
  if (recurring === undefined) {
    recurring = false;
  }

  rules = {
    positions : {
      identifier  : 'select-position',
      rules: [
        {
          type  : 'empty',
          prompt: 'Please select an employee'
        }
      ]
    },
    employees : {
      identifier  : 'select-employee',
      rules: [
        {
          type  : 'empty',
          prompt: 'Please select an employee'
        }
      ]
    },
    startTime: {
      identifier  : 'start-time',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter a start time'
        },
        {
          type    : 'validTime',
          prompt  : 'Not a valid start time'
        },
        {
          type    : 'startTimeBeforeEnd[' + selector + ']',
          prompt  : 'Start time is before or same as end time'
        }
      ]
    },
    endTime: {
      identifier  : 'end-time',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter an end time'
        },
        {
          type    : 'validTime',
          prompt  : 'Not a valid end time'
        }
      ]
    },
    startTimeEntire: {
      identifier  : 'start-time',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter a start time'
        },
        {
          type    : 'validTime',
          prompt  : 'Not a valid start time'
        },
        {
          type    : 'startTimeBeforeEnd[' + selector + ']',
          prompt  : 'Start time is before or same as end time'
        }
      ]
    },
    endTimeEntire: {
      identifier  : 'end-time',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Please enter an end time'
        },
        {
          type    : 'empty',
          prompt  : 'Not a valid end time'
        }
      ]
    },
    startDate: {
      identifier  : 'start-date',
      rules : [
        {
          type    : 'emptyRecurring[' + recurring + ']',
          prompt  : 'Please enter a start date'
        },
        {
          type    : 'validDate[' + selector + ',' + recurring + ']',
          prompt  : 'Please enter a valid start date'
        },
        {
          type    : 'startDateBeforeEndDate[' + selector + ',' + recurring + ']',
          prompt  : 'Start date after end date'
        }
      ]
    },
    endDate: {
      identifier  : 'end-date',
      rules : [
        {
          type    : 'emptyRecurring[' + recurring + ']',
          prompt  : 'Please enter an end date'
        },
        {
          type    : 'validDate[' + selector + ',' + recurring + ']',
          prompt  : 'Please enter a valid end date'
        }
      ]
    },
    text: {
      identifier  : 'text',
      rules : [
        {
          type    : 'empty',
          prompt  : 'Text cannot be empty.'
        }
      ]
    }
  };

  var i;
  var component;
  var selectedRules = {};
  for(i=0; component = components[i]; i++) {
    var rule = rules[component];
    if (rule) {
      selectedRules[component] = rule;
    }
  }

  return selectedRules;
}