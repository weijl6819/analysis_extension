jQuery.fn.visible = function () {
    return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function () {
    return this.css('visibility', 'hidden');
};


function showSelectable(sites, svgObj, formatTitle, formatDescription, onButtonClick) {
    var selectableHtmlElement = $("#selectable");
    selectableHtmlElement.empty();
    // http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
    $.each(sites, function (siteIdx) {
        var imgTopMargin = '5px';
        var imgSize = 24;

        var li = $('<li/>')
            .appendTo(selectableHtmlElement);

        var parentDiv = $('<div/>')
            .attr('title', sites[siteIdx].name)
            .appendTo(li);

        var titleDiv = $('<div/>')
            .html(formatTitle(sites[siteIdx]))
            .css('display', 'inline-block')
            .css('font-weight', 'normal')
            .appendTo(parentDiv);

        var tmp = $('<div/>')
            .attr('id', 'site-news-' + siteIdx)
            .css('display', 'inline-block')
            .insertBefore(titleDiv);

        if (formatDescription != undefined) {
            $('</br>')
                .appendTo(titleDiv);
            $('<div/>')
                .html(formatDescription(sites[siteIdx]))
                .css('display', 'inline-block')
                .css('font-weight', 'bold')
                .css({
                    fontSize: 18
                })
                .appendTo(titleDiv);
            imgTopMargin = '-5px';
        }

        var svg = createActiveSvgElement(siteIdx, imgTopMargin, imgSize, svgObj, sites, onButtonClick);

        var parent = document.getElementById('site-news-' + siteIdx);
        parent.innerHTML = svg.outerHTML;

        tmp.click(sites[siteIdx], onButtonClick);

        li.hover(function (event) {
            $('.img-icon-' + siteIdx).visible();
        }, function () {
            $('.img-icon-' + siteIdx).invisible();
        });
    });

    $('#d-menu-container').hide();
    $('#d-selectable').show();
}

function createActiveSvgElement(siteIdx, imgTopMargin, imgSize, svgObj, sites, onButtonClick) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svg.setAttribute('class', 'img-icon-' + siteIdx);
    svg.setAttribute('style', 'visibility:hidden');
    svg.style.position = 'relative';
    svg.style.right = '5px';
    svg.style.top = imgTopMargin;
    svg.style.display = 'inline-block';
    svg.style.height = svg.style.width = imgSize;
    svg.style.fill = svgObj.color;

    svg.addEventListener('click', function (event) {
        event.data = sites[siteIdx];
        onButtonClick(event);
    });

    use.setAttributeNS('http://www.w3.org/2000/svg', 'xlink:href', svgObj.xlink);

    svg.appendChild(use);
    return svg;
}


function showSelectableForRemove(sitesToRemove, onSuccess, onError) {
    var localStorageClient = chrome.extension.getBackgroundPage().localStorageClient;
    var cniApiClient = chrome.extension.getBackgroundPage().cniApiClient;

    showSelectable(sitesToRemove, {
            xlink: '#remove',
            color: '#CE1717'
        }, function (site) {
            var formattedUrl = formatUrl(site.name);
            return trimUrlToLengthAndAddDots(formattedUrl, 40);
        }, function (site) {
            var formattedUrl = formatUrl(site.url);
            return trimUrlToLengthAndAddDots(formattedUrl, 30);
        },
        function (event) {
            localStorageClient.removeSite(event.data.id, function () {
                cniApiClient.removeUserSite(event.data.id,
                    function (success) {
                        onSuccess(success);
                    },
                    function (error) {
                        onError(error);
                    });
            });
        });

    $('ul')
        .css('position', 'relative')
        .css('top', '10px')
        .css('left', '24%');
}

function showSelectableForAdd(sitesToAdd) {

    showSelectable(sitesToAdd, {
        xlink: '#add-site',
        color: '#6e99dd'
    }, function (site) {
        return trimUrlToLengthAndAddDots(site.name, 45);
    }, undefined, function (event) {
        event.data.last_title = '';
        localStorageClient.saveSite(event.data, function () {
            $('#markAsUnread').attr("disabled", false);
            $('#d-menu-container').show();
            $('#d-selectable').hide();
            renderText('Site saved successfully.');
            cniApiClient.addUserSite(event.data.id,
                function (success) {
                    renderText('Site added to user successfully.');
                },
                function (error) {
                    renderText('Error occurred while trying to add site.');
                });
            showMenu();
        });

        refreshButtons();
    });
    //zakladamy dlugosc 400px
    $('body')
        .css({width: "500px"})
        .removeClass('background');

    $('d-container').removeClass('circle');

    $('li')
        .css('text-align', 'left')
        .css('padding-top', '0px')
        .css('font-weight', 'normal');

    $('ul')
        .css('left', '24%');
}

function formatUrl(url) {
    url = url.replace('http://', '').replace('https://', '');

    if (url.lastIndexOf('/') == url.length - 1) {
        url = url.slice(0, -1);
    }

    if (url.indexOf('www.') == 0) {
        url = url.replace('www.', '')
    }
    return url;
}

function trimUrlToLengthAndAddDots(valueToTrim, maxLength) {
    return valueToTrim.length > maxLength ? valueToTrim.substring(0, maxLength - 3) + '...' : valueToTrim;
}