$(document).ready(function() {
  var loginForm = $('.ui.form');

  // form validation rules
  var rules = {
    firstName    : {
      identifier  : 'firstname',
      rules: [
        {
          type    : 'empty',
          prompt  : 'Please enter your first name'
        }
      ]
    },
    lastName    : {
      identifier  : 'lastname',
      rules: [
        {
          type    : 'empty',
          prompt  : 'Please enter your last name'
        }
      ]
    },
    scheduleName    : {
      identifier  : 'schedule-name',
      rules: [
        {
          type    : 'empty',
          prompt  : 'Please enter a schedule name'
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

    if (validForm) {
      var firstName    = $('[name="firstname"]').val();
      var lastName     = $('[name="lastname"]').val();
      var scheduleName = $('[name="schedule-name"]').val();
      var email        = $('[name="email"]').val();
      var password     = $('[name="password"]').val();

      $.ajax({
        url : '/users/employers/',
        type: 'POST',
        async: false,
        timeout: 10000,
        contentType: "application/json",
        data: JSON.stringify({
          first_name    : firstName,
          last_name     : lastName,
          email         : email,
          schedule_name : scheduleName,
          password      : password
        }),
        beforeSend: function () {
          loginForm.addClass('loading');
        },
        error: function(xhr, status, err) {
          loginForm.removeClass('loading');
          loginForm.removeClass('success');
          $('.ui.error.message').html('<ul class="list"><li>Error signing up. Please try again</li></ul>');
          loginForm.addClass('error');
          console.log(xhr,status,err);

        },
        success: function (result, status, xhr) {
          $('.ui.error.message').html('');
          console.log(result);
          loginForm.removeClass('loading');
        }
      });

      $.ajax({
        url : '/login',
        type: 'POST',
        async: true,
        timeout: 10000,
        contentType: "application/json",
        data: JSON.stringify({
          username : email,
          password : password
        }),
        error: function(xhr, status, err) {
          loginForm.removeClass('success');
          $('.ui.error.message').html('<ul class="list"><li>Error logging in. Please try again</li></ul>');
          loginForm.addClass('error');
          console.log(xhr,status,err);
        },
        success: function (result, status, xhr) {
            $('.ui.error.message').html('');
            console.log(result);
        }
      });
    }
  });
});