$(document).ready(function() {
    /*
    * Replace all SVG images with inline SVG
    */
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

    // instantiate the semantic checkboxes and dropdowns
    $('.ui.dropdown').dropdown();

    $('#logout').on('click', function() {
        var failure = function(xhr, status, err) {
            alert('Error logging out; please clear cookies and reload page.');
        };

        var success = function (result, status, xhr) {
            window.location.reload();
        };

        client_logout(success,failure)
    });

    // closes fancybox when the user hits cancel
    $('.cancel.button').on('click', function() {
        $('.fancybox-close').trigger('click');
    });

    // week navigation
    $('.weekNavigation').on('click', function() {
        $this = $(this);

        var isLeft = $this.hasClass('left');
        var currentDate = $('#currentDate').attr('date');
        currentDate = new Date(currentDate);

        if (isLeft) {
            var yesterday = currentDate;
            yesterday.setDate(currentDate.getDate()-7);
            window.location.replace("/?date=" + yesterday.toDateString());
        } else {
            var tomorrow = currentDate;
            tomorrow.setDate(currentDate.getDate()+7);
            window.location.replace("/?date=" + tomorrow.toDateString());
        }
    });
});