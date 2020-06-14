var TableView = {
    ui: $('#tableView'),
    body: $('#tableView tbody > tr'),
    init: function () {
        $('#tableView').delegate('tr', 'click', function () {
            var selected = $(this).hasClass('highlight');

            $('#tableView tr').removeClass('highlight');
            if (!selected)
                $(this).addClass('highlight');
        });
    },
    clear: function () {
        DataResponse.points = null;
        $('#tableViewBody').html('');
    },
    fill: function (points) {
        DataResponse.points = points;
        console.log(points);
        var tableView = document.getElementById('tableView');
        //var rows = tableView.getElementsByTagName('tbody')[0];
        var rows = $('#tableViewBody');
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
                col: 'col-3',
                data: point.pointName
            },

            {
                col: 'col-2',
                data: point.direction
            },

            {
                col: 'col-1',
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
    }
};