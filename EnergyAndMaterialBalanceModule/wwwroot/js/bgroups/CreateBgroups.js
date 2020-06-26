var CreateBgroups = {
    ui: $('#createBGroupModal'),
    addButton: $('#btnCreateBGroupModal'),
    form: $('#createBGroupForm'),
    modalMessage: $('#createBGroupMessage'),
    validator: null,
    modal: {
        name: $('#createBGroupName'),
        validDisbalanace: $('#createValidDisbalance'),
        resourceId: $('#createResourceId'),
        asChild: $('#asChild'),
        sameLevel: $('#sameLevel'),
    },
    init: function () {
        this.addButton.click(function () {
            CreateBgroups.show();
        });

        this.form.on('submit', function (e) {
            if (CreateBgroups.form.valid()) {
                Utils.submitDisabled(this, true);
                e.preventDefault();
                CreateBgroups.createBgroups();
            }
        });

        this.setValidator();
    },
    show: function () {
        Utils.clearModalMessage(this.modalMessage);
        Utils.submitDisabled(this.form, false);
        this.validator.resetForm();


        this.modal.name.val('');
        this.modal.validDisbalanace.val('');
        this.modal.resourceId.val(DataResponse.selectedResource.resourceId);


        if (DataResponse.selectedBGroup != null) {
            this.modal.asChild.val(DataResponse.selectedBGroup.bgroupId);
            this.modal.sameLevel.val(DataResponse.selectedBGroup.bgroupIdparent);

            this.modal.asChild.prop('disabled', false);
            this.modal.asChild.prop('checked', false);
            this.modal.sameLevel.prop('checked', false);
            this.modal.sameLevel.prop('disabled', false);
        }
        else {
            this.modal.sameLevel.val(null);
            this.modal.asChild.val(null);

            this.modal.asChild.prop('disabled', true);
            this.modal.asChild.prop('checked', false);
            this.modal.sameLevel.prop('checked', true);
            this.modal.sameLevel.prop('disabled', true);
        }
    },
    createBgroups: async function () {
        bGroupNameVal = this.modal.name.val();
        validDisbalanceVal = this.modal.validDisbalanace.val();
        resourceIdVal = this.modal.resourceId.val();
        bGroupIdParentVal = $('input:radio[name="createBGroupIdParent"]:checked').val();

        $.ajax({
            method: 'POST',
            url: '/main/CreateBGroup',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: JSON.stringify({
                bgroupName: bGroupNameVal,
                validDisbalance: validDisbalanceVal,
                resourceId: parseInt(resourceIdVal),
                bgroupIdparent: bGroupIdParentVal
            })
        }).done(function (result) {
            Utils.clearModalMessage(CreateBgroups.modalMessage);
            CreateBgroups.ui.modal('hide');

            TreeView.addNode(result.selectedBGroup);
            DataResponse.selectedBGroup = result.selectedBGroup;

            Message.show(false, Message.successes.createBGroupSuccess.format(result.selectedBGroup.bgroupName));

        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                Utils.fillModalMessage(CreateBgroups.modalMessage, Message.errors.createBGroupError);
                Utils.submitDisabled(CreateBgroups.form, false);
            }
        });
    },
    setValidator: function () {
        this.validator = this.form.validate({
            rules: {
                createBGroupName: {
                    required: true,
                    maxlength: 255
                },
                createValidDisbalance: {
                    required: true,
                    number: true
                },
                createBGroupIdParent: {
                    required: true,
                }
            },
            messages: Message.validation.createBGroup,
        });
    }
};