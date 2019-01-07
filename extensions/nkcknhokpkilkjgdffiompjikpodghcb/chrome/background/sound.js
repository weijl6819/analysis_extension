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

var Sound = {

  get EXPLOSION_COUNT() { return 15; },
  get MUSIC_COUNT() { return 15; },

  _currentMusicIndex : null,

  _playSound : function(aSound) {
    if (aSound.currentTime > 0)
      aSound.currentTime = 0;
    else
      aSound.play();
  },

  stopAll : function() {
    for (var i = 0; i < this.MUSIC_COUNT; i++) {
      document.getElementById("music" + i).currentTime = 0;
      document.getElementById("music" + i).pause();
    }
  },

  playExplosion : function() {
    var i = Math.floor(Math.random() * this.EXPLOSION_COUNT);
    this._playSound(document.getElementById("explosion" + i));
  },

  playMusic : function() {
    this._currentMusicIndex = Math.floor(Math.random() * this.MUSIC_COUNT);
    this._playSound(document.getElementById("music" + this._currentMusicIndex));
  },

  pauseMusic : function() {
    document.getElementById("music" + this._currentMusicIndex).pause();
  },

  resumeMusic : function() {
    document.getElementById("music" + this._currentMusicIndex).play();
  },

  playGameEnd : function() {
    this._playSound(document.getElementById("gameEnd"));
  },

  playGameCancel : function() {
    this._playSound(document.getElementById("gameCancel"));
  },

  playBonus : function() {
    this._playSound(document.getElementById("bonus"));
  },

  playMiss : function() {
    this._playSound(document.getElementById("miss"));
  }
};
