var BasicModel = Backbone.Model.extend({
    url: '',
    updatePeriod: 0,
    updateInterval: null,
    lastUpdated: 0,
    storageFlag: '',
    updateFlag: '',
    console: '',
    consoleColor: 'color:#000000',
    defaults: {},

    basicInitialize: function () {
        if (this.url) {
            this.setOptions();
            this.fetch();
        }
    },

    setOptions: function () {
        var self = this;
        this.options = {
            error: function () {
                log('%c' + self.console + '.JS: FETCH FAILED', self.consoleColor);
                setTimeout(function () {
                    self.fetch();
                }, FETCH_TIMEOUT_IN_CASE_OF_ERROR);
            },
            success: function (model) {
                log('%c' + self.console + '.JS: FETCH SUCCEEDED', self.consoleColor);
                framework.extension.setItem(self.updateFlag, _.now());
                if (self.fetchTimeout) {//!!
                    window.clearTimeout(self.fetchTimeout);
                    self.fetchTimeout = null;
                }
                self.fetchTimeout = window.setTimeout(function () {
                    log('%c' + self.console + '.JS: PERIODICAL FETCH', self.consoleColor);
                    self.fetch();
                }, self.updatePeriod);
                model && model.save();
            },
            dataType: self.dataType,
            reset: true
        };
    },

    fetch: function (options) {
        log('%c' + this.console + '.JS: FETCH INIT', 'color:#17a5a5', options);
        var self = this;

        var thisOptions = {};
        if (options) {
            thisOptions.success = function () {
                (self.options && self.options.success) && self.options.success();
                options.success && options.success();
            };
            thisOptions.error = function () {
                (self.options && self.options.error) && self.options.error();
                options.error && options.error();
            };
            thisOptions.dataType = options.dataType || self.options.dataType;
            thisOptions.reset = options.reset || self.options.reset;
        } else {
            thisOptions = this.options;
        }

        return framework.extension.getItem(this.updateFlag, function (timeLastUpdate) {
            if (!timeLastUpdate || (_.now() - timeLastUpdate >= self.updatePeriod)) {
                self.fetchFromServer(thisOptions);
            } else {
                self.fetchFromStorage(thisOptions);
            }
        });
    },

    fetchFromServer: function (options) {
        log('%c' + this.console + '.JS: FETCH FROM SERVER', this.consoleColor, options);
        if (!options) {
            options = this.options;
        }
        return Backbone.Model.prototype.fetch.apply(this, [options]);
    },

    fetchFromStorage: function (options) { // not necessary to load from storage
        log('%c' + this.console + '.JS: FETCH FROM STORAGE', this.consoleColor);
        if (!options) {
            options = this.options;
        }
        var self = this;
        framework.extension.getItem(this.storageFlag, function (element) {
            if (element && _.isString(element)) {
                element = JSON.parse(element);
            }
            if (_.isObject(element)) {
                self.set(element);
                options.success && options.success();
                return new Promise(function (resolve, reject) {
                    resolve();
                });
            } else {
                log('%c' + self.console + '.JS: FETCH FROM STORAGE FAILED', self.consoleColor);
                framework.extension.setItem(self.updateFlag, 0);
                return Backbone.Model.prototype.fetch.apply(self, [options]);
            }
        });
    },

    parse: function (response) {
        log('%c' + this.console + '.JS: PARSE', this.consoleColor, response.MethodResponse ? response.MethodResponse.Data : response.ErrorMessage);
        return response.MethodResponse ? response.MethodResponse.Data : null;
    },

    save: function () {
        framework.extension.setItem(this.storageFlag, this.toJSON());
    }
});

