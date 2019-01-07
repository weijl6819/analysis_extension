var sourseData = {
    /**
     * [_loadStockData 获取列表和详情]
     * @param  {[type]}   key      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    _loadStockData: function(key, callback) {
        var strKey = "";
        stockRequest = key;
        for (var item in key) {
            strKey += key[item];
            if (item < (key.length - 1))
                strKey += ",";
        }
        if (strKey === 'sprint nextel') {
            return;
        }
        var url = 'http://hq.sinajs.cn/list=' + strKey;



        try {
            var xhr = new window.XMLHttpRequest();

            xhr.open("GET", url, false);
            xhr.onreadystatechange = function() {

                if (xhr.readyState == 4) {
                    var stockListArray = xhr.responseText.split(";");

                    {
                        var stockResponseData = [];
                        for (var item in stockRequest) {
                            var elements = stockListArray[item].split(/_|="|,|"/);
                            stockResponseData[item] = elements;
                        }

                        var data = [];

                        for (var item in stockResponseData) {
                            if(stockResponseData[item][3] == "")
                                break;
                            var arr = stockResponseData[item];
                            var picURL = "http://image.sinajs.cn/newchart/min/n/" + key[item] + ".gif";
                            var growPoint = arr[6] - arr[5];
                            var growRate = growPoint * 100 / arr[5];
                            var temp = sourseData.packageSinaDetailData(item,arr,key,growPoint,growRate);
                            if (parseInt(arr[6]) == 0) {
                                temp.price = stockDate.fixed(arr[5], 2);
                                temp.growPoint = ' -- ';
                                temp.growRate = ' -- ';
                                temp.hands = ' -- ';
                            }
                            if (parseFloat(temp.growRate) > 0) {
                                temp.className = 'rise';
                            } else if (parseFloat(temp.growPoint) < 0 || parseFloat(temp.growRate) < 0) {
                                temp.className = 'drop';
                                temp.growPoint = temp.growPoint.toString().replace('-', '');
                                temp.growRate = temp.growRate.toString().replace('-', '');
                            }
                            data[item] = temp;
                        }

                        callback(data);
                    }

                }

                delete xhr;
            }
            xhr.send();
        } catch(e) { console.error(e); }

    },
    /**
     *
     * @param keyIndexStock
     * @param keyMyStock
     * @param keySelectStock
     * @param allInOne    True: not get the index stock data from Sina, it will get from baidu when Sina data blocked. (Sina URL: http://www.24money.com/stockapi/list=)(Baidu URL:http://www.24money.com/stockapi/apistore/stockservice/stock?stockid=)
     *                     False: use all the data in one request from Sina
     * @param callback
     * @private
     */
    _showStartData: function(keyIndexStock, keyMyStock, keySelectStock, allInOne, callback) {
        var key = [];
        var allData = {};
        if (allInOne == true)
            key = key.concat(keyIndexStock);
        if (keyMyStock.length != 0)
            key = key.concat(keyMyStock);
        if (keySelectStock != 0)
            key = key.concat(keySelectStock);

        var strKey = "";
        var stockRequest = key;
        for (var item in key) {
            strKey += key[item];
            if (item < (key.length - 1))
                strKey += ",";
        }

        if(allInOne == false)
        {
            var urlIndex24Sina = 'https://www.24money.com/stockapi/list=sh000001,sz399001,sz399006';
            allData.indexstock = sourseData.getSinaDataHttpRequest(urlIndex24Sina,keyIndexStock);

            var sinaServiceBlocked = false;
            for(var i in allData.indexstock)
            {
                if(allData.indexstock[i].name == "")
                    sinaServiceBlocked = true;
            }
            if(allData.indexstock.length == 0 || sinaServiceBlocked == true)
            {
                var urlIndex24Baidu = 'https://www.24money.com/stockapi/apistore/stockservice/stock?stockid=sz399006';
                allData = sourseData.getBaiduDataHttpRequest(urlIndex24Baidu,keyIndexStock);
            }

            if (key.length != 0)
            {
                var url = 'http://hq.sinajs.cn/list=' + strKey;
                var tempStock = sourseData.getSinaDataHttpRequest(url,key);
                if(keyMyStock.length !=0)
                {
                    if(keySelectStock.length ==0 || keySelectStock[0] =="")
                        allData.mystock = tempStock.slice(0,tempStock.length);
                    else
                        allData.mystock = tempStock.slice(0,tempStock.length-1);
                }

                if(keySelectStock.length !=0 && keySelectStock[0] !="")
                    allData.selectstock = tempStock.slice(-1);
                callback(allData);
            }





        }else{

            if (key.length == 0)
                return;

            var url = 'http://hq.sinajs.cn/list=' + strKey;

            var tempStock = sourseData.getSinaDataHttpRequest(url,key);

            allData.indexstock = tempStock.slice(0,keyIndexStock.length);

            allData.mystock = tempStock.slice(keyIndexStock.length,keyIndexStock.length + keyMyStock.length );

            allData.selectstock = tempStock.slice(keyIndexStock.length + keyMyStock.length,keyIndexStock.length + keyMyStock.length + keySelectStock.length );
            callback(allData);



        }


    },
    GetFrameData:function(){
        var d = window.frames["frame1"].document;
        var retValue = d.getElementsByTagName('pre')[0].firstChild.data;
        var allData = sourseData.packageBaiduData(retValue);
        console.log(allData);
        return allData;

    },
    iframeOnload:function(){
        //alert("Local iframe is now loaded.");
        sourseData.GetFrameData();
    },
    packageSinaDetailData: function (item,arr,key,growPoint,growRate) {
        var temp = {
            key: item,
            price: stockDate.fixed(arr[6], 2),
            name: arr[3],
            code: stockDate.getNum(key[item]),
            numberCode: key[item],
            growPoint: stockDate.fixed(growPoint, 2),
            growRate: stockDate.fixed(growRate, 2) + '%',
            day: arr[33],
            time: arr[34],
            startPrice: stockDate.fixed(arr[4], 2),
            yesterdayClosePrice: stockDate.fixed(arr[5], 2),
            highest: stockDate.fixed(arr[7], 2),
            lowest: stockDate.fixed(arr[8], 2),
            turnoverQuantity: stockDate.toBigUnit(stockDate.fixed(arr[11], 2), "quantity"),
            turnoverPrice: stockDate.toBigUnit(stockDate.fixed(arr[12], 2), "price"),
            pic: "http://image.sinajs.cn/newchart/min/n/" + key[item] + ".gif",
            className: ''
        }
        return temp;
    },
    packageBaiduData: function (data) {
        var dataTemp =[];
        var allData = {};
        data =$.parseJSON(data);

        var shanghai = {
            key: 0,
            price: stockDate.fixed(data.retData.market.shanghai.curdot,2),
            name: data.retData.market.shanghai.name,
            code: "000001",
            numberCode: "sh000001",
            growPoint: stockDate.fixed(data.retData.market.shanghai.curprice,2),
            growRate: stockDate.fixed(data.retData.market.shanghai.rate,2)+'%',
            day: data.retData.stockinfo.date,
            time: data.retData.stockinfo.time,
            startPrice: "",
            yesterdayClosePrice: "",
            highest: "",
            lowest: "",
            turnoverQuantity: stockDate.toBigUnit(stockDate.fixed(data.retData.market.shanghai.turnover,2), "quantity"),
            turnoverPrice: stockDate.toBigUnit(stockDate.fixed(data.retData.market.shanghai.dealnumber,2), "quantity"),
            pic: "http://image.sinajs.cn/newchart/min/n/sh000001.gif",
            className: parseFloat(data.retData.market.shanghai.curprice>0)?'rise':'drop'
        };

        var shenzhen = {
            key: 1,
            price: stockDate.fixed(data.retData.market.shenzhen.curdot,2),
            name: data.retData.market.shenzhen.name,
            code: "399001",
            numberCode: "sz399001",
            growPoint: stockDate.fixed(data.retData.market.shenzhen.curprice,2),
            growRate: stockDate.fixed(data.retData.market.shenzhen.rate,2)+'%',
            day: data.retData.stockinfo.date,
            time: data.retData.stockinfo.time,
            startPrice: "",
            yesterdayClosePrice: "",
            highest: "",
            lowest: "",
            turnoverQuantity: stockDate.toBigUnit(stockDate.fixed(data.retData.market.shenzhen.turnover,2), "quantity"),
            turnoverPrice: stockDate.toBigUnit(stockDate.fixed(data.retData.market.shenzhen.dealnumber,2), "quantity"),
            pic: "http://image.sinajs.cn/newchart/min/n/sz399001.gif",
            className: parseFloat(data.retData.market.shenzhen.curprice>0)?'rise':'drop'
        };
        var growPoint = data.retData.stockinfo.currentPrice - data.retData.stockinfo.closingPrice;
        var growRate = (data.retData.stockinfo.currentPrice - data.retData.stockinfo.closingPrice)/data.retData.stockinfo.closingPrice*100;
        var cyb = {
            key: 2,
            price: stockDate.fixed(data.retData.stockinfo.currentPrice,2),
            name: data.retData.stockinfo.name,
            code: "399006",
            numberCode: "sz399006",
            growPoint: stockDate.fixed(growPoint,2),
            growRate: stockDate.fixed(growRate,2) + '%',
            day: data.retData.stockinfo.date,
            time: data.retData.stockinfo.time,
            startPrice:  stockDate.fixed(data.retData.stockinfo.OpenningPrice,2),
            yesterdayClosePrice:  stockDate.fixed(data.retData.stockinfo.closingPrice,2),
            highest:  stockDate.fixed(data.retData.stockinfo.hPrice,2),
            lowest:  stockDate.fixed(data.retData.stockinfo.lPrice,2),
            turnoverQuantity: stockDate.toBigUnit(stockDate.fixed(data.retData.stockinfo.totalNumber,2), "quantity"),
            turnoverPrice: stockDate.toBigUnit(stockDate.fixed(data.retData.stockinfo.turnover,2), "quantity"),
            pic: "http://image.sinajs.cn/newchart/min/n/sz399006.gif",
            className: parseFloat(growPoint>0)?'rise':'drop'
        };

        dataTemp[0] = shanghai;
        dataTemp[1] = shenzhen;
        dataTemp[2] = cyb;
        allData.indexstock = dataTemp;

        return allData;
    },
    getSinaDataHttpRequest: function (url,Stock) {
        var data = [];
        try {
            var xhr = new window.XMLHttpRequest();

            xhr.open("GET", url, false);
            xhr.onreadystatechange = function() {

                if (xhr.readyState == 4) {
                    var stockListArray = xhr.responseText.split(";");

                    var stockResponseData = [];
                    for (var item in Stock) {
                        var elements = stockListArray[item].split(/_|="|,|"/);
                        stockResponseData[item] = elements;
                    }



                    for (var item in stockResponseData) {
                        if(stockResponseData[item][3] == "")
                            break;
                        var arr = stockResponseData[item];
                        var growPoint = arr[6] - arr[5];
                        var growRate = growPoint * 100 / arr[5];
                        var temp = sourseData.packageSinaDetailData(item,arr,Stock,growPoint,growRate);
                        if (parseInt(arr[6]) == 0) {
                            temp.price = stockDate.fixed(arr[5], 2);
                            temp.growPoint = ' -- ';
                            temp.growRate = ' -- ';
                            temp.hands = ' -- ';
                        }
                        if (parseFloat(temp.growRate) > 0) {
                            temp.className = 'rise';
                        } else if (parseFloat(temp.growPoint) < 0 || parseFloat(temp.growRate) < 0) {
                            temp.className = 'drop';
                            temp.growPoint = temp.growPoint.toString().replace('-', '');
                            temp.growRate = temp.growRate.toString().replace('-', '');
                        }
                        data[item] = temp;
                    }

                }

                delete xhr;

            }
            xhr.send();

        } catch(e) { console.error(e); }
        return data;
    },
    getBaiduDataHttpRequest: function (url,Stock) {
        var allData;
        try {
            var xhr = new window.XMLHttpRequest();

            xhr.open("GET", url, false);
            xhr.onreadystatechange = function() {

                if (xhr.readyState == 4) {
                    var objStock = xhr.responseText;
                    var parStock = $.parseJSON(objStock);
                    allData = sourseData.packageBaiduData(objStock);
                    var test = "";

                }

                delete xhr;

            }
            xhr.send();

        } catch(e) { console.error(e); }
        return allData;
    },
    recordDataToServer:function(actionid) {
        var uqid_ = uqid_||store.get('uqid');
        var source_ = source_ || store.get('source');

        var version = store.get("pulgInVersion");
        var type = "chrome";

        var tongjienv = store.get("tongjienv") || "";
        var strUrl = "";
        if(tongjienv == "")
            strUrl = " http://tongji.24money.com/api/statistic_addon.php?uqid="+uqid_+"&version="+version+"&type="+type+"&actionid="+actionid+"&channelid="+source_;
        else
            strUrl = " http://tongji"+tongjienv+".24money.com/api/statistic_addon.php?uqid="+uqid_+"&version="+version+"&type="+type+"&actionid="+actionid+"&channelid="+source_;


        commonFunc.ajaxFun(strUrl,commonFunc.readFileSucess,commonFunc.readFileFailed,commonFunc.completeFun);
    }
}
