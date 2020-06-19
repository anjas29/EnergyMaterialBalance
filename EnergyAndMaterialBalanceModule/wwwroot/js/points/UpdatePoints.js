var UpdatePoints = {
    ui: $('#updatePointModal'),
    addButton: $('#btnUpdatePointModal'),
    form: $('#updatePointForm'),
    validator: null,
    table: {
        ui: $('#updatePointTagTable'),
        fill: function (tags) {
            var heads = $('#updatePointTagTableHead');

            heads.append(UpdatePoints.table.head());

            var rows = $('#updatePointTagTableBody');
            tags.forEach((tag, i) => {
                rows.append(UpdatePoints.table.row(tag, i));
            });
        },
        clear: function () {
            $('#updatePointTagTableBody').html('');
            $('#updatePointTagTableHead').html('');
        },
        head: function (selectedSource) {
            var trData;
            const tr = document.createElement('tr');
            tr.className = 'd-flex';

            if (DataResponse.selectedSource === 1) {
                trData = [
                    {
                        col: 'col-1',
                        data: '#'
                    },

                    {
                        col: 'col-2',
                        data: 'LSName'
                    },

                    {
                        col: 'col-3',
                        data: 'Имя базы данных'
                    },

                    {
                        col: 'col-3',
                        data: 'Имя таблицы'
                    },

                    {
                        col: 'col-3',
                        data: 'Имя тега'
                    },
                ];
            } else {
                trData = [
                    {
                        col: 'col-1',
                        data: '#'
                    },

                    {
                        col: 'col-4',
                        data: 'Имя тега'
                    },

                    {
                        col: 'col-7',
                        data: 'Описание'
                    },

                ];
            }

            trData.forEach((thData) => {
                const th = document.createElement('th');
                th.append(thData.data);
                th.className = thData.col;
                tr.append(th);
            });
            return tr;
        },
        row: function (tag, i) {
            var trData;
            const tr = document.createElement('tr');
            tr.className = 'd-flex';

            if (DataResponse.selectedSource === 1) {
                trData = [
                    {
                        col: 'col-1',
                        data: i + 1
                    },

                    {
                        col: 'col-2 lsname',
                        data: tag.lsname
                    },

                    {
                        col: 'col-3 dbname',
                        data: tag.dbname
                    },

                    {
                        col: 'col-3 tableName',
                        data: tag.tableName
                    },

                    {
                        col: 'col-3 tagName',
                        data: tag.tagName
                    },
                ];
            } else {
                trData = [
                    {
                        col: 'col-1',
                        data: i + 1,
                    },

                    {
                        col: 'col-4 tagName',
                        data: tag.tagName,
                    },

                    {
                        col: 'col-7 description',
                        data: tag.description,
                    },

                ];
            }

            trData.forEach((tdData) => {
                const td = document.createElement('td');
                td.append(tdData.data);
                td.className = tdData.col;
                tr.append(td);
            });
            return tr;
        },

        unselectRow: function () {
            UpdatePoints.table.ui.find('tr').removeClass('highlight');
            DataResponse.selectedTag = null;
            UpdatePoints.modal.tag.val(null);
        },
        selectRow: function (rowData) {
            var row = UpdatePoints.table.ui.find('td:contains(' + rowData + ')').parent();
            UpdatePoints.table.unselectRow();
            row.addClass('highlight');
        }
    }
    ,
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
        this.addButton.click(function () {
            UpdatePoints.show();
        });
        this.form.on('submit', function (e) {
            if (UpdatePoints.form.valid()) {
                UpdatePoints.form.find(':input[type=submit]').prop('disabled', true);
                e.preventDefault();
                UpdatePoints.updatePoints();
            }
        });
        this.setValidator();
        this.modal.source.change(function () {
            var sourceVal = parseInt($(this).val());
            UpdatePoints.modal.tag.prop('readonly', true);
            UpdatePoints.table.clear();
            DataResponse.selectedSource = sourceVal;
            UpdatePoints.modal.tag.val('');

            if (sourceVal === '') {
                Utils.buttonDisabled('#selectUpdatePointTag', true);
            }
            else if (sourceVal === 1) {
                Utils.buttonDisabled('#selectUpdatePointTag', false);
                UpdatePoints.table.fill(DataResponse.tags.seicVMappingIteh);
            }
            else if (sourceVal === 2) {
                Utils.buttonDisabled('#selectUpdatePointTag', false);
                UpdatePoints.table.fill(DataResponse.tags.seicVMappingHistorian);

            }
            else if (sourceVal === 3) {
                Utils.buttonDisabled('#selectUpdatePointTag', false);
                UpdatePoints.table.fill(DataResponse.tags.seicVMappingManual);
            }
            else {
                UpdatePoints.modal.tag.prop('readonly', false);
                Utils.buttonDisabled('#selectUpdatePointTag', true);
                $('#collapseUpdatePoint').collapse('hide');
            }

        });

        this.table.ui.delegate('tr', 'click', function () {

            var selected = $(this).hasClass('highlight');
            UpdatePoints.table.unselectRow();
            if (!selected) {
                $(this).addClass('highlight');
                DataResponse.selectedTag = $(this).find(".tagName").html();
                UpdatePoints.modal.tag.val(DataResponse.selectedTag);
            }
        });

    },

    show: function () {
        this.modal.name.val(DataResponse.selectedPoint.pointName);
        this.modal.validMistake.val(DataResponse.selectedPoint.validMistake);

        Utils.populateSelect(this.modal.direction, DataResponse.selectedPoint.direction, Utils.directions, 'value', 'name');
        Utils.populateSelect(this.modal.period, DataResponse.selectedPoint.periodId, DataResponse.periods, 'periodId', 'periodName');
        Utils.populateSelect(this.modal.source, DataResponse.selectedPoint.sourceId, DataResponse.sources, 'sourceId', 'sourceName');
        this.modal.pointId.val(DataResponse.selectedPoint.pointId);


        var sourceVal = DataResponse.selectedPoint.sourceId;
        UpdatePoints.modal.tag.prop('readonly', true);
        UpdatePoints.table.clear();
        DataResponse.selectedSource = sourceVal;

        DataResponse.selectedTag = DataResponse.selectedPoint.tagname;

        if (sourceVal === '') {
            Utils.buttonDisabled('#selectUpdatePointTag', true);
        }
        else if (sourceVal === 1) {
            Utils.buttonDisabled('#selectUpdatePointTag', false);
            UpdatePoints.table.fill(DataResponse.tags.seicVMappingIteh);
            UpdatePoints.table.selectRow(DataResponse.selectedTag);

        }
        else if (sourceVal === 2) {
            Utils.buttonDisabled('#selectUpdatePointTag', false);
            UpdatePoints.table.fill(DataResponse.tags.seicVMappingHistorian);
            UpdatePoints.table.selectRow(DataResponse.selectedTag);

        }
        else if (sourceVal === 3) {
            Utils.buttonDisabled('#selectUpdatePointTag', false);
            UpdatePoints.table.fill(DataResponse.tags.seicVMappingManual);
            UpdatePoints.table.selectRow(DataResponse.selectedTag);

        }
        else {
            UpdatePoints.modal.tag.prop('readonly', false);
            Utils.buttonDisabled('#selectUpdatePointTag', true);
            $('#collapseUpdatePoint').collapse('hide');
        }

        this.modal.tag.val(DataResponse.selectedPoint.tagname);
        $('#collapseUpdatePoint').collapse('hide');
        Utils.clearModalMessage('#updatePointMessage');
        this.form.find(':input[type=submit]').prop('disabled', false);
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
            method: "POST",
            url: "/main/UpdatePoint", 
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
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
            Utils.clearModalMessage('#updatePointMessage');
            $('#updatePointModal').modal('hide');
            TableView.unselectRow();
            TableView.updatePoint(result.points, result.selectedPoint);
            DataResponse.selectedPoint = result.selectedPoint;
            Message.show(false, "Точка учета '" + result.selectedPoint.pointName + "' была успешно обновлена!");
        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                Utils.fillModalMessage('#updatePointMessage', "Не удалось создать точку учета!");
                UpdatePoints.form.find(':input[type=submit]').prop('disabled', false);
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
            messages: {
                updatePointName: {
                    required: "Укажите имя точки учета, это поле не может быть пустым!",
                    maxlength: "Название точки учета должно содержать меньше 255 символов!"
                },
                updatePointValidMistake: {
                    required: "Укажите допустимый дисбаланс, это поле не может быть пустым!",
                    number: "Укажите допустимый дисбаланс в правильном формате!",
                },
                updatePointDirection: {
                    required: "Укажите направление, это поле не может быть пустым!",
                },
                updatePointSource: {
                    required: "Укажите источник, это поле не может быть пустым!",
                },
                updatePointPeriod: {
                    required: "Укажите период, это поле не может быть пустым!",
                },
                updatePointTag: {
                    required: "Укажите тег, это поле не может быть пустым!",

                },
            }
        });
    }
};