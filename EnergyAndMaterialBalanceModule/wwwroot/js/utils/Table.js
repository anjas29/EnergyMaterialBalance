var Table = {
    clear: function (table, clearHead) {
        $(table).find('tbody').html('');
        if (clearHead)
            $(table).find('thead').html('');
    },
    fillBody: function (table, bodyData, trData) {
        var rows = $(table).find('tbody');
        bodyData.forEach((data, i) => {
            rows.append(Table.body(data, i, trData(data, i)));
        });
    },
    fillHead: function (table, trData) {
        var heads = $(table).find('thead');
        heads.append(Table.head(trData));
    },
    head: function (trData) {
        const tr = document.createElement('tr');
        tr.className = 'd-flex';

        trData.forEach((thData) => {
            const th = document.createElement('th');
            th.append(thData.data);
            th.className = thData.col;
            tr.append(th);
        });
        return tr;
    },
    body: function (data, i, trData) {
        const tr = document.createElement('tr');
        tr.setAttribute(trData.attrData.attr, trData.attrData.data);
        tr.className = 'd-flex';

        trData.colData.forEach((tdData) => {
            const td = document.createElement('td');
            td.append(tdData.data);
            td.className = tdData.col;
            tr.append(td);
        });
        return tr;
    },
    unselectRow: function (table) {
        $(table).find('tr').removeClass('highlight');
    },
    selectRow: function (table, rowDataId) {
        var row = $(table).find('tr[data-rowid="' + rowDataId + '"]');
        row.addClass('highlight');
    },
}