var CreatePoints = {
    ui: $('#createPointModal'),
    addButton: $('#btnCreatePointModal'),
    form: $('#createPointForm'),
    validator: null,
    table: {
        ui: $('#createPointTagTable'),
        fill: function (tags) {
            var heads = $('#createPointTagTableHead');

            heads.append(CreatePoints.table.head());

            var rows = $('#createPointTagTableBody');
            tags.forEach((tag, i) => {
                rows.append(CreatePoints.table.row(tag, i));
            });
        },
        clear: function () {
            $('#createPointTagTableBody').html('');
            $('#createPointTagTableHead').html('');
        },
        head: function (selectedSource) {
            var trData;
            const tr = document.createElement('tr');
            tr.className = 'd-flex';

            if (DataResponse.selectedSource === '1') {
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

            if (DataResponse.selectedSource === '1') {
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
            CreatePoints.table.ui.find('tr').removeClass('highlight');
            DataResponse.selectedTag = null;
            CreatePoints.modal.tag.val(null);
        },
    }
    ,
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
                CreatePoints.form.find(':input[type=submit]').prop('disabled', true);
                e.preventDefault();
                CreatePoints.createPoints();
            }
        });
        this.setValidator();
        this.modal.source.change(function () {
            var sourceVal = $(this).val();
            CreatePoints.modal.tag.prop('readonly', true);
            CreatePoints.table.clear();
            DataResponse.selectedSource = sourceVal;
            CreatePoints.modal.tag.val('');

            if (sourceVal === '') {
                Utils.buttonDisabled('#selectCreatePointTag', true);
            }
            else if (sourceVal === '1') {
                Utils.buttonDisabled('#selectCreatePointTag', false);
                CreatePoints.table.fill(DataResponse.tags.seicVMappingIteh);
            }
            else if (sourceVal === '2') {
                Utils.buttonDisabled('#selectCreatePointTag', false);
                CreatePoints.table.fill(DataResponse.tags.seicVMappingHistorian);

            }
            else if (sourceVal === '3') {
                Utils.buttonDisabled('#selectCreatePointTag', false);
                CreatePoints.table.fill(DataResponse.tags.seicVMappingManual);
            }
            else {
                CreatePoints.modal.tag.prop('readonly', false);
                Utils.buttonDisabled('#selectCreatePointTag', true);
                $('#collapseCreatePoint').collapse('hide');
            }
        });

        this.table.ui.delegate('tr', 'click', function () {

            var selected = $(this).hasClass('highlight');
            CreatePoints.table.unselectRow();
            if (!selected) {
                $(this).addClass('highlight');
                DataResponse.selectedTag = $(this).find(".tagName").html();
                CreatePoints.modal.tag.val(DataResponse.selectedTag);
            }
        });

    },

    show: function () {
        this.modal.name.val('');
        this.modal.validMistake.val('');
        this.modal.tag.val('');
        Utils.populateSelect(this.modal.direction, null, Utils.directions, 'value', 'name');
        Utils.populateSelect(this.modal.period, null, DataResponse.periods, 'periodId', 'periodName');
        Utils.populateSelect(this.modal.source, null, DataResponse.sources, 'sourceId', 'sourceName');
        this.modal.bgroupId.val(DataResponse.selectedBGroup.bgroupId);

        $('#collapseCreatePoint').collapse('hide');
        CreatePoints.table.clear();
        DataResponse.selectedSource = null;
        DataResponse.selectedTag = null;


        Utils.buttonDisabled('#selectCreatePointTag', true);
        Utils.clearModalMessage('#createPointMessage');
        this.form.find(':input[type=submit]').prop('disabled', false);
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
            method: "POST",
            url: "/main/CreatePoint",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
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
            Utils.clearModalMessage('#createPointMessage');
            $('#createPointModal').modal('hide');
            DataResponse.selectedPoint = result.selectedPoint;
            TableView.addPoint(result.points, result.selectedPoint);
            Message.show(false, "Точка учета '" + result.selectedPoint.pointName + "' была успешно добавлена!");
        }).fail(function (result, textStatus) {
            if (textStatus !== 'abort') {
                Utils.fillModalMessage('#createPointMessage', "Не удалось создать точку учета!");
                CreatePoints.form.find(':input[type=submit]').prop('disabled', false);
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
            messages: {
                createPointName: {
                    required: "Укажите имя точки учета, это поле не может быть пустым!",
                    maxlength: "Название точки учета должно содержать меньше 255 символов!"
                },
                createPointValidMistake: {
                    required: "Укажите допустимый дисбаланс, это поле не может быть пустым!",
                    number: "Укажите допустимый дисбаланс в правильном формате!",
                },
                createPointDirection: {
                    required: "Укажите направление, это поле не может быть пустым!",
                },
                createPointSource: {
                    required: "Укажите источник, это поле не может быть пустым!",
                },
                createPointPeriod: {
                    required: "Укажите период, это поле не может быть пустым!",
                },
                createPointTag: {
                    required: "Укажите тег, это поле не может быть пустым!",

                },
            }
        });
    }
};