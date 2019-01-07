
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha


if(!localStorage.acStarted){
	localStorage.acStarted = 0;
}
if(!localStorage.doneSavingCheck){
	localStorage.doneSavingCheck = 0;
}
if(!localStorage.doneACTill){
	localStorage.doneACTill = 0;
}
if(!localStorage.allCpnText){
	localStorage.allCpnText = "";
}
if(!localStorage.displayRatingBar){
	localStorage.displayRatingBar = 0;
}
var apiCase = 0;
var coupStr = "";
var strEcash = "";
function dynamicSort(property, property1) {
	var sortOrder = 1;
	if(property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a,b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0 || (a[property1] < b[property1]) ? -1 : (a[property1] > b[property1]) ? 1 : 0;
		return result * sortOrder;
	}
}


var sort_by;
(function() {
    // utility functions
    var default_cmp = function(a, b) {
    	if (a == b) return 0;
    	return a < b ? -1 : 1;
    },
    getCmpFunc = function(primer, reverse) {
    	var cmp = default_cmp;
    	if (primer) {
    		cmp = function(a, b) {
    			return default_cmp(primer(a), primer(b));
    		};
    	}
    	if (reverse) {
    		return function(a, b) {
    			return -1 * cmp(a, b);
    		};
    	}
    	return cmp;
    };

    // actual implementation
    sort_by = function() {
    	var fields = [],
    	n_fields = arguments.length,
    	field, name, reverse, cmp;

        // preprocess sorting options
        for (var i = 0; i < n_fields; i++) {
        	field = arguments[i];
        	if (typeof field === 'string') {
        		name = field;
        		cmp = default_cmp;
        	}
        	else {
        		name = field.name;
        		cmp = getCmpFunc(field.primer, field.reverse);
        	}
        	fields.push({
        		name: name,
        		cmp: cmp
        	});
        }

        return function(A, B) {
        	var a, b, name, cmp, result;
        	for (var i = 0, l = n_fields; i < l; i++) {
        		result = 0;
        		field = fields[i];
        		name = field.name;
        		cmp = field.cmp;

        		result = cmp(A[name], B[name]);
        		if (result !== 0) break;
        	}
        	return result;
        }
    }
}());

var coupon_icon = '<div id="couponClick" style="cursor:pointer;position:relative;"><div class="js-couponTooltip hk-c-toolTips__container--infocus hk-c-toolTips__container hk-c-toolTips__container--dark hk-c-toolTips__container--left hk-sTab__setPriceDrop hk-u-disp--ib"><img style="margin-top:5px;" src="chrome-extension://'+chrome.runtime.id+'/apply-coupon.png"><div class="hk-c-toolTip hk-u-padding__15"><div style="position: absolute;top: 5px;right: 5px;font-size: 21px;font-weight: bold;cursor: pointer;z-index: 1000;width: 20px;height: 20px;line-height: 100%;" class="js-closeCouponTooltip">&times;</div><div class="hk-c-toolTip__wrap hk-l-flexColumns hk-u-noWrap"><div class="hk-l-flexCol__col hk-u-padding__h-05"><p><b>Just Click to apply coupons.</b><br> Use coupons before checkout<br> Share with friends and Stand a chance to win prizes<br></b></p></div></div></div></div></div>';

function displayACIcon(selectorACIcon, parent, position, vendor, details){
	var newUI = returnResource("autoCoupon.html");
	if($('#hk-killerACDIV').length==0){
		$('body').append('<div id="hk-killerACDIV" style="display:block!important"></div>');
	}
	var str = $(selectorACIcon);
	if($(selectorACIcon).length > 0 && $('#hk-killerACDIV').length > 0){
		if(parent == "none"){
			if(position == "after"){
				str.after(coupon_icon);
				$('#hk-killerACDIV').load(newUI);
				setTimeout(()=>{
					requestAnimationFrame(()=>{
						$('.js-closeCouponTooltip').click(function(e){
							e.stopPropagation();$(this).hide();$('.js-couponTooltip').removeClass('hk-c-toolTips__container--infocus')

							$('.js-couponTooltip').hover(function(){ $(this).addClass('hk-c-toolTips__container--infocus')},function(){ $(this).removeClass('hk-c-toolTips__container--infocus')});})});
				}, 1000);
			}
			else if(position == "before"){
				str.before(coupon_icon);
				$('#hk-killerACDIV').load(newUI);
				setTimeout(()=>{
					requestAnimationFrame(()=>{
						$('.js-closeCouponTooltip').click(function(e){
							e.stopPropagation();$(this).hide();$('.js-couponTooltip').removeClass('hk-c-toolTips__container--infocus')

							$('.js-couponTooltip').hover(function(){ $(this).addClass('hk-c-toolTips__container--infocus')},function(){ $(this).removeClass('hk-c-toolTips__container--infocus')});})});
				}, 1000);
			}
			else{
				str.append(coupon_icon);
				$('#hk-killerACDIV').load(newUI);
				setTimeout(()=>{
					requestAnimationFrame(()=>{
						$('.js-closeCouponTooltip').click(function(e){
							e.stopPropagation();$(this).hide();$('.js-couponTooltip').removeClass('hk-c-toolTips__container--infocus')

							$('.js-couponTooltip').hover(function(){ $(this).addClass('hk-c-toolTips__container--infocus')},function(){ $(this).removeClass('hk-c-toolTips__container--infocus')});})});
				}, 1000);
			}
		}
		else{
			if(position == "after"){
				str.parent().after(coupon_icon);
				$('#hk-killerACDIV').load(newUI);
				setTimeout(()=>{
					requestAnimationFrame(()=>{
						$('.js-closeCouponTooltip').click(function(e){
							e.stopPropagation();$(this).hide();$('.js-couponTooltip').removeClass('hk-c-toolTips__container--infocus')

							$('.js-couponTooltip').hover(function(){ $(this).addClass('hk-c-toolTips__container--infocus')},function(){ $(this).removeClass('hk-c-toolTips__container--infocus')});})});
				}, 1000);
			}
			else if(position == "before"){
				str.parent().before(coupon_icon);
				$('#hk-killerACDIV').load(newUI);
				setTimeout(()=>{
					requestAnimationFrame(()=>{
						$('.js-closeCouponTooltip').click(function(e){
							e.stopPropagation();$(this).hide();$('.js-couponTooltip').removeClass('hk-c-toolTips__container--infocus')

							$('.js-couponTooltip').hover(function(){ $(this).addClass('hk-c-toolTips__container--infocus')},function(){ $(this).removeClass('hk-c-toolTips__container--infocus')});})});
				}, 1000);
			}
			else{
				str.parent().append(coupon_icon);
				$('#hk-killerACDIV').load(newUI);
				setTimeout(()=>{
					requestAnimationFrame(()=>{
						$('.js-closeCouponTooltip').click(function(e){
							e.stopPropagation();$(this).hide();$('.js-couponTooltip').removeClass('hk-c-toolTips__container--infocus')

							$('.js-couponTooltip').hover(function(){ $(this).addClass('hk-c-toolTips__container--infocus')},function(){ $(this).removeClass('hk-c-toolTips__container--infocus')});})});
				}, 1000);
			}
		}
		addACListeners(vendor, details);
	}
	else {
		setTimeout(function(){displayACIcon(selectorACIcon, parent, position, vendor, details)}, 100);
	}
}

function sendPushPrep(){
	if(tabID!=0){
		var jsonArr = [{'showPush': tabID}];
		jsonArr = JSON.stringify(jsonArr);
		sendMessage(0, jsonArr, 0, doNothing, []);
	}
	else{
		setTimeout(function(){sendPushPrep()}, 1000);
	}

}

