
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
var Player = (function () {
    return function () {
        var audioPlayer = $('<audio src=""></audio>')[0];
		var isPaused = false;
        var mediaWasSet = false;
		var audio_clock;
		var delegateTimeUpdate = null;
        
        this.getIsPaused = function () {
            return isPaused;
        };

        this.getIsPlaying = function () {
            return audioPlayer.currentTime > 0;
        };

        this.getIsMediaSet = function () {
            return audioPlayer.duration > 0;
        };

        this.bindTimeUpdateEvent = function (delegate) {
			delegateTimeUpdate = delegate;
            $(audioPlayer).bind('timeupdate', function (event) {
                delegate(event);
            });
        };

        this.unbindTimeUpdateEvent = function () {
            $(audioPlayer).unbind('timeupdate');
        };

        this.bindEndPlayingEvent = function (delegate) {
            $(audioPlayer).bind('ended', function (event) {
                audioPlayer.currentTime = 0;
				delegate(event);
            });
        };

        this.unbindEndPlayingEvent = function () {
            $(audioPlayer).unbind('ended');
        };

        this.status = function () {
            return audioPlayer.data("jPlayer").status;
        };
		
		this.currentTime = function() {
			return audioPlayer.currentTime;
		}

        this.play = function () {
            mediaWasSet = true;
            isPaused = false;
            if (arguments.length == 1) {
                this.setmedia(arguments[0]);
                audioPlayer.play();
				audio_clock = setInterval(function(){
					if(delegateTimeUpdate)
					delegateTimeUpdate({target:audioPlayer})
				}, 100);
            }
            else {
                audioPlayer.jPlayer("play", arguments[1]);
            }

        };

        this.setmedia = function (sound) {
            mediaWasSet = true;
			audioPlayer.src = ClientManager.getMVServicesUrl() + sound.ogg_url;
        };

        this.resume = function () {
            //audioPlayer.currentTime = prevPause;
            audioPlayer.play();
			isPaused = false;
            prevPause = null;
        };
        
		var prevPause = null;
        
		this.pause = function () {
		clearInterval(audio_clock);
            if (mediaWasSet) {
                prevPause = audioPlayer.currentTime;
                audioPlayer.pause();
                isPaused = true;
            }
        };
        
        this.stop = function () {
		clearInterval(audio_clock);
            if (mediaWasSet) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }
            isPaused = false;
        },

        isPaused = false;
        
		this.bindEndPlayingEvent(function () {
			clearInterval(audio_clock);
            isPaused = false;
        });
    };
})();


