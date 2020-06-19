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
                if (!DataResponse.afterBGroupCreation) {
                    TreeView.getPoints(id);
                }
                Utils.buttonDisabled('#btnDeleteBGroupModal', false);
                Utils.buttonDisabled('#btnUpdateBGroupModal', false);
                Utils.buttonDisabled('#btnCreatePointModal', false);
                DataResponse.afterBGroupCreation = false;
            },
            unselect: function (e, node, id) {
                DataResponse.selectedBGroup = null;
                TableView.clear();
                ValidDisbalance.clear()
                Utils.buttonDisabled('#btnDeleteBGroupModal', true);
                Utils.buttonDisabled('#btnUpdateBGroupModal', true);
                Utils.buttonDisabled('#btnCreatePointModal', true);
                Utils.buttonDisabled('#btnUpdatePointModal', true);
                Utils.buttonDisabled('#btnDeletePointModal', true);
            },
            collapse: function (e, node, id) {
                TreeView.tree.unselectAll();
                TreeView.tree.select(node);
            },
            expand: function (e, node, id) {
                TreeView.tree.unselectAll();
                TreeView.tree.select(node);
            }
        });

        this.tree.render(bgroups);
    },
    getPoints: async function (bgroupId) {
        $.ajax({
            method: "GET",
            url: "main/getPoints/" + bgroupId,
            headers: { "Accept": "application/json" }

        }).done(function (result) {
            DataResponse.selectedBGroup = result.selectedBGroup;
            DataResponse.sources = result.sources;
            DataResponse.periods = result.periods;
            DataResponse.tags.seicVMappingHistorian = result.seicVMappingHistorian;
            DataResponse.tags.seicVMappingIteh = result.seicVMappingIteh;
            DataResponse.tags.seicVMappingManual = result.seicVMappingManual;

            TableView.clear();
            TableView.fill(result.points);
            ValidDisbalance.fill(result.selectedBGroup);
            Utils.buttonDisabled('#btnDeleteBGroupModal', false);
            Utils.buttonDisabled('#btnUpdateBGroupModal', false);
            Utils.buttonDisabled('#btnCreatePointModal', false);
            Utils.buttonDisabled('#btnUpdatePointModal', true);
        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                var selections = TreeView.tree.getSelections();
                var node = TreeView.tree.getNodeById(selections[0]);
                var bgroup = node.find('span')[2].innerText;
                Message.show(true, "Не удалось получить список точек учета и допустимый дисбаланс для группы '" + bgroup + "'!");
                TreeView.tree.unselectAll();
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
        this.tree.unselectAll();
        this.tree.select(node);
    },
    removeNode: function (deletedBGroup) {
        var node = TreeView.tree.getNodeById(deletedBGroup.bgroupId);
        this.tree.unselect(node);
        this.tree.removeNode(node);
    }

}