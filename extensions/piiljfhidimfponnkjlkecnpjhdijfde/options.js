
/*------------------------------------------------
G-calize : options.js
Thank you using the Extension
Copyright(C)YoWauke.AllRightsReserved.
https://plus.google.com/104819699346433230202/
--------------------------------------------------
[じーからいず]って読むの。ゆたしくうにげーさびら。
------------------------------------------------*/

var trace = (function(){ if(window.console && console.log){ return console.log.bind(console); }})();
var Gcalize = Gcalize || {};

$(function(){

	//Extension
	var extDetail = chrome.app.getDetails() || chrome.runtime.getManifest();
	var manifest_ver = extDetail.version;
	//trace(manifest_ver);
	$('#ver').text("Version: "+manifest_ver+"");
	$("#version").val(manifest_ver);

	//Gcalize
	var BG = chrome.extension.getBackgroundPage();
	Gcalize = BG.Gcalize;
	var config = Gcalize.Storage.get("config");
	var holidays = Gcalize.Storage.get("holidays");
	//trace(config);
	//trace(holidays);
	WAU.UTIL.setVals(config);
	WAU.UTIL.setVals(holidays);

	WAU.DOM.init();

	//i18n
	_i18n();

	//init
	_init_Tab(0);
	_init_ToggleSwich();

	//WAU: form
	$("input[type='color']").form_color();
	$("input[type='range']").form_range();
	$("select").form_select();
	$("input[type=text][wau*='type:number']").form_wau_number();

	var reloadTab = function(){
		chrome.runtime.sendMessage({"method":"GCALIZE_reload"}, function(response){
			return true;
		});
	};

	var flg_stop = true;
	//save1
	$("#save1").on("click", function(){
		if(!flg_stop){ return; }
		flg_stop = false;
		var params = WAU.UTIL.query2param($("#form1").serializeArray());
		Gcalize.Storage.save('config', params);
		WAU.UTIL.ShowLoading(act_save, function(){
			flg_stop = true;
		});
		reloadTab();
	});
	//save2
	$("#save2").on("click", function(){
		if(!flg_stop){ return; }
		flg_stop = false;
		var params = WAU.UTIL.query2param($("#form2").serializeArray());
		Gcalize.Storage.save('holidays', params);
		WAU.UTIL.ShowLoading(act_save, function(){
			flg_stop = true;
		});
		reloadTab();
	});
	//reset
	$("#resetZ").on("click", function(){
		if(!flg_stop){ return; }
		flg_stop = false;
		if( window.confirm(act_cfrm) ){
			_flg_stop = false;
			Gcalize.Storage.resetAll();
			config = Gcalize.Storage.get("config");
			holidays = Gcalize.Storage.get("holidays");
			WAU.UTIL.setVals(config);
			WAU.UTIL.setVals(holidays);
			WAU.UTIL.ShowLoading(act_reset, function(){
				flg_stop = true;
			});
			reloadTab();
		}
	});
});

/*-------------------------------------------
▼init
-------------------------------------------*/
var _init_Tab = function(_idx){
	var idx = _idx || 0;
	var navs  = $("#hdr_tab").children("li");
	var conts = $("#wrapper > .cont");
	navs.removeClass("_on").eq(idx).addClass("active");
	conts.hide().eq(idx).show();
	navs.on("click", function(){
		var _idx = $(this).index();
		if(_idx != idx){
			idx = _idx;
			navs.removeClass("active").eq(idx).addClass("active");
			conts.hide().eq(idx).show();
		}
	});
};
var _init_ToggleSwich = function(){
	//Enable color
	var val = 0;
	var ipts_Today = $("#c_tx_tdy,#c_bg_tdy");
	$("input[name='flg_tdyU']").on("change", function(){
		val = +[$(this).val()] || 0;
		if(val == 1){
			ipts_Today.removeAttr("readonly").trigger("change");
		}else{
			ipts_Today.attr("readonly", "readonly").trigger("change");
		}
	}).trigger("change");
	var ipts_Holiday = $("#c_tx_h,#c_bg_h");
	$("input[name='flg_hld']").on("change", function(){
		val = +[$(this).val()] || 0;
		if( val == 1){
			ipts_Holiday.removeAttr("readonly").trigger("change");
		}else{
			ipts_Holiday.attr("readonly", "readonly").trigger("change");
		}
	}).trigger("change");
};





