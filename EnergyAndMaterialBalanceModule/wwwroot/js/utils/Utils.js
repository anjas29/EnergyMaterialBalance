var Utils = {
    directions: [
        {
            value: '+',
            name: '+',
        },
        {
            value: '-',
            name: '-',
        },
        {
            value: '~',
            name: '~',
        }
    ],
    buttonDisabled: function (button, state) {
        $(button).prop('disabled', state);
    },
    selectElement: function (element, valueToSelect) {
        $(element).val(valueToSelect);
    },
    fillModalMessage: function (element, message) {
        $(element).show();
        $(element).text(message);
    },
    clearModalMessage: function (element) {
        $(element).text("");
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
            Utils.selectElement(element, '');
        }
        else {
            Utils.selectElement(element, selectedElement);
        }
    }

};