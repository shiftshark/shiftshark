var Time = function (hour, minute, meridian) {
    this.totalMinutes;
    this.hour;
    this.hourStandard;
    this.minute;
    this.meridian;
    this.formatted;

    if (typeof(hour) == 'string' && (hour.indexOf('am') > -1 || hour.indexOf('pm') > -1)) {
        var reg   = new RegExp('[\:\\s]');
        var time = hour;
        time = time.split(reg);

        hour     = parseInt(time[0]);
        minute   = parseInt(time[1]);
        meridian = time[2].toLowerCase();
    }

    if (minute === undefined || meridian == undefined) {
        minute                = hour;
        this.totalMinutes     = minute;
        this.minute           = minute % 60;
        this.hourStandard     = Math.floor(this.totalMinutes / 60);
        var meridianIndicator = Math.floor(this.hourStandard / 12);
        this.meridian         = meridianIndicator == 0 ? "am" : "pm";
        this.hour             = this.meridian == "am" ? this.hourStandard : this.hourStandard - 12;

        if (this.hour == 0) {
            this.hour = 12;
        }
    } else {
        hour     = parseInt(hour);
        minute   = parseInt(minute);
        meridian = meridian.toLowerCase()

        this.hour     = hour;
        this.minute   = minute;
        this.meridian = meridian;

        hour = hour == 12 ? 0 : hour;

        this.hourStandard = meridian == "am" ? hour : hour + 12;

        if (meridian == 'am') {
            this.totalMinutes = (hour * 60 + minute);
        } else {
            this.totalMinutes = ((hour + 12) * 60 + minute);
        }
    }

    var formattedHour = this.hour + '';
    formattedHour = formattedHour.length == 2 ? formattedHour : '0' + formattedHour;

    var formattedMinute = this.minute + '';
    formattedMinute = formattedMinute.length == 2 ? formattedMinute : '0' + formattedMinute;

    this.formatted = formattedHour + ':' + formattedMinute + ' ' + this.meridian;
    return this;
}

var formatDate = function(date) {
    var month = date.getMonth() + 1 + "";
    var day   = date.getDate() + "";
    var year  = date.getFullYear() + "";

    month = month.length == 2 ? month : "0" + month;
    day   = day.length   == 2 ? day   : "0" + day;

    return month + "/" + day + "/" + year;
}

var getOwnerFromShift = function (shift) {
    if (shift.claimant != null) {
        return shift.claimant.firstName + ' ' + shift.claimant.lastName
    } else {
        return shift.assignee.firstName + ' ' + shift.assignee.lastName
    }
}

var weekOf = function (date) {
    var day = (date.getDay() + 6) % 7; // week start adjustment

    // startDate = Monday of week
    var startDate = new Date(date.toDateString());
    startDate.setDate(startDate.getDate() - day);

    // endDate = first Sunday after startDate
    var endDate = new Date(startDate.toDateString());
    endDate.setDate(endDate.getDate() + 6);

    return { start: startDate, end: endDate };
}

$(function(){
    var $navToggle = $('nav .toggle.checkbox')
    $navToggle.checkbox();

    var employeeView = $navToggle.attr('employeeView');
    employeeView = employeeView === "true" ? true : false;
    console.log(employeeView);

    if (employeeView) {
        $navToggle.checkbox('enable');
    } else {
        $navToggle.checkbox('disable');
    }

    $navToggle.checkbox('setting', 'onEnable', function() {
        window.location.replace('/employee');
    });

    $navToggle.checkbox('setting', 'onDisable', function() {
        window.location.replace('/');
    });

})