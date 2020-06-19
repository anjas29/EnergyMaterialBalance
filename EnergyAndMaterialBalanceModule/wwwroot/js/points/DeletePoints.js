var DeletePoints = {
    ui: $('#deletePointModal'),
    deleteButton: $('#btnDeletePointModal'),
    form: $('#deletePointForm'),
    modal: {
        name: $('#deletePointName'),
        formula: $('#deletePointFormula'),
        pointId: $('#deletePointId'),
    },

    init: function () {
        this.deleteButton.on('click', function () {
            DeletePoints.show();
        });
        this.form.on('submit', function (e) {
            DeletePoints.form.find(':input[type=submit]').prop('disabled', true);
            e.preventDefault();
            DeletePoints.deletePoints();
        });

    },
    show: function () {
        var selectedPoint = DataResponse.selectedPoint;
        this.modal.name.text(selectedPoint.pointName);
        this.modal.formula.hide();
        this.form.find(':input[type=submit]').prop('disabled', false);
        Utils.clearModalMessage('#deletePointMessage');

        var hasFormula = selectedPoint.rules.length;
        if (hasFormula > 0)
            this.modal.formula.show();

        this.modal.pointId.val(selectedPoint.pointId);
    },
    deletePoints: async function () {
        pointId = DeletePoints.modal.pointId.val();
        $.ajax({
            method: "DELETE",
            url: "/main/deletePoint/" + pointId,
            headers: { "Accept": "application/json" }

        }).done(function (result) {
            Utils.clearModalMessage('#deletePointMessage');
            Message.show(false, "Точка учета '" + result.selectedPoint.pointName + "' была успешно удалена!");
            TableView.unselectRow();
            TableView.removePoint(result.points);
            Utils.buttonDisabled('#btnDeletePointModal', true);
            Utils.buttonDisabled('#btnUpdatePointModal', true);
            DeletePoints.ui.modal('hide');
        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                Utils.fillModalMessage('#deletePointMessage', "Не удалось удалить точку учета '" + DataResponse.selectedPoint.pointName + "'!");
                DeletePoints.form.find(':input[type=submit]').prop('disabled', false);
            }
        });
    }
}