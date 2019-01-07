
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
settingsSelectors = ["#hk-killerDIV", ".main-hk-ext-div"];
tabID = 0;
function returnResource(name){
  return chrome.extension.getURL(name);
}

function pickAppliedCpn(checkPick, selector, attr, webID, homeLink){
  // console.log("pickAppliedCpn was called with "+selector);
  if($(checkPick).length > 0){
    var coupon = "";
    if(attr.trim() == ""){
      coupon = $(selector).text().trim();
      if(coupon == ""){
        coupon = $(selector).val().trim();
      }
    }
    else{
      coupon = $(selector).attr(attr).trim();
    }

    var someDate = new Date();
    var numberOfDaysToAdd = 5;
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    var dd = someDate.getDate();
    var mm = someDate.getMonth() + 1;
    var y = someDate.getFullYear();
    if(mm < 10){
      mm = "0"+mm;
    }
    if(dd < 10){
      dd = "0"+dd;
    }
    var expTime = y + '-'+ mm + '-'+ dd + " 23:59:59";
    if(coupon.split("(").length > 1){
      coupon = coupon.split("(");
      coupon = coupon[1];
      coupon = coupon.split(")");
      coupon = coupon[0].trim();
    }
    if(coupon != "" && coupon == coupon.toUpperCase()){
      var jsonArr = [{'coupon': encodeURIComponent(coupon.trim()), 'url': homeLink, 'expTime': expTime, 'webID': webID}];
      jsonArr = JSON.stringify(jsonArr);
      // console.log("sending with ",jsonArr);
      sendMessage(1, jsonArr, 38, doNothing, []);
    }
  }
  else{
    setTimeout(function(){
      pickAppliedCpn(checkPick, selector, attr, webID, homeLink);
    }, 3000);
  }
}


function sendMessage(msgType, jsonObj, command, funcName, passBack){

   // console.log("56"+jsonObj);
   if(command == "auto_coupon")
   {
   console.log(command);
    var port = chrome.runtime.connect({name: "auto_coupon"});
    // var strToSend = jsonObj + "~*" + command;
    port.postMessage({messageData: jsonObj});
    port.onMessage.addListener(function(data){
      port.onMessage.removeListener();
    });
  }
  // else {
  //   setTimeout(function(){sendMessage(msgType, jsonObj, command, funcName, passBack);}, 100);
  // }
}
function doNothing(data, passBack){
  // Just do nothing !!
}
function sendMessagePromise(msgType, jsonObj, command){
  return new Promise(function(resolve, reject){
// console.log(msgType);
// console.log(jsonObj);
// console.log(command);
    if(command == "auto_coupon"){
      var port = chrome.runtime.connect({name: "auto_coupon"});
      // var strToSend = jsonObj + "~*" + command;
        // console.log(jsonObj);
      port.postMessage({messageData: jsonObj});

      port.onMessage.addListener(function(data){
        port.onMessage.removeListener();
        // console.log("87-"+data.dataBack);
        resolve(data.dataBack);
      });
    }
  });
}

/* --------------------------- dummy modals . ----------- */
const hkDummyModalReset = {
 header: `Heading`,
 main: `Text`,
 footer: `<div class="hk-u-flexChild--right">
 <button class="hk-c-btn hk-c-btn--outline hk-js-modal__close hk-js-focusOnOpen">Close</button>
 </div>`
}

