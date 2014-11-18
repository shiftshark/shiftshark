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
    firstName: {
      identifier: 'firstname',
      rules: [
        {
          type  : 'empty',
          prompt: 'Please enter a name'
        }
      ]
    },
    lastName: {
      identifier: 'lastname',
      rules: [
        {
          type  : 'empty',
          prompt: 'Please enter a name'
        }
      ]
    }
  };

  var settings = {
    inline: false,
    on    : 'blur'
  };

  addForm.form(rules, settings);

  var addEmployee = function() {
    var isValid = addForm.form('validate form');
    $.fancybox.update();
    console.log(isValid);
    if (isValid) {
      var firstNameField = $('.add.employee.form [name="firstname"]');
      var lastNameField  = $('.add.employee.form [name="lastname"]');
      var emailField     = $('.add.employee.form [name="email"]');

      var firstName = firstNameField.val();
      var lastName  = lastNameField.val();
      var email     = emailField.val();
      var data      = {
                        first_name : firstName,
                        last_name  : lastName,
                        email      : email
                      };

      var success = function (result, status, xhr) {
        $('.ui.error.message').html('');
        addForm.removeClass('loading');
        $('.fancybox-close').trigger('click');
        firstNameField.val("");
        lastNameField.val("");
        firstNameField.val("");

        var employeeNamesHtml = "";
        var employees = getAllEmployees();
        var employee;
        for (var i=0; employee=employees[i]; i++) {
          var employeeName = employee.firstName + ' ' + employee.lastName;
          employeeNamesHtml += "<div class='item' employeeId='" + employee._id + "'>" + employeeName + "</div>"
        }

        $('.employeeList').html(employeeNamesHtml);
      };

      var failure = function(xhr, status, err) {
        addForm.removeClass('loading');
        addForm.removeClass('success');
        $('.add.employee.form .ui.error.message').html('<ul class="list"><li>Validation error. Please log in again.</li></ul>');
        addForm.addClass('error');
        console.log(xhr,status,err);
      };

      addForm.addClass('loading');
      client_signup_employee(data, success, failure);
    }
  };

  $('.ui.form').on('keyup', function(e) {
    if(e.keyCode == 13) {
      addEmployee();
      return false;
    } else {
      return false;
    }
  });

  $('.add.employee.form .submit.button').on('click', function() {
    addEmployee();
  });
});