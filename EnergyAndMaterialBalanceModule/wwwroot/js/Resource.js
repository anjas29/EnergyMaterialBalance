var Resource = {
    ui: $('#resources'),
    init: function () {
        this.ui.change(function () {
            if ($(this).val() === '') {
                TreeView.clear();
                Utils.buttonDisabled('#btnCreateBGroupModal', true);
                Utils.buttonDisabled('#btnDeleteBGroupModal', true);
                Utils.buttonDisabled('#btnUpdateBGroupModal', true);
            }
            else {
                Resource.getBGroups($(this).val());
            }
            TableView.clear();
            ValidDisbalance.clear();
        });
    },
    getBGroups: async function (resourceId) {
        const response = await fetch("main/getBGroups/" + resourceId, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        if (response.ok === true) {
            const result = await response.json();
            console.log(result);

            this.fill(result.selectedResource);
            TreeView.fill(result.bgroups);
            Utils.buttonDisabled('#btnCreateBGroupModal', false);
            Utils.buttonDisabled('#btnDeleteBGroupModal', true);
            Utils.buttonDisabled('#btnUpdateBGroupModal', true);
        }
        else {
            var resource = $('#resources option:selected').text();
            Message.show(true, "Не удалось получить список балансовых групп для ресурса '" + resource + "'!");
            Utils.selectElement('resources', '');
        }
    },
    fill: function (selectedResource) {
        Utils.selectElement('resources', selectedResource.resourceId);
        DataResponse.selectedResource = selectedResource;
    }
};