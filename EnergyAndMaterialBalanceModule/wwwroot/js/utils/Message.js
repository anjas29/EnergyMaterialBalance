var Message = {
    ui: $('#message'),
    show: function (error, message) {
        if (!error)
            this.ui.addClass('alert-success');
        else
            this.ui.addClass('alert-warning');

        this.ui.text(message);
        this.ui.show().delay(8000).fadeOut();
    }
};