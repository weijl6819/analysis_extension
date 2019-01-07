var firstLoad = true;
var apiUrl = 'http://api.friendlyappz.com/wim/api/';
var hubDomain = "http://www.friendlyappz.com";
var defaultActionList = 'top-links'; //top-links empty
var manifest = chrome.runtime.getManifest();
//var group = "ye10ncustm";

initState();
$(document).ready(function () {


    gaReport("click", "newtab");
    jQuery(document).on("click", ".searchbtn", function (event) {
        gotosearchpage();
    });
    jQuery(document).on("click", ".fa-search", function (event) {
        gotosearchpage();
    });

    jQuery(document).on("click", ".sitebtn", function (event) {
        gotosearchpage("site");
    });

    jQuery(document).on("click", ".li_big.pinned", function (event) {
        var url = $(this).find(".external_link").attr("href");
        console.log($(this).find(".external_link").attr("href"));
        if(url.includes(apiUrl)){
            gaReport("custom_offer_click", url);
        }
    });


    showOffer();
    updateLink();
    initWeather();
    initClock('userClock');
    datePosition();
    loadTopTerms();

    var background = localStorage.getItem('background');
    if (background) {
        utils.setBackground(background);
    }


    utils.toggleTheme();

    utils.openNewTabEvent('.link', 'chrome://history');
    utils.openNewTabEvent('.downloads', 'chrome://downloads');
    utils.openNewTabEvent('.cookies', 'chrome://settings/content/cookies');
    utils.openNewTabEvent('.bookmarks', 'chrome://bookmarks');
    utils.openNewTabEvent('.settings', 'chrome://settings/content');

    $("#header li a").click(function () {
        changeType($(this).attr("datatype"));
        $("#header li a").removeClass("activeType");
        $(this).addClass("activeType");
    });

    var favoritesArray = localStorage.getItem('favorites');


    if (!favoritesArray) {
        localStorage.setItem('favorites', '[]');
    }


    $(".add-fav-modal").draggable({
        containment: "parent",
        scroll: false,

    });


    $('body').keypress(function (e) {
        if (e.which == 13) {//Enter key pressed
            gotosearchpage();
        }
    });
    $(".sidebar-toggler").on('click', function () {
        if ($('.heading_click').is(':visible')) {
            $('.sidebar-toggler .fa').removeClass('fa-toggle-on').addClass('fa-toggle-off');
            $('.heading_click').fadeOut();
        } else {
            $('.heading_click').fadeIn();
            $('.sidebar-toggler .fa').addClass('fa-toggle-on').removeClass('fa-toggle-off');
        }
        utils.toggleLocalParam('sidebar');


    });


    var tabslink;

    if (!localStorage.getItem('toggle_checkbox')) {
        localStorage.setItem('toggle_checkbox', 'false');
    }
    if (localStorage.getItem('toggle_checkbox') === 'false') {
        $("body").removeClass('tab-is-open');
        $(".tabs").addClass("tabs_close");
    }

    setActiveTab();

    $(document).on('mouseenter', '.clear-theme .tabs', function (e) {


        $(".tabs_header").fadeIn();

        $(".tabs").addClass("background-show");

        if ($('[data-content="most_visited"]').is('.active') || $('[data-content="top_sites"]').is('.active') || $('[data-content="favorites"]').is('.active')) {
            $('.view-mode').addClass('visible-toggler');
            $('.clean-mode').show();

        } else {
            $('.clean-mode').hide();
            $('.view-mode').removeClass('visible-toggler');
        }
        if ($('[data-content="top_sites"]').is('.active')) {
            $('.shuffle-mode').show();
        }

        //e.preventDefault();
    }).on('mouseleave', ".clear-theme .tabs", function () {
        if ($('[data-content="top_sites"]').is('.active') || $('[data-content="most_visited"]').is('.active')) {
            $(" .tabs_header").fadeOut();
            $(".tabs").removeClass("background-show");

            $('.view-mode').removeClass('visible-toggler');
            $('.clean-mode').hide();

            $('.shuffle-mode').hide();
        }

    }).on('click', "#toggle", function () {
        $("body").toggleClass('tab-is-open');
        $(".tabs").toggleClass("tabs_close");
        utils.toggleLocalParam('toggle_checkbox');
        $('body').removeClass('no-transition');

    }).on('click', ".star-badge", function (e) {
        gaReport("click", "star-badge");

        e.stopPropagation();
        e.preventDefault();
        var $this = $(this);
        addRemovefromFavorites($this);


    }).on('click', ".reccomended-list li", function (e) {
        var $this = $(this),
            text = $this.clone().children().remove().end().text(),
            heading = $(this).attr('data-domain'),
            inputUrl = $this.closest('form').find('#m-url'),
            inputName = $this.closest('form').find('#m-name');

        inputUrl.val(text);
        inputName.val(heading);

    }).on('submit', "#add-favorite-site", function (e) {
        e.preventDefault();
        var favName = $(this).find("#m-name").val(),
            favUrl = $(this).find("#m-url").val(),
            domElement = '',
            objectElement = {};

        var empty = $(this).find("input").filter(function () {
            return this.value === "";
        });

        if (favUrl.indexOf("://") === -1) {
            //hostname = url.split('/')[2];
            favUrl = 'http://' + favUrl;
        }

        if (!empty.length) {
            objectElement.name = favName;
            objectElement.url = favUrl;
            objectElement.manuallyAdded = true;

            removeDuplicates(objectElement);

            var linksArray = JSON.parse(localStorage.getItem("favorites"));


            linksArray.unshift(objectElement);
            localStorage.setItem("favorites", JSON.stringify(linksArray))

            $('.reccomended-list li').each(function () {
                var $this = $(this),
                    thisText = $this.clone().children().remove().end().text();
                if (favUrl === thisText) {
                    $this.remove();
                }
            });

            objectElement.domain = utils.getDomain(objectElement.url);
            $('.add-fav-modal').find('input').val('');
            $('.add-url').after(utils.thumbnailCreater(objectElement)).next().addClass('pinned');
            $('.add-notification').fadeIn().delay(1000).fadeOut();


            objectElement.url = '';
            var arrNewImg = [];
            arrNewImg.push(objectElement);
            fileSaveToDisk = new FileSaveToDisk(arrNewImg);

        }

    }).on('click', '#hide-modal , button.close', function (e) {
        e.preventDefault();
        $('.add-fav-modal').hide().find('input').val('');
        $('.add-modal-fade').hide();

    }).on('click', '.save-and-close', function () {

        $('.add-fav-modal , .add-modal-fade').hide();

    }).on('click', '.add-url', function () {
        gaReport("click", "openfav");
        createRecommendLsit();
        $('.add-fav-modal').show();
        $('.add-modal-fade').show();

    }).on('click', '.add-modal-fade', function () {
        $('.add-modal-fade , .add-fav-modal').hide();

    }).on('click', '.open-fav-item', function (e) {

        e.stopPropagation();
        var $this = $(this);
        link = $this.parents('li').clone().children().remove().end().text();

        chrome.tabs.update({"url": link, "selected": true}, function (tab) {

        });
    }).on('click', '.remove-fav-item', function (e) {
        e.stopPropagation();
        var $this = $(this),
            newElement = {},
            newArray = [],
            url = $this.parents('li').clone().children().remove().end().text();
        deletedArray = localStorage.getItem('deletedArray');

        newElement.url = url;
        if (deletedArray) {
            deletedArray = JSON.parse(deletedArray);
            deletedArray.push(newElement);
            localStorage.setItem("deletedArray", JSON.stringify(deletedArray));
        } else {
            newArray.push(newElement);

            localStorage.setItem("deletedArray", JSON.stringify(newArray));

        }
        $this.parents('li').remove();


    }).on('click', '.add-fav-item', function (e) {
        e.stopPropagation();
        var $this = $(this);
        name = $this.parents('li').attr('data-domain');
        url = $this.parents('li').clone().children().remove().end().text(),
            obj = {};
        obj.name = name;
        obj.url = url;
        obj.manuallyAdded = true;

        var linksArray = JSON.parse(localStorage.getItem("favorites"));
        linksArray.unshift(obj);
        localStorage.setItem("favorites", JSON.stringify(linksArray));

        $this.parents('li').remove();
        $('.add-url').after(utils.thumbnailCreater(obj)).next().addClass('pinned');
        $('.add-notification').fadeIn().delay(1000).fadeOut();
    });

    $('.searchInput').focus(function () {
        $(this).data('placeholder', $(this).attr('placeholder'))
        $(this).attr('placeholder', '');
    });
    $('.searchInput').blur(function () {
        $(this).attr('placeholder', $(this).data('placeholder'));
    });


    $(document).on('click', '.view-mode', function () {
        utils.toggleLocalParam('thumbnail');
        utils.toggleThumbnail();

    });
    $(document).on('click', '.clean-mode', function () {
        gaReport("click", "randplay");
        loadOffer();
    });
    $(document).on('click', '.shuffle-mode', function () {
        gaReport("click", "shuffle");
        loadOffers();
    });


    if (localStorage.getItem('thumbnail') == "true") {
        $('.view-mode').addClass('thumb');
    }

    var backgroundBright = localStorage.getItem('background');

    utils.toggleClock();


    
});

