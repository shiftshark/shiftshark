$(document).ready(function() {
  var loginForm = $('.ui.form');

  // form validation rules
  var rules = {
    email : {
      identifier  : 'email',
      rules: [
      {
        type  : 'empty',
        prompt: 'Please enter your email address'
      }, 
      {
        type: 'email',
        prompt: 'Please enter a valid email address'
      }
      ]
    },
    password: {
      identifier  : 'password',
      rules : [
      {
        type    : 'empty',
        prompt  : 'Please enter a password'
      }
      ]
    }
  };

  var settings = {
    inline  : false
  };

  loginForm.form(rules, settings);

  var login = function() {
    // attempts a form validation
    var validForm = loginForm.form('validate form');

    if (validForm) {
      var email = $('[name="email"]').val();
      var password = $('[name="password"]').val();

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
        beforeSend: function () {
          loginForm.addClass('loading');
        },
        error: function(xhr, status, err) {
          loginForm.removeClass('loading');
          loginForm.removeClass('success');
          $('.ui.error.message').html('<ul class="list"><li>Error logging in. Please try again</li></ul>');
          loginForm.addClass('error');
          console.log(xhr,status,err);

        },
        success: function (result, status, xhr) {
            $('.ui.error.message').html('');
            loginForm.removeClass('loading');
            window.location.reload();
        }
      });
    }
  };

  $('.ui.form').on('keyup', function(e) {
    if(e.keyCode == 13) {
      login();
      return false;
    } else {
      return false;
    }
  });

  // adds a listener to the form submit button
  $('.submit.button').click(function() {
    login();
  });
});