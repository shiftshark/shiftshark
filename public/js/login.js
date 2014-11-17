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
    inline  : true,
    on      : 'blur'
  };

  loginForm.form(rules, settings);

  // adds a listener to the form submit button
  $('.submit.button').click(function() {
    // attempts a form validation
    var validForm = loginForm.form('validate form');

    if (validForm) {
      var email = $('[name='email']').val();
      var password = $('[name='password']').val();

    // PERFORM AJAX CHECK
    }
  });
});