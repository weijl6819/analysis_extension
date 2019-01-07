(function () {
    'use strict';

    // connect to background page
    var port = chrome.runtime.connect({name: "take_break_by_eyecareplus"});

    port.onMessage.addListener(function(data) {
        //console.log(data);
        switch (data.type) {
            case 'state':
                handleState(data.message);
                break;
            default:
                break;
        }
    });

    var wrapper = document.querySelector('body');
    var buttonSkip = document.querySelector('.button.skip');
    var buttonGotIt = document.querySelector('.button.got-it');
    var buttonFinish = document.querySelector('.button.finish');
    var buttonSettings = document.querySelector('.settings');
    var text = document.querySelector('.js-text');

    buttonSkip.addEventListener('click', function (e) {
        e.preventDefault();
        port.postMessage({type: 'tab', message: 'skip'});
    }, false);

    buttonGotIt.addEventListener('click', function (e) {
        e.preventDefault();
        port.postMessage({type: 'tab', message: 'got_it'});
    }, false);

    buttonFinish.addEventListener('click', function (e) {
        e.preventDefault();
        port.postMessage({type: 'tab', message: 'finish'});
    }, false);

    buttonSettings.addEventListener('click', function (e) {
        e.preventDefault();
        openOptionsPage();
    }, false);

    function getTextByState(state) {
        switch (state) {
            case 'green':
                return 'Enjoy your break!';
            case 'red':
                return 'Hey! Stand up and walk a little.';
            default:
                return 'You\'ll be notified when your break time comes.';
        }
    }

    function handleState(data) {
        wrapper.classList.remove("red", "green", "blue");

        var state = data.state;
        text.textContent = data.text || getTextByState(state);

        if (state) {
            wrapper.classList.add(state);
        }
    }

    function openOptionsPage() {
        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('options.html'));
        }
    }

    port.postMessage({type: 'tab', message: 'get_state'});

})();