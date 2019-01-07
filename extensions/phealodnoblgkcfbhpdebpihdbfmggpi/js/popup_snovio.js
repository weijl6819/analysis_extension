var currentHost;

function showCompanyInfo(companyInfo) {
    if (companyInfo) {
        $('.company-info').removeClass('hidden');
    }

    if (companyInfo.name) {
        $('.company-title').text(companyInfo.name);
        $('.company-name').removeClass('hidden');
    }

    if (companyInfo.img) {
        $('.company__logo img').attr('src', companyInfo.img);
        $('.company__logo').removeClass('hidden');
    }

    if (companyInfo.founded) {
        $('.company-info__item.founded').html('<span>Founded:</span>' + '<span>' + companyInfo.founded + '</span>');
        $('.company-info__item.founded').removeClass('hidden');
    }

    if (companyInfo.size) {
        $('.company-info__item.size').html('<span>Size:</span>' + '<span>' + companyInfo.size + '</span>');
        $('.company-info__item.size').removeClass('hidden');
    }

    if (companyInfo.address) {
        $('.company-info__item.country').html('<span>Country:</span>' + '<span>' + companyInfo.address + '</span>');
        $('.company-info__item.country').removeClass('hidden');
    }

    if (companyInfo.industry) {
        $('.company-info__item.industry').html('<span>Industry:</span>' + '<span>' + companyInfo.industry + '</span>');
        $('.company-info__item.industry').removeClass('hidden');
    }

    if (companyInfo.socials) {

        if (companyInfo.socials.linkedIn) {
            $('.company-socials').append('<a href= "' + companyInfo.socials.linkedIn + '" target="_blank" ' +
                'class="company-socials__item icon-linkedin2"></a>');
        };

        if (companyInfo.socials.yelp) {
            $('.company-socials').append('<a href= "' + companyInfo.socials.yelp + '" target="_blank" ' +
                'class="company-socials__item icon-yelp"></a>');
        };

        if (companyInfo.socials.facebook) {
            $('.company-socials').append('<a href= "' + companyInfo.socials.facebook + '" target="_blank" ' +
                'class="company-socials__item icon-facebook"></a>');
        };

        if (companyInfo.socials.twitter) {
            $('.company-socials').append('<a href= "' + companyInfo.socials.twitter + '" target="_blank" ' +
                'class="company-socials__item icon-twitter"></a>');
        };
    };

    $('.company-socials').removeClass('hidden');
};

function showLogin() {
    $('.footer__log-in').removeClass('hidden');
    // document.getElementById('footerLogin').style.visibility = 'visible';
};

function showUserLists(result, selectId, defaultListId) {
    list = document.getElementById('userList');
    if (result && result.result && result.list) {
        list.innerHtml = '';
        for (var iNo = 0; iNo < result.list.length; iNo++) {
            if (defaultListId == 0) {
                defaultListId = result.list[iNo].id;
            }
            var option = document.createElement('option');
            option.text = result.list[iNo].name;
            option.value = result.list[iNo].id;
            list.add(option);

            if (defaultListId == result.list[iNo].id) {
                option.selected = true;
            }
        }
        $('#footerUserLists').removeClass('hidden');
        // document.getElementById('footerUserLists').style.visibility = 'visible';
    }
    document.getElementById('btnSendtoList').onclick = sendCompany;
};

function showListLink() {
    $button = $('#btnSendtoList');
    var $link = $button.next('a');
    var listID = $('#userList').val();
    void 0;
    var section = $link.data('section');
    var url = mainHost + '/companies' + '/list/' + listID;
    $button.addClass('hidden');
    $link.attr('href', url).removeClass('hidden');
};

function showStartSending() {
    $('#btnSendtoList').button('loading');
};

