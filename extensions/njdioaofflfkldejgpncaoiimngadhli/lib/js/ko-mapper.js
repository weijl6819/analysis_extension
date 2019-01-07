define(['knockout'], function(ko) {

    var getType = function(any) {
        if(any === null)
            return 'null';

        return Object.prototype.toString.apply(any).slice(8, -1).toLowerCase();
    };

    var isJson = function(any) {
        return getType(any) === 'object';
    };

    var isArray = function(any) {
        return getType(any) === 'array';
    };


/*
    var mappedInfo = {

        _list: [],

        _indexOf: function(obj) {
            for(var i = 0; i < mappedInfo._list.length; ++i)
                if(mappedInfo._list[i].obj === obj)
                    return i;

            return -1;
        },

        get: function(obj) {
            var i = mappedInfo._indexOf(obj);
            return i !== -1 ? mappedInfo._list[i].info : null;
        },

        set: function(obj, info) {
            var i = mappedInfo._indexOf(obj);
            if(i !== -1)
                mappedInfo._list[i].info = info;
            else
                mappedInfo._list.push({ obj: obj, info: info });
        },

        unset: function(obj) {
            var i = mappedInfo._indexOf(obj);
            if(i !== -1)
                mappedInfo._list.splice(i, 1);
        }

    };
*/


    var mapper = {

        KEY: 'KO_MAPPER_',

        toJS: function(any, pref) {
            if(isJson(any)) {
                var ret = {}, i;

                for(i in any)
                    if(any.hasOwnProperty(i))
                        ret[i] = mapper.toJS(any[i], pref+'[' + i + ']');

                return ret;
            }

            return ko.unwrap(any);
        },

        initFromJS: function(any) {
            if(isJson(any)) {
                var ret = {};

                for(var i in any)
                    if(any.hasOwnProperty(i))
                        ret[i] = mapper.initFromJS(any[i]);

                return ret;
            }

            if(isArray(any))
                return ko.observableArray(any);

            return ko.observable(any);
        },

        // function(target, arg1, arg2, ...)
        updateFromJS: function(target) {
            var argc = arguments.length;
            var i, k, ret;

            if(isJson(target)) {
                // Ignore keys which are not already defined in target...
                for(k in target) {
                    if(!target.hasOwnProperty(k))
                        continue;

                    var map_args = [ target[k] ];

                    // Only keep valid arguments for recursive mapping
                    for(i = 1; i < argc; ++i)
                        if(isJson(arguments[i]) && arguments[i].hasOwnProperty(k))
                            map_args.push(arguments[i][k]);

                    if(map_args.length === 1)
                        continue;

                    ret = mapper.updateFromJS.apply(null, map_args);

                    if(typeof ret !== 'undefined')
                        target[k] = ret;
                }

                return;
            }

            if(ko.isObservable(target)) {
                // Array
                if(typeof target.sort === 'function') {
                    // Start from the last argument, until we find a proper type match
                    for(i = argc - 1; i > 0; --i) {
                        if(isArray(arguments[i])) {
                            target(ko.unwrap(arguments[i]));
                            break;
                        }
                    }
                }
                // Not an array
                else {
                    target(ko.unwrap(arguments[argc - 1]));
                }

                return;
            }

            return ko.unwrap(arguments[argc - 1]);
        },

        // Returns an observable holding a boolean value indicating whether
        // there was any changes to the original observables provided when
        // the tracker was setup.
        dirtyTracker: function(/* anything */) {
            var keyOriginal = mapper.KEY + 'ORIGINAL__';
            var keyIsDirty  = mapper.KEY + 'DIRTY__';

            var dirtyCounter    = 0;
            var dirtyObservable = ko.observable(false);

            var subscribers = [];
            dirtyObservable.dirtyDispose = function() {
                for(var i = 0, len = subscribers.length; i < len; ++i)
                    subscribers[i].watcher.dispose();

                subscribers = [];
                dirtyCounter = 0;
                dirtyObservable(false);
            };

            var rec = function(value, i, len) {
                if(ko.isObservable(value)) {
                    // ObservableArray
                    if(typeof value.sort === 'function') {
                        value[keyIsDirty]  = false;

                        subscribers.push({
                            is_array: true,
                            observable: value,
                            watcher: value.extend({
                                'trackArrayChanges': true
                            }).subscribe(function(changes) {
                                // One way flagging for observable arrays
                                if(!value[keyIsDirty]) {
                                    value[keyIsDirty] = true;
                                    dirtyObservable(!!(++dirtyCounter)); // Atomic op
                                }
                            }, value, 'arrayChange')
                        });
                    }
                    // Plain Observable
                    else {
                        value[keyOriginal] = value.peek();
                        value[keyIsDirty]  = false;

                        subscribers.push({
                            is_array: false,
                            observable: value,
                            watcher: value.subscribe(function(newValue) {
                                if(value[keyOriginal] === newValue) {
                                    if(value[keyIsDirty]) {
                                        value[keyIsDirty] = false;
                                        dirtyObservable(!!(--dirtyCounter)); // Atomic op
                                    }
                                }
                                else {
                                    if(!value[keyIsDirty]) {
                                        value[keyIsDirty] = true;
                                        dirtyObservable(!!(++dirtyCounter)); // Atomic op
                                    }
                                }
                            })
                        });
                    }
                    return;
                }

                // Indexed tracking
                if(isArray(value)) {
                    for(i = 0, len = value.length; i < len; ++i)
                        rec(value[i]);

                    return;
                }

                // Keys tracking
                if(typeof value === 'object') {
                    for(i in value)
                        rec(value[i]);

                    return;
                }
            };

            var args = arguments;
            dirtyObservable.reset = function(hardReset) {
                var i, value;

                if(!!hardReset) {
                    dirtyObservable.dirtyDispose();

                    for(i = 0; i < args.length; ++i)
                        rec(args[i]);
                }
                else {
                    for(i = 0; i < subscribers.length; ++i) {
                        value = subscribers[i].observable;

                        value[keyIsDirty]  = false;

                        if(!subscribers[i].is_array)
                            value[keyOriginal] = value.peek();
                    }

                    dirtyCounter = 0;
                    dirtyObservable(false);
                }
            };

            dirtyObservable.reset(true);

            return dirtyObservable;
        }

    };

    return mapper;
});
