var ValidDisbalance = {
    ui: $('#validDisbalance'),
    clear: function () {
        this.ui.text("");
    },
    fill: function (selectedBGroup) {
        this.ui.text(selectedBGroup.validDisbalance);
    }
};