class hkDummyModalClass {
 constructor() {
  this.hdr = document.querySelector('.hk-js-dummyModal__headerContent');
  this.main = document.querySelector('.hk-js-dummyModal__mainContent');
  this.ftr = document.querySelector('.hk-js-dummyModal__footerContent');
}
reset() {
  this.fill(hkDummyModalReset);
}
fill(modalContents) {
  $(this.hdr).html(modalContents.header);
  $(this.main).html(modalContents.main);
  $(this.ftr).html(modalContents.footer);

  if(!!modalContents.clicks){
   modalContents.clicks.map( (el) => {
     $(`${el.item}`).click(function(){
      if(el.item==`.hk-js-autoCoupon__bank--savePref`){
          hkAutoCoup.saveBankPref();
      }
    });
   });
 }

 // $('.hk-js-modal__close', '.hk-js-dummyModals').click(hkCloseModalBinder);
 $('.hk-js-modal__close').click(hkCloseModalBinder);

}
}
let hkDummyModal;
/***************** autocoupons *********/
function hkOpenModal(modalID) {
  // console.log("u195-"+modalID);
	var $hkGlobWrapper = $('body');
	$hkGlobWrapper.addClass('hk-modal-shown');
	$('#' + modalID).addClass('hk-c-modals--open').find('.hk-c-modal').addClass('hk-ext-animated').find('.hk-js-focusOnOpen').focus();
}
class hkAutoCouponsClass{
  constructor(){
    this.hdr = document.querySelector('.hk-js-aCoup__headerContent');
    this.main = document.querySelector('.hk-js-aCoup__contentWrap');
    this.ftr = document.querySelector('.hk-js-aCoup__footerContent');
    this.state = 'play';
  }
  loadContent(msgType) {
    // alert(hkAutoCoupMsgs[msgType].headerText);
    // alert("110"+this.hdr);
   $(".hk-js-aCoup__headerContent").html(hkAutoCoupMsgs[msgType].headerText);
   $(".hk-js-aCoup__contentWrap").html(hkAutoCoupMsgs[msgType].wrapContent);
   $(".hk-js-aCoup__footerContent").html(hkAutoCoupMsgs[msgType].footerContent);
   // $(this.hdr).html(hkAutoCoupMsgs[msgType].headerText);
   // $(this.main).html(hkAutoCoupMsgs[msgType].wrapContent);
   // $(this.ftr).html(hkAutoCoupMsgs[msgType].footerContent);

   if(!!hkAutoCoupMsgs[msgType].clicks){
      hkAutoCoupMsgs[msgType].clicks.map( (el) => {
        $(`${el.item}`).click(function(){
         switch(el.item){
           case '#hk-autoCoupon .hk-js-aCoup__playPause':
              hkAutoCoup.playPause();
           break;
           case '#hk-autoCoupon .hk-js-modal__close':
              hkCloseModalBinder.call(this);
           break;
           // case '#hk-autoCoupon .hk-js-fdbkModal':
           //    hkModalKaDhakkan.call(this);
           // break;
           // case '#hk-autoCoupon .hk-js-coupSubmit__open':
           //    hkSubmitCoup.openModal();
           // break;

         }
       })
      });
    }
  }
openAutoCoup(){
 this.loadContent('inProgress');
  // alert("138-"+localStorage.doneACTill);
 if(localStorage.doneACTill != undefined && parseInt(localStorage.doneACTill) > 0){
   // alert("140-"+localStorage.doneACTill);
   var dt1 = parseInt(localStorage.doneACTill);
   var lenArray = localStorage.getCoupons;
   lenArray = lenArray.split("~");
   lenArray = lenArray.length-1;
   var perDone = (dt1+1)/lenArray;
   perDone = perDone*100;
   perDone = parseInt(perDone);
   $(".hk-aCoup__coupsTried").text(dt1+1);
   $(".hk-aCoup__coupsTot").text("/"+lenArray);
   $('.hk-c-progress__inner').css("width", perDone + "%");
   $('.hk-c-progress__inner').attr("data-progress", perDone);

   if(localStorage.bestSaving && localStorage.bestSaving != 0){
     var bestSavingDisplay = localStorage.bestSaving;
     if(localStorage.bestCoupon && localStorage.bestCoupon != ""){
       var bestCouponDisplay = localStorage.bestCoupon;
       $(".hk-aCoup__netSavings b:eq(0)").text(bestSavingDisplay);
       $(".hk-js-autoCoup__bestCouponTill:eq(0)").text(bestCouponDisplay);
     }
   }

 }
 else if(typeof(bestCoupon) != "undefined" && bestCoupon.trim() != ""){
   $(".hk-aCoup__netSavings b:eq(0)").text(bestSaving);
   $(".hk-js-autoCoup__bestCouponTill:eq(0)").text(bestCoupon);
 }
 // alert("bestCoupon: "+bestCoupon+" saving: "+bestSavingDisplay)
 hkOpenModal('hk-autoCoupon');
}
playPause(){
 this.playPauseBtn = document.querySelector('.hk-js-aCoup__playPause');

 if(this.state == 'paused'){
   this.state = 'play';
   $(this.playPauseBtn).html(`<svg viewBox="0 0 24 24" class="hk-ext__icons--small hk-u-va--bottom hk-js-aCoupPause">
   <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#hk-svg__pause" >
   </use>
   </svg>Pause Auto Apply`);
 } else if(this.state == 'play'){
   this.state = 'paused';
   $(this.playPauseBtn).html(`<svg viewBox="0 0 24 24" class="hk-ext__icons--small hk-u-va--bottom hk-js-aCoupPause">
   <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#hk-svg__play" >
   </use>
   </svg>Continue Auto Apply`);
 }
}

 }
 let hkAutoCoup;
 var isValidISBN = function(str) {
   var sum,
   weight,
   digit,
   check,
   i;

   str = str.replace(/[^0-9X]/gi, '');

   if (str.length != 10 && str.length != 13) {
     return false;
   }

   if (str.length == 13) {
     sum = 0;
     for (i = 0; i < 12; i++) {
       digit = parseInt(str[i]);
       if (i % 2 == 1) {
         sum += 3*digit;
       } else {
         sum += digit;
       }
     }
     check = (10 - (sum % 10)) % 10;
     return (check == str[str.length-1]);
   }

   if (str.length == 10) {
     var chars = str.split('');
     if(chars[9].toUpperCase() == 'X'){
       chars[9] = 10;
     }
     sum = 0;
     for (var i = 0; i < chars.length; i++) {
       sum += ((10-i) * parseInt(chars[i]));
     };
     return ((sum % 11) == 0);
   }
 }

 function populateList(ext_data){
   $ = jQuery.noConflict();
   if(document.querySelectorAll('.hk-blockedURLList').length > 0){
    var cloneSample = document.querySelectorAll('.hk-blockedURLList')[0].querySelector('li');
    if(ext_data.trim()!="[]" && ext_data.trim()!=""){
     ext_data = JSON.parse(ext_data);
     var tbl = document.querySelector(".hk-blockedURLList");
     while (tbl.firstChild) {
       tbl.removeChild(tbl.firstChild);
     }
     // document.querySelector('.hk-blockedURLList').innerHTML = ("");
     for(var k=0; k<ext_data.length; k++){
       var cloneCurrent = cloneSample.cloneNode("true");
       cloneCurrent.querySelector('.hk-blockedURLList__item').innerText = ext_data[k];
       cloneCurrent.querySelector('.hk-js-blockedList__remove').setAttribute('data-id', k);
       $('.hk-blockedURLList').append(cloneCurrent);
     }
   }
   else {
     $('.hk-js-modalBlockedList__wrapper').html("<div style='text-align:center;padding-top:30px'>You do not have any blocked URLs</div>");
   }
   $('.hk-js-blockedList__remove').click(function(event){
     var urlToRemove = $(this).parent().parent().find('.hk-blockedURLList__item').text();
     removeExtBlockList(urlToRemove);
     $(this).parent().parent().parent().remove();

     if (!document.querySelectorAll('.hk-blockedURLList__item').length) {
       $('.hk-js-modalBlockedList__wrapper').html("<div style='text-align:center;padding-top:30px'>You do not have any blocked URLs</div>");
     }
   });
 }
 else {
   setTimeout(function(){populateList(ext_data)}, 1000);
 }
}

