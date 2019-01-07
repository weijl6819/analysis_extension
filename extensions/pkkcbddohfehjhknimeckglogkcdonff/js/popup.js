
function $(s) {
    return document.getElementById(s);
}

function addForm(form) {
    var row, type, method, url, newtab;

    row = document.createElement('tr');
    $('forms').appendChild(row);

    type = document.createElement('td');
    type.innerText = form.type;
    row.appendChild(type);

    method = document.createElement('td');
    method.innerText = form.method;
    row.appendChild(method);

    url = document.createElement('td');
    url.innerText = form.url;

    console.log("form.url+++++++++++++++++"+form.url);
    row.appendChild(url);
    if (url.clientWidth < url.scrollWidth) {
        url.title = url.innerText;
    }

    newtab = document.createElement('td');
    newtab.title = 'Open in a new tab';
    newtab.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    row.appendChild(newtab);

    row.addEventListener('click', function (e) {

        });

    if ($('scroller').scrollTop >= $('scroller').scrollHeight - $('scroller').clientHeight - row.offsetHeight) {
        $('scroller').scrollTop = $('scroller').scrollHeight;
    }
}

function matchesWithFilter(form) {
    var i, types = [], methods = [], exclude = [],
        // parse the filter
        // TODO: add special meanings for words starting with 'type:' or 'method:'
        filter = $('filter').value.replace(/"([^"]*)"|\btype:([A-Za-z0-9]+)|\bmethod:([A-Za-z0-9]+)|-([[A-Za-z0-9]+)|([^A-Za-z0-9])/g,
                        function (match, quoted, type, method, negative, wordbreaker) {
                            if (quoted) {
                                return '|' + quoted.replace(/[^A-Za-z0-9]+/g, ' ') + '|';
                            } else if (type) {
                                types.push(type);
                                return '|';
                            } else if (method) {
                                methods.push(method);
                                return '|';
                            } else if (negative) {
                                exclude.push(negative);
                                return '|';
                            } else {
                                return '|';
                            }
                        }).split('|');

    // match types
    for (i = 0; i < types.length; i++) {
        if (form.type.toLowerCase().indexOf(types[i].toLowerCase()) > -1) {
            types.match = true;
        }
    }
    if (types.length && !types.match) {
        return false;
    }

    // match methods
    for (i = 0; i < methods.length; i++) {
        if (form.method.toLowerCase().indexOf(methods[i].toLowerCase()) > -1) {
            methods.match = true;
        }
    }
    if (methods.length && !methods.match) {
        return false;
    }

    // make the form into a searchable string
    form = (
            JSON.stringify(form.headers) +
            JSON.stringify(form.data) +
            '\n' + form.type + '\n' + form.method + '\n' + form.url
        ).replace(/[^A-Za-z0-9\n]+/g, ' ').toLowerCase();

    // negative matching
    for (i = 0; i < exclude.length; i++) {
        if (form.indexOf(exclude[i].toLowerCase()) > -1) {
            return false;
        }
    }

    // positive matching
    for (i = 0; i < filter.length; i++) {
        if (!(new RegExp(filter[i], 'i')).test(form)) {
            return false;
        }
    }
    return true;
}

window.addEventListener('load', function () {
    var style;

    // set up the scrollbar
    if (!localStorage['useDefaultScrollbarInLog']) {
        style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.innerText =
            '::-webkit-scrollbar {' +
            '	width: 4px;' +
            '	border-left: solid 1px #F0F0F0;' +
            '}' +

            '::-webkit-scrollbar-button {' +
            '	height: 0;' +
            '}' +

            '::-webkit-scrollbar-thumb {' +
            '	border: solid 1px #BBB;' +
            '	border-right: none;' +
            '	background: #F0F0F0;' +
            '	-webkit-box-shadow: inset 1px 0 3px #AAA;' +
            '}';
        document.head.appendChild(style);
    }

    // get forms from the current tab
    chrome.tabs.getSelected(null, function (tab) {
        var i, data = chrome.extension.getBackgroundPage().tabs[tab.id], tid = tab.id;

        $('filter').value = data.filter || ''; // restore the filter

        if (data.noScripts) {
            $('noScripts').style.display = 'block';
        }

        function showForms() {
            data.filter = $('filter').value; // save the filter

            $('forms').innerHTML = '';
            for (i = 0; i < (data.forms || []).length; i++) {
                if (matchesWithFilter(data.forms[i])) {
                    addForm(data.forms[i]);
                }
            }
            setTimeout(function () {
                    $('scroller').scrollTop = $('scroller').scrollHeight;
                }, 0);
        };

        showForms();

        $('filter').addEventListener('keyup', showForms);
        $('filter').addEventListener('paste', showForms);
        $('filter').addEventListener('click', showForms);

        // update in real time
        chrome.extension.onRequest.addListener(function (form, sender) {
                if (typeof form != 'string' && sender.tab.id == tid && matchesWithFilter(form)) {
                    addForm(form);
                }
            });

        // set up the clear button
        $('clear').addEventListener('click', function () {
                data.forms = [ ];
                $('forms').innerHTML = '';
                if (!data.noScripts) {
                    chrome.pageAction.hide(tid);
                }
            });
    });
});
