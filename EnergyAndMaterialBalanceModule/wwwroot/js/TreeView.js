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
            },
            unselect: function (e, node, id) {
                TableView.clear();
                ValidDisbalance.clear()
                Utils.buttonDisabled('#btnDeleteBGroupModal', true);
                Utils.buttonDisabled('#btnUpdateBGroupModal', true);
            }
        });

        this.tree.render(bgroups);
    },
    getPoints: async function (bgroupId) {
        const response = await fetch("main/getPoints/" + bgroupId, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        if (response.ok === true) {
            const result = await response.json();
            TableView.clear();
            TableView.fill(result.points);
            ValidDisbalance.fill(result.selectedBGroup);
            Utils.buttonDisabled('#btnDeleteBGroupModal', false);
            Utils.buttonDisabled('#btnUpdateBGroupModal', false);
        }
        else {
            var selections = TreeView.tree.getSelections();
            var node = TreeView.tree.getNodeById(selections[0]);
            var bgroup = node.find('span')[2].innerText;
            Message.show(true, "Не удалось получить список точек учета и допустимый дисбаланс для группы '" + bgroup + "'!");
            TreeView.tree.unselectAll();
        }
    },
    addNode: function (createdBGroup) {
        var parent = TreeView.tree.getNodeById(createdBGroup.bgroupIdparent);
        this.tree.off('dataBound');
        this.tree.addNode(createdBGroup, parent);
        var node = TreeView.tree.getNodeById(createdBGroup.bgroupId);
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