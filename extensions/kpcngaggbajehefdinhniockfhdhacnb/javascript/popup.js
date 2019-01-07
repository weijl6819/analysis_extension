var Bg = chrome.extension.getBackgroundPage();

Bg.googleEvent('showPopup', '');

var isMyCoinsInited = false;
var isAllCoinsInited = false;
var currentTab = '';

var allCoinCurrentPage = 1;
var addCoinCurrentPage = 1;
var searchStatus = {
    keyword: '',
    page: 1
};

var secureCodeInterval = null;

var portfolioChart = null;

var addSearchStatus = {
    keyword: '',
    page: 1
};


if (Date.now() - localStorage['lastLoadTime'] > 1000 * 60) {
    Bg.initData();
}

function isSignIn() {
    return new Promise(function (resolve, reject) {
        chrome.cookies.get({url: 'https://www.coinbag.com', name: 'token'}, function (cookie) {
            resolve(cookie);
        });
    });
}


function setCookie(name, value) {
    return new Promise(function (resovle, reject) {
        chrome.cookies.set({
            url: 'https://www.coinbag.com',
            domain: "coinbag.com",
            name: name,
            value: value,
            expirationDate: Date.now() / 1000 + 365 * 24 * 60 * 60
        }, function () {
            resovle();
        });
    });
}

function refreshTabs() {
   chrome.tabs.query({url: 'https://*.coinbag.com/*'}, function (tabs) {
       tabs.forEach(function (t) {
           chrome.tabs.reload(t.id);
       })
   });
}


function getTmp(id) {
    return $('#' + id).html();
}

function fnum(x) {
    if (isNaN(x)) return x;

    if (x < 9999) {
        return x;
    }

    if (x < 1000000) {
        return (x / 1000).toFixed(2) + "K";
    }
    if (x < 10000000) {
        return (x / 1000000).toFixed(2) + "M";
    }

    if (x < 1000000000) {
        return (x / 1000000).toFixed(2) + "M";
    }

    if (x < 1000000000000) {
        return (x / 1000000000).toFixed(2) + "B";
    }

    return "1T+";
}

function showNotify(text) {
    var $notify = $('#notify');
    $notify.addClass('active').text(text);
    setTimeout(function () {
        $notify.removeClass('active');
    }, 1000);
}

function openModal(which) {
    $('#modal-wrapper').addClass('show');
    $('.modal-content').hide();
    $('#' + which).show();

    if (which === 'add-manage-coin' || which === 'add-init-coin') {
        var coins = Bg.allCoins ? Bg.allCoins.map(function (c) {
            return {
                id: c.coin_code,
                text: c.symbol,
                description: c.name
            }
        }) : [];

        // coins.unshift({
        //     id: "cash",
        //     text: "Cash",
        //     description: ""
        // })

        $('#add-init-coin-select, #add-manage-coin-select').selectivity({
            allowClear: true,
            items: coins,
            placeholder: 'Select a coin',
            matcher: function (term, text) {
                text = text.toLowerCase();
                if (term.text.toLowerCase().indexOf(text) > -1 || term.description.toLowerCase().indexOf(text) > -1) {
                    return term;
                }
                return null;
            },
            templates: {
                resultItem: function (item) {
                    return (
                        '<div class="selectivity-result-item" data-item-id="' + item.id + '">' +
                        '<span class="bold">' + item.text + '</span>' +
                        '<span class="desc"> (' + item.description + ')</span>' +
                        '</div>'
                    )
                }
            }
        });
    }
}

function closeModal() {
    $('#modal-wrapper').find('input[type=text]').val('');
    $('#modal-wrapper').find('input[type=number]').val('');
    $('#modal-wrapper').removeClass('show');
    $('#transfer-time-input').datepicker('reset');

}

function formatPrice(num) {
    if (num < 0.01) {
        return Number(num).toPrecision(2);
    } else {
        return Number(num).toLocaleString('en-US');
    }
}

