// The star of every good animation
var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;

var transforms = ["transform",
                  "msTransform",
                  "webkitTransform",
                  "mozTransform",
                  "oTransform"];

var transformProperty = getSupportedPropertyName(transforms);

// Array to store our Snowflake objects
var snowflakes = [];

// Global variables to store our browser's window size
var browserWidth;
var browserHeight;

// Specify the number of snowflakes you want visible
var numberOfSnowflakes = 25;

// Flag to reset the position of the snowflakes
var resetPosition = false;
var animation;

//
// It all starts here...
//
function setup() {
	// window.addEventListener("DOMContentLoaded", generateSnowflakes, false);
	window.addEventListener("resize", setResetFlag, false);
}
setup();

//
// Vendor prefix management
//
function getSupportedPropertyName(properties) {
    for (var i = 0; i < properties.length; i++) {
        if (typeof document.body.style[properties[i]] != "undefined") {
            return properties[i];
        }
    }
    return null;
}

//
// Constructor for our Snowflake object
//
function Snowflake(element, radius, speed, xPos, yPos, degree) {

	// set initial snowflake properties
    this.element = element;
    this.radius = radius;
    this.speed = speed;
    this.xPos = xPos;
    this.yPos = yPos;
    this.degree = degree;
	// declare variables used for snowflake's motion
    this.counter = 0;

    this.sign = Math.random() < 0.5 ? 1 : -1;

	// setting an initial opacity and size for our snowflake
    this.element.style.opacity = .4 + Math.random();
    this.element.style.height = 12 + Math.random() * 25 + "px";
}

//
// The function responsible for actually moving our snowflake
//
Snowflake.prototype.update = function () {
  if(!(this.element.src == chrome.extension.getURL('/images/s.gif'))){

	// using some trigonometry to determine our x and y position
    this.counter += this.speed / 5000;
    this.xPos += this.sign * this.speed * Math.cos(this.counter) / 40;
    this.yPos += Math.sin(this.counter) / 40 + this.speed / 30;
    this.degree += 1 * Math.random();

	// setting our snowflake's position
    setTranslate3DTransform(this, Math.round(this.xPos), Math.round(this.yPos));

    // if snowflake goes below the browser window, move it back to the top

    if (this.yPos > browserHeight) {
      	this.yPos = -50;
    }
  }else{
  // using some trigonometry to determine our x and y position
    this.counter += this.speed / 5000;
    this.xPos -= this.sign * this.speed * Math.cos(this.counter) / 40;
    this.yPos -= Math.sin(this.counter) / 40 + this.speed / 30;


	  // setting our snowflake's position
    setTranslate3DTransform(this, Math.round(this.xPos), Math.round(this.yPos));

    // if snowflake goes below the browser window, move it back to the top

    if (this.yPos < -50) {
      	this.yPos = browserHeight;
    }
  }
}
//
// A performant way to set your snowflake's position
//
function setTranslate3DTransform(telement, xPosition, yPosition, degree) {
  var element = telement.element;
	var val = "translate3d(" + xPosition + "px, " + yPosition + "px" + ", 0) rotate("+telement.degree+"deg)";
    element.style[transformProperty] = val;
}

//
// The function responsible for creating the snowflake
//
function generateSnowflakes() {
	  // get our snowflake element from the DOM and store it
    var originalSnowflake = document.querySelector(".snowflake");
    originalSnowflake.style.display = 'inline';
    // access our snowflake element's parent container
    var snowflakeContainer = originalSnowflake.parentNode;

    // get our browser's size
	  browserWidth = document.documentElement.clientWidth;
    browserHeight = document.documentElement.clientHeight;

    // create each individual snowflake
    for (var i = 0; i < numberOfSnowflakes; i++) {

    	  // clone our original snowflake and add it to snowflakeContainer
        var snowflakeCopy = originalSnowflake.cloneNode(true);
        snowflakeCopy.id = 's' + i;
        snowflakeContainer.appendChild(snowflakeCopy);

		    // set our snowflake's initial position and related properties
        var initialXPos = Math.random() * browserWidth;//getPosition(50, browserWidth);
        var initialYPos = -50; //getPosition(50, browserHeight);
        var speed = 5+Math.random()*30;
        var radius = 4+Math.random()*10;
        if (originalSnowflake.src == chrome.extension.getURL('/images/a.png')){
          var degree = 360 * Math.random();
        }else{
          var degree = 45 * Math.random();
        }
        // create our Snowflake object
        var snowflakeObject = new Snowflake(snowflakeCopy,
        									radius,
        									speed,
        									initialXPos,
        									initialYPos,
                          degree);
        snowflakes.push(snowflakeObject);
    }

    // remove the original snowflake because we no longer need it visible
	  originalSnowflake.style.display = 'none';

	  // call the moveSnowflakes function every 30 milliseconds
    moveSnowflakes();
}

//
// Responsible for moving each snowflake by calling its update function
//
function moveSnowflakes() {
    for (var i = 0; i < snowflakes.length; i++) {
        var snowflake = snowflakes[i];
        snowflake.update();
    }

	  // Reset the position of all the snowflakes to a new value
    if (resetPosition) {
    	browserWidth = document.documentElement.clientWidth;
	    browserHeight = document.documentElement.clientHeight;

		for (var i = 0; i < snowflakes.length; i++) {
	        var snowflake = snowflakes[i];

	        snowflake.xPos = getPosition(50, browserWidth);
	        snowflake.yPos = getPosition(50, browserHeight);
	    }

	    resetPosition = false;
    }

    animation = requestAnimationFrame(moveSnowflakes);
}

//
// This function returns a number between (maximum - offset) and (maximum + offset)
//
function getPosition(offset, size) {
	return Math.round(-1*offset + Math.random() * (size+2*offset));
}

//
// Trigger a reset of all the snowflakes' positions
//
function setResetFlag(e) {
	resetPosition = true;
}
var stop = 0;

//change the raining image
function updateSnow(id){
  for(var i = 0; i < snowflakes.length; i++){
    var sf = snowflakes[i];
    if(id == 'a'){
      sf.degree = 360 * Math.random();
    }else{
      sf.degree = 45 * Math.random();
    }

    if(id=='s'){
      sf.element.src = chrome.extension.getURL('/images/'+id+'.gif');
    }else{
      sf.element.src = chrome.extension.getURL('/images/'+id+'.png');
    }

  }
}
//stop the rain
function stopSnow(){
  for(var i = 0; i < snowflakes.length; i++){
    document.querySelector('#snowflakeContainer').removeChild(document.getElementById('s'+i));
    snowflakes[i].counter = 0;
  }
  if(animation){
    window.cancelAnimationFrame(animation);
  }
  snowflakes = [];
}
