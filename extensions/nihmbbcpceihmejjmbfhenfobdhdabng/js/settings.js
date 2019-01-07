var vm = new Vue({
    el: '#wrapper',

    data: {
        clean_options:[
            {"key":"appcache","label":"appcache - Clean websites' appcache data"},
            {"key":"cache","label":"cache - Clean the browser's cache"},
            {"key":"cookies","label":"cookies - Clean the browser's cookies modified within a particular timeframe"},
            {"key":"downloads","label":"downloads - Clean the browser's list of downloaded files(not the downloaded files themselves)"},
            {"key":"fileSystems","label":"fileSystems - Clean websites' file system data"},
            {"key":"formData","label":"formData - Clean the browser's stored form data (autofill)"},
            {"key":"history","label":"history - Clean the browser's history"},
            {"key":"indexedDB","label":"indexedDB - Clean websites' IndexedDB data"},
            {"key":"localStorage","label":"localStorage - Clean websites' local storage data"},
            {"key":"passwords","label":"passwords - Clean the browser's stored passwords"},
            {"key":"webSQL","label":"webSQL - Clean websites' WebSQL data"},
        ],

        data_type_set: {
            "appcache": false,
            "cache": false,
            "cookies": false,
            "downloads": false,
            "fileSystems": false,
            "formData": false,
            "history": false,
            "indexedDB": false,
            "localStorage": false,
            "serverBoundCertificates": false,
            "pluginData": false,
            "passwords": false,
            "webSQL": false
        },
   
        selected_clean: ["appcache", "cache", "downloads", "fileSystems", "formData", "history"],

        save_options:[
            {"key":"viewed","label":"Do not close tab when it is viewed"},
            {"key":"pinned","label":"Do not close pinned tabs"},
            {"key":"unsaved","label":"Do not close tabs that contain unsaved form inputs"},
            {"key":"playing","label":"Do not close tabs that are playing audio"},
            {"key":"internet","label":"Only auto-close if connected to the internet"},
            {"key":"onbattery","label":"Only auto-close if running on battery"},
        ],

        selected_save: ["viewed", "pinned", "unsaved", "playing"],

        block_options:[
            {"key":"youtube","label":"YouTube ads"},
            {"key":"facebook","label":"Facebook ads"},
            {"key":"popads","label":"Pop ads"},
            {"key":"webads","label":"Web ads"},
            {"key":"textads","label":"Text Link ads"},
            {"key":"floatingads","label":"Floating ads"},
        ],

        selected_block: ["youtube", "facebook", "popads", "webads"],
        clean_stats: 0,
        save_stats: 0,
        block_stats: 0,
    },

    ready: function() {
        this.getSettings();
    },

    methods:{
        getSettings:function() {
            getStorage(Ext.col.SETTINGS, function callback(retval){
                if(!retval) retval = [];
                var selected_save = retval['save'] || [];
                var selected_clean = retval['clean'] || [];
                var selected_block = retval['block'] || [];
                if(selected_save.length > 0)
                    vm.$set('selected_save', selected_save);
                if(selected_clean.length > 0)
                    vm.$set('selected_clean', selected_clean);
                if(selected_block.length > 0)
                    vm.$set('selected_block', selected_block);
            });
        },

        select_all: function() {
            for (var i = 0; i < this.clean_options.length; i++) {
                this.selected_clean.push(this.clean_options[i].key);
            };
        },

        unselect_all: function() {
            this.selected_clean = [];
        },

        do_clean: function() {
            this.clean_stats = 1;
            for (var i = 0; i < this.selected_clean.length; i++) {
                this.data_type_set[this.selected_clean[i]] = true;
            };
            var settings;
            var selected_clean = this.selected_clean;
            chrome.storage.local.get(Ext.col.SETTINGS, function(result){
                settings = result.SETTINGS || {};
                settings['clean'] = selected_clean;
                chrome.storage.local.set({'SETTINGS': settings});
                
            });
            chrome.browsingData.remove({},this.data_type_set,function callback(){
                vm.$set('clean_stats', 2);
            });
        },

        save_save: function() {
            var selected_save = this.selected_save;
            var settings;
            chrome.storage.local.get(Ext.col.SETTINGS, function(result){
                settings = result.SETTINGS || {};
                settings['save'] = selected_save;
                chrome.storage.local.set({'SETTINGS': settings});
                vm.$set('save_stats', 1);
            });
        },

        save_block: function() {
            var selected_block = this.selected_block;
            var settings;
            chrome.storage.local.get(Ext.col.SETTINGS, function(result){
                settings = result.SETTINGS || {};
                settings['block'] = selected_block;
                chrome.storage.local.set({'SETTINGS': settings});
                vm.$set('block_stats', 1);
            });
        },
    }
});

function getStorage(key, callback) {
    chrome.storage.local.get(key, function(retval){
        if(callback) callback(retval[key]);
    });
};