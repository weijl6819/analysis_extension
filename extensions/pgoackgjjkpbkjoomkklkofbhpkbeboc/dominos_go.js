
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
 var cur_url = window.location.href;
 if(cur_url.split("dominos.co.in/review/order").length > 1){
  var selectorACIcon = ".freedomCoupon";
  var position = "after";
  var parent = "none";
  var method = "POST";
  var api = "https://pizzaonline.dominos.co.in/redeem/coupon";
  var postFields = {"coupon_code": "**"};
  var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1}];
  details = JSON.stringify(details);
  displayACIcon(selectorACIcon, parent, position, 56, details);
  if(localStorage.showFinalSavings && localStorage.showFinalSavings == 1){
    displayFinalSavings();
    $(".hk-aCoup__netSavings b:eq(0)").text(localStorage.bestSaving);
    $(".hk-js-autoCoup__bestCouponTill").text(localStorage.bestCoupon.toUpperCase());
  }
}

if(!localStorage.savings){
  localStorage.savings = "";
}
if(!localStorage.bestSaving){
  localStorage.bestSaving = 0;
}
if(!localStorage.bestCoupon){
  localStorage.bestCoupon = "";
}
savings = [];
bestSaving = 0;
bestCoupon = "";
bestECoupon = "";
bestEcash = 0;

couponDomId = "";
couponDomCode = "";

function removeDomCpn(data){
  return new Promise(function(resolve, reject){
    if(couponDomCode == "" || couponDomId == ""){
     if($(".hidden_coupon_id").length > 0){
      couponDomId = $(".hidden_coupon_id").val();
      couponDomCode = $(".hidden_coupon_code").val();
    }
  }
  // console.log("removeDomCpn was called with couponDomCode "+couponDomCode);
  // console.log("removeDomCpn was called with couponDomId "+couponDomId);
  if(couponDomCode != "" && couponDomId != ""){
    $.post("https://pizzaonline.dominos.co.in/reverse/coupon", {coupon_id: couponDomId, coupon_code: couponDomCode, csrf_token: ""}).success(function(resp){
      couponDomCode = "";
      couponDomId = "";
      resolve(data);
    });
  }
  else{
    resolve(data);
  }
});
}

function startSaving(data){
  data = JSON.parse(data);
  var nowCode = "";
  var nowSaving = "";
  var resp = data[0].data;
  var code = data[0].code.trim();
  var ecashsaving = 0;
  var csaving = 0;
  var ecashsaving = 0;
  nowCode = code;
  // console.log("startSaving was called with code "+code);
  // console.log("startSaving was called with couponDomCode "+couponDomCode);
  // console.log("startSaving was called with couponDomId "+couponDomId);
  var savingsObject = {};
  resp = JSON.parse(resp);
  if(resp != "" && code != ""){
    if(resp.status){
      respYatra = resp;
      if(resp.data && resp.data.coupon_info && resp.data.coupon_info.discount_price && resp.data.coupon_info.coupon_code.toUpperCase().trim() == code.toUpperCase().trim()){
        csaving = resp.data.coupon_info.discount_price;
        csaving = filter_price(csaving);
        if(resp.data.coupon_info.applied_coupon_line_id){
          couponDomId = resp.data.coupon_info.applied_coupon_line_id;
          couponDomCode = resp.data.coupon_info.coupon_code;
          // console.log("couponDomId: "+couponDomId);
          // console.log("couponDomCode: "+couponDomCode);
        }
      }
      if(isNaN(csaving)){
        csaving = 0
      }
      else if(csaving > bestSaving){
        bestSaving = csaving;
        bestCoupon = code;
        localStorage.bestSaving = bestSaving;
        localStorage.bestCoupon = code;
      }
      if(isNaN(ecashsaving)){
        ecashsaving = 0
      }
      else if(ecashsaving > bestEcash){
        bestEcash = ecashsaving;
        bestECoupon = code;
      }
    }
  }
  var savingsLen = savings.length;
  savingsObject["code"] = code;
  savingsObject["saving"] = csaving;
  savingsObject["ecash"] = ecashsaving;
  savings[savingsLen] = savingsObject;
  localStorage.savings = JSON.stringify(savings);
  doneSavingCheck++;
  if(doneSavingCheckFn() == 1){
    // console.log("applyBestCoupon was called from 1");
    removeDomCpn(data).then(function(ress){
      applyBestCoupon();
    });
    if(localStorage.anaSent!=1 && parseInt(bestSaving) != 0 && bestSaving!="" && !isNaN(parseInt(bestSaving))){
      localStorage.anaSent = 1;
      var host=window.location.host;
      var jsonArr = [{'type': 'finish1','website':host}];
      jsonArr = JSON.stringify(jsonArr);
      sendMessage(1, jsonArr,22,doNothing, []);
      tracer(1,4);
      setTimeout(function(){if(JSON.parse(features_json)[4]==0){ft(4);}},100);
    }
  }
  else{
    displayAutoSaving(bestSaving);
  }
}

var mainClick = 0;

function applyBestCoupon(){
  if(parseInt(bestSaving) != 0 && bestCoupon.trim() != ""){
    // console.log("apply bestCoupon: "+bestCoupon+" saving would be "+bestSaving);
    $.post("https://pizzaonline.dominos.co.in/redeem/coupon", {coupon_code: bestCoupon}).then(function(dataa){
      localStorage.showFinalSavings = 1;
      window.location.reload();
    });
  }
  else{
    displayNoSavings();
  }
}