function setExtBlockList(data, passBack){
 flagAvail = 0;
 ext_blockList = data;
 if(ext_blockList.trim()!="[]" && ext_blockList.trim()!=""){
   ext_blockList = JSON.parse(ext_blockList);
   var currentFil = window.location.href;
   currentFil = currentFil.split("&")[0];
// console.log("Checking for " + currentFil);
for(var i=0; i<ext_blockList.length; i++){
if(currentFil == ext_blockList[i]){
 flagAvail = -1;
}
}
if(flagAvail==0){
flagAvail = 1;
}
if(flagAvail!=-1 && document.getElementsByClassName('hk-sideBar').length > 0){
document.getElementsByClassName('hk-sideBar')[0].style.display = "";
}
else if(document.getElementsByClassName('hk-sideBar').length > 0){
document.getElementsByClassName('hk-sideBar')[0].style.display = "none";
}
populateList(JSON.stringify(ext_blockList));
}
else {
flagAvail = 1;
populateList(data);
}
// console.log("Value here " + ext_blockList);
}

function getExtBlockList(){
var jsonArr = [{'getBlockList': 'haiKya'}];
jsonArr = JSON.stringify(jsonArr);
var passBack = [];
passBack = JSON.stringify(passBack);
sendMessage(0, jsonArr, 0, setExtBlockList, passBack);
}

