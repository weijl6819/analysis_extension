(function(factory) {
    if(typeof define === 'function' && define.amd) {
        // AMD anonymous module
        define([], factory);
    }
    else if(typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // CommonJS/Node.js
        module.exports = factory();
    }
})(function() {

    return {

        carousel: {
            update_delay: 86400000, // 24 hours
            retry_delay:  15000 // 15 seconds
        },

        clock: {
            hour_formats: ['hour-12', 'hour-24']
        },

        favicon: {
            default_icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAArklEQVR4XqWQQQqDQAxFf1zY21k3XsAeoHgYu7NasV5QqM5mUlACw5RMWvrh7T6Pn2TMjH/IEGSaJtYgIoRIQsFurKrqg2VZMI4jI04s8P7obJsTICmKM4bhIRJ9QSplWaLvB04s8ADiW4975/m5s64vdN2df1pQ15cQ6SkLojjnQqSnC4hgYAiOUAJbYCA9/YkW9hOJdOwFIOT5SQWg1AJG295MvFcETXOlbxHBG8Vy2fHIq9l6AAAAAElFTkSuQmCC'
        },

        live_feeds: {
            api_get:      'https://proxy.mystart.com/fetch/?feeds=',
            update_delay: 300000, // 5 minutes
            retry_delay:  15000 // 15 seconds
        },

        most_visited: {
            link_count:   10,
            render_delay: 15000 // ms
        },

        newtab: {
            key_is_active: 'newtab-isactive',
            default_is_active: true
        },

        recently_closed: {
            link_count: 10,
            max_items:  100
        },

        search: {
            engines: ['default', '0'],
            suggestion_count: 6,
            suggestion_delay: 333 // ms
        },

        social: {
            api_get: 'https://mystart.com/browser-extensions/social/rate/like_follow.php',
            update_delay: 3600000, // 60 minutes
            retry_delay:  900000, // 15 minutes
        },

        social_live_feeds: {
            api_get: 'https://proxy.mystart.com/socialfeeds/feed.json',
            update_delay: 900000, // 15 minutes
            retry_delay:  300000 // 5 minutes
        },

        tab_apps: {
            icon_size: 128,
        },

        user_history: {
            link_count: 30
        },

        history_center: {
            link_count: 32,
            screenshot_api: {
                url: 'https://thumb.mystartcdn.com/api/v1/thumbnail/{domain}/{width}/{height}',
                width: 175,
                height: 112
            }
        },

        wallpapers: {
            update_delay: 86400000, // 24 hours
            retry_delay:  15000, // 15 seconds
            cached_count: 10,
        },

        weather: {
            units:        ['imperial', 'metric'],
            api_get_geoip:      'https://www.mystart.com/api/weather/',
            api_get_cityid:     'https://www.mystart.com/api/v3/weather/location/',
            api_get_forecast:   'https://www.mystart.com/api/v3/weather/',
            update_delay: 900000, // 15 minutes
            retry_delay:  15000 // 15 seconds
        }

    };

});