var Container = Backbone.Collection.extend({
    model: {},
    url: '',
    updatePeriod: null,
    storageFlag: '',
    updateFlag: '',
    console: '',
    dataType: 'json',

    initialize: function (options) {
        if (this.url) {
            this.setOptions(options);
            this.fetch(options);
        }
    },

    setOptions: function (options) {
        var self = this;
        this.options = {
            error: function () {
                log('%c' + self.console + '.JS: FETCH FAILED', self.consoleColor);
                setTimeout(function () {
                    self.fetch(options);
                }, FETCH_TIMEOUT_IN_CASE_OF_ERROR);
            },
            success: function (collection) {
                log('%c' + self.console + '.JS: FETCH SUCCEEDED', self.consoleColor);
                framework.extension.setItem(self.updateFlag, _.now());
                if (self.fetchTimeout) {//!!
                    window.clearTimeout(self.fetchTimeout);
                    self.fetchTimeout = null;
                }
                self.fetchTimeout = window.setTimeout(function () {
                    log('%c' + self.console + '.JS: PERIODICAL FETCH', self.consoleColor);
                    self.fetch(options);
                }, self.updatePeriod);
                collection && collection.save();
            },
            dataType: self.dataType,
            reset: true
        };
    },

    fetch: function (options) {
        log('%c' + this.console + '.JS: FETCH INIT', 'color:#17a5a5');
        var self = this;

        var thisOptions = {};
        if (options) {
            thisOptions.success = function (collection) {
                (self.options && self.options.success) && self.options.success(collection);
                options.success && options.success(collection);
            };
            thisOptions.error = function () {
                (self.options && self.options.error) && self.options.error();
                options.error && options.error();
            };
            thisOptions.dataType = options.dataType || (self.options && self.options.dataType);
            thisOptions.reset = options.reset || (self.options && self.options.reset);
        } else {
            thisOptions = self.options ;
        }

        return framework.extension.getItem(this.updateFlag, function (timeLastUpdate) {
            if (!timeLastUpdate || (_.now() - timeLastUpdate >= self.updatePeriod)) {
                self.fetchFromServer(thisOptions);
            } else {
                self.fetchFromStorage(thisOptions);
            }
        });
    },

    fetchFromServer: function (options) {
        log('%c' + this.console + '.JS: FETCH FROM SERVER', this.consoleColor, options);
        if (!options) {
            options = this.options;
        }
        return Backbone.Collection.prototype.fetch.apply(this, [options]);
    },

    fetchFromStorage: function (options) { // not necessary to load from storage
        log('%c' + this.console + '.JS: FETCH FROM STORAGE', this.consoleColor);
        if (!options) {
            options = this.options;
        }
        var self = this;
        framework.extension.getItem(this.storageFlag+'_parts', function (numberOfParts) {
           if (numberOfParts > 0) {
               var elements = [];
               for (var i = 1; i <= numberOfParts; i++) {
                   framework.extension.getItem(self.storageFlag+i, function (thisElements) {
                       elements = elements.concat(thisElements);
                       if (elements && _.isString(elements)) {
                           elements = JSON.parse(elements);
                       }
                       if (_.isObject(elements) && elements.length > 0) {
                           self.reset(elements);
                           if (i == numberOfParts) {
                               _.delay(function () {
                                   self.reset(elements);
                               }, 500);
                           }
                           options.success && options.success();
                           return new Promise(function (resolve, reject) {
                               resolve();
                           });
                       }
                   });
               }
           } else {
               framework.extension.getItem(self.storageFlag, function (elements) {
                   if (elements && _.isString(elements)) {
                       elements = JSON.parse(elements);
                   }
                   if (_.isObject(elements) && elements.length > 0) {
                       self.reset(elements);
                       options.success && options.success();
                       return new Promise(function (resolve, reject) {
                           resolve();
                       });
                   } else {
                       log('%c' + self.console + '.JS: FETCH FROM STORAGE FAILED', self.consoleColor);
                       framework.extension.setItem(self.updateFlag, 0);
                       return Backbone.Collection.prototype.fetch.apply(self, [options]);
                   }
               });
           }
        });
    },

    save: function () {
        var thiAttributes = this.toJSON();
        if (thiAttributes.length > 500) {
            var numberOfBlocks = Math.ceil(thiAttributes.length / 500);
            framework.extension.setItem(this.storageFlag+'_parts', numberOfBlocks);
            for (var i = 1; i < numberOfBlocks; i++) {
                framework.extension.setItem(this.storageFlag+i, thiAttributes.slice(500*(i-1), 500*i));
            }
            framework.extension.setItem(this.storageFlag+numberOfBlocks, thiAttributes.slice(500*(numberOfBlocks-1), thiAttributes.length));
        } else {
            framework.extension.setItem(this.storageFlag+'_parts', 0);
            framework.extension.setItem(this.storageFlag, this.toJSON());
        }
    }
});