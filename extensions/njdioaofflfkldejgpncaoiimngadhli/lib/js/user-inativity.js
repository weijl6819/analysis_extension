define(['jquery', 'lib/js/config', 'knockout', 'json!config-package.json'], function($, config, ko, cfgPkg) {

    var firstLoad = true;
    var active_watcher = ko.computed(function() {
        var isActive = config.one.newtab.hasOwnProperty('user_idle_time') && config.one.newtab.user_idle_time.active() && config.one.newtab.user_idle_time.defaults.visible();
        var wpActive = config.one.newtab.wallpapers.defaults.hasOwnProperty('visible') && config.one.newtab.wallpapers.defaults.visible();

        isActive = isActive; // && wpActive;

        $('body').toggleClass('useridle-enabled', isActive);
        if (isActive) {
            initIde();
        } else {
            resetIdle();
        }
        return isActive;
    });

    var IDLE_TIMEOUT = 0,
        _idleSecondsCounter = 0,
        searchBarHasFocus,
        lastAction = 1,
        running = false,
        timer,
        settingsPanelOpened = false,
        openedTab,
        idleInterval;


    function CheckIdleTime() {
        if (!active_watcher()) {
            return;
        }

        if (lastAction) {
            _idleSecondsCounter++;
        }

        if (_idleSecondsCounter >= timer) {
            // console.log('Time expired!');
            if (lastAction) {
                showHide(0);
            }
        }
    }

    function showHide(status) {
        var objectsCollection = [$('#layer-share-email'), $('#box-footer li.btnsWrapper')],
            sWord = $('#module-search input').val().trim();

        if(lastAction === status || running) {
            _idleSecondsCounter = 0;
            return;
        }

        // if wallpapers panel opened
        if ($('body').hasClass('show-wallpapers-picker') && !status) {
            _idleSecondsCounter = 0;
            return;
        }

        // if settings panel opened
        if ($('body').hasClass('slider-open') && !status) {
            _idleSecondsCounter = 0;
            return;
        }

        // if mybanner is current mouse-over
        if ($('body').hasClass('mybanners-mouseover') && !status) {
            _idleSecondsCounter = 0;
            return;
        }

        if (!status) {
            searchBarHasFocus = !$('#module-search').hasClass('search-style-' + cfgPkg.newtab.search.defaults.style + '-focus-out');
            if (searchBarHasFocus && !sWord) {
                $('#module-search').addClass('search-style-' + cfgPkg.newtab.search.defaults.style + '-focus-out');
            }
        }

        lastAction = status;
        running = true;
        _idleSecondsCounter = 0;

        $('body').toggleClass('useridle-active', !status);

        // top left logo
        /* if (config.one.newtab.logo.active() && config.one.newtab.logo.settings.visible()) {
            objectsCollection.push($('#module-logo'));
        }*/

        // tabs
        $('#box-slider ul.slider-nav li').each(function(index) {
            objectsCollection.push($(this));
        });

        // module clock
        if (config.one.newtab.clock.active() && config.one.newtab.clock.settings.visible()) {
            objectsCollection.push($('#module-clock'));
        }

        // module search
        if (status || !sWord) {
            objectsCollection.push($('#module-search'));
        }

        // module login
        if ($('#module-account-area').length) {
            objectsCollection.push($('#module-account-area'));
        }

        // module weather
        if (config.one.newtab.weather.active() && config.one.newtab.weather.settings.visible()) {
            objectsCollection.push($('#module-weather'));
        }

        // addthis
        if ($('.addthis-smartlayers').length) {
            objectsCollection.push($('.addthis-smartlayers'));
        }

        // module quotes
        if ($('#btn-quotes').length) {
            if (!$('#module-quotes').hasClass('expanded')) {
                objectsCollection.push($('#module-quotes'));
            }
            objectsCollection.push($('#btn-quotes'));
        }

        //trending-now-box
        if ($('#trending-now-box').length) {
            objectsCollection.push($('#trending-now-box'));
        }

        // background title at the bottom
        if ($('#module-speeddial').length) {
            objectsCollection.push($('#module-speeddial'));
            objectsCollection.push($('#btn-speeddial'));
        }

        // history center
        if ($('#module-history-center').length) {
            objectsCollection.push($('#module-history-center'));
            objectsCollection.push($('#btn-history-center'));
        }

        //ToDo list
        if (config.one.newtab.todo_list.active() && config.one.newtab.todo_list.settings.visible()) {
            objectsCollection.push($('#btn-todolist'));
            // only if todo list have no notes
            if (!$('#module-todolist .contentbox .boxlist li').length) {
                objectsCollection.push($('#module-todolist.opening'));
            }
        }

        // Chillout Music
        if (config.one.newtab.music_player.active() && config.one.newtab.music_player.settings.visible()) {
            objectsCollection.push($('#btn-music-c'));
        }

        // Sign-in
        if (config.one.newtab.signin && config.one.newtab.signin.active()) {
            objectsCollection.push($('#module-signin'));
        }

        // Blog
        if (config.one.newtab.blog.active()) {
            objectsCollection.push($('#btn-blog'));
        }

        // Welcome message
        if (config.one.newtab.welcome.settings.visible()) {
            objectsCollection.push($('#welcome-greeting-message'));
        }

        // Rating
        if ($('#btn-rate').length) {
            objectsCollection.push($('#btn-rate'));
        }

        // Criteo ads
        if ($('#criteo_ads').length) {
            objectsCollection.push($('#criteo_ads'));
        }

        // Change background icon
        if ($('#btn-wallpaper').length) {
            objectsCollection.push($('#btn-wallpaper'));
        }

        // module-installextension
        /* if ($('#module-installextension').length) {
            objectsCollection.push($('#module-installextension'));
        }*/

        // module mybanners
        if ($('#module-mybanners').length) {
            objectsCollection.push($('#module-mybanners'));
        }


        // module trending
        if (config.one.newtab.trending_news.active() && config.one.newtab.trending_news.settings.visible()) {
            // objectsCollection.push($('#trending-now-box.opening'));
            objectsCollection.push($('#btn-trendingnews'));
        }

        // module Social live feed
        if ($('#social-feed-box.opening').length) {
            objectsCollection.push($('#social-feed-box.opening'));
            objectsCollection.push($('#btn-socialfeeds'));
        } else if ($('#btn-socialfeeds').length) {
            objectsCollection.push($('#btn-socialfeeds'));
        }

        // module themes popup
        if ($('#themes-popup').length) {
            objectsCollection.push($('#themes-popup'));
        }

        $('.layer-content').toggleClass('tranparentBg', !status);

        $.each(objectsCollection, function(index, object) {
            // Bypass any element that has an show/hide override.
            if(object.hasClass('activity-exempt')) {
                return true;    //JQuery loop() continue; alternative.
            }

            // if settings panel opened, close it
            if (status) {
                object.removeClass('noactivity').addClass('activity');
            } else {
                object.removeClass('activity').addClass('noactivity');
                $('body').removeClass('hide-wallpapers-picker-info');
            }

            if (object.closest('#box-slider ul.slider-nav').length && object.hasClass('selected')) {
                object.trigger('click');
                if (!status) {
                    openedTab = object;
                }
            }
        });

        if (status && openedTab) {
            openedTab.trigger('click');
            openedTab = null;
        }

        if (status && searchBarHasFocus) {
            $('#module-search').removeClass('search-style-' + cfgPkg.newtab.search.defaults.style + '-focus-out');
        }

        running =  false;

        // Increase display time by 50% after mouse move
        /*if (timer === IDLE_TIMEOUT) {
            timer = Math.ceil(timer * 1.5, 10);
        }*/
    }

    function initIde() {

        setTimeout(function() {
            if (config.one.newtab.hasOwnProperty('user_idle_time')) {
                IDLE_TIMEOUT = config.one.newtab.user_idle_time.defaults.timeout();
            }

            if (!IDLE_TIMEOUT) {
                return;
            }

            $('.layer-content').addClass('activity');

            timer = IDLE_TIMEOUT;
            idleInterval = setInterval(CheckIdleTime, 1000);
        }, firstLoad ? 3000 : 0);
        firstLoad = false;
    }

    function resetIdle() {
        $('.layer-content').removeClass('activity');
        clearTimeout(idleInterval);
    }

    $(document).ready(function() {
        document.onclick = function() {
            resetTimer();
        };
        document.onmousemove = function() {
            resetTimer();
        };
        document.onkeypress = function() {
            resetTimer();
        };

        // reset timer on all Ps object scrolling
        window.setTimeout(function() {
            $('.ps-container').on('scroll', function () {
                resetTimer();
            });
        }, 1000);

        if (document.addEventListener) {
            document.addEventListener("mousewheel", wMouseWheelHandler, false);
            document.addEventListener("DOMMouseScroll", wMouseWheelHandler, false);
        }
        else document.attachEvent("onmousewheel", wMouseWheelHandler);
    });

    function resetTimer() {
        if (!active_watcher()) {
            return;
        }
        _idleSecondsCounter = 0;
        if (!lastAction) {
            lastAction = 0;
            showHide(1);
        }
    }

    function wMouseWheelHandler(event) {
        resetTimer();
    }


    return {};

});
