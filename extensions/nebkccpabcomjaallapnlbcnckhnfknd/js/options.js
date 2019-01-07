(function ($) {
    'use strict';

    var initialOptions = null;

    var $defaultsButton = $('.js-defaults'),
        $allInputs = $('input, select');

    var $timeFrom = $('input[name=time-from]'),
        $timeTo = $('input[name=time-to]'),
        $interval = $('select[name=interval]'),
        $duration = $('select[name=break-length]'),
        $sound = $('input[name=sound-switch]'),
        $type = $('input[name=notification-type]'),
        $dayInputs = $('.days-wrapper input[type=checkbox]');

    var port = chrome.runtime.connect({name: "take_break_by_eyecareplus"});

    port.onMessage.addListener(function(data) {
        switch (data.type) {
            case 'options':
                data.message && setOptions(data.message);
                break;
            default:
                break;
        }
    });

    $defaultsButton.click(function (e) {
        e.preventDefault();
        port.postMessage({type: 'options', message: 'get_default_options'});
    });

    var $notificationPreview = $('.desktop-notification-preview');
    $notificationPreview.click(function (e) {
        e.preventDefault();

        var options = {
            type: 'basic',
            iconUrl: 'images/icon80.png',
            title: 'It\'s break time!',
            message: 'Stand up and walk a little!',
            buttons: [
                {title: 'Skip', iconUrl: ''},
                {title: 'Got it', iconUrl: ''}
            ]
        };

        chrome.notifications.create(options);
    });

    $allInputs.change(function (e) {
        validateTimes() && saveOptions();
    });

    function validateTimes() {
        var validation = true;

        var timeFrom = $timeFrom.val();
        var timeTo = $timeTo.val();

        if (!timeFrom || !timeTo) validation = false;

        var hourFrom = parseInt(timeFrom.split(':')[0]);
        var minFrom = parseInt(timeFrom.split(':')[1]);
        var hourTo = parseInt(timeTo.split(':')[0]);
        var minTo = parseInt(timeTo.split(':')[1]);

        if (hourFrom > hourTo) validation = false;
        else if (hourFrom === hourTo && minFrom >= minTo) validation = false;

        if (!validation) {
            $timeFrom.css({
                'border-color': '#FF0000',
                'box-shadow': '0 0 5px 0px #FF0000'
            });
            $timeTo.css({
                'border-color': '#FF0000',
                'box-shadow': '0 0 5px 0px #FF0000'
            });
        } else {
            $timeFrom.removeAttr('style');
            $timeTo.removeAttr('style');
        }

        return validation;
    }

    function saveOptions() {
        //chrome.storage.sync.remove('take_break_by_eyecareplus');
        var options = {'take_break_by_eyecareplus': getOptions()};
        chrome.storage.sync.set(options, function() {
            port.postMessage({type: 'options', message: 'reset_timers'});
        });
    }

    function restoreOptions() {
        chrome.storage.sync.get('take_break_by_eyecareplus', function(data) {
            initialOptions = data['take_break_by_eyecareplus'];
            setOptions(data['take_break_by_eyecareplus']);
        });
    }

    function getOptions() {
        var days = [];

        $dayInputs.each(function (i, el) {
            if ($(el).is(':checked')) {
                days.push(i);
            }
        });

        var options = {
            timeFrom: $timeFrom.val(),
            timeTo: $timeTo.val(),
            interval: $interval.val(),
            duration: $duration.val(),
            sound: $sound.is(':checked'),
            notificationType: $type.filter(':checked').val(),
            days: days
        };

        return options;
    }

    function setOptions(options) {

        $timeFrom.val(options.timeFrom || '09:00');
        $timeTo.val(options.timeTo || '17:00');
        $interval.val(options.interval || '60');
        $duration.val(options.duration || '5');
        $type.val([options.notificationType || 'tab']);
        $sound.prop('checked', options.sound);

        $dayInputs.each(function (i, el) {
            $(el).prop('checked', false);
        });
        if (!options.days || Object.prototype.toString.call(options.days) !== '[object Array]') options.days = [1, 2, 3, 4, 5];
        options.days.forEach(function (v) {
            $dayInputs.eq(v).prop('checked', true);
        });
    }

    restoreOptions();

})(jQuery);
