(function () {

  function AuthHttp($http, ENV) {

    var apiEndPoint = ENV.apiEndPoint;

    return {
      //////////////////////////////////////
      /////////// public methods ///////////
      //////////////////////////////////////

      // ****** authentication *******************
      /**
       * send signup data to server
       * @param data
       * @returns {*}
       */
      signup: function (data) {
        var request = {
          method: 'POST',
          url: apiEndPoint + '/api/auth/signup',
          data: data
        };
        return $http(request)
      },

      /**
       * send signin data to server
       * @param data {access_token, credentials}
       * @returns {*}
       */
      signin: function (data) {
        var request = {
          method: 'POST',
          url: apiEndPoint + '/api/auth/signin',
          data: data
        };
        return $http(request)
      },

      /**
       * send oAuth request to server
       * @param data {user}
       * @param providerName
       * @returns {*}
       */
      goToAuthProvider: function (data, providerName) {
        var request = {
          method: 'POST',
          url: apiEndPoint + "/api/auth/" + providerName,
          data: data
        };
        return  $http(request)
      },

      /**
       * log user out
       * @returns {*}
       */
      signout: function () {
        return $http.get(apiEndPoint+'/api/auth/signout')
      },

      /**
       * authenticate the user, using token
       * in case authenticate success, the response is the user. otherwise user=false
       */
      authenticate: function (access_token) {
        var request = {
          method: 'POST',
          url: apiEndPoint + '/api/auth/authenticate',
          data: {"access_token" : access_token}
          //headers: {
          //  'Content-Type': 'x-auth-token'
          //}
        };
        return $http(request)
      },

      //****** password *********************
      /**
       * Password Reset email request
       * @param data {email}
       */
      askForPasswordReset: function (data) {
        var request = {
          method: 'POST',
          url: apiEndPoint + '/api/auth/forgot',
          data: data
        };
        return $http(request)
      }


    }

  }

  angular.module('clipto')
    .factory('AuthHttp', ['$http', 'ENV', AuthHttp])

}());