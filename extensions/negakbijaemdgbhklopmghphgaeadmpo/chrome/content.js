
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
// To implement
url = chrome.extension.getURL("data/images/emoji/");
emoji.img_path = url;
emoji.use_sheet = true;

emoji.img_sets = {
    'apple': {'path': url + 'emoji-data/img-apple-64/', 'sheet': url + 'emoji-data/sheet_apple_64.png', 'mask': 1},
    'google': {'path': url + 'emoji-data/img-google-64/', 'sheet': url + 'emoji-data/sheet_google_64.png', 'mask': 2},
    'twitter': {
        'path': url + 'emoji-data/img-twitter-72/',
        'sheet': url + 'emoji-data/sheet_twitter_64.png',
        'mask': 4
    },
    'emojione': {
        'path': url + 'emoji-data/img-emojione-64/',
        'sheet': url + 'emoji-data/sheet_emojione_64.png',
        'mask': 8
    }
};

var running = false;
var runAgain = false;

var insertId = null;
function insertDebounced() {
    time = 0;
    if (insertId) {
        time = 3000;
    }
    var id = Math.random();
    insertId = id;
    setTimeout(function () {
        if (id != insertId) {
            return;
        }
        insert();
        insertId = null;
    }, time);
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function insert() {
    if (running) {
        runAgain = true;
        return false;
    }
    running = true;
    var storage = chrome.storage.local;
    if (!storage) {
        return;
    }
    storage.get('type', function (data) {

        style = 'emojione';
        if (data.type && data.type.style) {
            style = data.type.style;
        }

        var scale = 1;
        if (data.type && data.type.scale) {
            scale = parseFloat(data.type.scale);
        }

        emoji.img_set = style;
        $('*:not(iframe):not(.emoji-inner):not(style):not(script):not(title):not(input):not(textarea)')
            .contents()
            .filter(function () {
                return this.nodeType === 3;
            })
            .each(function () {
                var $this = $(this);
                var $parentEditable = $this.parents('[contenteditable="true"]');

                if ($parentEditable.length) {
                    return false;
                }
                var self = this;

                content = emoji.replace_unified(self.textContent);
                if (content != this.textContent) {
                    $parent = $this.parent();
                    fontSize = $parent.css('font-size');
                    fontSize = (parseInt(fontSize) * scale) + 'px';
                    var replacementNode = document.createElement('span');
                    replacementNode.className = 'emoji-container';
                    replacementNode.innerHTML = emoji.replace_unified(htmlEntities(self.textContent));
                    self.parentNode.insertBefore(replacementNode, self);
                    self.parentNode.removeChild(self);
                    if (fontSize != '16px') {
                        $parent.find('.emoji-sizer').css({width: fontSize, height: fontSize});
                    }
                }
            });
        running = false;
        if (runAgain) {
            runAgain = false;
            insert();
        }
    });
}

insert();
observe();
function observe() {
    var observer = new MutationObserver(function () {
        insertDebounced();
    });

    observer.observe(
        document, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        }
    );
}