function buildList(coins, isAppend) {
    console.trace();
    var $container = $('#list-container');
    if (!isAppend) {
        $container.empty();
    }
    if (coins === null) {
        var tmp = getTmp('loading-tmp');
        $(tmp).appendTo($container);
    } else {

        $container.find('.loading').remove();
        var tmp = getTmp('list-item-tmp');
        if (!coins.length) {
            return;
        }
        var noGraph = [];
        var graph = [];
        var tmpDiv = $('<div>');
        coins.forEach(function (c) {
            var _item = $(tmp).find('.full-name').text(c.name).end()
                .find('img').attr('src', "/images/coin-icons/" + c.name + ".svg").attr('name', c.name).end()
                .find('.symbol').text(c.symbol).end()
                .find('.price').text('$' + formatPrice(c.price_usd)).end()
                .find('.market-cap').text('$' + fnum(c['market_cap_usd'])).end()
                .find('.change').text(c['percent_change_24h'] + "%").end()
                .find('.graph-div').attr('data-coin-code', c.coin_code).attr('change', c['percent_change_24h']).end();

            if (Bg.myCoins && Bg.myCoins.watchList && Bg.myCoins.watchList.indexOf(c.coin_code) != -1) {
                _item.find('.watch-btn').removeClass('watch').addClass('watched');
            } else {
                _item.find('.watch-btn').removeClass('watched').addClass('watch');
            }
            _item.find('.action-toggle-btn').on('click', function () {
                $(this).parents('.list-item').toggleClass('active').removeClass('editing isOwned');
                if (_item.hasClass('active')) {
                    if (Bg.myCoins.watchList.indexOf(c.coin_code) != -1) {
                        _item.find('.watch-btn').removeClass('watch').addClass('watched');
                    } else {
                        _item.find('.watch-btn').removeClass('watched').addClass('watch');
                    }
                    if (Bg.myCoins.holdingsHash[c.coin_code]) {
                        _item.find('input').attr('data-value', Bg.myCoins.holdingsHash[c.coin_code].volume).val(Bg.myCoins.holdingsHash[c.coin_code].volume);
                        _item.addClass('isOwned');
                    }
                }
            });

            if (c['percent_change_24h'] < 0) {
                _item.find('.change').addClass('down');
            }

            _item.find('.add-input').find('input').on('focus', function () {
                _item.addClass('editing');
            });

            _item.find('img').on('error', function () {
                if ($(this).attr('png') === '') {
                    var name = $(this).attr('name');
                    $(this).attr('src', '/images/' + name + '.png').attr('png', 'true');
                } else {
                    $(this).attr('src', '/images/icon_coin_default@2x.png');
                }
            });


            _item.find('.add-input-cancel-btn').on('click', function () {
                _item.removeClass('editing');
                var $input = $(this).parent().find('input');
                if ($input.attr('data-value') !== $input.val()) {
                    $input.val($input.attr('data-value'));
                }
            });


            _item.find('.add-input-btn').on('click', function () {
                var $input = $(this).parent().find('input');
                var val = $input.val();
                if ($input.attr('data-value') !== $input.val()) {
                    $input.attr('data-value', val);
                }
                if (_item.hasClass('isOwned')) {
                    _item.addClass('pending');
                    Bg.updateOwnedCoin(c.coin_code, val).then(function () {
                        _item.removeClass('pending editing');
                    }).catch(function () {
                        _item.removeClass('pending');
                    });

                } else {
                    Bg.updateOwnedCoin(c.coin_code, val).then(function () {
                        _item.removeClass('pending editing');
                    }).catch(function () {
                        _item.removeClass('pending');
                    });

                }

                _item.addClass('isOwned');

            });

            _item.find('.add-btn').on('click', function () {
                var $this = $(this);
                isSignIn().then(function (cookie) {
                    if (cookie) {
                        $this.parents('.list-item').addClass('editing');
                        setTimeout(function () {
                            $this.next('.add-input').find('input').focus().on('blur', function () {
                                if ($(this).val().trim() === '') {

                                    $this.parents('.list-item').removeClass('editing');
                                }
                            });
                        }, 100);
                    } else {
                        openSideArea('sign-in');
                        return;
                    }
                });
            });

            _item.find('.action-area').on('click', function () {
                var $this = $(this);
                event.preventDefault()
                event.stopPropagation()
                isSignIn().then(function (cookie) {
                    if (cookie) {
                        if ($this.find('.watch').length) {
                            var elem = $this.find('.watch');
                        }

                        if ($this.find('.watched').length) {
                            var elem = $this.find('.watched');
                        }

                        if ($(elem).hasClass('watch')) {
                            $(elem).removeClass('watch').addClass('watched');
                            watchCoin(c.coin_code);
                            showNotify('Added to Watchlist!')
                        } else {
                            $(elem).removeClass('watched').addClass('watch');
                            unWatchCoin(c.coin_code);
                            showNotify('Remove from Watchlist!')
                        }
                        setTimeout(function () {
                            _item.removeClass('active');
                        }, 200);
                    } else {
                        openSideArea('sign-in');
                        return;
                    }

                });

            });

            if (Bg.rQuotations[c.coin_code]) {
                graph.push(c.coin_code);
            } else {
                noGraph.push(c.coin_code);
            }


            _item.appendTo(tmpDiv);

        });

        tmpDiv.appendTo($container);

        setTimeout(function () {
            drawGraph(graph, '#all-coins-area');
        }, 500);

        Bg.loadRecentQuotations(noGraph, '#all-coins-area');

        // if (Bg.rQuotation[c.coin_code]) {
        //     drawGraph(c.coin_code);
        // }
        // coins.forEach(function (c) {
        //     var containerDiv = $('#all-coins-area').find('.graph-div[data-coin-code=' + c.coin_code + ']')[0];
        //     var chart = echarts.init(containerDiv);
        //
        //     var option = {
        //         grid: {
        //             left: 0,
        //             top: 0,
        //             bottom: 0,
        //             right: 0
        //         },
        //         xAxis: {
        //             show: false,
        //             boundaryGap: false,
        //             data: c.graphData.xData,
        //             type: 'category'
        //         },
        //
        //         yAxis: {
        //             show: false,
        //             boundaryGap: false,
        //             scale: true
        //         },
        //         series: {
        //             symbol: 'none',
        //             type: 'line',
        //             data: c.graphData.yData,
        //             clipOverflow: false,
        //             itemStyle: {
        //                 normal: {
        //                     lineStyle: {
        //                         color: '#14D4AE',
        //                         width: 1
        //                     }
        //                 }
        //             }
        //         }
        //     };
        //
        //     chart.setOption(option);
        //
        //
        // });

        isAllCoinsInited = true;
    }

}

function watchCoin(coinCode) {
    Bg.watchCoin(coinCode);
}

function unWatchCoin(coinCode) {
    Bg.unWatchCoin(coinCode);
}

function updateOwnedCoin(coinCode, value) {
    Bg.updateOwnedCoin(coinCode, value);
}

function reBuildWatchList() {
    if (isMyCoinsInited) {
        var watchItems = Bg.myCoins.watchList.map(function (t) {
            return Bg.allCoinsHash[t];
        });

        buildWatchList(watchItems);
    }
}

function switchTab(where) {
    $('.tab-area').hide();
    $('.switch-item').removeClass('active');
    $('.switch-item[data-tab=' + where + ']').addClass('active');
    $('#' + where + '-area').show();

    if (where === 'my-coins') {
        initMyCoins();
    } else if (where === 'all-coins') {
        initAllCoins();
    }

    localStorage['tab-area'] = where;
    currentTab = where;
}


function initAllCoins() {
    if (isAllCoinsInited) {
        return;
    }
    var coins = Bg.getData();
    buildList(coins);

    // search input interaction
    $('#search-all-coins').on('input propertychange keyup', function () {
        var val = $(this).val().toLowerCase().trim();
        searchAllCoin(val);
        // $('#list-container').find('.list-item').each(function () {
        //     if ($(this).find('.name').text().toLowerCase().indexOf(val) === -1 && $(this).find('.symbol').text().toLowerCase().indexOf(val) === -1) {
        //         $(this).hide();
        //     } else {
        //         $(this).show();
        //     }
        // });

    });

    // detect scroll to bottom
    $('#list-container').on('scroll', function (e) {
        var $this = $(this);
        if ($this.hasClass('loading')) {
            return;
        }
        if ($this.scrollTop() + $this.height() >= $this[0].scrollHeight) {
            if (searchStatus.keyword) {
                var _coins = Bg.getData({keyword: searchStatus.keyword, page: searchStatus.page + 1});
                if (_coins.length) {
                    buildList(_coins, true);
                    searchStatus.page++;
                }
            } else {
                var _coins = Bg.getData({keyword: '', page: allCoinCurrentPage + 1});
                if (_coins.length) {
                    buildList(_coins, true);
                    allCoinCurrentPage++;
                }
            }
            // if (_coins === []) {
            //     var loadingTmp = getTmp('item-loading-tmp');
            //     Bg.loadMoreCoins().then(function (res) {
            //         $this.find('.item-loading').remove();
            //         $this.removeClass('loading');
            //         buildList(res);
            //     });
            // } else {
            //     allCoinCurrentPage++;
            //     buildList(_coins, true);
            // }
        }

    })


}


function initMyCoins() {

    // bind Events
    if (!isMyCoinsInited) {
        $('.graph-switch-item').on('click', function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            if (portfolioChart) {
                var type = $(this).attr('data-type');
                portfolioChart.showLoading({
                    text: '',
                    color: '#14D4AE',
                    zlevel: 1
                });
                if (Bg.myCoins.portfolio[type]) {
                    portfolioChart.hideLoading();
                    drawPortfolio(Bg.myCoins.portfolio[type], type);
                } else {
                    Bg.loadPortfolio(type).then(function (p) {
                        portfolioChart.hideLoading();
                        if (Bg.myCoins.portfolio[type].portfolios && Bg.myCoins.portfolio[type].portfolios.length) {
                            drawPortfolio(Bg.myCoins.portfolio[type], type);
                        }
                    });
                }

            }
        });

        $('.add-to-list-btn').on('click', function () {
            openSideArea('add');
            var coins = Bg.getData();
            buildAddList(coins);
        });

        $('#manage-btn').on('click', function () {

            if (!Bg.myCoins.initHoldings) {
                $('#guide').show();
                $('#manage-main').hide();
                restoreGuide();
            } else {
                $('#guide').hide();
                $('#manage-main').show();
            }
            openSideArea('manage');

        });


        isMyCoinsInited = true;
    }
    if (!Bg.allCoins) {
        console.log("1");
        return;
    }

    if (!Bg.myCoins) {
        console.log("2");
        return;
    }


    buildMyCoins();


}

