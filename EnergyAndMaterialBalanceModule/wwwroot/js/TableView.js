var TableView = {
    ui: $('#tableView'),
    body: $('#tableViewBody'),
    init: function () {
        this.ui.delegate('tr', 'click', function () {
            var selected = $(this).hasClass('highlight');
            TableView.unselectRow();
            if (!selected) {
                $(this).addClass('highlight');
                TableView.getPoint(parseInt($(this).data('rowid')));
            }
        });
    },
    getPoint: async function (pointId) {
        $.ajax({
            method: "GET",
            url: "main/getPoint/" + pointId, 
            headers: { "Accept": "application/json" }

        }).done(function (result) {
            DataResponse.selectedPoint = result.selectedPoint;
            DataResponse.formula = result.formula;
            DataResponse.parameters = result.parameters;
            Utils.buttonDisabled('#btnUpdatePointModal', false);
            Utils.buttonDisabled('#btnDeletePointModal', false);
        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                Message.show(true, "Не удалось получить данные для точки учета!");
            }
        });
    },
    clear: function () {
        DataResponse.points = null;
        this.body.html('');
    },
    fill: function (points) {
        DataResponse.points = points;
        var rows = this.body;
        points.forEach((point, i) => {
            rows.append(TableView.point(point, i));
        });

    },
    point: function (point, i) {
        const tr = document.createElement('tr');
        tr.setAttribute('data-rowid', point.pointId);
        tr.className = 'd-flex';
        const trData = [
            {
                col: 'col-1',
                data: i + 1
            },

            {
                col: 'col-2',
                data: point.pointName
            },

            {
                col: 'col-1',
                data: point.direction
            },

            {
                col: 'col-3',
                data: point.tagname
            },

            {
                col: 'col-2',
                data: point.period.periodName
            },

            {
                col: 'col-1',
                data: point.validMistake
            },

            {
                col: 'col-2',
                data: point.source.sourceName
            },

        ];
        trData.forEach((tdData) => {
            const td = document.createElement('td');
            td.append(tdData.data);
            td.className = tdData.col;
            tr.append(td);
        });
        return tr;
    },
    removePoint: function (points) {
        TableView.clear();
        TableView.fill(points);
    },
    updatePoint: function (points, selectedPoint) {
        TableView.clear();
        TableView.fill(points);
        TableView.selectRow(selectedPoint.pointId);
    },
    addPoint: function (points, selectedPoint) {
        TableView.clear();
        TableView.fill(points);
        TableView.selectRow(selectedPoint.pointId);
        this.body.scrollTop(this.body.prop("scrollHeight"));
    },
    unselectRow: function () {
        this.ui.find('tr').removeClass('highlight');
        DataResponse.selectedPoint = null;
        Utils.buttonDisabled('#btnUpdatePointModal', true);
        Utils.buttonDisabled('#btnDeletePointModal', true);
    },
    selectRow: function (rowDataId) {
        var row = $('tr[data-rowid="' + rowDataId + '"]');
        row.addClass('highlight');
        Utils.buttonDisabled('#btnUpdatePointModal', false);
        Utils.buttonDisabled('#btnDeletePointModal', false);


    }
};