// getExtBlockList();

function removeExtBlockList(url){
var jsonArr = [{'removeFromBlockList': url}];
jsonArr = JSON.stringify(jsonArr);
var passBack = [];
passBack = JSON.stringify(passBack);
sendMessage(0, jsonArr, 0, doNothing, passBack);
}

function setExtAuth(data, passBack){
ext_auth = data;
}

function getExtAuth(){
// Gets all current alerts list
  var jsonArr = [{'ext_auth': 'haiKya'}];
  jsonArr = JSON.stringify(jsonArr);
  var passBack = [];
  passBack = JSON.stringify(passBack);
  sendMessage(0, jsonArr, 0, setExtAuth, passBack);
}

// getExtAuth();



function isFlSite(){
return false;
}

// function getProperCat(cat_init){
// var cat_so_far = "";
// if(cat_init.split("&").length==1 && cat_init.toUpperCase().split("AND").length==1 && cat_init.toUpperCase().split(",").length==1){
//  return cat_init;
// }
// else {
//  cat_init = cat_init.split("&").join(" ");
//  cat_init = cat_init.split(",").join(" ");
//  cat_split = cat_init.split(" ");
//  var cur_prod = getProd();
//  for(var k=0; k<cat_split.length; k++){
//    if(cat_split[k].trim()!=""){
//      var sing = convertSing(cat_split[k]);
//      sing = sing.split("~");
//      if(cur_prod.split(cat_split[k]).length > 1){
//            // console.log("Trying " + cat_split[k]);
//            if(cat_so_far.toLocaleLowerCase().split(cat_split[k].toLocaleLowerCase()).length ==1){
//              cat_so_far += cat_split[k] + " ";
//            }
//            // return cat_split[k];
//          }
//          for(var l=0; l<sing.length; l++){
//           if(cur_prod.toUpperCase().split(sing[l].toUpperCase()).length > 1){
//            // console.log("Trying " + sing[l]);
//            if(cat_so_far.toLocaleLowerCase().split(sing[l].toLocaleLowerCase()).length ==1){
//
//              cat_so_far += sing[l] + " ";
//            }
//          }
//        }
//      }
//    }
//  }
//  if(cat_so_far.trim()!=""){
//   return cat_so_far.trim();
// }
// else {
//  return cat_init;
// }
// return cat_init;
// }

var counter = 5;
function brahmastra(){
  counter--;
  for(var m=0;m<settingsSelectors.length;m++){
   if(document.querySelectorAll(settingsSelectors[m]).length > 0 && document.querySelectorAll(settingsSelectors[m])[0].style.display=="none"){
    document.querySelectorAll(settingsSelectors[m])[0].style.display = "block";
  }
  }
  if(counter >= 0){
  setTimeout(function(){brahmastra()},2000);
  }
  else {

  }
}

brahmastra();



function filter_price(pr){
 pr = String(pr);
 if(pr.split("Rs.").length > 1){
   pr = pr.split("Rs.")[1];
 }
 if(pr.split("Rs").length > 1){
   pr = pr.split("Rs")[1];
 }
 if(pr.split("INR").length > 1){
   pr = pr.split("INR")[1];
 }
 if(pr.split("Inr").length > 1){
   pr = pr.split("Inr")[1];
 }
 if(pr.split("RS.").length > 1){
   pr = pr.split("RS.")[1];
 }
 if(pr.split("RS").length > 1){
   pr = pr.split("RS")[1];
 }
 if(pr.split("R").length > 1){
   pr = pr.split("R")[1];
 }
 if(pr.split("`").length > 1){
   pr = pr.split("`")[1];
 }
 if(pr.split("MRP").length > 1){
   pr = pr.split("MRP")[1];
 }
 if(pr.split("mrp").length > 1){
   pr = pr.split("mrp")[1];
 }
 if(pr.split("/").length > 1){
   pr = pr.split("/")[0];
 }
 if(pr.split("₹").length > 1){
   pr = pr.split("₹")[1].trim();
 }
 if(pr.split("र").length > 1){
   pr = pr.split("र")[1].trim();
 }
 pr = pr.split(",").join("").trim();
 pr = parseFloat(pr);
 return pr;

}