function addACListeners(vendor, details){
	if(localStorage.acStarted && localStorage.acStarted == 1 && localStorage.getCoupons && localStorage.getCoupons != "" && localStorage.acDetails && localStorage.acDetails != "" && (localStorage.doneACTill > 0 ||  localStorage.doneACTill == -1)){
		resumeAC();
		return;
	}
// console.log("205-vendor "+vendor);
// console.log("205-details "+details);
	if(window.location.href.split("amazon.in").length > 1){
		$('.hk-c-toolTips__container').removeClass('hk-c-toolTips__container--infocus');
		sendPushPrep();
	}
	if(window.location.href.split("jabong.com/cart").length > 1 || window.location.href.split(".tatacliq.com/checkout").length > 1 || window.location.href.split("ajio.com/cart").length > 1 || window.location.href.split("redbus.in").length > 1 || window.location.href.split("koovs.com/checkout/").length > 1 || window.location.href.split("healthkart.com/cart/Cart.action").length > 1 || window.location.href.split("homeshop18.com/shopping-cart").length > 1){
		// alert(1);
		$('.hk-c-toolTips__container').removeClass('hk-c-toolTips__container--left');
		$('.hk-c-toolTips__container').addClass('hk-c-toolTips__container--right');
	}
	if(window.location.href.split("akbartravels.com").length > 1 || window.location.href.split("yatra.com").length > 1 || window.location.href.split("makemytrip.com/makemytrip/").length > 1 || window.location.href.split("pizzaonline.dominos.co.in/review/").length > 1  || window.location.href.split("cheapfaresindia.makemytrip.com/international/").length > 1){
		$('.hk-c-toolTips__container').removeClass('hk-c-toolTips__container--left');
		$('.hk-c-toolTips__container').addClass('hk-c-toolTips__container--right');
	}
	if($("#couponClick").length > 0){
		$("#couponClick").before('<div style="clear:both"></div>');
		$("#couponClick").after('<div style="clear:both"></div>');
	}
	if($("#couponClick").length > 0){
		var imageURL = returnResource("apply-coupon.png");
		document.querySelector('#couponClick img').setAttribute("src", imageURL);
		$("#couponClick").click(function(){
			doneACTill = 0;
			bestCoupon = "";
			bestSaving = 0;
			doneSavingCheck = 0;
			localStorage.showPostLoad = 0;
			localStorage.acStarted = 0;
			localStorage.bestCoupon = "";
			localStorage.bestSaving = 0;
			localStorage.acDetails = "";
			localStorage.lastCoupon = "";
			localStorage.getCoupons = "";
			localStorage.displayRatingBar = 0;
			localStorage.savings = "";
			savings = [];
			localStorage.doneACTill = 0;
			localStorage.showFinalSavings = 0;
			localStorage.allCpnText = "";
			localStorage.anaSent = 0;
			localStorage.doneSavingCheck = 0;
			localStorage.bestCouponHere = "";
			localStorage.bestSavingHere = 0;
			doneSavingCheck = 0;
			// var host=window.location.host;
			// host = host.replace("www.","").replace(".com","").replace(".in","").replace("in.","").replace(".co.in","").replace(".co","").replace("pizzaonline.","")
			var jsonArr = [{'type': 'auto_coupon','vendor':vendor}];
			jsonArr = JSON.stringify(jsonArr);
			// console.log("252"+jsonArr);

			getACCodes(jsonArr).then(function(data){
				// console.log("260-"+JSON.stringify(data));
				localStorage.allCpnText = JSON.stringify(data);
				createEachTextObj();
				// data = JSON.parse(data);
				coupStr = "";
				if(data.length == 0){
					displayNoSavings();
					initializeLocaStorage();
					return;
				}
				for(var d=0;d<data.length;d++){
					if(data[d]._source.code != "")
						coupStr += data[d]._source.code + "~";
				}
				 // console.log("273"+coupStr);
				 // console.log("273"+details);
				startACProcess(coupStr, details);
			});

		});
	}
	else{
		setTimeout(
			function(){
				addACListeners(vendor, details);
			} , 500);
	}
}


function getACCodes(jsonArr){
	return new Promise(function(resolve, reject){
		// var jsonArr = [{'pos': pos}];
		// jsonArr = JSON.stringify(jsonArr);
		sendMessagePromise(1, jsonArr, 'auto_coupon').then(function(args){
			resolve(args);
		});
	});
}
var eachCpnTextObj = {};
function createEachTextObj(){
	if(localStorage.allCpnText && localStorage.allCpnText.trim() != ""){
		var eachText = localStorage.allCpnText.trim();
		eachText = JSON.parse(eachText);
		for(var et=0;et<eachText.length;et++){
			var cpn = eachText[et]._source.code.trim().toUpperCase();
			var cpnText = eachText[et]._source.title.trim();
			if(cpn != ""){
				eachCpnTextObj[cpn] = cpnText;
			}
		}
	}
	return;
}

