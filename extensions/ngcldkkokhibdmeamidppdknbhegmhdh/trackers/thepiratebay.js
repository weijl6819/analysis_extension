// ==UserScript==
// @name ThePirateBay
// @trackerURL https://thepiratebay.org
// @icon data:image/png;base64,Qk04AwAAAAAAADYAAAAoAAAAEAAAABAAAAABABgAAAAAAAAAAADgTAAA4EwAAAAAAAAAAAAA/////////////////////////////////////////////////////v7+/////////////Pz8vb297Ozs////////////////////////////////4uLiSUlJ3d3d////////8/PzEhIScnJy8fHx////////////////////8fHxwsLCWFhYAAAAyMjI////////5+fnEBAQICAgQkJCV1dXZWVli4uLiYmJUlJSKioqPT09bm5uHh4eYWFhwcHBubm5bGxsQEBAp6end3d3FBQUAAAAFBQUOTk5ISEhGRkZPT09WVlZQkJCKioqJycnenp6AAAAQUFBPz8/YGBgjo6O0dHR+/v7////////7+/vxcXFnZ2dg4ODExMTQEBAv7+/AAAAgoKCjo6OpaWltra2qqqqpqampaWlpKSkra2tr6+vsbGx5eXll5eXW1tb1NTUcXFxmJiYAwMDAAAANzc3VFRUGxsbAAAAX19fPDw8ERERAAAAQUFB/v7+/Pz8////////nJycAAAAAAAAAAAAHx8fCwsLAAAAJiYmBQUFAAAAAAAAKysr+vr6////////////nJycAAAAAAAADw8PAAAAAAAAAAAAAAAADQ0NAwMDAAAANjY2+vr6////////////rq6uAAAANjY25eXlWVlZHx8fJycnIyMj0dHRhoaGAAAAV1dX////////////////r6+vAAAALS0t0tLSX19fsrKy2dnZZWVlsrKyiIiIAAAAWVlZ////////////////r6+vAAAAAAAABQUFAgICExMTEBAQAwMDAwMDAQEBAAAAWlpa////////////////q6urAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVFRU////////////////19fXSUlJQUFBQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQkJCQkJCqKio/////////////////////////v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////AAA%3D
// @description Download music, movies, games, software and much more. The Pirate Bay is the world\'s largest bittorrent tracker.
// @downloadURL https://github.com/Feverqwe/tSearch/raw/master/src/trackers/thepiratebay.js
// @connect *://thepiratebay.org/*
// @require exKit
// @version 1.0.1
// ==/UserScript==

