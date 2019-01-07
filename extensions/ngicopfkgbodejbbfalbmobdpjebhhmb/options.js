
var currentIndex = 1;
var currentColor;

function initialize() {
  new dragObject("arrows", "hueBarDiv", arrowsLowBounds, arrowsUpBounds, arrowsDown, arrowsMoved, null);
  new dragObject("circle", "gradientBox", circleLowBounds, circleUpBounds, circleDown, circleMoved, null);
  setDefaultColors();
  setListeners();
}

function setDefaultColors() {
  currentColor = Colors.ColorFromHex("000000");
  setColor(0, getValue("titleFg", "000000"));
  setColor(1, getValue("titleBg", "6BE06B"));
  setColor(2, getValue("ratingFg", "FFFFFF"));
  setColor(3, getValue("ratingBg", "C2163A"));
  $("name" + currentIndex).checked = true;
  syncColorPicker(currentIndex);
}

function setListeners() {
  for (var index = 0; index < 4; index++) {
    var color = $("color" + index);
    color.addEventListener("click", colorOnClick, false);
    color.addEventListener("keyup", colorOnKeyUp, false);
    $("name" + index).addEventListener("click", nameOnClick, false);
  }
  $("save").addEventListener("click", saveColors, false);
  $("restore").addEventListener("click", restoreDefaultColors, false);
}

function getValue(key, defaultValue) {
  var value = localStorage[key];
  return value == undefined ? defaultValue : value;
}

function setColor(index, value) {
  $("color" + index).value = value.toUpperCase();
  var style = $((index < 2) ? "movieTitle" : "movieRating").style;
  if (index % 2 == 0) {
    style.color = "#" + value;
  } else {
    style.background = "#" + value;
  }
  clearColorError(index);
  if ($("save").disabled) {
    for (var i = 0; i < 4; i++) {
      if (!isValidColor(getColor(i))) {
        return;
      }
    }
    $("save").disabled = false;
  }
}

function getColor(index) {
  return $("color" + index).value;
}

function setColorError(index) {
  $("color" + index).className = "error";
}

function clearColorError(index) {
  $("color" + index).className = "";
}

function isValidColor(value) {
  return /^[0-9a-f]{6}$/i.test(value);
}

function saveColors() {
  for (var i = 0; i < 4; i++) {
    if (!isValidColor(getColor(i))) {
      setColorError(i);
      $("save").disabled = true;
    }
  }
  if (!$("save").disabled) {
    saveColorsToLocalStorage(getColor(0), getColor(1), getColor(2), getColor(3));
  }
}

function restoreDefaultColors () {
  saveColorsToLocalStorage("000000", "6BE06B", "FFFFFF", "C2163A");
  setDefaultColors();
}

function saveColorsToLocalStorage(titleFg, titleBg, ratingFg, ratingBg) {
  localStorage.titleFg = titleFg;
  localStorage.titleBg = titleBg;
  localStorage.ratingFg = ratingFg;
  localStorage.ratingBg = ratingBg;
}

function colorOnClick(e) {
  var index = getIndex(this);
  currentIndex = index;
  $("name" + index).checked = true;
  syncColorPicker(index);
}

function colorOnKeyUp(e) {
  var index = getIndex(this);
  var value = getColor(index);
  if (value.length == 6) {
    if (isValidColor(value)) {
      setColor(index, value);
      syncColorPicker(index);
    } else {
      setColorError(index);
      $('save').disabled = true;
    }
  }
}

function nameOnClick(e) {
  var index = getIndex(this);
  currentIndex = index;
  $("color" + index).focus();
  syncColorPicker(index);
}

function getIndex(elem) {
  return elem.id.substr(elem.id.length - 1);
}

function $(id) {
  return document.getElementById(id);
}

function syncColorPicker(index) {
  var value = getColor(index);
  if (isValidColor(value)) {
    currentColor.SetHexString(value);
    colorChanged("box");
  }
}