function showStars() {
    if (document.getElementById('allStars')) {
        var impressions = 0;
        if (localStorage['impressions']) {
            impressions = localStorage['impressions'];
        }
        impressions++;
        localStorage['impressions'] = impressions;

        if (((impressions > 20) && (impressions < 26)) || ((impressions > 40) && (impressions < 51))
            || (impressions == 60) || (impressions == 70) || (impressions == 80) || (impressions == 90)
            || (impressions == 100) || (impressions == 200) || (impressions == 500) || (impressions == 1000)) {
            if (localStorage['needShowRate'] == undefined) {
                localStorage['needShowRate'] = 1;
            }
        } else {
            if (localStorage['needShowRate'] == 1) {
                localStorage.removeItem('needShowRate');
            }
        }

        if (localStorage['needShowRate'] && localStorage['needShowRate'] == 1) {
            $('.contacts-table').css('max-height', '200px');

            document.getElementById('allStars').classList.remove('hidden');

            document.getElementById('star-5').addEventListener('click', function () {
                document.getElementById('allStars').classList.add('hidden');
                localStorage['needShowRate'] = 0;

                var newURL = 'https://chrome.google.com/webstore/detail/snovio-web-technology-che/phealodnoblgkcfbhpdebpihdbfmggpi/reviews';
                chrome.tabs.create({ url: newURL });

                localStorage['star'] = 5;
            });

            function badEval(star) {
                document.getElementById('badEval').classList.remove('hidden');
                document.getElementById('allStars').classList.add('hidden');
                localStorage['needShowRate'] = 0;
                localStorage['star'] = star;
            }

            document.getElementById('star-1').addEventListener('click', function () { badEval(1); });
            document.getElementById('star-2').addEventListener('click', function () { badEval(2); });
            document.getElementById('star-3').addEventListener('click', function () { badEval(3); });
            document.getElementById('star-4').addEventListener('click', function () { badEval(4); });
        }
    }
}

function sendCompany() {
    showStartSending();
    var params = 'listId=' + $('#userList').val() + '&url=' + currentHost;

    fetch(mainHost + '/api/createCompanyByUrl', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: params
    })
        .then(res => {
            showListLink();
            if (res.headers.get('content-type').includes('application/json')) {
                return res.json().then(data => {
                    console.log(JSON.stringify(data));
                });
            }
        })
};

function getUserLists(forced) {
    var type = 'company';
    // var lastUpdateList = localStorage['lastUpdateList_' + type];
    // var userList = localStorage['userList_' + type];
    // if (userList) {
    //     userList = JSON.parse(userList);
    // }

    // if (!forced && (!localStorage['needUpdateUserLists'] || (localStorage['needUpdateUserLists'] == 0))
    //     && lastUpdateList && userList && ((new Date().getTime() - lastUpdateList) < 86400000)) {
    //     showUserLists(userList);
    // } else {
    var params = '';
    if (type) {
        params = 'type=company';
    }
    fetch(mainHost + '/api/getUserLists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: params
    })
        .then(res => {
            res.json().then(function (data) {

                showUserLists(data);

                if (data.result) {
                    localStorage['userList_' + type] = JSON.stringify(data);
                    localStorage['lastUpdateList_' + type] = (new Date().getTime());
                    localStorage['needUpdateUserLists'] = 0;
                }
            });
        });
    // }
};

function showFooter(auth) {
    if (auth) {
        getUserLists();
    } else {
        showLogin();
    }
};

function getCompanyByDomain(hostname) {
    var parser = document.createElement('a');
    parser.href = hostname;
    currentHost = parser.host;

    fetch(mainHost + '/api/getCompanyWithInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include',
        body: 'url=' + currentHost,
    })
        .then(res => {
            if (res.ok) {
                res.json().then(function (data) {
                    if (data.result && data.company) {
                        console.log(data);
                        showCompanyInfo(data.company);
                    }
                    if (data.noAuth) {
                        checkAuthentication(showFooter);
                    } else {
                        getUserLists();
                    }
                })
            }
        })
        .catch(res => {
            console.log(res)
        });
};
