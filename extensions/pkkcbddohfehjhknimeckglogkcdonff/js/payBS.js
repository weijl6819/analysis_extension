/**
 * Created by xjk on 2015/7/21.
 */
var payBS = {
    parameter:{
        defaultURL:{
            prepareOrder_default:[
                "cashier.jd.com/payment/gradedPay.action",//
                "cashier.jd.com/payment/pay.action",
                "my.yhd.com/order/changePaymentForFinishOrder.do",
                "my.yhd.com/order/finishOrder.do",
                "tracker.yhd.com/tracker/newInfo.do",
                "www.amazon.cn/gp/css/order/edit.html",
                "www.amazon.cn/gp/css/order-history/utils/first-order-for-customer.html/ref=ya_prefetch_open_order_ap"
            ],
            online_url_default:[
                "tcashier.jdpay.com/payment.htm",
                "mapi.alipay.com/gateway.do",
                "my.yhd.com/gateway/select_gateway.do",
                //"pay.yizhifubj.com/customer/gb/pay_bank.jsp"
                //"www.amazon.cn/ap/signin",
                "www.amazon.cn/gp/css/ep/repay-pending-transactions.html"
            ],
            check_redirect_url_default:[
                "b2c.icbc.com.cn",
                "ibsbjstar.ccb.com.cn",
                "boc.cn",
                "abchina.com",
                "easyabc.95599.cn",
                //"pay.95559.com.cn",
                //"cmbchina.com",
                //"cgbchina.com.cn",
                //"per.cmbc.com.cn",
                //"hxb.com.cn",
                //"cib.com.cn",
                //"cebbank.com",
                //"pbank.psbc.com",
                //"netpay.pingan.com.cn",
                //"ebank.srcb.com",
                //"epay.bankofshanghai.com",
                //"ebank.spdb.com.cn",
                //"tradeexprod.alipay.com/fastpay/securityCheck.htm",
            ]
        },
        enumData:{
            OpenGKAppStatus:{
                LAUNCH_ALREADY:0,       //GKAPP已经打开
                LAUNCH_SUCESS:1,    //GKAPP打开成功
                LAUNCH_FAILED:2,    //GKAPP打开失败
                GKAPP_CLOSED:3	    //GKAPP没有打开
            },
            dataType:{header:"header data",post:"post data"},
            actionType:{noaction:"",openurl:"openUrl",openapp:"openGKApp",getuqid:"getUqid",setCo:"setCo"}
        },
        windowInfo:{
            g_tabId:0
        },
        nativeMsg:{
            port:null,
            hostName:"com.goldenkey.chrome.namsg.gk",
        },
        tongji:{
            uqid : null,
            storage : window.localStorage
        },
        status:{
            wakeUPStatus:false,
            payErrorHandler : true
        }

    },
    init: function () {

    },
    yhdCookieSync: function (data) {
        for (var i = data.length - 1; i >= 0; i--) {
            var item = data[i];
            if(item.hasOwnProperty("name")){
                if(item["name"] = "Cookie"){
                    console.log(item["value"]);
                    namsgbg.SendNativeMsg({"action":payBS.parameter.enumData.actionType.setCo, "param": item});
                    break;
                }
            }
        }
    },
    getUqid: function () {
        var param_value = "";
        namsgbg.SendNativeMsg({"action":payBS.parameter.enumData.actionType.getuqid, "param": param_value});
    },
    checkLocalData: function () {
        this.getUqid();
        if (payBS.parameter.tongji.storage.getItem("lsUqid") != null)
        {
            payBS.parameter.tongji.storage.setItem("lsUqid",uqid);
        }
    },
    checkBeforeSendHeadersData: function (detailsData,urlCheckedList,selectedDataType,action) {
        try {
            var url = detailsData.url;
            var requestHeader = detailsData.requestHeaders;
            var requestBody = detailsData.requestBody;
            for(var len = 0; len < urlCheckedList.length; len++){
                if(selectedDataType == payBS.parameter.enumData.dataType.header) {
                    if (url.indexOf(urlCheckedList[len]) >= 0) {
                        request_datas.url = url;
                        request_datas.headers = requestHeader;
                        request_datas.need_redirect = true;
                        //only support bank and openapp action will send message to Client exe
                        if((commonFunc.checkSupportBank(url)==true)||(action !=payBS.parameter.enumData.actionType.openurl ))
                            request_datas.sendToNativeMsg(action);

                    }
                }
            }
        } catch(e) { console.error(e); }
    },
    checkBeforeRequestData: function (detailsData, urlCheckedList, selectedDataType, action) {
        try {
            var url = detailsData.url;
            var requestBody = detailsData.requestBody;
            for(var len = 0; len < urlCheckedList.length; len++){
                if(selectedDataType == payBS.parameter.enumData.dataType.post){
                    if(url.indexOf(urlCheckedList[len]) >= 0){
                        request_datas.request_body = requestBody;
                    }
                }
            }
        } catch(e) { console.error(e); }
    }


}



/**
 * request struct data
 * @header
 * @request_body
 * @url
 * @need_redirect
 * @sendToNativeMsg
 */
var request_datas ={
    parameter:{
        headers:undefined,
        request_body : undefined,
        url : undefined,
        need_redirect:false,
    },
    init: function () {

    },
    sendToNativeMsg: function (action) {
        var headers = JSON.stringify(request_datas.parameter.headers);
        var postData;
        if(request_datas.parameter.request_body != undefined)
            postData = JSON.stringify(request_datas.parameter.request_body.formData);
        var param_value;
        if(postData != undefined)
            param_value = {"url":request_datas.url,"headers":headers ,"postdata": postData};
        else
            param_value = {"url":request_datas.url,"headers":headers };
        //console.log("before send data:"+ "action" + action+"param value"+param_value);
        namsgbg.SendNativeMsg({"action":action, "param": param_value});
        //console.log("++++++Para Data++++++++t" +JSON.stringify(headerInfo.request[need_ID].requestHeaders)+ "post Data" + form.data);
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