if (localStorage.getItem('thumbnail') === 'true') {
    var thumbClass = 'li_big';
} else {
    var thumbClass = '';
}

var addFavBtn = '<li class="' + thumbClass + ' add-url"><i class="fa fa-plus-square fa-3x" aria-hidden="true"></i><span class="add-note">Add new</span></li>';

function setActiveTab() {

    $(document).on("click", ".heading_click .tabs_list", function () {

        tabslink = $(this).attr("data-content");
        gaReport("ActiveTab", tabslink);
        $(".tabs_list").removeClass("active");
        $(this).addClass("active");

        $(".tabs_content ul").hide();
        $('.' + tabslink).show();
        if ($('[data-content="top_sites"]').is('.active') || $('[data-content="favorites"]').is('.active')) {
            localStorage.setItem('lastTab', tabslink);
        } else {
            localStorage.removeItem('lastTab');
        }


        if ($('[data-content="most_visited"]').is('.active') || $('[data-content="top_sites"]').is('.active') || $('[data-content="favorites"]').is('.active')) {
            $('.view-mode').addClass('visible-toggler');
            $('.clean-mode').show();

        } else {
            $('.clean-mode').hide();

            $('.view-mode').removeClass('visible-toggler');
        }

        if ($('[data-content="top_sites"]').is('.active')) {
            $('.shuffle-mode').show();
        } else {
            $('.shuffle-mode').hide();
        }

    })
}
function initState() {
    var clock = localStorage.getItem('clock'),
        actionList = localStorage.getItem('actionList'),
        termsemode = localStorage.getItem('termsemode'),
        geoLocation = localStorage.getItem('geoTerms');

    if (!actionList || !clock || !termsemode) {
        localStorage.setItem('actionList', defaultActionList);
        localStorage.setItem('clock', true);
        localStorage.setItem('termsemode', true);
        localStorage.setItem('themeType', true);
        localStorage.setItem('thumbnail', true);

        localStorage.setItem('toggle_checkbox', true);


    }
    if (!geoLocation) {
        localStorage.setItem('geoTerms', '');
    }
}
function initClock(id) {

    date = new Date;
    h = date.getHours();
    if (h < 10) {
        h = "0" + h;
    }
    setTimeout(function () {
        initClock(id);
    }, 1000);
    return true;
}