hkAutoCoup = new hkAutoCouponsClass();
hkDummyModal = new hkDummyModalClass(hkDummyModalReset);
// if(!localStorage.someMoney){
//   localStorage.someMoney = "some money";
// }

const hkAutoCoupMsgs = {
  inProgress: {
    headerText: `Its worth the wait...!`,
    wrapContent: `
    <div class="hk-u-fSize--large hk-u-margin__2-a   hk-u-text__align--center">
    <b class="hk-aCoup__headingText">Trying Coupons</b>
    </div>
    <div class="hk-u-text__align--center">
    <svg viewBox="0 0 100 100" class="hk-ext__icons--semiMed hk-aCoup__coupClock">
    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#hk-svg__loading" >
    </use>
    </svg><b class="hk-u-fSize--xxlarge hk-aCoup__coupsTried">0</b><b class="hk-u-text--lighter hk-u-fSize--large hk-aCoup__coupsTot">/total</b>
    </div>
    <div class="hk-u-margin__2-a hk-c-progress">
    <div class="hk-c-progress__wrap">
    <div class="hk-c-progress__inner" style="width:0%"></div>
    </div>
    </div>
    <div class="hk-u-margin__v-2 hk-u-padding__v-2   hk-u-text__align--center">
    <div class="hk-u-fSize--big"><b>You got <span class="hk-u-fSize--large hk-u-text--lightGreen hk-aCoup__netSavings"><span class="hk-u-text--super">&#8377;</span><b>0</b></span> OFF!</b></div>
    <div class="hk-u-fSize--small hk-u-text--lighter">with coupon <b class="hk-js-autoCoup__bestCouponTill">loading...</b></div>
    </div>
    `,
    footerContent: `
    <div class="hk-u-flexChild--right">
    <button class="hk-c-btn hk-c-btn--outline hk-js-modal__close">Cancel</button>
    </div>
    `,
    clicks:
    [
    {
      item: `#hk-autoCoupon .hk-js-aCoup__playPause`,
      fn: `hkAutoCoup.playPause()`
    },
    {
      item: `#hk-autoCoupon .hk-js-modal__close`,
      fn: `hkCloseModalBinder.call(this)`
    }

    ]
  },
  success: {
    headerText: `Here You Go ! Best available offer applied !!`,
    wrapContent: `
    <div class="hk-u-text__align--center hk-u-fSize--xxlarge hk-u-margin__1-a">
    <img src="chrome-extension://`+chrome.runtime.id+`/smile_icon.png">
    </div>
    <div class="hk-u-fSize--large hk-u-text__align--center hk-u-margin__1-a">
    <b class="hk-aCoup__headingText">Hurray!</b>
    </div>

    <div class="hk-u-margin__v-15 hk-u-padding__v-2 hk-u-text__align--center">
    <div class="hk-u-fSize--big">Applied coupon that saves <br><b><span class="hk-u-fSize--large hk-u-text--lightGreen hk-aCoup__netSavings"><span class="hk-u-text--super">&#8377;</span><b>0</b></span> OFF</b> on your shopping!</div>
    <div class="hk-u-fSize--small hk-u-text--lighter">with coupon <b class="hk-js-autoCoup__bestCouponTill">loading...</b></div>
    </div>
    `,
    footerContent: ` `,
    clicks:
    [
    {
      item: `#hk-autoCoupon .hk-js-modal__close`,
      fn: `hkCloseModalBinder.call(this)`
    }

    ]
  },
  failed: {
    headerText: `Hard Luck. No coupons applicable this time.`,
    wrapContent: `
    <div class="hk-u-text__align--center hk-u-fSize--xxlarge hk-u-margin__1-a">
    <img src="chrome-extension://`+chrome.runtime.id+`/sad_icon.png">
    </div>
    <div class="hk-u-fSize--large hk-u-text__align--center hk-u-margin__1-a">
    <b class="hk-aCoup__headingText">Sorry!</b>
    </div>
    <div class="hk-u-margin__2-a hk-u-fSize--big ">
    We worked hard <b class="hk-coup-length">0</b> coupons applicable on your current purchase. Better Luck Next Time !
    </div>
    `,
    footerContent: `

    `,
    clicks:
    [
    {
      item: `#hk-autoCoupon .hk-js-modal__close`,
      fn: `hkCloseModalBinder.call(this)`
    }

    ]

  }
}





