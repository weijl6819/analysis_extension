define([
    './alarms',
    './apps',
    './bookmarks',
    './broker',
    './browser',
    './conflicting',
    './default-search',
    './most-visited',
    './permissions',
    './pstorage',
    './recently-closed',
    './runtime',
    './social',
    './storage',
    './tabs',
    './windows'
], function(
    alarms,
    apps,
    bookmarks,
    broker,
    browser,
    conflicting,
    defaultSearch,
    mostVisited,
    permissions,
    pstorage,
    recentlyClosed,
    runtime,
    social,
    storage,
    tabs,
    windows
) {

    return {
        target         : 'google-chrome-extension',

        alarms         : alarms,
        apps           : apps,
        bookmarks      : bookmarks,
        broker         : broker,
        browser        : browser,
        conflicting    : conflicting,
        defaultSearch  : defaultSearch,
        mostVisited    : mostVisited,
        permissions    : permissions,
        pstorage       : pstorage,
        recentlyClosed : recentlyClosed,
        runtime        : runtime,
        social         : social,
        storage        : storage,
        tabs           : tabs,
        windows        : windows
    };

});
