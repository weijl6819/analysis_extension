/**
 * Created by xjk on 2015/6/14.
 */


var popData ={

    /**
     * [init event]
     *
     */
    init: function () {
        this.addOnloadFuncTobody();
        //this.testButtonFunc();

        //this.addUnloadFuncTobody();
        this.recordDataToServer();

    },
    /**
     * [addIframe add iframe to get server stock page]
     */
    addIframe: function () {
        $('<iframe />');  // Create an iframe element
        $('<iframe />', {
            width : '100%',
            height : '100%',
            name: 'frame1',
            id: 'frame1',
            src: 'http://www.24money.com/stock/stock.html',
            onload: "",
            frameborder: '0'
        }).appendTo('body');

        var t = $('#frame1');
        t.load(function () {
            //popData.startRenderAPI();
        });

    },
    /**
     * [updateBadgeText ]
     */
    updateBadgeText: function () {

    },
    getshowid: function () {
        alert($("#stockId").val());
    },
    /**
     * cross APIs
     * clearIntervalAPI  ,
     */
    //endTimesAPI: function () {
    //    console.log("endTimesAPIendTimesAPIendTimesAPIendTimesAPI");
    //    if(typeof(exec_obj)=='undefined'){
    //        exec_obj = document.createElement('iframe');
    //        exec_obj.name = 'tmp_frame';
    //        exec_obj.src = 'http://www.24money.com/stock/crossframeapi/endTimesAPI.html';
    //        exec_obj.style.display = 'none';
    //        document.body.appendChild(exec_obj);
    //    }else{
    //        exec_obj.src = 'http://www.24money.com/stock/crossframeapi/endTimesAPI.html?' + Math.random();
    //    }
    //},
    //startRenderAPI: function () {
    //    if(typeof(exec_obj)=='undefined'){
    //        exec_obj = document.createElement('iframe');
    //        exec_obj.name = 'tmp_frame';
    //        exec_obj.src = 'http://www.24money.com/stock/crossframeapi/startRenderAPI.html';
    //        exec_obj.style.display = 'none';
    //        document.body.appendChild(exec_obj);
    //    }else{
    //        exec_obj.src = 'http://www.24money.com/stock/crossframeapi/startRenderAPI.html?' + Math.random();
    //    }
    //},
    addOnloadFuncTobody: function () {
        $("body").onload = popData.addIframe();
    },
    recordDataToServer:function() {
        
    var uqid_ = uqid_||store.get('uqid');
    var source_ = source_ || store.get('source');
        var version = store.get("pulgInVersion");
        var type = "chrome";

        var tongjienv = store.get("tongjienv") || "";
        var strUrl = "";
        if(tongjienv == "")
            strUrl = " http://tongji.24money.com/api/statistic_addon.php?uqid="+uqid_+"&version="+version+"&type="+type+"&actionid=ext000001"+"&channelid="+source_;
        else
            strUrl = " http://tongji"+commonFunc.parameters.tongjienv+".24money.com/api/statistic_addon.php?uqid="+uqid_+"&version="+version+"&type="+type+"&actionid=ext000001"+"&channelid="+source_;


        commonFunc.ajaxFun(strUrl,commonFunc.readFileSucess,commonFunc.readFileFailed,commonFunc.completeFun);
    }

}
/**
 * load data
 */
popData.init();

//window.localStorage.setItem("test1",1111);