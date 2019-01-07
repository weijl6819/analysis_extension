String.prototype.isEmpty = function () {
    return (0 === this.trim().length);
};
var UserCredentials = (function () {
    function UserCredentials() {
        this.uid = window.localStorage.getItem("uLogin.login");
        this.password = window.localStorage.getItem("uLogin.password");
    }
    UserCredentials.prototype.save = function () {
        window.localStorage.removeItem("uLogin.login");
        window.localStorage.removeItem("uLogin.password");
        if(this.valid()) {
            window.localStorage.setItem("uLogin.login", this.uid);
            window.localStorage.setItem("uLogin.password", this.password);
        }
    };
    UserCredentials.prototype.valid = function () {
        return (this.uid != null && !this.password != null && !this.uid.isEmpty() && !this.password.isEmpty());
    };
    return UserCredentials;
})();
var credentials = new UserCredentials();
$('#loginInput').val(credentials.uid);
$('#passwordInput').val(credentials.password);
$('#sign-up-link').text(chrome.i18n.getMessage("register"));
$('#extension-name').text(chrome.i18n.getMessage("name"));
$('#pass-remind').text(chrome.i18n.getMessage("forgot"));
$('#sbm-button').text(chrome.i18n.getMessage("save"));
$('#create-site').text(chrome.i18n.getMessage("create-site"));
$("#loginInput").attr("placeholder", chrome.i18n.getMessage('email'));
$("#passwordInput").attr("placeholder", chrome.i18n.getMessage('password'));
$("#pass-remind").attr("href", chrome.i18n.getMessage('remind_link'));
var site = chrome.i18n.getMessage('site');
$('a[href]').each(function () {
    this.href = this.href.replace("http://www.ucoz.com", site);
});
$('#sbm-button').click(function () {
    credentials.uid = $('#loginInput').val();
    credentials.password = $('#passwordInput').val();
    if(!credentials.valid()) {
        ($).gritter.removeAll();
        ($).gritter.add({
            title: chrome.i18n.getMessage("name"),
            text: chrome.i18n.getMessage("enter_login"),
            class_name: 'gritter-item',
            fade_in_speed: 'fast',
            fade_out_speed: 'fast',
            time: 3000
        });
        return;
    }
    credentials.save();
    ($).gritter.add({
        title: chrome.i18n.getMessage("name"),
        text: chrome.i18n.getMessage("data_saved"),
        class_name: 'gritter-item',
        fade_in_speed: 'fast',
        fade_out_speed: 'fast',
        time: 3000
    });
});