function colorChanged(source) {
  if (source != "box") setColor(currentIndex, currentColor.HexString());
  if (source == "arrows" || source == "box") {
    $("gradientBox").style.backgroundColor = "#" + Colors.ColorFromHSV(currentColor.Hue(), 1, 1).HexString();
  }
  if (source == "box") {
    $("arrows").style.top = (256 - currentColor.Hue() * 255 / 359.99 - arrowsOffset.Y) + 'px';
    var pos = new Position(currentColor.Value() * 255, (1 - currentColor.Saturation())*255);
    pos = correctOffset(pos, circleOffset, true);
    pos.Apply("circle");
  }
}

// Color Picker, http://blog.paranoidferret.com/index.php/2007/08/22/javascript-interactive-color-picker/

var Colors = new function() {
  this.ColorFromHSV = function(hue, sat, val) {
    var color = new Color();
    color.SetHSV(hue,sat,val);
    return color;
  }
  this.ColorFromRGB = function(r, g, b) {
    var color = new Color();
    color.SetRGB(r,g,b);
    return color;
  }
  this.ColorFromHex = function(hexStr) {
    var color = new Color();
    color.SetHexString(hexStr);
    return color;
  }
  function Color() {
    var red = 0;
    var green = 0;
    var blue = 0;
    var hue = 0;
    var saturation = 0;
    var value = 0;
    this.SetRGB = function(r, g, b) {
      r = r/255.0;
      red = r > 1 ? 1 : r < 0 ? 0 : r;
      g = g/255.0;
      green = g > 1 ? 1 : g < 0 ? 0 : g;
      b = b/255.0;
      blue = b > 1 ? 1 : b < 0 ? 0 : b;
      calculateHSV();
      return true;
    }
    this.Red = function() { return Math.round(red*255); }
    this.Green = function() { return Math.round(green*255); }
    this.Blue = function() { return Math.round(blue*255); }
    this.SetHSV = function(h, s, v) {
      hue = (h >= 360) ? 359.99 : (h < 0) ? 0 : h;
      saturation = (s > 1) ? 1 : (s < 0) ? 0 : s;
      value = (v > 1) ? 1 : (v < 0) ? 0 : v;
      calculateRGB();
      return true;
    }
    this.Hue = function() { return hue; }
    this.Saturation = function() { return saturation; }
    this.Value = function() { return value; }
    this.SetHexString = function(hexString) {
      var r = parseInt(hexString.substr(0, 2), 16);
      var g = parseInt(hexString.substr(2, 2), 16);
      var b = parseInt(hexString.substr(4, 2), 16);
      return this.SetRGB(r,g,b);
    }
    this.HexString = function() {
      var rStr = this.Red().toString(16);
      if (rStr.length == 1) rStr = '0' + rStr;
      var gStr = this.Green().toString(16);
      if (gStr.length == 1) gStr = '0' + gStr;
      var bStr = this.Blue().toString(16);
      if (bStr.length == 1) bStr = '0' + bStr;
      return (rStr + gStr + bStr);
    }
    this.Complement = function() {
      var newHue = (hue>= 180) ? hue - 180 : hue + 180;
      var newVal = (value * (saturation - 1) + 1);
      var newSat = (value*saturation) / newVal;
      var newColor = new Color();
      newColor.SetHSV(newHue, newSat, newVal);
      return newColor;
    }
    function calculateHSV() {
      var max = Math.max(Math.max(red, green), blue);
      var min = Math.min(Math.min(red, green), blue);
      value = max;
      saturation = 0;
      if(max != 0) saturation = 1 - min/max;
      hue = 0;
      if(min == max) return;
      var delta = (max - min);
      if (red == max)
        hue = (green - blue) / delta;
      else if (green == max)
        hue = 2 + ((blue - red) / delta);
      else
        hue = 4 + ((red - green) / delta);
      hue = hue * 60;
      if(hue <0) hue += 360;
    }
    function calculateRGB() {
      red = value;
      green = value;
      blue = value;
      var tHue = (hue / 60);
      var i = Math.floor(tHue);
      var f = tHue - i;
      var p = value * (1 - saturation);
      var q = value * (1 - saturation * f);
      var t = value * (1 - saturation * (1 - f));
      switch(i) {
        case 0:
          red = value; green = t; blue = p;
          break;
        case 1:
          red = q; green = value; blue = p;
          break;
        case 2:
          red = p; green = value; blue = t;
          break;
        case 3:
          red = p; green = q; blue = value;
          break;
        case 4:
          red = t; green = p; blue = value;
          break;
        default:
          red = value; green = p; blue = q;
          break;
      }
    }
  }
}
();

