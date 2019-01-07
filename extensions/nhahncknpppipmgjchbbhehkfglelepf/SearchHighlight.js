
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
var status;
var currentUrl;
chrome.runtime.sendMessage({
    method: "getStatus"
}, function(response){
    status = response.status;
    currentUrl = response.url;
    searchhi_unl = 0;
    try {
        if (status == 'y') {
            SmartHighlight(document);
        }
        else {
            unhighlight(document);
        }
    } 
    catch (e) {
    }
});

var reportClick = function() {
chrome.runtime.sendMessage({
    method: "reportClick",
	eventName: "clickclick"
});
};



function getURL(){
    /*if (document.URL.indexOf('www.google.') != -1 || document.URL.indexOf('yahoo.com') != -1 || document.URL.indexOf('www.bing.') != -1) {
     return document.URL;
     }
     else {
     
     return document.referrer;
     }*/
    return currentUrl;
}

/* New: Variable searchhi_string to keep track of words being searched. */
var searchhi_string = '';

/* New from Rob Nitti, who credits 
 * http://bytes.com/groups/javascript/145532-replace-french-characters-form-inp
 * The code finds accented vowels and replaces them with their unaccented version. */
function stripVowelAccent(str){
    var rExps = [/[\xC0-\xC2]/g, /[\xE0-\xE2]/g, /[\xC8-\xCA]/g, /[\xE8-\xEB]/g, /[\xCC-\xCE]/g, /[\xEC-\xEE]/g, /[\xD2-\xD4]/g, /[\xF2-\xF4]/g, /[\xD9-\xDB]/g, /[\xF9-\xFB]/g];
    
    var repChar = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u'];
    
    for (var i = 0; i < rExps.length; ++i) 
        str = str.replace(rExps[i], repChar[i]);
    
    return str;
}

function urldecode(str){

    return decodeURIComponent(str);
}

/* http://www.kryogenix.org/code/browser/searchhi/ */
/* Modified 20021006 to fix query string parsing and add case insensitivity */
function highlightWord(node, word, doc){
    if (word.length < 3) 
        return;
    //word = urldecode(word);
    
    doc = typeof(doc) != 'undefined' ? doc : document;
    // Iterate into this nodes childNodes
    
    /* tp integration */
    if (node.className == 'tp-info-box')
        return;
    /* tp integration */

    if (node.hasChildNodes) {
        var hi_cn;
        for (hi_cn = 0; hi_cn < node.childNodes.length; hi_cn++) {
            highlightWord(node.childNodes[hi_cn], word, doc);
        }
    }
    
    // And do this node itself
    if (node.nodeType == 3) { // text node
        tempNodeVal = stripVowelAccent(node.nodeValue.toLowerCase());
        tempWordVal = stripVowelAccent(word.toLowerCase());
        if (tempNodeVal.indexOf(tempWordVal) != -1) {
        
            pn = node.parentNode;
            if (pn.className != "searchword") {
                // word has not already been highlighted!
                nv = node.nodeValue;
                ni = tempNodeVal.indexOf(tempWordVal);
                // Create a load of replacement nodes
                before = doc.createTextNode(nv.substr(0, ni));
                docWordVal = nv.substr(ni, word.length);
                after = doc.createTextNode(nv.substr(ni + word.length));
                hiwordtext = doc.createTextNode(docWordVal);
                hiword = doc.createElement("span");			
                hiword.className = "searchword";
                hiword.appendChild(hiwordtext);
                pn.insertBefore(before, node);
                pn.insertBefore(hiword, node);
                pn.insertBefore(after, node);
                pn.removeChild(node);
				try {
					if ((""+hiword.parentNode.href) == 'undefined' &&
						(""+hiword.parentNode.parentNode.href) == 'undefined' && 
						(""+hiword.parentNode.parentNode.parentNode.href) == 'undefined') {
						hiword.onclick = reportClick;
					}
					
				} catch(e) {};
            }
        }
    }
}

function unhighlightWord(node, word, doc){
    word = urldecode(word);
    doc = typeof(doc) != 'undefined' ? doc : document;
    // Iterate into this nodes childNodes
    if (node.hasChildNodes) {
        var hi_cn;
        for (hi_cn = 0; hi_cn < node.childNodes.length; hi_cn++) {
            highlightWord(node.childNodes[hi_cn], word, doc);
        }
    }
    
    // And do this node itself
    if (node.nodeType == 3) { // text node
        tempNodeVal = node.nodeValue.toLowerCase();
        tempWordVal = word.toLowerCase();
        if (tempNodeVal.indexOf(tempWordVal) != -1) {
            pn = node.parentNode;
            if (pn.className == "searchword") {
                prevSib = pn.previousSibling;
                nextSib = pn.nextSibling;
                nextSib.nodeValue = prevSib.nodeValue + node.nodeValue + nextSib.nodeValue;
                prevSib.nodeValue = '';
                node.nodeValue = '';
            }
        }
    }
}

