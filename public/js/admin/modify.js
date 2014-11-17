$(document).ready(function() {
    var checkboxes = $('.form.modify.action .checkbox');
    var previousAction = 'edit';
    checkboxes.checkbox('setting', 'onChange', function(evt) {
        var action = $(this).val();
        
        var newForm = $('.modify.form.' + action);
        var oldForm = $('.modify.form.' + previousAction);

        newForm.removeClass('hidden');
        oldForm.addClass('hidden');

        $.fancybox.update();

        previousAction = action;
    });
});