function Position(x, y) {
  this.X = x;
  this.Y = y;
  this.Add = function(val) {
    var newPos = new Position(this.X, this.Y);
    if(val != null) {
      if(!isNaN(val.X)) newPos.X += val.X;
      if(!isNaN(val.Y)) newPos.Y += val.Y
    }
    return newPos;
  }
  this.Subtract = function(val) {
    var newPos = new Position(this.X, this.Y);
    if(val != null)
    {
      if(!isNaN(val.X)) newPos.X -= val.X;
      if(!isNaN(val.Y)) newPos.Y -= val.Y
    }
    return newPos;
  }
  this.Min = function(val) {
    var newPos = new Position(this.X, this.Y)
    if(val == null) return newPos;
    if(!isNaN(val.X) && this.X > val.X) newPos.X = val.X;
    if(!isNaN(val.Y) && this.Y > val.Y) newPos.Y = val.Y;
    return newPos;
  }
  this.Max = function(val) {
    var newPos = new Position(this.X, this.Y)
    if(val == null) return newPos;
    if(!isNaN(val.X) && this.X < val.X) newPos.X = val.X;
    if(!isNaN(val.Y) && this.Y < val.Y) newPos.Y = val.Y;
    return newPos;
  }
  this.Bound = function(lower, upper) {
    var newPos = this.Max(lower);
    return newPos.Min(upper);
  }
  this.Check = function() {
    var newPos = new Position(this.X, this.Y);
    if(isNaN(newPos.X)) newPos.X = 0;
    if(isNaN(newPos.Y)) newPos.Y = 0;
    return newPos;
  }
  this.Apply = function(element) {
    if(typeof(element) == "string") element = $(element);
    if(element == null) return;
    if(!isNaN(this.X)) element.style.left = this.X + 'px';
    if(!isNaN(this.Y)) element.style.top = this.Y + 'px';
  }
}

var pointerOffset = new Position(0, 1);
var circleOffset = new Position(5, 5);
var arrowsOffset = new Position(0, 4);
var arrowsLowBounds = new Position(0, -4);
var arrowsUpBounds = new Position(0, 251);
var circleLowBounds = new Position(-5, -5);
var circleUpBounds = new Position(250, 250);

function correctOffset(pos, offset, neg){
  if(neg) return pos.Subtract(offset);
  return pos.Add(offset);
}
function hookEvent(element, eventName, callback) {
  if(typeof(element) == "string") element = $(element);
  if(element == null) return;
  if(element.addEventListener) element.addEventListener(eventName, callback, false);
  else if(element.attachEvent) element.attachEvent("on" + eventName, callback);
}
function unhookEvent(element, eventName, callback) {
  if(typeof(element) == "string") element = $(element);
  if(element == null) return;
  if(element.removeEventListener) element.removeEventListener(eventName, callback, false);
  else if(element.detachEvent) element.detachEvent("on" + eventName, callback);
}
function cancelEvent(e) {
  e = e ? e : window.event;
  if(e.stopPropagation) e.stopPropagation();
  if(e.preventDefault) e.preventDefault();
  e.cancelBubble = true;
  e.cancel = true;
  e.returnValue = false;
  return false;
}
function getMousePos(eventObj) {
  eventObj = eventObj ? eventObj : window.event;
  var pos;
  if(isNaN(eventObj.layerX)) pos = new Position(eventObj.offsetX, eventObj.offsetY);
  else pos = new Position(eventObj.layerX, eventObj.layerY);
  return correctOffset(pos, pointerOffset, true);
}
function getEventTarget(e) {
  e = e ? e : window.event;
  return e.target ? e.target : e.srcElement;
}
function absoluteCursorPostion(eventObj) {
  eventObj = eventObj ? eventObj : window.event;
  if(isNaN(window.scrollX))
    return new Position(eventObj.clientX + document.documentElement.scrollLeft + document.body.scrollLeft,
      eventObj.clientY + document.documentElement.scrollTop + document.body.scrollTop);
  else return new Position(eventObj.clientX + window.scrollX, eventObj.clientY + window.scrollY);
}

