Handlebars.registerHelper("i18nPrefix", function(prefix, str) {
    return chrome.i18n.getMessage(prefix + str);
});

Handlebars.registerHelper("i18n", function(str) {
    return chrome.i18n.getMessage(str);
});

Handlebars.registerHelper("checked", function(id, index) {
    if (currentUser.userSettings.webFilter[id].a === index) return "checked";
});

Handlebars.registerHelper("active", function(id, index) {
    if (currentUser.userSettings.webFilter[id].a === index) return "active";
});

Handlebars.registerHelper("activeyt", function(id, index) {
    if (id.indexOf("yt_45") < 0) {
        if (currentUser.userSettings.ytFilter[id].a === index) return "active";
    } else if (1 == index && 1 == currentUser.userSettings.ytAgeRestriction || 0 == index && 0 == currentUser.userSettings.ytAgeRestriction) return "active";
});

Handlebars.registerHelper("checkedYt", function(id, index) {
    if (id.indexOf("yt_45") < 0) {
        if (currentUser.userSettings.ytFilter[id].a === index) return "checked";
    } else if (1 == index && 1 == currentUser.userSettings.ytAgeRestriction || 0 == index && 0 == currentUser.userSettings.ytAgeRestriction) return "checked";
});

Handlebars.registerHelper("parseATT", function(str) {
    str = str.replace("_", "-");
    return str.split(";");
});

Handlebars.registerHelper("selected", function(index, str) {
    if (currentUser.userSettings.bwList[index][1] == str) return 'selected="selected"';
});

Handlebars.registerHelper("selectedChan", function(index, str) {
    if (currentUser.userSettings.ytChannelList[index][1] == str) return 'selected="selected"';
});

Handlebars.registerHelper("setIndex", function(value) {
    this.index = Number(value);
});