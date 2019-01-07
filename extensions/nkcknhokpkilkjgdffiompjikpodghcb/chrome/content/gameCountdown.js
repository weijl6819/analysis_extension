
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
/**
 * Copyright (c) 2011, Jose Enrique Bolanos Gudino
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *  * Neither the name of Jose Enrique Bolanos nor the names
 *    of its contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER
 * OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **/

var GameCountdown = {
  /* Function called once the countdown finishes. */
  _endFunction : null,
  /* Reference to the timeout used in the countdown. */
  _timeout : null,

  /**
   * Displays and starts the countdown to begin a game session.
   */
  start : function() {
    var t = this;

    var labels = [
      "Ready",
      "Ready",
      "3", "2", "1",
      "GO!"
    ];

    var dimmer = GameUtils.createGameElement("div");
    dimmer.style.width = "100%";
    dimmer.style.height = "100%";
    dimmer.style.left = "0px";
    dimmer.style.top = "0px";
    dimmer.style.background = "black";
    dimmer.style.opacity = 0.7;

    var logoDiv = GameUtils.createGameElement("div");
    logoDiv.style.width = "100%";
    logoDiv.style.height = "100%";
    logoDiv.style.left = "0px";
    logoDiv.style.top = "0px";
    logoDiv.style.textAlign = "center";
    logoDiv.style.paddingTop = "50px";

    var logo = document.createElement("img");
    logo.src = IMAGE_LOGO;
    logoDiv.appendChild(logo);

    var countdownDiv = GameUtils.createGameElement("div");
    countdownDiv.style.width = "100%";
    countdownDiv.style.height = "100%";
    countdownDiv.style.left = "0px";
    countdownDiv.style.top = "0px";
    countdownDiv.style.textAlign = "center";
    countdownDiv.style.marginTop = (IMAGE_LOGO_HEIGHT + 30) + "px";
    countdownDiv.style.fontSize = "8em";
    countdownDiv.style.color = "#FFFFFF";
    countdownDiv.style.fontFamily = "Courier New, sans-serif";

    document.documentElement.appendChild(dimmer);
    document.documentElement.appendChild(logoDiv);
    document.documentElement.appendChild(countdownDiv);

    var countdownFunction = function() {
      var label = labels.shift();
      if (null != label) {
        countdownDiv.innerHTML = label;
        t._timeout = setTimeout(countdownFunction, 1000);
      } else {
        dimmer.parentNode.removeChild(dimmer);
        logoDiv.parentNode.removeChild(logoDiv);
        countdownDiv.parentNode.removeChild(countdownDiv);

        t._timeout = null;
        t._enableScroll();

        GameController.onCountdownFinished();
      }
    };

    t._disableScroll();
    countdownFunction();
  },

  _disableScroll : function() {
    window.scroll(0, 0);
    document.documentElement.style.overflow = "hidden";
  },

  _enableScroll : function() {
    window.scroll(0, 0);
    document.documentElement.style.overflow = "auto";
  },

  cancel : function() {
    if (null != this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
      this._enableScroll();
    }
  }
};
