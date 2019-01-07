define(['jquery', 'rsvp', 'api/shim', 'jquery-actual'], function($, RSVP, shim, actual) {

    var COUNTRY_CODE = (window.navigator.userLanguage || window.navigator.language || '').split('-').pop().toLowerCase();

    var tools = {

        prepareConfig: function(data) {
            if(!data.metrics)
                data.metrics = {};

            if(!data.metrics.user_id)
                data.metrics.user_id = null;

            if(!data.metrics.campaign_id)
                data.metrics.campaign_id = null;

            if(!data.social)
                data.social = {};

            if(!data.social.email_from)
                data.social.email_from = null;

            if(!data.social.email_to)
                data.social.email_to = null;

            if(!data.newtab.wallpapers.defaults.selected)
                data.newtab.wallpapers.defaults.selected = null;

            if(!data.newtab.wallpapers.defaults.favorites)
                data.newtab.wallpapers.defaults.favorites = [];

            if(!data.newtab.wallpapers.defaults.library)
                data.newtab.wallpapers.defaults.library = null;

            if(!data.newtab.wallpapers.defaults.user_source)
                data.newtab.wallpapers.defaults.user_source = null;

            if(!data.newtab.wallpapers.settings)
                data.newtab.wallpapers.settings = {};

            if(!data.newtab.wallpapers.settings.favorites)
                data.newtab.wallpapers.settings.favorites = true;

            if(!data.newtab.wallpapers.settings.library)
                data.newtab.wallpapers.settings.library = true;

            if(!data.newtab.wallpapers.settings.user_source)
                data.newtab.wallpapers.settings.user_source = true;

            if(!data.newtab.wallpapers.settings.active_tab)
                data.newtab.wallpapers.settings.active_tab = true;

            if(data.newtab.clock.defaults.hour_format === 'auto')
                data.newtab.clock.defaults.hour_format = tools.getLocalHourFormat();

            if(data.newtab.weather.defaults.unit === 'auto')
                data.newtab.weather.defaults.unit = tools.getLocalUnitSystem();

            return data;
        },

        detectIE: function() {
            var ua = window.navigator.userAgent;

            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }

            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }

            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
               // Edge (IE 12+) => return version number
               return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            }

            // other browser
            return false;
        },

        getLocalHourFormat: function() {
            return [
                'us', // United States
                'uk', // United Kingdom
                'gb', // Great Britain
                'ph'  // Philippines
            ].indexOf(COUNTRY_CODE) !== -1 ? 'hour-12' : 'hour-24';
        },

        getLocalUnitSystem: function() {
            return [
                'bs', // The Bahamas
                'bz', // Belize
                'ky', // Cayman Islands
                'pw', // Palau
                'us', // United States
                'vi'  // United States Virgin Islands
            ].indexOf(COUNTRY_CODE) !== -1 ? 'imperial' : 'metric';
        },

        formatElapsed: function(delta) {
            var delay = Math.floor(delta / 1000);

            if(delay <= 5)
                return 'just now';

            if(delay < 60)
                return 'less than a minute ago';

            delay = Math.floor(delay / 60);
            if(delay < 60)
                return delay + ' minute' + (delay !== 1 ? 's' : '') + ' ago';

            delay = Math.floor(delay / 60);
            if(delay < 24)
                return delay + ' hour' + (delay !== 1 ? 's' : '') + ' ago';

            delay = Math.floor(delay / 24);
            if(delay < 7)
                return delay + ' day' + (delay !== 1 ? 's' : '') + ' ago';

            delay = Math.floor(delay / 7);
            if(delay < 4)
                return delay + ' week' + (delay !== 1 ? 's' : '') + ' ago';

            delay = Math.floor(delay * 7 / 30.4);
            if(delay < 12)
                return delay + ' month' + (delay !== 1 ? 's' : '') + ' ago';

            delay = Math.floor(delay / 12);
            return delay + ' year' + (delay !== 1 ? 's' : '') + ' ago';
        },

        getType: function(any) {
            return Object.prototype.toString.apply(any).slice(8, -1).toLowerCase();
        },

        isJson: function(any) {
            return tools.getType(any) === 'object';
        },

        isArray: function(any) {
            return tools.getType(any) === 'array';
        },

        mergeJson: function(stronglyTyped, dest /*, ... */) {
            var i = 2, len = arguments.length;

            if(typeof stronglyTyped !== 'boolean') {
                dest = stronglyTyped;
                stronglyTyped = false;
                i = 1;
            }

            for(; i < len; ++i) {
                if(tools.isArray(arguments[i])) {
                    if(typeof dest === 'undefined')
                        dest = [];
                    else if(!tools.isArray(dest)) {
                        // String typing, abort
                        if(stronglyTyped)
                            continue;

                        // Weak typing, override
                        dest = [];
                    }

                    dest = dest.concat(arguments[i]);
                }
                else if(tools.isJson(arguments[i])) {

                    if(typeof dest === 'undefined')
                        dest = {};
                    else if(!tools.isJson(dest)) {
                        // String typing, abort
                        if(stronglyTyped)
                            continue;

                        // Weak typing, override
                        dest = {};
                    }

                    for(var k in arguments[i])
                        dest[k] = tools.mergeJson(stronglyTyped, dest[k], arguments[i][k]);
                }
                else {
                    if(typeof dest === 'undefined')
                        dest = arguments[i];
                    else if(typeof dest === typeof arguments[i]) {
                        if(stronglyTyped)
                            continue;

                        dest = arguments[i];
                    }
                }
            }

            return dest;
        },

        protocolizeUrl: function(url) {
            var protocol = url.match(/^(https?:)?\/\//i);

            if(!protocol)
                return 'http://' + url;

            // No protocol, but // present
            if(protocol[0] === '//')
                return 'http:' + url;

            return url;
        },

        openUrl: function(url) {
            shim.tabs.query({ active: true, lastFocusedWindow: true }, function(err, tabs) {
                if(!err && tabs.length)
                    shim.tabs.update(tabs[0].id, { active: true, url: url });
                else
                    shim.tabs.create({ active: true, url: url });
            });
        },

        openLinkFromEvent: function(e, url) {
            url = url || e.delegateTarget.href;

            // Middle-click + Shift = new tab w/ focus
            if(e.which === 2 && e.shiftKey)
                shim.tabs.create({ active: true, url: url });

            // Middle-click = new tab w/o focus
            else if(e.which === 2)
                shim.tabs.create({ active: false, url: url });

            // Left-click + Shift + Ctrl = new tab w/ focus
            else if(e.which === 1 && e.shiftKey && e.ctrlKey)
                shim.tabs.create({ active: true, url: url });

            // Left-click + Shift = new window w/ focus
            else if(e.which === 1 && e.shiftKey)
                shim.windows.create({ focused: true, url: url });

            // Left-click + Ctrl = new tab w/o focus
            else if(e.which === 1 && e.ctrlKey)
                shim.tabs.create({ active: false, url: url });

            // Left-click = same tab
            else if(e.which === 1)
                tools.openUrl(url);
        },

        openNewtab: function(data, cb) {
            data = data || {};
            var hash = '';

            if(data.defaultWallpaper)
                hash = '#defaultWallpaper';

            shim.runtime.getNewtabInfo(function(newtab) {
                if(data.create)
                    shim.tabs.create({ active: true, url: newtab.url + hash }, cb);
                else
                    tools.tabUpdate({ active: true, url: newtab.url + hash }, cb);
            });
        },

        tabUpdate: function(options, cb) {
            shim.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
                if(tabs.length)
                    shim.tabs.update(tabs[0].id, options, cb);
                else
                    shim.tabs.create(options, cb);
            });
        },

        parsePartnerQueryString: function(str) {
            var partner = {};

            partner.pr = str.match(/(^|\?|&)pr=([^&#]+)/i);
            partner.pr = partner.pr !== null ? partner.pr[2] : null;

            partner.id = str.match(/(^|\?|&)id=([^&#]+)/i);
            partner.id = partner.id !== null ? partner.id[2] : null;

            partner.campaign = str.match(/(^|\?|&)(ent|src)=([^&0-9]*)([0-9]+)/i);
            partner.campaign = partner.campaign !== null ? partner.campaign[4] : null;

            return partner;
        },

        // http://stackoverflow.com/a/16245768
        b64toBlob: function(b64Data, contentType, sliceSize) {
            // Verify browser support
            if(typeof atob !== 'function' || typeof Uint8Array !== 'function' || typeof Blob !== 'function')
                return null;

            contentType = contentType || 'text/plain';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            return new Blob(byteArrays, { type: contentType });
        },

        dataUriToBlob: function(dataUri) {
            // https://en.wikipedia.org/wiki/Data_URI_scheme#Format
            // Format: data:[<MIME-type>][;charset=<encoding>][;base64],<data>

            var err = function(reason) {
                //console.log('Error in tools.dataUriToBlob: Invalid dataUri - ' + reason, dataUri);
                return null;
            };

            var comma = dataUri.indexOf(',');
            if(comma === -1)
                return err('comma not found');

            var headerParts = dataUri.substr(0, comma).split(';');

            var facts = {}, i, j;
            for(i = 0; i < headerParts.length; ++i) {
                j = headerParts[i].indexOf(/[:=]/);
                if(j === -1)
                    j = headerParts[i].length;

                // Split string properly
                facts[ headerParts[i].substr(0, j) ] = headerParts[i].substr(j + 1);
            }

            var mimeType = facts.data    || 'text/plain';
            var charset  = facts.charset || 'US-ASCII';
            var isBase64 = 'base64' in facts;

            if(!isBase64)
                return err('Only base64 is supported for now');

            return tools.b64toBlob(dataUri.substr(comma + 1), mimeType);
        },

        queueImage: function(src) {
            var done = false;
            var deferred = RSVP.defer();

            var img = new Image();
            img.onload  = function() { done = true; deferred.resolve(img); };
            img.onerror = function() { done = true; deferred.reject(null); };

            return {
                promise: deferred.promise,
                load:    function() { if(!done) img.src = src; }
            };
        },

        arrayShuffle: function(a) {
            var j, x, i;
            for (i = a.length; i; i--) {
                j = Math.floor(Math.random() * i);
                x = a[i - 1];
                a[i - 1] = a[j];
                a[j] = x;
            }

            return a;
        },

         //added for search keywords
        shuffle: function (input) {
            if(!input)
                return input;

          for (var i = input.length - 1; i > 0; i--) {
            var randomIndex = Math.floor(Math.random() * (i + 1));
            var itemAtIndex = input[randomIndex];
            input[randomIndex] = input[i];
            input[i] = itemAtIndex;
          }
          return input;
        },

        //use to limit dom element lignes
        uSubstr: function (selector, nb_lignes){

            var elmts = typeof selector=="object"?selector:$(selector), t, h, keywords, t0, text;

            if(!(elmts.length && nb_lignes))
                return false;

            elmts.each(function(){
                var container = $(this);
                t = container.html();
                t0='';

                for(var i=0;i<nb_lignes;i++) t0 += (t0?'<br>':'')+'|';
                container.html(t0);
                h = container.actual('innerHeight');
                keywords = t.split(' ');
                text = '';
                for (i = 0; i < keywords.length; i++){
                  container.html(text+' '+keywords[i]+'...');
                  if(container.actual('innerHeight')>h){
                    container.html(text+'...');
                    break;
                  }
                  else text += ' '+keywords[i];
                }
                if (i >=keywords.length) container.html(text);
            });
        },

        uuid: function (len, radix) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [], i;
            radix = radix || chars.length;

            if (len) {
              // Compact form
              for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
            } else {
              // rfc4122, version 4 form
              var r;

              // rfc4122 requires these characters
              uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
              uuid[14] = '4';

              // Fill in random data.  At i==19 set the high bits of clock sequence as
              // per rfc4122, sec. 4.1.5
              for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                  r = 0 | Math.random()*16;
                  uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
              }
            }

            return uuid.join('');
        },

        updateBlurEffect: function(isActive, container) {
            var blurContainers = container ? $('.blur-effect .bg-image', container) : $('.blur-effect .bg-image');

            if (!blurContainers.length) {
                return;
            }

            if (isActive) {
                blurContainers.css({
                    'background-image': $('#layer-wallpapers-image').css('background-image'),
                    'background-position': $('#layer-wallpapers-image').css('background-position')
                });
            } else {
                $('.blur-effect').addClass('no-active');
            }
        },

        extractHostname: function (url) {
            var hostname;
            //find & remove protocol (http, ftp, etc.) and get the hostname
            if (url.indexOf("://") > -1) {
                hostname = url.split('/')[2];
            }
            else {
                hostname = url.split('/')[0];
            }

            //find & remove port number
            hostname = hostname.split(':')[0];

            return hostname;
        },

        extractRootDomain: function (url) {
            var _this = this,
                domain = _this.extractHostname(url),
                splitArr = domain.split('.'),
                arrLen = splitArr.length;

            //extracting the root domain here
            if (arrLen > 2) {
                domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
            }
            return domain;
        },

        entityToHtml: function (string) {
          var entity_table = {
              34: "&quot;",     // Quotation mark. Not required
              38: "&amp;",        // Ampersand. Applied before everything else in the application
              60: "&lt;",     // Less-than sign
              62: "&gt;",     // Greater-than sign
              // 63: "&#63;",      // Question mark
              // 111: "&#111;",        // Latin small letter o
              160: "&nbsp;",      // Non-breaking space
              161: "&iexcl;",     // Inverted exclamation mark
              162: "&cent;",      // Cent sign
              163: "&pound;",     // Pound sign
              164: "&curren;",    // Currency sign
              165: "&yen;",       // Yen sign
              166: "&brvbar;",    // Broken vertical bar
              167: "&sect;",      // Section sign
              168: "&uml;",       // Diaeresis
              169: "&copy;",      // Copyright sign
              170: "&ordf;",      // Feminine ordinal indicator
              171: "&laquo;",     // Left-pointing double angle quotation mark
              172: "&not;",       // Not sign
              173: "&shy;",       // Soft hyphen
              174: "&reg;",       // Registered sign
              175: "&macr;",      // Macron
              176: "&deg;",       // Degree sign
              177: "&plusmn;",    // Plus-minus sign
              178: "&sup2;",      // Superscript two
              179: "&sup3;",      // Superscript three
              180: "&acute;",     // Acute accent
              181: "&micro;",     // Micro sign
              182: "&para;",      // Pilcrow sign
              183: "&middot;",    // Middle dot
              184: "&cedil;",     // Cedilla
              185: "&sup1;",      // Superscript one
              186: "&ordm;",      // Masculine ordinal indicator
              187: "&raquo;",     // Right-pointing double angle quotation mark
              188: "&frac14;",    // Vulgar fraction one-quarter
              189: "&frac12;",    // Vulgar fraction one-half
              190: "&frac34;",    // Vulgar fraction three-quarters
              191: "&iquest;",    // Inverted question mark
              192: "&Agrave;",    // A with grave
              193: "&Aacute;",    // A with acute
              194: "&Acirc;",     // A with circumflex
              195: "&Atilde;",    // A with tilde
              196: "&Auml;",      // A with diaeresis
              197: "&Aring;",     // A with ring above
              198: "&AElig;",     // AE
              199: "&Ccedil;",    // C with cedilla
              200: "&Egrave;",    // E with grave
              201: "&Eacute;",    // E with acute
              202: "&Ecirc;",     // E with circumflex
              203: "&Euml;",      // E with diaeresis
              204: "&Igrave;",    // I with grave
              205: "&Iacute;",    // I with acute
              206: "&Icirc;",     // I with circumflex
              207: "&Iuml;",      // I with diaeresis
              208: "&ETH;",       // Eth
              209: "&Ntilde;",    // N with tilde
              210: "&Ograve;",    // O with grave
              211: "&Oacute;",    // O with acute
              212: "&Ocirc;",     // O with circumflex
              213: "&Otilde;",    // O with tilde
              214: "&Ouml;",      // O with diaeresis
              215: "&times;",     // Multiplication sign
              216: "&Oslash;",    // O with stroke
              217: "&Ugrave;",    // U with grave
              218: "&Uacute;",    // U with acute
              219: "&Ucirc;",     // U with circumflex
              220: "&Uuml;",      // U with diaeresis
              221: "&Yacute;",    // Y with acute
              222: "&THORN;",     // Thorn
              223: "&szlig;",     // Sharp s. Also known as ess-zed
              224: "&agrave;",    // a with grave
              225: "&aacute;",    // a with acute
              226: "&acirc;",     // a with circumflex
              227: "&atilde;",    // a with tilde
              228: "&auml;",      // a with diaeresis
              229: "&aring;",     // a with ring above
              230: "&aelig;",     // ae. Also known as ligature ae
              231: "&ccedil;",    // c with cedilla
              232: "&egrave;",    // e with grave
              233: "&eacute;",    // e with acute
              234: "&ecirc;",     // e with circumflex
              235: "&euml;",      // e with diaeresis
              236: "&igrave;",    // i with grave
              237: "&iacute;",    // i with acute
              238: "&icirc;",     // i with circumflex
              239: "&iuml;",      // i with diaeresis
              240: "&eth;",       // eth
              241: "&ntilde;",    // n with tilde
              242: "&ograve;",    // o with grave
              243: "&oacute;",    // o with acute
              244: "&ocirc;",     // o with circumflex
              245: "&otilde;",    // o with tilde
              246: "&ouml;",      // o with diaeresis
              247: "&divide;",    // Division sign
              248: "&oslash;",    // o with stroke. Also known as o with slash
              249: "&ugrave;",    // u with grave
              250: "&uacute;",    // u with acute
              251: "&ucirc;",     // u with circumflex
              252: "&uuml;",      // u with diaeresis
              253: "&yacute;",    // y with acute
              254: "&thorn;",     // thorn
              255: "&yuml;",      // y with diaeresis
              264: "&#264;",      // Latin capital letter C with circumflex
              265: "&#265;",      // Latin small letter c with circumflex
              338: "&OElig;",     // Latin capital ligature OE
              339: "&oelig;",     // Latin small ligature oe
              352: "&Scaron;",    // Latin capital letter S with caron
              353: "&scaron;",    // Latin small letter s with caron
              372: "&#372;",      // Latin capital letter W with circumflex
              373: "&#373;",      // Latin small letter w with circumflex
              374: "&#374;",      // Latin capital letter Y with circumflex
              375: "&#375;",      // Latin small letter y with circumflex
              376: "&Yuml;",      // Latin capital letter Y with diaeresis
              402: "&fnof;",      // Latin small f with hook, function, florin
              710: "&circ;",      // Modifier letter circumflex accent
              732: "&tilde;",     // Small tilde
              913: "&Alpha;",     // Alpha
              914: "&Beta;",      // Beta
              915: "&Gamma;",     // Gamma
              916: "&Delta;",     // Delta
              917: "&Epsilon;",   // Epsilon
              918: "&Zeta;",      // Zeta
              919: "&Eta;",       // Eta
              920: "&Theta;",     // Theta
              921: "&Iota;",      // Iota
              922: "&Kappa;",     // Kappa
              923: "&Lambda;",    // Lambda
              924: "&Mu;",        // Mu
              925: "&Nu;",        // Nu
              926: "&Xi;",        // Xi
              927: "&Omicron;",   // Omicron
              928: "&Pi;",        // Pi
              929: "&Rho;",       // Rho
              931: "&Sigma;",     // Sigma
              932: "&Tau;",       // Tau
              933: "&Upsilon;",   // Upsilon
              934: "&Phi;",       // Phi
              935: "&Chi;",       // Chi
              936: "&Psi;",       // Psi
              937: "&Omega;",     // Omega
              945: "&alpha;",     // alpha
              946: "&beta;",      // beta
              947: "&gamma;",     // gamma
              948: "&delta;",     // delta
              949: "&epsilon;",   // epsilon
              950: "&zeta;",      // zeta
              951: "&eta;",       // eta
              952: "&theta;",     // theta
              953: "&iota;",      // iota
              954: "&kappa;",     // kappa
              955: "&lambda;",    // lambda
              956: "&mu;",        // mu
              957: "&nu;",        // nu
              958: "&xi;",        // xi
              959: "&omicron;",   // omicron
              960: "&pi;",        // pi
              961: "&rho;",       // rho
              962: "&sigmaf;",    // sigmaf
              963: "&sigma;",     // sigma
              964: "&tau;",       // tau
              965: "&upsilon;",   // upsilon
              966: "&phi;",       // phi
              967: "&chi;",       // chi
              968: "&psi;",       // psi
              969: "&omega;",     // omega
              977: "&thetasym;",  // Theta symbol
              978: "&upsih;",     // Greek upsilon with hook symbol
              982: "&piv;",       // Pi symbol
              8194: "&ensp;",     // En space
              8195: "&emsp;",     // Em space
              8201: "&thinsp;",   // Thin space
              8204: "&zwnj;",     // Zero width non-joiner
              8205: "&zwj;",      // Zero width joiner
              8206: "&lrm;",      // Left-to-right mark
              8207: "&rlm;",      // Right-to-left mark
              8211: "&ndash;",    // En dash
              8212: "&mdash;",    // Em dash
              8216: "&lsquo;",    // Left single quotation mark
              8217: "&rsquo;",    // Right single quotation mark
              8218: "&sbquo;",    // Single low-9 quotation mark
              8220: "&ldquo;",    // Left double quotation mark
              8221: "&rdquo;",    // Right double quotation mark
              8222: "&bdquo;",    // Double low-9 quotation mark
              8224: "&dagger;",   // Dagger
              8225: "&Dagger;",   // Double dagger
              8226: "&bull;",     // Bullet
              8230: "&hellip;",   // Horizontal ellipsis
              8240: "&permil;",   // Per mille sign
              8242: "&prime;",    // Prime
              8243: "&Prime;",    // Double Prime
              8249: "&lsaquo;",   // Single left-pointing angle quotation
              8250: "&rsaquo;",   // Single right-pointing angle quotation
              8254: "&oline;",    // Overline
              8260: "&frasl;",    // Fraction Slash
              8364: "&euro;",     // Euro sign
              8472: "&weierp;",   // Script capital
              8465: "&image;",    // Blackletter capital I
              8476: "&real;",     // Blackletter capital R
              8482: "&trade;",    // Trade mark sign
              8501: "&alefsym;",  // Alef symbol
              8592: "&larr;",     // Leftward arrow
              8593: "&uarr;",     // Upward arrow
              8594: "&rarr;",     // Rightward arrow
              8595: "&darr;",     // Downward arrow
              8596: "&harr;",     // Left right arrow
              8629: "&crarr;",    // Downward arrow with corner leftward. Also known as carriage return
              8656: "&lArr;",     // Leftward double arrow. ISO 10646 does not say that lArr is the same as the 'is implied by' arrow but also does not have any other character for that function. So ? lArr can be used for 'is implied by' as ISOtech suggests
              8657: "&uArr;",     // Upward double arrow
              8658: "&rArr;",     // Rightward double arrow. ISO 10646 does not say this is the 'implies' character but does not have another character with this function so ? rArr can be used for 'implies' as ISOtech suggests
              8659: "&dArr;",     // Downward double arrow
              8660: "&hArr;",     // Left-right double arrow
              // Mathematical Operators
              8704: "&forall;",   // For all
              8706: "&part;",     // Partial differential
              8707: "&exist;",    // There exists
              8709: "&empty;",    // Empty set. Also known as null set and diameter
              8711: "&nabla;",    // Nabla. Also known as backward difference
              8712: "&isin;",     // Element of
              8713: "&notin;",    // Not an element of
              8715: "&ni;",       // Contains as member
              8719: "&prod;",     // N-ary product. Also known as product sign. Prod is not the same character as U+03A0 'greek capital letter pi' though the same glyph might be used for both
              8721: "&sum;",      // N-ary summation. Sum is not the same character as U+03A3 'greek capital letter sigma' though the same glyph might be used for both
              8722: "&minus;",    // Minus sign
              8727: "&lowast;",   // Asterisk operator
              8729: "&#8729;",    // Bullet operator
              8730: "&radic;",    // Square root. Also known as radical sign
              8733: "&prop;",     // Proportional to
              8734: "&infin;",    // Infinity
              8736: "&ang;",      // Angle
              8743: "&and;",      // Logical and. Also known as wedge
              8744: "&or;",       // Logical or. Also known as vee
              8745: "&cap;",      // Intersection. Also known as cap
              8746: "&cup;",      // Union. Also known as cup
              8747: "&int;",      // Integral
              8756: "&there4;",   // Therefore
              8764: "&sim;",      // tilde operator. Also known as varies with and similar to. The tilde operator is not the same character as the tilde, U+007E, although the same glyph might be used to represent both
              8773: "&cong;",     // Approximately equal to
              8776: "&asymp;",    // Almost equal to. Also known as asymptotic to
              8800: "&ne;",       // Not equal to
              8801: "&equiv;",    // Identical to
              8804: "&le;",       // Less-than or equal to
              8805: "&ge;",       // Greater-than or equal to
              8834: "&sub;",      // Subset of
              8835: "&sup;",      // Superset of. Note that nsup, 'not a superset of, U+2283' is not covered by the Symbol font encoding and is not included.
              8836: "&nsub;",     // Not a subset of
              8838: "&sube;",     // Subset of or equal to
              8839: "&supe;",     // Superset of or equal to
              8853: "&oplus;",    // Circled plus. Also known as direct sum
              8855: "&otimes;",   // Circled times. Also known as vector product
              8869: "&perp;",     // Up tack. Also known as orthogonal to and perpendicular
              8901: "&sdot;",     // Dot operator. The dot operator is not the same character as U+00B7 middle dot
              // Miscellaneous Technical
              8968: "&lceil;",    // Left ceiling. Also known as an APL upstile
              8969: "&rceil;",    // Right ceiling
              8970: "&lfloor;",   // left floor. Also known as APL downstile
              8971: "&rfloor;",   // Right floor
              9001: "&lang;",     // Left-pointing angle bracket. Also known as bra. Lang is not the same character as U+003C 'less than'or U+2039 'single left-pointing angle quotation mark'
              9002: "&rang;",     // Right-pointing angle bracket. Also known as ket. Rang is not the same character as U+003E 'greater than' or U+203A 'single right-pointing angle quotation mark'
              // Geometric Shapes
              9642: "&#9642;",    // Black small square
              9643: "&#9643;",    // White small square
              9674: "&loz;",      // Lozenge
              // Miscellaneous Symbols
              9702: "&#9702;",    // White bullet
              9824: "&spades;",   // Black (filled) spade suit
              9827: "&clubs;",    // Black (filled) club suit. Also known as shamrock
              9829: "&hearts;",   // Black (filled) heart suit. Also known as shamrock
              9830: "&diams;"   // Black (filled) diamond suit
            };

            for (var i in entity_table) {
                if (i != 38) {
                    string = string.replace(new RegExp(entity_table[i], "g"), String.fromCharCode(i));
                }
            }
            // string = string.replace(new RegExp("&#(x?)(\\d+);", "g"), String.fromCharCode(((p1 == 'x') ? parseInt(p2, 16) : p2)));
            string = string.replace(new RegExp("&#(x?)(\\d+);", "g"), function(match, p1, p2, string) {
                return String.fromCharCode(((p1 == 'x') ? parseInt(p2, 16) : p2));
            });
            string = string.replace(new RegExp(entity_table[38], "g"), String.fromCharCode(38));

            return string;
        },
        checkSwitchThemes: function(callback) {
            // switch themes options -- start
            var extensionID = 'kgakkbodfgkhiojdmcicoenigbhanpcb'; // mystart search Chrome store ID
            $('script[data-mystart-one="new-tab"], section[data-mystart-one="new-tab"]').each(function() {
                if(this.getAttribute('data-one-id') == '580e1846a6fde1b55c6ec7de') {    //580e1846a6fde1b55c6ec7de == mystart-search.
                    shim.runtime.sendMessageToExtension(extensionID, {
                        module: 'newtab-url-change',
                        action: 'check',
                        value: window.location.href
                    }, function(error, info) {
                        callback(!!info);
                    });
                    return;
                }
            });
            // switch themes options -- end
        }


    };

    Date.prototype.addHours = function(h) {
       this.setTime(this.getTime() + (h*60*60*1000));
       return this;
    };


    return tools;

});
