var TreeView = {
    tree: null,
    clear: function () {
        DataResponse.bgroups = null;
        TreeView.fill([]);
    },
    fill: function (bgroups) {
        DataResponse.bgroups = bgroups;
        this.tree = $('#tree').tree({
            uiLibrary: 'bootstrap4',
            primaryKey: 'bgroupId',
            textField: 'bgroupName',
            childrenField: "inverseBgroupIdparentNavigation",
            select: function (e, node, id) {
                TreeView.getPoints(id);

                Utils.buttonDisabled(CreateBgroups.addButton, false);
                Utils.buttonDisabled(UpdateBgroups.updateButton, false);

                Utils.buttonDisabled(CreatePoints.addButton, false);

            },
            unselect: function (e, node, id) {
                DataResponse.selectedBGroup = null;
                DataResponse.selectedPoint = null;

                TableView.clear();
                ValidDisbalance.clear()

                Utils.buttonDisabled(UpdateBgroups.updateButton, true);
                Utils.buttonDisabled(DeleteBgroups.deleteButton, true);

                Utils.buttonDisabled(CreatePoints.addButton, true);
                Utils.buttonDisabled(UpdatePoints.updateButton, true);
                Utils.buttonDisabled(DeletePoints.deleteButton, true);
            },
            collapse: function (e, node, id) {
                TreeView.tree.unselectAll();
                TreeView.tree.select(node);
            },
            expand: function (e, node, id) {
                TreeView.tree.unselectAll();

                if (!CommonResources.afterBGroupCreation)
                    TreeView.tree.select(node);

                DataResponse.afterBGroupCreation = false;
            }
        });

        this.tree.render(bgroups);
    },
    getPoints: async function (bgroupId) {
        $.ajax({
            method: 'GET',
            url: 'main/getPoints/' + bgroupId,
            headers: { 'Accept': 'application/json' }

        }).done(function (result) {
            DataResponse.selectedBGroup = result.selectedBGroup;
            DataResponse.selectedPoint = null;

            DataResponse.sources = result.sources;
            DataResponse.periods = result.periods;

            DataResponse.tags.seicVMappingHistorian = result.seicVMappingHistorian;
            DataResponse.tags.seicVMappingIteh = result.seicVMappingIteh;
            DataResponse.tags.seicVMappingManual = result.seicVMappingManual;

            TableView.clear();
            TableView.fill(result.points);
            ValidDisbalance.fill(result.selectedBGroup);


            Utils.buttonDisabled(UpdateBgroups.updateButton, false);
            Utils.buttonDisabled(DeleteBgroups.deleteButton, false);

            Utils.buttonDisabled(CreatePoints.addButton, false);
            Utils.buttonDisabled(UpdatePoints.updateButton, true);
            Utils.buttonDisabled(DeletePoints.deleteButton, true);

        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                TreeView.tree.unselectAll();

                var selections = TreeView.tree.getSelections();
                var node = TreeView.tree.getNodeById(selections[0]);
                var bgroup = node.find('span')[2].innerText;

                Message.show(true, Message.errors.getPointsError.format(bgroup));
            }
        });
    },
    addNode: function (createdBGroup) {
        DataResponse.afterBGroupCreation = true;

        var parent = TreeView.tree.getNodeById(createdBGroup.bgroupIdparent);
        this.tree.off('dataBound');
        this.tree.addNode(createdBGroup, parent);
        var node = TreeView.tree.getNodeById(createdBGroup.bgroupId);

        if (parent) {
            this.tree.expand(parent);
        }

        this.tree.unselectAll();
        this.tree.select(node);

    },
    updateNode: function (updateBGroup) {
        this.tree.updateNode(updateBGroup.bgroupId, updateBGroup);

        var node = TreeView.tree.getNodeById(updateBGroup.bgroupId);
        //check
        //this.tree.unselectAll();
        //this.tree.select(node);
    },
    removeNode: function (deletedBGroup) {
        var node = TreeView.tree.getNodeById(deletedBGroup.bgroupId);

        this.tree.unselect(node);
        this.tree.removeNode(node);
    }

}