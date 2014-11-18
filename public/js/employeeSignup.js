$(document).ready(function() {
    var loginForm = $('.ui.form');

    // form validation rules
    var rules = {
        name    : {
            identifier  : 'username',
            rules: [
                {
                    type    : 'empty',
                    prompt  : 'Please enter your name'
                }
            ]
        },
        email   : {
            identifier  : 'email',
            rules: [
                {
                    type    : 'empty',
                    prompt  : 'Please enter your email address'
                }, 
                {
                    type    : 'email',
                    prompt  : 'Please enter a valid email address'
                }
            ]
        },
        password    : {
            identifier  : 'password',
            rules   : [
                {
                    type    : 'empty',
                    prompt  : 'Please enter a password'
                }
            ]
        },
        confirmPassword    : {
            identifier  : 'confirm-password',
            rules   : [
                {
                    type    : 'empty',
                    prompt  : 'Please enter a password'
                },
                {
                    type    : 'match[password]',
                    prompt  : 'Passwords do not match'
                }
            ]
        }
    };

    var settings = {
        inline  : false
    };

    loginForm.form(rules, settings);

    // adds a listener to the form submit button
    $('.submit.button').click(function() {
        // attempts a form validation
        var validForm = loginForm.form('validate form');
    $.fancybox.update();

        if (validForm) {
            var name = $('[name='username']').val();
            var email = $('[name='email']').val();
            var password = $('[name='password']').val();

            // PERFORM AJAX CHECK
        }
    });
});