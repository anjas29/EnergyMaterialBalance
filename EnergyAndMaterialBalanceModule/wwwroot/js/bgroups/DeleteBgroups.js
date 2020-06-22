var DeleteBgroups = {
    ui: $('#deleteBGroupModal'),
    deleteButton: $('#btnDeleteBGroupModal'),
    modalMessage: $('#deleteBGroupMessage'),
    form: $('#deleteBGroupForm'),
    modal: {
        name: $('#deleteBGroupName'),
        children: $('#deleteBGroupChildren'),
        bgroupId: $('#deleteBGroupId'),
    },

    init: function () {
        this.deleteButton.on('click', function () {
            DeleteBgroups.show();
        });
        this.form.on('submit', function (e) {
            Utils.submitDisabled(this, true);

            e.preventDefault();
            DeleteBgroups.deleteBgroups();
        });

    },
    show: function () {
        var selectedBGroup = DataResponse.selectedBGroup;
        Utils.submitDisabled(this.form, false);
        Utils.clearModalMessage(this.modalMessage);
        this.modal.children.hide();

        this.modal.name.text(selectedBGroup.bgroupName);
        this.modal.bgroupId.val(selectedBGroup.bgroupId);

        var hasChildren = selectedBGroup.inverseBgroupIdparentNavigation.length;
        if (hasChildren > 0)
            this.modal.children.show();

    },
    deleteBgroups: async function () {
        bgroupIdVal = DeleteBgroups.modal.bgroupId.val();

        $.ajax({
            method: 'DELETE',
            url: '/main/deleteBGroup/' + bgroupIdVal,
            headers: { 'Accept': 'application/json' }

        }).done(function (result) {
            Utils.clearModalMessage(DeleteBgroups.modalMessage);
            Message.show(false, Message.successes.deleteBGroupSuccess.format(result.selectedBGroup.bgroupName));
            DeleteBgroups.ui.modal('hide');

            TreeView.removeNode(result.selectedBGroup);


        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                Utils.fillModalMessage(DeleteBgroups.modalMessage, Message.errors.deleteBGroupError.format(DataResponse.selectedBGroup.bgroupName));
                Utils.submitDisabled(DeleteBgroups.form, false);
            }
        });
    }
}