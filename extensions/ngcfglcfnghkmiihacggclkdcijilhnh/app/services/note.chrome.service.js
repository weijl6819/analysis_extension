(function () {

  function Note(LCUtils, AppData, Events, $rootScope) {

    var onError = function (error) {
      console.log(Error(error));
    };

    /**
     * helper function to clean objects from Angular's $$ prefixed keys (mongo doesnt like $$)
     * used for cleaning tags
     * @param obj
     * @return json object
     */
    function cleanJson(obj) {
      return JSON.parse(angular.toJson(obj));
    }

    /**
     * get the page title, if it's a pdf, get the file name as title.
     *
     * @param pageTitle
     * @param pageUrl
     * @returns {*}
     */
    function getPageTitle(pageTitle, pageUrl) {

      var result;

      if (pageTitle && pageTitle.length > 0) {
        result = pageTitle;
      } else {
        var pdfIndex = pageUrl.indexOf('.pdf');
        var urlArray = pageUrl.split("/");

        result = pdfIndex === -1 ? 'Untitled Page' : urlArray[urlArray.length -1];
      }
      return result;
    }

    /**
     * Note constructor
     * @constructor
     */
    var Note = function () {

      this.properties = {
        localUserId: undefined,
        user_id: undefined,
        _id: undefined, //_id will be created by background page
        dbId: undefined,
        url: undefined,
        domain: undefined,
        verb: undefined, //verb will be created by background page
        tags: [],
        created: undefined, // will be created by background page
        modified: undefined, // will be created by background page
        items: []
      }
    };

    /**
     * Helper function for debugging
     */
    Note.prototype.logProperties = function () {
      console.log('***************************************');
      console.log(this.properties);
      console.log('***************************************');
    };

    /**
     * set final note properties and return a promise
     *
     * @returns {*|f}
     */
    Note.prototype.setNewNoteProperties_Promise = function () {

      var self = this;
      var now = Date.now();

      return new Promise(function (resolve, reject) {

        // ask nicely for the current page data (url, title) - for SPA websites
        Events.message_getPageData();
        // make sure these are correct, can change on SPA
        $rootScope.$on('current-page-data', function (event, data) {

          self.properties.pageTitle = getPageTitle(data.title , data.url);
          self.properties.url = data.url;
          self.properties._id = new Date().toISOString();
          self.properties.created = now.toString();
          self.properties.modified = now.toString();
          self.properties.dbId = AppData.getActiveDb();
          self.properties.verb = 'create';
          self.properties.domain = AppData.getActiveTabDomain();
          self.properties.localUserId = AppData.getActiveUser().localUserId;
          self.properties.user_id = AppData.getActiveUser()._id ? AppData.getActiveUser()._id : AppData.getActiveUser().localUserId;

          // clean tags from $$hashKey
          self.properties.tags = self.properties.tags ? cleanJson(self.properties.tags) : [];
          self.properties.showHidden = undefined;
          self.properties.activeItemId = undefined;

          if (
            self.properties._id
            && self.properties.created
            && self.properties.modified
            && self.properties.verb
            && self.properties.url
            && self.properties.domain
            && self.properties.localUserId
            && self.properties.dbId
            && self.properties.pageTitle
            && self.properties.user_id
          ) {
            resolve(self.properties);
          }
          else {
            console.log(self.properties);
            reject(Error('Error on Note.setNewNoteProperties_Promise'));
          }
        });
      });

    };

    /**
     * create a note by sending it to the background with a create-new-note message
     * background page will add the tags to the user in case of new tags
     *
     */
    Note.prototype.create = function (options) {

      var self = this;
      options = options && options !== null ? options : {};
      options.isSync = options.isSync ? options.isSync : true; //sync anyway on create
      options.origin = options.origin ? options.origin : 'app'; // app by default is the origin of creation

      self.setNewNoteProperties_Promise().then(function (noteProperties) {
        var data = {
          noteProperties: noteProperties,
          itemId: options.itemId,
          isSync: options.isSync,
          origin: options.origin,
          user: AppData.getActiveUser()
        };
        Events.sendMessage('clipto-create-new-note', data);
        //return self;
      });
    };

    /**
     * update a note by sending itself to background
     * isSync is optional and will be true in case we need to sync with cloud
     */
    Note.prototype.update = function (options) {

      var self = this;
      options = options && options !== null ? options : {};
      options.isSync = options.isSync ? options.isSync : false; // DO NOT sync if not specified (for auto save not floading server)
      options.origin = options.origin ? options.origin : 'app'; // app by default is the origin of creation

      // clean tags from $$hashKey
      self.properties.tags = self.properties.tags ? cleanJson(self.properties.tags) : [];
      self.properties.showHidden = undefined;
      self.properties.activeItemId = undefined;

      var data = {
        noteProperties: self.properties,
        isSync: options.isSync,
        itemId: options.itemId,
        origin: options.origin,
        user: AppData.getActiveUser()
      };
      Events.sendMessage('clipto-update-note', data);
    };

    /**
     * delete a note by sending it's _id and _rev to the background with a delete-note message
     */
    Note.prototype.delete = function (options) {
      var self = this;
      options = options && options !== null ? options : {};
      options.isSync = options.isSync ? options.isSync : true; //sync anyway on remove
      options.origin = options.origin ? options.origin : 'app'; // app by default is the origin of creation

      var data = {
        noteProperties: self.properties,
        origin: options.origin,
        isSync: options.isSync,
        user: AppData.getActiveUser()
      };
      Events.sendMessage('clipto-delete-note', data)
    };

    // return Note as the service
    return Note;
  }


  angular.module('clipto')
    .factory('Note', ['LCUtils', 'AppData', 'Events', '$rootScope', Note])

}());