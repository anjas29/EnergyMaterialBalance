var TableView = {
    ui: $('#tableView'),
    body: $('#tableViewBody'),
    init: function () {
        this.body.delegate('tr', 'click', function () {
            var selected = $(this).hasClass('highlight');
            TableView.unselectPoint();
            if (!selected) {
                TableView.getPoint(parseInt($(this).data('rowid')));
            }
        });
    },
    getPoint: async function (pointId) {
        $.ajax({
            method: 'GET',
            url: 'main/getPoint/' + pointId,
            headers: { 'Accept': 'application/json' }
        }).done(function (result) {
            DataResponse.selectedPoint = result.selectedPoint;
            DataResponse.formula = result.formula;
            DataResponse.parameters = result.parameters;

            TableView.selectPoint(result.selectedPoint.pointId);

        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                Message.show(true, Message.errors.getPointError);
            }
        });
    },
    clear: function () {
        DataResponse.points = null;
        Table.clear(this.ui, null);
    },
    fill: function (points) {
        DataResponse.points = points;
        Table.fillBody(this.ui, points, CommonResources.tables.points);
    },
    unselectPoint: function () {
        Table.unselectRow(this.ui);
        DataResponse.selectedPoint = null;

        Utils.buttonDisabled(UpdatePoints.updateButton, true);
        Utils.buttonDisabled(DeletePoints.deleteButton, true);
    },
    removePoint: function (points) {
        TableView.clear();
        TableView.fill(points);
    },
    updatePoint: function (points, selectedPoint) {
        TableView.clear();
        TableView.fill(points);
        TableView.selectPoint(selectedPoint.pointId);
    },
    addPoint: function (points, selectedPoint) {
        TableView.clear();
        TableView.fill(points);
        TableView.selectPoint(selectedPoint.pointId);

        this.body.scrollTop(this.body.prop('scrollHeight'));
    },
    selectPoint: function (rowDataId) {
        Table.selectRow(this.ui, rowDataId);

        Utils.buttonDisabled(UpdatePoints.updateButton, false);
        Utils.buttonDisabled(DeletePoints.deleteButton, false);
    }
};