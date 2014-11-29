var Time = function (hour, minute, meridian) {
    this.totalMinutes;
    this.hour;
    this.hourStandard;
    this.minute;
    this.meridian;
    this.formatted;

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