function restoreGuide() {
    $('#guide-invest').val(localStorage['guide-invest']);
    $('#guide-cash-out').val(localStorage['guide-cash-out']);
    $('#guide').attr('data-step', localStorage['guide-step']);

    if (localStorage['init_coins']) {
        var initCoins = JSON.parse(localStorage['init_coins']);
        $('.guide-add-coin-container').empty();
        for (var i = 0; i < initCoins.length; i++) {
            var coin = initCoins[i];
            var volume = coin.volume;
            var item = $(getTmp('guide-add-coin-item-tmp')).find('.full-name').text('(' + coin.description + ')').end()
                .find('.symbol').text(coin.text).end()
                .find('.num').text(volume).end()
                .attr('data-coin-code', coin.id)
                .attr('data-volume', volume);

            item.prependTo($('.guide-add-coin-container'));
        }
    }
}

function buildCapitalHistory() {
    $('#invest-value').text('$' + Bg.myCoins.capital.total_in);
    $('#cash-out-value').text('$' + Bg.myCoins.capital.total_out);
    var $container = $('#capital-history-container');
    $container.empty();
    var tmp = getTmp('capital-history-item-tmp');
    var history = Bg.myCoins.capital.history;

    var tmpDiv = $('<div></div>');

    history.forEach(function (h) {
        var item = $(tmp).find('.type').text(h.transfer == 'In' ? 'Invest' : 'Cash out').end()
            .find('.amount').text(h.amount).end()
            .find('.time').text(moment(h.datetime).format('YYYY-MM-DD')).end();

        item.appendTo(tmpDiv);
    });

    tmpDiv.appendTo($container);


}

function buildWatchList(coins) {
    var $container = $('.watchlist-container');

    $container.empty();
    if (coins.length === 0) {
        var noItemTmp = getTmp('no-item-tmp');
        $container.append($(noItemTmp).text('No watch coins yet!'));
        return;
    }
    var tmp = getTmp('watch-coin-item-tmp');
    var tmpDiv = $('<div>');

    var noGraph = [];
    var graph = [];
    coins.forEach(function (c) {
        var _item = $(tmp).find('.full-name').text(c.name).end()
            .find('img').attr('src', "/images/coin-icons/" + c.name + ".svg").attr('name', c.name).end()
            .find('.symbol').text(c.symbol).end()
            .find('.price').text('$' + formatPrice(c.price_usd)).end()
            .find('.market-cap').text('$' + fnum(c['market_cap_usd'])).end()
            .find('.change').text(c['percent_change_24h'] + "%").end()
            .find('.graph-div').attr('data-coin-code', c.coin_code).attr('change', c['percent_change_24h']).end();

        _item.find('img').on('error', function () {
            if ($(this).attr('png') === '') {
                var name = $(this).attr('name');
                $(this).attr('src', '/images/' + name + '.png').attr('png', 'true');
            } else {
                $(this).attr('src', '/images/icon_coin_default@2x.png');
            }
        });

        if (c['percent_change_24h'] < 0) {
            _item.find('.change').addClass('down');
        }
        _item.find('.action-toggle-btn').on('click', function () {
            $(this).parents('.list-item').toggleClass('active').removeClass('editing');
        });


        _item.find('.remove').on('click', function () {
            _item.remove();
            unWatchCoin(c.coin_code);
        });


        if (Bg.rQuotations[c.coin_code]) {
            graph.push(c.coin_code);
        } else {
            noGraph.push(c.coin_code);
        }

        _item.appendTo(tmpDiv);
        // for test

    });


    tmpDiv.appendTo($('.watchlist-container'));

    setTimeout(function () {
        drawGraph(graph, '#my-coins-area');
    }, 500);

    Bg.loadRecentQuotations(noGraph, '#my-coins-area');
}

function buildOwnedCoins(coins) {
    var $container = $('.owned-coin-container');
    var _$container = $('#manage-coin-container');

    $container.empty();
    _$container.empty();
    if (coins.length === 0) {
        var noItemTmp = getTmp('no-item-tmp');
        $container.append($(noItemTmp).text('No owned coins yet!'));
        return;
    }
    var tmp = getTmp('owned-coin-item-tmp');
    var tmp2 = getTmp('manage-list-item-tmp');
    var tmpDiv = $('<div>');
    var tmpDiv2 = $('<div>');


    var noGraph = [];
    var graph = [];
    coins.forEach(function (c) {
        var _item = $(tmp).find('.full-name').text(c.coin_name).end()
            .find('img').attr('src', "/images/coin-icons/" + c.coin_name + ".svg").attr('name', c.coin_name).end()
            .find('.symbol').text(c.symbol).end()
            .find('.price').text('$' + formatPrice(c.price_usd)).end()
            .find('.num').text(c.volume).end()
            .find('.total-value').text('$' + c['equity']).end()
            .find('.graph-div').attr('data-coin-code', c.coin_code).attr('change', c['percent_change_24h']).end()
            .find('.change').text(c['percent_change_24h'] + "%").end();


        var _item_ma = $(tmp2).find('.full-name').text(c.coin_name).end()
            .find('img').attr('src', "/images/coin-icons/" + c.coin_name + ".svg").attr('name', c.coin_name).end()
            .find('.symbol').text(c.symbol).end()
            .find('.price').text('$' + formatPrice(c.price_usd)).end()
            .find('.num').text(c.volume).end();

        _item_ma.find('.edit').on('click', function () {
            $('#edit-coin-save').attr('data-code', c.coin_code);
            $('#edit-coin-name').text(c.coin_name);
            $('#edit-input').val(c.volume).attr('data-val', c.volume);
            openModal('edit-coin');
            setTimeout(function () {
                $('#edit-input').focus();
            }, 200)
        });

        _item_ma.find('.remove').on('click', function () {

        });

        _item.find('.add-input').find('input').on('focus', function () {
            _item.addClass('editing');
        });


        if (c['percent_change_24h'] < 0) {
            _item.find('.change').addClass('down');
        }

        _item.find('img').on('error', function () {
            if ($(this).attr('png') === '') {
                var name = $(this).attr('name');
                $(this).attr('src', '/images/' + name + '.png').attr('png', 'true');
            } else {
                $(this).attr('src', '/images/icon_coin_default@2x.png');
            }
        });

        _item.find('.add-input-cancel-btn').on('click', function () {
            _item.removeClass('editing');
            var $input = $(this).parent().find('input');
            if ($input.attr('data-value') !== $input.val()) {
                $input.val($input.attr('data-value'));
            }
        });


        _item.find('.add-input-btn').on('click', function () {
            var $input = $(this).parent().find('input');
            var val = $input.val();
            if ($input.attr('data-value') !== $input.val()) {
                $input.attr('data-value', val);
            }
            if (_item.hasClass('isOwned')) {
                _item.addClass('pending');
                Bg.updateOwnedCoin(c.coin_code, val).then(function () {
                    _item.removeClass('pending editing');

                    var _c = Bg.myCoins.holdingsHash[c.coin_code];
                    console.log(_c.volume);
                    _item.find('.num').text(_c.volume).end()
                        .find('.total-value').text(_c['equity']).end()

                }).catch(function () {
                    _item.removeClass('pending');
                });
            } else {
                Bg.updateOwnedCoin(c.coin_code, val).then(function () {
                    _item.removeClass('pending editing');
                }).catch(function () {
                    _item.removeClass('pending');
                });
            }

            _item.addClass('isOwned');

        });

        _item.find('.remove').on('click', function () {

            Bg.updateOwnedCoin(c.coin_code, 0).then(function () {
                _item.remove();
            }).catch(function () {

            });
        });

        _item.find('.action-toggle-btn').on('click', function () {
            $(this).parents('.list-item').toggleClass('active').removeClass('editing isOwned');
            if (_item.hasClass('active')) {
                _item.find('input').attr('data-value', Bg.myCoins.holdingsHash[c.coin_code].volume).val(Bg.myCoins.holdingsHash[c.coin_code].volume);
                _item.addClass('isOwned');
            }
        });

        if (Bg.rQuotations[c.coin_code]) {
            graph.push(c.coin_code);
        } else {
            noGraph.push(c.coin_code);
        }
        _item.appendTo($container);
        _item_ma.appendTo(_$container);

    });


    setTimeout(function () {
        drawGraph(graph, '#my-coins-area');
    }, 500);

    Bg.loadRecentQuotations(noGraph, '#my-coins-area');
}

