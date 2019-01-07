var stockDate = {
    /**
     * [parameters 参数声明]
     * @type {Object}
     */
    parameters: {
        _mod_search: $('.mod_search'), //搜索层
        _mod_toolbar: $('.mod_toolbar'), //工具条层
        _mod_stock_category: $('.mod_stock_category'), //上证，深圳，创业分类层
        _mod_stock_self: $('.mod_stock_self'), //自选股层
        _mod_stock_detail: $('.mod_stock_detail'), //详情
        _mod_copyRight: $('.mod_copyRight'), //底部
        _localStock: store.get('stockObj') || [],
        enumUnitPriceMap: ["元", "万元", "亿元", "万亿元", "兆元"],
        enumUnitQuantityMap: ["手", "万手", "亿手", "万亿手", "兆手"],
        timer: null
    },
    /**
     * [init 事件初始化]
     * @return {[type]} [description]
     */
    init: function() {
        this.getStockSelfStockHeight();

        this.stockSector();
        this.getSearchDate();
        this.searchCancel();

        this.isNoCount();

        this.addStock();
        this.editStock();
        window.onresize = function() {
            stockDate.getStockSelfStockHeight();
        };

        this.deleStock();

        this.showStockList(false);
        this.stockDetailClick();

        this.startRender();
        //this.modSearchAdd();
        //this.tipIsMore();
        sourseData.recordDataToServer("ext000001");
    },
    /**
     * [getStockSelfStockHeight 控制列表高度]
     * @return {[type]} [description]
     */
    getStockSelfStockHeight: function() {
        var mod_toolbar_Ht = stockDate.parameters._mod_toolbar,
            mod_stock_category_Ht = stockDate.parameters._mod_stock_category,
            mod_stock_self_Ht = stockDate.parameters._mod_stock_self,
            mod_stock_detail_Ht = stockDate.parameters._mod_stock_detail,
            mod_copyRight_Ht = stockDate.parameters._mod_copyRight,
            mod_body_Ht = $(window).height(),
            _temp = 0;
        _temp = mod_body_Ht - mod_toolbar_Ht[0].offsetHeight - mod_stock_category_Ht[0].offsetHeight - mod_stock_detail_Ht[0].offsetHeight - mod_copyRight_Ht[0].offsetHeight;
        mod_stock_self_Ht.height(_temp);
    },
    /**
     * [isNoCount 股票列表为空时的状态]
     * @return {Boolean} [description]
     */
    isNoCount: function() {
        var stock_list = $('#stock_list .stock_member');
        stock_list.length > 0 ? stockDate.parameters._mod_stock_self.find('.noCount').addClass('hide') : stockDate.parameters._mod_stock_self.find('.noCount').removeClass('hide');
    },
    /**
     * [getStockListDate 获取存储的数据列表]
     * @return {[type]} [description]
     */
    getStockListDate: function(className, numberCode, code, name, price, growRate) {
        var tempHtml = '';
        tempHtml += '<div class="stock_member disabled ' + className + '">' +
            '<span class="deletBtn"><i></i></span>' +
            '<div class="stock_deD clearfix"><span class="number">' + code + '<input type="hidden" value="' + numberCode + '" ></span>' +
            '<span class="name">' + name + '</span>' +
            '<span class="price">' + price + '</span>' +
            '<span class="gradient"><span class="rate">' + growRate + '</span></span></div>' +
            '<span class="dragBtn"><i></i></span>' +
            '</div>';
        return tempHtml;
    },
    zhiDom: function(res) {
        var doms = '',
            tep = '<u class="xian"></u>',
            cName = '',
            cId = '',
            cClass = '',
            stockCategory = stockDate.parameters._mod_stock_category.find('.stockL');
        if (store.get('clickHover') != undefined) {
            cName = store.get('clickHover').split(',');
        }
        if (cName.length > 0) {
            cClass = cName[0];
            cId = cName[1];
        }
        for (var i = 0; i < res.length; i++) {
            if ((i + 1) === 3) {
                tep = '';
            }
            doms += '<li class="' + (cId === res[i].numberCode ? cClass : '') + '">' +
                '<a class="stockClick ' + res[i].className + '" href="javascript:;"><input id="numberCode" type="hidden" value="' + res[i].numberCode + '">' +
                '<div class="name">' + res[i].name + '</div>' +
                '<div class="num">' + res[i].price + '</div>' +
                '<div class="zhi"><span class="price ' + res[i].className + '"><i></i><b>' + res[i].growPoint + '</b></span><span class="gradient ' + res[i].className + '"><i></i><b>' + res[i].growRate + '</b></span></div>' +
                '</a>' + tep + '</li>';
        }
        stockCategory.empty();
        stockCategory.append(doms);
        stockDate.deleStock();
    },
    /**
     * [stockSector 指数版块]
     * @return {[type]} [description]
     */
    stockSector: function() {
        //上证指数、创业版指、深圳成指
        sourseData._loadStockData(['sh000001', 'sz399001', 'sz399006'], function(res) {
            if (res.length <= 0) {
                return;
            }
            stockDate.zhiDom(res);
        });
    },
    /**
     * [showStockList 展示本地自选股]
     * @return {[type]} [description]
     */
    showStockList: function(obj) {
        var stockLocal = store.get('stockObj'),
            stock_list = $('#stock_list'),
            tempHtml = '';
        if (stockLocal === undefined) {
            return;
        }
        for (var i = 0; i < stockLocal.length; i++) {
            if (obj) {
                stockLocal[0].className = stockLocal[i].className + ' hightLight';
            }
            tempHtml += stockDate.getStockListDate(stockLocal[i].className, stockLocal[i].numberCode, stockLocal[i].code, stockLocal[i].name, stockLocal[i].price, stockLocal[i].growRate);
        }
        stock_list.empty();
        stock_list.append(tempHtml);
        stockDate.isNoCount();

    },
    /**
     * [getSelfStock 获取自选股数据]
     * @return {[type]} [description]
     */
    getSelfStock: function(obj) {
        if (!store.enabled) {
            alert('此浏览器不支持，请换谷歌浏览器，谢谢！');
            return;
        }

        var stockArry = [obj],
            tempHtml = '',
            stock_list = $('#stock_list'),
            arryC = {};


        sourseData._loadStockData(stockArry, function(res) {
            if (res.length <= 0) {
                return;
            }
            var localSouceDate = store.get('stockObj') || [];
            arryC = {
                'className': res[0].className,
                'code': res[0].code,
                'numberCode': res[0].numberCode,
                'name': res[0].name,
                'price': res[0].price,
                'growRate': res[0].growRate
            };
            $('.mod_stock_detail').addClass('hide');
            for (var i = 0; i < localSouceDate.length; i++) {
                if (arryC.code === localSouceDate[i].code) {
                    //alert('您要添加的股票已经在自选股中!');
                    store.set('stockId', '');
                    store.set('clickHover', '');
                    //$('.mod_stock_detail').addClass('hide');
                    $('#stock_list .stock_member').removeClass('drags');
                    $('.mod_stock_category li').removeClass('hover');
                    stockDate.getStockSelfStockHeight();
                    return;
                }
            }
            var newsA = stockDate.addSock(arryC, store.get('stockObj'));
            store.set('stockId', '');
            store.set('clickHover', '');

            store.set('stockObj', newsA);
            stockDate.showStockList(true);
            //stockDate.tipIsMore();

            stockDate.getStockSelfStockHeight();

            stockDate.stockDetailClick();

        });
    },
    /**
     * [addSock description]
     * @param {[type]} arryC       [@description [description]]
     * @param {[type]} localStocks [description]
     */
    addSock: function(arryC, localStocks) {
        if (localStocks === undefined) {
            localStocks = [];
        }
        var newArray = new Array(localStocks.length + 1);
        for (var i = 0; i < localStocks.length; i++) {
            newArray[i + 1] = localStocks[i];

        }
        newArray[0] = arryC;
        return newArray;
    },
    /**
     * [getSearchDate 自动搜索提示]
     * @return {[type]} [description]
     */
    getSearchDate: function() {
        var suggest = searchStock({
            container: '.mod_search',
            id: 'stock',
            minInputLen: 0,
            url: 'http://suggest3.sinajs.cn/suggest/?type=11&key={%input%}',
            dataType: 'script',
            pick: function(value) {
                var _valAra = value.split(',');
                stockDate.modSearchHide();
                stockDate.getSelfStock(_valAra[2]);
                $('.mod_stock_detail').addClass('hide');
            },
            processData: function(inputValue, data) {

                    var result = [];
                    var stock_arry = [];
                    stock_arry = data.split('\"');
                    stock_arry = stock_arry[1].split(';');
                    stock_arry.forEach(function(stock) {
                        stock_arr = stock.split(',');
                        if (inputValue.match(/\d+/) !== null) {
                            match = stock_arr[3];
                        } else {
                            match = stock_arr[0];
                        }
                        result.push({
                            'display': '<span class="number"><i class="kong"></i>' + stock_arr[2] + '</span><span class="name">' + stock_arr[4] + '</span><span class="addBtn hide"><i></i></span>',
                            'value': stock_arr[4] + ',' + stock_arr[2] + ',' + stock_arr[3]
                        });
                    });
                    return result;

            }
        });
    },
    /**
     * [modSearchHide 隐藏搜索]
     * @return {[type]} [description]
     */
    modSearchHide: function() {
        stockDate.parameters._mod_search.addClass('hide');

        stockDate.parameters._mod_toolbar.removeClass('hide');
        stockDate.parameters._mod_stock_category.removeClass('hide');
        stockDate.parameters._mod_stock_self.removeClass('hide');

        stockDate.parameters._mod_stock_detail.removeClass('hide');

        stockDate.startRender();
    },
    countdown: function() {
        var handler = function() {
                stockDate.parameters._mod_toolbar.find('.info').addClass('hide');
                clear();
            },
            clear = function() {;
                clearInterval(timer);
            }
        var timer = setTimeout(handler, 2000);
    },
    /**
     * [modSearchEdit 添加股票]
     * @return {[type]} [description]
     */
    modSearchAdd: function() {
        var counts = $('#stock_list').find('.stock_member').length;
        if (counts > 29) {
            stockDate.parameters._mod_toolbar.find('.info').removeClass('hide');
            stockDate.countdown();
        } else {
            stockDate.parameters._mod_toolbar.find('.info').addClass('hide');
            stockDate.parameters._mod_search.removeClass('hide');
            stockDate.parameters._mod_search.find('#stock').val('').focus();
            $('#suggestMenu').remove();

            stockDate.parameters._mod_toolbar.addClass('hide');
            stockDate.parameters._mod_stock_category.addClass('hide');
            stockDate.parameters._mod_stock_self.addClass('hide');
            stockDate.parameters._mod_stock_detail.addClass('hide');

            stockDate.endTimes();
        }
        //添加点击打点
        sourseData.recordDataToServer("ext000004");
    },
    /**
     * [modStockListEdit 编辑股票列表]
     * @return {[type]} [description]
     */
    modStockListEdit: function() {
        stockDate.parameters._mod_toolbar.find('.add').addClass('hide');
        stockDate.parameters._mod_toolbar.find('.edit').addClass('hide');
        stockDate.parameters._mod_toolbar.find('.btn_cancel').removeClass('hide');
        stockDate.parameters._mod_stock_self.find('.stock_list').removeClass('btnListHide');

        stockDate.parameters._mod_stock_detail.addClass('hide');

        stockDate.dragStockList();
        stockDate.parameters._mod_stock_self.find('#stock_list .stock_member').removeClass('drags');
        stockDate.parameters._mod_stock_category.find('li').removeClass('hover');
        stockDate.getStockSelfStockHeight();

        $('#stock_list .stock_member').off('click');

        stockDate.endTimes();
        store.set('stockId', '');
        $('#stock_list').sortable('enable');

        //编辑打点
        sourseData.recordDataToServer("ext000005");
    },
    /**
     * [modEndStock 完成股票编辑后的状态]
     * @return {[type]} [description]
     */
    modEndStock: function() {
        stockDate.parameters._mod_toolbar.find('.add').removeClass('hide');
        stockDate.parameters._mod_toolbar.find('.edit').removeClass('hide');
        stockDate.parameters._mod_toolbar.find('.btn_cancel').addClass('hide');
        stockDate.parameters._mod_stock_self.find('.stock_list').addClass('btnListHide');

        stockDate.dragStockList();
        stockDate.stockDetailClick();
        stockDate.startRender();

        store.set('clickHover', '');
        store.set('stockId', '');
        $('#stock_list').sortable('disable');
    },
    /**
     * [searchCancel 选中的股票，或取消]
     * @return {[type]} [description]
     */
    searchCancel: function() {
        var _btnCancel = stockDate.parameters._mod_search.find('.btn_cancel');
        _btnCancel.on('click', stockDate.modSearchHide);
    },
    removeClick: function() {
        var _btnAdd = stockDate.parameters._mod_toolbar.find('.add');
        _btnAdd.off('click');
    },
    /**
     * [editStock 添加股票]
     * @return {[type]} [description]
     */
    addStock: function() {
        var _btnAdd = stockDate.parameters._mod_toolbar.find('.add');
        _btnAdd.on('click', this.modSearchAdd);
    },
    /**
     * [editStock 编辑股票]
     * @return {[type]} [description]
     */
    editStock: function() {
        var _btnEdit = stockDate.parameters._mod_toolbar.find('.edit'),
            _btnEnd = stockDate.parameters._mod_toolbar.find('.btn_cancel');
        _btnEdit.on('click', this.modStockListEdit);
        _btnEnd.on('click', this.modEndStock);
        
    },
    /**
     * [deleStock 删除股票]
     * @return {[type]} [description]
     */
    deleStock: function() {
        var _btnDele = $('#stock_list');
        _btnDele.off('click').on('click', '.deletBtn', function(e) {
            var id = $(this).parent().find('.number').find('input').val(),
                sourD = store.get('stockObj'),
                varArry = [];
            $(this).parent().remove();
            stockDate.isNoCount();
            for (var i = 0; i < sourD.length; i++) {
                if (sourD[i].numberCode !== id) {
                    varArry.push({
                        'className': sourD[i].className,
                        'code': sourD[i].code,
                        'numberCode': sourD[i].numberCode,
                        'name': sourD[i].name,
                        'price': sourD[i].price,
                        'growRate': sourD[i].growRate
                    })
                }
            }
            store.set('stockObj', varArry);

            stockDate.showStockList(false);
            $('#stock_list .stock_member').off('click');
            //删除打点
            sourseData.recordDataToServer("ext000007");
        });
        
    },
    /**
     * [sortStock 排序]
     * @return {[type]} [description]
     */
    sortStock: function() {
        var stock_member = $('#stock_list .stock_member'),
            stock_arry = [];

        for (var i = 0; i < stock_member.length; i++) {
            stock_arry.push({
                'className': stock_member[i].className.replace('stock_member ', ''),
                'code': $(stock_member[i]).find('.number').text(),
                'numberCode': $(stock_member[i]).find('.number').find('input').val(),
                'name': $(stock_member[i]).find('.name').text(),
                'price': $(stock_member[i]).find('.price').text(),
                'growRate': $(stock_member[i]).find('.gradient .rate').text()
            });
        }
        store.set('stockObj', stock_arry);
        //排序打点
        sourseData.recordDataToServer("ext000006");
    },
    /**
     * [dragStockList 拖动自选股]
     * @return {[type]} [description]
     */
    dragStockList: function() {
        $("#stock_list").sortable({
            delay: 100,
            axis: 'y',
            cursor: "move",
            items: ".stock_member",
            opacity: 0.8,
            update: function(event, ui) {
                stockDate.sortStock();
            }
        });
    },
    /**
     * [stockDetailClick 详情事件]
     * @return {[type]} [description]
     */
    stockDetailClick: function() {
        var stockIdv = $('#stockId');
        $('#stock_list .stock_member').off('click').on('click', function(e) {
            var stockId = $(this).find('.number').find('input').val();
            store.set('clickHover', 'drags,' + stockId);
            $(this).addClass('drags').siblings().removeClass('drags').siblings().removeClass('hightLight');
            $('.mod_stock_category li').removeClass('hover');
            store.set('stockId', stockId);
            stockIdv.val(stockId);
            stockDate.stockDetail(stockId);
            //列表打点
            sourseData.recordDataToServer("ext000002");
        });
        $('.mod_stock_category').off('click').on('click', 'li', function() {
            var stockId = $(this).find('#numberCode').val();
            store.set('clickHover', 'hover,' + stockId);
            $(this).addClass('hover').siblings().removeClass('hover');
            $('#stock_list .stock_member').removeClass('drags');
            store.set('stockId', stockId);
            stockIdv.val(stockId);
            stockDate.stockDetail(stockId);
            //指数打点
            sourseData.recordDataToServer("ext000003");

        });
    },
    /**
     * [detailClose 关闭详情]
     * @return {[type]} [description]
     */
    detailClose: function() {
        $('.mod_stock_detail').on('click', '.delet', function() {
            store.set('stockId', '');
             store.set('clickHover', '');
            $('.mod_stock_detail').addClass('hide');
            stockDate.getStockSelfStockHeight();
            $('#stock_list .stock_member').removeClass('drags');
            stockDate.parameters._mod_stock_category.find('.stockL li').removeClass('hover');
        });
    },
    detailBind: function(res) {
        var stock_detail = $('.mod_stock_detail'),
            detailDom,
            arryC = [];
        arryC = {
            'className': res[0].className,
            'code': res[0].code,
            'day': res[0].day,
            'growPoint': res[0].growPoint,
            'growRate': res[0].growRate,
            'highest': res[0].highest,
            'key': res[0].key,
            'lowest': res[0].lowest,
            'name': res[0].name,
            'numberCode': res[0].numberCode,
            'pic': res[0].pic,
            'price': res[0].price,
            'startPrice': res[0].startPrice,
            'time': res[0].time,
            'turnoverPrice': res[0].turnoverPrice,
            'turnoverQuantity': res[0].turnoverQuantity,
            'yesterdayClosePrice': res[0].yesterdayClosePrice
        };
        detailDom = '<a class="delet" href="javascript:void(0);"></a><div class="exponent ' + arryC.className + '">' +
            '<div class="exponent_number rise">' + arryC.price + '</div>' +
            '<div class="zhong">' +
            '<span class="name">' + arryC.name + '(' + arryC.numberCode + ')</span>' +
            '<span class="price"><i></i>' + arryC.growPoint + '</span><span class="gradient"><i></i>' + arryC.growRate + '</span><span class="times">' + arryC.day + ' ' + arryC.time + '</span>' +
            '</div>' +
            '<div class="performance clearfix">' +
            '<ul class="summary clearfix">' +
            '<li>' +
            '<label for="">今开：</label><span class="now_open rise">' + arryC.startPrice + '</span>' +
            '</li>' +
            '<li>' +
            '<label for="">最高：</label><span class="highest rise">' + arryC.highest + '</span>' +
            '</li>' +
            '<li>' +
            '<label for="">成交量：</label><span class="volume">' + arryC.turnoverQuantity + '</span>' +
            '</li>' +
            '<li>' +
            '<label for="">昨收：</label><span class="zuo_shou">' + arryC.yesterdayClosePrice + '</span>' +
            '</li>' +
            '<li>' +
            '<label for="">最低：</label><span class="lowest drop">' + arryC.lowest + '</span>' +
            '</li>' +
            '<li>' +
            '<label for="">成交额：</label><span class="turnover">' + arryC.turnoverPrice + '</span>' +
            '</li>' +
            '</ul>' +
            '<img class="stockImg" src="' + arryC.pic + '">' +
            '</div>' +
            '</div>';
        stock_detail.empty();
        stock_detail.removeClass('hide');
        stockDate.getStockSelfStockHeight();
        stock_detail.append(detailDom);
        stockDate.detailClose();
    },
    /**
     * [stockDetail 股票详情]
     * @return {[type]} [description]
     */
    stockDetail: function(stockId) {
        if (stockId === undefined) {
            return;
        }

        sourseData._loadStockData([stockId], function(res) {
            stockDate.detailBind(res);
        });
    },

    getNum: function(text) {
        var value = text.replace(/[^0-9]/ig, "");
        return value;
    },
    fixed: function(obj, len) {
        return parseFloat(obj).toFixed(len);
    },
    /**
     * [toBigUnit 单位转换]
     * @param  {[type]} data [数据]
     * @param  {[type]} type [数据类型]
     * @return {[type]}      [description]
     */
    toBigUnit: function(data, type) {
        var time = 0;
        var smallData = data;
        var strUnit = "";
        var unit = "";

        if (type == "quantity") {
            data /= 100;
        };

        while (1) {
            data = data / 10000;
            if (data < 1)
                break;

            time += 1;
            smallData = data;
        };

        if (type == "quantity") {
            unit = stockDate.parameters.enumUnitQuantityMap[time];
        } else if (type == "price") {
            unit = stockDate.parameters.enumUnitPriceMap[time];
        };

        smallData = stockDate.fixed(smallData, 2) + unit;
        return smallData;
    },
    /**
     * [updateAllDate 更新所有数据]
     * @return {[type]} [description]
     */
    updateAllDate: function() {
        var idList = store.get('stockObj'),
            tempId = new Array();
        if (idList === undefined) {
            tempId = [];
        } else {
            for (var i = 0; i < idList.length; i++) {
                tempId.push(idList[i].numberCode);
            }
        }
        var keyIndexStock = ["sh000001", "sz399001", "sz399006"];
        var keyMyStock = tempId;
        var keySelectStock = [store.get('stockId')] || [];
        sourseData._showStartData(keyIndexStock, keyMyStock, keySelectStock, false, function(res) {
            //三个指点数
            stockDate.zhiDom(res.indexstock);
            //自选股刷新
            var stock_list = $('#stock_list'),
                tempHtml = '',
                arryC = [],
                cName = '',
                cId = '',
                cClass = '';
            if (store.get('clickHover') != undefined) {
                cName = store.get('clickHover').split(',');
            }
            if (cName.length > 0) {
                cClass = cName[0];
                cId = cName[1];
            }
            if (res.mystock === undefined) {
                return;
            }
            for (var i = 0; i < res.mystock.length; i++) {
                arryC.push({
                    'className': res.mystock[i].className,
                    'code': res.mystock[i].code,
                    'numberCode': res.mystock[i].numberCode,
                    'name': res.mystock[i].name,
                    'price': res.mystock[i].price,
                    'growRate': res.mystock[i].growRate
                });
                if (stockId === res.mystock[i].numberCode || cId === res.mystock[i].numberCode) {
                    res.mystock[i].className = res.mystock[i].className + ' drags';
                }
                tempHtml += stockDate.getStockListDate(res.mystock[i].className, res.mystock[i].numberCode, res.mystock[i].code, res.mystock[i].name, res.mystock[i].price, res.mystock[i].growRate);
            }
            store.set('stockObj', arryC);
            stock_list.empty();
            stock_list.append(tempHtml);
            stockDate.stockDetailClick();
            stockDate.isNoCount();

            if (res.selectstock === undefined) {
                return;
            }
            stockDate.detailBind(res.selectstock);
        });
    },
    vrTime: function() {
        var curTime = new Date();
        var weekDay = curTime.getDay();
        if (weekDay >= 1 && weekDay <= 5) {
            var base = curTime.getFullYear() + '/' + (curTime.getMonth() + 1) + '/' + curTime.getDate() + ' ';
            var startAM = base + '09:15:00';
            var endAM = base + '11:30:00';
            var startPM = base + '13:00:00';
            var endPM = base + '15:00:00';

            var b = (+curTime >= +new Date(startAM) && +curTime <= +new Date(endAM)) || ((+curTime >= +new Date(startPM) && +curTime <= +new Date(endPM)));
            return b;
        } else {
            return false;
        }
    },
    startRender: function() {

        stockDate.updateAllDate();
        stockDate.parameters.timer = setInterval(function() {
            if (stockDate.vrTime())
            {
                stockDate.updateAllDate();
            }
        }, 10000);
    },
    endTimes: function() {
        clearInterval(stockDate.parameters.timer);
    }
};
/**
 * 加载
 */
stockDate.init();