function displayFinalSavingsSide(){
	// alert("displayFinalSavingsSide called");
	var displayBest = getBestToDisplay();
	var bestSavingDisplay = displayBest.split("~~")[0].trim();
	var bestCouponDisplay = displayBest.split("~~")[1].trim();
	$(".hk-aCoup__netSavings b:eq(0)").text(bestSavingDisplay);
	$(".hk-js-autoCoup__bestCouponTill:eq(0)").text(bestCouponDisplay);
	var savings1 = localStorage.savings;
	savings1 = JSON.parse(savings1);
	savings1.sort(dynamicSort("-saving", "ecash"));
	if($(".hk-aCoup__sideList.hk-c-lists").length > 0){
		var sideCopy = $(".hk-aCoup__sideList.hk-c-lists li:eq(0)").clone();
		$(".hk-aCoup__sideList.hk-c-lists li").remove();
		for(var d=0;d<savings1.length;d++){
			var code = savings1[d].code;
			code = code.toUpperCase().trim();
			var saving = savings1[d].saving;
			if(saving > 0){
				saving = Math.round(saving * 100) / 100;
			}
			var ecash = savings1[d].ecash;
			if(ecash > 0){
				ecash = Math.round(ecash * 100) / 100;
			}
			if(code != ""){
				var sideCopy1 = $(sideCopy).clone();
				$(".hk-aCoup__sideList.hk-c-lists").append(sideCopy1);
				$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").attr("data-code", code);
				$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").attr("data-saving", saving);
				$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").attr("data-ecash", ecash);
				$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__coupCode:eq(0)").text(code);
				if(saving > 0 || ecash > 0){
					if(saving == 0 && ecash > 0){
						saving = ecash;
						strEcash = "(CashBack)";
					}
					else if(saving > 1 && ecash == 0){
						strEcash = "";
					}
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").removeClass("hk-u-text--red");
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").addClass("hk-u-text--lightGreen");
					if(saving > 1){
						$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").html(`<span class="hk-u-text--super">₹</span><span class="hk-autocoup__each-off">${saving}</span> Off ${strEcash}`);
					}
					else if(saving == 1){
						$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").html(`<span class="hk-u-text--super"></span><span class="hk-autocoup__each-off">Offer Coupon</span> ${strEcash}`);
					}
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__iconWrap:eq(0)").html(`<svg viewBox="0 0 101 101" class="hk-u-va--bottom hk-aCSLLi__icon hk-u-margin__h-05" height="20px">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#hk-svg__filledTick"></use>
						</svg>`);
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-ACSLLi__descri:eq(0)").after(`<b class="hk-aCSLLi__reApply hk-c-links hk-c-links--iconTri hk-tri--right hk-u-fSize--small">Apply Again</b>`);
				}
				else{
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").removeClass("hk-u-text--lightGreen");
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").addClass("hk-u-text--red");
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").html("- N/A");
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__iconWrap:eq(0)").html(`<svg viewBox="0 0 101 101" class="hk-u-va--bottom hk-aCSLLi__icon hk-u-margin__h-05" height="20px">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#hk-svg__filledCross"></use>
						</svg>`);
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").find(".hk-aCSLLi__reApply").remove();
				}
				if((Object).keys(eachCpnTextObj).length > 0){
					if(eachCpnTextObj[code] && eachCpnTextObj[code] != ""){
						$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").find(".hk-ACSLLi__descri").text(eachCpnTextObj[code]);
					}
				}
				else{
					createEachTextObj();
					if(eachCpnTextObj[code] && eachCpnTextObj[code] != ""){
						$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").find(".hk-ACSLLi__descri").text(eachCpnTextObj[code]);
					}
				}
			}
		}
	}
	$(".hk-aCoup__netSavings b:eq(0)").text(bestSavingDisplay);
	$(".hk-js-autoCoup__bestCouponTill:eq(0)").text(bestCouponDisplay);
	localStorage.displayRatingBar = 1;
	if(localStorage.showFinalSavings != 1){
		initializeLocaStorage();
	}
	return;
}

function displaySideCoupons(data){
	// alert("displaySideCoupons called"+data);
	return new Promise(function(resolve, reject){
		data = data.split("~");
		if($(".hk-aCoup__sideList.hk-c-lists").length > 0){
			var sideCopy = $(".hk-aCoup__sideList.hk-c-lists li:eq(0)").clone();
			$(".hk-aCoup__sideList.hk-c-lists li").remove();
			// console.log("395-"+JSON.stringify(data));
			for(var d=0;d<data.length-1;d++){
				sideCopy1 = $(sideCopy).clone();
				$(".hk-aCoup__sideList.hk-c-lists").append(sideCopy1);
				var couponCode = data[d].toUpperCase().trim();
				if(couponCode != ""){
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").find(".hk-aCSLLi__reApply").remove();
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").attr("data-code", couponCode);
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__coupCode:eq(0)").text(couponCode);
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__coupCode:eq(0)").text(couponCode);
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__iconWrap:eq(0)").html("");
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__iconWrap:eq(0)").html("");
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").html("");
				}
				if(eachCpnTextObj != {} && eachCpnTextObj != "{}"){
					if(eachCpnTextObj[couponCode] && eachCpnTextObj[couponCode] != ""){
						$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").find(".hk-ACSLLi__descri").text(eachCpnTextObj[couponCode]);
					}
				}
				else{
					createEachTextObj();
					if(eachCpnTextObj[couponCode] && eachCpnTextObj[couponCode] != ""){
						$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").find(".hk-ACSLLi__descri").text(eachCpnTextObj[couponCode]);
					}
				}
			}
		}
		resolve("done");
	});
}

function displayEachCpnSaving(coupon, saving, ecash){
	// alert("displayEachCpnSaving called"+coupon);
	coupon = coupon.toUpperCase().trim();
	saving = parseInt(saving);
	ecash = parseInt(ecash);
	if(saving > 0){
		saving = Math.round(saving * 100) / 100;
	}
	if(ecash > 0){
		ecash = Math.round(ecash * 100) / 100;
	}
	if($(".hk-aCoup__sideList.hk-c-lists").length > 0){
		var eachLi = $(".hk-aCoup__sideList.hk-c-lists li").length;
		for(var d=0;d<eachLi;d++){
			if($(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").attr("data-code") == coupon && coupon != ""){
				if(saving > 0 || ecash > 0){
					if(saving == 0 && ecash > 0){
						saving = ecash;
						strEcash = "(CashBack)";
					}

					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").attr("data-done", 1)
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").find(".hk-aCSLLi__reApply").remove();
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").removeClass("hk-u-text--red");
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").addClass("hk-u-text--lightGreen");
					if(saving > 1){
						$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").html(`<span class="hk-u-text--super">₹</span><span class="hk-autocoup__each-off">${saving}</span> Off ${strEcash}`);
					}
					else if(saving == 1){
						$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").html(`<span class="hk-u-text--super"></span><span class="hk-autocoup__each-off">Offer Coupon</span> ${strEcash}`);
					}
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__iconWrap:eq(0)").html(`<svg viewBox="0 0 101 101" class="hk-u-va--bottom hk-aCSLLi__icon hk-u-margin__h-05" height="20px">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#hk-svg__filledTick"></use>
						</svg>`);
				}
				else{
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").attr("data-done", 1)
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").find(".hk-aCSLLi__reApply").remove();
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").removeClass("hk-u-text--lightGreen");
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").addClass("hk-u-text--red");
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").html("- N/A");
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__iconWrap:eq(0)").html(`<svg viewBox="0 0 101 101" class="hk-u-va--bottom hk-aCSLLi__icon hk-u-margin__h-05" height="20px">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#hk-svg__filledCross"></use>
						</svg>`);
				}
			}
		}
	}
	return;
}

function displayEachCpnTimer(coupon){
	// alert("displayEachCpnTimer called");
	// console.log("477-"+coupon);
	if(typeof(coupon) != "undefined")
	{
		coupon = coupon.toUpperCase().trim();
		if($(".hk-aCoup__sideList.hk-c-lists").length > 0){
			var eachLi = $(".hk-aCoup__sideList.hk-c-lists li").length;
			for(var d=0;d<eachLi;d++){
				if($(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").attr("data-code") == coupon && coupon != "" && $(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").attr("data-done") != 1){
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").find(".hk-aCSLLi__reApply").remove();
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").removeClass("hk-c-lists__li--whiteHover");
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+")").addClass("hk-c-lists__li--noHover");
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__status:eq(0)").html("- Applying...");
					$(".hk-aCoup__sideList.hk-c-lists li:eq("+d+") .hk-aCSLLi__iconWrap:eq(0)").html(`<svg viewBox="0 0 101 101" class="hk-u-va--bottom hk-aCSLLi__icon hk-u-margin__h-05" height="20px">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#hk-svg__loading"></use>
						</svg>`);
				}
			}
		}
	}

	return;
}

function startACProcess(resp, passBack){

	if(typeof(hkAutoCoup)!= "undefined"){
		hkAutoCoup.openAutoCoup();
			// alert("startACProcess called");
		if($("#hk-autoCoupon.hk-c-modals--open").length > 0){
			// console.log(500+resp);
			// 	console.log(501+passBack);
			displaySideCoupons(resp).then(function(args){
				localStorage.acStarted = 1;
				var detailsHere = JSON.parse(passBack);
				var cases = detailsHere[0].api_case;
				if(detailsHere[0].site){
					var site = detailsHere[0].site;
				}
				else{
					var site = 0;
				}
					// console.log(518+resp);
				localStorage.getCoupons = resp;
				localStorage.acDetails = passBack;
				if(cases == 1){
					apiCase = 1;
					autoCouponAPI(passBack, resp);

			}
			// else if(cases == 0){
			// 	apiCase = 0;
			// 	$("#hk-autoCoupon").find(".hk-c-modal").removeClass("hk-ext-slideInDown--center");
			// 	autoCouponNormal();
			// }
		});
		}
		// else{
		// 	setTimeout(startACProcess(resp, passBack), 500);
		// }
	}
	// else{
	// 	setTimeout(function(){
	// 		startACProcess(resp, passBack);
	// 	}
	// 	, 500);
	// }
}

function keepCheckingACIcon(selectorACIcon, parent, position, num, details){
	// alert(571);
	if($("#couponClick").length == 0){
		displayACIcon(selectorACIcon, parent, position, num, details);
		setTimeout(function(){
			keepCheckingACIcon(selectorACIcon, parent, position, num, details);
		}, 3000);
	}
	else{
		setTimeout(function(){
			keepCheckingACIcon(selectorACIcon, parent, position, num, details);
		}, 3000);
	}
}
var doneSavingCheck = 0;
var queueCount = 0;
var queueHash = [];
var intervalArr = {};

function autoCouponNormal(){
	// alert("autoCouponNormal called");
	if(!localStorage.acSavings){
		localStorage.acSavings = {};
	}
	var acSavings = localStorage.acSavings;
	var doneACTill = 0;

	if(!localStorage.doneACTill || localStorage.doneACTill == -1){
		doneACTill = 0
	}
	else{
		doneACTill = localStorage.doneACTill;
	}
	if(localStorage.acDetails && localStorage.acDetails != ""){
		var details = localStorage.acDetails;
		details = JSON.parse(details);
	}
	else{
		var details = "";
	}
	if(localStorage.getCoupons && localStorage.getCoupons != "" && details != ""){
		var resp = localStorage.getCoupons;
		resp = resp.split("~");
		var code = resp[doneACTill].trim();

		if(code != ""){
			detailsHere = details;
			var selectorInput = details[0]["selectorInput"];
			var clickApplySelector = details[0]["clickApplySelector"];
			var clickRemoveSelector = details[0]["clickRemoveSelector"];
			var inputAttr = details[0]["inputAttr"];
			if($(selectorInput).length > 0 || $(clickRemoveSelector).length > 0){
				removeAppliedCpn(clickRemoveSelector).then(function(args){
					if($(clickApplySelector).length > 0){
						if(inputAttr == "val"){
							$(selectorInput).val(code);
						}
						else if(inputAttr == "text"){
							$(selectorInput).text(code);
						}
						if(clickApplySelector[0] == "#"){
							clickApplySelector = clickApplySelector.slice(1);
							localStorage.lastCoupon = code;
							doneACTill++;
							localStorage.doneACTill = doneACTill;
							if(clickApplySelector.split(" ").length > 1){
								var nextSelector = clickApplySelector.split(" ");
								nextSelector = nextSelector[1].trim();
								clickApplySelector = clickApplySelector.split(" ");
								clickApplySelector = clickApplySelector[0].trim();
								if(nextSelector[0] == "."){
									nextSelector = nextSelector.slice(1);
									document.getElementById(clickApplySelector).getElementsByClassName(nextSelector)[0].click();
								}
								else if(nextSelector[0] == "#"){
									nextSelector = nextSelector.slice(1);
									document.getElementById(clickApplySelector).getElementById(nextSelector).click();
								}
								else if(nextSelector[0] != "#" && nextSelector[0] != "." && nextSelector[0].trim() != ""){
									document.getElementById(clickApplySelector).getElementsByTagName(nextSelector)[0].click();
								}
							}
							else{
								document.getElementById(clickApplySelector).click();
							}
						}
						else if(clickApplySelector[0] == "."){
							localStorage.lastCoupon = code;
							clickApplySelector = clickApplySelector.slice(1);
							doneACTill++;
							localStorage.doneACTill = doneACTill;
							if(clickApplySelector.split(" ").length > 1){
								var nextSelector = clickApplySelector.split(" ");
								nextSelector = nextSelector[1].trim();
								clickApplySelector = clickApplySelector.split(" ");
								clickApplySelector = clickApplySelector[0].trim();
								if(nextSelector[0] == "."){
									nextSelector = nextSelector.slice(1);
									document.getElementsByClassName(clickApplySelector)[0].getElementsByClassName(nextSelector)[0].click();
								}
								else if(nextSelector[0] == "#"){
									nextSelector = nextSelector.slice(1);
									document.getElementsByClassName(clickApplySelector)[0].getElementById(nextSelector).click();
								}
								else if(nextSelector[0] != "#" && nextSelector[0] != "." && nextSelector[0].trim() != ""){
									document.getElementsByClassName(clickApplySelector)[0].getElementsByTagName(nextSelector)[0].click();
								}
							}
							else{
								document.getElementsByClassName(clickApplySelector)[0].click();
							}
						}
					}
				});
			}
		}
	}
	// if(typeof(getPos) == 'function' && getPos() == 2191){
	// 	window.location.reload();
	// }
}


function removeAppliedCpn(clickRemoveSelector){
	return new Promise(function(resolve, reject){
		if($(clickRemoveSelector).length > 0 && $(clickRemoveSelector).css("display") != "none"){
			if(clickRemoveSelector[0] == "#"){
				clickRemoveSelector = clickRemoveSelector.slice(1);
				if(clickRemoveSelector.split(" ").length > 1){
					var nextSelector1 = clickRemoveSelector.split(" ");
					nextSelector1 = nextSelector1[1].trim();
					clickRemoveSelector = clickRemoveSelector.split(" ");
					clickRemoveSelector = clickRemoveSelector[0].trim();
					if(nextSelector1[0] == "."){
						nextSelector1 = nextSelector1.slice(1);
						if(!localStorage.doneACTill || localStorage.doneACTill == 0){
							localStorage.doneACTill = -1;
						}
						document.getElementById(clickRemoveSelector).getElementsByClassName(nextSelector1)[0].click();
						resolve("done");
					}
					else if(nextSelector1[0] == "#"){
						nextSelector1 = nextSelector1.slice(1);
						if(!localStorage.doneACTill || localStorage.doneACTill == 0){
							localStorage.doneACTill = -1;
						}
						document.getElementById(clickRemoveSelector).getElementById(nextSelector1).click();
						resolve("done");
					}
					else if(nextSelector1[0] != "#" && nextSelector1[0] != "." && nextSelector1[0].trim() != ""){
						if(!localStorage.doneACTill || localStorage.doneACTill == 0){
							localStorage.doneACTill = -1;
						}
						document.getElementById(clickRemoveSelector).getElementsByTagName(nextSelector1)[0].click();
						resolve("done");
					}
				}
				else{
					if(!localStorage.doneACTill || localStorage.doneACTill == 0){
						localStorage.doneACTill = -1;
					}
					document.getElementById(clickRemoveSelector).click();
					resolve("done");
				}
			}
			else if(clickRemoveSelector[0] == "."){
				clickRemoveSelector = clickRemoveSelector.slice(1);
				if(clickRemoveSelector.split(" ").length > 1){
					var nextSelector1 = clickRemoveSelector.split(" ");
					nextSelector1 = nextSelector1[1].trim();
					clickRemoveSelector = clickRemoveSelector.split(" ");
					clickRemoveSelector = clickRemoveSelector[0].trim();
					if(nextSelector1[0] == "."){
						nextSelector1 = nextSelector1.slice(1);
						if(!localStorage.doneACTill || localStorage.doneACTill == 0){
							localStorage.doneACTill = -1;
						}
						document.getElementsByClassName(clickRemoveSelector)[0].getElementsByClassName(nextSelector1)[0].click();
						resolve("done");
					}
					else if(nextSelector1[0] == "#"){
						nextSelector1 = nextSelector1.slice(1);
						if(!localStorage.doneACTill || localStorage.doneACTill == 0){
							localStorage.doneACTill = -1;
						}
						document.getElementsByClassName(clickRemoveSelector)[0].getElementById(nextSelector1).click();
						resolve("done");
					}
					else if(nextSelector1[0] != "#" && nextSelector1[0] != "." && nextSelector1[0].trim() != ""){
						if(!localStorage.doneACTill || localStorage.doneACTill == 0){
							localStorage.doneACTill = -1;
						}
						document.getElementsByClassName(clickRemoveSelector)[0].getElementsByTagName(nextSelector1)[0].click();
						resolve("done");
					}
				}
				else{
					if(!localStorage.doneACTill || localStorage.doneACTill == 0){
						localStorage.doneACTill = -1;
					}
					document.getElementsByClassName(clickRemoveSelector)[0].click();
					resolve("done");
				}
			}
			else{
				if(!localStorage.doneACTill || localStorage.doneACTill == 0){
					localStorage.doneACTill = -1;
				}
				resolve("done");
			}
		}
		else{
			if(!localStorage.doneACTill || localStorage.doneACTill == 0){
				localStorage.doneACTill = -1;
			}
			resolve("done");
		}
	});
}

// function resumeAC(){
// 	// alert("resumeAC called");
// 	if(localStorage.acStarted && localStorage.acStarted == 1 && localStorage.getCoupons && localStorage.getCoupons != "" && localStorage.acDetails && localStorage.acDetails != ""){
// 		var rand = parseInt(Math.random()*3);
// 		if(rand==0){
// 			dispProgressBar(localStorage.doneACTill).then(function(data1){
// 				startSaving().then(function(data){
// 					if(data == "done"){
// 						applyBestCoupon();
// 						var bestSaving = localStorage.bestSaving;
// 						if(localStorage.anaSent!=1 && parseInt(bestSaving) != 0 && bestSaving!="" && !isNaN(parseInt(bestSaving))){
// 							localStorage.anaSent = 1;
// 							var host=window.location.host;
// 							var jsonArr = [{'type': 'finish1','website':host}];
// 							jsonArr = JSON.stringify(jsonArr);
// 							sendMessage(1, jsonArr,22,doNothing, []);
// 							tracer(1,4);
// 							setTimeout(function(){if(JSON.parse(features_json)[4]==0){ft(4);}},100);
// 						}
// 					}
// 					else{
// 						startACProcess(localStorage.getCoupons, localStorage.acDetails);
// 					}
// 				});
// 			});
// 		}
// 		else {
// 			dispProgressBar(localStorage.doneACTill).then(function(data){
// 				startSaving().then(function(data){
// 					if(data == "done"){
// 						applyBestCoupon();
// 						var bestSaving = localStorage.bestSaving;
// 						if(localStorage.anaSent!=1 && parseInt(bestSaving) != 0 && bestSaving!="" && !isNaN(parseInt(bestSaving))){
// 							localStorage.anaSent = 1;
// 							var host=window.location.host;
// 							var jsonArr = [{'type': 'finish1','website':host}];
// 							jsonArr = JSON.stringify(jsonArr);
// 							sendMessage(1, jsonArr,22,doNothing, []);
// 							tracer(1,4);
// 							setTimeout(function(){if(JSON.parse(features_json)[4]==0){ft(4);}},100);
// 						}
// 					}
// 					else{
// 						startACProcess(localStorage.getCoupons, localStorage.acDetails);
// 					}
// 				});
// 			});
// 		}
// 	}
// }

if(window.location.href.split("paytm.com").length > 1){
	queueMaxLimit = 1;
}
else if(window.location.href.split("dominos.").length > 1){
	queueMaxLimit = 1;
}
else {
	queueMaxLimit = 5;
}

function resolveACQueue(PIDAC){
	return new Promise(function(resolve, reject){
		var PIDObj = {};
		PIDObj.pid = PIDAC;
		queueHash.push(PIDObj);
		intervalArr[PIDAC] = setInterval(function(){
			if(queueHash[0] && queueHash[0].pid == PIDAC && queueCount < queueMaxLimit){
				queueCount++;
				clearInterval(intervalArr[PIDAC]);
				if(queueMaxLimit==1){
					setTimeout(function(){
						queueHash = queueHash.slice(1, queueHash.length);
						resolve(PIDAC);
					}, 1000);
				}
				else {
					queueHash = queueHash.slice(1, queueHash.length);
					resolve(PIDAC);
				}
			}
		},100);
	});
}
var couponData = {};
function autoCouponAPI(passData, resp){
	// alert("autoCouponAPI called"+resp);
	var passBack = JSON.parse(passData);
	postFields = passBack[0].postFields;
	var api = passBack[0].api;
	var method = passBack[0].method;
	if(passBack[0].site){
		var site = passBack[0].site;
	}
	else{
		var site = 0;
	}
	var codeField = "";
	var otherFields = "";
	for(field in postFields){
		if(postFields[field] == "**"){
			codeField = field;
		}
		else{
			otherFields += field + "=" + postFields[field] + "&";
		}
	}
	// console.log("877: "+otherFields)
	resp = resp.split("~");
		// console.log("879-resp: "+resp.length)
		for(var r=0;r<(resp.length-1);r++){
			// console.log("881r: "+resp[r]);
			var code = resp[r];
			if(code.trim()!=""){
				if(codeField != ""){
					var finalPostField = codeField+"="+code+"&"+otherFields;
				}
				else{
					var finalPostField = "";
				}
				if(finalPostField != ""){
					if(finalPostField[finalPostField.length-1] == "&"){
						finalPostField = finalPostField.slice(0, finalPostField.length-1);
					}
				}
				// console.log("895: "+finalPostField);
				var PIDAC = parseInt(20000*Math.random());
				var dataObj = {};
				dataObj["api"] = api;
				dataObj["finalPostField"] = finalPostField;
				dataObj["code"] = code;
				dataObj["method"] = method;
				dataObj["site"] = site;
				couponData[PIDAC] = dataObj;
				// console.log("895: "+JSON.stringify(couponData));

				resolveACQueue(PIDAC).then(function(dataSome){
					 // alert("920-resolveACQueue"+JSON.stringify(dataSome));
					callACAPIs(dataSome).then(function(data){
						// console.log("905: "+JSON.stringify(data));
						startSaving(data);
					});
				});

			}
		}
	}


	function doneSavingCheckFn(){
		if(localStorage.getCoupons){
			var codes = localStorage.getCoupons;
			codes = codes.split("~");
			codes = codes.length - 1;
		}
		else{
			codes = 0;
		}
		if(doneSavingCheck >= codes || localStorage.doneSavingCheck >= codes){
			return 1;
		}
		else{
			return 0;
		}
	}

	function releaseAppliedTata(code){
		return new Promise(function(resolve, reject){
			var guid = $("#guid").val();
			var appliedCpn = code;
			var timeStamp =  Math.floor(Date.now());
			$.get("https://www.tatacliq.com/checkout/multi/coupon/release?couponCode="+appliedCpn+"&guid="+guid+"&_="+timeStamp).success(function(){
				resolve("done");
			});
		});
	}

	function callACAPIs(PIDAC){
		return new Promise(function(resolve, reject){
			var api = couponData[PIDAC]['api'];
			var finalPostField = couponData[PIDAC]['finalPostField'];
			var code = couponData[PIDAC]['code'];
			// console.log("code: "+code);
			var method = couponData[PIDAC]['method'];
			var site = couponData[PIDAC]['site'];
			var finalResp = [];
			if(code.trim()==""){
				resolve("");
				return;
			}
			if(method == "GET"){
				if(api.split("**").length > 1 && code.trim() != "" && code.trim() != "**"){
					api = api.split("**").join(code).trim();
				}
				$.get(api+"?"+finalPostField, {})
				.success(function(data){
					finalResp = [{"data": data, "code": code}];
					finalResp = JSON.stringify(finalResp);
					dispProgressBar(doneSavingCheck);
					if(parseInt(site) == 2190){
						releaseAppliedTata(code).then(function(argg){
							queueCount--;
						});
					}
					else{
						queueCount--;
					}
				// displayEachCpnTimer(code);
				resolve(finalResp);
			})
				.fail(function(data){
					finalResp = [{"data": data, "code": code}];
					finalResp = JSON.stringify(finalResp);
					dispProgressBar(doneSavingCheck);
					if(parseInt(site) == 2190){
						releaseAppliedTata(code).then(function(argg){
							queueCount--;
						});
					}
					else{
						queueCount--;
					}
				// displayEachCpnTimer(code);
				resolve(finalResp);
			});
			}
			else if(method == "POST"){
				if(api.split("**").length > 1 && code.trim() != "" && code.trim() != "**"){
					api = api.split("**").join(code).trim();
				}


		else{
			$.post(api, finalPostField)
			.success(function(data){
				finalResp = [{"data": data, "code": code}];
				finalResp = JSON.stringify(finalResp);
				dispProgressBar(doneSavingCheck);
				queueCount--;
				// displayEachCpnTimer(code);
				resolve(finalResp);
			})
			.fail(function(data){
				finalResp = [{"data": data, "code": code}];
				finalResp = JSON.stringify(finalResp);
				dispProgressBar(doneSavingCheck);
				queueCount--;
				// displayEachCpnTimer(code);
				resolve(finalResp);
			});
		}
	}
	else if(code.trim() != "" && code.trim() != "**" && (site == 14 || site == 29)){
		var finalPostFieldSpcl = {};
		if(site == 14){
			finalPostFieldSpcl["promocode"] = code;
			finalPostFieldSpcl["action"] = "applypromo";
			// finalPostFieldSpcl["channel"] = "channel";
			// finalPostFieldSpcl["version"] = 2;
			finalPostFieldSpcl = JSON.stringify(finalPostFieldSpcl);
		}
		else if(localStorage.cart){
			var cartItems = localStorage.cart;
			cartItems1 = JSON.parse(cartItems).cart_items;
			finalPostFieldSpcl["cart_items"] = cartItems1;
			finalPostFieldSpcl["promocode"] = code.trim();
			finalPostFieldSpcl = JSON.stringify(finalPostFieldSpcl);
		}
		else{
			finalPostFieldSpcl = finalPostField;
		}
		var authorizationToken = document.cookie;
		if(authorizationToken.split("XSRF-TOKEN=").length > 1){
			authorizationToken = authorizationToken.split("XSRF-TOKEN=");
			authorizationToken = authorizationToken[1];
			authorizationToken = authorizationToken.split(";");
			authorizationToken = authorizationToken[0].trim();
		}
		else{
			authorizationToken = "";
		}
		$.ajax({
			type: "POST",
			beforeSend: function(request) {
				request.setRequestHeader("x-csrf-token", authorizationToken);
				request.setRequestHeader("x-xsrf-token", authorizationToken);
			},
			url: api,
			dataType: "json",
			data: finalPostFieldSpcl,
			contentType: "application/json;  charset=utf-8"
		})
		.success(function(data){
			finalResp = [{"data": data, "code": code}];
			finalResp = JSON.stringify(finalResp);
			dispProgressBar(doneSavingCheck);
			queueCount--;
				// displayEachCpnTimer(code);
				resolve(finalResp);
			})
		.fail(function(data){
			finalResp = [{"data": data, "code": code}];
			finalResp = JSON.stringify(finalResp);
			dispProgressBar(doneSavingCheck);
			queueCount--;
				// displayEachCpnTimer(code);
				resolve(finalResp);
			});
	}
	else if(code.trim() != "" && code.trim() != "**" && site == 40){
		var finalPostFieldSpcl = {};
		finalPostField = {};
		if(localStorage.getPostFieldsPS && localStorage.getPostFieldsPS != ""){
			finalPostFieldSpcl = JSON.parse(localStorage.getPostFieldsPS);
			finalPostFieldSpcl["coupon_code"] = code.trim();
		}
		else{
			finalPostFieldSpcl = createData();
			finalPostFieldSpcl["coupon_code"] = code.trim();
		}
		finalPostField["cart"] = finalPostFieldSpcl;
		finalPostField["applyCoupon"] = true;
		finalPostField = JSON.stringify(finalPostField);
		$.ajax({
			url: api,
			type: "POST",
			dataType: "json",
			data: finalPostField,
			contentType: "application/json"
		})
		.success(function(data){
			finalResp = [{"data": data, "code": code}];
			finalResp = JSON.stringify(finalResp);
			dispProgressBar(doneSavingCheck);
			queueCount--;
				// displayEachCpnTimer(code);
				resolve(finalResp);
			})
		.fail(function(data){
			finalResp = [{"data": data, "code": code}];
			finalResp = JSON.stringify(finalResp);
			dispProgressBar(doneSavingCheck);
			queueCount--;
				// displayEachCpnTimer(code);
				resolve(finalResp);
			});
	}
	else if(code.trim() != "" && code.trim() != "**" && site == 11){
		if(!localStorage.mmtPostFields || localStorage.mmtPostFields == ""){
			var finalPostFieldSpcl = createData();
			finalPostFieldSpcl = finalPostFieldSpcl.split("~*~");
		}
		else{
			var finalPostFieldSpcl = localStorage.mmtPostFields;
			finalPostFieldSpcl = finalPostFieldSpcl.split("~*~");
		}
		var finalPostField = {};
		var noOfAdults = finalPostFieldSpcl[0];
		var noOfChildren = finalPostFieldSpcl[1];
		var noOfInfants = finalPostFieldSpcl[2];
		var deptDate = finalPostFieldSpcl[3];
		var airlineCodes = finalPostFieldSpcl[4];
		var bookingAmount = finalPostFieldSpcl[5];
		var fromCity = finalPostFieldSpcl[6];
		var toCity = finalPostFieldSpcl[7];
		var tripType = finalPostFieldSpcl[8];
		var searchKey = finalPostFieldSpcl[9];
		var departureEndDate = finalPostFieldSpcl[10];
		var preTaxAmount = finalPostFieldSpcl[11];
		finalPostField["code"] = code;
		finalPostField["emailID"] = "";
		finalPostField["productCode"] = "FLT";
		finalPostField["noOfAdults"] = noOfAdults;
		finalPostField["noOfChildren"] = noOfChildren;
		finalPostField["noOfInfants"] = noOfInfants;
		finalPostField["deptDate"] = deptDate;
		finalPostField["airlineCodes"] = airlineCodes;
		finalPostField["bookingAmount"] = bookingAmount;
		finalPostField["fromCity"] = fromCity;
		finalPostField["toCity"] = toCity;
		finalPostField["tripType"] = tripType;
		finalPostField["searchKey"] = searchKey;
		finalPostField["loggedInStatus"] = false;
		finalPostField["departureEndDate"] = departureEndDate;
		finalPostField["preTaxAmount"] = preTaxAmount;
		finalPostField = JSON.stringify(finalPostField);

		$.ajax({
			url: api,
			type: "POST",
			dataType: "json",
			data: finalPostField,
			contentType: "application/json"
		})
		.success(function(data){
			finalResp = [{"data": data, "code": code}];
			finalResp = JSON.stringify(finalResp);
			dispProgressBar(doneSavingCheck);
			queueCount--;
				// displayEachCpnTimer(code);
				resolve(finalResp);
			})
		.fail(function(data){
			finalResp = [{"data": data, "code": code}];
			finalResp = JSON.stringify(finalResp);
			dispProgressBar(doneSavingCheck);
			queueCount--;
				// displayEachCpnTimer(code);
				resolve(finalResp);
			});
	}
	else if(code.trim() != "" && code.trim() != "**" && method == "POST" && site == 25){
		finalPostField = createData();
		finalPostField.OfferRequest.OfferCode = code.trim();
		$.ajax({
			url: api,
			method: "POST",
			data: finalPostField
		})
		.success(function(data){
			finalResp = [{"data": data, "code": code}];
			finalResp = JSON.stringify(finalResp);
			dispProgressBar(doneSavingCheck);
			queueCount--;
				// displayEachCpnTimer(code);
				resolve(finalResp);
			})
		.fail(function(data){
			finalResp = [{"data": data, "code": code}];
			finalResp = JSON.stringify(finalResp);
			dispProgressBar(doneSavingCheck);
			queueCount--;
				// displayEachCpnTimer(code);
				resolve(finalResp);
			});
	}
	else if(code.trim() != "" && code.trim() != "**" && method == "POST" && site == 12){
		finalPostField = localStorage.goibiboPostFields;
		if(finalPostField.split("~*~").length > 1){
			var bookingData = "";
			var faredict = "";
			var mealcodes = "";
			var querydata = "";
			var leadCodes = "";
			if(finalPostField != undefined || finalPostField != ""){
				finalPostField = finalPostField.split("~*~");
				bookingData = finalPostField[0];
				faredict = finalPostField[1];
				mealcodes = finalPostField[2];
				querydata = finalPostField[3];
			}
			else{
				finalPostField = createData();
				finalPostField = finalPostField.split("~*~");
				bookingData = finalPostField[0];
				faredict = finalPostField[1];
				mealcodes = finalPostField[2];
				querydata = finalPostField[3];
			}
			if(faredict != "" && JSON.parse(faredict).faredict && JSON.parse(faredict).faredict.leadcodes){
				leadCodes = JSON.parse(faredict).faredict.leadcodes;
			}
			finalPostField = {"bookingdata": bookingData, "code": code, "leadcodes": leadCodes, "mealcodes": mealcodes, "baggagecodes": "", "querydata": querydata, "multicity": "", "faredict": faredict}
		}
		else{
			promo = {};
			promo["promo"] = code.toUpperCase();
			finalPostField = {"token": localStorage.goibiboPostFields, "applied_addons": promo };
			// finalPostField = JSON.stringify(finalPostField);
		}
		$.ajax({
			url: api,
			method: "POST",
			data: finalPostField
		})
		.success(function(data){
			finalResp = [{"data": data, "code": code}];
			finalResp = JSON.stringify(finalResp);
			dispProgressBar(doneSavingCheck);
			queueCount--;
			resolve(finalResp);
		})
		.fail(function(data){
			finalResp = [{"data": data, "code": code}];
			finalResp = JSON.stringify(finalResp);
			dispProgressBar(doneSavingCheck);
			queueCount--;
			resolve(finalResp);
		});
	}
	else if(code.trim() != "" && code.trim() != "**" && method == "POST" && site == 1829){
		var transID = $("#lngTransId").val();
		var emailBMS = $("#spnFilledEmail").text().trim();
		var mobBMS = $("#spnFilledMobile").text().trim();
		if(mobBMS.split("+91").length > 1){
			mobBMS = mobBMS.split("+91");
			mobBMS = mobBMS[1].trim();
		}
		var ipAdd = $(".ip-address span:eq(0)").text().trim();
		var p1 = {
			"uip" :code,
			"email" :emailBMS,
			"mob" :mobBMS,
			"card_no" :"",
			"nb_code" :ipAdd
		}

		let finalPostField = {
			"a": "WEB",
			"v": "CCRM",
			"t": transID,
			"c": "SETOFFERVIACOMP",
			"p1": JSON.stringify(p1),
			"p2": "",
			"p3": "",
			"p4": "",
			"p5": "",
			"p6": "",
			"p7": "",
			"p8": "",
			"p9": "",
			"p10": ""
		}
		$.ajax({
			url: api,
			method: "POST",
			data: finalPostField
		})
		.success(function(data){
			dataBMS = data;
			if($(dataBMS).length > 0){
				dataBMS = $(dataBMS)[0].documentElement;
			}
			finalResp = [{"data": dataBMS, "code": code}];
			dispProgressBar(doneSavingCheck);
			queueCount--;
			resolve(finalResp);
		})
		.fail(function(data){
			finalResp = [{"data": data, "code": code}];
			finalResp = JSON.stringify(finalResp);
			dispProgressBar(doneSavingCheck);
			queueCount--;
			resolve(finalResp);
		});
	}
	else if(code.trim() != "" && code.trim() != "**" && site == 1822){
		var finalPostFieldSpcl = localStorage.swiggyPostFields;
		finalPostFieldSpcl = JSON.parse(finalPostFieldSpcl);
		finalPostFieldSpcl.cart.couponCode = code;
		finalPostFieldSpcl = JSON.stringify(finalPostFieldSpcl);
		$.ajax({
			type: "POST",
			url: api,
			dataType: "json",
			data: finalPostFieldSpcl,
			contentType: "application/json"
		})
		.success(function(data){
			finalResp = [{"data": data, "code": code}];
			finalResp = JSON.stringify(finalResp);
			dispProgressBar(doneSavingCheck);
			queueCount--;
			resolve(finalResp);
		})
		.fail(function(data){
			finalResp = [{"data": data, "code": code}];
			finalResp = JSON.stringify(finalResp);
			dispProgressBar(doneSavingCheck);
			queueCount--;
			resolve(finalResp);
		});
	}
});
}




function selectorExists(selectors, checkWhat){
	return new Promise(function(resolve, reject){
		var flagSel = 0;
		for(var s=0;s<selectors.length;s++){
			var selector = selectors[s];
			if(checkWhat == 1){
				if($(selector).length > 0){
				}
				else{
					flagSel = 1;
				}
			}
			else{
				if($(selector).length == 0){

				}
				else{
					flagSel = 1;
				}
			}
		}
		if(flagSel == 1){
			var intSelect = setInterval(function(){
				var flagSel = 0;
				for(var s=0;s<selectors.length;s++){
					var selector = selectors[s];
					if(checkWhat == 1){
						if($(selector).length > 0){
						}
						else{
							flagSel = 1;
						}
					}
					else{
						if($(selector).length == 0){

						}
						else{
							flagSel = 1;
						}
					}
				}
				if(flagSel==0){
					clearInterval(intSelect);
					resolve(1);
				}
			}, 300);
		}
		else {
			resolve(1);
		}
	});
}

var someintervalArr = [];
function dispProgressBar(doneACTill){
	doneACTill = parseInt(doneACTill);

	return new Promise(function(resolve, reject){
		if(doneACTill == -1){
			doneACTill = 0;
		}

		if(typeof(hkAutoCoup)!="undefined" && $("#hk-autoCoupon.hk-c-modals--open").length == 0 && doneACTill == 0){
			if(apiCase == 0){
				$("#hk-autoCoupon").find(".hk-c-modal").removeClass("hk-ext-slideInDown--center");
			}
			// alert("1420-dispProgressBar called-"+doneACTill);
			hkAutoCoup.openAutoCoup();
		}
		var couponArray = [];
		var dt1 = parseInt(doneACTill);
		var lenArray = localStorage.getCoupons;
		// console.log("1514-"+JSON.stringify(lenArray));
		couponArray = lenArray.split("~");
		// console.log("1516-"+dt1+"-"+JSON.stringify(couponArray));
		lenArray = couponArray.length-1;
		if(lenArray > 0){
			var perDone = (parseInt(dt1)+1)/lenArray;
			perDone = perDone*100;
			perDone = parseInt(perDone);
			var displayBest = getBestToDisplay();
			var bestSavingDisplay = displayBest.split("~~")[0].trim();
			var bestCouponDisplay = displayBest.split("~~")[1].trim();
			displayEachCpnTimer(couponArray[parseInt(dt1)]);
			someintervalArr[parseInt(doneACTill)] = setInterval(function(){
				var perDone = (dt1+1)/lenArray;
				perDone = perDone*100;
				perDone = parseInt(perDone);
				if($('.hk-c-progress__inner').length > 0 && typeof(perDone) != "undefined" && $('.hk-c-progress__inner').attr("data-progress") && ($('.hk-c-progress__inner').attr("data-progress") == perDone) || (apiCase==1 && $("#hk-autoCoupon.hk-c-modals--open").length > 0)){
					// console.log("1440-if");
					clearInterval(someintervalArr[parseInt(doneACTill)]);
					$('.hk-c-progress__inner').css("width", parseInt(perDone) + "%");
					$('.hk-c-progress__inner').attr("data-progress", parseInt(perDone));
					if(parseInt(bestSavingDisplay) != 0 && bestCouponDisplay.trim() != ""){
						$(".hk-aCoup__netSavings b:eq(0)").text(parseInt(bestSavingDisplay));
						$(".hk-js-autoCoup__bestCouponTill").text(bestCouponDisplay.toUpperCase());
					}
					$(".hk-aCoup__coupsTried").text(parseInt(dt1)+1);
					$(".hk-aCoup__coupsTot").text("/"+lenArray);
					resolve("done");
				}
				else {
					// console.log("1453-else");
					if(typeof(hkAutoCoup)!="undefined" && $('.hk-c-progress__inner').length == 0){
						if(apiCase == 0){
							$("#hk-autoCoupon").find(".hk-c-modal").removeClass("hk-ext-slideInDown--center");
						}
						hkAutoCoup.openAutoCoup();
					}
					var perDone = (parseInt(dt1)+1)/lenArray;
					perDone = perDone*100;
					perDone = parseInt(perDone);
					$('.hk-c-progress__inner').css("width", perDone + "%");
					$('.hk-c-progress__inner').attr("data-progress", perDone);
					if(parseInt(bestSavingDisplay) != 0 && bestCouponDisplay.trim() != ""){
						$(".hk-aCoup__netSavings b:eq(0)").text(parseInt(bestSavingDisplay));
						$(".hk-js-autoCoup__bestCouponTill").text(bestCouponDisplay.toUpperCase());
					}
					$(".hk-aCoup__coupsTried").text(parseInt(dt1)+1);
					$(".hk-aCoup__coupsTot").text("/"+lenArray);
				}
			},200);

		}
		else {
			resolve("done");
		}

	});
	return;
}

function displayFinalSavings(){
	// alert("displayFinalSavings");
	if(typeof(hkAutoCoup) != "undefined"){
		var displayBest = getBestToDisplay();
		var bestSavingDisplay = displayBest.split("~~")[0].trim();
		var bestCouponDisplay = displayBest.split("~~")[1].trim();
		if($("#hk-autoCoupon.hk-c-modals--open").length == 0){
			if(apiCase == 0){
				$("#hk-autoCoupon").find(".hk-c-modal").removeClass("hk-ext-slideInDown--center");
			}
			hkAutoCoup.openAutoCoup();
		}
		hkAutoCoup.loadContent('success');
		$(".hk-aCoup__netSavings b:eq(0)").text(bestSavingDisplay);
		$(".hk-js-autoCoup__bestCouponTill").text(bestCouponDisplay.toUpperCase());
		localStorage.hkGlobalApplied = 1;
		displayFinalSavingsSide();
		return;
	}
	else{
		setTimeout(displayFinalSavings, 500);
	}
}

function displayNoSavings(){
	// alert("displayNoSavings");
	if(typeof(hkAutoCoup) != "undefined"){
		displaySideCoupons(localStorage.getCoupons).then(function(args){
			var couponLen = localStorage.getCoupons.trim();
			couponLen = couponLen.split("~").length-1;
			if($("#hk-autoCoupon.hk-c-modals--open").length == 0){
				if(apiCase == 0){
					$("#hk-autoCoupon").find(".hk-c-modal").removeClass("hk-ext-slideInDown--center");
				}
				hkAutoCoup.openAutoCoup();
			}
			hkAutoCoup.loadContent('failed');

			$(".hk-coup-length").text(couponLen);
			initializeLocaStorage();
			localStorage.hkGlobalApplied = 2;
			if(localStorage.anaSent!=1){
				localStorage.anaSent = 1;
				var host=window.location.host;
				var jsonArr = [{'type': 'finish2','website':host}];
				jsonArr = JSON.stringify(jsonArr);
				sendMessage(1, jsonArr,22,doNothing, []);
				// tracer(1,4);
				// setTimeout(function(){if(JSON.parse(features_json)[4]==0){ft(4);}},100);
			}
			return;
		});
	}
	// else{
	// 	setTimeout(displayNoSavings, 1000);
	// }
}

function initializeLocaStorage(){
	localStorage.acStarted = 0;
	localStorage.bestCoupon = "";
	localStorage.bestSaving = 0;
	localStorage.acDetails = "";
	localStorage.lastCoupon = "";
	localStorage.getCoupons = "";
	localStorage.showPostLoad = 0;
	localStorage.clickedRemove = 0;
	localStorage.bestCouponHere = "";
	localStorage.bestSavingHere = 0;
	localStorage.doneACTill = 0;
	localStorage.showFinalSavings = 0;
	localStorage.allCpnText = "";
	return;
}
// if(!localStorage.someMoney){
// 	localStorage.someMoney = "some money";
// }

function getBestToDisplay(){
	if(localStorage.bestSaving && localStorage.bestSaving != 0 && localStorage.bestSaving != "0"){
		var bestSavingDisplay = localStorage.bestSaving;
	}
	else if(typeof(bestSaving) != "undefined"){
		var bestSavingDisplay = bestSaving;
	}
	else{
		var bestSavingDisplay = 0;
	}
	if(localStorage.bestCoupon && localStorage.bestCoupon != ""){
		var bestCouponDisplay = localStorage.bestCoupon;
	}
	else if(typeof(bestCoupon) != "undefined"){
		var bestCouponDisplay = bestCoupon;

	}
	else{
		var bestCouponDisplay = "";
	}
	return bestSavingDisplay+"~~"+bestCouponDisplay;
}

if(!localStorage.hkGlobalApplied){
	localStorage.hkGlobalApplied = 0;
}
if(!localStorage.acReApply){
	localStorage.acReApply = 0;
}
$(document).on("click", ".hk-aCSLLi__reApply",function(){
	var coupon = $(this).parent().parent().attr("data-code");
	var saving = $(this).parent().parent().attr("data-saving");
	var ecash = $(this).parent().parent().attr("data-ecash");
	localStorage.acReApply = 1;
	if(saving == 0 && ecash > 0){
		bestSaving = ecash;
		localStorage.bestSavingnHere = ecash;
		localStorage.bestSaving = ecash;
	}
	else if(saving > 0){
		bestSaving = saving;
		localStorage.bestSavingnHere = saving;
		localStorage.bestSaving = saving;
	}
	bestCoupon = coupon;
	localStorage.bestCoupon = coupon;
	localStorage.bestCouponHere = coupon;
	mainClick = 0;
	clickRemove = 0;
	clickedRemove = 0;
	localStorage.clickedRemove = 0;

	if(localStorage.anaSent!=1 && parseInt(bestSaving) != 0 && bestSaving!="" && !isNaN(parseInt(bestSaving))){
		localStorage.anaSent = 1;
		var host=window.location.host;
		var jsonArr = [{'type': 'finish1','website':host}];
		jsonArr = JSON.stringify(jsonArr);
		sendMessage(1, jsonArr,22,doNothing, []);
		tracer(1,4);
		setTimeout(function(){if(JSON.parse(features_json)[4]==0){ft(4);}},100);
	}
	else if(localStorage.anaSent!=1 && parseInt(bestSaving) == 0){
		localStorage.anaSent = 1;
		var host=window.location.host;
		var jsonArr = [{'type': 'finish2','website':host}];
		jsonArr = JSON.stringify(jsonArr);
		sendMessage(1, jsonArr,22,doNothing, []);
		tracer(1,4);
		setTimeout(function(){if(JSON.parse(features_json)[4]==0){ft(4);}},100);
	}
	applyBestCoupon();
	if(localStorage.hkGlobalApplied == 1){
		hkDummyModal.fill({
			header: `Coupon Applied Successfully`,
			main: `Coupon Code <b>${coupon}</b> has been applied.`,
			footer: `<div class="hk-u-flexChild--right">
			<button class="hk-c-btn hk-c-btn--outline hk-js-modal__close hk-js-focusOnOpen">Okay</button>
			</div>`
		});
		hkOpenModal('hk-modal__dummy');
		localStorage.hkGlobalApplied = 0;
	}
	else if(localStorage.hkGlobalApplied == 2){
		hkDummyModal.fill({
			header: `Something went wrong`,
			main: `Please reload the page and try again.`,
			footer: `<div class="hk-u-flexChild--right">
			<button class="hk-c-btn hk-c-btn--outline hk-js-modal__close hk-js-focusOnOpen">Okay</button>
			</div>`
		});
		hkOpenModal('hk-modal__dummy');
		localStorage.hkGlobalApplied = 0;
	}
});
