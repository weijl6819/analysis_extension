define(['rsvp', 'api/shim', 'lib/js/ajax', 'lib/js/config', 'lib/js/constants', 'lib/js/tools'], function(RSVP, shim, ajax, config, constants, tools) {

    var ALARM_NAME = 'alarm-feeds';



    function update(fetchRequired) {
        shim.pstorage.get('FRAMEWORK_FEEDS_DATA', function(error, storage) {
            if(error) {
                // Try again soon
                shim.alarms.create(ALARM_NAME, { when: Date.now() + constants.live_feeds.retry_delay });
                return;
            }

            var i;
            var storedFeeds = storage.hasOwnProperty('FRAMEWORK_FEEDS_DATA') ? storage.FRAMEWORK_FEEDS_DATA : { lastUpdate: 0, data: [] };
            var mergedFeeds = [], tmp;

            // Source: Panel
            tmp = config.one.newtab.live_feeds.defaults.items();
            if(tools.isArray(tmp))
                mergedFeeds = mergedFeeds.concat(tmp);

            // Source: Carousel
            tmp = config.one.newtab.carousel.defaults.items();
            if(tools.isArray(tmp))
                mergedFeeds = mergedFeeds.concat(tmp);

            if(mergedFeeds.length === 0)
                return;

            // Remove potential duplicates
            var dupeFilter = {};
            for(i = 0; i < mergedFeeds.length; ++i)
                dupeFilter[ mergedFeeds[i].url ] = mergedFeeds[i];

            // Check if feeds expired
            if(storedFeeds.lastUpdate + constants.live_feeds.update_delay * 0.9 <= Date.now())
                fetchRequired = true;

            // Check if feeds changed
            if(!fetchRequired) {
                var storedKeys = {};
                for(i = 0; i < storedFeeds.data.length; ++i)
                    storedKeys[ storedFeeds.data[i].key ] = i;

                for(i in dupeFilter) {
                    if(!storedKeys.hasOwnProperty( i )) {
                        fetchRequired = true;
                        break;
                    }
                }
            }

            // Do we need to fetch now?
            if(!fetchRequired) {
                // Must wait more...
                shim.alarms.create(ALARM_NAME, { when: (storedFeeds.lastUpdate || Date.now()) + constants.live_feeds.update_delay });
                return;
            }


            var uniqueCount = 0;
            var promises = {};
            var proxiedFeeds = [];

            var fetchSpecial = function(info) {
                return ajax({
                    url: info.url,
                    dataType: 'json'
                }).then(function(result) {
                    var feed = {
                        type:      info.type,
                        key:       info.url,
                        image:     result.data.header.image || null,
                        title:     info.title || result.data.header.name || null,
                        requested: Math.floor(Date.now() / 1000),
                        features:  {},
                        items:     result.data.items
                    };

                    for(var i = 0; i < feed.items.length; ++i) {
                        feed.items[i].category = null;
                        feed.items[i].description = null;

                        feed.items[i].title = feed.items[i].name;
                        feed.items[i].link  = feed.items[i].url;

                        delete feed.items[i].name;
                        delete feed.items[i].url;
                    }

                    result.data = feed;
                    return result;
                });
            };

            for(i in dupeFilter) {
                ++uniqueCount;

                if(dupeFilter[i].type === 'carousel') {
                    promises[i] = fetchSpecial(dupeFilter[i]);
                }
                else
                    proxiedFeeds.push(dupeFilter[i].url);
            }

            if(proxiedFeeds.length !== 0) {
                promises.feeds = ajax({
                    url: constants.live_feeds.api_get + encodeURIComponent(JSON.stringify(proxiedFeeds)),
                    dataType: 'json'
                });
            }



            RSVP.hash(promises).then(
                // Success
                function(results) {
                    var data = [], i;

                    for(i in results) {
                        if(tools.isArray(results[i].data))
                            data = data.concat(results[i].data);

                        else if(tools.isJson(results[i].data))
                            data.push(results[i].data);
                    }

                    // Invalid response
                    if(data.length !== uniqueCount) {
                        // Try again soon
                        shim.alarms.create(ALARM_NAME, { when: Date.now() + constants.live_feeds.retry_delay });
                        return;
                    }

                    var orderByTimestampDesc = function(a, b) {
                        return b.timestamp - a.timestamp;
                    };

                    var feeds = {};
                    for(i = 0; i < data.length; ++i) {
                        if(data[i].items)
                            data[i].items.sort(orderByTimestampDesc);

                        feeds[ data[i].key ] = data[i];
                    }

                    shim.pstorage.set({ FRAMEWORK_FEEDS_DATA: {
                        lastUpdate: Date.now(),
                        data: feeds
                    }});

                    // Clean-up read
                    shim.pstorage.get('FRAMEWORK_FEEDS_READ', function(error, storage) {
                        if(error)
                            return;

                        var read = storage.hasOwnProperty('FRAMEWORK_FEEDS_READ') ? storage.FRAMEWORK_FEEDS_READ : {};

                        for(var key in read)
                            if(!(key in feeds))
                                delete read[key];

                        shim.pstorage.set({ FRAMEWORK_FEEDS_READ: read });
                    });

                    shim.alarms.create(ALARM_NAME, { when: Date.now() + constants.live_feeds.update_delay });
                },
                // Failure
                function(results) {
                    shim.alarms.create(ALARM_NAME, { when: Date.now() + constants.live_feeds.retry_delay });
                }
            );
        });
    }

    config.one.newtab.live_feeds.defaults.items.subscribe(function() {
        update();
    });

    config.one.newtab.carousel.defaults.items.subscribe(function() {
        update();
    });

    update();



    var updateUnreadBadge = function(feeds, reads) {
        if(tools.isJson(feeds))
            updateUnreadBadge.feeds = feeds;
        else
            feeds = updateUnreadBadge.feeds;

        if(tools.isJson(reads))
            updateUnreadBadge.reads = reads;
        else
            reads = updateUnreadBadge.reads;

        if(!config.one.newtab.live_feeds.active()) {
            shim.browser.button.setText('');
            return;
        }

        var liveFeeds = config.one.newtab.live_feeds.defaults.items();
        var nUnread = 0, i, j, key, ts;
        for(i = 0; i < liveFeeds.length; ++i) {
            key = liveFeeds[i].url;

            if(!(key in feeds))
                continue;

            if(!tools.isArray(feeds[key].items))
                continue;

            if(key in reads) {
                if(feeds[key].items.length && feeds[key].items[0].timestamp) {
                    ts = reads[ key ] / 1000;

                    for(j = 0; j < feeds[key].items.length && ts < feeds[key].items[j].timestamp; ++j)
                        ++nUnread;
                }
            }
            else
                nUnread += feeds[key].items.length;
        }

        if(nUnread === 0) {
            shim.browser.button.setText('');
            return;
        }

        shim.browser.button.setBgColor([100, 100, 100, 255]);
        shim.browser.button.setText(nUnread + '');
    };
    updateUnreadBadge.feeds = {};
    updateUnreadBadge.reads = {};



    shim.pstorage.monitor('FRAMEWORK_FEEDS_DATA', function(key, changes) {
        updateUnreadBadge(changes.newValue.data || {}, null);
    });

    shim.pstorage.monitor('FRAMEWORK_FEEDS_READ', function(key, changes) {
        updateUnreadBadge(null, changes.newValue || {});
    });

    shim.pstorage.get([ 'FRAMEWORK_FEEDS_DATA', 'FRAMEWORK_FEEDS_READ' ], function(error, storage) {
        if(error)
            return;

        updateUnreadBadge(
            storage.hasOwnProperty('FRAMEWORK_FEEDS_DATA') ? storage.FRAMEWORK_FEEDS_DATA.data : null,
            storage.hasOwnProperty('FRAMEWORK_FEEDS_READ') ? storage.FRAMEWORK_FEEDS_READ : null
        );
    });



    // Alarms
    shim.alarms.onAlarm(function(alarmInfo) {
        if(alarmInfo.name === ALARM_NAME)
            update();
    });



    shim.runtime.onMessage(function(request, sender, sendResponse) {
        // Only accept message for this module
        if(request.module !== 'feeds')
            return;

        if(request.action === 'refresh') {
            // Force update
            update(true);

            sendResponse();
            return;
        }

        if(request.action === 'mark_as_read') {
            if(typeof request.key !== 'string') {
                sendResponse(false);
                return;
            }

            shim.pstorage.get([ 'FRAMEWORK_FEEDS_DATA', 'FRAMEWORK_FEEDS_READ' ], function(error, storage) {

                if(error)
                    return;

                if(!tools.isJson(storage.FRAMEWORK_FEEDS_DATA) || !tools.isJson(storage.FRAMEWORK_FEEDS_DATA.data))
                    return;

                var feeds = storage.FRAMEWORK_FEEDS_DATA.data;
                if(!(request.key in feeds))
                    return;

                var feed = feeds[request.key];

                // Use the timestamp of the latest item
                var ts = feed.items && feed.items.length ? feed.items[0].timestamp * 1000 : Date.now();

                var reads = tools.isJson(storage.FRAMEWORK_FEEDS_READ) ? storage.FRAMEWORK_FEEDS_READ : {};
                reads[ request.key ] = ts;
                shim.pstorage.set({ FRAMEWORK_FEEDS_READ: reads });
            });

            sendResponse(true);
        }
    });



    return {};

});
