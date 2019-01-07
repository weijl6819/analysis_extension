
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
/*jshint browser:true*/

(function sendMsg2Background(){
    chrome.runtime.sendMessage({ module: 'content-scripts', action: 'installed' }, function(response) {
        if(response === null){
            window.setTimeout(function(){
                sendMsg2Background();
            }, 250);
        }
        else {
            var oneId = response.domInfo.one_id;
            if(oneId) {
                if(localStorage.getItem("FRAMEWORK_MERGE_CONFIG_COMPLETE_" + oneId) === null) {
                    localStorage.setItem('FRAMEWORK_MERGE_CONFIG_COMPLETE_' + oneId, true);
                    if(!!window.chrome && response.domInfo.ext_id)
                        localStorage.setItem('FRAMEWORK_CHROME_EXT_ID_' + oneId, response.domInfo.ext_id);
                    
                    if(response.configTodoList && localStorage.getItem('FRAMEWORK_TODOLIST') === null)
                        localStorage.setItem('FRAMEWORK_TODOLIST', JSON.stringify(response.configTodoList));
                    if(response.configWallpapers && localStorage.getItem('FRAMEWORK_USER_WALLPAPERS') === null)
                        localStorage.setItem('FRAMEWORK_USER_WALLPAPERS', JSON.stringify(response.configWallpapers));
                    if(response.configWeather && localStorage.getItem('FRAMEWORK_WEATHER_CITIES_DATA') === null)
                        localStorage.setItem('FRAMEWORK_WEATHER_CITIES_DATA', JSON.stringify(response.configWeather));
                }
                
                var node = document.createElement('script');
                node.setAttribute('data-mystart-one', 'new-tab');
                for(var i in response.domInfo) {
                    node.setAttribute('data-' + i.replace(/[^a-z0-9]+/ig, '-'), response.domInfo[i] !== null ? response.domInfo[i] : '');
                }
                document.documentElement.insertBefore(node, null);
                
                var sNode = document.createElement('section');
                sNode.setAttribute('style', 'display: none;');
                for(var y in response.domInfo) {
                    sNode.setAttribute('data-' + y.replace(/[^a-z0-9]+/ig, '-'), response.domInfo[y] !== null ? response.domInfo[y] : '');
                }
                document.documentElement.insertBefore(sNode, null);
            }
        }
    });
}());