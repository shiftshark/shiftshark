var getAllEmployees = function() {
    var employees;
    $.ajax({
        url : '/users/employees/',
        type: 'GET',
        async: false,
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function (result, status, xhr) {
            employees = result.employees;
        }
    });

    return employees;
};

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

    // Instantiate the fancybox settings
    $('.fancybox').fancybox({
        maxWidth    : 700,
        minWidth    : 700,
        fitToView   : false,
        autoHeight  : true,
        autoResize  : true,
        scrolling   : 'no',
        afterClose  : function() {
            $('#schedule .active').removeClass('active');
        }
    });

    // instantiate the semantic checkboxes and dropdowns
    $('.ui.checkbox').checkbox();
    $('.ui.dropdown').dropdown();

    // HTML to be put into the role button
    var roleInput = "<div class='ui icon roleInput input'>\
                        <input type='text'>\
                        <i class='right icon'></i>\
                    </div>"

    // Find the role button
    var roleButton = $('#roleButton').html();

    // click listener on the role button turns the button into a textbox
    $('#roleButton').on('click', function() {
        // checks if it is a textbox
        var isText = $($(this).children()[0]).hasClass('roleInput');

        // if it is a button then transform it into a text input
        if (!isText) {
            // store this jquery object
            $that = $(this);
            // animate the button into a new size
            $(this).children().animate({height:'31px',width:'214px'}, function() {
                // replace the button with a textbox
                $that.html(roleInput);
                // set the focus to the textbox
                $('#roleButton input').focus();
            });
        }
    });

    // destroys the text input and submits the text to the server
    var submitAndDestroyRoleInput = function(evt) {
        // get the text within the button
        var roleName = $('.roleInput input').val();

        $that = $('#roleButton');
        $that.addClass('animating');

        if (roleName.length != 0) {
            client_positions_create({name:roleName});
        }

        $('#roleButton .input').children().animate({height:'29px',width:'93px'}, function() {
            $that.html(roleButton);
            $that.removeClass('animating');
            window.setTimeout(window.location.reload(), 1000);
        });

        // TODO: Add to displayed schedule
        
    }

    $('#roleButton').on('keypress', function(evt) {
        var isText = $($(this).children()[0]).hasClass('roleInput');
        if (evt.charCode == 13 && isText && !$that.hasClass('animating')) {
            $(this).focusout();
        }
    });

    $('#roleButton').on('focusout', function(evt) {
        var isText = $($(this).children()[0]).hasClass('roleInput');
        if (isText && !$that.hasClass('animating')) {
            submitAndDestroyRoleInput(evt);
        }
    });

    $('.cancel.button').on('click', function() {
        $('.fancybox-close').trigger('click');
    })

    $('#logout').on('click', function() {
        var failure = function(xhr, status, err) {
            alert('Error logging out; please clear cookies and reload page.');
        };

        var success = function (result, status, xhr) {
            window.location.reload();
        };

        client_logout(success,failure)
    });

    // date navigation
    $('.dateNavigation').on('click', function() {
        $this = $(this);

        var isLeft = $this.hasClass('left');
        var currentDate = $('#currentDate').attr('date');
        currentDate = new Date(currentDate);

        if (isLeft) {
            var yesterday = currentDate;
            yesterday.setDate(currentDate.getDate()-1);
            window.location.replace("/?date=" + yesterday.toDateString());
        } else {
            var tomorrow = currentDate;
            tomorrow.setDate(currentDate.getDate()+1);
            window.location.replace("/?date=" + tomorrow.toDateString());
        }
    });
});