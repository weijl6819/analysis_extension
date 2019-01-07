/**
 * ===================================================
 * properties of the CCE.TextSelection
 * ===================================================
 */
var CCE = CCE || {};
CCE.TextSelection = {
    /* object defaults */
    isLoggedIn: false,
    lastSel: null,
    mouseDownY: null,
    mouseUpY: null,
    mouseUpX: null,
    showCaptureInPage: false,
    /* end object defaults */

    /**
     * Function defaultCallback
     * @desc - the default callback function of the TextSelection object
     */
    defaultCallback: function(response) {
        if (!response && "undefined" != typeof chrome.extension.lastError) {
            console.log("No response. Error: " + chrome.extension.lastError.message);
        }
    },

    /**
     * Function resetMouseOffsets
     * @desc - resets the mouse offset down, left and right
     */
    resetMouseOffsets: function() {
        CCE.TextSelection.mouseDownY = null;
        CCE.TextSelection.mouseUpY = null;
        CCE.TextSelection.mouseUpX = null;
    },

    /**
     * Function optionsChanged
     * @desc - checks if the in page capture button should be inserted when selecting the text
     */
    optionsChanged: function(options) {
        CCE.TextSelection.showCaptureInPage = !options.hideCapture;

        if (options.hideCapture) {
            CCE.TextSelection.removeCaptureButtonInPage();
        }
    },

    /**
     * Function insertCaptureButtonInPage
     * @desc - inserts the in page capture button
     */
    insertCaptureButtonInPage: function(_doc) {
        var selection = _doc.getSelection();
        var text = selection.toString();

        CCE.TextSelection.lastSel = text;

        CCE.TextSelection.removeCaptureButtonInPage();

        if (selection.rangeCount == 0 || selection.isCollapsed) {
            return;
        }

        var offset = CCE.TextSelection.getSelectionCoords(_doc);
        var x = offset.x;
        var y = offset.y;

        var inlineCaptureButton = _doc.createElement("div");
        inlineCaptureButton.setAttribute("id", "CitelighterInPageCapture");

        var width = "148px";
        var height = "42px";
        var captureImage = chrome.extension.getURL("images/capturebtn.png"),
            captureImageHover = chrome.extension.getURL("images/capturebtn_hover.png");

        inlineCaptureButton.setAttribute("style",
            "cursor: pointer; position: absolute; display: inline; z-index: 2147483640;border:none;" +
            "width: " + width + ";" + "height: " + height + ";" +
            "min-width: " + width + ";" + "min-height: " + height + ";" +
            "max-width: " + width + ";" + "max-height: " + height + ";" +
            "left: " + x + "px;" + "top: " + y + "px;" +
            "background: url(" + captureImage + ")");



        if (_doc.getSelection().toString() != "") {
            _doc.body.appendChild(inlineCaptureButton);


            inlineCaptureButton.addEventListener("click", function() {
                var request = {
                    action: "showFastCapture"
                };

                chrome.extension.sendMessage(request, CCE.TextSelection.defaultCallback);
            }, true);

            inlineCaptureButton.onmouseover = function() {
                inlineCaptureButton.style.backgroundImage = "url(" + captureImageHover + ")";
            };

            inlineCaptureButton.onmouseout = function() {
                inlineCaptureButton.style.backgroundImage = "url(" + captureImage + ")";
            }
        }
    },

    getScrollTop: function() {
        if (typeof pageYOffset != "undefined") {
            //most browsers except IE before #9
            return pageYOffset;
        } else {
            var body= document.body; //IE 'quirks'
            var docElement= document.documentElement; //IE with doctype
            docElement = (docElement.clientHeight)? docElement: body;
            return docElement.scrollTop;
        }
    },

    /**
     * Function getSelectionCoords
     * @desc get the selected text coordinates
     */
    getSelectionCoords: function(_doc) {
        var sel = _doc.selection, range, rects, rect;
        var x = 0, y = 0;

        if (sel) {
            if (sel.type != "Control") {
                range = sel.createRange();
                range.collapse(true);
                x = range.boundingLeft;
                y = range.boundingTop;
            }
        } else if (_doc.getSelection) {
            sel = _doc.getSelection();

            if (sel.rangeCount) {
                range = sel.getRangeAt(0).cloneRange();

                if (range.getClientRects) {
                    rects = range.getClientRects();
                    range.collapse(true);

                    if (rects.length > 0) {
                        rect = rects[rects.length-1];
                    }

                    var winScrollTop = CCE.TextSelection.getScrollTop();
                    x = rect.right;
                    y = rect.bottom + winScrollTop - 42; // 42 for the height of the in-page capture button
                }

                // Fall back to inserting a temporary element
                if (x == 0 && y == 0) {
                    var span = _doc.createElement("span");

                    if (span.getClientRects) {
                        // Ensure span has dimensions and position by
                        // adding a zero-width space character
                        span.appendChild(_doc.createTextNode("\u200b") );
                        range.insertNode(span);

                        var _rects = range.getClientRects();
                        var width  = _rects[_rects.length -1].width;

                        rect = span.getClientRects()[0];
                        x = rect.right + width;
                        y = rect.bottom;
                        var spanParent = span.parentNode;
                        spanParent.removeChild(span);

                        // Glue any broken text nodes back together
                        spanParent.normalize();
                    }
                }
            }
        }

        return  {x: x, y: y};
    },

    /**
     * Function removeCaptureButtonInPage
     * @desc - removes the in page capture button
     */
    removeCaptureButtonInPage: function() {
        var button = document.getElementById("CitelighterInPageCapture");

        if (button) {
            button.parentNode.removeChild(button);
        }
    },

    /**
     * Function mouseListener
     * @desc - listens for text selection changes
     */
    mouseListener: function(e) {
        // don't capture info from inside editable elements
        var excludedTypes = ["input", "textarea"]
        var type = e.target.tagName.toLowerCase();

        for (var i in excludedTypes) {
            if (type == excludedTypes[i]) {
                CCE.TextSelection.resetMouseOffsets();
                CCE.TextSelection.removeCaptureButtonInPage();
                return;
            }
        }

        CCE.TextSelection.mouseDownY = e.pageY;
        document.addEventListener("mouseup", function(e) {
            CCE.TextSelection.detectSelection(e);
        }, true);

        document.addEventListener("scroll", function(e) {
            CCE.TextSelection.removeCaptureButtonInPage();
        }, true);
    },

    /**
     * Function detectSelection
     * @desc - detects the user's text selection
     */
    detectSelection: function(e) {
        var _doc = document;

        if (CCE.TextSelection.mouseDownY === null) {
            CCE.TextSelection.resetMouseOffsets();
            return;
        }

        CCE.TextSelection.mouseUpY = e.pageY;
        CCE.TextSelection.mouseUpX = e.pageX;

        if (e.target.id == "CitelighterInPageCapture") {
            return;
        }

        setTimeout(function() {
            var textSel = _doc.getSelection();

            if (textSel != null && typeof textSel.toString()[0] != "undefined" && textSel.toString().trim() != "") {
                CCE.TextSelection.lastSel = textSel.toString().trim();

                if (!CCE.TextSelection.isLoggedIn || !CCE.TextSelection.showCaptureInPage) {
                    return;
                }

                CCE.TextSelection.insertCaptureButtonInPage(_doc);
            } else {
                CCE.TextSelection.removeCaptureButtonInPage();
                CCE.TextSelection.lastSel = "";
            }
        }, 10);

    },

    initTextSelectionOnDoc: function() {
        document.addEventListener("mousedown", function(e) {
            CCE.TextSelection.mouseListener(e);
        }, false);
    },

    /**
     * Function initialSetup
     * @desc - initial set up for the TextSelection object (sets the object defaults and handles the requests from the background page)
     */
    initialSetup: function() {
        CCE.ExtractDetails.initialSetup();
        CCE.TextSelection.initTextSelectionOnDoc();

        var request = {
            action: "getStatus"
        };

        chrome.extension.sendMessage(request, function(response) {
            if (!response && "undefined" != typeof chrome.extension.lastError) {
                console.log("No response. Error: " + chrome.extension.lastError.message);
                return;
            }

            CCE.TextSelection.isLoggedIn = response.logged_in;
            CCE.TextSelection.optionsChanged(response.options);
        });

        chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
            switch(request.action) {
                case "getSelText":
                    var response = {
                        text: CCE.TextSelection.lastSel,
                        is_pdf: true
                    };

                    CCE.TextSelection.removeCaptureButtonInPage();
                    sendResponse(response);
                    break;
                case "loginStatus":
                    CCE.TextSelection.isLoggedIn = request.logged_in;
                    sendResponse({success: true});
                    break;
                case "optionsChanged":
                    CCE.TextSelection.optionsChanged(request.options);
                    sendResponse({success: true});
                    break;
                case "removeInpageCaptureButton":
                    CCE.TextSelection.removeCaptureButtonInPage();
                    sendResponse({success: true});
                    break;
            }
        });
    }
};

CCE.TextSelection.initialSetup();
