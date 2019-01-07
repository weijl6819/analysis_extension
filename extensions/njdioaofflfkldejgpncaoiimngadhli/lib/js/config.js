define(['rsvp', 'lib/js/config/one', 'lib/js/config/ext'], function(RSVP, one, ext) {

    var config = {

        loaded: RSVP.hash({
//            cache: new RSVP.Promise(function(resolve, reject) {
//                resolve(null);
//            }),

            one: one,
            ext: ext

        }).then(function(data) {
            for(var key in data)
                if(data.hasOwnProperty(key))
                    config[key] = data[key];
        })

        // More attributes will be added when promise gets resolved

    };



    return config;

});