/*-------------------------------------------
▼tab::2
-------------------------------------------*/
;(function($, window, document, undefined){
	"use strict";
	var _WAU = WAU || {};
	var JFK = null;

	//selector
	var SELECT_HLD,
		BTN_PLEASEOPENGCAL,
		BTN_CALIDSELECT,
		ICON_LOADING,
		INPUT_CALID,
		BTN_REIMPORT,
		hld_name,
		hld_cid,
		hld_info,
		hld_data,
		hld_saved,
		HOGE = null;

	var tabID_hits  = [];
	var tabID_GC    = -1;
	var find_loop_count = 0;
	var flg_Found = false;

	var FindGcalTab_LOOP = function(){
		BTN_PLEASEOPENGCAL.hide();
		ICON_LOADING.removeClass("_off");
		JFK.show();
		trace("...Serch the Google Calendar's Tab [TryCount:"+find_loop_count+"]");
		var t = setTimeout(function(){
			FindGcalTab().done(FoundGcal).fail(notFound);
		}, 500);
	};

	var FoundGcal = function(_tabid){
		BTN_PLEASEOPENGCAL.hide();
		ICON_LOADING.addClass("_off");
		JFK.hide();
		tabID_GC = _tabid;
		flg_Found = true;
		//Connect START!
		chrome.tabs.sendMessage(tabID_GC, {"method": "GCALIZE_getHolidayList"}, function(response){
			// trace(response);
			if(response && response.flg){
				// OLD: ver->1.1.8
				// var json = JSON.parse(response.responseText.replace("while(1);", "").replace(/\'/g, "\""));
				// OLD: ver->1.3.x
				// var json = JSON.parse(response.responseText.replace(")]}'", "").replace(/\'/g, "\""));
				var json = JSON.parse(response.responseText.replace(")]}'\n", ""));
				if(json && json.length>0 ){
					SELECT_HLD.find("option._add").remove();
					SELECT_HLD.find("option:first").attr('selected','selected').trigger("change");
					for(var i=0;i<json.length;i++){
						if(json[i].did && json[i].title){
							SELECT_HLD.append("<option value='"+(json[i].did)+"' class='_add'>"+(json[i].title)+"</option>");
						}
					}
					SELECT_HLD.removeAttr("disabled").trigger("change");
				}else{
					alert("Can not connect Google Server.[#2]");
				}
			}else{
				alert("Can not connect Google Server.[#3]");
			}
		});
	};
	var notFound = function(){
		//trace(">>fail");
		find_loop_count++;
		if(find_loop_count>4){
			trace(">>Can not found Tab. so Please Open.");
			BTN_PLEASEOPENGCAL.show();
			ICON_LOADING.addClass("_off");
			JFK.hide();
			flg_Found = false;
			return;
		}else{
			FindGcalTab_LOOP();
		};
	};

	var FindGcalTab = function(){
		//trace(">>FindGcalTab");
		var cb = new _WAU.UTIL.Callbacks();
		chrome.windows.getAll({populate: true}, function(windows){
			for(var w=0;w<windows.length;w++){
				for(var i=0;i<windows[w].tabs.length;i++){
					var tab = windows[w].tabs[i];
					//var f = tab.url.indexOf("www.google.com/calendar/render");
					var f = tab.url.indexOf("google.com/calendar");
					if(f != -1 && tab.status == 'complete'){
						cb.doneCallback(tab.id);
						return cb;
					}
				}
			}
			cb.failCallback(null);
			return cb;
		});
		return cb;
	};

	//Select form Google
	var changeSelectHoliday = function(){
		//trace($(this).attr("disabled"));
		if($(this).attr("disabled")){return false;}
		var did = $(this).val();
		if(!did || did.length < 8){ return; }
		chrome.tabs.sendMessage(tabID_GC, {"method": "GCALIZE_getCalID", "dtid": did}, function(response){
			// trace(response);
			if(response && response.responseText){
				// OLD: ver->1.1.8
				// var t1 = response.responseText.replace("while(1);", "").replace(/\'/g, "\"");
				// OLD: ver->1.3.x
				// var t1 = response.responseText.replace(")]}'\", "").replace(/\'/g, "\"");
                var json = JSON.parse(response.responseText.replace(")]}'\n", ""));
				if(json[0][14]){
					//trace(json2[0][14]);//CalID
					Gcalize.loadGcal.clearDatas();
					trace(Gcalize.loadGcal.datas);
					Gcalize.loadGcal.calendarID = json[0][14];
					Gcalize.loadGcal.load();
					WAU.UI.Loading.parsent = 0;
					//WAU.UI.Loading.start({ 'delay_end': 10*1000 });
					WAU.UI.Loading.start({ 'nonCheck': true });
					//WAU.UI.Loading.start();
					WAU.UI.Cover.show();
				}
			}else{
				//response error
				alert("Can not connect Google Server.[#1]");
			}
		});
	};

	var notFoundCount = 0;
	//callback comp
	var GcalAPI_Loaded = function(datas){
		//each Loaded Datas
		trace(">>GcalAPI_Loaded -> stat: "+ datas.stat);
		trace(datas);
		if(datas.stat){
			notFoundCount = 0;
			hld_name.val(datas.calendarName);
			hld_cid.val(datas.calendarID);
			hld_data.val(JSON.stringify(datas.days));

			var d = new Date();
			var YMD_H = d.getFullYear()+""+(('0'+(d.getMonth()+1)).slice(-2))+""+(('0'+d.getDate()).slice(-2));
			var YMD_V = d.getFullYear()+"."+(('0'+(d.getMonth()+1)).slice(-2))+"."+(('0'+d.getDate()).slice(-2));
			hld_saved.val(YMD_H);
			hld_info.val(datas.startYear+" ... "+ datas.endYear +" = "+ datas.info2 +" (Last imported:"+YMD_V+")");

			var t1 = setTimeout(function(){
				WAU.UI.Loading.hideBar();
				WAU.UI.Loading.setText( act_iptOK );//i18n!!
				var t2 = setTimeout(function(){
					WAU.UI.Loading.hide();
					WAU.UI.Cover.hide();
				}, 1000);
			}, 1000);

		}else{
			notFoundCount++;
			WAU.UI.Loading.parsent = 100;
			WAU.UI.Cover.hide();
			if(notFoundCount>4){
				alert( act_nonHDY );//i18n!!
			}else{
				alert('Maybe, API-access has reached limit value.\nPlease try another day. m(_ _)m');
			}
			WAU.UI.Loading.hide();
		}

	};
	//callback step
	var GcalAPI_Step = function(min, max){
		var per = Math.floor(min / max * 100);
		WAU.UI.Loading.setPer(per);
		WAU.UI.Loading.setText("loading ... "+ per +"%");
	};

	//callback step
	var loadByCalID = function(_calID){
		if(_calID.length<1 || !_calID || _calID==""){
			alert( act_plsID );//i18n!!//Please Input the Calendar ID
			return false;
		}
		Gcalize.loadGcal.clearDatas();
		trace(Gcalize.loadGcal.datas);
		Gcalize.loadGcal.calendarID = _calID
		Gcalize.loadGcal.load();
		WAU.UI.Loading.parsent = 0;
		WAU.UI.Loading.start({'nonCheck':true});
		WAU.UI.Cover.show();
	};


	$(function(){
		_WAU = WAU;
		//trace(_WAU);
		//trace(Gcalize);

		//set
		SELECT_HLD         = $("#SELECT_HLD");
		BTN_CALIDSELECT    = $("#BTN_CALIDSELECT");
		BTN_PLEASEOPENGCAL = $("#BTN_PLEASEOPENGCAL");
		BTN_REIMPORT       = $("#BTN_REIMPORT");
		ICON_LOADING       = $("#ICON_LOADING");
		INPUT_CALID        = $("#INPUT_CALID");
		hld_name           = $("#hld_name");
		hld_cid            = $("#hld_cid");
		hld_info           = $("#hld_info");
		hld_data           = $("#hld_data");
		hld_saved          = $("#hld_saved");

		JFK = new jfkActivityIndicator({
			'target': document.querySelector('#ICON_LOADING'),
			'style' : {'top':'50%','left':'10px','zIndex':10}
		});
		//JFK.show();

		$("#Y_AGO").text(Gcalize.admin.Y_AGO);
		$("#Y_AFT").text(Gcalize.admin.Y_AFT);

		//Make GcalAPI object
		var _LOCAL_DATE = new Date();
		Gcalize.loadGcal.clear().setSettings({
			"splitload" : true,
			"startYear" : _LOCAL_DATE.getFullYear() - Gcalize.admin.Y_AGO,
			"endYear"   : _LOCAL_DATE.getFullYear() + Gcalize.admin.Y_AFT
		}).step(GcalAPI_Step).done(GcalAPI_Loaded);

		SELECT_HLD.attr("disabled", "disabled").change();
		SELECT_HLD.on("change", changeSelectHoliday);

		//Tab Open BTN
		BTN_PLEASEOPENGCAL.on("click", function(){
			BTN_PLEASEOPENGCAL.hide();
			JFK.show();
			tabID_hits = [];
			tabID_GC = -1;
			find_loop_count = 0;
			FindGcalTab_LOOP();
			//chrome.tabs.create({'index':(myTabInfo.index+1),'url':'https://www.google.com/calendar/render', 'selected':false }, function(add_tab){
			//chrome.tabs.create({'url':'https://www.google.com/calendar/render', 'selected':false }, function(add_tab){
			chrome.tabs.create({'url':'http://www.google.com/calendar', 'selected':false }, function(add_tab){
				tabID_GC = add_tab.id;
			});
		});

		BTN_CALIDSELECT.on("click", function(){
			var calID = INPUT_CALID.val().replace(/^\s+|\s+$/g, "");
			loadByCalID(calID);
		});
		BTN_REIMPORT.on("click", function(){
			var calID = hld_cid.val().replace(/^\s+|\s+$/g, "");
			loadByCalID(calID);
		});

		//Tab Close CHK
		chrome.tabs.onRemoved.addListener(function(id){
			if(flg_Found && id == tabID_GC){
				//SELECT_HLD.find("option:first").attr('selected','selected').trigger("change");
				//SELECT_HLD.attr("disabled", "disabled").trigger("change");
				SELECT_HLD.find("option:first").attr('selected','selected');
				SELECT_HLD.attr("disabled", "disabled").trigger("change");

				find_loop_count = 0;
				FindGcalTab_LOOP();
				return;
			}
		});
		//start
		FindGcalTab_LOOP();
	});
})(jQuery, window, document);