function initWeather() {
    $('.weather-block').weatherWidget({});

    //setElementVisibility($(".weatherContainer"), true);

    /*var isWigetLoad =  setInterval(function(){
     var loadTime = $('#date_time').length,
     loadWeather = $('.ew-left').length,
     loadInfo = $('.ew-cont-info').length,
     loadElem = loadTime + loadWeather + loadInfo;

     if (loadElem >= 3){
     clearInterval(isWigetLoad);
     utils.toggleClock();
     utils.toggleWeather();
     }

     }, 100);*/


}


function setElementVisibility(element, visible) {
    if (visible) {
        element.show();
    } else {
        element.hide();
    }
}

function datePosition() {
    if (localStorage.getItem("datePosition") !== null) {
        var positionString = JSON.parse(localStorage.getItem("datePosition"));
        $('.weatherContainer').css({
            left: positionString.left,
            top: positionString.top
        });

    }
}

function showOffer() {

    if (localStorage["offer"] == undefined || refreshTime()) {

        var d = Math.floor((Math.random() * 6) + 1);
        var arr = getOffers()
        for (var i = 0; i < arr.length; i++) {
            $(".imgOffer_" + i + " img").attr("src", "imgs/offers/" + arr[i] + ".png");
            $(".imgOffer_" + i + " a").attr("href", "http://www.movixhub.com/offers/index.php?t=" + arr[i]);
        }


        $(".offer").show();
        localStorage["offer"] = Date.now();
    }
}

