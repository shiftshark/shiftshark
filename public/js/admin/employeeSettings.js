$(document).ready(function() {
  var addForm = $('.add.employee.form');

  // form validation rules
  var rules = {
    email   : {
      identifier: 'email',
      rules: [
        {
          type  : 'empty',
          prompt: 'Please enter your email address'
        }, 
        {
          type  : 'email',
          prompt: 'Please enter a valid email address'
        }
      ]
    },
    username: {
      identifier: 'username',
      rules: [
        {
          type  : 'empty',
          prompt: 'Please enter a name'
        }
      ]
    }
  };

  var settings = {
    inline: true,
    on    : 'blur'
  };

  addForm.form(rules, settings);

  $('.add.employee.form .submit.button').on('click', function() {
    var isValid = addForm.form('validate form');

    if (isValid) {
      // Ajax Call
    }
  });
});