/*-------------------------------------------
▼WAU_UI
Copyright piayo. All rights reserved.
-------------------------------------------*/
var WAU = WAU || {};
//util
;(function(e,t,n,r){"use strict";var i=WAU||{};var s=function(){var t={};t.Callbacks=function(){function t(){this.doneCallback=this.failCallback=e}var e=function(){};t.prototype.done=function(e){this.doneCallback=e;return this};t.prototype.fail=function(e){this.failCallback=e;return this};return t}();t.ShowLoading=function(e,t){WAU.UI.Loading.show();WAU.UI.Cover.show();var n=setTimeout(function(){WAU.UI.Loading.hideBar();WAU.UI.Loading.setText(e);var n=setTimeout(function(){WAU.UI.Loading.hide();WAU.UI.Cover.hide();if(t){t()}},1000)},600)};t.setVals=function(t){for(var n in t){var r=e("[name="+n+"]");if(r.length==1){r.val(t[n]).change()}else{r.each(function(r){if(e(this).attr("type")=="radio"&&e(this).val()==t[n]){e(this).attr("checked",true).change()}})}}};t.query2param=function(e){var t={};for(var n in e){if(e[n].name){if(e[n].name.indexOf("_no_")<0){if(isFinite(e[n].value)){t[e[n].name]=+[e[n].value]}else{t[e[n].name]=e[n].value}}}}return t};var n=null;t.VAR_clear=function(){clearTimeout(n)};t.VAR=function(e,t,r,i){if(!i){i=100}var s=function(e,t){var o=e[t];n=setTimeout(function(){clearTimeout(n);if(o!=e[t]){if(r(e,t)){s(e,t)}}else{s(e,t)}},i)};s(e,t)};return t}();i.UTIL=s})(jQuery,window,document);
//ui
;(function(e,t,n,r){"use strict";var i=WAU||{};var s=function(){var t={};t.Cover=function(){var e={};var t=function(e){preventDefault(e);SelectionOFF()};e.show=function(e){i.DOM.HTML.addClass("_noscroll");i.DOM.COVER.on("mousedown.NOSCROLL",t);i.DOM.WINDOW_B.on("mousedown.BLOCK",t);e&&i.DOM.COVER.addClass(e);i.DOM.COVER.show();return i.DOM.COVER};e.hide=function(){i.DOM.HTML.removeClass("_noscroll");i.DOM.COVER.off("mousedown.NOSCROLL",t);i.DOM.WINDOW_B.off("mousedown.BLOCK",t);i.DOM.COVER.removeClass();i.DOM.COVER.hide()};return e}();var n=function(){var t={};var n=null;var r=null;var s=null;var o=null;var u=function(){s=e("#wau_loading_bar");r=e("#wau_loading_txt");o=e("#wau_loading_per")};t.persent=0;t.show=function(e){u();s.show();var n=e||100;t.setPer(n);i.DOM.LOADING.show()};t.hide=function(){u();r.text("").hide();t.persent=0;i.DOM.LOADING.hide();clearTimeout(n)};t.hideBar=function(e){u();s.hide()};t.setPer=function(e){u();t.persent=e;o.css({width:e+"%"})};t.setText=function(e){u();r.show().text(e)};t.start=function(e){u();s.show();t.show(1);t.persent=0;return t};return t}();t.Loading=n;return t}();i.UI=s})(jQuery,window,document);
//dom
;(function(e,t,n,r){"use strict";var i=WAU||{};i.DOM={};i.DOM.init=function(){var t=e("body");var n=[];n.push('<div id="wau_tipnum"></div>');n.push('<div id="wau_tiptool"><div id="wau_tiptool_t"></div><span class="agl"></span></div>');n.push('<div id="wau_loading"><div id="wau_loading_cont"><div id="wau_loading_bar"><div id="wau_loading_per"></div></div><div id="wau_loading_txt"></div></div></div>');n.push('<div id="wau_alert"><div class="_wrap"><div class="title"></div><div class="cont"></div><div class="ipt"></div><div class="btns"></div></div></div>');n.push('<div id="wau_notify"></div>');n.push('<div id="wau_window"><div id="wau_window_m"></div><div id="wau_window_b"></div></div>');n.push('<div id="wau_cover"></div>');t.append(n.join(""));var r=[{N:"ADMIN_HEAD",I:"admin_head"},{N:"ADMIN_NAVI",I:"admin_navi"},{N:"ADMIN_WRAP",I:"admin_wrap"},{N:"ADMIN_MAIN",I:"admin_main"},{N:"ADMIN_SIDE",I:"admin_side"},{N:"TIP_NUM",I:"wau_tipnum",idx:220,h:true},{N:"TIP_TOOL",I:"wau_tiptool",idx:210,h:true},{N:"TIP_TOOL_T",I:"wau_tiptool_t"},{N:"LOADING",I:"wau_loading",idx:200,h:true},{N:"ALERT",I:"wau_alert",idx:130,h:true},{N:"NOTIFY",I:"wau_notify",idx:120},{N:"WINDOW",I:"wau_window",idx:110,h:true},{N:"WINDOW_B",I:"wau_window_b"},{N:"WINDOW_M",I:"wau_window_m"},{N:"COVER",I:"wau_cover",idx:100,h:true}];for(var s=0,o=r.length;s<o;s++){var u=i.DOM[r[s].N]=e("#"+r[s].I+"");if(r[s].idx){u.css({"z-index":r[s].idx})}if(r[s].h){u.hide()}}i.DOM.HTML=e("html");i.DOM.BODY=e("body");delete i.DOM.init}})(jQuery,window,document);
//form
;(function(e,t,n,r){e.fn.attr2obj=function(t){var n=e(this);var r={};var i=n.attr(t).toString().split(",");for(var s=0;s<i.length;s++){var o=i[s].split(":");if(isFinite(o[1])){r[o[0]]=Number(o[1])}else{r[o[0]]=o[1]}}return r};e.fn.form_color=function(){this.each(function(){e(this).change(function(){this.title=this.value;e(this).attr("code",this.value)}).change()});return this};e.fn.form_select=function(){this.each(function(){var t=e(this);t.wrap('<span class="_wau_select"></span>');var n=t.parent();t.on("focus.wau_select",function(){n.addClass("_focus")}).on("focusout.wau_select",function(){n.removeClass("_focus")}).on("change.wau_select",function(){n.removeClass("_disabled _readonly");t[0].tabIndex=0;if(t.attr("readonly")){n.addClass("_readonly");t[0].tabIndex=-1}if(t.attr("disabled")){n.addClass("_disabled");t[0].tabIndex=-1}n[0].dataset.value=t[0].options[t[0].selectedIndex].text}).trigger("change")});return this};e.fn.form_range=function(){this.each(function(){var t=this;var n=e(this);var r,i,s,o=0;var u=n.attr("min");var a=n.attr("max");if(typeof u=="undefined"){n.attr("min",0)}if(typeof a=="undefined"){n.attr("max",100)}if(n.hasClass("switch")){n.attr("min",0).attr("max",1);if(!n.attr("value")){n.attr("value","0")}}r=n.width();s=t.min||0;o=t.max||100;i=Math.abs(s-o)||100;n.change(function(){var e=parseInt(t.value);t.dataset.value=e;var n=r/100*Math.round((i-(o-e))/i*100);t.style.backgroundPosition=""+n+"px 100%"}).change()});return this};e.fn.form_wau_number=function(){this.each(function(){var t=e(this);t.attr("autocomplete","off");var r=t.attr2obj("wau");t.wrap('<span class="_wau_number"></span>');var i=function(e){if(t.attr("disabled")||t.attr("readonly")){return false}var n=Number(t.val())+r.step*e;if(n>r.max){n=r.max}if(n<r.min){n=r.min}if(!n&&n!=0){n=r.min}t.val(n)};var s=null;var o=0;var u=function(){if(s){clearTimeout(s)}i(o);s=setTimeout(u,60)};var a=e("<span>",{"class":"_dn",title:"down"});a.on("click.wau_number",function(){i(-1);return false});a.hide();t.after(a);var f=e("<span>",{"class":"_up",title:"up"});f.on("click.wau_number",function(){i(1);return false});f.hide();t.after(f);var l=function(e){switch(true){case e.keyCode==38:i(1);break;case e.keyCode==40:i(-1);break}};t.on("focus.wau_number",function(){t.on("keydown.wau_number",l)});t.on("focusout.wau_number",function(){t.off("keydown.wau_number",l)});var c=function(){if(s){clearTimeout(s)}h.off("mouseup.wau_number")};var h=e(n);f.on("mousedown.wau_number",function(e){preventDefault(e);o=1;s=setTimeout(u,500);h.on("mouseup.wau_number",c)});a.on("mousedown.wau_number",function(e){preventDefault(e);o=-1;s=setTimeout(u,500);h.on("mouseup.wau_number",c)});var p=function(e){e[0].tabIndex=0;if(e.attr("readonly")){e[0].tabIndex=-1}if(e.attr("disabled")){e[0].tabIndex=-1}};t.on("change",function(){var n=parseInt(t.val());if(!isFinite(n)){t.val(r.min)}if(n<r.min){t.val(r.min)}if(n>r.max){t.val(r.max)}p(e(this))}).change();var d=r.max.toString().length;t.css({width:d*.3+1+"em"});var v=setTimeout(function(){var e=parseInt(t.css("marginTop").replace("px",""));var n=t.outerHeight();var r=Math.round(n/2)-2;var i=r;if(n%2!=1){i+=1}var s=t.position().top+e;f.css({top:s,height:r+"px"}).show();a.css({top:s+r+1,height:i+"px"}).show()},100)});return this}})(jQuery,window,document);

