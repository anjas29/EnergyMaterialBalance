var xhr;

$.ajaxSetup({
    beforeSend: function (jqXHR) {
        if (xhr)
            xhr.abort();

        xhr = jqXHR;
    },
    complete: function (jqXHR) {
        xhr = null;
    }
});