//
function tracer(listener,type)
{
    console.log("called tracer");
    // var website= getCurrentPosition(window.location.href);
    var pid = "";

    if(type==2)
    {
      pid= msgToSend.split("~")[0];
      pid = pid.trim();
      if(pid[pid.length-1] == "-"){
        pid = pid.substring(0,(pid.length-1));
      }
    }
    else if(typeof(getPID) == "function")
    {
      pid= getPID();
    }

    if(type == 1 && typeof(getPID) == "function"){
      pid= getPID();
    }

    if (pid=='')
    {
      pid="0";
    }
    // if(website=='')
    // {
    //   website="0";
    // }

    var jsonArr = [{'mode':0,'listener':listener,'type':type,'pid': encodeURIComponent(pid),'website':0}];
    jsonArr = JSON.stringify(jsonArr);
    sendMessage(1, jsonArr,23,doNothing, []);
        console.log("629-type");
}

function initiateNewUI(){

     $ = jQuery.noConflict();
  // console.log("initiateNewUI was called");
  //if(getCurrentPosition(window.location.hostname) != 0 || (window.location.hostname.split("google.co.in").length > 1 && (getCurrentPosition(window.location.href) != 0)))
  {
    //if(flagAvail==1){
    // coupons available
    if($("#hk-killerDIV").length == 0){
      var link = document.createElement("link");
      link.href = returnResource("hkstyle.css");
      link.type = "text/css";
      link.rel = "stylesheet";
      if(document.getElementsByTagName("head").length > 0){
        document.getElementsByTagName("head")[0].appendChild(link);
        $('body').append('<div id="hk-killerDIV" style="display:block!important"></div>');
        var newUI = returnResource("newUI.html");
        $('#hk-killerDIV').load(newUI);
        // addClickEvents();
      }
      // console.log("Inside main");
    }
    $(".main-hk-ext-div").attr( "style","display:block!important");

 }

}

document.addEventListener('scroll', function listener() { // passive scroll listener to transparentify the recommendations box
	if (document.getElementsByClassName('hk-recoBox').length > 0) {
		var recoBox = document.querySelector('.hk-recoBox');
		recoBox.style.opacity = ".7"
	}
}, { passive: true });
function hkCloseModal(elem) {
	var $hkGlobWrapper = $('body');
	if ($('.hk-c-modals--open').length == 1) {
		$hkGlobWrapper.removeClass('hk-modal-shown'); // add back the scroll thingy to the window while remove the modal iff the number of modals=1. else stay as it is till all except one modal remains open.
	}

	$(elem).closest('.hk-c-modals--open').removeClass('hk-c-modals--open'); // remove the closes modal.

	setTimeout(function() {
			$(elem).closest('.hk-c-modal').removeClass('hk-ext-animated')
		}, 600) // remove the animation on the modal after it has vanished
}

function hkSlideInUp(elem) {
	$(elem).closest('.hk-ext-slideInDown--center').removeClass('hk-ext-slideInDown--center').addClass('hk-ext-slideInUp--center'); // add the slideInUp(center) animation
}

function hkSlideInDown(elem) {
	$(elem).closest('.hk-ext-slideInUp--center').removeClass('hk-ext-slideInUp--center').addClass('hk-ext-slideInDown--center'); // add the slideInDown(center) animation
}
function hkCloseModalBinder() { //close modals
  if(typeof(initializeLocaStorage) == "function" && localStorage.acReApply != 1){
    localStorage.savings = "";
    localStorage.acReApply = 0;
    savings = [];
    queueHash = [];
    initializeLocaStorage();
  }
  var $this = $(this);
  hkCloseModal($this);
    if (!!$this.closest('.hk-ext-slideInDown--center')) { //if it had slidedown(center) animation then close the modal with slide up animation and restore the slidein down class to prepare for its next show
      hkSlideInUp($this);
      setTimeout(function() {
        hkSlideInDown($this);
      }, 600)
    }
}
initiateNewUI();
