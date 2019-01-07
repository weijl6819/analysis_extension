var appID = 'b8dbe3a85aa1448a3a0d5233bfacfc46';
var units = 'metric';

$(document).ready(function() {
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.status) {
            chrome.storage.local.get('units', function(response) {
                units = response.units;
                localStorage.setItem('data', request.data);
                displayWeatherLayout(request.data);
                sendResponse({request_status: 1});
            });
        }
        else {
            console.log('Popup request status 0');
        }
    });

    //chrome.storage.local.clear();
    //localStorage.clear();

    $('#openOptionsPage').click(function(event, ui) {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });

    getWeatherData();
});

function displayWeatherLayout(data) {
    var backgroundImage = getBackgroundImage(data.main.temp.toFixed(0));
    var mainTempIcon = getMainTempIcon(data);

    $('#loader').fadeOut(500, function() {
        $('#container').slideDown();
    });

    document.getElementById('units').innerHTML = (units == 'metric' ? 'C' : 'F');
    document.getElementById('container').style.backgroundImage = 'url("./' + backgroundImage + '")';
    document.getElementById('city').innerHTML = getTitle(data);
    document.getElementById('dateTime').innerHTML = getDateTime();
    document.getElementById('mainTempIcon').style.backgroundImage = 'url("' + mainTempIcon + '")';
    document.getElementById('mainTemp').innerHTML = getMainTemp(data);
    document.getElementById('mainMinTemp').innerHTML = getMainMinTemp(data);
    document.getElementById('mainMaxTemp').innerHTML = getMainMaxTemp(data);
}

function displayFiveDaysWeatherLayout(data) {
    var e = document.getElementById('fiveDaysContainer');
    e.innerHTML = '';

    var weekday = new Array(7);
    weekday[0]=  "SUN"; weekday[1] = "MON"; weekday[2] = "TUE"; weekday[3] = "WED"; weekday[4] = "THU"; weekday[5] = "FRI"; weekday[6] = "SAT";

    var skipIndex = 0;

    for (var i = 0; i < data.list.length; i++) {
        var d = new Date(data.list[i].dt * 1000);
        var weekdayName = weekday[d.getDay()];

        console.log(data.list[i].weather[0].main);

        if (i != 0 && skipIndex < 5) {
            e.innerHTML += '<li class="item"><div>' + weekdayName + '</div><img src="' + getTempIcon(data.list[i].weather[0].main) + '"  style="width:41px;height:41px; padding-top: 13px;padding-bottom: 5px;" /><div>' + convertTemp(data.list[i].temp.min.toFixed(0)) + ' / ' + convertTemp(data.list[i].temp.max.toFixed(0)) + '</div></li>';
            /*var nextDay = new Date((data.list[i].dt * 1000) + (60 * 60 * 24 * 1000));
            var nextDayMonth = ((nextDay.getMonth() + 1) < 10 ? '0' + (nextDay.getMonth() + 1) : (nextDay.getMonth() + 1));
            var nextDayFormat = nextDay.getFullYear() + '-' + nextDayMonth + '-' + nextDay.getDate();
            console.log('Next Day Format: ' + nextDayFormat);
            currentSkipDate = nextDayFormat + ' 12:00:00';*/
            skipIndex++;
        }
    }
}

function getBackgroundImage(temp) {
    if (temp < 5) {
        return 'backgrounds/weather_winter.jpg';
    }
    else if (temp >= 5 && temp < 15) {
        return 'backgrounds/weather_autumn.jpg';
    }
    else if (temp >= 15 && temp < 25) {
        return 'backgrounds/weather_spring.jpg';
    }
    else if (temp >= 25) {
        return 'backgrounds/weather_summer.jpg';
    }
}

function getTitle(data) {
    return data.name;
}

function getDateTime() {
    var date = new Date();

    var weekday = new Array(7);
    weekday[0]=  "SUN"; weekday[1] = "MON"; weekday[2] = "TUE"; weekday[3] = "WED"; weekday[4] = "THU"; weekday[5] = "FRI"; weekday[6] = "SAT";
    var weekdayName = weekday[date.getDay()];

    var day = date.getDate();
    if (day < 10) { day = '0' + day; }

    var month = new Array();
    month[0] = "JAN"; month[1] = "FEB"; month[2] = "MAR"; month[3] = "APR"; month[4] = "MAY"; month[5] = "JUN"; month[6] = "JUL"; month[7] = "AUG"; month[8] = "SEP"; month[9] = "OCT"; month[10] = "NOV"; month[11] = "DEC";
    var monthName = month[date.getMonth()];

    var hour = date.getHours();
    if (hour < 10) { hour = '0' + hour; }
    var minute = date.getMinutes();
    if (minute < 10) { minute = '0' + minute; }
    var time = hour + ':' + minute;

    return weekdayName + ' ' + day + ' ' + monthName + ', ' + time;
}

function getMainTemp(data) {
    return convertTemp(data.main.temp.toFixed(0));
}

function getMainTempIcon(data) {
    console.log(data);
    var weather = data.weather[0].main;

    return getTempIcon(weather);
}

