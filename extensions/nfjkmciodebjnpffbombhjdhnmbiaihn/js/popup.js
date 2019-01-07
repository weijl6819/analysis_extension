var avAPIKey = "J8NXFVNPCM5V2897";
var stockWatchApp = angular.module('stockWatchApp',[]);
stockWatchApp.controller('stockWatchController', function ($scope, $http, $interval, $q) {
    $scope.message = "";
    $scope.stocksData = [];
    $scope.tickerArr = [];
    $scope.expandedArr = [];
    $scope.chartURLArrKey = [];
    $scope.chartURLArrVal = [];
    $scope.chartData = [];
    $scope.chartContextSymbolIdx =0;

    $scope.changeChartURL = function(data,val){
      $scope.chartContextSymbolIdx = $scope.tickerArr.indexOf(data.Symbol);
      $scope.stocksData[$scope.chartContextSymbolIdx].chartURL = val;
      populateChartForTicker(val);
    };
    
    function populateChartForTicker(chartType){
      if(chartType == '1d'){
        $scope.populateChartForOneDay(chartType);
      }else if(chartType == '1m'){
        $scope.populateChartForOneMonth(chartType);
      }else if(chartType == '3m'){
        $scope.populateChartForThreeMonths(chartType);
      }else if(chartType == '6m'){
        $scope.populateChartForsixMonth(chartType)
      }else if(chartType == '1y'){
        $scope.populateChartForOneYear(chartType);
      }else if(chartType == '5y'){
        $scope.populateChartForFiveYear(chartType);
      }
    };
    
    $scope.populateChartForOneDay = function(chartType){
      var timeSeries = $scope.stocksData[$scope.chartContextSymbolIdx].timeSeries;
      var todaysDateTime = new Date(Date.now());
      var count = 79;
      var firstItem = Object.entries(timeSeries).slice(0,1).map(e=> e[0])[0];
      var todaysDate = todaysDateTime.getFullYear() + '-' + (todaysDateTime.getMonth()+1) + '-' + todaysDateTime.getDate();
      if(firstItem.slice(0,10) == todaysDate){
        count = Math.min(79,Math.round((todaysDateTime-Date.parse(todaysDate + " 09:30:00"))/(1000*60*5)));
      }
      var labelsData = Object.entries(timeSeries).slice(0,count).map(e=> e[0].substring(10,16));
      var valueData = Object.entries(timeSeries).slice(0,count).map(e=> Math.round(e[1]["4. close"] * 100) / 100);
      $scope.populateChartWithData(labelsData, valueData,chartType);
    };

    $scope.populateChartForOneMonth = function(chartType){
      var daySeries = $scope.stocksData[$scope.chartContextSymbolIdx].daySeries;
      var labelsData = Object.entries(daySeries).slice(0,25).map(e=> e[0]);
      var valueData = Object.entries(daySeries).slice(0,25).map(e=> Math.round(e[1]["4. close"] * 100) / 100);
      $scope.populateChartWithData(labelsData, valueData,chartType);
    };

    $scope.populateChartForThreeMonths = function(chartType){
      var daySeries = $scope.stocksData[$scope.chartContextSymbolIdx].daySeries;
      var labelsData = Object.entries(daySeries).slice(0,72).map(e=> e[0]);
      var valueData = Object.entries(daySeries).slice(0,72).map(e=> Math.round(e[1]["4. close"] * 100) / 100);
      $scope.populateChartWithData(labelsData, valueData,chartType);
    };
    
    $scope.populateChartForsixMonth = function(chartType){
      $scope.populateChartWithWeekSeries(27,chartType);
    };

    $scope.populateChartForOneYear = function(chartType){
      $scope.populateChartWithWeekSeries(53,chartType);
    };

    $scope.populateChartForFiveYear = function(chartType){
      $scope.populateChartWithWeekSeries(265,chartType);
    };

    $scope.populateChartWithWeekSeries = function(count,chartType){
      var symbol = $scope.tickerArr[$scope.chartContextSymbolIdx];
      var weekSeriesURL = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol="+symbol+"&apikey="+avAPIKey;
      if($scope.stocksData[$scope.chartContextSymbolIdx].weekSeries == undefined){
        $('body').addClass("loading");
        $http.get(weekSeriesURL).then(function(response){
          $('body').removeClass("loading");
          var weekSeries = response.data["Weekly Time Series"];
          $scope.stocksData[$scope.chartContextSymbolIdx].weekSeries = weekSeries;
          var labelsData = Object.entries(weekSeries).slice(0,count).map(e=> e[0]);
          var valueData = Object.entries(weekSeries).slice(0,count).map(e=> Math.round(e[1]["4. close"] * 100) / 100);
          $scope.populateChartWithData(labelsData, valueData,chartType);
        });
      }else{
        var weekSeries = $scope.stocksData[$scope.chartContextSymbolIdx].weekSeries;
        var labelsData = Object.entries(weekSeries).slice(0,count).map(e=> e[0]);
        var valueData = Object.entries(weekSeries).slice(0,count).map(e=> Math.round(e[1]["4. close"] * 100) / 100);
        $scope.populateChartWithData(labelsData, valueData,chartType);
      }
      
    };

    $scope.populateChartWithData = function(labelsData, valueData,chartType){

      var divName = 'chart_div'+$scope.stocksData[$scope.chartContextSymbolIdx].Symbol+chartType;
      var ctx = document.getElementById(divName).getContext('2d');
      
      var chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labelsData.reverse(),
          datasets: [{
            label:"Value",
            backgroundColor: 'blue',
            data: valueData.reverse(),
            pointRadius:2
          }],
          options: {
            legend:{display: false},
          }
        }
      });
    }

    $scope.expandedClick = function(data){
      var symbol = data.Symbol;
      data.expanded = !data.expanded;
      if(!data.expanded){
        return;
      }
      data.chartURL = '1d';
      $scope.chartContextSymbolIdx = $scope.tickerArr.indexOf(symbol);
      populateChartForTicker(data.chartURL);
    }
    
    $scope.loadStockDataFromTickr = function(tickers){
      $scope.stocksData = new Array(tickers.length);
      var httpArr = [];
      $('body').addClass("loading");
      for(var i = 0; i < tickers.length; ++i){
        var tick= tickers[i];
        var timeSeriesURL = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+tick+"&interval=5min&apikey="+avAPIKey;  
        var daySeriesURL = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+tick+"&apikey="+avAPIKey;  
        httpArr.push($http.get(timeSeriesURL));
        httpArr.push($http.get(daySeriesURL));          
      }
      $q.all(httpArr).then(function (responses) {
        for(var i = 0; i <  tickers.length; ++i){
          $('body').removeClass("loading");
          var timeSeries = responses[i*2].data["Time Series (5min)"];
          var daySeries = responses[i*2 + 1].data["Time Series (Daily)"];
          var currVal = timeSeries[Object.keys(timeSeries)[0]]["4. close"];
          
          var prevCloseVal = daySeries[Object.keys(daySeries)[1]]["4. close"];
          var stockChangeinfo = $scope.getStockChangeInfo(currVal, prevCloseVal);
          $scope.stocksData[i] = new $scope.StockObj();
          $scope.stocksData[i].LastTradePriceOnly = currVal;
          $scope.stocksData[i].Symbol = responses[i*2].data["Meta Data"]["2. Symbol"];
          $scope.stocksData[i].Change = stockChangeinfo.change;
          $scope.stocksData[i].PercentChange = stockChangeinfo.pChange;
          $scope.stocksData[i].timeSeries = timeSeries;
          $scope.stocksData[i].daySeries = daySeries;
        }
      });
    };

    $scope.getStockChangeInfo = function(currentVal, prevClose){
      var obj = {
        change:NaN,
        pChange:NaN
      };
      obj.pChange = ''+((currentVal-prevClose)/prevClose)*100;
      obj.change = ''+(currentVal-prevClose);
      return obj;
    };

    $scope.StockObj = function(){
      var obj = {
        Change :NaN,
        PercentChange :NaN,
        LastTradePriceOnly :NaN,
        Symbol :NaN,
        expanded:false
      };
      return obj;
    };
    
    $scope.deleteTicker = function(data){
      var itemArr = $scope.tickerArr;
      var index = itemArr.indexOf(data.Symbol);
      
      var chartIdx = $scope.chartURLArrKey.indexOf(data.Symbol);
      $scope.chartURLArrKey = $scope.chartURLArrKey.splice(chartIdx,1);
      $scope.chartURLArrVal = $scope.chartURLArrVal.splice(chartIdx,1);
      if (index > -1) {
        itemArr.splice(index, 1);
      }
      if(itemArr.length == 0){
        itemArr = [];
      }
      chrome.storage.sync.set({ "tickers" : itemArr }, function() {
            if (chrome.runtime.error) {
              $scope.message = "Error deleting stock";
            }else{
              $scope.stocksData.splice(index,1);
              $scope.$apply();
            }
          }); 
    };
    
    $scope.reloadStockData = function(){
      chrome.storage.sync.get("tickers", function(items) {
        if (!chrome.runtime.error) {
          if(items.tickers !== undefined){
            $scope.tickerArr = items.tickers;
            $scope.loadStockDataFromTickr($scope.tickerArr);  
          }else{
            $scope.message = "There are no stocks in watch list, Enter Ticker id below to start watching.";
          }
        }
      });
    };
    
    $scope.addToWatchList = function(){
      var tckr = $scope.tckrEntered;
      if(!tckr){
        $scope.message = "Please enter a ticker";
        return;
      }
      var url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+tckr+"&interval=1min&apikey="+avAPIKey;  ;
      $('body').addClass("loading");
      $http.get(url).then(
        function(response){
          $('body').removeClass("loading");
          if(response.data["Error Message"] != undefined){
            $scope.message = "Ticker " + tckr + " is not available";
          }else{
            $scope.AddTickerToChrome();
            $scope.message = "";
          }
        }, function(response){
          console.log("error");
        });
    };
    
    $scope.AddTickerToChrome = function(){
      chrome.storage.sync.get("tickers", function(items) {
        if (!chrome.runtime.error) {
          var ticks = [$scope.tckrEntered];
          if(items.tickers !== undefined){
            ticks = ticks.concat(items.tickers);
          }
          ticks = ticks.filter(function (item, pos) {return ticks.indexOf(item) == pos;});
          chrome.storage.sync.set({ "tickers" : ticks }, function() {
            if (chrome.runtime.error) {
              $scope.message = "Error! Stock not added to watch list";
            }else{
              $scope.reloadStockData();
              $scope.tckrEntered = "";
            }
          }); 
        }else{
          $scope.message = "Error! Stock not added to watch list";
        }
      });
    };
    $scope.reloadStockData();
    $interval($scope.reloadStockData,300000);
    //$scope.tickerArr = ["goog","msft"];
    //$scope.loadStockDataFromTickr($scope.tickerArr); 
});