function unhighlight(node){
    // Iterate into this nodes childNodes
    if (node.hasChildNodes) {
        var hi_cn;
        for (hi_cn = 0; hi_cn < node.childNodes.length; hi_cn++) {
            unhighlight(node.childNodes[hi_cn]);
        }
    }
    
    // And do this node itself
    if (node.nodeType == 3) { // text node
        pn = node.parentNode;
        if (pn.className == "searchword") {
            prevSib = pn.previousSibling;
            nextSib = pn.nextSibling;
            nextSib.nodeValue = prevSib.nodeValue + node.nodeValue + nextSib.nodeValue;
            prevSib.nodeValue = '';
            node.nodeValue = '';
        }
    }
}

var m = 0;

function googleSearchHighlight(doc) {
    
	doc = typeof(doc) != 'undefined' ? doc : document;
    if (!doc.createElement) 
        return;
    ref = getURL();
    qs = ref;
	qs = qs.substring(qs.indexOf('?') + 1);
    qsa = qs.split('&');
    
    for (i = 0; i < qsa.length; i++) {
        qsip = qsa[i].split('=');
		
        if (qsip.length == 1) 
            continue;

        if (qsip[0] == 'q' || qsip[0] == 'p' || qsip[0] == 'w') { // q= for Google, p= for Yahoo, w= for Eurekster
            // Trim leading and trailing spaces after unescaping

		   qsip[1] = urldecode(qsip[1]).replace(/^\s+|\s+$/g, "");

            if (qsip[1] == '') 
                continue;
            phrases = qsip[1].replace(/\+/g, ' ').split(/\"/);
            
            /* tp integration */
            activateTupoint(phrases);
            /* tp integration */

			for (p = 0; p < phrases.length; p++) {
            
                phrases[p] = urldecode(phrases[p]).replace(/^\s+|\s+$/g, "");
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
                    highlightWord(doc.getElementsByTagName("body")[0], words[w], doc);
                    if (p % 2 == 0) 
                        searchhi_string = searchhi_string + ' ' + words[w];
                    else 
                        searchhi_string = searchhi_string + ' "' + words[w] + '"';
                }
            }
        }
    }
}



function postSearchHighlight(doc){
    doc = typeof(doc) != 'undefined' ? doc : document;
    // Trim any leading or trailing space
    // (this is an overkill way of getting rid of the leading
    //  space that always is present in searchhi_string)
    searchhi_string = searchhi_string.replace(/^\s+|\s+$/g, "");
    
    // In MSIE, sometimes the dynamic generation of the spans
    // for the highlighting takes the anchor out of focus.
    // Here, we put it back in focus.
    if (doc.location.hash.length > 1) 
        doc.location.hash = doc.location.hash;
}

function SearchHighlight(doc, loc){
			

    // This logic should allow pages to use themselves as search
    // engines while not ghosting old searches on current results.
    doc = typeof(doc) != 'undefined' ? doc : document;
    loc = typeof(loc) != 'undefined' ? loc : doc.location;
    
    if (doc.createElement) {
	try {
        var docrefpage = getURL().split('?', 2);
        var locrefpage = loc.href.split('?', 1);

		googleSearchHighlight(doc);
  
        postSearchHighlight(doc);
		}catch(ee){}
    }
}
      
function SmartHighlight(doc, loc){
    
    doc = typeof(doc) != 'undefined' ? doc : document;
    loc = typeof(loc) != 'undefined' ? loc : doc.location;
   
    SearchHighlight(doc);
}

function SmartHLUnload(doc){
    doc = typeof(doc) != 'undefined' ? doc : document;
    loc = typeof(loc) != 'undefined' ? loc : doc.location;
    
    if (searchhi_unl > 0) {
        // Turn refresh detection on so that if this
        // page gets quickly loaded, we know it's a refresh
        var today = new Date();
        var now = today.getUTCSeconds();
        doc.cookie = 'SHTS=' + now + ';';
        doc.cookie = 'SHTSP=' + escape(loc.href) + ';';
    }
    else {
        // Refresh detection has been disabled
        doc.cookie = 'SHTS=;';
        doc.cookie = 'SHTSP=;';
    }
}

function NotRefreshHL(){
    // This is not a refresh. It's probably a submit
    // with the same search string, so disable refresh
    // detection on this go around.
    searchhi_unl = 0;
    return true;
}

// By default, turn refresh detection on
var searchhi_unl = 1;

// window.onload = SearchHighlight;
// window.onload = SmartHighlight;
// window.onunload = SmartHLUnload;

/* tp integration */
function activateTupoint(phrases) {

    var message = {
        $$$tp: true,
        query: phrases,
        id: 'highlight',
        method: 'injectTupoint',
        clazz: 'searchword'
    };

    chrome.extension.sendMessage(message, function(response) {});
};
/* tp integration */