function getTempIcon(value) {
    switch(value) {
        case 'Fog':
            return 'icons/oblacno.png';
        case 'Mist':
            return 'icons/oblacno.png';
        case 'Rain':
            return 'icons/kisa.png';
        case 'Snow':
            return 'icons/sneg.png';
        case 'Thunderstorm':
            return 'icons/grmljavina.png';
        case 'Sunny':
            return 'icons/suncano.png';
        case 'Clouds':
            return 'icons/oblacno.png';
        case 'Clear':
            return 'icons/suncano.png';
        default:
            return 'icons/suncano.png'
    }
}

function getMainMinTemp(data) {
    var tempMin = data.main.temp_min;
    if (typeof tempMin != 'undefined') {
        return convertTemp(tempMin.toFixed(0));
    }
    else {
        return '...';
    }
}

function getMainMaxTemp(data) {
    var tempMax = data.main.temp_max;
    if (typeof tempMax != 'undefined') {
        return convertTemp(tempMax.toFixed(0));
    }
    else {
        return '...';
    }
}

function getUserCoordinates(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
            callback(position);
        });
    }
    else {
        noGeolocationEnabled();
    }
}

function saveToLocalStorage(data) {
    var date = new Date();
    localStorage.setItem('data', JSON.stringify(data));
    localStorage.setItem('data_timestamp', date.getTime());

    return true;
}

function saveToLocalStorageFiveDays(data) {
    var date = new Date();
    localStorage.setItem('data_five_days', JSON.stringify(data));
    localStorage.setItem('data_five_days_timestamp', date.getTime());

    return true;
}

function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem('data'));
}

function getFiveDaysFromLocalStorage() {
    return JSON.parse(localStorage.getItem('data_five_days'));
}

function getWeatherData() {
    var now = new Date().getTime();
    //now = 999999999999999999999999999;
    var timestamp = localStorage.getItem('data_timestamp');
    console.log('Data timestamp: ' + timestamp);
    var twoHours = 7200000;
    console.log('Data two hours: ' + (parseInt(timestamp) + twoHours));

    chrome.storage.sync.get('units', function(unitResponse) {
        if (!chrome.runtime.lastError) {
            units = unitResponse.units;
        }

        if (timestamp) {
            timestamp = parseInt(timestamp);
            if (now >= (timestamp + twoHours)) {
                getUserCoordinates(function (position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;

                    $.ajax({
                        url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + appID + '&units=metric',
                        method: 'GET',
                        success: function (response) {
                            console.log(response);
                            saveToLocalStorage(response);
                            getFiveDayWeatherForecast(response);
                            displayWeatherLayout(response);
                            return true;
                        },
                        error: function (error) {
                            console.log('API Response error: ');
                            console.log(error);
                        }
                    });
                });
            }
            else {
                console.log('Getting current weather data from local storage');
                var response = getFromLocalStorage();
                console.log(response);
                getFiveDayWeatherForecast(response);
                displayWeatherLayout(response);
                return true;
            }
        }
        else {
            getUserCoordinates(function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                $.ajax({
                    url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + appID + '&units=metric',
                    method: 'GET',
                    success: function (response) {
                        console.log(response);
                        saveToLocalStorage(response);
                        getFiveDayWeatherForecast(response);
                        displayWeatherLayout(response);
                        return true;
                    },
                    error: function (error) {
                        console.log('API Response error: ');
                        console.log(error);
                    }
                });
            });
        }

    });
}

function getFiveDayWeatherForecast(data) {
    var now = new Date().getTime();
    //now = 999999999999999999999999999999999;
    var timestamp = localStorage.getItem('data_five_days_timestamp');
    var oneDay = 86400000 / 2;

    chrome.storage.sync.get('units', function(unitResponse) {
        if (!chrome.runtime.lastError) {
            units = unitResponse.units;
        }

        if (timestamp) {
            timestamp = parseInt(timestamp);
            if (typeof timestamp != 'number' || now >= timestamp + oneDay) {
                $.ajax({
                    url: 'http://api.openweathermap.org/data/2.5/forecast/daily?id=' + data.id + '&appid=' + appID + '&units=metric&cnt=6',
                    method: 'GET',
                    success: function (response) {
                        console.log(response);
                        saveToLocalStorageFiveDays(response);
                        displayFiveDaysWeatherLayout(response);
                    }
                });
            }
            else {
                console.log('Getting five days data from local storage');
                var fiveDaysData = getFiveDaysFromLocalStorage();
                console.log(fiveDaysData);
                displayFiveDaysWeatherLayout(fiveDaysData);
            }
        }
        else {
            $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/forecast/daily?id=' + data.id + '&appid=' + appID + '&units=metric&cnt=6',
                method: 'GET',
                success: function (response) {
                    console.log(response);
                    saveToLocalStorageFiveDays(response);
                    displayFiveDaysWeatherLayout(response);
                }
            });
        }

    });
}

/* Helper methods */

function convertTemp(value) {
    if (units != 'metric') {
        var f = value * 9 / 5 + 32;
        return Math.round(f);
    }
    return value;
}

/* Error responses */

function noGeolocationEnabled() {
    console.log('Cannot access geolocation!');
}