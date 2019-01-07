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
﻿// Config
var id = 14;
var header = "ABC News";

// Const
var domain = "http://www.1clickdaily.com";
var headerEncoded = encodeURIComponent(header);
// var headerParam = "";
var headerParam = "&header=" + headerEncoded + "&tId=" + id;

$('.wrapper').scrollbar();

(function () {
    var param = "?display=latest" + headerParam;
    $("#heading").text("Latest " + header);
    renderItems(param);
})();

document.getElementById("latest").addEventListener("click", function (event) {
    event.preventDefault();
    var param = "?display=latest" + headerParam;
    $("#heading").text("Latest " + header);
    renderItems(param);
});

document.getElementById("popular-today").addEventListener("click", function (event) {
    event.preventDefault();
    var param = "?display=popular-today" + headerParam;
    document.getElementById("heading").textContent = "Popular Today";
    renderItems(param);
});
document.getElementById("must-watch").addEventListener("click", function (event) {
    event.preventDefault();
    var param = "?display=must-watch";
    document.getElementById("heading").textContent = "Must Watch";
    renderItems(param);
});
document.getElementById("random").addEventListener("click", function (event) {
    event.preventDefault();
    var param = "?display=random" + headerParam;
    document.getElementById("heading").textContent = "Random";
    renderItems(param);
});

function renderItems(param) {

    document.getElementById("items").textContent = '';


    $.getJSON(domain + "/extensionJson.1.0.php" + param, function (result) {

        // Recommendations append
        if (result.meta.recommendation1 !== null) {
            var divElement = document.createElement("div");
            divElement.setAttribute("class", "recommendation1");

            var hrefElement = document.createElement("a");
            hrefElement.setAttribute("href", domain + result.meta.recommendation1.moreUrl);
            hrefElement.setAttribute("target", "_blank");

            var imageElement = document.createElement("img");
            imageElement.setAttribute("src", domain + result.meta.recommendation1.moreImage);
            imageElement.setAttribute("class", "icon");
            hrefElement.appendChild(imageElement);

            var textNode = document.createTextNode(result.meta.recommendation1.moreText);
            hrefElement.appendChild(textNode);

            divElement.appendChild(hrefElement);

            var itemsElement = document.getElementById("items");
            itemsElement.appendChild(divElement);
        }

        // Append items
        $.each(result.items, function (i, field) {
            var hrefElement = document.createElement("a");
            hrefElement.setAttribute("href", domain + field.href);
            hrefElement.setAttribute("class", "list-group-item");
            hrefElement.setAttribute("target", "_blank");

            var imageElement = document.createElement("img");
            imageElement.setAttribute("src", domain + field.image);
            imageElement.setAttribute("class", "lazy");
            hrefElement.appendChild(imageElement);

            if (field.flair !== null) {
                var flairElement = document.createElement("span");
                flairElement.setAttribute("title", "Must Watch");
                var flairNode = document.createTextNode(field.flair);
                flairElement.appendChild(flairNode);
                hrefElement.appendChild(flairElement);
            }

            var titleNode = document.createTextNode(field.title);
            hrefElement.appendChild(titleNode);

            var itemsElement = document.getElementById("items");
            itemsElement.appendChild(hrefElement);

        });

        var hrefElement = document.createElement("a");
        hrefElement.setAttribute("href", domain + result.meta.more.moreUrl);
        hrefElement.setAttribute("class", "list-group-item");
        hrefElement.setAttribute("target", "_blank");

        var textNode = document.createTextNode(result.meta.more.moreText);
        hrefElement.appendChild(textNode);

        var itemsElement = document.getElementById("items");
        itemsElement.appendChild(hrefElement);

        // Recommendations append
        var divElement = document.createElement("div");
        divElement.setAttribute("class", "recommendation2");

        var hrefElement = document.createElement("a");
        hrefElement.setAttribute("href", domain + result.meta.recommendation2.moreUrl);
        hrefElement.setAttribute("target", "_blank");

        var imageElement = document.createElement("img");
        imageElement.setAttribute("src", domain + result.meta.recommendation2.moreImage);
        imageElement.setAttribute("class", "icon");
        hrefElement.appendChild(imageElement);

        var textNode = document.createTextNode(result.meta.recommendation2.moreText);
        hrefElement.appendChild(textNode);

        divElement.appendChild(hrefElement);

        var itemsElement = document.getElementById("items");
        itemsElement.appendChild(divElement);
    });
}