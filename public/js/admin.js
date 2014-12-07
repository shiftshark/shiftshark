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
    // instantiate the semantic checkboxes and dropdowns
    $('.ui.dropdown').dropdown();

    // HTML to be put into the role button
    var roleInput = "<div class='ui icon roleInput input'>\
                        <input type='text'>\
                        <i class='right icon'></i>\
                    </div>";

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
            $(this).children().animate({width:'214px'}, function() {
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
            var position = client_positions_create({name:roleName}).data.position;
            schedule.position_add_update(position);
            $('.positionList').append('<div class="item" positionid="'+position._id+'">'+position.name+'</div>')
            $('.ui.dropdown').dropdown();
        }

        $('#roleButton .input').children().animate({height:'29px',width:'93px'}, function() {
            $that.html(roleButton);
            $that.removeClass('animating');
        });
    }

    // submits the new role / position when the user hits enter
    $('#roleButton').on('keypress', function(evt) {
        var isText = $($(this).children()[0]).hasClass('roleInput');
        if (evt.charCode == 13 && isText && !$that.hasClass('animating')) {
            $(this).focusout();
        }
    });

    // submits the enw role / position when the user unfocuses
    $('#roleButton').on('focusout', function(evt) {
        var isText = $($(this).children()[0]).hasClass('roleInput');
        if (isText && !$that.hasClass('animating')) {
            submitAndDestroyRoleInput(evt);
        }
    });
});