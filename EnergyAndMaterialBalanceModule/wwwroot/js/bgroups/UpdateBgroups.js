var UpdateBgroups = {
    ui: $('#updateBGroupModal'),
    updateButton: $('#btnUpdateBGroupModal'),
    form: $('#updateBGroupForm'),
    modalMessage: $('#updateBGroupMessage'),
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
                Utils.submitDisabled(this, true);

                e.preventDefault();
                UpdateBgroups.updateBgroup();
            }
        });

        this.setValidator();
    },
    show: function () {
        Utils.clearModalMessage(this.modalMessage);
        this.validator.resetForm();
        Utils.submitDisabled(this.form, false);

        this.modal.bgroupId.val(DataResponse.selectedBGroup.bgroupId);
        this.modal.name.val(DataResponse.selectedBGroup.bgroupName);
        this.modal.validDisbalance.val(DataResponse.selectedBGroup.validDisbalance);
    },
    updateBgroup: async function () {
        bgroupNameVal = this.modal.name.val();
        validDisbalanceVal = this.modal.validDisbalance.val();
        bgroupIdVal = this.modal.bgroupId.val();
        $.ajax({
            method: 'POST',
            url: '/main/UpdateBGroup',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: JSON.stringify({
                bgroupId: bgroupIdVal,
                bgroupName: bgroupNameVal,
                validDisbalance: validDisbalanceVal
            })
        }).done(function (result) {
            Utils.clearModalMessage(UpdateBgroups.modalMessage);
            UpdateBgroups.ui.modal('hide');

            TreeView.updateNode(result.selectedBGroup);

            Message.show(false, Message.successes.updateBGroupSuccess.format(result.selectedBGroup.bgroupName));
        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                Utils.fillModalMessage(UpdateBgroups.modalMessage, Message.errors.updateBGroupError);
                Utils.submitDisabled(UpdateBgroups.form, false);
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
            messages: Message.validation.updateBGroup,
        });
    }
};