var CreatePoints = {
    ui: $('#createPointModal'),
    addButton: $('#btnCreatePointModal'),
    form: $('#createPointForm'),
    modalMessage: $('#createPointMessage'),
    collapse: $('#collapseCreatePoint'),
    validator: null,
    table: {
        ui: $('#createPointTagTable'),
        selectButton: $('#selectCreatePointTag'),
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
            CreatePoints.modal.tag.val('');
            Table.clear(this.ui, true);
        },
        unselectTag: function () {
            Table.unselectRow(this.ui);
            DataResponse.selectedTag = null;
            CreatePoints.modal.tag.val(null);
        },
        selectTag: function (tr) {
            DataResponse.selectedTag = $(tr).data('rowid');
            CreatePoints.modal.tag.val(DataResponse.selectedTag);
            Table.selectRow(this.ui, DataResponse.selectedTag);
        }
    },
    modal: {
        name: $('#createPointName'),
        validMistake: $('#createPointValidMistake'),
        direction: $('#createPointDirection'),
        period: $('#createPointPeriod'),
        source: $('#createPointSource'),
        tag: $('#createPointTag'),
        bgroupId: $('#createPointBgroupId')
    },
    init: function () {
        this.addButton.click(function () {
            CreatePoints.show();
        });
        this.form.on('submit', function (e) {
            if (CreatePoints.form.valid()) {
                Utils.submitDisabled(this, true);

                e.preventDefault();
                CreatePoints.createPoints();
            }
        });
        this.setValidator();
        this.modal.source.change(function () {
            var sourceVal = parseInt($(this).val());
            DataResponse.selectedSource = sourceVal;

            CreatePoints.table.clear();
            CreatePoints.modal.tag.prop('readonly', true);

            if (sourceVal === 1) {
                Utils.buttonDisabled(CreatePoints.table.selectButton, false);
                CreatePoints.table.fill(sourceVal, DataResponse.tags.seicVMappingIteh);
            }
            else if (sourceVal === 2) {
                Utils.buttonDisabled(CreatePoints.table.selectButton, false);
                CreatePoints.table.fill(sourceVal, DataResponse.tags.seicVMappingHistorian);
            }
            else if (sourceVal === 3) {
                Utils.buttonDisabled(CreatePoints.table.selectButton, false);
                CreatePoints.table.fill(sourceVal, DataResponse.tags.seicVMappingManual);
            } else {
                Utils.buttonDisabled(CreatePoints.table.selectButton, true);
                CreatePoints.collapse.collapse('hide');
            }
        });

        this.table.ui.delegate('tr', 'click', function () {

            var selected = $(this).hasClass('highlight');
            CreatePoints.table.unselectTag();
            if (!selected) {
                $(this).addClass('highlight');
                CreatePoints.table.selectTag(this);
            }
        });

    },

    show: function () {
        this.modal.name.val('');
        this.modal.validMistake.val('');
        this.modal.tag.val('');
        Utils.populateSelect(this.modal.direction, null, CommonResources.directions, 'value', 'name');
        Utils.populateSelect(this.modal.period, null, DataResponse.periods, 'periodId', 'periodName');
        Utils.populateSelect(this.modal.source, null, DataResponse.sources, 'sourceId', 'sourceName');
        this.modal.bgroupId.val(DataResponse.selectedBGroup.bgroupId);

        CreatePoints.collapse.collapse('hide');
        CreatePoints.table.clear();
        DataResponse.selectedSource = null;
        DataResponse.selectedTag = null;


        Utils.buttonDisabled(CreatePoints.table.selectButton, true);

        Utils.clearModalMessage(this.modalMessage);
        Utils.submitDisabled(this.form, false);
        this.validator.resetForm();

    },
    createPoints: async function () {
        pointNameVal = this.modal.name.val();
        validMistakeVal = this.modal.validMistake.val();
        directionVal = this.modal.direction.val();
        periodVal = this.modal.period.val();
        sourceVal = this.modal.source.val();
        tagVal = this.modal.tag.val();
        bgroupIdVal = this.modal.bgroupId.val();

        $.ajax({
            method: 'POST',
            url: '/main/CreatePoint',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: JSON.stringify({
                bgroupId: bgroupIdVal,
                direction: directionVal,
                tagname: tagVal,
                periodId: periodVal,
                validMistake: validMistakeVal,
                sourceId: sourceVal,
                pointName: pointNameVal,
            })
        }).done(function (result) {
            Utils.clearModalMessage(CreatePoints.modalMessage);
            CreatePoints.ui.modal('hide');

            DataResponse.selectedPoint = result.selectedPoint;

            TableView.addPoint(result.points, result.selectedPoint);

            Message.show(false, Message.successes.createPointSuccess.format(result.selectedPoint.pointName));
        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                Utils.fillModalMessage(CreatePoints.modalMessage, Message.errors.createPointError);
                Utils.submitDisabled(CreatePoints.form, false);
            }
        });
    },
    setValidator: function () {
        this.validator = this.form.validate({
            rules: {
                createPointName: {
                    required: true,
                    maxlength: 255
                },
                createPointValidMistake: {
                    required: true,
                    number: true
                },
                createPointDirection: {
                    required: true
                },
                createPointSource: {
                    required: true
                },
                createPointPeriod: {
                    required: true
                },
                createPointTag: {
                    required: true
                },

            },
            messages: Message.validation.createPoint,
        });
    }
};