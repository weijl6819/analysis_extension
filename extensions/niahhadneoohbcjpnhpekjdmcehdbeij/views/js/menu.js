localStorageClient = chrome.extension.getBackgroundPage().localStorageClient;
cniApiClient = chrome.extension.getBackgroundPage().cniApiClient;
pageManager = chrome.extension.getBackgroundPage().pageManager;

function main() {
    initButtons();
    showMenu();
}

function lockButton() {
    $('#addSite').fadeOut("fast", function () {
        $(this).html('<div class="cssload-thecube">' +
            '<div class="cssload-cube cssload-c1"></div>' +
            '<div class="cssload-cube cssload-c2"></div>' +
            '<div class="cssload-cube cssload-c4"></div>' +
            '<div class="cssload-cube cssload-c3"></div>' +
            '</div>');
        $(this).attr('disabled', true);
        $(this).fadeIn("fast");
    });
}

function unlockButton() {
    $('#addSite').fadeOut("fast", function () {
        $(this).html('<svg class="icon-big">' +
            '<use xlink:href="#add-site"></use>' +
            '</svg>');
        $(this).attr('disabled', false);
        $(this).fadeIn("fast");
    });
}

function showMenu() {
    //zakladamy dlugosc 200px
    $('body')
        .width('195px')
        .addClass('background');

    $('#d-menu-container').show();
    $('#d-selectable').hide();
}

function extractDomain(url) {
    var splittedUrl = url.split(/[/?#]/);
    var domain = splittedUrl[2];
    return domain.replace('www.', '');
}

//initialize
document.addEventListener('DOMContentLoaded', function () {
    main();
});

function initButtons() {

    document.querySelector('#backFromSelectable').addEventListener('click', function (e) {
        showMenu();
        unlockButton();
    });

    var txt = $('#d-hovered-button');
    $('button#showNews').click(showNews).hover(function () {
        showTxt('show news');
    }, function () {
        emptyHover();
    });
    $('button#addSite').click(addSite).hover(function () {
        showTxt('add current site');
    }, function () {
        emptyHover();
    });

    $('button#logIn').click(logInAction).hover(function () {
        showTxt('log in');
    }, function () {
        emptyHover();
    });

    $('button#logOut').click(logOutAction).hover(function () {
        showTxt('log out');
    }, function () {
        emptyHover();
    });

    $('button#markAsUnread').click(markAsUnread).hover(function () {
        showTxt('mark as unread current site');
    }, function () {
        emptyHover();
    });

    $('button#settings').click(openSettings).hover(function () {
        showTxt('open settings');
    }, function () {
        emptyHover();
    });

    refreshButtons();

    function showTxt(text) {
        txt.text(text);
    }

    function emptyHover() {
        txt.text('');
    }
}

function refreshButtons() {
    getCurrentTabUrl(function (url) {

        localStorageClient.getAllValues(function (values) {

            var siteMatchCounter = 0;
            for (var key in values) {
                if (values.hasOwnProperty(key) && key.startsWith('SiteId=')) {

                    var site = values[key];

                    var tabUrl = url.split(/\/\//)[1].toLowerCase();
                    var dbUrl = site.url.split(/\/\//)[1].toLowerCase();

                    if (tabUrl.indexOf(dbUrl) >= 0) {
                        siteMatchCounter++;
                    }
                }
            }

            if (siteMatchCounter <= 0) {
                $('#markAsUnread').attr("disabled", true);
            } else {
                $('#markAsUnread').attr("disabled", false);
            }

        });
    });

    initLogInOutButtons();

    function initLogInOutButtons() {
        localStorageClient.getUserId(function (userId) {
            if (userId.UserId == undefined || userId.UserId == '') {
                $('button#logOut').hide();
                $('button#logIn').show();
            } else {
                $('button#logOut').show();
                $('button#logIn').hide();
            }
        });
    }
}

function logInAction(e) {
    localStorageClient.getUserId(function (userId) {
        lockButton();
        if (userId.UserId == undefined || userId.UserId == '') {
            pageManager.createPage(pageManager.PageName.AUTHENTICATION);
            unlockButton();
        }
    });
}

function logOutAction(e) {

    localStorageClient.getAuthMethod(function (authMethodData) {
        lockButton();
        var authMethod = authMethodData['AuthMethod'];

        if (authMethod == 'GOOGLE') {
            logoutViaGoogle(logOutAction);
        }
        if (authMethod == 'FACEBOOK') {
            logoutViaFacebook(logOutAction);
        }
        if (authMethod == 'CNI') {
            logoutViaCni(logOutAction);
        }

        function logOutAction() {
            renderText('Logged out successfully!');
            $('button#logOut').hide();
            $('button#logIn').show();
            unlockButton();
        }
    });

}

function openSettings(e) {
    pageManager.createPage(pageManager.PageName.SETTINGS);
}

function markAsUnread(e) {
    lockButton();
    getCurrentTabUrl(function (url) {
        var domain = extractDomain(url);

        localStorageClient.getAllValues(function (values) {

            var sites = [];
            for (var key in values) {
                if (values.hasOwnProperty(key) && key.startsWith('SiteId=')) {
                    var site = values[key];

                    var localDomain = extractDomain(site.url).toLowerCase();

                    if (localDomain.indexOf(domain.toLowerCase()) == 0) {
                        site.last_title = '';
                        localStorageClient.saveSite(site, function () {
                            renderText('Site marked as unread.');
                        });
                        sites.push(site);
                    }
                }
            }
            cniApiClient.markAsUnread(sites, function (data) {
                renderText('Site marked as unread.');
            });
        });
    });
}