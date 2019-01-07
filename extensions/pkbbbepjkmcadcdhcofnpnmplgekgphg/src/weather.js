const _ = require('lodash');

class Weather
{
  initKey(wkey){
    this.wkey = wkey;
  }
  /**
  * inits the weather, if its on or off and calls get weather, with or without location
  */
  initWeather(wkey)
  {
    this.wkey = wkey;
    if(!localStorage.getItem('unit')){
      localStorage.setItem('unit','C');
    }
    let weather = localStorage.getItem('weather');
    if(weather == 0 && localStorage.getItem('weather')){
      $('#current_weather').hide();
      $('#current_description').hide();
      $('#weather_icon').hide();
      document.getElementById('weather').src=(chrome.extension.getURL('/images/toggle-switch-off.svg'));
      $('#divWeath').css('color','#aaaaaa');
      $('#city').css('color','#aaaaaa');
      $('#city').css('border-color', '#aaaaaa');
      $('#weathSub').css('background-color', '#aaaaaa');

    }else if(weather == 1 ){
      $('#current_weather').show();
      $('#current_description').show();
      $('#weather_icon').show();
      document.getElementById('weather').src=(chrome.extension.getURL('/images/toggle-switch.svg'));
      $('#WeathOn').text('On');
      $('#divWeath').css('color','#ffffff');

      $('#city').css('color','#ffffff');
      $('#city').css('border-color', '#ffffff');
      $('#weathSub').css('background-color', '');
    }else if(!localStorage.getItem('weather')){
      $('#weather_alert').show();
    }
    if(localStorage.getItem('city')){
      var city = localStorage.getItem('city');
      document.getElementById('city').value = city;
      this.insertWeather();
    }else{

    }
  }

  displayWeather(e)
  {
    if(e.target.src == chrome.extension.getURL('/images/toggle-switch.svg'))
  	{
      e.target.src = chrome.extension.getURL('/images/toggle-switch-off.svg');
      document.getElementById('WeathOn').innerHTML = 'Off';
      $('#current_weather').hide();
      $('#current_description').hide();
      $('#weather_icon').hide();
      localStorage.setItem('weather',0);
  		$('#divWeath').css('color','#aaaaaa');
  		$('#city').css('color','#aaaaaa');
  		$('#city').css('border-color', '#aaaaaa');
  		$('#weathSub').css('background-color', '#aaaaaa');

    }else if(e.target.src == chrome.extension.getURL('/images/toggle-switch-off.svg'))
  	{
      e.target.src = chrome.extension.getURL('/images/toggle-switch.svg');
      document.getElementById('WeathOn').innerHTML = 'On';
      $('#current_weather').show();
      $('#current_description').show();
      $('#weather_icon').show()
      localStorage.setItem('weather',1);
      $('#divWeath').css('color','#ffffff');
      $('#city').css('color','#ffffff');
      $('#city').css('border-color', '#ffffff');
      $('#weathSub').css('background-color', '');
    }
  }
  /**
  * disable or enable the location request
  * if enabled, weather input has to be disabled
  */
  changeLocationSettings()
  {
      $('#city').css('color','#ffffff');
      $('#city').css('border-color', '#ffffff');
      $('#weathSub').css('background-color', '');
      this.insertWeather();
  }

  getWeather()
  {
    /**
    * here the weather should be requested with city name and without knowing the location of the user
    */
    let city = document.getElementById('city').value;
    $.ajax({
      url: 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&APPID='+this.wkey+ '&units=imperial&lang='+chrome.i18n.getMessage("lang") ,
      type: 'GET',
      dataType:'json',
      success: function(data){
        let location = document.getElementById('location');
        location.innerHTML = city;
        document.getElementById('city').value = city;
        let description = document.getElementById('weather_description');
        description.innerHTML =  data.weather[0].description;
        localStorage.setItem('temperatureF', Math.round(data.main.temp));
        localStorage.setItem('description', data.weather[0].description);
        localStorage.setItem('city', city);
      },
      error: function(data){
        if(data.status == 404){
          alert('city not found');
        }
      }
    });

    $.ajax({
      url: 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&APPID='+this.wkey + '&units=metric&lang='+chrome.i18n.getMessage("lang"),
      type: 'GET',
      dataType:'json',
      success: function(data){
        localStorage.setItem('temperatureC', Math.round(data.main.temp));

        let temperature = document.getElementById('temperature');
        let unit = document.getElementById('unit');
        unit.innerHTML = localStorage.getItem('unit');
        temperature.innerHTML = localStorage.getItem('temperature' + localStorage.getItem('unit')) + '°';

        let icon = document.getElementById('weather_icon');
        icon.src = 'images/weather/' + data.weather[0].icon + '.svg';
        localStorage.setItem('weather_icon', data.weather[0].icon);
      },
      error: function(data){
        if(data.status == 404){
          alert('city not found');
        }
      }
    });
    localStorage.setItem('weather_time', Date.now());
  }

  insertWeather(){

    let timestamp = localStorage.getItem('weather_time');
    let now = Date.now();

    if(now-timestamp > 14400000 || !localStorage.getItem('weather_icon'))
    {
        this.getWeather();

        $('#weathCheckStatic').show();
        $('#weatherCheck').text(document.getElementById('city').value);

        $('#weather').attr('src', chrome.extension.getURL('/images/toggle-switch.svg'));
        document.getElementById('WeathOn').innerHTML = 'On';
        $('#current_weather').show();
        $('#current_description').show();
        $('#weather_icon').show()
        localStorage.setItem('weather',1);
        $('#divWeath').css('color','#ffffff');
        $('#city').css('color','#ffffff');
        $('#city').css('border-color', '#ffffff');
        $('#weathSub').css('background-color', '');
    }else{
      let temperature = document.getElementById('temperature');
      let unit = document.getElementById('unit');
      unit.innerHTML = localStorage.getItem('unit');
      temperature.innerHTML = localStorage.getItem('temperature' + localStorage.getItem('unit')) + '°';
      let location = document.getElementById('location');
      location.innerHTML = localStorage.getItem('city');
      document.getElementById('city').value = localStorage.getItem('city');
      let description = document.getElementById('weather_description');
      description.innerHTML = localStorage.getItem('description');
      let icon = document.getElementById('weather_icon');

      icon.src = 'images/weather/' + localStorage.getItem('weather_icon') + '.svg';

      $('#weathRequestBlocked').show();
    }
  }

  changeUnit()
  {
    var unit = document.getElementById('unit');

    if(unit.innerHTML == 'C') {
      localStorage.setItem('unit', 'F');
    } else {
      localStorage.setItem('unit','C');
    }
    this.insertWeather();
  }
}

module.exports = Weather;
