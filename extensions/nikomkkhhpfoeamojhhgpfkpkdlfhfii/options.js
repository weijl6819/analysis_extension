$(function() {
   // defaults
   if(!localStorage["tabsBehaviour"]) localStorage["tabsBehaviour"] = "default";
   if(!localStorage["tabsActivate"]) localStorage["tabsActivate"] = "last_used";
   if(!localStorage["tabsOpenMethod"]) localStorage["tabsOpenMethod"] = "default";
   if(localStorage["useIcon"] != "no") localStorage["useIcon"] = "yes";
   if(localStorage["useContextMenuIcon"] != "yes") localStorage["useContextMenuIcon"] = "no";

   // restore options
   $("#tabsBehaviour").val(localStorage["tabsBehaviour"]);
   $("#tabsActivate").val(localStorage["tabsActivate"]);
   $("#tabsOpenMethod").val(localStorage["tabsOpenMethod"]);
   $("#useIcon").val(localStorage["useIcon"]);
   $("#useContextMenuIcon").val(localStorage["useContextMenuIcon"]);

   // events
   $("#tabsBehaviour").on("change", function() { localStorage["tabsBehaviour"] = $("#tabsBehaviour").val(); });
   $("#tabsActivate").on("change", function() { localStorage["tabsActivate"] = $("#tabsActivate").val(); });
   $("#tabsOpenMethod").on("change", function() { localStorage["tabsOpenMethod"] = $("#tabsOpenMethod").val(); });

   $("#useIcon").on("change", function() {
      localStorage["useIcon"] = $("#useIcon").val();
      var bgPage = chrome.extension.getBackgroundPage();
      chrome.tabs.getAllInWindow(null, function(tabs) {
         for(var i=0; i<tabs.length; i++) {
            bgPage.showIcon(tabs[i].id);
         }
      });
   });

   $("#useContextMenuIcon").on("change", function() {
      localStorage["useContextMenuIcon"] = $("#useContextMenuIcon").val();
      var bgPage = chrome.extension.getBackgroundPage();
      bgPage.createContextMenu($("#useContextMenuIcon").val());
   });
});
