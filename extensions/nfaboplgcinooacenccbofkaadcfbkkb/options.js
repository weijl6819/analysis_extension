var GQOptions = function() {

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    var _userInfo = {};
    var _yesAccount = $("#gqAccount");
    var _noAccount = $("#gqNoAccount");
    var _connectAccountBtn = $("#gqConnectBtn");
    var _disconnectAccountBtn = $('#gqDisconnectBtn');
    var _accountEmail = $('#gqAccountEmail');

    var _saveBtn = $('#gqSaveBtn');

    var _defaultQueue = $("#gqDefaultQueue");
    var _webDefaultCheckbox = $('#gqWebDefault');
    var _queueDropdown = $('#gqQueueDropdown');

    var _refreshBtn = $('#gqRefreshBtn');



    var GADGET_DATA_URL = "https://www.gqueues.com/gmailGadgetContent";
    //var GADGET_DATA_URL = "https://betagq1-0-0-dot-gqueues-hrd.appspot.com/gmailGadgetContent";
    //var GADGET_DATA_URL = "http://localhost:8080/gmailGadgetContent";


    //--------------------------------------------------------------------------

    var _saveOptions = function(){

        var webDefault = false;

        if(_webDefaultCheckbox.attr('checked')){
            webDefault = true;
        }
                
        var queueKey = _queueDropdown.val();

        chrome.storage.sync.set({   'GQ_STORAGE_WEB_DEFAULT': webDefault,
                                    'GQ_STORAGE_DEFAULT_QUEUE_KEY': queueKey }, function() {
        });
    };


    //--------------------------------------------------------------------------

    var _restoreOptions = function() {

        // set user
        if(_userInfo.authKey){
            _noAccount.addClass('gq-hidden');
            _yesAccount.removeClass('gq-hidden');
            _accountEmail.text(_userInfo.email);

        } else {
            _noAccount.removeClass('gq-hidden');
            _yesAccount.addClass('gq-hidden');

        }

        // set web default
        if(_userInfo.webDefault){
            _webDefaultCheckbox.attr('checked', 'checked');
        } else {
            _webDefaultCheckbox.removeAttr('checked');
        }

    };


    //--------------------------------------------------------------------------

    var _getUserInfo = function(callback) {

        chrome.storage.sync.get([   
            "GQ_STORAGE_AUTH_KEY", "GQ_STORAGE_WEB_DEFAULT", "GQ_STORAGE_USER_EMAIL", "GQ_STORAGE_DEFAULT_QUEUE_KEY"], function(items) {

            var authKey = items["GQ_STORAGE_AUTH_KEY"];
            _userInfo.authKey = authKey;
            if(authKey === undefined || authKey === null || !authKey){
                _userInfo.authKey = null;
            }

            var webDefault = items["GQ_STORAGE_WEB_DEFAULT"];
            _userInfo.webDefault = webDefault;
            if(webDefault === undefined || webDefault === null || !webDefault){
                _userInfo.webDefault = false;
            }

            var email = items["GQ_STORAGE_USER_EMAIL"];
            _userInfo.email = email;
            if(email === undefined || email === null || !email){
                _userInfo.email = null;
            }

            var defaultQueueKey = items["GQ_STORAGE_DEFAULT_QUEUE_KEY"];
            _userInfo.defaultQueueKey = defaultQueueKey;
            if(defaultQueueKey === undefined || defaultQueueKey === null || !defaultQueueKey){
                _userInfo.defaultQueueKey = null;
            }

            callback();

        });

    };

    //--------------------------------------------------------------------------

    var _clearAccount = function() {
        chrome.storage.local.set({ 
                                    "GQ_STORAGE_USER_DATA_KEY" : null,
                                    "GQ_STORAGE_USER_LAST_SYNC" : 0 }, function() {

            chrome.storage.sync.set({ 
                                        "GQ_STORAGE_AUTH_KEY": null,
                                        "GQ_STORAGE_DEFAULT_QUEUE_KEY": null }, function() {
                //console.log('auth key saved');
                window.location.reload();
            });

        });

    };



    //--------------------------------------------------------------------------

    var _getAccountData = function(refresh) {

        var auth = _userInfo.authKey;

        if(!auth){
            _defaultQueue.addClass('gq-hidden');

        } else {

            if(refresh){
                _getAccountDataFromWeb();

            } else {

                _getUserDataFromStorage(function(data){

                    if(!data){
                        _getAccountDataFromWeb();

                    } else {
                        _loadQueueDropdown(data);

                    }

                });
            }

        }
    };

    //--------------------------------------------------------------------------

    var _getAccountDataFromWeb = function() {

        var auth = _userInfo.authKey;

        $.ajax({
            type: "POST",
            cache: false,
            url: GADGET_DATA_URL,
            data: {'authKey': auth},
            dataType: "json",
            success: function(data){
                if(!data.notAllowed){
                    chrome.storage.local.set({'GQ_STORAGE_USER_DATA_KEY': data}, function() {
                        //console.log('GQ_STORAGE_USER_DATA_KEY saved', data);
                    });
                    _loadQueueDropdown(data);
                }

            },
            error: function(request, textStatus, errorThrown){
                _defaultQueue.addClass('gq-hidden');
            }

        });

    };

    //--------------------------------------------------------------------------

    var _getUserDataFromStorage = function(callback) {

        chrome.storage.local.get("GQ_STORAGE_USER_DATA_KEY", function(data) {

            var userDataObj = data["GQ_STORAGE_USER_DATA_KEY"];
            callback(userDataObj);

        });

    };

    //--------------------------------------------------------------------------

    var _loadQueueDropdown = function (data){

        var options = [];
        var newOption;

        options.push('<option value="" selected="selected">Inbox</option>');

        // my queues
        $.each(data.categories, function(i, category){

            newOption = '<option disabled="disabled"> --- ' + category.name + ' --- </option>';
            options.push(newOption);

            $.each(category.queues, function(i, queue){
                newOption = '<option value="' + queue.key + '">' + queue.name + '</option>';
                options.push(newOption);

            });

        });

        // shared queues
        $.each(data.friendships, function(i, friendship){

            newOption = '<option disabled="disabled"> --- ' + friendship.name + ' --- </option>';
            options.push(newOption);

            $.each(friendship.queues, function(i, queue){
                if(queue.collaboration){
                    disabledText = "";
                } else {
                    disabledText = " disabled='disabled' ";
                }
                newOption = '<option value="' + queue.key + '"' + disabledText + '>' + queue.name + '</option>';
                options.push(newOption);

            });

        });

        _queueDropdown.html(options.join(""));
                
        // only set queue key if it exists
        var queueKey = _userInfo.defaultQueueKey;
        if(queueKey) {

            _queueDropdown.find('option').each(function(){
                if(this.value === queueKey){
                    _queueDropdown.val(queueKey)
                    return false;
                }
            });
        }

        _defaultQueue.removeClass('gq-hidden');

    };


    //--------------------------------------------------------------------------

    var _showLoginWindow = function(){

        chrome.runtime.sendMessage({action: "showLoginWindow" }, function(response) { });

    };

    //--------------------------------------------------------------------------

    var _init = function() {

        _disconnectAccountBtn.click(_clearAccount);

        _refreshBtn.click(function(){
            _getAccountData(true);
        });

        _getUserInfo(function(){

            _connectAccountBtn.click(_showLoginWindow);
            _restoreOptions();
            _getAccountData(); 

        });

        _saveBtn.click(function(){
            _saveOptions();
            window.close();
        });

    };


    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

        init: function() {
            _init();
        }
        
    };

}();

//call init on page load
$(GQOptions.init);

