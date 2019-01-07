//
//
// app.controller('bearCtrl',function($scope,$http){
//
// 	var selected_link = 'youtube';
//      $scope.selected_title = selected_link;
//
//      $scope.menu_list = ['youtube', 'instagram'];
//      var req = {
//          method: 'GET',
//          url: 'https://randomuser.me/api/'
//      };
//
//      $scope.menu_clicked = function(e) {
//          var u_selected = $(e.currentTarget).attr("data_link_key");
//          selected_link = u_selected;
//          $scope.selected_title = u_selected;
//          console.log(selected_link);
//          _process(req, selected_link);
//      };
//
//      //refresh  data every X time
//      // setInterval(function() {
//
//  	_process(req, selected_link);
//
//      function _process(req, selected_link) {
//
//          var key = selected_link;
//
//          if (localStorage.getItem(key)) {
//              // get data from localstorage and render
//              get_cache_data(key);
//          } else {
//              $http(req).then(function(response) {
//                  if (response) {
//                      //  data to local storage
//                      store_data(response, key);
//                  }
//              }, function errorCallback(response) {
//                  // called asynchronously if an error occurs
//                  // or server returns response with an error status.
//              });
//          }
//      }
//
//
//      function render_data(response) {
//
//          $scope.test = response.data.results[0].user.gender;
//          console.log($scope.test + 'new data displaying');
//      }
//
//      function get_cache_data(key) {
//          var get_items = JSON.parse(localStorage.getItem(key));
//          //console.log(get_items.data.results[0].user);
//          $scope.test = JSON.stringify(get_items.data.results[0].user.gender);
//          console.log($scope.test + 'cache data displaying');
//      }
//
//      function store_data(response, key) {
//          if (localStorage) {
//              var value = JSON.stringify(response);
//              localStorage.setItem(key, value);
//              render_data(response);
//          } else {
//              console.log("Error: you don't have a localStorage");
//          };
//      }
//
//
//      // }, 10000);
//
//
//
//
//
// });
