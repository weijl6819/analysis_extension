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

var Coordinator = {

  _gameTab : null,
  _game : null,
  _gameTimeout : null,

  get isPlaying() { return (this._game != null); },

  isPlayableTab : function(aTab) {
    const PAGE_REGEX = /^https?:\/\/[^\/].+$/i;
    var url = String(aTab.url);
    return (url.match(PAGE_REGEX));
  },

  startGame : function(aTab) {

    if (this.isPlaying) {
      this._tryToCancel();
    }
    else {

      if (!this.isPlayableTab(aTab)) {
        alert("Sorry, this is not a valid page to play the game.");
        return;
      }

      // Start the game
      this._gameTab = aTab;
      this._game = new Game(this._gameTab.url, this._gameTab.title);
      this._game.start();
      this._gameTimeout = setTimeout(function() { Coordinator.onGameEnded(); }, GAME_TIME + COUNTDOWN_TIME);

      Sound.playMusic();
      chrome.tabs.executeScript(this._gameTab.id, { code : "GameController.beginGame()" });
    }
  },

  addDestroyedElement : function(aElement) {
    if (this.isPlaying)
      return this._game.addDestroyedElement(aElement);
    return null;
  },

  addMiss : function() {
    if (this.isPlaying)
      this._game.addMiss();
  },

  cancelGame : function() {
    if (this.isPlaying) {

      this._game = null;
      if (this._gameTimeout) {
        clearTimeout(this._gameTimeout);
        this._gameTimeout = null;
      }

      Sound.stopAll();
      Sound.playGameCancel();

      chrome.tabs.update(this._gameTab.id, { url : this._gameTab.url });
    }
  },

  onGameEnded : function(aGame) {
    Sound.stopAll();
    Sound.playGameEnd();

    this._game.end();

    var win =
      window.open("../dialog/dialog.html",
                  JSON.stringify(this._game),
                  "width=420,height=580,location=no,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no");
    if (win.focus)
      win.focus();

    chrome.tabs.update(this._gameTab.id, { url : this._gameTab.url });
    this._game = null;
  },

  _tryToCancel : function() {
    Sound.pauseMusic();

    var stopConfirmation = confirm("A game is currently being played. Are you sure you want to stop it? (Your score will be lost)");
    if (stopConfirmation)
      this.cancelGame();
    else
      Sound.resumeMusic();
  }
};
