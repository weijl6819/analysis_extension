/* https://github.com/jmorvan/jq-cling */
;
(function (defaults, $, window, document, undefined) {

    'use strict';

    $.extend({
        // Function to change the default properties of the plugin
        // Usage:
        // jQuery.pluginSetup({property:'Custom value'});
        clingSetup: function (options) {

            return $.extend(defaults, options);
        }
    }).fn.extend({
            // Usage:
            // jQuery(selector).pluginName({property:'value'});
            cling: function (options) {
                var self = $(this);
                options = $.extend({}, defaults, options);

                var el = $(this).first();

                if (!el || !el.length) return $(this);

                var bindClick = function() {
                    $(self).on('click', close);
                };

                var unbindClick = function() {
                    $(self).off('click', close);
                };

                var close = function () {
                    if (options.beforeClose || typeof options.beforeClose === "function") {
                        if (options.beforeClose(overlay, options)) {
                            overlay.hide();
                            close$.hide();
                            unbindClick();
                        }

                    }
                    else {
                        overlay.hide();
                        close$.hide();
                        unbindClick();
                    }
                };

                var open = function () {
                    if (options.beforeShow || typeof options.beforeShow === "function") {
                        if (options.beforeShow(overlay, options)){
                            overlay.show();
                            close$.show();
                            bindClick();
                        }
                    }
                    else {
                        overlay.show();
                        close$.show();
                        bindClick();
                    }
                };

                var o2c = function (c) {
                    if (!c) {
                        c = {};
                        console.warn("JQ-CLING WARNING: You passed an empty color object for one of the properties. One will be created for you!");
                    }
                    else if (c.r === "undefined" || c.g === "undefined" || c.b === "undefined" || c.a === "undefined") {
                        console.warn("JQ-CLING WARNING: Color for one of the properties is missing some attribute. Defaults will apply!");
                    }

                    c.r = c.r || 0;
                    c.g = c.g || 0;
                    c.b = c.b || 0;
                    c.a = c.a || 1;

                    return  ' rgba(' + c.r + ',' + c.g + ', ' + c.b + ', ' + c.a + ') '
                }

                if (!options.titleColor) options.titleColor = options.radialColor;

                var overlay = $('#cling-overlay');

                if (!overlay.length) {
                    overlay = $(
                      '<div id="cling-overlay" style="opacity: 0; background-color: transparent; transition: 0.5s;">' +
                      '<div id="cling-title"></div>' +
                      '<div id="cling-desc"></div>' +
                      '</div>'
                    );
                    $('body').append(overlay);
                    overlay.hide();
                }

                var title$ = overlay.find('#cling-title').html(options.title);
                var descr$ = overlay.find('#cling-desc').html(options.description);

                var close$ = $('<div id="cling-close"></div>').html(options.closeText).click(function () {
                    close();
                });

                $('body').append(close$);
                close$.hide();

                var pos = el.offset();

                var bgX = pos.left,
                    bgY = pos.top,
                    bgRad = Math.max(el.height(), el.width())-options.radOffset;

                overlay.css(
                  {
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    'z-index': 999999,
                    'background-image': '-webkit-radial-gradient(247px 390px, circle cover, transparent 135px, rgb(254, 254, 255) 140px, rgba(194, 194, 194, 0.7) 142px, rgba(0, 0, 0,0.7) 160px, rgb(255, 255, 255) 165px, rgba(194, 194, 194, 0.7) 170px, rgba(0,0,0,0.7) 200px, rgba(0,0,0,0.7) 0px)',
                    'pointer-events': 'none'
                  }
                );

                title$.css(
                  {
                    position: 'absolute',
                    /* top: bgY + (bgRad + 95), */
                    top: 630,
                    /* left: (bgX + (bgRad)), */
                    /* left: "44%",*/
                    color: o2c(options.titleColor),
                    'font-size': "22px",
                    'font-weight': "bold",
                    'text-align': 'center',
                    width: '501px',
                    'padding-left': '12px'
                  }
                );

                descr$.css({
                    position: 'absolute',
                    /* top: bgY + (bgRad + 125), */
                    top: 660,
                    /* left: (bgX + (bgRad)), */
                    /* left: "36%", */
                    color: o2c(options.descriptionColor),
                    'font-size': "18px",
                    'text-align': 'center',
                    width: '501px',
                    'padding-left': '12px'                    
                });

                close$.css({
                    opacity: 0,
                    transition: '0.5s',
                    position: 'absolute',
                    /* bottom: 0, */
                    right: "0px",
                    width: '521px',
                    height: '120px',
                    top: 0,
                    /* padding: "22px", */
                    'z-index': 999999,
                    /* 'margin-right': "3%", */
                    /* 'margin-bottom': "3%", */
                    /* color: "#355CAC", */
                    /* 'font-size': "1em", */
                    /* 'font-weight': "bold", */
                    /* background: o2c(options.radialColor), */
                    /* background: "url(../img/close.png) no-repeat 444px 50%", */
                    /* border: "1px solid lightgray", */
                    cursor: "pointer"
                });

                open();


                return $(this);
            }
        });
})({
    title: "No title",
    description: "no description",
    closeText: "",
    overlayColor: {r: 0, g: 0, b: 0, a: 0.7},
    radialColor: {r: 255, g: 255, b: 255, a: 1},
    titleColor: null,
    descriptionColor: {r: 255, g: 255, b: 255, a: 1},
    radOffset: 70,
    winOffset: 10
}, jQuery, window, document);