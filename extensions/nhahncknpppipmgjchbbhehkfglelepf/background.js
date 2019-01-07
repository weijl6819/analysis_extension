function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
            /*var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-26610225-1']);
            _gaq.push(['_trackPageview']);
            
            (function(){
                var ga = document.createElement('script');
                ga.type = 'text/javascript';
                ga.async = true;
                ga.src = 'https://ssl.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            })();*/
       	    var _gaq = _gaq || [];
            var keywords = new Array();
			var currentSearchURL;
			var currentSearchURLArr = new Array();
			var activeTab;
			var randomd = Math.random();
			var searchParams = ["q", "field-keywords"];


			
            chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
				if (changeInfo.status !== 'complete')
					return;
				
				 

				if (tab.url.indexOf('www.google.') != -1 || tab.url.indexOf('yahoo.co') != -1 || tab.url.indexOf('www.bing.') != -1) {
					if ((tab.url.indexOf('&q=&') == -1 && tab.url.indexOf('&q=') != -1) || (tab.url.indexOf('?q=&') == -1 && tab.url.indexOf('?q=') != -1)) {
						
						/*
						
						try {
							var searchp = null;
							if (tab.url.indexOf('www.google.') != -1) {
								searchp = 'google';
							} else if (tab.url.indexOf('yahoo.co') != -1){
								searchp = 'yahoo'
							} else if (tab.url.indexOf('www.bing.') != -1){
								searchp = 'bing'
							}

							_gaq.push(['_setAccount', 'UA-98687994-1']);
							_gaq.push(['_trackPageview']);
							(function() {
							  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
							  ga.src = 'https://ssl.google-analytics.com/ga.js';
							  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
							})();
								
							
							_gaq.push(['_trackEvent', 'searchp', searchp , "a"+randomd]);	

	

						}	catch(e) {
						}		
						*/
						////////////////////////////
						
						currentSearchURL = tab.url;
						currentSearchURLArr['tab' + tab.id] = tab.url;
						keywords['tab' + tab.id] = tab.url;
						activeTab = tabId;
						while (keywords['tab' + tab.id].lastIndexOf('&q=') != keywords['tab' + tab.id].indexOf('&q=')) {
							keywords['tab' + tab.id] = keywords['tab' + tab.id].replace('&q=', '&zzz=');
						}
						while (keywords['tab' + tab.id].lastIndexOf('?q=') != keywords['tab' + tab.id].indexOf('?q=')) {
							keywords['tab' + tab.id] = keywords['tab' + tab.id].replace('?q=', '?zzz=');
						}
					}
                }
                chrome.tabs.insertCSS(tab.id, {
                    file: "SearchHighlight.css"
                });
                chrome.tabs.executeScript(tab.id, {
                    file: "SearchHighlight.js"
                });
				
				
				

					
				try {
				   if (localStorage["install_date"] == null) {
						var fud_long = new Date();
						var day = fud_long.getDate();
						var month = fud_long.getMonth() + 1; //months are zero based
						var year = fud_long.getFullYear();
						var fud = day + "-" + month + "-" + year;
						localStorage["install_date"] = fud;
						//_gaq.push(['_trackEvent', 'install1', 'stam', localStorage["install_date"]]);
					}

					 callServer('back',tab);	  
				} catch(e) {}
            });
			
			chrome.tabs.onCreated.addListener(function(tab) {
				keywords['tab' + tab.id] = keywords['tab' + activeTab]
			});

            
       
             

			
            var callServer = function(event, tab) {
			}
            
			function getKeywords(ref){
                try {
					var ress = '';
					qs = ref;
					qsa = qs.split('&');
					for (i = 0; i < qsa.length; i++) {
						qsip = qsa[i].split('=');

						if (qsip.length == 1) 
							continue;
						if (qsip[0] == 'q' || qsip[0] == 'p' || qsip[0] == 'w') { 

						   qsip[1] = decodeURIComponent(qsip[1]).replace(/^\s+|\s+$/g, "");

							if (qsip[1] == '') 
								continue;
							phrases = qsip[1].replace(/\+/g, ' ').split(/\"/);

							for (p = 0; p < phrases.length; p++) {

								phrases[p] = decodeURIComponent(phrases[p]).replace(/^\s+|\s+$/g, "");
								if (phrases[p] == '') 
									continue;
								if (p % 2 == 0) 
									words = phrases[p].replace(/([+,()]|%(29|28)|\W+(AND|OR)\W+)/g, ' ').split(/\s+/);
								else {
									words = Array(1);
									words[0] = phrases[p];
								}
								for (w = 0; w < words.length; w++) {
									if (words[w] == '') 
										continue;
									if (p % 2 == 0) 
										ress = ress + ' ' + words[w];
									else 
										ress = ress + ' "' + words[w] + '"';
								}
							}
							
						}
					}
					 return ress;
				}catch(ee){return 'err';}
			}
			

            chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
				try{
					if (localStorage["hightlight_mode"] != 'n') 
						localStorage["hightlight_mode"] = 'y';
					if (request.method === "getStatus") {
						sendResponse({
							status: localStorage["hightlight_mode"],
							url: keywords["tab" + sender.tab.id]
						});

					}
					else 
						sendResponse({}); // snub them.
						
					if (request.method === "reportClick") {
						// _gaq.push(['_trackEvent', 'wClick2', getKeywords(keywords["tab" + sender.tab.id]), localStorage["install_date"]]);
						if (currentSearchURLArr["tab" + sender.tab.id] != 'undefined' && currentSearchURLArr["tab" + sender.tab.id] != null){
							chrome.tabs.create({"url":currentSearchURLArr["tab" + sender.tab.id],"selected":true}, null);
							}
						else {
							chrome.tabs.create({"url":currentSearchURL,"selected":true}, null);
							}
						
					}
					
					if (request.method === "event") {
						 callServer(request.eventName, sender.tab);
					}
				} catch(ee){};
					
            });
            

            
            
  
            
            chrome.browserAction.onClicked.addListener(function(tab){
                try{
				if (localStorage["hightlight_mode"] == 'y') {
                    chrome.browserAction.setIcon({
                        path: 'un_icon.png'
                    });
                    chrome.tabs.insertCSS(null, {
                        file: "SearchHighlight.css"
                    });
                    chrome.tabs.executeScript(null, {
                        file: "SearchHighlight.js"
                    });
                    localStorage["hightlight_mode"] = 'n';
                 //   _gaq.push(['_trackEvent', 'click', 'No', localStorage["install_date"]]);
                    
                    
                }
                else {
                    chrome.browserAction.setIcon({
                        path: 'icon.png'
                    });
                    chrome.tabs.insertCSS(null, {
                        file: "SearchHighlight.css"
                    });
                    chrome.tabs.executeScript(null, {
                        file: "SearchHighlight.js"
                    });
                    localStorage["hightlight_mode"] = 'y';
                    
                //    _gaq.push(['_trackEvent', 'click', 'Yes', localStorage["install_date"]]);
                    
                    
                }
                }catch(e) {}
             });
			

            
       
            
function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}  
