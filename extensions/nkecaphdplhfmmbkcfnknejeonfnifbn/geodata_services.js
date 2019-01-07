
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



function ipinfo_io(ip) {
    try {
        $.ajax({
            url: "//freegeoip.net/json/?callback=?",
            async: true,
            success: function (data) {
                try {
                    // if (enableDebugger) debugger;
                    data = data.replace("?(", "");
                    data = data.replace(");", "");
                    data = JSON.parse(data);
                    /** @namespace data.city */
                    /** @namespace data.region_name */
                    /** @namespace data.country_name */
                    geoData.userCity = geoData.userCity || data.city;
                    geoData.userState = geoData.userState || data.region_name;
                    geoData.userCountry = geoData.userCountry || data.country_name;
                    geoData.lastUpdated = Date.now();
                    chrome.storage.local.set({"geoData": geoData});
                    // userIP = geoData.userIP;
                    // userCity = geoData.userCity;
                    // userState = geoData.userState;
                    // userCountry = geoData.userCountry;
                } catch (e) {

                }
            }
        });
    } catch (e) {

    }
}

function db_ip_com(ip) {
    const url = "https://api.db-ip.com/v2/eb79c26170d0e9921e5b8372b2e212f86afa399c/" + ip;
    // if (enableDebugger) debugger;
    try {
        $.ajax({
            url: url,
            type: "POST",
            async: true,
            success: function (result) {
                try {
                    // if (enableDebugger) debugger;
                    /** @namespace result.city */
                    /** @namespace result.stateProv */
                    /** @namespace result.countryName */
                    geoData.userCity = geoData.userCity || result.city;
                    geoData.userState = geoData.userState || result.stateProv;
                    geoData.userCountry = geoData.userCountry || result.countryName;
                    geoData.lastUpdated = Date.now();
                    chrome.storage.local.set({"geoData": geoData});
                    // userIP = geoData.userIP;
                    // userCity = geoData.userCity;
                    // userState = geoData.userState;
                    // userCountry = geoData.userCountry;
                } catch (e) {

                }
            }
        });
    } catch (e) {

    }
}