function dragObject(element, attachElement, lowerBound, upperBound, startCallback, moveCallback, endCallback, attachLater) {
  if(typeof(element) == "string") element = $(element);
  if(element == null) return;
  if(lowerBound != null && upperBound != null) {
    var temp = lowerBound.Min(upperBound);
    upperBound = lowerBound.Max(upperBound);
    lowerBound = temp;
  }
  var cursorStartPos = null;
  var elementStartPos = null;
  var dragging = false;
  var listening = false;
  var disposed = false;
  function dragStart(eventObj) {
    if(dragging || !listening || disposed) return;
    dragging = true;
    if(startCallback != null) startCallback(eventObj, element);
    cursorStartPos = absoluteCursorPostion(eventObj);
    elementStartPos = new Position(parseInt(element.style.left), parseInt(element.style.top));
    elementStartPos = elementStartPos.Check();
    hookEvent(document, "mousemove", dragGo);
    hookEvent(document, "mouseup", dragStopHook);
    return cancelEvent(eventObj);
  }
  function dragGo(eventObj) {
    if(!dragging || disposed) return;
    var newPos = absoluteCursorPostion(eventObj);
    newPos = newPos.Add(elementStartPos).Subtract(cursorStartPos);
    newPos = newPos.Bound(lowerBound, upperBound)
    newPos.Apply(element);
    if(moveCallback != null) moveCallback(newPos, element);
    return cancelEvent(eventObj);
  }
  function dragStopHook(eventObj) {
    dragStop();
    return cancelEvent(eventObj);
  }
  function dragStop() {
    if(!dragging || disposed) return;
    unhookEvent(document, "mousemove", dragGo);
    unhookEvent(document, "mouseup", dragStopHook);
    cursorStartPos = null;
    elementStartPos = null;
    if(endCallback != null) endCallback(element);
    dragging = false;
  }
  this.Dispose = function() {
    if(disposed) return;
    this.StopListening(true);
    element = null;
    attachElement = null
    lowerBound = null;
    upperBound = null;
    startCallback = null;
    moveCallback = null
    endCallback = null;
    disposed = true;
  }
  this.StartListening = function() {
    if(listening || disposed) return;
    listening = true;
    hookEvent(attachElement, "mousedown", dragStart);
  }
  this.StopListening = function(stopCurrentDragging) {
    if(!listening || disposed) return;
    unhookEvent(attachElement, "mousedown", dragStart);
    listening = false;
    if(stopCurrentDragging && dragging) dragStop();
  }
  this.IsDragging = function() { return dragging; }
  this.IsListening = function() { return listening; }
  this.IsDisposed = function() { return disposed; }
  if(typeof(attachElement) == "string") attachElement = $(attachElement);
  if(attachElement == null) attachElement = element;
  if(!attachLater) this.StartListening();
}

function arrowsDown(e, arrows) {
  var pos = getMousePos(e);
  if(getEventTarget(e) == arrows) pos.Y += parseInt(arrows.style.top);
  pos = correctOffset(pos, arrowsOffset, true);
  pos = pos.Bound(arrowsLowBounds, arrowsUpBounds);
  pos.Apply(arrows);
  arrowsMoved(pos);
}
function circleDown(e, circle) {
  var pos = getMousePos(e);
  if(getEventTarget(e) == circle) {
    pos.X += parseInt(circle.style.left);
    pos.Y += parseInt(circle.style.top);
  }
  pos = correctOffset(pos, circleOffset, true);
  pos = pos.Bound(circleLowBounds, circleUpBounds);
  pos.Apply(circle);
  circleMoved(pos);
}
function arrowsMoved(pos, element) {
  pos = correctOffset(pos, arrowsOffset, false);
  currentColor.SetHSV((256 - pos.Y)*359.99/255, currentColor.Saturation(), currentColor.Value());
  colorChanged("arrows");
}
function circleMoved(pos, element) {
  pos = correctOffset(pos, circleOffset, false);
  currentColor.SetHSV(currentColor.Hue(), 1-pos.Y/255.0, pos.X/255.0);
  colorChanged("circle");
}

document.addEventListener('DOMContentLoaded', initialize);