var showStatusMsg, fadeStatusMsg;

// Saves options to localStorage.
function save_options(e) {
  e.preventDefault();

  // black / white text
  var isBlackSelected = document.optionsForm.clockColor[0].checked;
  var clockColor = (isBlackSelected) ? "" : "w";
  localStorage["just_a_clock_color"] = clockColor;

  // Update status to let user know options were saved.
  var statusMsg = document.getElementById("statusMsg");
  var op = 1;  // initial opacity
  clearTimeout(showStatusMsg);
  if (typeof fadeStatusMsg != "undefined") clearInterval(fadeStatusMsg);
  statusMsg.style.display = "inline-block";
  statusMsg.style.opacity = 1;
  showStatusMsg = setTimeout(function() {
    fadeStatusMsg = setInterval(function () {
        if (op <= 0.1){
            clearInterval(fadeStatusMsg);
            statusMsg.style.display = "none";
        }
        statusMsg.style.opacity = op;
        op -= op * 0.1;
    }, 50);
  }, 3000);

  return false;
}

// Restores radio state to saved value from localStorage.
function restore_options() {

  // First translate any strings on the page
  var objects = document.getElementsByClassName('i18n'), i;
  for(i = 0; i < objects.length; i++) {
    if (objects[i].dataset && objects[i].dataset.msg) {
      objects[i].innerHTML = chrome.i18n.getMessage(objects[i].dataset.msg);
    }
  }

  document.getElementById("button1").addEventListener("click",save_options);
  var clockColor = localStorage["just_a_clock_color"];
  if (typeof clockColor == "undefined") {
    document.optionsForm.clockColor[0].checked = true;
  } else if (clockColor == "w") {
    document.optionsForm.clockColor[1].checked = true;
  } else {
    document.optionsForm.clockColor[0].checked = true;
  }
}

window.addEventListener("load", restore_options);