define(['api/shim', 'lib/js/config', 'json!config-package.json'], function(shim, config, cfgPkg) {

    var RATE_URL  = 'https://mystart.com/browser-extensions/social/rate/v1.php';



    var RATE_PUBLIC_URL = null;
    shim.social.rate.getPublicUrl(function(url) {
        RATE_PUBLIC_URL = url;
    });



    var buildUrl = function(base, params) {
        // Only keep valid params
        var validParams = [];
        for(var i in params) {
            switch(typeof params[i]) {
                case 'string':
                    if(params[i].length)
                        validParams.push(i + '=' + encodeURIComponent(params[i]));
                    break;
                case 'number':
                    validParams.push(i + '=' + encodeURIComponent(params[i] + ''));
                    break;
                case 'boolean':
                    validParams.push(i + '=' + (params[i] ? '1' : '0'));
                    break;
            }
        }

        return base + (base.indexOf('?') === -1 ? '?' : '&') + validParams.join('&') + '&nc=' + Date.now();
    };

    var getShareUrl = function(wallpaper) {
        var url = config.one.website();

        if(typeof url !== 'string')
            return null;

        var params = {
            'met_cid'  : config.one.metrics.campaign_id(),
        };
        
        //console.log(params.met_cid);


        if(wallpaper) {
            params.wp_url  = wallpaper.image;
            params.wp_desc = wallpaper.description;
        }

        return buildUrl(url, params);
    };


    var openWindow = function(url, width, height) {
        var left = (screen.width  / 2) - (width  / 2);
        var top  = (screen.height / 2) - (height / 2);

        return window.open(
            url,
            'one_social_share',
            'left=' + left + ',top=' + top + ',width=' + width + ',height=' + height + ',toolbar=0,status=0'
        );
    };



    var social = {

        facebook: {
            share: function(wallpaper) {
                openWindow(
                    'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(getShareUrl(wallpaper)),
                    626,
                    436
                );
            }
        },

        twitter: {
            share: function(wallpaper) {
                var text;

                // Check out amazing image on #MySunscape

                // Twitter limit the length of the message to 140 characters...
                if(wallpaper) {
                    if(wallpaper.description)
                        text = wallpaper.name + ' – ' + wallpaper.description;
                    else
                        text = wallpaper.name + '  ';
                }
                else {
                    text = config.one.name() + ' – ' + config.one.description();
                }

                // Trim a bit more, sometimes extra spaces make the limit explode.
                text = text.substr(0, 116);

                openWindow(
                    'http://twitter.com/share?url=' + encodeURIComponent(getShareUrl(wallpaper)) + '&text=' + encodeURIComponent(text) + '&',
                    550,
                    420
                );
            }
        },

        email: {
            share: function(shareEmail, wallpaper, sharetype) {
                var image = wallpaper.image;
                
                if(sharetype =='extension')
                    image = config.one.website() + '/img/promo-small.png';

                var options = {
                    image : image,
                    id : wallpaper.id,
                    ext_url : getShareUrl(),
                    sharetype : sharetype
                };

                shareEmail.show(options);
            }
        },
        
        rate:  {
            isAvailable: function() {
                return !!(config.one.newtab.social.defaults.rate_url() || RATE_PUBLIC_URL);
            },

            launch: function() {
                var url = config.one.newtab.social.defaults.rate_url() || RATE_PUBLIC_URL;

                if(typeof url !== 'string')
                    return false;
                
                var params = {
                    'url'      : url,
                    'target'   : shim.target,
                    'ext_id'   : (cfgPkg.chrome_extid_override || config.ext.id),
                    'org_id'   : config.one.org_id(),
                    'one_id'   : config.one.id(),
                    'met_uid'  : config.one.metrics.user_id(),
                    'met_cid'  : config.one.metrics.campaign_id(),
                };

                window.location = buildUrl(RATE_URL, params);
                return true;
            }
        },

        googleplus: {
            share: function (wallpaper) {
                openWindow(
                    'https://plus.google.com/share?url=' + encodeURIComponent(getShareUrl(wallpaper)),
                    626,
                    436
                );
            }
        },

        pinterest: {
            share: function (wallpaper) {
                var text;
                if(wallpaper) {
                    if(wallpaper.description)
                        text = wallpaper.name + ' – ' + wallpaper.description;
                    else
                        text = wallpaper.name + '  ';
                }
                else {
                    text = config.one.name() + ' – ' + config.one.description();
                }
                openWindow(
                    'https://www.pinterest.com/pin/create/button/?url=' + getShareUrl(wallpaper).replace("wp_url", "media") + '&h=236&w=236&description=' + encodeURIComponent(text) + (!wallpaper.image ? '&color=%238fafbf' : ''),
                    626,
                    436
                );
            }
        },

        gmail: {
            share: function(wallpaper) {
                openWindow(
                    'https://mail.google.com/mail/u/0/?view=cm&fs=1&to&su=' + config.one.name().replace(/ /g,'+') + '&body=' + window.location.href,
                    626,
                    436
                );
            }
        }

    };



    return social;

});