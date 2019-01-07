
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

/**
 * Game view. Handles the game UI.
 */
var GameView = {

  _lblTime : null,

  insertCrosshair : function() {
    // Hide the mouse ponter
    document.documentElement.style.cursor = "none";

    var div = GameUtils.createGameElement("div");
    div.style.width  = IMAGE_CROSSHAIR_WIDTH  + "px";
    div.style.height = IMAGE_CROSSHAIR_HEIGHT + "px";
    div.style.opacity = 0.8;

    var img = document.createElement("img");
    img.src = IMAGE_CROSSHAIR;
    div.appendChild(img);

    document.documentElement.appendChild(div);
    return div;
  },

  startClock : function() {
    this._lblTime = this._insertTimeLabel();

    var t = this;
    var startTime = (new Date()).getTime();

    var updateTime = function() {
      // Exit if the game has finished
      if (!GameController.isPlaying)
        return;

      var now = (new Date()).getTime();
      var elapsed = now - startTime;
      var timeLeft = GAME_TIME - elapsed;

      var sec = Math.floor(timeLeft / 1000);
      var msec = timeLeft - (sec * 1000);

      if (sec < 10) sec = "0" + sec;

      if (msec < 10) msec = "00" + msec;
      else if (msec < 100) msec = "0" + msec;

      if (timeLeft > 20) {
        t._lblTime.innerHTML = sec + ":" + msec;
        setTimeout(updateTime, 20);
      } else {
        t._lblTime.innerHTML = "00:000";
      }
    };
    updateTime();
  },

  _insertTimeLabel : function() {
    var div = GameUtils.createGameElement("div");
    div.style.width = "100%";
    div.style.top = "200px";
    div.style.left = "0px";
    div.style.opacity = 0.25;
    div.style.fontFamily = "Courier New, sans-serif";
    div.style.fontSize = "136px";
    div.style.fontWeight = "bold";

    document.documentElement.appendChild(div);
    return div;
  }/*,

  updateStatusbarScore :
    function(aElementType, aScore, aMultiplier, aTotalScore) {

    let scoreLabel = document.getElementById("webdes-statusbar-score-value");
    let elementLabel = document.getElementById("webdes-statusbar-element");

    scoreLabel.value = aTotalScore;
    elementLabel.value =
      aElementType.toUpperCase() +
      (aMultiplier > 1 ? " (x" + aMultiplier + ")" : "") +
      (aScore > 0 ? " +" + aScore : " " + aScore);

    let opacityTransformation =
      new WebDestroyer.Transformation(elementLabel, "opacity", 0, 1, 10);
    let sizeTransformation =
      new WebDestroyer.Transformation(elementLabel, "fontSize", 1, 2, 10);
    sizeTransformation.setUnit("em");

    WebDestroyerChrome.Animation.executeTransformations(
      [opacityTransformation, sizeTransformation], 20);
  }*/
};
