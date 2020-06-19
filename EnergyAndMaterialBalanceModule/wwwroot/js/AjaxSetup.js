var xhrPool;

$.ajaxSetup({
    beforeSend: function (jqXHR) {
        if (xhrPool)
            xhrPool.abort();

        xhrPool = jqXHR;
    },
    complete: function (jqXHR) {
        xhrPool = null;
    }
});