function changeTotalValue(value, change, time) {
    var _v = fnum(value);
    var $total = $('#total');
    var $num = $total.find('.total-num');
    var $change = $total.find('.change');
    var $time = $total.find('.time');
    $num.text('US $' + _v);

    if (change === '') {
        $change.text('');
    } else if (change >= 0) {
        $change.removeClass('down');
        $change.text('+' + change + '%');
    } else if (change < 0) {
        $change.addClass('down');
        $change.text(change + '%');
    }

    if (time) {
        $time.text(time);
    }

}

function buildAddList(coins, isAppend) {
    var $container = $('.item-container');
    var tmp = getTmp('add-coin-item-tmp');
    if (!isAppend) {
        $container.empty();
    }
    if (coins === null) {
        var tmp = getTmp('loading-tmp');
        $(tmp).appendTo($container);
        return;
    }


    var tmpDiv = $('<div>');
    coins.forEach(function (c) {
        var _item = $(tmp).find('.full-name').text(c.name).end()
            .find('img').attr('src', "/images/coin-icons/" + c.name + ".svg").attr('name', c.name).end()
            .find('.symbol').text(c.symbol).end()
            .find('.price').text('$' + c.price_usd).end();

        _item.find('img').on('error', function () {
            if ($(this).attr('png') === '') {
                var name = $(this).attr('name');
                $(this).attr('src', '/images/' + name + '.png').attr('png', 'true');
            } else {
                $(this).attr('src', '/images/icon_coin_default@2x.png');
            }
        });

        _item.find('.add-btn').on('click', function () {
            var $this = $(this);
            $(this).parents('.list-item').addClass('editing');
            setTimeout(function () {
                $this.next('.add-input').find('input').focus().on('blur', function () {
                    console.log($(this).val().trim() === '')
                    if ($(this).val().trim() === '') {

                        $this.parents('.list-item').removeClass('editing');
                    }
                });
            }, 100);
        });

        _item.find('.show-num').on('click', function () {
            var $this = $(this);
            $(this).parent().removeClass('owned').find('.add-input').find('input').val($(this).text());
            $(this).parents('.list-item').addClass('editing');

            setTimeout(function () {
                $this.parent().find('.add-input').find('input').focus();
            }, 100);

        });


        _item.find('.add-input-cancel-btn').on('click', function () {
            _item.removeClass('editing');
            var $input = $(this).parent().find('input');
            if ($input.attr('data-value') !== $input.val()) {
                $input.val($input.attr('data-value'));
            }
        });


        _item.find('.add-input-btn').on('click', function () {
            var $input = $(this).parent().find('input');
            var val = $input.val();
            if ($input.attr('data-value') !== $input.val()) {
                $input.attr('data-value', val);
            }
            if (_item.hasClass('isOwned')) {
                _item.addClass('pending');
                Bg.updateOwnedCoin(c.coin_code, val).then(function () {
                    _item.removeClass('pending editing');
                }).catch(function () {
                    _item.removeClass('pending');
                });
            } else {
                Bg.updateOwnedCoin(c.coin_code, val).then(function () {
                    _item.removeClass('pending editing');
                }).catch(function () {
                    _item.removeClass('pending');
                });
            }

            _item.addClass('isOwned');

        });
        _item.appendTo(tmpDiv);

    });

    tmpDiv.appendTo($container);


}

function searchAllCoin(keyword) {
    searchStatus.keyword = keyword;
    if (keyword === '') {
        searchStatus.page = 1;
    }
    var coins = Bg.getData({keyword: keyword, page: 1});
    buildList(coins);
}

function searchAddCoin(keyword) {
    addSearchStatus.keyword = keyword;
    if (keyword === '') {
        addSearchStatus.page = 1;
    }
    var coins = Bg.getData({keyword: keyword, page: 1});
    buildAddList(coins);
}

