//dodanie funkcji startswith

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

String.prototype.levenshteinDistance = function (s2) {
    var array = new Array(this.length + 1);
    for (var i = 0; i < this.length + 1; i++)
        array[i] = new Array(s2.length + 1);

    for (var i = 0; i < this.length + 1; i++)
        array[i][0] = i;
    for (var j = 0; j < s2.length + 1; j++)
        array[0][j] = j;

    for (var i = 1; i < this.length + 1; i++) {
        for (var j = 1; j < s2.length + 1; j++) {
            if (this[i - 1] == s2[j - 1]) array[i][j] = array[i - 1][j - 1];
            else {
                array[i][j] = Math.min(array[i][j - 1] + 1, array[i - 1][j] + 1);
                array[i][j] = Math.min(array[i][j], array[i - 1][j - 1] + 1);
            }
        }
    }
    return array[this.length][s2.length];
};

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        // chrome.tabs.query invokes the callback with a list of tabs that match the
        // query. When the popup is opened, there is certainly a window and at least
        // one tab, so we can safely assume that |tabs| is a non-empty array.
        // A window can only have one active tab at a time, so the array consists of
        // exactly one tab.
        var tab = tabs[0];

        // A tab is a plain object that provides information about the tab.
        // See https://developer.chrome.com/extensions/tabs#type-Tab
        var url = tab.url;

        // tab.url is only available if the "activeTab" permission is declared.
        // If you want to see the URL of other tabs (e.g. after removing active:true
        // from |queryInfo|), then the "tabs" permission is required to see their
        // "url" properties.
        console.assert(typeof url == 'string', 'tab.url should be a string');

        callback(url);
    });

    // Most methods of the Chrome extension APIs are asynchronous. This means that
    // you CANNOT do something like this:
    //
    // var url;
    // chrome.tabs.query(queryInfo, function(tabs) {
    //   url = tabs[0].url;
    // });
    // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function renderText(testText) {
    document.getElementById('d-message').textContent = testText;
    unlockButton();
}


//Funkcja pomocnicza do logowania zawartosci chrome storage - nie jest on dostepny z konsoli DEV
function logStorage() {
    if(chrome.storage) {
        chrome.storage.local.get(function(data){
            console.log("chrome.storage.local:");
            if(chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            } else {
                console.log(data);
            }
            chrome.storage.sync.get(function(data){
                console.log("chrome.storage.sync:");
                if(chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                } else {
                    console.log(data);
                }
            });
        });
    } else {
        console.warn("chrome.storage is not accessible, check permissions");
    }
}

var CniCommon = function () {
    
    this.lockButton = function(button) {
        button.html('<div class="cssload-thecube">' +
            '<div class="cssload-cube cssload-c1"></div>' +
            '<div class="cssload-cube cssload-c2"></div>' +
            '<div class="cssload-cube cssload-c4"></div>' +
            '<div class="cssload-cube cssload-c3"></div>' +
            '</div>');
        button.attr('disabled', true);
    };

    this.unlockButton = function(button, text) {
        button.html(text);
        button.attr('disabled', false);
    };
    
    this.displayError = function(messageElement, message) {
        messageElement.addClass('d-error-message');
        messageElement.text(message);
        messageElement.show();
    };
    
    this.displaySuccess = function(messageElement, message) {
        messageElement.addClass('d-success-message');
        messageElement.text(message);
        messageElement.show();
    };
    
    this.clearMessage = function(messageElement) {
        messageElement.text("");
        messageElement.removeClass('d-success-message');
        messageElement.removeClass('d-error-message');
    };

    this.setInputError = function(inputElement) {
        inputElement.addClass('i-form-field-invalid');
    };
    
    this.clearInputError = function (inputElement) {
        inputElement.removeClass('i-form-field-invalid');
    }
};

var cniCommon = new CniCommon();
