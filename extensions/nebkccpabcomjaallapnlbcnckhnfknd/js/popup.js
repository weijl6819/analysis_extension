(function () {
    'use strict';

    // connect to background page
    var port = chrome.runtime.connect({name: "take_break_by_eyecareplus"});

    port.onMessage.addListener(function(data) {
        console.log(data);
        switch (data.type) {
            case 'state':
                handleState(data.message);
                break;
            default:
                break;
        }
    });

    var wrapper = document.querySelector('.wrapper');
    var buttonSkip = document.querySelector('.button.skip');
    var buttonGotIt = document.querySelector('.button.got-it');
    var buttonSettings = document.querySelector('.settings');
    var buttonFinish = document.querySelector('.button.finish');
    var text = document.querySelector('.wrapper > p');

    buttonFinish.addEventListener('click', function (e) {
        e.preventDefault();
        port.postMessage({type: 'popup', message: 'finish'});
    }, false);

    buttonSkip.addEventListener('click', function (e) {
        e.preventDefault();
        port.postMessage({type: 'popup', message: 'skip'});
    }, false);

    buttonGotIt.addEventListener('click', function (e) {
        e.preventDefault();
        port.postMessage({type: 'popup', message: 'got_it'});
    }, false);

    buttonSettings.addEventListener('click', function (e) {
        e.preventDefault();
        openOptionsPage();
    }, false);

    function handleState(data) {
        wrapper.classList.remove("blue", "red", "green");

        var state = data.state;
        text.textContent = data.text || getTextByState(state);

        if (state) {
            wrapper.classList.add(state);
        }
    }

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

    function openOptionsPage() {
        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('options.html'));
        }
    }

    port.postMessage({type: 'popup', message: 'get_state'});

})();