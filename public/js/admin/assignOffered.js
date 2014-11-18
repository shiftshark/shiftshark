$(document).ready(function() {
  var assignOfferForm = $('.ui.assignOffered.form');

  var employeeDropdown = $('.ui.assignOffered.form [name="select-employee"]').parent();

  // form validation rules
  var rules = {
    selectEmployee : {
      identifier  : 'select-employee',
      rules: [
        {
          type  : 'empty',
          prompt: 'Please select an employee'
        }
      ]
    }
  };

  var settings = {
    inline  : false
  };

  assignOfferForm.form(rules, settings);

  assignOfferForm.form('setting', 'onFailure', function(){
    $.fancybox.update();
  });

  assignOfferForm.form('setting', 'onSuccess', function(){
    $.fancybox.update();
  });

  $('.ui.assignOffered.form .submit.button').on('click', function() {
    assignOfferForm.form('validate form');
    var isValid = !assignOfferForm.hasClass('error');
    $.fancybox.update();

    if (isValid) {
      //TODO: get the real shift Id
      var shiftId = '546ad8a43f01a023115d36ca';
      var employee = $('.createShift.form .employeeList .active').attr('employeeId');

      var shift = {
        claimant : employee,
        trading  : false
      }

      var success = function(result, status, xhr) {
        $('.ui.error.message').html('');
        assignOfferForm.removeClass('loading');
        $('.fancybox-close').trigger('click');
        var shift = result.shift;
        $('.ui.assignOffered.form .dropdown').dropdown('restore defaults');
        //TODO: Interact with Michael's calendar
      };

      var failure = function(xhr, status, err) {
        $('.ui.error.message').html('<ul class="list"><li>Validation error. Please log in again.</li></ul>');
        $.fancybox.update();
        assignOfferForm.removeClass('loading');
      };
      assignOfferForm.addClass('loading');
      client_shifts_change(shiftId,{},shift,success,failure);
    }
  });
});