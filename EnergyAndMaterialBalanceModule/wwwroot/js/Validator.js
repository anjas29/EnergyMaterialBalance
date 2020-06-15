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
        if (element.attr("name") == "createBGroupIdParent") {
            error.insertAfter("#level");
        } else {
            error.insertAfter(element);
        }
    }
});