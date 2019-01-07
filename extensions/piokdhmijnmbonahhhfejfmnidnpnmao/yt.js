
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
var event;
var embed = true;
if (location.pathname.indexOf("/embed/") == 0) {
    if (location.search.indexOf("enablejsapi=1") < 0) {
        location.search += "&enablejsapi=1";
    }
}

chrome.storage.sync.get(function(settings) {
    var quality = settings.quality ? settings.quality : "hd1080";
    var scriptText = "(function () {var embed = " + embed + ";var playbackSet;var quality = '" +
        quality + "'; onYouTubePlayerReady = " + onPlayerReady.toString() + "; " +
        updateQuality.toString() + ";})()";
    injectScript(scriptText);
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "update") {
            embed = false;
            playbackSet = true;
            var q = chrome.storage.sync.get(function(settings) {
                event = new CustomEvent('updateQ', {
                    'detail': settings.quality
                });
                document.dispatchEvent(event);
            });
            sendResponse({
                reaction: "gotMessage"
            });
        }
    });

var onPlayerReady = function (player) {
    function onPopupChange(e) {
        quality = e.detail;
        updateQuality();
    };
    document.addEventListener('updateQ', onPopupChange);
    playbackSet = false;
    extPlayer = player;
    extPlayer.addEventListener("onStateChange", function(newState) {
        if (newState == 3 && !playbackSet) {
            updateQuality();
        }
        if (newState == -1) {
            playbackSet = false;
        }
        if (newState == 5) {
            embed = true;
        }
    });

    extPlayer.addEventListener("onPlaybackQualityChange", function(event) {
        if (embed) {
            if (extPlayer.getAvailableQualityLevels === null) {
                document.removeEventListener("updateQ", onPopupChange);
                extPlayer = document.getElementById('movie_player');
            }
            var avaliableQuality = extPlayer.getAvailableQualityLevels();
            var tq = (avaliableQuality.indexOf(quality) == -1) ? avaliableQuality[0] : quality;
            var qualIsCorrect = (tq === extPlayer.getPlaybackQuality());
            if (!qualIsCorrect) {
                updateQuality();
            }
            embed = false;
        }
    });
    updateQuality();
};


function updateQuality() {
    var avaliableQuality = extPlayer.getAvailableQualityLevels();
    var q = (avaliableQuality.length && avaliableQuality.indexOf(quality) == -1) ? avaliableQuality[0] : quality;
    var playerState = extPlayer.getPlayerState();
    playbackSet = true;
    var now = new Date().getTime();
    var saved_q = {
        creation: now,
        data: q,
        expiration: now + 2592000000 // one month
    };
    localStorage['yt-player-quality'] = JSON.stringify(saved_q);
    extPlayer.setPlaybackQuality(q);
};

function injectScript(scriptText) {
    var script = document.createElement("script");
    script.textContent = scriptText;
    document.head.appendChild(script);
}

function replaceIgnoreFlag() {
    if (document.body)
    {
        var observer = new MutationObserver(function(mutations) {
            function fixCode(scripts) {
                for (var i = 0; i < scripts.length; i++)
                {
                    if (scripts[i].textContent.match(/html5_ignore_public_setPlaybackQuality=true/))
                    {
                        scripts[i].textContent = scripts[i].textContent.replace(/html5_ignore_public_setPlaybackQuality=true/, 'html5_ignore_public_setPlaybackQuality=false');
                    }
                }  
            }
            mutations.forEach(function(mutation) {
                for (var i = 0; i < mutation.addedNodes.length; i++)
                {
                    if (mutation.addedNodes[i].tagName == 'SCRIPT')
                    {
                        fixCode([mutation.addedNodes[i]]);
                    }
                    else
                    {
                        var node = mutation.addedNodes[i];
                        node.querySelectorAll && fixCode(node.querySelectorAll('script'));
                    }
                }
            });
        });

        observer.observe(document.body, {childList: true, subtree: true});
    }
    else
    {
        setTimeout(replaceIgnoreFlag, 0);
    }
}

replaceIgnoreFlag();