// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("temperatureScale");
  var temperatureScale = select.children[select.selectedIndex].value;
  localStorage["temperatureScale"] = temperatureScale;

  // Update status to let user know options were saved.
  var status = document.getElementById("saveButton");
  status.innerHTML = "Options Saved";
  setTimeout(function() {
    status.innerHTML = "Save";
  }, 750);
  
  
  var port = chrome.extension.connect({name: "optionSaved"});
  port.postMessage({optionType: "temperatureScale"});
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var favorite = localStorage["temperatureScale"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("temperatureScale");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}

// Add event listener 
document.addEventListener('DOMContentLoaded', restore_options());
document.getElementById('saveButton').addEventListener('click', save_options);
