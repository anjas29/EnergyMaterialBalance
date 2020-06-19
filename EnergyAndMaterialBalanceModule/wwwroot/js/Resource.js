var Resource = {
    ui: $('#resources'),
    init: function () {
        this.ui.change(function () {
            if ($(this).val() === '') {
                TreeView.clear();
                Utils.buttonDisabled('#btnCreateBGroupModal', true);
                Utils.buttonDisabled('#btnDeleteBGroupModal', true);
                Utils.buttonDisabled('#btnUpdateBGroupModal', true);
                Utils.buttonDisabled('#btnCreatePointModal', true);
                Utils.buttonDisabled('#btnUpdatePointModal', true);
                Utils.buttonDisabled('#btnDeletePointModal', true);

            }
            else {
                Resource.getBGroups($(this).val());
            }
            DataResponse.selectedBGroup = null;
            TableView.clear();
            ValidDisbalance.clear();
        });
    },
    getBGroups: async function (resourceId) {
        $.ajax({
            method: "GET",
            url: "main/getBGroups/" + resourceId,
            headers: { "Accept": "application/json" },

        }).done(function (result) {
            Resource.fill(result.selectedResource);
            TreeView.fill(result.bgroups);
            Utils.buttonDisabled('#btnCreateBGroupModal', false);
            Utils.buttonDisabled('#btnDeleteBGroupModal', true);
            Utils.buttonDisabled('#btnUpdateBGroupModal', true);
            Utils.buttonDisabled('#btnCreatePointModal', true);
            Utils.buttonDisabled('#btnUpdatePointModal', true);
            Utils.buttonDisabled('#btnDeletePointModal', true);
        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                var resource = $('#resources option:selected').text();
                Message.show(true, "Не удалось получить список балансовых групп для ресурса '" + resource + "'!");
                Utils.selectElement('#resources', '');
            }
        });
    },
    fill: function (selectedResource) {
        Utils.selectElement('#resources', selectedResource.resourceId);
        DataResponse.selectedResource = selectedResource;
    }
};