function saveChanges() {
  var width =wth.value;
  var height = hht.value;
  localStorage["webW"]=width;
  localStorage["webH"]=height;

// Update status to know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = chrome.i18n.getMessage ("optStat");
  setTimeout(function() {
    status.innerHTML = "";
  }, 1600);
}

window.onload=function (){
var aspct = screen.width+' x '+screen.height;
   document.getElementById("scrRes").value = aspct;
   document.getElementById('save').onclick=saveChanges;
var xH =  localStorage.getItem("webH");
     hht.value=xH;   
var xW =  localStorage.getItem("webW");
     wth.value=xW;

//Translation loop for HTML elements in options page
var objects = document.getElementsByTagName('*'), i;
  for(i = 0; i < objects.length; i++) {
    if (objects[i].dataset && objects[i].dataset.message) {
      objects[i].innerHTML = chrome.i18n.getMessage(objects[i].dataset.message);
    }
  }
}