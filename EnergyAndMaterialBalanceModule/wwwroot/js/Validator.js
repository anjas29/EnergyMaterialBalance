
$.validator.setDefaults({
    errorElement: 'span',
    errorClass: 'invalid-feedback',
    highlight: function (element, errorClass) {
        $(element).addClass(this.settings.errorElementClass).removeClass(errorClass);
    },
    unhighlight: function (element, errorClass) {
        $(element).removeClass(this.settings.errorElementClass).removeClass(errorClass);
    },
    errorPlacement: function (error, element) {
        var name = element.attr('name');
        if (name === 'createBGroupIdParent') {
            error.insertAfter('#createBGroupLevelError');
        }
        else if (name === 'createPointTag') {
            error.insertAfter('#сreatePointTagError');
        }
        else if (name === 'updatePointTag') {
            error.insertAfter('#updatePointTagError');
        }
        else {
            error.insertAfter(element);
        }
    }

});