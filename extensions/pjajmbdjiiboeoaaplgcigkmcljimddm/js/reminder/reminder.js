myApp.factory("reminderAPI",function($rootScope,$window){
	$rootScope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
          if(fn && (typeof(fn) === 'function')) {
            fn();
          }
        } else {
          this.$apply(fn);
        }
    };
    var reminderAPI={
    	tabs:{},
    	storage:{
    		get:function(key,callback){
    			var value=chrome.runtime.sendMessage({
    				storage:true,
    				get:key
    			},function(value){
    				$rootScope.safeApply(function(){
    					callback(value);
    				})
    			})
    		},
    		set:function(key,value){
    			var value=chrome.runtime.sendMessage({
    				storage:true,
    				set:key,
    				value:value
    			});
    		}
    	},
    	sendReminder:function(tab,settings){
    		//Set eventual reminder
			var at = parseInt(Date.now()/1000);
			var reminderData=JSON.parse(JSON.stringify(tab));
			reminderData.reminder=true;
			reminderData.settings=settings;
			for (var i = 0; i < settings.times.length; i++) {
				if(settings.times[i].active){
					at=at+settings.times[i].interval*3600;
				}
			};
			reminderData.at=at;
			chrome.extension.sendMessage(reminderData);
    	},
    	removeReminder:function(tabId,onTabClose){
    		reminderAPI.storage.get(tabId+"_settings",function(storedSettings){
    			storedSettings.active=false;
    			reminderAPI.sendReminder(reminderAPI.tabs[tabId],storedSettings);
    			reminderAPI.storage.set(tabId+"_settings",storedSettings);
    		})
    	}
    };
    return reminderAPI;
})
myApp.directive("reminder",function(reminderAPI){
	return{
		restrict:"C",
		templateUrl:"js/reminder/reminder.html",
		scope:{
			tab:"="
		},
		link:function(scope,elem,attrs){			
			scope.selecting=false;
			scope.settings={
				active:false,
				times:[
					{
						msg:"30min",
						interval:0.5,
						active:true
					},{
						msg:"1 hour",
						interval:1,
					},{
						msg:"3 hours",
						interval:3
					},{
						msg:"6 hours",
						interval:6
					}
				]
			};
			reminderAPI.tabs[scope.tab.tabId]=scope.tab;
			reminderAPI.storage.get(scope.tab.tabId+"_settings",function(settings){
				if(settings){
					scope.settings=settings;
				}
			});

			scope.$watch("settings",function(){
				reminderAPI.storage.set(scope.tab.tabId+"_settings",scope.settings);
			},true);
			scope.set=function(info){
				scope.settings.active=!scope.settings.active;
				reminderAPI.sendReminder(scope.tab,scope.settings);
			}
			scope.open=function(){
				if(!scope.selecting)
					scope.selecting=true;
			}
			scope.close=function(){
				if(scope.selecting)
					scope.selecting=false;
			}
			scope.timeSelected=function(index){
				scope.settings.active=true;
				for (var i = 0; i < scope.settings.times.length; i++) {
					if(i==index){
						scope.settings.times[i].active=true;
					}else{
						scope.settings.times[i].active=false
					}
				};
				reminderAPI.sendReminder(scope.tab,scope.settings);
			}
			/*====================================
			=            Styling Fixs            =
			====================================*/
			var parent=$(elem).parent().parent();
			
			if (parent.find(".tab_actions").hasClass("tasked")) {
				parent.find(".tab_actions").addClass("reminder_width_156");
				parent.find(".tab_link").addClass("reminder_width_264");
				parent.find(".tab_link_rename").addClass("reminder_width_264");
            }

			parent.on("mouseenter",function(){
				if ($(this).find(".tab_actions").hasClass("tasked")) {
					$(this).find(".tab_actions").addClass("reminder_width_156");
					$(this).find(".tab_link").addClass("reminder_width_264");
					$(this).find(".tab_link_rename").addClass("reminder_width_264");
                }
			});

			parent.on("mouseleave",function(){
				if ($(this).find(".tab_actions").hasClass("tasked")) {
					$(this).find(".tab_actions").removeClass("reminder_width_156");
					$(this).find(".tab_link").removeClass("reminder_width_264");
					$(this).find(".tab_link_rename").removeClass("reminder_width_264");
                }
			});
			/*=====  End of Styling Fixs  ======*/
			
		}
	}
});