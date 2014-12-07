$(document).ready(function() {
  var previousModifyPosAction = 'edit';
  var checkboxes = $('.form.modifyPos.action .checkbox');

  // change the form that we can see on radio button change
  checkboxes.checkbox('setting', 'onChange', function(evt) {
    var action = $(this).val();
    
    var newForm = $('.modifyPos.form.' + action);
    var oldForm = $('.modifyPos.form.' + previousModifyPosAction);

    newForm.removeClass('hidden');
    oldForm.addClass('hidden');

    $.fancybox.update();

    previousModifyPosAction = action;
  });
});