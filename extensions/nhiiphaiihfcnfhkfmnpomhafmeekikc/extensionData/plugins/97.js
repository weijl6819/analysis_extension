
(function(){if(typeof jQuery!=="function"||typeof jQuery.fn.bindExtensionEvent!=="function"||typeof jQuery.fn.fireExtensionEvent!=="function"){return;}var a=function(f,e,c){var b=[];var d={};if(typeof f==="number"){b.push(e);if(typeof c!=="undefined"){b.push(c);}d.callbackId=f;d.params=b;jQuery("body").fireExtensionEvent("__activateCallback__",d);}};jQuery("body").bindExtensionEvent("__activateAppApi__",function(g,f){var b=[];var d={};switch(f.funcName){case"appAPI.db.async.set":if(typeof f.params[2]==="string"){f.params[2]=new Date(f.params[2]);}appAPI.db.async.set(f.params[0],f.params[1],f.params[2],function(e){a(f.callbackId,e);});break;case"appAPI.db.async.get":appAPI.db.async.get(f.params[0],function(e){a(f.callbackId,e);});break;case"appAPI.db.async.getExpiration":appAPI.db.async.getExpiration(f.params[0],function(e){if(typeof e==="object"){e=e.toString();}a(f.callbackId,e);});break;case"appAPI.db.async.getList":appAPI.db.async.getList(function(e){a(f.callbackId,e);});break;case"appAPI.db.async.getKeys":appAPI.db.async.getKeys(function(e){a(f.callbackId,e);});break;case"appAPI.db.async.remove":appAPI.db.async.remove(f.params[0],function(e){a(f.callbackId,e);});break;case"appAPI.db.async.removeAll":appAPI.db.async.removeAll(function(e){a(f.callbackId,e);});break;case"appAPI.db.async.setFromRemote":if(typeof f.params[2]==="string"){f.params[2]=new Date(f.params[2]);}appAPI.db.async.setFromRemote(f.params[0],f.params[1],f.params[2],function(e){a(f.success,e);},function(e){a(f.fail,e);});break;case"appAPI.db.async.updateExpiration":if(typeof f.params[1]==="string"){f.params[1]=new Date(f.params[1]);}appAPI.db.async.updateExpiration(f.params[0],f.params[1],function(e){a(f.callbackId,e);});break;case"appAPI.message.addListener":f.params.push(function(e){a(f.callbackId,e);});appAPI.message.addListener.apply(null,f.params);break;case"appAPI.message.removeListener":appAPI.message.removeListener(f.params[0]);break;case"appAPI.message.toActiveTab":appAPI.message.toActiveTab(f.params[0],f.params[1]);break;case"appAPI.message.toAllTabs":appAPI.message.toAllTabs(f.params[0],f.params[1]);break;case"appAPI.message.toAllOtherTabs":appAPI.message.toAllOtherTabs(f.params[0],f.params[1]);break;case"appAPI.message.toBackground":appAPI.message.toBackground(f.params[0],f.params[1]);break;case"appAPI.message.toPopup":appAPI.message.toPopup(f.params[0],f.params[1]);break;case"appAPI.message.toCurrentTabWindow":appAPI.message.toCurrentTabWindow(f.params[0],f.params[1]);break;case"appAPI.message.toCurrentTabIframes":appAPI.message.toCurrentTabIframes(f.params[0],f.params[1]);break;case"appAPI.request.get":var c=f.params[0];appAPI.request.get({url:c.url,additionalRequestHeaders:c.additionalRequestHeaders,onSuccess:function(e,h){a(f.success,e,h);},onFailure:function(e){a(f.fail,e);}});break;case"appAPI.request.post":var c=f.params[0];appAPI.request.post({url:c.url,additionalRequestHeaders:c.additionalRequestHeaders,postData:c.postData,contentType:c.contentType,onSuccess:function(e,h){a(f.success,e,h);},onFailure:function(e){a(f.fail,e);}});break;}});jQuery("body").fireExtensionEvent("__activateCrossriderMain__",{});})();
