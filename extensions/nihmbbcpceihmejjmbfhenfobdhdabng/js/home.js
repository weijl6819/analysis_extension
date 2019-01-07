var vm = new Vue({
    el: '#wrapper',

    data: {
        tab_groups: {},
        total_tabs: 0,
        mem_use: '9%',
        cpu_use: '9%',
        memory: 0,
    },

    ready: function() {
        this.getHistory();
    },

    methods:{
        getHistory:function() {
            var total_groups = Ext.getStorageRaw(Ext.col.TAB_GROUPS) || {};
            this.tab_groups = total_groups;
            if (total_groups) {
                var hm = total_groups['hm'] || [];
                var arr_null_index = [];
                for(var i = 0; i < hm.length ; i++){
                    // 标记空数组索引
                    if (hm[i].tabs.length == 0)
                        arr_null_index.push(i);
                    else
                        this.total_tabs += hm[i].tabs.length;
                }
                // 清理空数组
                if(arr_null_index.length > 0) {
                    var new_hm = [];
                    for (var j = 0; j < hm.length; j++) {
                        if(arr_null_index.indexOf(j) == -1){
                            new_hm.push(hm[j]);
                        }
                    };

                    total_groups['hm'] = new_hm;
                    Ext.setStorageRaw(Ext.col.TAB_GROUPS, total_groups);
                }
                
                var tmp = total_groups['auto'] || {};
                var auto = tmp['tabs'] || [];
                this.total_tabs += auto.length;
            };
            
            this.calc_mem_use();
            this.calc_cpu_use();
            this.getMemory();
        },

        date_sort: function(a, b) {
            return b.created_at - a.created_at;
        },

        reload:function(){
            location.reload();
        },

        remove_hm_tab: function(c_date) {
            var tab_groups = Ext.getStorageRaw(Ext.col.TAB_GROUPS) || {};
                groups = tab_groups['hm'] || [];
            for(var i = 0; i < groups.length ; i++){
                if(groups[i].created_at == c_date){
                    groups.splice(i, 1);
                    Ext.setStorageRaw(Ext.col.TAB_GROUPS, tab_groups);
                    this.reload();
                    return;
                }
            }
        },
        recover_hm_tab:function(c_date) {
            var tab_groups = Ext.getStorageRaw(Ext.col.TAB_GROUPS) || {};
            var groups = tab_groups['hm'] || [];
            for(var i = 0; i < groups.length ; i++){
                if(groups[i].created_at == c_date){
                    var tabs = groups[i].tabs;
                    
                    for(var j=0; j<tabs.length; j++) {
                        // 重新打开连接
                        chrome.tabs.create({ url: tabs[j].url });
                    }
                    groups.splice(i, 1);
                    Ext.setStorageRaw(Ext.col.TAB_GROUPS, tab_groups);
                    this.reload();
                    return;
                }
            }
        },
        auto_tab:function(type) {
            var tab_groups = Ext.getStorageRaw(Ext.col.TAB_GROUPS) || {};
                groups = tab_groups['auto'] || {};
                tabs = groups['tabs'] || [];
            //recover
            if( type==1 ) {
                for(var j=0; j<tabs.length; j++) {
                    // 重新打开连接
                    chrome.tabs.create({ url: tabs[j].url });
                }
            }
            tab_groups['auto'] = {};
            Ext.setStorageRaw(Ext.col.TAB_GROUPS, tab_groups);
            this.reload();
        },
        
        calc_mem_use: function() {
            calc_mem_ratio();
        },

        calc_cpu_use: function() {
            calc_cpu_ratio();
        },

        parseDate: function(stamp) {
            return new Date(stamp).toLocaleString();
        },

        format_img: function(url) {
            return url || '../images/icon.png';
        },

        open_hm_tab: function(type,a,b){
            var groups = Ext.getStorageRaw(Ext.col.TAB_GROUPS) || {};
            var tab_groups = groups['hm'] || [];
            for(var i = 0; i < tab_groups.length ; i++){
                if(tab_groups[i].created_at == a){
                    var tabs = tab_groups[i].tabs;
                    if(type == 0)
                        chrome.tabs.create({ url: tabs[b].url });
                    tabs.splice(b, 1);
                    if(tabs.length == 0)
                        tab_groups.splice(i, 1);
                    Ext.setStorageRaw(Ext.col.TAB_GROUPS, groups);
                    this.reload();
                    return;
                }
            }
        },
        open_auto_tab: function(type,url, created_at){
            var groups = Ext.getStorageRaw(Ext.col.TAB_GROUPS) || {};
            var tab_groups = groups['auto'] || {};
                tabs = tab_groups['tabs'] || [];
            for (var i = tabs.length - 1; i >= 0; i--) {
                if(tabs[i].created_at == created_at && tabs[i].url == url){
                    tabs.splice(i, 1);
                    Ext.setStorageRaw(Ext.col.TAB_GROUPS, groups);
                    this.reload();
                    if(type == 0)
                        chrome.tabs.create({ url: url });
                    return;
                }
            };
        },
        getMemory: function(){
            chrome.system.memory.getInfo(function callback(info){
                vm.$set("memory", parseInt(info.capacity));
            });
        },
        calc_speed: function(tabs){
            var speed = Number(tabs) * 220 * 1024 * 1024 / this.memory * 100 / 3;
            speed = speed.toFixed(2);
            speed = speed >= 80 ? 'more than 80' : speed;
            return speed+"%"
        },
        showIcon: function(event) {
            $(event.target).find(".zf-small-icon").show();
        },
        hideIcon: function(event) {
            $(event.target).find(".zf-small-icon").hide();
        },
        average_speed: function(){
            var speed = calc_average_speed(this.memory);
            speed = isNaN(speed) ? 0 : speed.toFixed(0);
            speed = speed >= 80 ? ' more than 80' : speed;
            return speed+"%"
        }
    }
});