function buildMyList() {
    var $container = $('.owned-coin-container');
    var tmp = getTmp('owned-coin-item-tmp');
    var tmp2 = getTmp('watch-coin-item-tmp');

    var _coins = Bg.allCoins.slice(0, 5);
    var _coins2 = Bg.allCoins.slice(5, 10);
    var coins = _coins.concat(_coins2);

    console.log(_coins, tmp)

    _coins.forEach(function (c) {
        var _item = $(tmp).find('.full-name').text(c.name).end()
            .find('img').attr('src', "/images/coin-icons/" + c.name + ".svg").attr('name', c.name).end()
            .find('.symbol').text(c.symbol).end()
            .find('.price').text('$2345').end()
            .find('.num').text(Math.random().toFixed(2)).end()
            .find('.total-value').text('$12890').end()
            .find('.graph-div').attr('data-coin-code', c.coin_code).end()
            .find('.change').text('-0.2%').end()
            .find('.coin-value').text('$6470').end();
        console.log(_item);

        _item.find('img').on('error', function () {
            if ($(this).attr('png') === '') {
                var name = $(this).attr('name');
                $(this).attr('src', '/images/' + name + '.png').attr('png', 'true');
            } else {
                $(this).attr('src', '/images/icon_coin_default@2x.png');
            }
        });

        _item.find('.action-toggle-btn').on('click', function () {
            $(this).parents('.list-item').toggleClass('active').removeClass('editing');
        });
        _item.appendTo($container);

    });
// for test
    _coins2.forEach(function (c) {
        var _item = $(tmp2).find('.full-name').text(c.name).end()
            .find('img').attr('src', "/images/coin-icons/" + c.name + ".svg").attr('name', c.name).end()
            .find('.symbol').text(c.symbol).end()
            .find('.price').text('$2345').end()
            .find('.total-value').text('$12890').end()
            .find('.num').text(Math.random().toFixed(2)).end()
            .find('.graph-div').attr('data-coin-code', c.coin_code).end()
            .find('.change').text('-0.2%').end()
            .find('.coin-value').text('$6470').end();
        console.log(_item);

        _item.find('img').on('error', function () {
            if ($(this).attr('png') === '') {
                var name = $(this).attr('name');
                $(this).attr('src', '/images/' + name + '.png').attr('png', 'true');
            } else {
                $(this).attr('src', '/images/icon_coin_default@2x.png');
            }
        });
        _item.find('.action-toggle-btn').on('click', function () {
            $(this).parents('.list-item').toggleClass('active').removeClass('editing');
        });
        // for test
        _item.appendTo($('.watchlist-container'));

    });
    console.log('here');


    coins.forEach(function (c) {
        var containerDiv = $('#my-coins-area').find('.graph-div[data-coin-code=' + c.coin_code + ']')[0];
        var chart = echarts.init(containerDiv);

        var option = {
            grid: {
                left: 0,
                top: 0,
                bottom: 0,
                right: 0
            },
            xAxis: {
                show: false,
                boundaryGap: false,
                data: c.graphData.xData,
                type: 'category'
            },

            yAxis: {
                show: false,
                boundaryGap: false,
                scale: true
            },
            series: {
                symbol: 'none',
                type: 'line',
                data: c.graphData.yData,
                clipOverflow: false,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#14D4AE',
                            width: 1
                        }
                    }
                }
            }
        };

        chart.setOption(option);


    });
}

function openSideArea(which) {
    $('#container-inner').addClass('side-open').find('.side-area').addClass(which + '-open');
}

function closeSideArea() {
    $('.side-area').removeClass('add-open sign-in-open sign-up-open');
    $('#container-inner').removeClass('side-open add-open sign-in-open sign-up-open');
    $('.tip-box').hide();
}

function initCountryInput(id, countries, iso2) {
    var $select = $('#' + id);
    var $container = $select.find('.suggestion-box-normal');
    var $pContainer = $select.find('.suggestion-box-prior');
    var cHash = {};

    for (var i = 0; i < countries.length; i++) {
        cHash[countries[i].iso2] = countries[i];
    }


    var pCountries = ['US', "CN", "JP", "KR", "GB"];

    pCountries.forEach(function (cName) {
        console.log(cName);

        var c = cHash[cName];

        var tmp = getTmp('country-code-item-tmp');

        var cItem = $(tmp).find('.country-name').text(c.name).attr('title', c.name).prepend('<img src="' + c['flag_32'] + '"/>').end()
            .find('.country-num').text("+" + c.prefix.trim()).end().attr('data-code', c.prefix).attr('data-iso2', c.iso2);

        cItem.on('mousedown', function (e) {
            console.log('mousedown');
            e.preventDefault();
            e.stopPropagation();
            $(this).parents('.form-input').find('label').empty().append('<img src="' + c['flag_32'] + '"/>').append('<span>+' + c.prefix + '</span>').attr('data-code', c.prefix);
            $(this).parents('.form-input').find('b');
            $(this).parents('.form-input').find('.phone-code').val('+' + $(this).find('.country-num').text()).blur();
            localStorage['lastSelectPhoneCode'] = $(this).attr('data-code');
            localStorage['lastSelectIso2'] = $(this).attr('data-iso2');
            $(this).parents('.form-input').removeClass('expand');
        });

        cItem.appendTo($pContainer);
    });


    countries.forEach(function (c) {
        if (c.prefix === null) {
            return;
        }

        var pCountries = ['US', "CN", "JP", "KP", "UK"];


        var tmp = getTmp('country-code-item-tmp');

        var cItem = $(tmp).find('.country-name').text(c.name).attr('title', c.name).prepend('<img src="' + c['flag_32'] + '"/>').end()
            .find('.country-num').text("+" + c.prefix.trim()).end().attr('data-code', c.prefix).attr('data-iso2', c.iso2);

        cItem.on('mousedown', function (e) {
            console.log('mousedown');
            e.preventDefault();
            e.stopPropagation();
            $(this).parents('.form-input').find('label').empty().append('<img src="' + c['flag_32'] + '"/>').append('<span>+' + c.prefix + '</span>').attr('data-code', c.prefix);
            $(this).parents('.form-input').find('b');
            $(this).parents('.form-input').find('.phone-code').val('+' + $(this).find('.country-num').text()).blur();
            localStorage['lastSelectPhoneCode'] = $(this).attr('data-code');
            localStorage['lastSelectIso2'] = $(this).attr('data-iso2');
            $(this).parents('.form-input').removeClass('expand');
        });

        if (c.iso2 === 'US' || c.prefix === '86' || c.prefix === '81' || c.prefix === '82' || c.prefix === '44') {
            // return;
        } else {
            cItem.appendTo($container);
        }

    });

    if (localStorage['lastSelectIso2']) {
        var initCode = localStorage['lastSelectIso2'];
        $select.find('.country-code-item[data-iso2=' + initCode + ']').trigger('mousedown');
    } else {
        console.log(iso2);
        if (iso2) {
            $select.find('.country-code-item[data-iso2=' + iso2 + ']').trigger('mousedown');
        }
    }

    $container.find('.country-code-item[data-iso2=' + localStorage['lastSelectIso2'] + ']').trigger('mousedown');

    $select.find('.phone-code-wrapper').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).find('input').focus();
        $(this).parents('.form-input').addClass('expand');
    });


    $select.find('.phone-code-input').on('keydown', function (e) {
        var charStr = String.fromCharCode(e.keyCode);
        if (/[a-z]/i.test(charStr)) {
            $container.find('.country-code-item').each(function () {
                if ($(this).find('.country-name').text().indexOf(charStr) === 0) {
                    var top = $(this).position().top + $container.scrollTop();
                    console.log($(this).find('.country-name').text(), top);
                    $container.scrollTop(top);
                    return false;
                }
            });
        }
    });
}

