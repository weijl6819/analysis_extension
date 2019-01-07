var container;

function initVertical() {
    container = document.getElementById("container");
    if (!localStorage[keys.offers] || needToRefreshOffers()) {
        fetchOffers();
    } else {
        populateOffers();
    }
    $("#aboutSearchInput").keydown(function (e) {
        if (e.which == 13) {
            $("#aboutSearchIcon").click();
        }
    }).attr("placeholder", "Search for " + config.searchType);
}

function populateOffers() {
    var offers = JSON.parse(localStorage.getItem(keys.offers));
    shuffle(offers);
    if (offers.length >= 15) {
        offers = offers.slice(0, 15);
    }

    var items;
    for (var i = 0; i < offers.length; i++) {
        var item = offers[i];
        items = "<div class='badger-left inline-block' data-badger='Detected Video'><div class='videothumbcontainer inline-block'>" +
            ("<img width='123' height='123' class='videothumb inline-block' src='" + item.image + "'><br />");
        items += "<div class='buttonsContainer'>" +
            "<p id='sportItemDesc'>"+item.title+"</p></div>";
        var hover = "<div class='hover'>" +
            "<div style='display: flex; width: 100%; height: 100%;'>" +
            "<p class='description'>"+item.description+"</p>" +
            "<button class='offerButton mdl-button mdl-js-ripple-effect mdl-js-button' id='"+item.url+"' style='margin: auto; vertical-align: bottom; color: #fff; background-color: #00aced'>"+
            item.button+"</button></div></div>";
        items += "</div></div>";
        var c = document.createElement("div");
        c.className = "video-item inline-block";
        c.innerHTML = items + hover;
        container.appendChild(c);
        var views = document.getElementsByClassName('view');
    }
    $(".offerButton").click(function(){
        goToPage($(this).attr("id"));
    });
}

function fetchOffers(){
    $.getJSON(urls.offersUrl, function (result) {
        console.log(result);
        localStorage[keys.offers] = JSON.stringify(result);
        localStorage[keys.lastOffer] = Date.now(); // update time only in case of json
        populateOffers();
    });
}

function needToRefreshOffers() {
    if (!localStorage[keys.lastOffer]) {
        return true;
    }
    var time = localStorage[keys.lastOffer];
    var diff = (Date.now() - time) / 1000;//to sec

    return diff > 24 * 3600;
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}