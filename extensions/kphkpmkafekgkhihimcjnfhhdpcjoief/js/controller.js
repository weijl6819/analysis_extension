angular
    .module('bearApp')
    .controller('bearCtrl', mainProcess);

function mainProcess($scope, $http) {


    $scope.openRHS = function () {
        console.log('RHS');
        $scope.openRightPanel = true;
        $scope.closeRightPanel = false;
    }

    $scope.closeRHS = function () {
        console.log(' close RHS');
        $scope.closeRightPanel = true;
        $scope.openRightPanel = false;

    }

    //someFactory.sayhello();

    var selected_link = 'vbPicks';
   $scope.selected_title = selected_link;

   	$scope.menu_list = ['youtube', 'instagram','reddit'];
   var req = {
     method: 'GET',
     url: 'https://api.fieldbook.com/v1/56c4885493259f03009c138e/test/'
   };

   $scope.menu_clicked = function(e) {
     var u_selected = $(e.currentTarget).attr("data_link_key");
     selected_link = u_selected;
     $scope.selected_title = u_selected;
     console.log(selected_link);

   };




   if (navigator.onLine) {
       console.log('onLine');
       _process(req, selected_link);
   } else {
       console.log('offline');
       var key = selected_link;
       if (localStorage.getItem(key)) {
         // get data from localstorage and render
         get_cache_data(key);
     }
   }




    function _process(req, selected_link) {
      var key = selected_link;
      if (localStorage.getItem(key)) {
        // get data from localstorage and render
        get_cache_data(key);

        //get current timestamp

      } else {
        $http(req).then(function(response) {
          if (response) {
            //  data to local storage
            store_data(response, key);
          }
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
      }
    }


    function render_data(response) {

      $scope.test = response.data;
      console.log('new list fetched');
    }

    function get_cache_data(key) {
      // get current timestamp and cache timestamp for comarison
      var now_timestamp = new Date().getTime().toString() / 1000;
      var get_items = JSON.parse(localStorage.getItem(key));
      var cache_timestamp = get_items.timestamp / 1000;
      var diff_timestamp = now_timestamp - cache_timestamp;
      var time_limit = 600;
      console.log(diff_timestamp);

      //check if time diff is greater than x minutes
      if (diff_timestamp > time_limit) {
        //render when comparison is ok
        $http(req).then(function(response) {
          if (response) {
            //  data to local storage
            store_data(response, key);
          }
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

      } else {
        $scope.test = get_items.value.data;
      }
    }



    function store_data(response, key) {
      if (localStorage) {
        var timestamp_str = new Date().getTime();
        var object = {
          timestamp: timestamp_str,
          value: response
        };
        var obj = JSON.stringify(object);
        localStorage.setItem(key, obj);
        render_data(response);
      } else {
        console.log("Error: you don't have a localStorage");
      };
    }

 }
