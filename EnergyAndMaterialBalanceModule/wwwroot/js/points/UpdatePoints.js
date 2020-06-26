var UpdatePoints = {
    ui: $('#updatePointModal'),
    updateButton: $('#btnUpdatePointModal'),
    form: $('#updatePointForm'),
    modalMessage: $('#updatePointMessage'),
    collapse: $('#collapseUpdatePoint'),
    validator: null,
    table: {
        ui: $('#updatePointTagTable'),
        selectButton: $('#selectUpdatePointTag'),
        fill: function (selectedSource, tags) {
            var tdData;
            var thData;
            if (selectedSource === 1) {
                tdData = CommonResources.tables.tags.body.iteh;
                thData = CommonResources.tables.tags.head.iteh;
            } else {
                tdData = CommonResources.tables.tags.body.historian_manual;
                thData = CommonResources.tables.tags.head.historian_manual;
            }

            Table.fillHead(this.ui, thData);
            Table.fillBody(this.ui, tags, tdData);
        },
        clear: function () {
            DataResponse.selectedTag = null;
            UpdatePoints.modal.tag.val('');
            Table.clear(this.ui, true);
        },
        unselectTag: function () {
            Table.unselectRow(this.ui);
            DataResponse.selectedTag = null;
            UpdatePoints.modal.tag.val(null);
        },
        selectTag: function (rowData) {
            DataResponse.selectedTag = rowData;
            Table.selectRow(this.ui, rowData);
        }
    },
    modal: {
        name: $('#updatePointName'),
        validMistake: $('#updatePointValidMistake'),
        direction: $('#updatePointDirection'),
        period: $('#updatePointPeriod'),
        source: $('#updatePointSource'),
        tag: $('#updatePointTag'),
        pointId: $('#updatePointId')
    },
    init: function () {
        this.updateButton.click(function () {
            UpdatePoints.show();
        });
        this.form.on('submit', function (e) {
            if (UpdatePoints.form.valid()) {
                Utils.submitDisabled(this, true);

                e.preventDefault();
                UpdatePoints.updatePoints();
            }
        });
        this.setValidator();
        this.modal.source.change(function () {
            var sourceVal = parseInt($(this).val());
            DataResponse.selectedSource = sourceVal;

            UpdatePoints.table.clear();
            UpdatePoints.modal.tag.prop('readonly', true);

            if (sourceVal === 1) {
                Utils.buttonDisabled(UpdatePoints.table.selectButton, false);
                UpdatePoints.table.fill(sourceVal, DataResponse.tags.seicVMappingIteh);
            }
            else if (sourceVal === 2) {
                Utils.buttonDisabled(UpdatePoints.table.selectButton, false);
                UpdatePoints.table.fill(sourceVal, DataResponse.tags.seicVMappingHistorian);
            }
            else if (sourceVal === 3) {
                Utils.buttonDisabled(UpdatePoints.table.selectButton, false);
                UpdatePoints.table.fill(sourceVal, DataResponse.tags.seicVMappingManual);
            } else {
                Utils.buttonDisabled(UpdatePoints.table.selectButton, true);
                UpdatePoints.collapse.collapse('hide');
            }
        });

        this.table.ui.delegate('tr', 'click', function () {

            var selected = $(this).hasClass('highlight');
            UpdatePoints.table.unselectTag();
            if (!selected) {
                $(this).addClass('highlight');
                DataResponse.selectedTag = $(this).data('rowid');
                UpdatePoints.modal.tag.val($(this).data('rowid'));
            }
        });
    },

    show: function () {
        console.log(DataResponse.selectedPoint);
        this.modal.name.val(DataResponse.selectedPoint.pointName);
        this.modal.validMistake.val(DataResponse.selectedPoint.validMistake);

        Utils.populateSelect(this.modal.direction, DataResponse.selectedPoint.direction, CommonResources.directions, 'value', 'name');
        Utils.populateSelect(this.modal.period, DataResponse.selectedPoint.periodId, DataResponse.periods, 'periodId', 'periodName');
        Utils.populateSelect(this.modal.source, DataResponse.selectedPoint.sourceId, DataResponse.sources, 'sourceId', 'sourceName');
        this.modal.pointId.val(DataResponse.selectedPoint.pointId);


        var sourceVal = DataResponse.selectedPoint.sourceId;
        UpdatePoints.modal.tag.prop('readonly', true);
        UpdatePoints.table.clear();
        DataResponse.selectedSource = sourceVal;
        DataResponse.selectedTag = DataResponse.selectedPoint.tagname;


        if (sourceVal === 1) {
            Utils.buttonDisabled(UpdatePoints.updateButton, false);
            UpdatePoints.table.fill(sourceVal, DataResponse.tags.seicVMappingIteh);
            UpdatePoints.table.selectTag(DataResponse.selectedTag);

        }
        else if (sourceVal === 2) {
            Utils.buttonDisabled(UpdatePoints.updateButton, false);
            UpdatePoints.table.fill(sourceVal, DataResponse.tags.seicVMappingHistorian);
            UpdatePoints.table.selectTag(DataResponse.selectedTag);

        }
        else if (sourceVal === 3) {
            Utils.buttonDisabled(UpdatePoints.updateButton, false);
            UpdatePoints.table.fill(sourceVal, DataResponse.tags.seicVMappingManual);
            UpdatePoints.table.selectTag(DataResponse.selectedTag);

        }
        else {
            Utils.buttonDisabled(UpdatePoints.updateButton, true);
        }

        this.modal.tag.val(DataResponse.selectedPoint.tagname);
        UpdatePoints.collapse.collapse('hide');
        Utils.clearModalMessage(this.modalMessage);
        Utils.submitDisabled(this.form, false);
        this.validator.resetForm();

    },
    updatePoints: async function () {
        pointNameVal = this.modal.name.val();
        validMistakeVal = this.modal.validMistake.val();
        directionVal = this.modal.direction.val();
        periodVal = this.modal.period.val();
        sourceVal = this.modal.source.val();
        tagVal = this.modal.tag.val();
        pointIdVal = this.modal.pointId.val();

        $.ajax({
            method: 'POST',
            url: '/main/UpdatePoint',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: JSON.stringify({
                pointId: pointIdVal,
                direction: directionVal,
                tagname: tagVal,
                periodId: periodVal,
                validMistake: validMistakeVal,
                sourceId: sourceVal,
                pointName: pointNameVal,
            })

        }).done(function (result) {
            Utils.clearModalMessage(UpdatePoints.modalMessage);
            UpdatePoints.ui.modal('hide');

            TableView.updatePoint(result.points, result.selectedPoint);

            DataResponse.selectedPoint = result.selectedPoint;

            Message.show(false, Message.successes.updatePointSuccess.format(result.selectedPoint.pointName));
        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                Utils.fillModalMessage(UpdatePoints.modalMessage, Message.errors.updatePointError);
                Utils.submitDisabled(UpdatePoints.form, false);
            }
        });
    },
    setValidator: function () {
        this.validator = this.form.validate({
            rules: {
                updatePointName: {
                    required: true,
                    maxlength: 255
                },
                updatePointValidMistake: {
                    required: true,
                    number: true
                },
                updatePointDirection: {
                    required: true
                },
                updatePointSource: {
                    required: true
                },
                updatePointPeriod: {
                    required: true
                },
                updatePointTag: {
                    required: true
                },

            },
            messages: Message.validation.updatePoint,
        });
    }
};
