if (window == chrome.extension.getBackgroundPage()) {

	(function(){

		var Gamp = function(){

			var self = this;

			const GAMP_URL = "https://www.google-analytics.com/collect";   
			const GAMP_CID_URL = "http://fvdmedia.com/daily-coin-feed/intr/id.php";   
			const GAMP_ID = "UA-67774717-25";   
			const GAMP_APP_NAME = "chrome_coin_feed";   
			const GAMP_CATEGORY = "app";   
			const GAMP_EVENT_INSTALL = "install";   
			const GAMP_EVENT_RUN = "run";   
			const GAMP_EVENT_UNINSTALL = "uninstall";   
			const GAMP_EVENT_PAGEVIEW = "pageview";   

			const INTERVAL_TO_DISPLAY = 12 * 3600 * 1000; // 1/2 days
			const INTERVAL_TO_TIMER = 3600 * 1000; // 1 hour


			// ===============================================================
			// при установке
			this.install = function( event ){

				gamp('send', 'event', GAMP_CATEGORY, GAMP_EVENT_INSTALL);

			}
			// ===============================================================
			this.uninstall = function( event ){

				gamp('send', 'event', GAMP_CATEGORY, GAMP_EVENT_UNINSTALL);

			}
			// ===============================================================
			// проверит активен ли аддон
			this.run = function( event ){

				set();

				setInterval(function(){  
				
					set();
					
				}, INTERVAL_TO_TIMER);
			}
			// ===============================================================
			this.pageview = function( event ){

				gamp('send', 'event', GAMP_CATEGORY, GAMP_EVENT_PAGEVIEW);

			}

			// ------------------------------------------------
			function set() {
				var now = new Date().getTime();
				if( now - coinFeed.Prefs.get( "cf.gamp.check" ) > INTERVAL_TO_DISPLAY )		{
					coinFeed.Prefs.set( "cf.gamp.check", now );

					gamp('send', 'event', GAMP_CATEGORY, GAMP_EVENT_RUN);
				}	
			}

			// ------------------------------------------------
			function gamp(send, type, category, action, label, value){

			    var message = {
			            send : send || "",
			            type : type || "",
			            label : label || "",
			            value : value || "",
			            action : action || "",
			            category : category || "category",
			            title : document.title,
			            clientWidth : document.body.clientWidth,
			            clientHeight : document.body.clientHeight,
			            pathname: "/"+String(document.location.pathname).split("/").pop().split("\\").pop().split(".").shift(),
					    };

			    gampBackend(message);
			    
			};

			// ------------------------------------------------
			function gampBackend(data){

				getCidGA( function( cid ){

					console.log(cid);

				    var param = {
				        "v"     : 1,
				        "tid"   : GAMP_ID,
				        "cid"   : cid,
				        "ul"    : String(navigator.language).toLocaleLowerCase(),
				        "t"     : data.type,
				        "ec"    : data.category,
				        "ea"    : data.action
				    }
				    if(data.label) param["el"] = data.label;

					//console.info("gampBackend", param);

				    coinFeed.Utils.postAJAX( GAMP_URL, param, function(e){	   });

				})

			}

			// ------------------------------------------------
			function getCidGA( callback ){
			    var cid = localStorage.getItem("ga-unique-cid");
			    if(!cid){
			        createCidGA( callback );
			    }
			    else {
			    	callback(cid)
			    }
			}

			// ------------------------------------------------
			function createCidGA( callback ){

				coinFeed.Utils.getAJAX( GAMP_CID_URL, null, function(cont){	   

					var info = JSON.parse(cont);

					localStorage.setItem("ga-unique-cid", info.cid);

					callback( info.cid );

				});

			}

		}

		this.Gamp = new Gamp();

	}).apply(coinFeed);

}
else
{
	coinFeed.Gamp = chrome.extension.getBackgroundPage().coinFeed.Gamp;
}

