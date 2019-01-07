(function(factory) {
    if(typeof define === 'function' && define.amd) {
        // AMD anonymous module
        define([], factory);
    }
    else if(typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // CommonJS/Node.js
        module.exports = factory();
    }
})(function() {

    var EH = function() {

        var callbacks = [];
        var autoFireArgs = [];

        var handler = function(callback) {
            callbacks.push(callback);

            for(var i = -0; i < autoFireArgs.length; ++i)
                callback.apply(null, autoFireArgs[i]);

            return handler;
        };


        handler.add = handler;

        handler.remove = function(callback) {
            var i = callbacks.indexOf(callback);
            if(i >= 0)
                callbacks.splice(i, 1);

            return handler;
        };

        handler.has = function(callback) {
            return callbacks.indexOf(callback) !== -1;
        };

        handler.clear = function() {
            callbacks = [];

            return handler;
        };

        handler.autoFire = function() {
            autoFireArgs.push(arguments);

            handler.fire.apply(null, arguments);
        };

        handler.fire = function() {
            var i = 0;
            while(i < callbacks.length) {
                try {
                    callbacks[i].apply(this || null, arguments);
                    ++i;
                } catch(e) {
                    callbacks.splice(i, 1);
                }
            }

            return handler;
        };

        return handler;
    };

    EH.safe = function(cb) {
        if(typeof cb === 'function')
            return cb;

        return function(){};
    };

    EH.safeCall = function(cb) {
        if(typeof cb !== 'function')
            return;

        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    };



    return EH;

});