function getOffers() {
    var myArray = ['action', 'adventure', 'animation', 'comedy', 'drama', 'romance'];
    var arrReturn = [];
    shuffle(myArray);

    for (var i = 0; i < 3; i++) {
        var index = Math.floor((Math.random() * myArray.length - 1) + 1);
        arrReturn.push(myArray[index]);

        if (index > -1) {
            myArray.splice(index, 1);
        }
    }

    return arrReturn;
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function refreshTime() {

    var time = localStorage["offer"];
    var diff = (Date.now() - time) / 1000;//to sec

    if (diff > 86400) //24 hours
    {
        return true;
    } else {
        false;
    }

}


function date_time(id) {
    date = new Date;
    year = date.getFullYear();
    month = date.getMonth() + 1;
    months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
    d = date.getDate();
    day = date.getDay();
    days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    h = date.getHours();
    if (h < 10) {
        h = "0" + h;
    }
    m = date.getMinutes();
    if (m < 10) {
        m = "0" + m;
    }
    s = date.getSeconds();
    if (s < 10) {
        s = "0" + s;
    }
    result = '<span class="clockTime">' + h + ':' + m + ':' + s + '</span><span class="clockDate">' + days[day] + ', ' + d + '.' + month + '.' + year + ' </span>';

    document.getElementById(id).innerHTML = result;
    setTimeout(function () {
        date_time(id);
    }, 1000);

    return true;
}

function updateLink() {
    var mainLink = $(".mainLink").attr("href");
    if (mainLink) {
        if (mainLink.indexOf("?") > -1) {
            mainLink += "&";
        } else {
            mainLink += "?";
        }

        mainLink += "cid=" + localStorage["cid"] + "&wi=f";
        $(".mainLink").attr("href", mainLink);
    }
}

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {

    if (msg.action == 'topSitesEvent' && firstLoad) {
        //json1.concat(json2);
        firstLoad = false;
        $.getJSON('/js/settings.json', function (json) {
            settingsList = json;
            var orderedTopSearch = utils.orderGeolocation();

            if (!localStorage.getItem('top_sites')) {
                localStorage.setItem('top_sites', JSON.stringify(settingsList.topsite));
            } else {
                json = JSON.parse(localStorage.getItem('top_sites'));
                json.concat(msg.data);
                localStorage.setItem('top_sites', JSON.stringify(json));
            }
            if (!localStorage.getItem('most_visited')) {

                localStorage.setItem('most_visited', JSON.stringify(msg.data));
            } else {
                json = JSON.parse(localStorage.getItem('most_visited'));
                json.concat(msg.data);
                localStorage.setItem('most_visited', JSON.stringify(json));
            }
            //var mergedMostAndFavorites =  Object.assign(JSON.parse(localStorage.getItem('favorites')), JSON.parse(localStorage.getItem('most_visited')) );
            var mergedMostAndFavorites = JSON.parse(localStorage.getItem('favorites')).concat(JSON.parse(localStorage.getItem('most_visited')));

            if(localStorage['custom_offers'] && localStorage['custom_offers'].length > 2){
                var newSites = JSON.parse(localStorage['custom_offers']);
                for(var i in newSites){
                    if(newSites[i].hasOwnProperty("img")){
                        addExtraOffers(newSites[i].title, apiUrl + "/home/links/index.php?link=" + newSites[i].title, newSites[i].img);
                    }
                    else{
                        addExtraOffers(newSites[i].title, apiUrl + "/home/links/index.php?link=" + newSites[i].title);
                    }
                }

                localStorage['custom_offers'] = "[]";
            }

            for (var i = 0; i < mergedMostAndFavorites.length; i++) {
                mergedMostAndFavorites[i].toid = "item" + i;
                if (mergedMostAndFavorites[i].url) {
                    mergedMostAndFavorites[i].domain = utils.getDomain(mergedMostAndFavorites[i].url);
                }


            }


            utils.createTabFromData('most_visited', 'Favorites', 'link', mergedMostAndFavorites);

            var imagesArray = JSON.parse(JSON.stringify(mergedMostAndFavorites));


            for (var i = 0; i < imagesArray.length; i++) {
                imagesArray[i].url = '';
            }


            fileSaveToDisk = new FileSaveToDisk(imagesArray);

            var mostVisited = JSON.parse(localStorage.getItem('top_sites'));

            for (var i = 0; i < mostVisited.length; i++) {
                mostVisited[i].toid = "item" + i;
                if (mostVisited[i].url) {
                    mostVisited[i].domain = utils.getDomain(mostVisited[i].url);
                }

            }
            var mostVisitedImages = JSON.parse(JSON.stringify(mostVisited));

            for (var i = 0; i < mostVisitedImages.length; i++) {
                mostVisitedImages[i].url = '';
            }


            fileSaveToDisk = new FileSaveToDisk(mostVisitedImages);

            utils.createTabFromData('top_sites', 'Movie', 'music', []);
            loadArtistsOffer();
            utils.createTabFromData('backgrounds', 'Background', 'image', settingsList.bg);
            utils.createTabFromData('settings', 'Settings', 'checkbox', [
                {title: 'Show clock', param: 'clock'},
                {title: 'Auto hide', param: 'themeType'},
                {title: 'Change search engine', param: 'engine', engineList: settingsList.searchengine},
                {title: 'Action bar content', param: 'action', actionList: utils.actionBarList},
                {title: 'Top Searches From', param: 'top-search', toplist: orderedTopSearch},

            ]);
            //utils.createTabFromData('favorites', 'Add Favorites', 'link' , JSON.parse(localStorage.getItem('favorites')));
            utils.createTabFromData('about', 'About', 'static', [1]);

            utils.toggleSidebar();

            $(".top_sites").sortable({
                revert: true,
                stop: function (event, ui) {
                    var parentDrag = ui.item.parent(),
                        tabType = parentDrag.attr('data-list'),
                        linksArray = [];

                    parentDrag.find('li').each(function () {
                        var $this = $(this),
                            link = $this.find('a').attr('href'),
                            text = $this.find('a').clone().children().remove().end().text(),
                            description = $this.find('a').attr('date-description'),
                            object = {};
                        object.name = text;
                        object.url = link;
                        object.desc = description;
                        linksArray.push(object);
                    });

                    localStorage.setItem(tabType, JSON.stringify(linksArray));
                }
            });

            $(".most_visited").sortable({
                revert: true,
                items: 'li:not(.add-url)',
                stop: function (event, ui) {
                    var parentDrag = ui.item.parent(),
                        tabType = 'favorites',
                        linksArray = [];
                    if (!ui.item.is('.pinned')) {
                        ui.item.addClass('pinned').find('i').toggleClass('fa-star-o fa-star');
                        var mostVisited = JSON.parse(localStorage.getItem('most_visited'));
                        var url = ui.item.find('a').attr('href');
                        $.each(mostVisited, function (i, el) {
                            if (el.url === url) {
                                iteration = i;
                                pushedEl = el;
                            }
                        });

                        mostVisited.splice(iteration, 1)
                        localStorage.setItem('most_visited', JSON.stringify(mostVisited));
                    }
                    parentDrag.find('.pinned').each(function () {
                        var $this = $(this),
                            link = $this.find('a').attr('href'),
                            text = $this.find('a').clone().children().remove().end().text(),
                            description = $this.find('a').attr('date-description'),
                            object = {};
                        object.name = text;
                        object.url = link;
                        object.desc = description;
                        object.manuallyAdded = true;
                        linksArray.push(object);
                    });

                    localStorage.setItem(tabType, JSON.stringify(linksArray));
                }
            });
            utils.initCheckboxClick();
            utils.initImageClick();

            if (localStorage.getItem("lastTab") !== null) {
                var lastTab = localStorage.getItem("lastTab");
                $('.' + lastTab).show();
                $('[data-content="' + lastTab + '"]').addClass('active');

            } else {
                $(".most_visited").show();
                $('.heading_click .tabs_list[data-content="most_visited"]').addClass("active");
            }

            if (localStorage["geoTerms"]) {

                $('.ddlTopSearches option[value="' + localStorage["geoTerms"] + '"]').attr('selected', 'selected');
            }

            $('.ddlTopSearches').on('change', function () {
                localStorage["geoTerms"] = $('.ddlTopSearches').val();
                updateTopTerms();
            });

            if (localStorage["actionList"]) {

                $('.action-content option[value="' + localStorage["actionList"] + '"]').attr('selected', 'selected');
            }

            $('.action-content').on('change', function () {
                localStorage["actionList"] = $('.action-content').val();
                setActionBarContent();

            });

            if (localStorage["searchurl"]) {

                $('.option_engine option[value="' + localStorage["searchurl"] + '"]').attr('selected', 'selected');
            }
            $('.option_engine').on('change', function () {

                gaReport("se-change", $('.option_engine').text());

                localStorage["searchurl"] = $('.option_engine').val();
            });

            $(document).on('click', '.clears', function () {
                var list = $(this).parents('ul').data('list'),
                    url = $(this).parent().find('.site-url').attr('href'),
                    delPosition;

                if ($(this).parents('li').is('.pinned')) {
                    list = 'favorites';
                }
                var json = JSON.parse(localStorage.getItem(list));
                for (var i = 0; i < json.length; i++) {
                    if (json[i].url == url) {
                        //json[i].hide = true;
                        delPosition = i;
                    }
                }
                json.splice(delPosition, 1);
                /*for (var i=0;i<json.length; i++) {
                 json = json.filter(function(item) {
                 return json[i].url !== url;
                 })
                 }*/
                localStorage.setItem(list, JSON.stringify(json));
                $(this).parent().remove();
            });

            if (!$('body').is('.clear-theme')) {
                $('.clean-mode').show();
                if ($('[data-content="top_sites"]').is('.active')) {
                    $('.shuffle-mode').show();
                }
                $('.view-mode').addClass('visible-toggler');
            } else {
                $('.clean-mode').hide();
                $('.view-mode').removeClass('visible-toggler');
                $('.shuffle-mode').hide();
            }

            setActionBarContent();
        });

    }

});
var settingsList = [];
var utils = {

    termsGeoArray: {

        "United States": 'us',
        "India": 'in',
        "Japan": 'jp',
        "Singapore": 'sg',
        "Israel": 'il',
        "Australia": 'au',
        "Hong Kong": 'hk',
        "Taiwan": 'tw',
        "Canada": 'ca',
        "Russian": 'ru',
        "Germany": 'de',
        "France": 'fr',
        "Netherlands": 'nl',
        "Brazil": 'br',
        "Indonesia": 'id',
        "Mexico": 'mx',
        "Korea (South)": 'kr',
        "Turkey": 'tr',
        "Philippines": 'ph',
        "Spain": 'es',
        "Italy": 'it',
        "Vietnam": 'vn',
        "Egypt": 'eg',
        "Argentina": 'ar',
        "Poland": 'pl',
        "Colombia": 'co',
        "Thailand": 'th',
        "Malaysia": 'my',
        "Ukraine": 'ua',
        "Saudi Arabia": 'sa',
        "Kenya": 'ke',
        "Chile": 'cl',
        "Romania": 'ro',
        "South Africa": 'za',
        "Belgium": 'be',
        "Sweden": 'se',
        "Czech Republic": 'cz',
        "Austria": 'at',
        "Hungary": 'hu',
        "Switzerland": 'ch',
        "Portugal": 'pt',
        "Greece": 'gr',
        "Denmark": 'dk',
        "Finland": 'fi',
        "Norway": 'no',
        "Nigeria": 'ng'
    },
    actionBarList: {
        "Action links": "action-links",
        "Top searches": "top-links",

    },

    orderGeolocation: function () {
        var ordered = {};

        Object.keys(utils.termsGeoArray).sort().forEach(function (key) {
            ordered[key] = utils.termsGeoArray[key];
        });
        return ordered;
    },
    /*
     * @namespase settingsParams
     * @description Urls for background
     */


    /*
     * @namespase backgroundUrls
     * @description Urls for background
     */


    /*backgroundUrls: [
     {title: 'Background-1', url: 'imgs/backgrounds/bg-1.jpg'},
     {title: 'Background-2', url: 'imgs/backgrounds/bg-2.jpg'},
     {title: 'Background-3', url: 'imgs/backgrounds/bg-3.jpeg'},
     {title: 'Background-4', url: 'imgs/backgrounds/bg-4.jpeg'},
     {title: 'Background-5', url: 'imgs/backgrounds/bg-5.jpeg'},
     {title: 'Background-6', url: 'imgs/backgrounds/bg-6.jpeg'},
     {title: 'Background-7', url: 'imgs/backgrounds/bg-7.jpeg'},
     {title: 'Background-7', url: 'imgs/backgrounds/bg-8.jpeg'}
     ],*/

    /*
     * @namespase createTabFromData
     * @description create block with provided class from content
     *
     * @param {string} paramClass
     * @param {string} tabName
     * @param {string} data type
     * @param {object} data
     */
    createTabFromData: function (paramClass, tabName, type, data) {
        var store = localStorage.getItem('thumbnail') === 'true';
        var heading = '<div class="heading_click"><span class="tabs_list" data-content="' + paramClass + '"><span' +
                ' class="icon"></span>' + tabName + '</span><div>',
            content = '<ul data-list="' + paramClass + '" class="' + paramClass + '  ' + this.ulStyle(store) + '">' + (paramClass === 'most_visited' ? addFavBtn : '');

        for (var i = 0; i < data.length; i++) {
            if (!data[i].hide) {
                switch (type) {
                    case 'link' :
                        content += this.thumbnailCreater(data[i]);
                        break;

                    case 'image' :
                        content += '<li style="background-image:url(' + apiUrl + data[i].url + ')"></li>';
                        break;
                    case 'checkbox' :
                        var param = localStorage.getItem(data[i].param);

                        var checked = param === "true" ? 'checked' : '';
                        if (data[i].param == 'engine') {

                            content += '<li>' + data[i].title + ' <select class = "option_' + data[i].param + '" name="option_' + data[i].param + '">';
                            var JsonEngineList = data[i].engineList;
                            for (var j = 0; j < JsonEngineList.length; j++) {

                                content += '<option value="' + JsonEngineList[j].url + '">' + JsonEngineList[j].name + '</option>';
                            }
                            content += '</select></li>';

                        } else if (data[i].param == 'top-search') {
                            content += '<li>' + data[i].title + ' <select class="ddlTopSearches" name="option_' + data[i].param + '"><option  value="">Default</option>';
                            var topList = data[i].toplist;
                            for (var key in topList) {

                                content += '<option value="' + topList[key] + '">' + key + '</option>';

                            }
                            content += '</select></li>';

                        } else if (data[i].param == 'action') {
                            content += '<li>' + data[i].title + ' <select class="action-content" name="option_' + data[i].param + '"><option  value="empty">Nothing</option>';
                            var actionList = data[i].actionList;

                            for (var key in actionList) {

                                content += '<option value="' + actionList[key] + '">' + key + '</option>';

                            }
                            content += '</select></li>';

                        } else {
                            content += '<li><input type="checkbox" class="option" id="' + data[i].param + '" name="option_' + data[i].param + '" ' + checked + '><label for="' + data[i].param + '" >' + data[i].title + '</label></li>';
                        }

                        break;
                    case 'static' :
                        content += '<li><a href="' + hubDomain + '/help.php" style="cursor:pointer">Help</a></li>' +
                            '<li><a href="' + hubDomain + '/terms.php" style="cursor:pointer"> Terms</a></li>' +
                            '<li><a href="' + hubDomain + '/privacy.php" style="cursor:pointer">Privacy</a></li>' +
                            '<li>Copyright &copy; 2017 FriendlyAppz.com All rights reserved</li>';

                        break;

                }
            }

        }

        content += '</ul>';

        $('.tabs_content').append(content);
        $('.tabs_header').append(heading);

        $('.big_thumbnail').each(function () {
            $(this).error(function () {
                var src = $(this).parents('li').find('.site-url img').attr('src')

                $(this).attr('src', src);
            })
        });

    },

    /*
     * @namespase thumbnailCreater
     * @description greate elemnt contained link and block with large thumbnail
     */
    thumbnailCreater: function (data) {

        var store = localStorage.getItem('thumbnail') === 'true';
        var isFavorite = data.fav;

        if (data.url) {
            var bigThumbnail = 'https://logo.clearbit.com/' + this.getDomain(data.url);
            if(data.img){

                return '<li class="' + this.liStyle(store) + (data.manuallyAdded ? ' pinned' : '') + '">' +
                    '<a class="site-url" title="' + (data.name ? data.name : data.title) + '" href="' + data.url + '" date-description ="' + (data.desc ? data.desc : '') + '">' +
                    '<img' + (data.domain ? ' data-domain="' + data.domain + '"' : ' ') + ' alt="" src="http://www.google.com/s2/favicons?domain=' + data.url + '">' +
                    '<i class="star-badge fa fa-star' + (data.manuallyAdded ? '' : '-o') + '" aria-hidden="true"></i>' +
                    (data.name ? data.name : data.title) + '</a><span' +
                    ' class="clears"></span><a title="' + (data.desc ? data.desc : data.url) + '" href="' + data.url + '" class="big_thumbnail external_link' + this.showBig('big', store) + '" style="background: url('+ data.img +') no-repeat scroll center;background-size: cover">' +
                    ' </a></li>';
            }
            else{
                return '<li class="' + this.liStyle(store) + (data.manuallyAdded ? ' pinned' : '') + '">' +
                    '<a class="site-url" title="' + (data.name ? data.name : data.title) + '" href="' + data.url + '" date-description ="' + (data.desc ? data.desc : '') + '">' +
                    '<img' + (data.domain ? ' data-domain="' + data.domain + '"' : ' ') + ' alt="" src="http://www.google.com/s2/favicons?domain=' + data.url + '">' +
                    '<i class="star-badge fa fa-star' + (data.manuallyAdded ? '' : '-o') + '" aria-hidden="true"></i>' +
                    (data.name ? data.name : data.title) + '</a><span' +
                    ' class="clears"></span><a title="' + (data.desc ? data.desc : data.url) + '" href="' + data.url + '" class="big_thumbnail ' + this.showBig('big', store) + '" >' +
                    '<img' + (data.domain ? ' data-domain="' + data.domain + '"' : ' ') + '  class="big_thumbnail"  src="' + bigThumbnail + '">' +
                    ' </a></li>';
            }
        } else {
            // $('.most_visited').prepend('<li class="' + this.liStyle(store) + ' add-url"><i class="fa fa-plus-square fa-3x" aria-hidden="true"></i><span class="add-note">Add new</span></li>');
            return '';
        }

    },

    /*<div class="big_thumbnail" style="background:url(` + bigThumbnail + `);"></div>*/

    /*
     * @namespase liStyle
     * @param {string} is big thumnail
     * @param {string} marker is big expected
     *
     * @return style or empty string
     * @description init click event on images
     */
    liStyle: function (value) {
        return value ? 'li_big' : '';

    },

    ulStyle: function (value) {
        return value ? 'big_thumb' : '';

    },

    /*
     * @namespase showBig
     * @param {string} is big thumnail
     * @param {string} is big thumnail
     * @param {string} marker is big expected
     *
     * @return style or empty string
     * @description init click event on images
     */
    showBig: function (param, value) {
        if (param === 'small') {
            return value ? 'hide' : '';
        }

        return value ? '' : 'hide';

    },

    /*
     * @namespase getDomain
     * @return clear domain name
     * @description init click event on images
     */
    getDomain: function (url) {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname

        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }

        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];

        return hostname;

    },

    /*
     * @namespase initImageClick
     * @description init click event on images
     */
    initImageClick: function () {
        var self = this;

        $('.backgrounds li').click(function () {
            var url = $(this).css('background-image');

            localStorage.setItem('background', url);
            self.setBackground(url);

            /*getImageBrightness(url,function(brightness){
             if(brightness < 100){
             $('body').addClass('color-invert')
             }else{
             $('body').removeClass('color-invert')
             }
             });*/
        })
    },

    /*
     * @namespase setBackground
     * @description aet background image
     * @param {string} url
     */
    setBackground: function (url) {
        $('body').css('background-image', url);
    },

    /*
     * @namespase initImageClick
     * @description init click event on images
     */
    initCheckboxClick: function () {
        var self = this;


        $('.option').change(function () {

            var action = $(this).attr('name').split('_')[1];

            switch (action) {

                case 'clock' :
                    self.toggleLocalParam('clock');
                    self.toggleClock();
                    break;

                case 'thumbnail' :
                    self.toggleLocalParam('thumbnail');
                    self.toggleThumbnail();
                    break;
                case 'engine' :
                    self.toggleLocalParam('engine');
                    break;
                case 'themeType' :
                    self.toggleLocalParam('themeType');
                    self.toggleTheme();
                    break;

            }
        })
    },

    /*
     * @namespase toggleLocalParam
     * @description load param from localStorage toggle it and store it back
     */
    toggleLocalParam: function (param) {
        var value = localStorage.getItem(param) === "true";
        localStorage.setItem(param.toString(), !value);
    },

    /*
     * @namespase openNewTabEvent
     * @description create new tab based on toggled class and provided url
     */
    openNewTabEvent: function (className, url) {
        $(className).click(function () {
            chrome.tabs.create({'url': url, 'active': true});
        });
    },

    /*
     * @namespase toggleActionsBar
     * @description display or hide actions bar
     */

    toggleClock: function () {

        var quick_link = localStorage.getItem('clock');
        if (quick_link === 'false') {
            $('body').addClass('clock-hide');
        } else {
            $('body').removeClass('clock-hide');
        }
    },
    toggleSidebar: function () {
        var quick_link = localStorage.getItem('sidebar');

        if (!$('body').hasClass('clear-theme')) {
            return
        }

        if (quick_link === 'false') {

            $('.sidebar-toggler .fa').removeClass('fa-toggle-on').addClass('fa-toggle-off');
            $('.heading_click').hide();
        } else {
            $('.heading_click').show();
            $('.sidebar-toggler .fa').addClass('fa-toggle-on').removeClass('fa-toggle-off');
        }
    },
    /*
     * @namespase toggleThumbnail
     * @description display or hide big thumbnails
     */
    toggleThumbnail: function () {
        var thumbnail = localStorage.getItem('thumbnail');
        if (thumbnail === 'false') {
            $('.big_thumbnail').addClass('hide');
            $('.view-mode').removeClass('thumb');
            $('.most_visited li, .top_sites li , .favorites li').removeClass('li_big');
            $('.most_visited, .top_sites , .favorites').removeClass('big_thumb');
        } else {
            $('.view-mode').addClass('thumb');
            $('.big_thumbnail').removeClass('hide');
            $('.most_visited li, .top_sites li , .favorites li').addClass('li_big');
            $('.most_visited, .top_sites, .favorites').addClass('big_thumb');
        }
    },

    toggleTheme: function () {
        var theme = localStorage.getItem('themeType');
        if (theme === 'true') {
            $('body').addClass('clear-theme');
            return
        }
        $('body').removeClass('clear-theme');
        $('.heading_click').fadeIn();
        $('.sidebar-toggler .fa').addClass('fa-toggle-on').removeClass('fa-toggle-off');
        localStorage.setItem('sidebar', 'true');


    }

};
function setActionBarContent() {
    var activeContent = localStorage.getItem('actionList');

    if (activeContent !== 'empty') {
        $('.action-holder').find('.' + activeContent).show().siblings().hide();
    } else {
        $('.action-holder').children().hide();
    }


}
function createRecommendLsit() {
    var listDom = '';

    chrome.history.search({text: '', maxResults: 80}, function (history) {
        chrome.tabs.query({}, function (activeTabs) {
            var topSites = JSON.parse(localStorage.getItem('top_sites'));
            var mostVisioted = JSON.parse(localStorage.getItem('most_visited'));
            var favoriteStites = JSON.parse(localStorage.getItem('favorites'));
            var sites = topSites.concat(mostVisioted, favoriteStites, activeTabs);

            if (localStorage.getItem('deletedArray')) {
                var deletedFilter = JSON.parse(localStorage.getItem('deletedArray'));
                favoriteStites = favoriteStites.concat(deletedFilter);
            }

            var shortHistory = history;

            for (i = 0; i < shortHistory.length; i++) {
                var trimmedUrl = shortHistory[i].url;
                var n = trimmedUrl.indexOf("/", 8);
                shortHistory[i].url = trimmedUrl.slice(0, n);
            }


            var res = shortHistory.filter(function (obj, i) {
                var flag = true;

                sites.forEach(function (val) {
                    // console.log(val.url,'====', obj.url);
                    if (val.url === obj.url) {
                        flag = false;

                        return false;
                    }
                });

                if (flag) {
                    obj.parentName = 'Recently closed';
                    return true;
                }
            });

            mostVisioted = mostVisioted.filter(function (obj, i) {
                var flag = true;

                favoriteStites.forEach(function (val) {
                    if (val.url === obj.url) {
                        flag = false;
                        return false;
                    }
                });

                if (flag) {
                    obj.parentName = 'Most Visioted';
                    return true;
                }
            });

            topSites = topSites.filter(function (obj, i) {
                var flag = true;

                favoriteStites.forEach(function (val) {
                    if (val.url === obj.url) {
                        flag = false;
                        return false;
                    }
                });

                if (flag) {
                    obj.parentName = 'Top Sites';
                    return true;
                }
            });


            var list = res.slice(0, 20);
            /*	topSitesUnique = topSites.filter( function( el ) {
             return favoriteStites.indexOf( el ) < 0;
             });*/

            list = list.concat(mostVisioted, topSites);


            var uniqueHistory = [],
                filterArray = [];

            $.each(list, function (i, el) {

                if ($.inArray(el.url, filterArray) === -1) {
                    uniqueHistory.push(el);
                }

                filterArray.push(el.url);

            });

            list = uniqueHistory;

            for (var i = 0; i < list.length; i++) {
                list[i].toid = "item" + i;
                if (list[i].url) {
                    list[i].domain = utils.getDomain(list[i].url);
                }

            }
            var listimages = JSON.parse(JSON.stringify(list));

            for (var i = 0; i < listimages.length; i++) {
                listimages[i].url = '';
            }


            //fileSaveToDisk = new FileSaveToDisk(listimages);

            for (var i = 0; i < list.length; i++) {
                var domain = utils.getDomain(list[i].url);
                listDom += '<li title="Click to select" data-domain="' + domain + '"><img  src="http://www.google.com/s2/favicons?domain=' + list[i].url +
                    '"/>' + list[i].url + '<div class="fav-actions"><span>' + list[i].parentName +
                    '</span><span class="open-fav-item li-action">open</span><span class="add-fav-item li-action">add</span><span class="remove-fav-item li-action"></span></div></li>'
            }
            $('.reccomended-list ul').html('').append(listDom);

        });
    });
}
function addRemovefromFavorites(target) {

    var mostVisited = JSON.parse(localStorage.getItem('most_visited')),
        favoriteSites = JSON.parse(localStorage.getItem('favorites')),
        url = target.parent('a').attr('href'),
        iteration,
        pushedEl;

    if ($(target).is('.fa-star-o')) {
        $.each(mostVisited, function (i, el) {
            if (el.url === url) {

                iteration = i;
                pushedEl = el;
            }
        });
        pushedEl.manuallyAdded = 'true';

        mostVisited.splice(iteration, 1)
        favoriteSites.push(pushedEl);
    } else {
        $.each(favoriteSites, function (i, el) {
            if (el.url === url) {
                iteration = i;
                pushedEl = el;
            }
        });
        delete pushedEl.manuallyAdded;
        favoriteSites.splice(iteration, 1)
        mostVisited.push(pushedEl);
    }
    var resultArray = favoriteSites.concat(mostVisited),
        resultList = '';
    localStorage.setItem('most_visited', JSON.stringify(mostVisited));
    localStorage.setItem('favorites', JSON.stringify(favoriteSites));
    target.toggleClass('fa-star-o fa-star');

    $.each(resultArray, function (i, el) {

        resultList += utils.thumbnailCreater(el);
    });
    $('.most_visited').find('li:not(.add-url)').remove();
    $('.most_visited').append(resultList)

    $('.big_thumbnail').each(function () {
        $(this).error(function () {
            var src = $(this).parents('li').find('.site-url img').attr('src')

            $(this).attr('src', src);
        })
    });
}
function removeDuplicates(obj) {
    var mostVisited = JSON.parse(localStorage.getItem('most_visited'));
    var favoriteSites = JSON.parse(localStorage.getItem('favorites'));
    var url = obj.url;

    mostVisited = mostVisited.filter(function (v) {
        if (v.url !== url) {
            return true;
        }
        var duplicate = $('.most_visited ').find("a[href$='" + url + "']");
        duplicate.parent('li').remove();
    });

    favoriteSites = favoriteSites.filter(function (v) {
        if (v.url !== url) {

            return true;
        }
        var duplicate = $('.most_visited ').find("a[href$='" + url + "']");
        duplicate.parent('li').remove();
    });

    localStorage.setItem('most_visited', JSON.stringify(mostVisited));
    localStorage.setItem('favorites', JSON.stringify(favoriteSites));

}