API_exKit({
    id: 'thepiratebay',
    title: 'ThePirateBay',
    icon: 'data:image/png;base64,Qk04AwAAAAAAADYAAAAoAAAAEAAAABAAAAABABgAAAAAAAAAAADgTAAA4EwAAAAAAAAAAAAA/////////////////////////////////////////////////////v7+/////////////Pz8vb297Ozs////////////////////////////////4uLiSUlJ3d3d////////8/PzEhIScnJy8fHx////////////////////8fHxwsLCWFhYAAAAyMjI////////5+fnEBAQICAgQkJCV1dXZWVli4uLiYmJUlJSKioqPT09bm5uHh4eYWFhwcHBubm5bGxsQEBAp6end3d3FBQUAAAAFBQUOTk5ISEhGRkZPT09WVlZQkJCKioqJycnenp6AAAAQUFBPz8/YGBgjo6O0dHR+/v7////////7+/vxcXFnZ2dg4ODExMTQEBAv7+/AAAAgoKCjo6OpaWltra2qqqqpqampaWlpKSkra2tr6+vsbGx5eXll5eXW1tb1NTUcXFxmJiYAwMDAAAANzc3VFRUGxsbAAAAX19fPDw8ERERAAAAQUFB/v7+/Pz8////////nJycAAAAAAAAAAAAHx8fCwsLAAAAJiYmBQUFAAAAAAAAKysr+vr6////////////nJycAAAAAAAADw8PAAAAAAAAAAAAAAAADQ0NAwMDAAAANjY2+vr6////////////rq6uAAAANjY25eXlWVlZHx8fJycnIyMj0dHRhoaGAAAAV1dX////////////////r6+vAAAALS0t0tLSX19fsrKy2dnZZWVlsrKyiIiIAAAAWVlZ////////////////r6+vAAAAAAAABQUFAgICExMTEBAQAwMDAwMDAQEBAAAAWlpa////////////////q6urAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVFRU////////////////19fXSUlJQUFBQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQkJCQkJCqKio/////////////////////////v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////AAA%3D',
    desc: 'Download music, movies, games, software and much more. The Pirate Bay is the world\'s largest bittorrent tracker.',
    flags: {
        auth: 0,
        language: 'en',
        cyrillic: 1
    },
    categoryList: {
        serials: [],
        music: [101, 102, 103, 104, 199],
        games: [504, 401, 402, 403, 404],
        films: [201, 202, 203, 204, 205, 207, 208, 209, 299, 501, 502, 505, 506],
        cartoon: [],
        books: [601],
        soft: [301, 302, 303],
        anime: [],
        doc: [],
        sport: [],
        xxx: [],
        humor: []
    },
    search: {
        mode: '',
        searchUrl: 'https://thepiratebay.org/search/%search%/0/99/0',
        nextPageSelector: {selector: '#main-content+div a:eq(-1)', attr: 'href'},
        baseUrl: 'https://thepiratebay.org/',
        requestType: 'GET',
        onAfterDomParse: function (details) {
            var $dom = details.$dom;
            var firstItem = $dom.find(details.tracker.search.listItemSelector).first();
            if (firstItem.children('td').length > 4) {
                details.tracker.search.torrentSelector = details.tracker.search.torrentSelectorSingle;
                details.tracker.search.mode = 'single';
            } else {
                details.tracker.search.torrentSelector = details.tracker.search.torrentSelectorDbl;
                details.tracker.search.mode = 'dbl';
            }
        },
        listItemSelector: '#searchResult>tbody>tr',
        torrentSelector: {
            categoryTitle: null,
            categoryUrl: null,
            categoryId: null,
            title: null,
            url: null,
            size: null,
            downloadUrl: null,
            seed: null,
            peer: null,
            date: null
        },
        torrentSelectorSingle: {
            categoryTitle: 'td.vertTh>a',
            categoryUrl: {selector: 'td.vertTh>a', attr: 'href'},
            categoryId: {selector: 'td.vertTh>a', attr: 'href'},
            title: 'td:eq(1)>a',
            url: {selector: 'td:eq(1)>a', attr: 'href'},
            size: 'td:eq(4)',
            downloadUrl: {selector: 'td:eq(3)>nobr>a:eq(0)', attr: 'href'},
            seed: 'td:eq(5)',
            peer: 'td:eq(6)',
            date: 'td:eq(2)'
        },
        torrentSelectorDbl: {
            categoryTitle: 'td.vertTh a:eq(-1)',
            categoryUrl: {selector: 'td.vertTh a:eq(-1)', attr: 'href'},
            categoryId: {selector: 'td.vertTh a:eq(-1)', attr: 'href'},
            title: 'td:eq(1)>div>a',
            url: {selector: 'td:eq(1)>div>a', attr: 'href'},
            size: {selector: 'td:eq(1)>font'},
            downloadUrl: {selector: 'td:eq(1)>a:eq(0)', attr: 'href'},
            seed: 'td:eq(2)',
            peer: 'td:eq(3)',
            date: {selector: 'td:eq(1)>font'}
        },
        onGetValue: {
            categoryId: function (details, value) {
                return exKit.funcList.idInCategoryListInt(details.tracker, value, /\/([0-9]+)$/);
            },
            sizeR: /[^\s]+\s([^,]+),\s[^\s]+\s([^,]+)/,
            size: function (details, value) {
                if (details.tracker.search.mode === 'dbl') {
                    var m = value.match(this.sizeR);
                    if (!m) {
                        return;
                    }
                    value = m[2];
                }
                value = value.replace('i', '');
                return exKit.funcList.sizeFormat(value);
            },
            date: function (details, value) {
                var m;
                var minAgoFunc = function (tracker, value) {
                    var dateSelector = tracker.search.torrentSelector.date.selector || tracker.search.torrentSelector.date;
                    var minAgo = details.$node.find(dateSelector).children('b').text();
                    if (minAgo === value) {
                        var minCount = value.match(/(\d+)/);
                        if (!minCount) {
                            return;
                        }
                        minCount = parseInt(minCount[1]);
                        return parseInt(Date.now() / 1000) - minCount * 60;
                    }
                    return false;
                };
                if (details.tracker.mode === 'dbl') {
                    m = value.match(this.sizeR);
                    if (!m) {
                        return;
                    }
                    value = m[1];
                }

                var minAgo = minAgoFunc(details.tracker, value);
                if (minAgo !== false) {
                    return minAgo;
                }

                if (m = value.match(/(\d{1,2})-(\d{1,2})\s(\d{1,2}:\d{1,2})/)) {
                    // dd-mm hh-mm
                    value = m[1] + '-' + m[2] + ' ' + (new Date()).getFullYear() + ' ' + m[3];
                }

                value = exKit.funcList.todayReplace(value, 3);
                return exKit.funcList.dateFormat(3, value);
            }
        }
    }
});