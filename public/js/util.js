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
    var $navToggle = $('nav .toggle.checkbox');
    $navToggle.checkbox();

    var employeeView = $navToggle.attr('employeeView');
    employeeView = employeeView === "true" ? true : false;

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

    // Replace all SVG images with inline SVG
    jQuery('img.svg').each(function(){
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function(data) {
      // Get the SVG tag, ignore the rest
      var $svg = jQuery(data).find('svg');

      // Add replaced image's ID to the new SVG
      if(typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if(typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass+' replaced-svg');
      }

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');

      // Replace image with new SVG
      $img.replaceWith($svg);
    }, 'xml');
    });

    // Instantiate the fancybox settings
    $('.fancybox').fancybox({
      maxWidth    : 500,
      minWidth    : 500,
      fitToView   : false,
      autoHeight  : true,
      autoResize  : true,
      scrolling   : 'no',
      afterClose  : function() {
        $('#schedule .active').removeClass('active');
      }
    });

    $('.datePicker').datetimepicker({
      timepicker : false,
      format     : 'm/d/Y'
    });

    $('.timePicker').datetimepicker({
      datepicker : false,
      step       : 15,
      scrollTime : true,
      format     : 'h:i a'
    });

    // closes fancybox when the user hits cancel
      $('.cancel.button').on('click', function() {
          $('.fancybox-close').trigger('click');
      });

    $('#logout').on('click', function() {
      var failure = function(xhr, status, err) {
        alert('Error logging out; please clear cookies and reload page.');
      };

      var success = function (result, status, xhr) {
        window.location.reload();
      };

      client_logout(success,failure);
    });
})