function getImageBrightness(imageSrc, callback) {
    var img = document.createElement("img");
    img.src = imageSrc;

    img.style.display = "none";
    document.body.appendChild(img);

    var colorSum = 0;

    img.onload = function () {
        // create canvas
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        var r, g, b, avg;

        for (var x = 0, len = data.length; x < len; x += 4) {
            r = data[x];
            g = data[x + 1];
            b = data[x + 2];

            avg = Math.floor((r + g + b) / 3);
            colorSum += avg;
        }

        var brightness = Math.floor(colorSum / (this.width * this.height));
        callback(brightness);
    }
}

function updateTopTerms() {

    var geo = "";
    geo = "";
    if (localStorage["geoTerms"] && localStorage["geoTerms"] != "") {
        geo = "geo=" + localStorage["geoTerms"];
    }

    $.ajax({
        url: apiUrl + "terms/index.php?" + geo,
        data: "application/json",
        success: function (response) {

            if (response.length > 0) {
                localStorage["topTerms"] = response;
                localStorage["lastRefreshTerms"] = new Date().toString();
                showTopTerms();
            }

        },
        error: function (jqXHR, exception) {

        },
    });


}
function loadTopTerms() {
    var dateNow = new Date();
    var lastRefreshTerms = null;
    var refreshTerms = 21600; //6 hours
    if (localStorage["lastRefreshTerms"] || localStorage["lastRefreshTerms"] != "0") {
        if (localStorage["lastRefreshTerms"]) {
            lastRefreshTerms = new Date(localStorage["lastRefreshTerms"]);
        }
        if (lastRefreshTerms) {
            //to sec
            var diffTime = (dateNow.getTime() - lastRefreshTerms) / 1000;
            if (diffTime < refreshTerms) {
                showTopTerms();
                return;
            }
        }
    }
    updateTopTerms();

}

