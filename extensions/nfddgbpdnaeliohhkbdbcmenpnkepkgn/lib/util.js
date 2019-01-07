
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

var loadAsset = function(url, callback) {
    // http://stackoverflow.com/a/13832922/108574
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL(url), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            //... The content has been read in xhr.responseText
            callback(xhr.responseText);
        }
    };
    xhr.send();
};

var displayError = function(sdk, title, content, func) {
    var modal = sdk.Widgets.showModalView({
        el: content,
        title: title,
        buttons: [
            {
                text: 'OK',
                title: 'OK',
                onClick: function() {
                    modal.close();
                    if (func) func();
                },
                type: 'SECONDARY_ACTION',
            },
        ],
    });
    return modal;
};

var displayAlert = function(sdk, title, content, button, func) {
    var modal = sdk.Widgets.showModalView({
        el: content,
        title: title,
        buttons: [
            {
                text: button,
                title: button,
                onClick: function() {
                    modal.close();
                    if (func) func();
                },
                type: 'SECONDARY_ACTION',
            },
        ],
    });
    return modal;
};

var displayYesNo = function(sdk, title, content, funcYes, funcNo) {
    var modal = sdk.Widgets.showModalView({
        el: content,
        title: title,
        buttons: [
            {
                text: 'Yes',
                title: 'Yes',
                onClick: function() {
                    modal.close();
                    if (funcYes) funcYes();
                },
                type: 'SECONDARY_ACTION',
            },
            {
                text: 'No',
                title: 'No',
                onClick: function() {
                    modal.close();
                    if (funcNo) funcNo();
                },
                type: 'SECONDARY_ACTION',
            },
        ],
    });
    return modal;
};

var displayProgress = function(sdk, title) {
    // requires assets/style.css, spinning css from http://cssload.net/en/spinners
    var modal = sdk.Widgets.showModalView({
        el:
            '<div style="width: 360px; height: 40px"></div><h3 style="text-align: center; margin-bottom: 60px;">' +
            title +
            '</h3><div class="cssload-container"><div class="cssload-whirlpool"></div></div><div style="width: 360px; height: 100px"></div>',
        chrome: false,
    });
    return modal;
};

var simpleXHR = function(task, success, failure) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var result = xhr.responseText;
            if (xhr.status == 200) {
                result = JSON.parse(result);
                if (success) {
                    success(xhr.status, result);
                    return;
                }
            }
            if (failure) {
                try {
                    result = JSON.parse(result);
                    if (failure) failure(xhr.status, result);
                } catch (err) {
                    if (failure) failure(xhr.status, result);
                }
            }
        }
    };
    if (task.hasOwnProperty('payload')) {
        xhr.open('POST', task.url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(task.payload));
    } else {
        xhr.open('GET', task.url, true);
        xhr.send();
    }
};

// http://stackoverflow.com/a/2706236/108574
var fireEvent = function(el, ename, etype) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent(ename);
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
};
