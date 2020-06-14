var ValidDisbalance = {
    ui: $('#validDisbalance'),
    clear: function () {
        DataResponse.selectedBGroup = null;
        this.ui.text("");
    },
    fill: function (selectedBGroup) {
        DataResponse.selectedBGroup = selectedBGroup;
        this.ui.text(selectedBGroup.validDisbalance);
    }
};