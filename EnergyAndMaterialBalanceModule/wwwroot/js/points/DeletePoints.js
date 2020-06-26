var DeletePoints = {
    ui: $('#deletePointModal'),
    deleteButton: $('#btnDeletePointModal'),
    form: $('#deletePointForm'),
    modalMessage: $('#deletePointMessage'),
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
            Utils.submitDisabled(this, true);

            e.preventDefault();
            DeletePoints.deletePoints();
        });

    },
    show: function () {
        this.modal.formula.hide();
        Utils.clearModalMessage(this.modalMessage);
        Utils.submitDisabled(this.form, false);

        var selectedPoint = DataResponse.selectedPoint;


        this.modal.name.text(selectedPoint.pointName);
        this.modal.pointId.val(selectedPoint.pointId);


        var hasFormula = selectedPoint.rules.length;
        if (hasFormula > 0)
            this.modal.formula.show();

    },
    deletePoints: async function () {
        pointIdVal = DeletePoints.modal.pointId.val();
        $.ajax({
            method: 'DELETE',
            url: '/main/deletePoint/' + pointIdVal,
            headers: { 'Accept': 'application/json' }

        }).done(function (result) {
            Utils.clearModalMessage(DeletePoints.modalMessage);
            DeletePoints.ui.modal('hide');

            TableView.unselectPoint();
            TableView.removePoint(result.points);

            Message.show(false, Message.successes.deletePointSuccess.format(result.selectedPoint.pointName));

            Utils.buttonDisabled(UpdatePoints.updateButton, true);
            Utils.buttonDisabled(DeletePoints.deleteButton, true);
        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                Utils.fillModalMessage(DeletePoints.modalMessage, Message.errors.deletePointError.format(DataResponse.selectedPoint.pointName));
                Utils.submitDisabled(DeletePoints.form, false);
            }
        });
    }
}