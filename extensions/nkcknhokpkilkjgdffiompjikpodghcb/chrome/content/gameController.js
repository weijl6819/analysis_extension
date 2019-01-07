
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
 * Game controller. Handles the events of a single game.
 */
var GameController = {

  _crosshair : null,

  get isPlaying() {
    return (this._crosshair != null);
  },

  beginGame : function() {
    // Check for inner frames and remove them if necessary
    var iframes = document.getElementsByTagName("iframe");
    var frames = document.getElementsByTagName("frame");
    var frameSets = document.getElementsByTagName("frameset");

    if (iframes.length > 0 || frameSets.length > 0 || frames.length > 0) {
      // Hide frames
      for (var i = 0; i < iframes.length; i++) {
        iframes[i].style.display = "none !important";
        iframes[i].parentNode.removeChild(iframes[i]);
      }
      for (var i = 0; i < frames.length; i++)
        frames[i].style.display = "none !important";
      for (var i = 0; i < frameSets.length; i++)
        frameSets[i].style.display = "none !important";
    }

    GameCountdown.start();
  },

  _addGameEvents : function() {
    document.addEventListener("mousemove", this.onMouseMove, false);
    document.addEventListener("mousedown", this.onMouseDown, false);
  },

  _removeGameEvents : function() {
    document.removeEventListener("mousemove", this.onMouseMove, false);
    document.removeEventListener("mousedown", this.onMouseDown, false);
  },

  onCountdownFinished : function() {
    this._addGameEvents();
    this._crosshair = GameView.insertCrosshair();
    GameView.startClock();
  },

  onMouseMove : function(aEvent) {
    var t = GameController;

    if (t._crosshair == null)
      return;

    var x =
      (aEvent.pageX - Math.floor(IMAGE_CROSSHAIR_WIDTH / 2));
    var y =
      (aEvent.pageY - Math.floor(IMAGE_CROSSHAIR_HEIGHT / 2));

    GameUtils.moveElement(t._crosshair, x, y);
  },

  onMouseDown : function(aEvent) {
    var t = GameController;

    if (t._crosshair == null)
      return;
    if (aEvent.button != 0)
      return;

    GameUtils.hideElement(t._crosshair);

    var destroyableElement =
      t._getElementAtPoint(aEvent.clientX, aEvent.clientY);

    if (null != destroyableElement) {
      t._destroyElement(destroyableElement, aEvent);

      if (!t._hasVisibleChildren(document.getElementsByTagName("body")[0])) {
        // Page cleared, finish the game
        Utils.callBackground("clearedPage");
      }
    }
    else {
      // Missed! deduct points
      t._addMiss(aEvent);
    }

    GameUtils.showElement(t._crosshair);
  },

  _getElementAtPoint : function(aX, aY) {
    var gameElementsHidden = [];
    var element = null;

    do {
      if (element != null) {
        GameUtils.hideElement(element);
        gameElementsHidden.push(element);
      }

      element = document.elementFromPoint(aX, aY);

    } while (element != null && element.gameElement);

    for (var i = 0; i < gameElementsHidden.length; i++) {
      GameUtils.showElement(gameElementsHidden[i]);
    }

    if (this._isDestroyableElement(element)) {
      return element;
    }
    return null;
  },

  _isDestroyableElement : function(aElement) {
    var destroyable = false;

    if (null != aElement && !aElement.destroyed && !aElement.gameElement) {

      if (!aElement.hasChildNodes() ||
          aElement.nodeName.toLowerCase() == "select" ||
          aElement.nodeName.toLowerCase() == "input" ||
          aElement.nodeName.toLowerCase() == "a" ||
          !this._hasVisibleChildren(aElement)) {
        destroyable = true;
      }
    }

    return destroyable;
  },

  _hasVisibleChildren : function(aElement) {
    for (var i = 0; i < aElement.childNodes.length; i++) {
      var childNode = aElement.childNodes[i];

      if (childNode.gameElement ||
          childNode.nodeType != 1 ||
          childNode.style.visibility == 'hidden' ||
          childNode.style.display == 'none')
        continue;

      var nodeName = childNode.nodeName.toLowerCase();
      if (nodeName != "br" && nodeName != "script") {

        // Check whether the child has size and is in the visible area of
        // the parent (using offset)
        if (childNode.offsetWidth <= 0 || childNode.offsetHeight <= 0 ||
            (childNode.offsetLeft + childNode.offsetWidth) < aElement.offsetLeft ||
            (aElement.offsetLeft + aElement.offsetWidth) < childNode.offsetLeft ||
            (childNode.offsetTop + childNode.offsetHeight) < aElement.offsetTop ||
            (aElement.offsetTop + aElement.offsetHeight) < childNode.offsetTop)
          continue;

        return true;
      }
    }

    return false;
  },

  _destroyElement : function(aElement, aEvent) {
    var t = this;
    aElement.destroyed = true;

    Utils.callBackground("addDestroyedElement", aElement.nodeName, function(aResult) {

      // TODO: Play different sound depending on the multiplier
      GameAnimation.destroyElement(aElement);
      GameAnimation.popScore(aEvent.pageX, aEvent.pageY, aResult.score);

      Utils.callBackground("playExplosion");
      if (aResult.multiplier > 1) {
        window.setTimeout(function() { Utils.callBackground("playBonus"); }, 500);
      }

      //WebDestroyerChrome.GameView.updateStatusbarScore(
        //aElement.nodeName, result.score, result.multiplier, this.game.score);
    });
  },

  _addMiss : function(aEvent) {
    Utils.callBackground("addMiss");
    GameAnimation.popScore(aEvent.pageX, aEvent.pageY, "Miss!");
    Utils.callBackground("playMiss");
    // TODO: Show score in status bar
  }
};
