
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
var timeInput = function (params) {

    var composeView = params.composeView;
    var input = params.input;
    var timeList = params.timeList;
    if (!input) {
        input = {
            time:   '',
            format: 'natural'
        };
    }
    if (!timeList ||
        timeList.length === 0) {
        timeList = [
            "tomorrow at 6:00am\tn",  
            "in 10 minutes\tn",
            "tomorrow at 9:30am\tn",
            "monday at 9am\tn",
            "in 6 weeks\tn",
            "in 3 months\tn"
        ];
    }


    this.getInput = function () {
        return input;
    };

    this.getList = function () {
        return timeList;
    };


    /*

    `fromPicker` reads date, and time produced by input-type=date and input-type=time and return a Date object.
    `toPicker` does the reverse

     */
    var fromPicker = function (date, time) {
        var dateEs = date.split('-');
        var timeEs = time.split(':');
        var ret = new Date(parseInt(dateEs[0], 10),
            parseInt(dateEs[1], 10) - 1,
            parseInt(dateEs[2], 10),
            parseInt(timeEs[0], 10),
            parseInt(timeEs[1], 10));
        return ret;
    };
    var toPicker = function (dateObj) {
        var date = '',
            time = '';
        date += dateObj.getFullYear() + '-';
        var M = dateObj.getMonth();
        if (M <= 8)
            date += '0' + (M + 1);
        else
            date += (M + 1);
        date += '-' + dateObj.getDate();
        var h = dateObj.getHours(),
            m = dateObj.getMinutes();
        if (h < 10)
            time += '0' + h + ':';
        else
            time += h + ':';
        if (m < 10)
            time += '0' + m;
        else
            time += m;
        return {
            date: date,
            time: time
        };
    };


    var _naturalTimeChange = function (e) {
        input.time = e.target.value.toLowerCase();
        updateForm(true);
    };


    var _timePickerChange = function (e) {
        var date = document.getElementById(params.dateId).value;
        var time = document.getElementById(params.timeId).value;
        if (date.length > 0 &&
            time.length > 0) {
            input.time = fromPicker(date, time).toISOString();
        } else
            input.time = '';
        updateForm(true);
    };


    var _choiceClicked = function (e) {
        var i, li, ul, idx;
        if (e.target.className.indexOf('trash') > 0) {
            // trash button clicked
            idx = _indexOfIcon(e.target);
            if (idx >= 0) {
                timeList.splice(idx, 1);
                updateForm();
            }
        } else if (e.target.className.indexOf('thumb-tack') > 0) {
            // stick button clicked
            idx = _indexOfIcon(e.target);
            if (idx >= 0) {
                var entry = timeInput.toggleStick(timeList[idx]);
                timeList[idx] = entry;
                updateForm();
            }
        } else {
            // time is selected
            li = e.target.parentElement;
            ul = li.parentElement;
            timeInput.checkAll(ul, false);
            timeInput.check(e.target.children[0], true);
            idx = timeInput.getChecked(document.getElementById(params.choiceTimeId));
            if (idx >= 0 &&
                idx < timeList.length) {
                var _input = timeInput.fromStored(timeList[idx]);
                if (_input) {
                    input.time = _input.time;
                    input.format = _input.format;
                    updateForm();
                }
            }
        }
    };
    var _indexOfIcon = function (e) {
        li = e.parentElement.parentElement.parentElement;
        ul = li.parentElement;
        var idx = -1;
        for (i = 0; i < ul.children.length; i++) {
            if (ul.children[i] === li) {
                idx = i;
                break;
            }
        }
        return idx;
    };


    var updateForm = function (disableInputUpdate) {
        var i;
        var eNT = document.getElementById(params.naturalTimeId),
            eCT = document.getElementById(params.choiceTimeId),
            eD  = document.getElementById(params.dateId),
            eT  = document.getElementById(params.timeId);
        // switch between natural and absolute time
        if (input.format === 'natural') {
            eNT.style.display = '';
            eD.style.display = 'none';
            eT.style.display = 'none';
            if (!disableInputUpdate) {
                eNT.value = input.time;
                eD.value = '';
                eT.value = '';
            }
        } else {
            eNT.style.display = 'none';
            eD.style.display = '';
            eT.style.display = '';
            if (!disableInputUpdate) {
                eNT.value = '';
                var dt = toPicker(new Date(input.time));
                eD.value = dt.date;
                eT.value = dt.time;
            }
        }
        // compose the list of time
        var timelistHtml = '';
        var itemChecked = false;
        for (i = 0; i < timeList.length; i++) {
            var time = timeInput.formatTime(timeList[i]);
            var liClass = '';
            if (timeInput.isStuck(timeList[i]))
                liClass = ' class="stick"';
            var checked = '';
            if (input.time) {
                var storedTime = timeInput.toStored(input.time, input.format);
                if (timeInput.isEqual(storedTime, timeList[i])) {
                    checked = ' fa-check';
                    itemChecked = true;
                }
            }
            timelistHtml += '<li' + liClass + '><a href="javascript:;"><i class="fa fa-fw' + checked + '"></i> ' + time + ' <div class="inboxsdk__button net_time-stick" role="button" data-tooltip="Save this time"><i class="fa fa-fw fa-thumb-tack"></i></div> <div class="inboxsdk__button net_time-remove" role="button" data-tooltip="Remove"><i class="fa fa-fw fa-trash-o"></i></div></a></li>';
        }
        if (eCT.innerHTML !== timelistHtml) {
            eCT.innerHTML = timelistHtml;
            var CTs = eCT.children;
            for (i = 0; i < CTs.length; i++) {
                CTs[i].children[0].addEventListener('click', _choiceClicked);
            }
        }
        if (input.format === 'natural') {
            if (chrono.parseDate(input.time) &&
                !itemChecked) {
                timeInput.check(document.getElementById(params.manualCheckId), true);
                timeInput.checkAll(eCT, false);
            } else {
                timeInput.check(document.getElementById(params.manualCheckId), false);
            }
        } else {
            if (input.time &&
                input.time.length > 0 &&
                !itemChecked) {
                timeInput.check(document.getElementById(params.manualCheckId), true);
                timeInput.checkAll(eCT, false);
            } else {
                timeInput.check(document.getElementById(params.manualCheckId), false);
            }
        }
    };


    var _pickerSwitch = function (e) {
        if (input.format === 'natural')
            input.format = 'picker';
        else
            input.format = 'natural';
        input.time = '';
        updateForm();
    };

    var e;
    e = document.getElementById(params.pickerSwitchId);
    e.addEventListener('click', _pickerSwitch);
    e = document.getElementById(params.naturalTimeId);
    e.addEventListener('keyup', _naturalTimeChange);
    e = document.getElementById(params.dateId);
    e.addEventListener('change', _timePickerChange);
    e = document.getElementById(params.timeId);
    e.addEventListener('change', _timePickerChange);
    updateForm();

};


