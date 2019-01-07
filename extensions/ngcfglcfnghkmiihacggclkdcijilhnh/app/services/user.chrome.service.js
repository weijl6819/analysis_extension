(function () {

  function User(AppData) {


    /**
     * User constructor
     * @constructor
     */
    var User = function() {

      this._id = undefined; // server user _id
      this.isSyncUser = false;
      this.userProvidedName = undefined;
      this.appVersion = AppData.getAppVersion();
      this.deviceId = AppData.getDeviceId();
      this.tags = [];
      this.created = Date.now();
      this.verb = 'create';
      this.dbs = [];
    };

    return User;

  }

  angular.module('clipto')
    .factory('User',['AppData', User])

}());