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
            e.preventDefault();
            DeleteBgroups.deleteBgroups();
        });

    },
    show: function () {
        var selectedBGroup = DataResponse.selectedBGroup;
        this.modal.name.text(selectedBGroup.bgroupName);
        this.modal.children.hide();

        var hasChildren = selectedBGroup.inverseBgroupIdparentNavigation.length;
        if (hasChildren > 0)
            this.modal.children.show();

        this.modal.bgroupId.val(selectedBGroup.bgroupId);
    },
    deleteBgroups: async function () {
        bgroupId = DeleteBgroups.modal.bgroupId.val();
        const response = await fetch("/main/deleteBGroup/" + bgroupId, {
            method: "DELETE",
            headers: { "Accept": "application/json" }
        });

        if (response.ok === true) {
            const result = await response.json();
            Message.show(false, "Балансовая группа '" + result.selectedBGroup.bgroupName + "' была успешно удалена!")
            TreeView.removeNode(result.selectedBGroup);
            Utils.buttonDisabled('#btnCreateBGroupModal', false);
            Utils.buttonDisabled('#btnDeleteBGroupModal', true);
            Utils.buttonDisabled('#btnUpdateBGroupModal', true);
        }
        else {
            Message.show(true, "Не удалось удалить балансовую группу '" + DataResponse.selectedBGroup.bgroupName + "'!");
        }
        DeleteBgroups.ui.modal('hide');
    }
}