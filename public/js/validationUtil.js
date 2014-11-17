var timeToMinutes = function(hour, minute, meridian) {
    hour = hour == 12 ? 0 : hour;
    minute = parseInt(minute);

    if (meridian == 'am') {
      return (hour * 60 + minute);
  } else {
      return ((hour + 12) * 60 + minute);
  }
};

$.fn.form.settings.rules.startTimeBeforeEnd = function (value, selector) {
  var startHourDropdown = $(selector + ' [name="start-hour"]').parent();
  var startMinuteDropdown = $(selector + ' [name="start-minute"]').parent();
  var startMeridianDropdown = $(selector + ' [name="start-meridian"]').parent();

  var endHourDropdown = $(selector + ' [name="end-hour"]').parent();
  var endMinuteDropdown = $(selector + ' [name="end-minute"]').parent();
  var endMeridianDropdown = $(selector + ' [name="end-meridian"]').parent();


  var startHour = startHourDropdown.dropdown('get value');
  var startMinute = startMinuteDropdown.dropdown('get value');
  var startMeridian = startMeridianDropdown.dropdown('get value');

  var endHour = endHourDropdown.dropdown('get value');
  var endMinute = endMinuteDropdown.dropdown('get value');
  var endMeridian = endMeridianDropdown.dropdown('get value');

  if (startHour == '' || startMinute == '' || startMeridian == '' || endHour == '' || endMinute == '' || endMeridian == '') {
    return true;
  }

  var startMinutes = timeToMinutes(startHour, startMinute, startMeridian);
  var endMinutes = timeToMinutes(endHour, endMinute, endMeridian);

  if (startMinutes >= endMinutes) {
    startMinuteDropdown.addClass('error');
    startMeridianDropdown.addClass('error');
    endHourDropdown.addClass('error');
    endMinuteDropdown.addClass('error');
    endMeridianDropdown.addClass('error');

    return false;
  } else {
    startMinuteDropdown.removeClass('error');
    startMeridianDropdown.removeClass('error');
    endHourDropdown.removeClass('error');
    endMinuteDropdown.removeClass('error');
    endMeridianDropdown.removeClass('error');

    return true;
  }
}

var validDate = function (value, vars) {
  var params    = vars.split(',');
  var selector  = params[0].trim();
  var section   = params[1].trim();
  var recurring = params[2].trim();

  recurring = recurring == "true" || recurring == true ? true : false;

  var monthDropdown = $(selector + ' [name="' + section + '-month"]').parent();
  var dayDropdown   = $(selector + ' [name="' + section + '-day"]').parent();
  var yearDropdown  = $(selector + ' [name="' + section + '-year"]').parent();

  var month = monthDropdown.dropdown('get value');
  var day   = dayDropdown.dropdown('get value');
  var year  = yearDropdown.dropdown('get value');

  if (!recurring || month == '' || day == '' || year == '') {
    return true;
  }

  month = parseInt(month);
  day   = parseInt(day);
  year  = parseInt(year);

  month = month - 1;

  var current = new Date(year, month, day);


  var correctYear  = current.getFullYear()  == year;
  var correctMonth = current.getMonth() == month;
  var correctDay   = current.getDate()   == day;


  if (correctMonth && correctDay && correctYear) {
    dayDropdown.removeClass('error');
    yearDropdown.removeClass('error');

    return true;
  } else {

    dayDropdown.addClass('error');
    yearDropdown.addClass('error');

    return false;
  }
}

$.fn.form.settings.rules.validDate = validDate;

$.fn.form.settings.rules.startDateBeforeEndDate = function (value, vars) {
  var params    =  vars.split(',');
  var selector  = params[0].trim();
  var recurring = params[1].trim();

  recurring = recurring == "true" || recurring == true ? true : false;

  var startMonthDropdown = $(selector + ' [name="start-month"]').parent();
  var startDayDropdown   = $(selector + ' [name="start-day"]').parent();
  var startYearDropdown  = $(selector + ' [name="start-year"]').parent();

  var endMonthDropdown   = $(selector + ' [name="end-month"]').parent();
  var endDayDropdown     = $(selector + ' [name="end-day"]').parent();
  var endYearDropdown    = $(selector + ' [name="end-year"]').parent();


  var startMonth = startMonthDropdown.dropdown('get value');
  var startDay   = startDayDropdown.dropdown('get value');
  var startYear  = startYearDropdown.dropdown('get value');

  var endMonth   = endMonthDropdown.dropdown('get value');
  var endDay     = endDayDropdown.dropdown('get value');
  var endYear    = endYearDropdown.dropdown('get value');

  if (!recurring || startMonth == '' || startDay == '' || startYear == '' || endMonth == '' || endDay == '' || endYear == '') {
    return true;
  }

  startMonth = parseInt(startMonth);
  startDay   = parseInt(startDay);
  startYear  = parseInt(startYear);
  endMonth   = parseInt(endMonth);
  endDay     = parseInt(endDay);
  endYear    = parseInt(endYear);

  var validStart = validDate(undefined, selector + ',start,' + recurring);
  var validEnd   = validDate(undefined, selector + ',end,' + recurring);

  if (!(validStart && validEnd)) {
    return true;
  }

  var startDate = new Date(startYear, startMonth - 1, startDay);
  var endDate = new Date(endYear, endMonth - 1, endDay);

  if (startDate > endDate) {
    startMonthDropdown.addClass('error');
    startDayDropdown.addClass('error');
    startYearDropdown.addClass('error');
    endDayDropdown.addClass('error');
    endYearDropdown.addClass('error');

    return false;
  } else {
    startMonthDropdown.removeClass('error');
    startDayDropdown.removeClass('error');
    startYearDropdown.removeClass('error');
    endDayDropdown.removeClass('error');
    endYearDropdown.removeClass('error');

    return true;
  }
};

$.fn.form.settings.rules.emptyRecurring = function(value, recurring) {
  recurring = recurring == "true" || recurring == true ? true : false;

  if (recurring) {
    return !(value === undefined || value === "");
  }

  return true;
};