var UpdateBgroups = {
    ui: $('#updateBGroupModal'),
    updateButton: $('#btnUpdateBGroupModal'),
    form: $('#updateBGroupForm'),
    validator: null,
    modal: {
        bgroupId: $('#updateBGroupId'),
        name: $('#updateBGroupName'),
        validDisbalance: $('#updateValidDisbalance')
    },
    init: function () {
        this.updateButton.click(function () {
            UpdateBgroups.show();
        });

        this.form.on('submit', function (e) {
            if (UpdateBgroups.form.valid()) {
                UpdateBgroups.form.find(':input[type=submit]').prop('disabled', true);
                e.preventDefault();
                UpdateBgroups.updateBgroup();
            }
        });

        this.setValidator();
    },
    show: function () {
        Utils.clearModalMessage('#updateMessage');

        this.validator.resetForm();
        this.form.find(':input[type=submit]').prop('disabled', false);

        $('#updateBGroupId').val(DataResponse.selectedBGroup.bgroupId);
        $('#updateBGroupName').val(DataResponse.selectedBGroup.bgroupName);
        $('#updateValidDisbalance').val(DataResponse.selectedBGroup.validDisbalance);
    },
    updateBgroup: async function () {
        bgroupNameVal = this.modal.name.val();
        validDisbalanceVal = this.modal.validDisbalance.val();
        bgroupIdVal = this.modal.bgroupId.val();
        $.ajax({
            method: "POST",
            url: "/main/UpdateBGroup",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            data: JSON.stringify({
                bgroupId: bgroupIdVal,
                bgroupName: bgroupNameVal,
                validDisbalance: validDisbalanceVal
            })
        }).done(function (result) {
            Utils.clearModalMessage('#updateBGroupMessage');
            UpdateBgroups.ui.modal('hide');
            TreeView.updateNode(result.selectedBGroup);
            Message.show(false, "Балансовая группа '" + result.selectedBGroup.bgroupName + "' была успешно обновлена!");
        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                Utils.fillModalMessage('#updateBGroupMessage', "Не удалось изменить балансовую группу!");
                UpdateBgroups.form.find(':input[type=submit]').prop('disabled', false);
            }
        });
    },
    setValidator: function () {
        this.validator = this.form.validate({
            rules: {
                updateBGroupName: {
                    required: true,
                    maxlength: 255
                },
                updateValidDisbalance: {
                    required: true,
                    number: true
                },
            },
            messages: {
                updateBGroupName: {
                    required: "Укажите имя балансовой группы, это поле не может быть пустым!",
                    maxlength: "Название группы должно содержать меньше 255 символов!"
                },
                updateValidDisbalance: {
                    required: "Укажите допустимый дисбаланс, это поле не может быть пустым!",
                    number: "Укажите допустимый дисбаланс в правильном формате!",
                },
            }

        });
    }
};