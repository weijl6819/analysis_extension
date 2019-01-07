/**
 * CURRENTLY NOT IN USE (YET)
 * controller to handle client messages shown to the user
 * cvm is the prefix for these messages (client visual message)
 */

(function () {

  function notifications($scope, $timeout) {

    var self = this;

    /**
     * not in use right now
     *
     */
    self.NOTIFICATIONS_JSON = {
      "page_already_clipped": {
        "title": "Page Already Clipped",
        "accept": "Add Note",
        "accept_action": "homeCtrl.create"
      },
      "Saved": {
        "title": "Saved"
      },
      "sample": {
        "title": "",
        "body": "",
        "accept": "",
        "accept_action": "",
        "decline": "",
        "decline_action": ""
      }
    };


    /**
     * data contains message and optional time to show the message
     */
    $scope.$on('clipto-inner-app-notification', function(e, data) {

      var message = data.message;
      var time = data.time || 2000; // 2.5 sec by default

      self.message = message;
      $timeout(hideSaveNotification, time);

    });

    var hideSaveNotification = function () {
      self.message = undefined;
    };

  }

  angular.module('clipto')
    .controller('notificationsCtrl', ['$scope', '$timeout', notifications])

}());