/*-------------------------------------------
▼class: jfkActivityIndicator
Copyright piayo. All rights reserved.
Author: piayo http://jsdo.it/piayo/iWXR
licensed under the MIT License.
http://www.opensource.org/licenses/mit-license.php
-------------------------------------------*/
var jfkActivityIndicator=function(){function e(e){var t=this;var n,r,i,s=null;var o=0;var u=250;var a=null;var f=e.target;var l=e.style;var c=function(){o++;if(o>7){o=0}n.dataset.step=o};t.show=function(){n.classList.add("on");clearInterval(a);o=n.dataset.step||o;a=setInterval(c,u)};t.hide=function(){n.classList.remove("on");clearInterval(a);c();n.dataset.step=o};t.toggle=function(e){if(!f){return}var r=e?e=!e:n.classList.contains("on");if(r){t.hide()}else{t.show()}};(function(){n=document.createElement("div");r=document.createElement("span");i=document.createElement("span");s=document.createElement("span");n.classList.add("jfk");r.classList.add("jfk0");i.classList.add("jfk1");s.classList.add("jfk2");n.appendChild(r);n.appendChild(i);n.appendChild(s);n.dataset.step=o;if(l){for(k in l){n.style[k]=l[k]}}f.appendChild(n)})()}return e}();

/*-------------------------------------------
// etc
-------------------------------------------*/
// preventDefault
var preventDefault = function(e){ e = e || window.event; if(e.preventDefault){ e.preventDefault();} e.returnValue = false; }
// SelectionOFF
var SelectionOFF=function(){if(window.getSelection){var e=window.getSelection();if(e.removeAllRanges){e.removeAllRanges()}else if(e.getRangeAt){e.getRangeAt(0).collapse(true)}}else if(document.selection&&document.selection.empty){document.selection.empty()}};
