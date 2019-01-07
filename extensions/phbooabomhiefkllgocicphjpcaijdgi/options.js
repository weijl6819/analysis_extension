var userInfo = getLoginInfo();
$('#loginInput').val(userInfo.login);
$('#passwordInput').val(userInfo.password);
$('#cont-title-mid').text(chrome.i18n.getMessage("name"));
$('#pass-remind').text(chrome.i18n.getMessage("forgot"));
$('#sbm-button').text(chrome.i18n.getMessage("save"));

$("#loginInput").attr("placeholder", chrome.i18n.getMessage('email'));
$("#passwordInput").attr("placeholder", chrome.i18n.getMessage('password'));
$("#pass-remind").attr("href", chrome.i18n.getMessage('remind_link'));

$('#sbm-button').click(function() {
            var login = $('#loginInput').val();
            var password = $('#passwordInput').val();

            if (login == "" || password == "") {
                $.gritter.removeAll();
                $.gritter.add({
                    title: chrome.i18n.getMessage("name"),
                    text: chrome.i18n.getMessage("enter_login"),
                    class_name: 'gritter-item',
                    fade_in_speed: 'fast',
                    fade_out_speed: 'fast',
                    time: 3000
                });
                return;
            }


            setLoginInfo(login, password);

            $.gritter.add({
                title: chrome.i18n.getMessage("name"),
                text: chrome.i18n.getMessage("data_saved"),
                class_name: 'gritter-item',
                fade_in_speed: 'fast',
                fade_out_speed: 'fast',
                time: 3000
            });
        });