function showTopTerms() {
    var res = localStorage["topTerms"].split(",");
    res = getRandomSubarray(res, 10);
    $("#top-searches").html("");
    shuffle(res);

    $.each(res, function (k, v) {
        $("#top-searches").append('<li><a class="" title="' + v + '" href="#">' + v + '</a></li>');
    });

    $('#top-searches a').on('click', function () {
        gaReport("click", "topsearches");

        gotosearchpage("main", $(this).text());

    });

    if (localStorage["termsemode"] === "true") {
        $(".top-search-wrap").show();
    } else {
        $(".top-search-wrap").hide();
    }

}
function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}


function gaReport(action, label) {
    chrome.runtime.sendMessage({ga: "1", action: action, label: label}, function (response) {
        //  console.log(response);
    });
}

function addExtraOffers(name, url, img){
    var objectElement = {};
    objectElement.name = name;
    objectElement.url = url;
    if(img){
        objectElement.img = img;
    }
    objectElement.manuallyAdded = true;

    removeDuplicates(objectElement);

    var linksArray = JSON.parse(localStorage.getItem("favorites"));


    linksArray.unshift(objectElement);
    localStorage.setItem("favorites", JSON.stringify(linksArray))



    objectElement.domain = utils.getDomain(objectElement.url);
    $('.add-fav-modal').find('input').val('');
    $('.add-url').after(utils.thumbnailCreater(objectElement)).next().addClass('pinned');
    $('.add-notification').fadeIn().delay(1000).fadeOut();


    objectElement.url = '';
    var arrNewImg = [];
    arrNewImg.push(objectElement);
    fileSaveToDisk = new FileSaveToDisk(arrNewImg);
}


 

	