function initCountryCodeSelect() {

    Bg.loadCountries().then(function (c) {
        var countries = c.countries;
        var iso2 = c.iso2_country;

        initCountryInput('sign-in-phone-number-input', countries, iso2);
        initCountryInput('sign-up-phone-number-input', countries, iso2);

    }).catch(function (error) {
        console.log(error);
    });


    $('#phone-input, #password-input').on('input', function () {
        if ($('#phone-input').val() !== '' && $('#password-input').val() !== '') {
            $('#sign-in').removeClass('disabled');
        } else {
            $('#sign-in').addClass('disabled');
        }
    });

    $('.show-password').on('click', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).prev('input').attr('type', 'password');
        } else {
            $(this).addClass('active');
            $(this).prev('input').attr('type', 'text');
        }
    });

    $(document).on('click', function () {
        $('.form-input').removeClass('expand');
    })

}

function showSignInTip(msg) {
    $('.login-area').find('.tip-box').show().text(msg);
}

function showSignUpTip(msg) {
    $('.sign-up-area').find('.tip-box').show().text(msg);
}

function initSignIn() {
    initCountryCodeSelect();

    $('.back').on('click', function () {
        closeSideArea();
    });

    $('#sign-in').on('click', function () {
        var $this = $(this);
        var psd = $('#password-input').val();
        var phoneCode = $('#sign-in-phone-code-label').attr('data-code');
        var phone = '+' + phoneCode + $('#phone-input').val();
        if (phone.trim() === '') {
            showSignInTip("Phone number can't be empty!");
        } else if (psd.trim() === '') {
            showSignInTip("Password can't be empty!");
        } else if (phoneCode.trim() === '') {
            showSignInTip("County code can't be empty!");
        }
        $(this).addClass('disabled').text('Log In...');
        Bg.signIn({
            user: {
                login: phone,
                password: psd,
                country: phoneCode
            }
        }).then(function (data) {

            // set Cookie
            Promise.all([
                setCookie('token', data.authentication_token),
                setCookie('login', data.username),
                setCookie('nickname', data.nickname)
            ]).then(function () {
                refreshTabs();
                $this.removeClass('disabled').text('Log In');
                // localStorage['token'] = data.authentication_token;
                // localStorage['username'] = data.username;
                localStorage['nickname'] = data.nickname;
                localStorage['user_id'] = data.user_id;
                localStorage['email'] = data.email;
                $('#username').text(data.nickname);
                $('.sign-in-area').hide();
                $('.user-area').show();
                Bg.initData();
                closeSideArea();
            });
        }, function (msg) {
            if (typeof msg === 'string') {
                showSignInTip(msg);
            }
            $this.removeClass('disabled').text('Log In');
        }).catch(function (err) {
            console.log(err);
        });
    });
}

function initSignUp() {
    $('#secure-code-send').on('click', function () {
        var _phone = $('#sign-up-phone-input').val();
        var code = $('#sign-up-phone-code-label').attr('data-code');
        if (!_phone || !code) {
            return;
        }
        var phone = "+" + code + _phone;

        Bg.requestSMS({
            phone: phone,
            country: code
        }).then(function (data) {
            var sms = data.sms;
            $('#secure-code-input').attr('data-sms', sms);
        }, function (reason) {
            showSignUpTip(reason);
            endSecureTimeout();
        }).catch(function (reason) {
            showSignUpTip(reason);
            endSecureTimeout();
        });
        beginSecureTimeout();

    });

    $('#sign-up-form').find('input').on('input', function () {
        var nickname = $('#sign-up-username').val();
        var phone = "+" + $('#sign-up-phone-code-label').attr('data-code') + $('#sign-up-phone-input').val();
        var secureCode = $('#secure-code-input').val();
        var password = $('#sign-up-password-input').val();
        var sms = $('#secure-code-input').attr('data-sms');
        if (nickname !== '' && phone !== '' && secureCode !== '' && password !== '') {
            $('#sign-up').removeClass('disabled');
        } else {
            $('#sign-up').addClass('disabled');
        }
    });

    $('#sign-up').on('click', function () {
        var $this = $(this);
        var nickname = $('#sign-up-username').val();
        var phone = "+" + $('#sign-up-phone-code-label').attr('data-code') + $('#sign-up-phone-input').val();
        var secureCode = $('#secure-code-input').val();
        var password = $('#sign-up-password-input').val();
        var sms = $('#secure-code-input').attr('data-sms');

        if (phone.trim() === '') {
            showSignUpTip("Phone number can't be empty!");
        } else if (password.trim() === '') {
            showSignUpTip("Password can't be empty!");
        } else if (secureCode.trim() === '') {
            showSignIUpTip("Secure code can't be empty!");
        } else if (nickname.trim() === '') {
            showSignUpTip("Nickname code can't be empty!");
        }

        console.log({
            phone: phone,
            password: password,
            sms: sms,
            sms_pin: secureCode,
            nickname: nickname
        });
        $this.addClass('disabled').text('Sign Up...');
        Bg.signUp({
            user: {
                phone: phone,
                password: password,
                sms: sms,
                sms_pin: secureCode,
                nickname: nickname,
                country: $('#sign-up-phone-code-label').attr('data-code')
            }
        }).then(function (data) {

            // set Cookie
            Promise.all([
                setCookie('token', data.authentication_token),
                setCookie('login', data.username),
                setCookie('nickname', data.nickname)
            ]).then(function () {
                refreshTabs();
                $this.removeClass('disabled').text('Sign Up');
                // localStorage['token'] = data.authentication_token;
                // localStorage['username'] = data.username;
                localStorage['nickname'] = data.nickname;
                localStorage['user_id'] = data.user_id;
                localStorage['email'] = data.email;
                $('#username').text(data.nickname);
                $('.sign-in-area').hide();
                $('.user-area').show();
                Bg.initData();
                closeSideArea();
            });
    }, function (reason) {
        $this.removeClass('disabled').text('Sign Up');
        if (typeof reason === 'string') {
            showSignUpTip(reason);
        }
    })
        .catch(function (reason) {
            $this.removeClass('disabled').text('Sign Up');
            if (typeof reason === 'string') {
                showSignUpTip(reason);
            }
        })
}

)
;
}

function beginSecureTimeout() {
    $('#secure-code-send').hide();
    $('#secure-time-count').show();
    var count = 60;
    secureCodeInterval = setInterval(function () {
        $('#secure-time-count').text(count + 's');
        count--;
        if (count === 0) {
            clearInterval(interval);
            $('#secure-code-send').show();
            $('#secure-time-count').hide();
        }
    }, 1000)
}

function endSecureTimeout() {
    $('#secure-code-send').show();
    $('#secure-time-count').hide();

    clearInterval(secureCodeInterval);
}

