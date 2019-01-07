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

var Background = {

  _browserActionEnabled : false,
  get browserActionEnabled() {
    return this._browserActionEnabled;
  },
  set browserActionEnabled(aValue) {
    this._browserActionEnabled = aValue;

    if (aValue)
      chrome.browserAction.setIcon({ path : "/chrome/skin/logo24.png" });
    else
      chrome.browserAction.setIcon({ path : "/chrome/skin/logo24_gray.png" });
  },

  init : function() {

    chrome.browserAction.onClicked.addListener(function(aTab) {
      if (Background.browserActionEnabled)
        Coordinator.startGame(aTab);
    });

    chrome.tabs.onUpdated.addListener(function(aTabId, aChangeInfo, aTab) {
      Coordinator.cancelGame();
      Background.browserActionEnabled =
        (aChangeInfo.status == "complete" && Coordinator.isPlayableTab(aTab));
    });

    chrome.tabs.onSelectionChanged.addListener(function(aTabId, aSelectInfo) {
      chrome.tabs.get(aTabId, function(aTab) {
        Coordinator.cancelGame();
        Background.browserActionEnabled =
          (aTab.status == "complete" && Coordinator.isPlayableTab(aTab));
      });
    });

    chrome.extension.onRequest.addListener(
      function(aRequest, aSender, aCallback) {
        var method = aRequest.method;
        var parameter = aRequest.parameter;

        switch(method) {
          case "capture": {
            chrome.tabs.captureVisibleTab(null, null, function(aImageData) {
              aCallback(aImageData);
            });
          } break;

          case "addDestroyedElement":
            aCallback(Coordinator.addDestroyedElement(parameter));
            break;
          case "addMiss":
            Coordinator.addMiss();
            break;
          case "clearedPage":
            Coordinator.onGameEnded();
            break;

          case "playMusic":
            Sound.playMusic();
            break;
          case "playExplosion":
            Sound.playExplosion();
            break;
          case "playBonus":
            Sound.playBonus();
            break;
          case "playMiss":
            Sound.playMiss();
            break;
        }
      }
    );
  }
};

$(document).ready(function() { Background.init(); });
