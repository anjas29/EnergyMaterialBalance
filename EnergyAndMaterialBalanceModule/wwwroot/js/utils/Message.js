var Message = {
    ui: $('#message'),
    errors: {
        getBGroupsError: 'Не удалось получить список балансовых групп для ресурса "{0}"!',
        getPointsError: 'Не удалось получить список точек учета и допустимый дисбаланс для группы "{0}"!',
        createBGroupError: 'Не удалось создать балансовую группу!',
        deleteBGroupError: 'Не удалось удалить балансовую группу "{0}"!',
        updateBGroupError: 'Не удалось изменить балансовую группу!',
        deletePointError: 'Не удалось удалить точку учета "{0}"!',
        getPointError: 'Не удалось получить данные для точки учета!',
        createPointError: 'Не удалось создать точку учета!',
        updatePointError: 'Не удалось обновить точку учета!',
    },
    successes: {
        createBGroupSuccess: 'Балансовая группа "{0}" была успешно добавлена!',
        deleteBGroupSuccess: 'Балансовая группа "{0}" была успешно удалена!',
        updateBGroupSuccess: 'Балансовая группа "{0}" была успешно обновлена!',
        deletePointSuccess: 'Точка учета "{0}" была успешно удалена!',
        createPointSuccess: 'Точка учета "{0}" была успешно добавлена!',
        updatePointSuccess: 'Точка учета "{0}" была успешно обновлена!',
    },
    validation: {
        createBGroup: {
            createBGroupName: {
                required: 'Укажите имя балансовой группы, это поле не может быть пустым!',
                maxlength: 'Название группы должно содержать меньше 255 символов!'
            },
            createValidDisbalance: {
                required: 'Укажите допустимый дисбаланс, это поле не может быть пустым!',
                number: 'Укажите допустимый дисбаланс в правильном формате!',
            },
            createBGroupIdParent: {
                required: 'Укажите уровень, это поле не может быть пустым!',
            }
        },
        updateBGroup: {
            updateBGroupName: {
                required: "Укажите имя балансовой группы, это поле не может быть пустым!",
                maxlength: "Название группы должно содержать меньше 255 символов!"
            },
            updateValidDisbalance: {
                required: "Укажите допустимый дисбаланс, это поле не может быть пустым!",
                number: "Укажите допустимый дисбаланс в правильном формате!",
            },
        },
        createPoint: {
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
        },
        updatePoint: {
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
        },

    },
    messageDelay: 8000,
    show: function (error, message) {
        if (!error)
            this.ui.addClass('alert-success');
        else
            this.ui.addClass('alert-warning');

        this.ui.text(message);
        this.ui.show().delay(this.messageDelay).fadeOut();
    }
};