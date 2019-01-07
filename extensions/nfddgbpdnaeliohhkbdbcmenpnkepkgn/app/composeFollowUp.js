
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
var _buildTemplateDropdown = function (composeView, selectElem) {
    var templates = composeView.afuTemplates;
    selectElem.options.length = 0;
    var ret = '', option;
    var lastTmplFound = false;
    for (var name in templates) {
        if (templates.hasOwnProperty(name)) {
            option = document.createElement('option');
            if (templates[name].hasOwnProperty('updatedAt'))
                option.text = name + ' (' + moment().calendar(templates[name].updatedAt) + ')';
            else
                option.text = name;
            option.value = name;
            if (name === composeView.lastAfuTemplate) {
                option.selected = 'selected';
                lastTmplFound = true;
            }
            selectElem.add(option);
        }
    }
    option = document.createElement('option');
    option.text = 'Create new ...';
    option.value = '__NEW';
    if (!lastTmplFound)
        option.selected = 'selected';
    selectElem.add(option);
};


var _updateAfuForm = function (composeView) {
    document.getElementById('NET_AFU_PREVMSG').style.visibility = (composeView.afuIndex <= 0 ? 'hidden' : '');
    document.getElementById('NET_AFU_NEXTMSG').style.visibility = (composeView.afuIndex >= composeView.afuSequence.length - 1 ? 'hidden' : '');
    document.getElementById('NET_AFU_REMOVE').style.visibility = (composeView.afuSequence.length <= 1 ? 'hidden': '');
    document.getElementById('NET_AFU_SEQ').innerHTML = 'Email ' + (composeView.afuIndex + 1) + ' of ' + composeView.afuSequence.length;
    var seq = composeView.afuSequence[composeView.afuIndex];
    document.getElementById('NET_AFU_STATUS').value = seq.status;
    document.getElementById('NET_AFU_DAYS').value = seq.days;
    document.getElementById('NET_AFU_MESSAGE').value = seq.message;
    var ifmsgis = 'If the message is';
    if (composeView.afuIndex > 0)
        ifmsgis = 'Then, if the person has still';
    document.getElementById('NET_AFU_IFMSGIS').innerHTML = ifmsgis;
};


var _checkAfu = function (composeView, sdk) {
    var __focus = function (field) {
        return function () {
            document.getElementById(field).focus();
        };
    };
    for (var i = 0; i < composeView.afuSequence.length; i++) {
        if (composeView.afuSequence[i].message.length === 0) {
            displayError(sdk, 'Empty followup message', 'A message in followup sequence is empty.<br>Please fill in content or remove it.', __focus('NET_AFU_MESSAGE'));
            composeView.afuIndex = i;
            _updateAfuForm(composeView);
            return false;
        }
    }
    var templateName;
    if (document.getElementById('NET_AFU_TEMPLATE_NAME').style.display === 'none') {
        // modifying existing template
        templateName = document.getElementById('NET_AFU_TEMPLATE').value;
    } else {
        // creating new template
        if (composeView.afuTemplateName.length === 0) {
            displayError(sdk, 'Missing sequence name', 'You are creating a new sequence, please<br>fill in the name of.', __focus('NET_AFU_TEMPLATE_NAME'));
            return false;
        }
        templateName = composeView.afuTemplateName;
    }
    // save template
    templates = {};
    if (localStorage.NET_afuTemplates)
        templates = JSON.parse(localStorage.NET_afuTemplates);
    templates[templateName] = {
        'updatedAt':    new Date(),
        'sequence':     composeView.afuSequence
    };
    localStorage.NET_afuTemplates = JSON.stringify(templates);
    localStorage.NET_lastAfuTemplate = templateName;
    composeView.afuTemplates = templates;
    composeView.lastAfuTemplate = templateName;
    return true;
};


var armAutoFollowUp = function (toArm, fromDialog, composeView, sdk) {
    var btn = document.getElementById(composeView.id).querySelector('.net_auto-follow-ups');
    var c = btn.parentElement.parentElement;
    var armed = false;
    // arming from dialog
    if (fromDialog &&
        toArm) {
        composeView.afuArm = {
            'sequence':     composeView.afuSequence,
            'name':         composeView.lastAfuTemplate
        };
        armed = true;
    }
    // arming with remembered settings upon compose window load
    if (!fromDialog &&
        toArm) {
        if (composeView.afuArm &&
            composeView.afuArm.sequence &&
            composeView.afuArm.name)
            armed = true;
    }
    if (armed) {
        btn.className = 'fa fa-fw fa-reply-all net_auto-follow-ups net_on';
        c.dataset.tooltip = 'Auto-followups is armed with template "' + composeView.afuArm.name + '".';
        c.classList.remove('net_off');
        c.classList.add('net_on');
        composeView.track = '1';
        toggleTrack(composeView, sdk);
        localStorage.NET_storedAfuArm = JSON.stringify(composeView.afuArm);
    } else {
        composeView.afuArm = {};
        btn.className = 'fa fa-fw fa-reply-all net_auto-follow-ups';
        c.dataset.tooltip = 'Auto-followups is off';
        c.classList.add('net_off');
        c.classList.remove('net_on');
        localStorage.removeItem('NET_storedAfuArm');
        localStorage.NET_storedAfuArm = JSON.stringify(composeView.afuArm);
    }
    // console.log('armAutoFollowUp', composeView.afuArm);
};


