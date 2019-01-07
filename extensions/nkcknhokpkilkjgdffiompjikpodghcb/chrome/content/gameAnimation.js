
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

var GameAnimation = {
  _getAnimationQuality : function() {
    return ANIMATION_QUALITY_HIGH;
    // TODO: Use an animation quality preference
  },

  destroyElement : function(aElement) {
    Utils.callBackground("capture", null, function(aImageData) {
      GameAnimation._destroyElement(aElement, aImageData);
    });
  },

  _destroyElement : function(aElement, aImageData) {
    var size = GameUtils.getElementSize(aElement);
    var quality = this._getAnimationQuality();

    // If the animation quality is set to NONE, or if for some reason the
    // dimensions cannot be obtained, remove the element.
    if (quality == ANIMATION_QUALITY_NO ||
        isNaN(size.width) || isNaN(size.height)) {
      aElement.parentNode.removeChild(aElement);
      return;
    }

    var position = GameUtils.getElementPosition(aElement);
    var imageData = aImageData;

    aElement.parentNode.removeChild(aElement);

    // The size of the image that was taken of the element
    const IMAGE_WIDTH  = size.width;
    const IMAGE_HEIGHT = size.height;

    // How big the "explosion" canvas will be compared to the original element
    const CANVAS_SIZE_MULTIPLIER = 4;

    // The size of the canvas (image size * canvas size multiplier)
    const CANVAS_WIDTH  = IMAGE_WIDTH  * CANVAS_SIZE_MULTIPLIER;
    const CANVAS_HEIGHT = IMAGE_HEIGHT * CANVAS_SIZE_MULTIPLIER;

    // In how many pieces will the image be split (odd number!) and how many
    // steps the animation will take.
    var PIECES_VER, PIECES_HOR, MAX_STEPS;
    switch (quality) {
      case ANIMATION_QUALITY_HIGH:
        PIECES_HOR = 7;
        PIECES_VER = 7;
        MAX_STEPS = 10;
        break;
      case ANIMATION_QUALITY_MEDIUM:
        PIECES_HOR = 5;
        PIECES_VER = 5;
        MAX_STEPS = 10;
        break;
      case ANIMATION_QUALITY_LOW:
        PIECES_HOR = 3;
        PIECES_VER = 3;
        MAX_STEPS = 5;
        break;
    }

    // The size of each piece of the image
    const PIECE_WIDTH  = Math.floor(IMAGE_WIDTH  / PIECES_HOR);
    const PIECE_HEIGHT = Math.floor(IMAGE_HEIGHT / PIECES_VER);

    // The index of the center pieces of the image
    const CENTER_HOR = Math.floor(PIECES_HOR / 2);
    const CENTER_VER = Math.floor(PIECES_VER / 2);

    // Create a canvas and center it around the original element
    var canvas = GameUtils.createGameElement("canvas");
    canvas.setAttribute("width", CANVAS_WIDTH);
    canvas.setAttribute("height", CANVAS_HEIGHT);
    canvas.style.left =
      (position.x - ((CANVAS_SIZE_MULTIPLIER - 1) * (IMAGE_WIDTH / 2))) + "px";
    canvas.style.top =
      (position.y - ((CANVAS_SIZE_MULTIPLIER - 1) * (IMAGE_HEIGHT / 2))) + "px";
    //canvas.style.border = "5px solid red";
    document.documentElement.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var step = 1;
    var image = new Image();

    var draw = function() {

      // Clear the canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.save();

      // Move the center position to the center of the canvas
      ctx.translate(Math.floor(CANVAS_WIDTH / 2), Math.floor(CANVAS_HEIGHT / 2));

      // Calculate how farther away each piece will be drawn in this iteration
      var spacing = Math.sqrt(step);

      for (var i = 0; i < PIECES_HOR; i++) {
        for (var j = 0; j < PIECES_VER; j++) {

          // Draw each piece
          ctx.drawImage(
            image,
            // Grab the rectangle for this piece from the source image
            position.x + (i * PIECE_WIDTH), position.y + (j * PIECE_HEIGHT),
            PIECE_WIDTH, PIECE_HEIGHT,
            // Place the rectangle in a different position, depending on the
            // position relative to the center and the spacing,
            ((i - CENTER_HOR) * spacing * PIECE_WIDTH),
            ((j - CENTER_VER) * spacing * PIECE_HEIGHT),
            // with the same dimensions as the original
            PIECE_WIDTH, PIECE_HEIGHT);
        }
      }
      ctx.restore();

      // Make the canvas a little more transparent each time
      canvas.style.opacity = 1 - (step / MAX_STEPS);

      if (step <= MAX_STEPS) {
        step++;
        window.setTimeout(draw, 50);
      } else {
        // Finished. Clean up.
        canvas.parentNode.removeChild(canvas);
      }
    };

    image.onload = draw;
    image.src = imageData;
  },

  popScore : function(aX, aY, aScore) {
    var score = GameUtils.createGameElement("div");
    GameUtils.moveElement(score, aX, aY);
    document.documentElement.appendChild(score);

    // TODO: Set proper style, perhaps a class from a css file
    score.style.fontFamily = "Courier New, sans-serif";
    score.style.fontWeight = "bold";
    score.style.color = "#F52";

    if (aScore >= 0)
      aScore = "+" + aScore;
    score.innerHTML = aScore;

    // Apply opacity and size transformations
    var opacityTransformation =
      new Transformation(score, "opacity", 1, 0, 16);

    var sizeTransformation =
      new Transformation(score, "fontSize", 14, 72, 10);
    sizeTransformation.setUnit("px");

    var endFunction = function() {
      score.parentNode.removeChild(score);
    };

    this.executeTransformations(
      [opacityTransformation, sizeTransformation], 50, endFunction);
  },

  executeTransformations :
    function(aTransformations, aStepInterval, aEndFunction) {

    var transformationStepFunction = function() {
      var allFinished = true;
      for (var i = 0; i < aTransformations.length; i++) {
        if (!aTransformations[i].hasFinished()) {
          aTransformations[i].step();
          allFinished = false;
        }
      }
      if (allFinished) {
        if (null != aEndFunction) {
          aEndFunction();
        }
      } else {
        window.setTimeout(transformationStepFunction, aStepInterval);
      }
    };
    transformationStepFunction();
  }
};
