define(['rsvp'], function(RSVP) {

    var Promise = RSVP.Promise;

    var ajax = function(url, settings) {

        if(typeof url === 'object') {
            settings = url;
            url = null;
        }
        else if(typeof settings !== 'object')
            settings = {};

        if(typeof url === 'string')
            settings.url = url;

        if(typeof settings.method !== 'string')
            settings.method = 'GET';

        var xhr = new XMLHttpRequest();
        var openArgs = [ settings.method.toUpperCase(), settings.url, true ];

        if(typeof settings.username === 'string') {
            openArgs.push(settings.username);

            if(typeof settings.password === 'string')
                openArgs.push(settings.password);
        }

        try {
            xhr.open.apply(xhr, openArgs);
        }
        catch(e) {
            return new Promise(function(resolve, reject) {
                reject({ error: e });
            });
        }

        var hasContentTypeHeader = false;

        if(typeof settings.headers === 'object') {
            for(var i in settings.headers) {
                if(i.toLowerCase() === 'content-type')
                    hasContentTypeHeader = true;

                xhr.setRequestHeader(i, settings.headers[i]);
            }
        }

        if(settings.dataType === 'blob')
            xhr.responseType = 'blob';

        var promise = new Promise(function(resolve, reject) {
            xhr.onreadystatechange = function() {
                if(xhr.readyState !== 4)
                    return;

                var ret = {
                    error: false,
                    xhr:   xhr,
                    data:  null
                };

                // Failure
                if(xhr.status < 200 || xhr.status >= 300) {
                    ret.error = 'Invalid status';
                    reject(ret);
                    return;
                }

                // Success

                if(typeof settings.dataType !== 'string')
                    settings.dataType = xhr.getResponseHeader('Content-Type') || 'text/plain';

                switch(settings.dataType) {
                    case 'json':
                    case 'application/json':
                    case 'text/json':
                        try {
                            ret.data = JSON.parse(xhr.responseText);
                        }
                        catch(e) {
                            ret.error = e.message;
                            reject(ret);
                            return;
                        }
                        break;

                    case 'xml':
                    case 'application/xml':
                    case 'text/xml':
                        ret.data = xhr.responseXml;
                        break;

                    default:
                        ret.data = xhr.response;
                }

                resolve(ret);
            };

            if(settings.method.toUpperCase() === 'POST' && settings.payload) {
                if(!hasContentTypeHeader)
                    xhr.setRequestHeader('Content-Type',   'application/x-www-form-urlencoded');

                xhr.send(settings.payload);
            }
            else
                xhr.send();
        });

        return promise;
    };

    ajax.get = function() {
        //console.log('NYI');
    };




    return ajax;

});
