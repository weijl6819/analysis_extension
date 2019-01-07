
document.addEventListener('DOMContentLoaded',function(){if(localStorage['settingsHistoryLength']!=undefined){document.getElementById('historyLength').value=localStorage['settingsHistoryLength'];}
else{document.getElementById('historyLength').value="15";}
if(localStorage['settingsPluginTopBottom']!=undefined){document.getElementById('pluginTopBottom').value=localStorage['settingsPluginTopBottom'];}
if(localStorage['settingsNewTabSearch']!=undefined){document.getElementById('newTabSearch').value=localStorage['settingsNewTabSearch'];}
if(localStorage['settingsAutoSearchDisplay']!=undefined){document.getElementById('searchAutoComplete').value=localStorage['settingsAutoSearchDisplay'];}
else{document.getElementById('searchAutoComplete').value="On";}
document.getElementById("saveSettingsBtnId").addEventListener('click',function(e,test){localStorage['settingsHistoryLength']=document.getElementById('historyLength').value;localStorage['settingsPluginTopBottom']=document.getElementById('pluginTopBottom').value;localStorage['settingsNewTabSearch']=document.getElementById('newTabSearch').value;localStorage['settingsAutoSearchDisplay']=document.getElementById('searchAutoComplete').value;e.view.close();});});