var _afuLoadTemplate = function (composeView, tmplId) {
    composeView.afuIndex = 0;
    if (tmplId === '__NEW') {
        // create new template
        composeView.afuTemplateName = '';
        composeView.afuSequence = [{
            status:     'NOT_OPENED',
            days:       '1',
            message:    ''
        }];
        document.getElementById('NET_AFU_TEMPLATE_NAME').style.display = '';
        document.getElementById('NET_AFU_REMOVETMPL').style.display = 'none';
    } else {
        composeView.afuSequence = composeView.afuTemplates[tmplId].sequence;
        document.getElementById('NET_AFU_TEMPLATE_NAME').style.display = 'none';
        if (composeView.afuTemplates[tmplId].hasOwnProperty('updatedAt')) {
            document.getElementById('NET_AFU_REMOVETMPL').style.display = '';
        } else {
            document.getElementById('NET_AFU_REMOVETMPL').style.display = 'none';
        }
    }
    _updateAfuForm(composeView);
};


var _afuTemplateChange = function (composeView) {
    return function (e) {
        var tmplId = e.target.options[e.target.selectedIndex].value;
        _afuLoadTemplate(composeView, tmplId);
    };
};


var _afuTemplateNameChange = function (composeView) {
    return function (e) {
        composeView.afuTemplateName = e.target.value;
    };
};


var _afuRemoveTemplate = function (composeView, sdk) {
    return function (e) {
        var templateName = document.getElementById('NET_AFU_TEMPLATE').value;
        displayYesNo(sdk, 'Confirm template removal', 'Are you sure you want to remove template "' + templateName + '"?', function () {
            delete composeView.afuTemplates[templateName];
            localStorage.NET_afuTemplates = JSON.stringify(composeView.afuTemplates);
            _initAfuForm(composeView);
        });
    };
};


var _afuPrevMsg = function (composeView) {
    return function (e) {
        if (composeView.afuIndex > 0) {
            composeView.afuIndex--;
            _updateAfuForm(composeView);
        }
    };
};


var _afuNextMsg = function (composeView) {
    return function (e) {
        if (composeView.afuIndex < composeView.afuSequence.length - 1) {
            composeView.afuIndex++;
            _updateAfuForm(composeView);
        }
    };
};


var _afuAdd = function (composeView) {
    return function (e) {
        var lastStatus = composeView.afuSequence[composeView.afuIndex].status;
        composeView.afuSequence.push({
            status:     lastStatus,
            days:       '1',
            message:    ''
        });
        composeView.afuIndex++;
        _updateAfuForm(composeView);
    };
};


var _afuRemove = function (composeView) {
    return function (e) {
        if (composeView.afuSequence.length <= 1)
            return;
        composeView.afuSequence.splice(composeView.afuIndex, 1);
        if (composeView.afuIndex >= composeView.afuSequence.length)
            composeView.afuIndex--;
        _updateAfuForm(composeView);
    };
};


var _afuStatusChange = function (composeView) {
    return function (e) {
        var status = e.target.value;
        for (var i = 0; i < composeView.afuSequence.length; i++)
            composeView.afuSequence[i].status = status;
    };
};


var _afuDaysChange = function (composeView) {
    return function (e) {
        composeView.afuSequence[composeView.afuIndex].days = e.target.value;
    };
};


var _afuMessageChange = function (composeView) {
    return function (e) {
        composeView.afuSequence[composeView.afuIndex].message = e.target.value;
    };
};


var _initAfuForm = function (composeView) {
    var e = document.getElementById('NET_AFU_TEMPLATE');
    _buildTemplateDropdown(composeView, e);
    fireEvent(e, 'HTMLEvents', 'change');
};


var autoFollowUps = function (event, composeView, sdk, form) {
    var modal = sdk.Widgets.showModalView({
        el:     form,
        title:  'Auto-Followups',
        buttons: [
            {
                text:   'Approve',
                title:  'Approve',
                onClick: function () {
                    if (_checkAfu(composeView, sdk)) {
                        armAutoFollowUp(true, true, composeView, sdk);
                        modal.close();
                    }
                },
                type:   'PRIMARY_ACTION'
            },
            {
                text:   'Cancel',
                title:  'Cancel',
                onClick: function () {
                    armAutoFollowUp(false, true, composeView, sdk);
                    modal.close();
                },
                type:   'SECONDARY'
            }
        ]
    });
    var e;
    e = document.getElementById('NET_AFU_TEMPLATE');
    e.addEventListener('change', _afuTemplateChange(composeView));
    e = document.getElementById('NET_AFU_TEMPLATE_NAME');
    e.addEventListener('change', _afuTemplateNameChange(composeView));
    e = document.getElementById('NET_AFU_REMOVETMPL');
    e.addEventListener('click', _afuRemoveTemplate(composeView, sdk));
    e = document.getElementById('NET_AFU_PREVMSG');
    e.addEventListener('click', _afuPrevMsg(composeView));
    e = document.getElementById('NET_AFU_NEXTMSG');
    e.addEventListener('click', _afuNextMsg(composeView));
    e = document.getElementById('NET_AFU_ADD');
    e.addEventListener('click', _afuAdd(composeView));
    e = document.getElementById('NET_AFU_REMOVE');
    e.addEventListener('click', _afuRemove(composeView));
    e = document.getElementById('NET_AFU_STATUS');
    e.addEventListener('change', _afuStatusChange(composeView));
    e = document.getElementById('NET_AFU_DAYS');
    e.addEventListener('change', _afuDaysChange(composeView));
    e = document.getElementById('NET_AFU_MESSAGE');
    e.addEventListener('change', _afuMessageChange(composeView));
    _initAfuForm(composeView);

    initKeepOnCheckbox('FOLLOWUP');
};

