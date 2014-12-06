$(document).ready(function() {
    var checkboxes = $('.form.modify.action .checkbox');

    // change the form that we can see on radio button change
    checkboxes.checkbox('setting', 'onChange', function(evt) {
        var action = $(this).val();
        
        var newForm = $('.modify.form.' + action);
        var oldForm = $('.modify.form.' + previousModifyAction);

        newForm.removeClass('hidden');
        oldForm.addClass('hidden');

        $.fancybox.update();

        previousModifyAction = action;
    });
});