var Utils = {
    buttonDisabled: function(button, state) {
        $(button).prop('disabled', state);
    },
    selectElement: function (id, value) {
        var element = document.getElementById(id);
        element.value = value;
    },
    fillModalMessage: function (element, message) {
        $(element).show();
        $(element).text(message);
    },
    clearModalMessage: function (element) {
        $(element).text("");
        $(element).hide();
    }
};