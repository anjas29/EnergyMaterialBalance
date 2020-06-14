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
                e.preventDefault();
                UpdateBgroups.updateBgroup();
            }
        });

        this.setValidator();
    },
    show: function () {
        Utils.clearModalMessage('#updateMessage');
        this.validator.resetForm();

        $('#updateBGroupId').val(DataResponse.selectedBGroup.bgroupId);
        $('#updateBGroupName').val(DataResponse.selectedBGroup.bgroupName);
        $('#updateValidDisbalance').val(DataResponse.selectedBGroup.validDisbalance);
    },
    updateBgroup: async function () {
        bgroupNameVal = this.modal.name.val();
        validDisbalanceVal = this.modal.validDisbalance.val();
        bgroupIdVal = this.modal.bgroupId.val();

        const response = await fetch("/main/UpdateBGroup", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                bgroupId: bgroupIdVal,
                bgroupName: bgroupNameVal,
                validDisbalance: validDisbalanceVal
            })
        });

        if (response.ok === true) {
            Utils.clearModalMessage('#updateMessage');
            const result = await response.json();
            this.ui.modal('hide');
            TreeView.updateNode(result.selectedBGroup);
            Message.show(false, "Балансовая группа '" + result.selectedBGroup.bgroupName + "' была успешно обновлена!");
        }
        else {
            Utils.fillModalMessage('#updateMessage', "Не удалось изменить балансовую группу!");
        }
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