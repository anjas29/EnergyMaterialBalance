var DeleteBgroups = {
    ui: $('#deleteBGroupModal'),
    deleteButton: $('#btnDeleteBGroupModal'),
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
            DeleteBgroups.form.find(':input[type=submit]').prop('disabled', true);
            e.preventDefault();
            DeleteBgroups.deleteBgroups();
        });

    },
    show: function () {
        var selectedBGroup = DataResponse.selectedBGroup;
        this.modal.name.text(selectedBGroup.bgroupName);
        this.modal.children.hide();
        this.form.find(':input[type=submit]').prop('disabled', false);
        Utils.clearModalMessage('#deleteBGroupMessage');

        var hasChildren = selectedBGroup.inverseBgroupIdparentNavigation.length;
        if (hasChildren > 0)
            this.modal.children.show();

        this.modal.bgroupId.val(selectedBGroup.bgroupId);
    },
    deleteBgroups: async function () {
        bgroupId = DeleteBgroups.modal.bgroupId.val();
        $.ajax({
            method: "DELETE",
            url: "/main/deleteBGroup/" + bgroupId,
            headers: { "Accept": "application/json" }

        }).done(function (result) {
            Utils.clearModalMessage('#deleteBGroupMessage');
            Message.show(false, "Балансовая группа '" + result.selectedBGroup.bgroupName + "' была успешно удалена!")
            TreeView.removeNode(result.selectedBGroup);
            Utils.buttonDisabled('#btnCreateBGroupModal', false);
            Utils.buttonDisabled('#btnDeleteBGroupModal', true);
            Utils.buttonDisabled('#btnUpdateBGroupModal', true);
            DeleteBgroups.ui.modal('hide');
        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                Utils.fillModalMessage('#deleteBGroupMessage', "Не удалось удалить балансовую группу '" + DataResponse.selectedBGroup.bgroupName + "'!");
                DeleteBgroups.form.find(':input[type=submit]').prop('disabled', false);
            }
        });
    }
}