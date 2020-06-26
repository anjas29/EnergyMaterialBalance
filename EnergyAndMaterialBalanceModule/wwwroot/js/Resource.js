var Resource = {
    ui: $('#resources'),
    init: function () {
        this.ui.change(function () {
            if ($(this).val() === '') {
                TreeView.clear();
                Utils.buttonDisabled(CreateBgroups.addButton, true);
                Utils.buttonDisabled(UpdateBgroups.updateButton, true);
                Utils.buttonDisabled(DeleteBgroups.deleteButton, true);

                Utils.buttonDisabled(CreatePoints.addButton, true);
                Utils.buttonDisabled(UpdatePoints.updateButton, true);
                Utils.buttonDisabled(DeletePoints.deleteButton, true);
            }
            else {
                Resource.getBGroups($(this).val());
            }
            DataResponse.selectedBGroup = null;
            DataResponse.selectedPoint = null;

            TableView.clear();
            ValidDisbalance.clear();
        });
    },
    getBGroups: async function (resourceId) {
        $.ajax({
            method: 'GET',
            url: 'main/getBGroups/' + resourceId,
            headers: { 'Accept': 'application/json' },

        }).done(function (result) {
            DataResponse.selectedResource = result.selectedResource;
            Utils.fillSelect( Resource.ui, result.selectedResource.resourceId);
            TreeView.fill(result.bgroups);

            Utils.buttonDisabled(CreateBgroups.addButton, false);
            Utils.buttonDisabled(UpdateBgroups.updateButton, true);
            Utils.buttonDisabled(DeleteBgroups.deleteButton, true);

            Utils.buttonDisabled(CreatePoints.addButton, true);
            Utils.buttonDisabled(UpdatePoints.updateButton, true);
            Utils.buttonDisabled(DeletePoints.deleteButton, true);

        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                var resource = Resource.ui.find('option:selected').text();
                Message.show(true, Message.errors.getBGroupsError.format(resource));
                Utils.fillSelect(Resource.ui, null);
            }
        });
    },
};