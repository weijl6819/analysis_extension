function getLoginInfo() {
    var userInfo = { login: null, password: null };
    userInfo.login = window.localStorage.getItem("webtop.login");
    userInfo.password = window.localStorage.getItem("webtop.password");
    return userInfo;
}

function setLoginInfo(user, pass) {
    window.localStorage.removeItem("webtop.login");
    window.localStorage.removeItem("webtop.password");

    if (user != "" && pass != "") {
        window.localStorage.setItem("webtop.login", user);
        window.localStorage.setItem("webtop.password", pass);
    }
}