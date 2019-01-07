
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
if(cur_url.split(".myntra.com/checkout/cart").length > 1){
  var checkPick = ".coupon-section .actions .delete-coupon";
  var selector = ".coupon-section .actions .delete-coupon:eq(0)";
  var attr = "data-coupon";
  var webID = 111;
  var homeLink = "http://www.myntra.com/";
  pickAppliedCpn(checkPick, selector, attr, webID, homeLink);

  if($(".coupon-section").length > 0 && $("#couponClick").length == 0){
    var selectorACIcon = ".coupon-section:eq(0)";
    var position = "after";
    var parent = "none";
    var method = "POST";
    var api = "https://www.myntra.com/checkout/cart";
    var tokencode=$( "input[name='_token']" )[0].value;
    var postFields = {token:tokencode , coupon:"**", operation: "APPLY_COUPON"};
    var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1}];
    details = JSON.stringify(details);
    arrayMsg = [];
    displayACIcon(selectorACIcon, parent, position, 4, details);
    keepCheckingACIcon(selectorACIcon, parent, position, 4, details);
  }
}

savings = [];
bestSaving = 0;
bestCoupon = "";




// console.log(document.cookie);
// if(chrome.extension.getURL('auto_myntra.js')){
  // var s3 = document.createElement('script');
  // s3.src = chrome.extension.getURL('auto_myntra.js');
  // (document.head || document.documentElement).appendChild(s3);
// }

function startSaving(data1){
  data1 = JSON.parse(data1);
  var nowCode = "";
  var nowSaving = "";
  var resp = data1[0].data;
  var code = data1[0].code.trim();
  var csaving = 0;
  var ecashing = 0;
  var savingsObject = {};
  var cpnMsg = "";
  nowCode = code;
  respYatra = resp;
  if(resp != "" && code != ""){
    if(resp.status && resp.status == "error" && resp.message){
      cpnMsg = resp.message;
      arrayMsg.push([code, encodeURIComponent(cpnMsg), 111]);
    }
    else{
      wrapper= document.createElement('div');
      $(wrapper).html(resp);
      if($(wrapper).find(".order-summary-span").length > 0 && $(wrapper).find(".order-summary-span .coupon").length > 0){
        var csaving = $(wrapper).find(".order-summary-span .coupon:eq(0) span:eq(0)").text().trim();
        csaving = filter_price(csaving);
        if(isNaN(csaving)){
          csaving = 0
        }
        else if(csaving > bestSaving){
          bestSaving = csaving;
          bestCoupon = code;
        }
        if(csaving > 0){
          cpnMsg = "SUCCESS";
          arrayMsg.push([code, encodeURIComponent(cpnMsg), 111]);
        }
      }
    }
  }
  var savingsLen = savings.length;
  savingsObject["code"] = code;
  savingsObject["saving"] = csaving;
  savingsObject["ecash"] = ecashing;
  savings[savingsLen] = savingsObject;
  localStorage.savings = JSON.stringify(savings);
  displayEachCpnSaving(code, csaving, ecashing);
  doneSavingCheck++;
    // console.log("doneSavingCheck: "+doneSavingCheck);
    // console.log("doneSavingCheckFn: "+doneSavingCheckFn());
    if(doneSavingCheckFn() == 1){
    // console.log("calling applyBestCoupon from here");
    applyBestCoupon();
    if(localStorage.anaSent!=1 && parseInt(bestSaving) != 0 && bestSaving!="" && !isNaN(parseInt(bestSaving))){
      localStorage.anaSent = 1;
      var host=window.location.host;
      var jsonArr = [{'type': 'finish1','website':host}];
      jsonArr = JSON.stringify(jsonArr);
      sendMessage(1, jsonArr,22,doNothing, []);
      // tracer(1,4);
      // setTimeout(function(){if(JSON.parse(features_json)[4]==0){ft(4);}},100);
    }
  }
}

var deleteAC = 0;
function applyBestCoupon(){
  // console.log("applyBest was called with code : "+bestCoupon+ " savings : "+bestSaving);
  if(parseInt(bestSaving) != 0 && bestCoupon.trim() != ""){
    if($(".apply").length > 0 && $(".apply").css("display") != "none"){
      document.getElementsByClassName("apply")[0].click();
    }
    else if($(".edit-coupon").length > 0 && $(".edit-coupon").css("display") != "none"){
      document.getElementsByClassName("edit-coupon")[0].click();
    }

    if($(".enter-coupon").length > 0 && $(".enter-coupon").css("display") != "none"){
      $(".enter-coupon").val(bestCoupon.trim());
      document.getElementsByClassName("btn-apply")[0].click();
      displayFinalSavings();
    }
    else{
      // console.log("calling applyBestCoupon from self");
      setTimeout(applyBestCoupon, 1000);
    }
  }
  else{
    // console.log("Show no savings popup");
    displayNoSavings();
  }
  if(deleteAC == 0){
    if(arrayMsg.length > 0 && arrayMsg.length != ""){
      arrayMsg = JSON.stringify(arrayMsg);
      var jsonArr = [{'cpn_msg': arrayMsg}];
      jsonArr = JSON.stringify(jsonArr);
      // console.log("cpn_msg JSON: "+jsonArr);
      deleteAC = 1;
      sendMessage(1, jsonArr, 12, doNothing, []);
      arrayMsg = [];
    }
  }
}
