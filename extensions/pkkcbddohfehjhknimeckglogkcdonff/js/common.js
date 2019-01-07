/**
 * Created by xjk on 2015/5/23.
 */

var action = { "BHOSTART" : 1};

var commonFunc = {
    parameters:{
        requestDataFailed: false,
        pulgInVersion:"",
        tongjienv:"",
    },
    init: function () {
        commonFunc.getChromeVersion();
        commonFunc.getUqidAndSource();
    },
    getUqidAndSource:function() {
        store.set('uqid',uqid_);
        store.set('source',source_)
        namsgbg.SendNativeMsg({action:'getUqidAndSource',param:''});
    },
    ajaxFun: function(dataUrl,dataType, callBackFun, errorFun,  completeBackFun) {
        $.ajax({
            url: dataUrl,
            type: 'get',
            cache: true,
            dataType:dataType,
            timeout:5000,
            success: function(data) {
                callBackFun(data);
                data.toString();
            },
            error: function(data) {
                errorFun(data);
            },
            complete: function() {
                //completeBackFun();
            }
        });
    },
    readFileSucess : function (response) {

        return;
    },
    readFileFailed : function (response) {

        return;
    },
    completeFun : function () {
        return;
    },
    /**
     *  GUID generated
     * @param g
     * @constructor
     */
    newGuid: function () {
        var guid = "";
        for (var i = 1; i <= 32; i++){
            var n = Math.floor(Math.random()*16.0).toString(16);
            guid +=   n;
            if((i==8)||(i==12)||(i==16)||(i==20))
                guid += "-";
        }
        return guid;
    },
    getChromeVersion: function () {
        commonFunc.parameters.pulgInVersion = chrome.app.getDetails().version;
        store.set("pulgInVersion",commonFunc.parameters.pulgInVersion);

    }
    
}


/**
 * all function for badge events
 * @type {{parameters: {timer: null}, init: Function, setBadge: Function, getStockData: Function, getDataUPorDown: Function, startUpdateBadge: Function, endTimes: Function}}
 */

var updateBadge ={
    /**
     *
     */
    parameters:{
        timer: null,
        updateStosckData:""
    },
    init: function () {

        this.setBadge(this.getStockData(),this.getDataUPorDown());
        this.startUpdateBadge();
    },
    updateBadgeData: function (growRate,growPoint,checkStockStatus) {
        var upORdown = "";
        if(growPoint>=0)
            upORdown = "rise";
        else if(growPoint<0)
            upORdown = "drop";

        if(checkStockStatus == "stop")
            upORdown = "stop";

        updateBadge.setBadge(growRate,upORdown);
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
    /**
     *
     * @param stockData
     * @param upORdown  true/up   false/down
     */
    setBadge: function (stockData,upORdown) {
        if(stockData == " -- ")
            stockData = "0.00";
        chrome.browserAction.setBadgeText({text: stockData});
        if(upORdown == "rise")
        {
            chrome.browserAction.setBadgeBackgroundColor({color: [219, 0, 0, 255]});
        }
        else if(upORdown == "drop")
        {
            chrome.browserAction.setBadgeBackgroundColor({color: [36, 168, 0, 255]});
        }
        else if((upORdown == "stop")||(upORdown == ""))
        {
            chrome.browserAction.setBadgeBackgroundColor({color: [66, 66, 66, 255]});
        }
    },
    getStockData: function () {
        var retData = "";
        var stockID = store.get("stockId");
        var stockData = store.get("stockObj");
        for(var item in stockData)
        {
            if(stockData[item].numberCode ==stockID )
            {
                retData = stockData[item].growRate.replace("%","");
            }
        }
        return retData;
    },
    setStockData: function (growRate) {
        var retValue = false;
        var stockID = store.get("stockId");
        var stockData = store.get("stockObj");
        for(var item in stockData)
        {
            if(stockData[item].numberCode ==stockID )
            {
                stockData[item].growRate = growRate +"%";
                store.set("stockObj",stockData);
                retValue = true;
            }
        }

        return retValue;
    },
    getDataUPorDown: function () {
        var upORdown = "";
        var stockID = store.get("stockId");
        var stockData = store.get("stockObj");
        for(var item in stockData)
        {
            if(stockData[item].numberCode ==stockID )
            {
                upORdown = stockData[item].className;
            }
        }
        return upORdown;
    },
    setDataUPorDown: function (growPoint) {
        var retValue = false;
        var upORdown ="";
        var stockID = store.get("stockId");
        var stockData = store.get("stockObj");
        for(var item in stockData)
        {
            if(stockData[item].numberCode ==stockID)
            {
                if(growPoint>=0)
                    upORdown = "rise";
                else if(growPoint<0)
                    upORdown = "drop";

                stockData[item].className = upORdown;
                store.set("stockObj",stockData);
                retValue = true;
            }
        }
        return upORdown;

    },
    startUpdateBadge: function () {
        updateBadge.parameters.timer = setInterval(function() {
            if (updateBadge.vrTime())
            {
                var stockID = store.get("stockId");
                if(stockID!="")
                    updateBadge.updateSelectStock(stockID);
                //var stockData = updateBadge.getStockData();
                //var upORdown = updateBadge.getDataUPorDown();
                //if(stockData!="")
                //updateBadge.setBadge(stockData,upORdown);
            }

        }, 10000);
    },
    endTimes: function () {
        clearInterval(updateBadge.parameters.timer);
    },
    fixed: function(obj, len) {
        return parseFloat(obj).toFixed(len);
    },
    updateSelectStock: function (stockID) {
        var stockUrl = 'http://hq.sinajs.cn/list=' + stockID;



        try {
            var xhr = new window.XMLHttpRequest();

            xhr.open("GET", stockUrl, false);
            xhr.onreadystatechange = function() {

                if (xhr.readyState == 4) {
                    var stockListArray = xhr.responseText.split(";");
                    var stockResponseData = [];
                    var elements = stockListArray[0].split(/_|="|,|"/);
                    stockResponseData[0] = elements;
                    var data = [];
                    var updateItem = 0;
                    for (var item in stockResponseData) {
                        if(stockResponseData[item][3] =="" )
                            break;
                        var arr = stockResponseData[item];
                        var growPoint = arr[6] - arr[5];
                        var growRate = growPoint * 100 / arr[5];
                        var checkStockStatus ="";
                        if(arr[6] == 0)
                        {
                            growRate = 0.00;
                            checkStockStatus = "stop";
                        }


                        updateBadge.updateBadgeData(updateBadge.fixed(growRate,2),updateBadge.fixed(growPoint,2),checkStockStatus);

                        //updateBadge.setStockData(updateBadge.fixed(growRate,2));
                        //updateBadge.setDataUPorDown(updateBadge.fixed(growPoint,2));

                    }

                }

                delete xhr;
            }
            xhr.send();
        } catch(e) { console.error(e); }

    }

}
