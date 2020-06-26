var Utils = {
    buttonDisabled: function (button, state) {
        $(button).prop('disabled', state);
    },
    submitDisabled: function (input, state) {
        $(input).find(':input[type=submit]').prop('disabled', state);
    },
    fillModalMessage: function (element, message) {
        $(element).show();
        $(element).text(message);
    },
    clearModalMessage: function (element) {
        $(element).text('');
        $(element).hide();
    },
    populateSelect: function (element, selectedElement, data, value, name) {
        var len = element.find('option').length;
        if (len <= 1) {
            var option = '';
            data.forEach((d) => {
                option += '<option value="' + d[value] + '">' + d[name] + '</option>';
            });

            element.append(option);
        }
        Utils.fillSelect(element, selectedElement);
    },
    clearSelect: function (element) {
        $(element + ' option').each(function () {
            if ($(this).val() != '') {
                $(this).remove();
            }
        });
    },
    fillSelect: function (element, selectedElement) {
        if (selectedElement === null) {
            element.val('');
        }
        else {
            element.val(selectedElement);
        }
    }, 

};

