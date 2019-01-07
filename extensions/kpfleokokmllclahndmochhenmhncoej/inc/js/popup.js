var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-109917224-1']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

$(document).ready(function () {

    var buttons = $("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', trackButtonClick);
    }

    var toolBtns = $(".toolbarBtn");
    for (var ii = 0; ii < toolBtns.length; ii++) {
        toolBtns[ii].addEventListener('click', trackButtonClick);
    }

    function trackButtonClick(e) {
        var id = e.currentTarget.innerText;
        if (!id || id === "") id = e.currentTarget.title;
        _gaq.push(['_trackEvent', id, 'clicked']);
    }

    getSelectedTab = function () {
        var dfd = $.Deferred();

        chrome.tabs.query({
            "active": true,
            "currentWindow": true
        }, function (tabs) {
            dfd.resolve(tabs[0]);
        });

        return dfd.promise();
    };

    validateTab = function (tab) {
        var dfd = $.Deferred();
        var url = tab.url;

        if (url.indexOf("chrome://") === 0 || url.indexOf("chrome-extension://") === 0) {
            dfd.reject("Warning: Does not work on internal browser pages.");
        } else if (url.indexOf("https://chrome.google.com/extensions/") === 0 || url.indexOf("https://chrome.google.com/webstore/") === 0) {
            dfd.reject("Warning: Does not work on the Chrome Extension Gallery.");
        } else {
            dfd.resolve();
        }

        return dfd.promise();
    };

    scriptDesc = function (script) {
        return (
            script.file ? {
                allFrames: script.allFrames,
                "file": script.content
            } : {
                allFrames: script.allFrames,
                "code": script.content
            }
        );
    };

    AA_loadScripts = function (scripts, dfr) {
        var options = scriptDesc(scripts.shift());
        chrome.tabs.executeScript(page.id, options, function () {
            if (scripts.length !== 0)
                AA_loadScripts(scripts, dfr);
            else
                dfr.resolve();
        });
        return dfr.promise();
    };

    openTestPage = function (e) {
        window.open((options.testPageUrl === '') ? options.defaultTestPage : options.testPageUrl, '_blank');
    };

    openOptionsPage = function (e) {
        window.open(chrome.extension.getURL('/inc/html/options.html'), '_blank');
    };

    openHomePage = function (e) {
        window.open('https://docs.google.com/presentation/d/1ZAJ8dCCZ9mapb_cnZcRse5mJsihAnGhrQDLzso4su8Q/edit?usp=sharing', '_blank');
    };

    openSharePage = function (e) {
        window.open('https://www.facebook.com/sharer?u=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fwcag-accessibility-audit%2Fkpfleokokmllclahndmochhenmhncoej', '_blank');
    };

    page = {
        id: null,
        title: null,
        url: null,
        favIconUrl: null
    };

    runAudits = function (e) {
        getSelectedTab().done(
            function (tab) {
                validateTab(tab).always(
                    function (err) {
                        if (err) {
                            $error = $('.error');
                            $error.css('display', 'block');
                            $error.html(err);
                            //alert(err);
                        } else {
                            page.id = tab.id;

                            var apiCode = '';
                            $.ajax({
                                url: (options.API === "Internal") ? options.InternalAPI : (options.API === "Latest") ? options.LatestAPI : (options.CustomAPI === '' ? options.InternalAPI : options.CustomAPI),
                                dataType: "text",
                                success: function (apiCode) {
                                    AA_loadScripts([{
                                        allFrames: false,
                                        file: true,
                                        content: "/inc/js/jquery-2.1.4.min.js"
                                    }, {
                                        allFrames: false,
                                        file: false,
                                        content: apiCode
                                    }, {
                                        allFrames: false,
                                        file: true,
                                        content: "/inc/js/audit.js"
                                    }, {
                                        allFrames: false,
                                        file: false,
                                        content: //"<script id='AA-options' type='text/javascript'>"+
                                            'var AA_options = {expandInstructions: ' + options.expandInstructions + ', version:"' + options.version + '"};'
                                        //+'</script>'
                                    }, {
                                        allFrames: false,
                                        file: false,
                                        content:
                                            (options.expandHiddenElements || options.hightlightWithSemiTransparentCover ?
                                                ('$(\'<style id="AccessAuditPlusCss">' +
                                                    (options.expandHiddenElements ?
                                                        '.forceVisible {' +
                                                        ' display: inherit !important;' +
                                                        ' min-width:' + options.minWHExpandHiddenElements + 'px;' +
                                                        ' min-height:' + options.minWHExpandHiddenElements + 'px;' +
                                                        '}' :
                                                        '') +
                                                    (options.hightlightWithSemiTransparentCover ?
                                                        '.AccessAuditMarker:not(html) {' +
                                                        //' background:lightblue;'+
                                                        ' -webkit-filter: url("#blueish") drop-shadow(0px 0px 2px blue) drop-shadow(0px 0px 4px blue);' +
                                                        '}' +
                                                        '.AccessAuditHighlight:not(html) {' +
                                                        //' background:pink;'+
                                                        ' -webkit-filter: url("#pinkish") drop-shadow(0px 0px 2px red) drop-shadow(0px 0px 4px red);' +
                                                        '}' :
                                                        '') +
                                                    '</style>\').appendTo("head");'
                                                ) :
                                                ''
                                            )
                                    }], $.Deferred()).done(
                                        function () {
                                            try {
                                                chrome.tabs.sendMessage(page.id, {
                                                    type: 'Audit',
                                                    banned: options.banned
                                                }, function (results) {
                                                    showResults(results);
                                                });
                                            } catch (e) {
                                                alert(e.message);
                                            }
                                        });
                                },
                                error: function (e) {
                                    alert(e);
                                    console.log({
                                        ajax: e
                                    });
                                }
                            });
                        }
                    }
                );
            }
        );
    };

    camel2Words = function (str) {
        var arr = str.split("");

        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i].match(/[A-Z]/)) {
                arr.splice(i, 0, " ");
            }
        }
        arr[0] = arr[0].toUpperCase();
        return arr.join("");
    };

    showResults = function (results) {
        $('#resultsList').html('');
        $('#resultsWrapper').addClass('hide');
        if (!results || results === undefined || results.length === 0)
            return;
        var r = {
            PASS: '',
            NA: '',
            FAIL: ''
        };
        $.each(results, function (index, rule) {
            //console.log(rule);

            const className = (rule.status == 'PASS') ? 'pass' : (rule.status == 'FAIL') ? 'fail' : 'na';

            r[rule.status] += '<li data-name="' + rule.name + '" data-index="' + rule.id + '" data-url="' + rule.url + '" class="' + className + (!options[rule.status] ? ' hide' : '') + '" title="' + rule.title + '">';
            r[rule.status] += '<table role="presentation"><tr>';
            r[rule.status] += '<td class="ruleSeverity">';
            const brokeRules = rule.elements ? (': ' + rule.elements.length + ' element' + (rule.elements.length > 0 ? 's' : '') + ' broke this rule.') : '';
            let title = rule.status == 'FAIL' ? '' : 'Would be ';
            let img = '';
            switch (rule.severity) {
                case 'Severe':
                    title += 'Severe';
                    img = 'severe';
                    break;
                case 'Warning':
                    title += 'Warning';
                    img = 'warning';
                    break;
            }
            const count = (rule.count === 0 ? '' : ("<span class='ruleCount' title='Count of broken elements'>&nbsp;("+rule.count+")</span>"));
            
            r[rule.status] += '<img src="/images/' + img + '.png" title="' + title + brokeRules + '"></img>';
            r[rule.status] += '</td>';
            r[rule.status] += '<td class="ruleName">' + camel2Words(rule.name) + '</td>';
            if(rule.count > 0) {
                r[rule.status] += '<td class="ruleCount" title="Count of broken elements">&nbsp;('+rule.count+')</td>';
            }
            r[rule.status] += '</tr></table>';
            r[rule.status] += '</li>\n';
        });

        if (r.FAIL + r.PASS + r.NA !== '') {
            $('#resultsWrapper').removeClass('hide');
        }
        $('#resultsList').html('<ul>' + r.FAIL + r.PASS + r.NA + '</ul>');
        $('.fail .ruleSeverity').click(showClick);
        $('.fail .ruleName').click(showClick);

        $('.pass .ruleSeverity img').css('opacity', 0.25);
        $('.na .ruleSeverity img').css('opacity', 0.25);

        $(function () {
            var context = $('#resultsList').nuContextMenu({

                items: '.ruleName',

                callback: function (key, element) {
                    var name = $(element).closest('li').data('name');
                    switch (key) {
                        case 'info':
                            _gaq.push(['_trackEvent', "Rule Details: '" + name + "'", 'clicked']);
                            window.open($(element).closest('li').data('url'), '_blank');
                            break;
                        case 'console':
                            _gaq.push(['_trackEvent', "Show In Console: '" + name + "'", 'clicked']);
                            chrome.tabs.sendMessage(page.id, {
                                type: 'dumpElements',
                                rule: name
                            }, function (results) {
                                alert('Open DevTools -> Console/Info on Web Page.\nOr press Ctrl+Shift+I');
                                context.nuContextMenu('close');
                            });
                            break;
                        case 'remove':
                            _gaq.push(['_trackEvent', "Remove From Tests: '" + name + "'", 'clicked']);
                            console.log($(element));
                            options.banned.push(name);
                            saveOption('banned', options.banned);

                            alert('Rule "' + element.innerHTML + '" ' +
                                'has been removed from further audits.\n\n' +
                                'To restore it, open the Options Page.\n');
                            $(element).closest('li').remove();
                            context.nuContextMenu('close');
                            break;
                        case 'cancel':
                            context.nuContextMenu('close');
                            break;
                    }
                },

                menu: {
                    'info': {
                        title: 'Rule Details',
                        class: 'menuEntry'
                    },

                    'console': {
                        title: 'Show in Console',
                        class: 'menuEntry'
                    },

                    'remove': {
                        title: 'Remove from Tests',
                        class: 'menuEntry'
                    },

                    'void': 'separator',

                    'cancel': {
                        title: 'Cancel',
                    },
                },

                onOpenCallback: function (position) {
                    $('body').css({
                        "padding-bottom": "70px"
                    });
                },

                onCloseCallback: function () {
                    $('body').css({
                        "padding-bottom": "0px"
                    });
                }
            });
        });

        $('#exportBtn').unbind('click').bind('click', function () {
            openReport(results);
        });
    };

    openReport = function (results) {
        if (!results || results === undefined || results.length === 0)
            return;

        var addRule = function (rule) {
            //reportBody+='<h4>'+camel2Words(rule.name)+'</h4>';
            reportBody += '<h4 class="description ' + rule.status.toLowerCase() + ' ' + rule.severity + '">' + rule.title + '</h4>';
            reportBody += '<a class="ruleUrl" href="' + rule.url + '" target="_blank">' + rule.url + '</a>';
            if (rule.data) {
                reportBody += '<p>' + rule.data.length + ' element' + (rule.data.length != 1 ? 's' : '') + ' break' + (rule.data.length == 1 ? 's' : '') + ' this rule:</p>';
                reportBody += '<ol start="1">';
                $.each(rule.data, function (i, p) {
                    reportBody += '<li>';
                    reportBody += p.path;
                    if (p.comment && p.comment !== undefined && p.comment !== '') {
                        reportBody += '<br/><span class="suggest">*** Auditor suggests: ' + p.comment + '</span>';
                    }
                    reportBody += '</li>';
                });
                reportBody += '</ol>';
            }
        };

        var reportBody = "";

        var statLbls = ['FAIL'];
        if (options.PASS) statLbls.push('PASS');
        if (options.NA) statLbls.push('NA');

        var comments = {
            FAIL: 'This implies that there were elements on the page that did not pass this audit rule. This is the only result you will probably be interested in.',
            PASS: 'This implies that there were elements on the page that may potentially have failed this audit rule, but they passed. Congratulations!',
            NA: 'This implies that there were no elements on the page that may potentially have failed this audit rule. For example, an audit rule that checks video elements for subtitles would return this result if there were no video elements on the page.'
        };

        $.each(statLbls, function (l, stat) {
            var fs = $(results).filter(function (i, r) {
                return r.status == stat;
            });
            if (fs.length > 0) {
                reportBody += '<h2>There are ' + fs.length + ' ' + stat.toLowerCase() + '-rule' + (fs.length == 1 ? '' : 's') + ':</h2>';
                reportBody += '<p class="note">' + comments[stat] + '</p>';

                $.each(['Severe', 'Warning'], function (j, svr) {
                    var svrRules = $(fs).filter(function (i, r) {
                        return r.severity == svr;
                    });
                    if (svrRules.length > 0) {
                        reportBody += '<h3>' + svrRules.length + (stat != 'FAIL' ? ' would be ' : ' ') + svr + ':</h2>';

                        $.each(svrRules, function (k, rule) {
                            addRule(rule);
                        });
                    }
                });
            }
        });

        Background.openReport(page, reportBody, '', new Date());
    };

    showClick = function (e) {
        var $e = $(e.toElement).closest('li');
        var hide = $e.hasClass('hideElements');
        var index = $e.data('index');
        chrome.tabs.sendMessage(page.id, {
            type: 'Lookup',
            index: index,
            hide: hide,
            controlKeys: options.controlKeys,
        }, function (results) {
            $e.toggleClass('hideElements');
        });
    };

    showStat = function ($cb) {
        var cls = $cb.attr('id').substr(2).toLowerCase();
        var $rows = $('#resultsList .' + cls);
        var show = $cb.is(':checked');

        if (show) $rows.removeClass('hide');
        else $rows.addClass('hide');

        saveOption(cls.toUpperCase(), show);
    };

    saveOption = function (key, value) {
        var obj = {};
        obj[key] = value;
        chrome.storage.sync.set(obj);
        //chrome.storage.sync.get(null, function (data) { console.info(data) })
        options[key] = value;
    };

    $.each($('img'), function (index, value) {
        $value = $(value);
        $value.attr('src', chrome.extension.getURL($value.attr('src'))).attr('alt', '');
    });

    $('#closeBtn').click(function (e) {
        window.close();
    });
    $('#optionsBtn').click(openOptionsPage);
    $('#homeBtn').click(openHomePage);
    $('#Share').click(openSharePage);
    $('#sampleBtn').click(openTestPage);

    var options = null;
    var Background = null;

    getSelectedTab().done(
        function (tab) {
            validateTab(tab).always(
                function (err) {
                    // if (err) {
                    //     alert(err);
                    // } else
                    {

                        page.id = tab.id;
                        page.title = tab.title;
                        page.url = tab.url;
                        page.favIconUrl = tab.favIconUrl;

                        Background = chrome.extension.getBackgroundPage().Background;
                        Background.getDefaults().done(function (response) {
                            //chrome.runtime.sendMessage({type:'get-defaults'}, function(response) {
                            options = response;
                            //console.log(options);

                            if (options.PASS) $('#cbPass').attr('checked', '');
                            else $('#cbPass').removeAttr('checked');

                            if (options.NA) $('#cbNA').attr('checked', '');
                            else $('#cbNA').removeAttr('checked');

                            $('#filterResults input[type=checkbox]').change(function () {
                                showStat($(this));
                            });

                            $('#runBtn').click(runAudits);

                            chrome.tabs.sendMessage(page.id, {
                                type: 'RefreshAudit'
                            }, function (results) {
                                showResults(results);
                            });
                        });
                    }
                }
            );
        }
    );
});