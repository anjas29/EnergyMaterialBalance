var CreateBgroups = {
    ui: $('#createBGroupModal'),
    addButton: $('#btnCreateBGroupModal'),
    form: $('#createBGroupForm'),
    validator: null,
    modal: {
        name: $('#createBGroupName'),
        validDisbalanace: $('#createValidDisbalance'),
        resourceId: $('#createResourceId'),
        asChild: $('#asChild'),
        sameLevel: $('#sameLevel')
    },
    init: function () {
        this.addButton.click(function () {
            CreateBgroups.show();
        });
        this.form.on('submit', function (e) {
            console.log('create submit');
            if (CreateBgroups.form.valid()) {
                e.preventDefault();
                CreateBgroups.createBgroups();
            }
        });
        this.setValidator();
    },
    show: function () {
        this.modal.name.val("");
        this.modal.validDisbalanace.val("");
        this.modal.resourceId.val(DataResponse.selectedResource.resourceId);

        if (DataResponse.selectedBGroup != null) {
            this.modal.asChild.val(DataResponse.selectedBGroup.bgroupId);
            this.modal.sameLevel.val(DataResponse.selectedBGroup.bgroupIdparent);
            this.modal.asChild.prop('disabled', false);
            this.modal.asChild.prop('checked', false);
            this.modal.sameLevel.prop('checked', false);
            this.modal.sameLevel.prop('disabled', false);
        }
        else {
            this.modal.sameLevel.val(null);
            this.modal.asChild.val(null);
            this.modal.asChild.prop('disabled', true);
            this.modal.asChild.prop('checked', false);
            this.modal.sameLevel.prop('checked', true);
            this.modal.sameLevel.prop('disabled', true);
        }
    },
    createBgroups: async function () {
        bGroupNameVal = this.modal.name.val();
        validDisbalanceVal = this.modal.validDisbalanace.val();
        resourceIdVal = this.modal.resourceId.val();
        bGroupIdParentVal = $('input:radio[name="createBGroupIdParent"]:checked').val();

        console.log(bGroupNameVal);
        console.log(validDisbalanceVal);
        console.log(resourceIdVal);
        console.log(bGroupIdParentVal);

        const response = await fetch("/main/CreateBGroup", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                bgroupName: bGroupNameVal,
                validDisbalance: validDisbalanceVal,
                resourceId: parseInt(resourceIdVal),
                bgroupIdparent: bGroupIdParentVal
            })
        });
        if (response.ok === true) {
            Utils.clearModalMessage('#createMessage');
            const result = await response.json();
            $('#createBGroupModal').modal('hide');
            TreeView.addNode(result.selectedBGroup);
            Message.show(false, "Балансовая группа '" + result.selectedBGroup.bgroupName + "' была успешно добавлена!");
        }
        else {
            Utils.fillModalMessage('#createMessage', "Не удалось создать балансовую группу!");
        }
    },
    setValidator: function () {
        this.validator = this.form.validate({
            rules: {
                createBGroupName: {
                    required: true,
                    maxlength: 255
                },
                createValidDisbalance: {
                    required: true,
                    number: true
                },
                createBGroupIdParent: {
                    required: true,
                }
            },
            messages: {
                createBGroupName: {
                    required: "Укажите имя балансовой группы, это поле не может быть пустым!",
                    maxlength: "Название группы должно содержать меньше 255 символов!"
                },
                createValidDisbalance: {
                    required: "Укажите допустимый дисбаланс, это поле не может быть пустым!",
                    number: "Укажите допустимый дисбаланс в правильном формате!",
                },
                createBGroupIdParent: {
                    required: "Укажите уровень, это поле не может быть пустым!",
                }
            },
        });
    }
};