function init() {
    isSignIn().then(function (cookie) {
        if (cookie) {
            $('.sign-in-area').hide();
            $('.user-area').show();
            $('#username').text(localStorage['nickname']);
            switchTab(localStorage['tab-area'] || 'all-coins');
        } else {
            $('.sign-in-area').show();
            $('.user-area').hide();
            switchTab('all-coins');
        }
    });
    $('.switch-item').on('click', function () {
        var where = $(this).attr('data-tab');
        if (where === 'my-coins') {
            isSignIn().then(function (cookie) {
                if (cookie) {
                    switchTab(where);
                } else {
                    openSideArea('sign-in');
                    return;
                }
            });
        } else {
            switchTab(where);
        }
    });

    $('#sign-in-btn').on('click', function () {
        openSideArea('sign-in');
    });


    $('#sign-up-btn').on('click', function () {
        openSideArea('sign-up');
    });
    $('.search-bar').on('click', function () {
        $(this).find('input').focus();
    });

    $('.search-bar').find('input').on('focus', function () {
        $(this).parent().addClass('active');
    }).on('blur', function () {
        if ($(this).val().trim() === '') {
            $(this).parent().removeClass('active');
        }
    });

    $('#feedback-btn').on('click', function () {
        chrome.tabs.create({url: 'https://mail.google.com/mail/?view=cm&fs=1&to=care@coinbag.com'});
    });

    $('#username').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).parent().addClass('active');
    });

    $('#sign-out').on('click', function () {
        Bg.signOut();
        $('.sign-in-area').show();
        $('.user-area').hide();
        switchTab('all-coins');
    });

    $(document).on('click', function () {
        $('.user-area').removeClass('active');
    });

    $('#modal-close').on('click', function () {
        closeModal();
    });

    initItemClick();

    initSignIn();
    initSignUp();
    initManage();

    initAddList();
    // openSideArea('manage');
}

function buildMyCoins() {
    $('#my-coins-area').find('.loading').show();
    var watchItems = Bg.myCoins.watchList.map(function (t) {
        return Bg.allCoinsHash[t];
    });

    var ownedCoins = Bg.myCoins.holdings;

    buildWatchList(watchItems);
    buildOwnedCoins(ownedCoins);
    buildCapitalHistory();


    if (false) {
        $('#guide').show();
    }
    $('#my-coins-area').find('.loading').hide();
    if (Bg.myCoins.portfolio['24h'].portfolios && Bg.myCoins.portfolio['24h'].portfolios.length) {
        drawPortfolio(Bg.myCoins.portfolio['24h'], '24h');

    } else {
        $('#total').addClass('empty').text('$0');
    }
}

function formatChange(change) {
    if (change < 0.01) {
        return change.toPrecision(2);
    } else {
        return change.toFixed(2);
    }
}

function drawPortfolio(portfolio, type) {
    var _por = portfolio.portfolios;
    var change = portfolio.change;
    var asset = portfolio.asset;
    if (!_por.length) {
        return;
    }
    var lastP = _por[_por.length - 1].p;
    var firstP = _por[0].p;

    var color = change > 0 ? '#14D4AE' : '#FF527D';

    var timeText = ' ';
    switch (type) {
        case '24h':
            timeText = 'Past Day';
            break;
        case '7d':
            timeText = 'past week';
            break;
        case '1m':
            timeText = 'past month';
            break;
        case '3m':
            timeText = 'past 3 month';
            break;
        case '1y':
            timeText = 'past year';
            break;


    }

    $('#total').attr('data-time-text', timeText);
    $('#total').attr('data-change', change);
    $('#total').attr('data-asset', asset);


    changeTotalValue(asset, change, timeText);
    $('#total-asset').text('US$' + fnum(asset));
    var graphData = {
        xData: [],
        yData: []
    };

    _por.forEach(function (t) {
        graphData.xData.push(moment(new Date(t.at)).format('YYYY-MM-DD hh:mm'));
        if (t.p === 0) {
            graphData.yData.push('-');
        } else {
            graphData.yData.push(t.p);
        }
    });
    console.log(graphData)

    if (portfolioChart == null) {
        portfolioChart = echarts.init(document.getElementById('total-graph'));

        portfolioChart.on('globalout', function (params) {
            var timeText = $('#total').attr('data-time-text');
            var change = $('#total').attr('data-change');
            var asset = $('#total').attr('data-asset');
            changeTotalValue(asset, change, timeText);
        });
    }


    var option = {
        grid: {
            left: 5,
            top: 5,
            bottom: 5,
            right: 5
        },
        xAxis: {
            show: false,
            boundaryGap: false,
            data: graphData.xData,
            type: 'category'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
                // console.log("sdfsd",params, ticket);
                var currentP = params[0].value;
                var change = (currentP - firstP) / firstP * 100;
                var time = params[0].axisValue;
                console.log(currentP);
                if (currentP === '-' || typeof currentP === "undefined") {
                    changeTotalValue(asset, '', time);
                } else {
                    changeTotalValue(currentP, '', time);
                }
            }
        },

        yAxis: {
            show: false,
            boundaryGap: false,
            scale: true
        },
        series: {
            type: 'line',
            showSymbol: false,
            data: graphData.yData,
            clipOverflow: false,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: color
                    }
                }
            }
        }
    };

    portfolioChart.setOption(option);

}

