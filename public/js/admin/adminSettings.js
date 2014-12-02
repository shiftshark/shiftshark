$(document).ready(function() {
  var selector         = '.ui.adminSettings.form';
  var $form            = $(selector);
  var isAdmin          = false;
  var employeeDropdown = $(selector + ' [name="select-employee"]').parent();
  var components       = ['employees'];
  var rules;
  var date = $('#schedule .active').attr('date');
  
  var settings = {
    inline  : false
  };

  // generate a set of rules and apply them tot he form
  var updateRules = function () {
    rules = rulesGenerator(components, selector, isAdmin);
    $form.form(rules, settings);
  }

  // instantiate the rules
  updateRules();

  // reisize the fancybox on failure or success
  $form.form('setting', 'onFailure', function(){
    $.fancybox.update();
  });

  $form.form('setting', 'onSuccess', function(){
    $.fancybox.update();
  });

  // if the toggle is set to true set isAdmin to true, update the rules, and show the isAdmin content
  $(selector + ' .checkbox.toggle').checkbox('setting', 'onEnable', function(evt) {
    isAdmin = true;
    $.fancybox.update();
  });

  // if the toggle is set to true set isAdmin to false, update the rules, and hide the isAdmin content
  $(selector + ' .checkbox.toggle').checkbox('setting', 'onDisable', function(evt) {
    isAdmin = false;
    $.fancybox.update();
  });

  $(selector + ' .dropdown').dropdown({
    onChange: function (val) {
      var $employee = $(selector + ' .employeeList .active');
      var employeeId = $employee.attr('employeeid');
      isAdmin = client_employee_get_one(employeeId).data.employee.employer;

      if (isAdmin) {
        $(selector + ' .checkbox.toggle').checkbox('enable');
      } else {
        $(selector + ' .checkbox.toggle').checkbox('disable');
      }
    }
  });

  // submit on submit button pressed
  $(selector + ' .submit.button').on('click', function() {
    $form.form('validate form');
    var validForm = !$form.hasClass('error');
    $.fancybox.update();

    // if valid, submit
    if (validForm) {
      var $employee  = $(selector + ' .employeeList .active');
      var employee = $employee.attr('employeeId');
      var self = $('#curUser').attr('userid');

      // if success, update the schedule
      var success = function(result, status, xhr) {
        // clear the error message
        $('.ui.error.message').html('');
        // remove the loading animation
        $form.removeClass('loading');
        // close the fancybox
        $('.fancybox-close').trigger('click');
        // restore dropdown defaults
        $(selector + ' .dropdown').dropdown('restore defaults');
      };

      // do show error on failure
      var failure = function(xhr, status, err) {
        // show an error message
        $('.ui.error.message').html('<ul class="list"><li>' + err + '</li></ul>');
        $form.addClass('error');
        // resize fancybox
        $.fancybox.update();
        // removing loading animation
        $form.removeClass('loading');
      };

      // add a loading animation
      $form.addClass('loading');

      console.log(employee, self);
      if (employee == self) {
        // show an error message
        $('.ui.error.message').html('<ul class="list"><li>You cannot remove your own administrator privileges.</li></ul>');
        $form.addClass('error');
        $employee.addClass('error');
        $form.removeClass('loading');
      } else {
        $employee.removeClass('error');
        // submit to server
        client_employee_change_admin(employee, isAdmin, success, failure);
      }
    }
  });
});