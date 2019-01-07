
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

var Transformation = function(aElement, aPropertyName, aFrom, aTo, aSteps) {
  this._element = aElement;
  this._propertyName = aPropertyName;
  this._from = aFrom;
  this._to = aTo;
  this._steps = aSteps;

  this._delta = (this._to - this._from) / this._steps;
  this._currentStep = -1;
};

Transformation.prototype = {
  /* Reference to the element this object transforms */
  _element : null,
  /* Name of the property which is modified */
  _propertyName : null,
  /* Initial value for the property of the element during the transformation */
  _from : null,
  /* Final value for the property of the element during the transformation */
  _to : null,
  /* Increment/decrement that occurs in each step of the transformation */
  _delta : null,
  /* Number of steps that the transformation will take to complete */
  _steps : null,
  /* Current step in the transformation */
  _currentStep : null,
  /* Unit appended to the property (optional) */
  _unit : null,

  /**
   * Sets the unit of the transformation value. Example: "px", "em".
   * @param aUnit The unit of the transformation value.
   */
  setUnit : function(aUnit) {
    this._unit = aUnit;
  },

  /**
   * Whether or not the transformation has finished.
   * @return True if the transformation has finished, false otherwise.
   */
  hasFinished : function() {
    return ((this._currentStep+1) >= this._steps);
  },

  /**
   * Performs a transformation step.
   */
  step : function() {
    this._currentStep++;

    var newValue = this._from + (this._currentStep * this._delta);
    if (this._unit != null) {
      newValue = String(newValue) + this._unit;
    }

    this._element.style[this._propertyName] = newValue;
  }
};