function initManage() {
    $('.tab-list-item').on('click', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        var tab = $(this).attr('data-tab');
        $('.tab-item').removeClass('active');
        $('.tab-item[data-tab=' + tab + ']').addClass('active');
    });

    $('#init-portfolio-btn').on('click', function () {
        console.log('ddd');
        goToNextStep();
    });

    $('.next-btn').on('click', function () {
        goToNextStep();
    });
    $('.prev-btn').on('click', function () {
        goToPreviousStep();
    });

    $('#init-add-btn').on('click', function () {
        openModal('add-init-coin');
    });

    $('#transfer-time-input').datepicker({
        autoPick: true,
        autoHide: true,
        format: 'yyyy-mm-dd'
    });


    $('#add-manage-coin-btn').on('click', function () {
        openModal('add-manage-coin');
    });

    $('#add-cash').on('click', function () {
        openModal('add-transfer');
    });

    $('#guide-cash-out').on('input', function () {
        localStorage['guide-cash-out'] = $(this).val();
    });

    $('#guide-invest').on('input', function () {
        localStorage['guide-invest'] = $(this).val();
    });

    $('#edit-coin-save').on('click', function () {
        $this = $(this);
        var coin_code = $(this).attr('data-code');
        var amount = $('#edit-input').val();
        $(this).addClass('processing').text('Saving...');

        Bg.setHolding({
            coin_code: coin_code,
            amount: amount
        }).then(function () {
            buildOwnedCoins(Bg.myCoins.holdings);
            Bg.myCoins.portfolio = {};
            $('.graph-switch-item[data-type="24h"]').trigger('click');
            closeModal();
            $this.removeClass('processing').text('Save');
        }).catch(function (err) {
            console.log(err)
            $this.removeClass('processing').text('Save');
        });

    });

    $('#add-transfer-save').on('click', function () {
        $this = $(this);
        var transfer = $('input[type=radio][name=in-out]:checked').val();
        var amount = $('#transfer-amount-input').val();
        var time = new Date($('#transfer-time-input').datepicker('getDate')).getTime();

        $(this).addClass('processing').text('Saving...');
        Bg.addTransfer({
            transfer: transfer,
            amount: amount,
            time: time
        }).then(function (d) {
            buildCapitalHistory();
            $this.removeClass('processing').text('Save');
            closeModal();
        }).catch(function (reason) {
            console.log(reason);
            $this.removeClass('processing').text('Save');
        })
    });

    $('#add-init-save').on('click', function () {
        var coin = $('#add-init-coin-select').selectivity('data');
        var volume = $('#add-init-amount-input').val();
        var item = $(getTmp('guide-add-coin-item-tmp')).find('.full-name').text('(' + coin.description + ')').end()
            .find('.symbol').text(coin.text).end()
            .find('.num').text(volume).end()
            .attr('data-coin-code', coin.id)
            .attr('data-volume', volume);

        var coins = localStorage['init_coins'] ? JSON.parse(localStorage['init_coins']) : [];
        coin.volume = volume;
        coins.push(coin);

        localStorage['init_coins'] = JSON.stringify(coins);

        item.prependTo($('.guide-add-coin-container'));

        closeModal();

    });


    $('#add-manage-save').on('click', function () {
        var $this = $(this);
        var coin = $('#add-manage-coin-select').selectivity('data');
        var volume = $('#add-manage-amount-input').val();
        $this.addClass('processing').text('Add...');

        Bg.buy({
            coin_code: coin.id,
            volume: volume
        }).then(function () {
            buildOwnedCoins(Bg.myCoins.holdings);
            $this.removeClass('processing').text('Add');
        }).catch(function (err) {
            console.log(err);
            $this.removeClass('processing').text('Add');
        })

        closeModal();

    });

    $('#guide-finish').on('click', function () {
        var $this = $(this);
        var invest = $('#guide-invest').val();
        var out = $('#guide-cash-out').val();
        var coins = [];
        $('.guide-add-coin-container').find('.guide-add-coin-item').each(function (t) {
            coins.push({
                coin_code: $(this).attr('data-coin-code'),
                volume: $(this).attr('data-volume')
            });
        });
        $(this).addClass('processing').text('Saving...');
        Bg.setupAsset({
            coins: coins,
            capital: {
                in: invest,
                out: out
            }
        }).then(function () {
            Bg.refreshMycoinsData();
            Bg.myCoins.portfolio = {};
            $('.graph-switch-item[data-type="24h"]').trigger('click');
            switchTab('my-coins');
            closeSideArea();
            $this.removeClass('processing').text('Finish');
            Bg.myCoins.initHoldings = true;
            localStorage.removeItem('guide-cash-out');
            localStorage.removeItem('guide-invest');
            localStorage.removeItem('guide-step');
            localStorage.removeItem('init_coins');
        }).catch(function (err) {
            console.log(err);
            $this.removeClass('processing').text('Finish');
        });
    });
}

function goToNextStep() {
    var $guide = $('#guide');
    var currentStep = $guide.attr('data-step');
    var nextStep = parseInt(currentStep) + 1;
    $guide.attr('data-step', nextStep);
    localStorage['guide-step'] = nextStep;
}

function goToPreviousStep() {
    var $guide = $('#guide');
    var currentStep = $guide.attr('data-step');
    var prevStep = parseInt(currentStep) - 1;
    $guide.attr('data-step', prevStep);
    localStorage['guide-step'] = prevStep;
}

function initAddList() {
    var coins = Bg.getData();
    buildAddList(coins);


    $('#search-add-coins').on('input propertychange keyup', function () {
        var val = $(this).val().toLowerCase().trim();
        searchAddCoin(val);
        // $('#list-container').find('.list-item').each(function () {
        //     if ($(this).find('.name').text().toLowerCase().indexOf(val) === -1 && $(this).find('.symbol').text().toLowerCase().indexOf(val) === -1) {
        //         $(this).hide();
        //     } else {
        //         $(this).show();
        //     }
        // });

    });


    $('#item-container').on('scroll', function (e) {
        var $this = $(this);
        if ($this.hasClass('loading')) {
            return;
        }
        if ($this.scrollTop() + $this.height() >= $this[0].scrollHeight) {
            if (addSearchStatus.keyword) {
                var _coins = Bg.getData({keyword: addSearchStatus.keyword, page: addSearchStatus.page + 1});
                if (_coins.length) {
                    buildAddList(_coins, true);
                    addSearchStatus.page++;
                }
            } else {
                var _coins = Bg.getData({keyword: '', page: addCoinCurrentPage + 1});
                if (_coins.length) {
                    buildAddList(_coins, true);
                    addCoinCurrentPage++;
                }
            }
            // if (_coins === []) {
            //     var loadingTmp = getTmp('item-loading-tmp');
            //     Bg.loadMoreCoins().then(function (res) {
            //         $this.find('.item-loading').remove();
            //         $this.removeClass('loading');
            //         buildList(res);
            //     });
            // } else {
            //     allCoinCurrentPage++;
            //     buildList(_coins, true);
            // }
        }

    })
}


function initItemClick() {
    $('.main-area').on('click', '.list-item', function () {
        if ($(this).hasClass('list-header')) {
            return;
        }
        const code = $(this).find('.graph-div').attr('data-coin-code')
        window.open('https://www.coinbag.com/coin/' + code)
    })
}

init();

function drawGraph(codes, container) {
    var $container = $(container);
    for (var i = 0; i < codes.length; i++) {
        var c = codes[i];
        var containerDiv = $container.find('.graph-div[data-coin-code=' + c + ']')[0];
        var color = Number($container.find('.graph-div[data-coin-code=' + c + ']').attr('change')) > 0 ? '#14D4AE' : '#FF527D';
        if (!containerDiv) {
            return;
        }
        var chart = echarts.init(containerDiv);

        var option = {
            grid: {
                left: 0,
                top: 0,
                bottom: 0,
                right: 0
            },
            xAxis: {
                show: false,
                boundaryGap: false,
                data: Bg.rQuotations[c].xData,
                type: 'category'
            },

            yAxis: {
                show: false,
                boundaryGap: false,
                scale: true
            },
            series: {
                symbol: 'none',
                type: 'line',
                data: Bg.rQuotations[c].yData,
                clipOverflow: false,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: color,
                            width: 1
                        }
                    }
                }
            }
        };


        chart.setOption(option);
    }
}


chrome.runtime.onMessage.addListener(function (msg) {
    console.log(msg.name);
    switch (msg.name) {
        case 'allCoinsLoaded':
            console.log(currentTab, isAllCoinsInited);
            if (currentTab === 'all-coins' && !isAllCoinsInited) {
                if (!isAllCoinsInited) {
                    initAllCoins();
                } else {
                    var coins = Bg.getData();
                    buildList(coins);
                }
            }
            break;
        case 'myCoinsLoaded':
            console.log('2 ', currentTab, isMyCoinsInited);
            if (currentTab === 'my-coins') {
                $('#my-coins-area').find('.loading').hide();
                buildMyCoins();
            }
            break;
        case 'quotationLoaded':
            var codes = msg.codes;
            console.log(codes);
            drawGraph(codes, msg.container);
            break;

        case 'signOut':
            $('.sign-in-area').show();
            $('.user-area').hide();
            switchTab('all-coins');
            break;
    }
});

