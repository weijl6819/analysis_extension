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

var GameDialog = {

  _game : null,

  init : function() {
    $("#button-submit").click(function() {
      GameDialog.submit();
      setTimeout(window.close, 100);
    });
    $("#button-close").click(function() {
      window.close();
    });

    this._game = new Game();
    this._game.fromJSON(JSON.parse(window.name));

    var labels = {
      "embeds"   : this._game.ELEMENT_TYPE_EMBED,
      "tables"   : this._game.ELEMENT_TYPE_TABLE,
      "divs"     : this._game.ELEMENT_TYPE_DIV,
      "headings" : this._game.ELEMENT_TYPE_HEADING,
      "inputs"   : this._game.ELEMENT_TYPE_INPUT,
      "images"   : this._game.ELEMENT_TYPE_IMAGE,
      "links"    : this._game.ELEMENT_TYPE_LINK,
      "other"    : this._game.ELEMENT_TYPE_OTHER
    };

    for (var labelId in labels) {
      var count = this._game.getDestroyedElementCount(labels[labelId]);
      var label = document.getElementById(labelId);
      label.innerHTML = "x" + count;
      if (count > 0)
        label.parentNode.setAttribute("class", "highlight");
    }

    var timeBonus = document.getElementById("timeBonus");
    timeBonus.innerHTML = this._game.timeBonus;
    if (this._game.timeBonus > 0)
      timeBonus.parentNode.setAttribute("class", "super-highlight");

    var noMissBonus = document.getElementById("noMissBonus");
    noMissBonus.innerHTML = this._game.noMissBonus;
    if (this._game.noMissBonus > 0)
      noMissBonus.parentNode.setAttribute("class", "super-highlight");

    document.getElementById("pageTitle").innerHTML = this._game.pageTitle;
    document.getElementById("pageUrl").innerHTML = this._game.pageURL;
    document.getElementById("score").innerHTML = this._game.score;
  },

  submit : function() {
    var form = document.getElementById("scoreForm");
    form.setAttribute("action", "http://www.destroytheweb.net/submit.php");
    var params = {
      "gameId" : this._game.gameId,
      "pageTitle" : this._game.pageTitle,
      "pageURL" : this._game.pageURL,
      "score" : this._game.score,
      "secondsLeft" : this._game.secondsLeft,
      "destroyedArray" : this._game.destroyedArray.toString(),
      "browser" : "chrome"
    };
    for (var paramName in params) {
      var input = document.createElement("input");
      input.setAttribute("name", paramName);
      input.setAttribute("value", params[paramName]);
      form.appendChild(input);
    }
    form.submit();
  }
};

$(document).ready(function() { GameDialog.init(); });