/*

 `toStored` converts separated time + format to stored time,
 `fromStored` does the reverse

 */
timeInput.toStored = function (time, format) {
    var storedTime = time;
    if (format === 'natural')
        storedTime += '\tn';
    return storedTime;
};
timeInput.fromStored = function (storedTime) {
    var times = storedTime.split('\t');
    if (times.length === 1) {
        return {
            time:   storedTime,
            format: 'picker'
        };
    } else if (times[1].indexOf('n') >= 0) {
        return {
            time:   times[0],
            format: 'natural'
        };
    }
    return null;
};
timeInput.storeTime = function (time, format, timeList) {
    var storedTime = timeInput.toStored(time, format);
    var eI = timeInput.index(storedTime, timeList);
    if (eI < 0)
        timeList.splice(0, 0, storedTime);
    if (timeList.length > 10) {
        // remove an at bottom with no sticks
        for (i = timeList.length - 1; i >= 0; i--) {
            if (!timeInput.isStuck(timeList[i])) {
                timeList.splice(i, 1);
                break;
            }
        }
    }
    return timeList;
};


/*

 `isEqual` tests whether two stored time matches

 */
timeInput.isEqual = function (time1, time2) {
    if (time1.split('\t')[0] === time2.split('\t')[0])
        return true;
    return false;
};
timeInput.index = function (time, times) {
    for (var i = 0; i < times.length; i++) {
        if (timeInput.isEqual(time, times[i]))
            return i;
    }
    return -1;
};


/*

 `isStuck` test whether a stored time is stuck
 `toggleStick` toggle stick status of a stored time

 */
timeInput.isStuck = function (time) {
    var times = time.split('\t');
    if (times.length > 1) {
        if (times[1].indexOf('s') >= 0)
            return true;
    }
    return false;
};
timeInput.toggleStick = function (time) {
    var entry = time.split('\t');
    var flag = '';
    if (entry.length === 2)
        flag = entry[1];
    if (flag.indexOf('s') >= 0)
        flag = flag.replace('s', '');
    else
        flag += 's';
    if (flag.length > 0)
        entry = entry[0] + '\t' + flag;
    else
        entry = entry[0];
    return entry;
};


/*

 `format` returns formatted time for display from:
 1. stored time as time, and format = null
 2. typed / picked time as time, and format = either 'natural' or 'picker'

 */
timeInput.formatTime = function (time, format) {
    if (format) {
        if (format === 'natural')
            time = time.charAt(0).toUpperCase() + time.slice(1);
        else
            time = (new Date(time)).toLocaleString();
    } else {
        if (time.indexOf('\t') >= 0) {
            var times = time.split('\t');
            if (times[1].indexOf('n') >= 0)
                time = times[0].charAt(0).toUpperCase() + times[0].slice(1);
            else
                time = (new Date(times[0])).toLocaleString();
        } else {
            time = (new Date(time)).toLocaleString();
        }
    }
    return time;
};


timeInput.toPickerFormat = function (input, refDate) {
    if (input.format === 'picker')
        return input;
    var time = input.time.toLowerCase();
    if (time.startsWith('mon') ||
        time.startsWith('tue') ||
        time.startsWith('wed') ||
        time.startsWith('thu') ||
        time.startsWith('fri') ||
        time.startsWith('sat') ||
        time.startsWith('sun')) {
        var now = new Date();
        var testParse = chrono.parseDate(time);
        if (testParse <= now)
            time = 'next ' + time;
    }
    var date = chrono.parseDate(time, refDate);
    return {
        time:   date.toISOString(),
        format: 'picker'
    };
};


/*

 UI helpers

 */
timeInput.check = function (e, check) {
    if (check)
        e.className = 'fa fa-fw fa-check';
    else
        e.className = 'fa fa-fw';
};
timeInput.checkAll = function (ul, check) {
    for (i = 0; i < ul.children.length; i++)
        timeInput.check(ul.children[i].children[0].children[0], check);
};
timeInput.isChecked = function (e) {
    if (e.className.indexOf('fa-check') >= 0)
        return true;
    return false;
};
timeInput.getChecked = function (e) {
    for (var i = 0; i < e.children.length; i++) {
        if (timeInput.isChecked(e.children[i].children[0].children[0])) {
            return i;
        }
    }
    return -1;
};


