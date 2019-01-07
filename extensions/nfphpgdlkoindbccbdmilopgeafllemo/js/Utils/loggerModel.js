
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
function LoggerModel() {

	var self = this;

	self.log_fields = ko.observable();
	self.session_id = ko.observable();
	self.version = ko.observable(1);
	self.username = ko.observable();
	self.domain = ko.observable();
	self.application_name = ko.observable();
	self.added_hashtag = ko.observable();
	self.added_star = ko.observable();
	self.voiceSpeed = ko.observable();
	self.isPredictionVisible = ko.observable();
	self.showAlternatives = ko.observable();
	self.highlightStrategy = ko.observable();
	self.readingStrategy = ko.observable(1);
	self.isPredictNextWord = ko.observable();
	self.active_profile = ko.observable();
	self.profile_settings = ko.observable();
	self.choose_app = ko.observable();
	self.press_play = ko.observable();
	self.press_terms = ko.observable();
	self.textToSend = ko.observable();
	self.chosen_word = ko.observable();
	self.readWordAfterType = ko.observable();
	self.readSentanceAfterType = ko.observable();
	self.readLetterNameTyping = ko.observable();
	self.readLetterSoundTyping = ko.observable();
	self.letterSoundAndLetterNameTyping = ko.observable();

	self.ignoreList = {
		"ignore": ["etalon", "etalonObject", "active_profile", "profile_settings"]
	};

	self.ProfileEtalon = {};

	self.updateEtalon = function () {

		delete self.etalon;
		self.etalon = ko.mapping.toJSON(self, self.ignoreList);
		self.etalonObject = $.parseJSON(self.etalon);
	};

	self.updateProfileEtalon = function () {

		self.ProfileEtalon.active_profile = self.active_profile();
		self.ProfileEtalon.profile_settings = self.profile_settings();
	};


};