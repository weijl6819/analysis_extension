function addToUser(site, onSuccess, onError) {

    localStorageClient.getSiteBy(site.id, function (data) {
        var localSite = data['SiteId=' + site.id];

        if (localSite != undefined) {
            renderText('Oh, you already have that site!');
        } else {
            localStorageClient.saveSite(site, function () {
                $('#removeSite').show();
                $('#markAsUnread').attr("disabled", false);
                renderText('Site saved successfully.');
                //jesli uzytkownik jest zarejestrowany - zapisz w api
                cniApiClient.addUserSite(site.id,
                    function (success) {
                        if (onSuccess != undefined) {
                            onSuccess(success);
                        }
                        renderText('Site added to user successfully.');
                    },
                    function (error) {
                        if (onError != undefined) {
                            onError(error);
                        } else {
                            renderText('Oh, I\'m sorry, there was an error while trying to add your site.');
                        }
                    });
            });
        }
    });
}

function addSite(e) {
    lockButton();
    getCurrentTabUrl(function (url) {
        //TODO:: obsluga bledow api
        //ucinamy do postaci http://domain.com

        var domain = extractDomain(url);

        cniApiClient.querySite(domain, function (sites) {
            // jesli jedna strona to obslugujemy tak jak zwykle

            var propositions = [];

            for (var i = 0; i < sites.length; i++) {

                //probujemy dopasowac biezacy url do wynikow wyszukanych w BD

                var tabUrl = url.split(/\/\//)[1].toLowerCase();
                var dbUrl = sites[i].url.split(/\/\//)[1].toLowerCase();

                if (tabUrl.indexOf(dbUrl) >= 0) {
                    propositions.push(sites[i]);
                }
            }

            //liczymy odleglosc levensteina, jesli odleglosc levensteina mniejsza od 10
            //czyli, że trzeba wykonać 4 ruchy aby doprowadzić z jednego url do drugiego
            //to zakladamy, że chodzi o tą wlasnie strone
            //parametrem możemy sterować, przyjąłem 10, ale śmiało można sprobowac z mniejszymi liczbami
            if (propositions.length == 1 && tabUrl.levenshteinDistance(dbUrl) <= 4) {
                propositions[0].last_title = '';
                addToUser(propositions[0], function () {
                    //nothing to do
                });
            } else if (propositions.length > 1) {

                localStorageClient.getAllValues(function (values) {
                    for (var key in values) {
                        if (values.hasOwnProperty(key) && key.startsWith('SiteId=')) {
                            var site = values[key];

                            for (var idx = 0; idx < propositions.length; idx++) {
                                if (site.rss_link == propositions[idx].rss_link) {
                                    propositions.splice(idx, 1);
                                    idx--;
                                }
                            }
                        }
                    }

                    if (propositions.length > 0) {
                        showSelectableForAdd(propositions);
                    } else {
                        renderText('Oh, you\'ve added all feeds of that page...');
                    }
                });
            } else {
                sites.length = 0;
            }
        }, function (siteList) {
            //jesli nie odnaleziono strony to wywolaj probe dodania przez API
            if (siteList.length == 0) {
                cniApiClient.addSite(url, function (site) {
                    $('#markAsUnread').attr("disabled", false);
                    renderText('Site added to database successfully.');
                    addToUser(site);
                }, function (error) {
                    renderText('Oh, I\'m sorry, there was an error while trying to add your site.');
                });
            }
        });
    });
}