//global vars
var day_or_night = "";
var longitude;
var latitude;
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
  
  geolocation();

  //datum
  datum("#datum");

  $(window).load(function(){
    $("#loader").delay( 1000 ).fadeOut();
    $("#idojaras").delay(00).fadeIn();
  });

});
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

function geolocation(){
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
    });
  } else {
    var city = prompt("Please enter a City", "New York");
    if (city != null) {
      loadWeather(city, "");
    }
  }
}

function loadWeather(location, woeid) {
  var loadUnit;
  if ( localStorage.getItem("cf") !== null) {
    loadUnit = localStorage.getItem("cf");
  }else{
    loadUnit = "C";
  }

  $.simpleWeather({
    location: location,
    woeid: woeid,
    unit: loadUnit,
    success: function(weather) {
      code = weather.code;
      city = weather.city+', '+weather.region;

      now_temp = weather.temp;
      now_temp_unit = weather.units.temp;
      now_text = weather.currently;
      now_daytext = weather.text;
      now_low = weather.low;
      now_high = weather.high;

      link = weather.link;

      console.log(now_text);

      //hatter
      weatherCond(code);
      weatherTemp(now_temp);

      //kiirni
      $("#idojaras #varos h2").html(city);  

      $("#mostani-fok").html( now_temp+'&deg;' );  
     
      $("#mostani-szoveg").html(now_text);   
      $("#mostani-top span").html(now_high+'&deg;'); 
      $("#mostani-low span").html(now_low+'&deg;'); 
      $("#mostani-napiszoveg").html(now_daytext);

      $("a.full_forecast").attr("href", link)
      
      //elorejelzes
      var forecast = "";
      for (i = 1; i < 5; i++) { 

          f_high = weather.forecast[i].high+'&deg;';
          f_low = weather.forecast[i].low+'&deg;';
          f_text = weather.forecast[i].text;
          f_day = weather.forecast[i].day;
          f_code = weather.forecast[i].code;

          forecast += '<div class="col egy-negy"><span class="day">'+f_day+'</span><span class="icon"><i class="icon-'+f_code+'"></i></span><span class="hight">&uarr; '+f_high+'</span><span class="low">&darr; '+f_low+'</span><span class="text">'+f_text+'</span></div>'

      }
      $("#idoidojaras-elorejelzes").html(forecast);

    },
    error: function(error) {
      $("#idojaras").html('<p>'+error+'</p>');
    }
  });
}

//nappal vagy éjjel
function daynight(x){
  if(x<20 && x>7){
    //nappal
    day_or_night = "day"
  }else{
    //ejjel
    day_or_night = "night"
  }
  console.log(day_or_night)
}


//fagyos idő
function weatherTemp(x){
  if(x<1){
    if (day_or_night="day") {
      $("#back").append("<img src='static/pic/icy/icy_day_left.png' class='icyleft'>");
      $("#back").append("<img src='static/pic/icy/icy_day_right.png' class='icyright'>")
    }else{
      $("#back").append("<img src='static/pic/icy/icy_night_left.png' class='icyleft'>");
      $("#back").append("<img src='static/pic/icy/icy_night_right.png' class='icyright'>")
    };
  }
}

//háttérkép és felhők
function weatherCond(x){
  
  var cond = 'cond-'+x;
  console.log(cond);

  //test
  //cond = 'cond-21';


  switch(cond) {
    case "cond-0":
        //tornado
        break;
    case "cond-1":
        //tropical-storm
        break;
    case "cond-2":
        //hurricane
        break;
    case "cond-3":
        //severe thunderstorms
        thunder();
        break;
    case "cond-4":
        //thunderstorms
        thunder();
        break;
    case "cond-5":
        //mixed rain and snow
        snow();
        break;
    case "cond-6":
        //mixed rain and sleet
        rain();
        break;
    case "cond-7":
        //mixed snow and sleet
        snow();
        break;
    case "cond-8":
        //freezing drizzle
        rain();
        break;
    case "cond-9":
        //drizzle
        rain();
        break;
    case "cond-10":
        //freezing rain
        rain();
        break;
    case "cond-11":
        //showers
        rain();
        break;
    case "cond-12":
        //showers
        rain();
        break;
    case "cond-13":
        //snow flurries
        snow();
        break;
    case "cond-14":
        //light snow showers
        snow();
        break;
    case "cond-15":
        //blowing snow
        snow();
        break;
    case "cond-16":
        //  snow
        snow();
        break;
    case "cond-17":
        //hail
        snow();
        break;
    case "cond-18":
        //sleet
        snow();
        break;
    case "cond-19":
        //dust
        fog();
        break;
    case "cond-20":
        //foggy
        fog();
        break;
    case "cond-21":
        //haze
        fog();
        break;
    case "cond-22":
        //smoky
        fog();
        break;
    case "cond-23":
        //blustery - szeles
        break;
    case "cond-24":
        //windy - szeles
        break;
    case "cond-25":
        //cold
        sunny();
        break;
    case "cond-26":
        //cloudy
        cloud();
        break;
    case "cond-27":
        //mostly cloudy (night)
        cloud();
        break;
    case "cond-28":
        //mostly cloudy (day)
        cloud();
        break;
    case "cond-29":
        //partly cloudy (night)
        cloud();
        break;
    case "cond-30":
        //partly cloudy (day)
        cloud();
        break;
    case "cond-31":
        //clear (night)
        sunny();
        break;
    case "cond-32":
        //sunny
        sunny();
        break;
    case "cond-33":
        //fair (night)
        sunny();
        cloud();
        break;
    case "cond-34":
        //fair (day)
        sunny();
        cloud();
        break;
    case "cond-35":
        //mixed rain and hail
        rain();
        break;
    case "cond-36":
        //hot
        sunny();
        break;
    case "cond-37":
        //isolated thunderstorms
        thunder();
        break;
    case "cond-38":
        //scattered thunderstorms
        thunder();
        break;
    case "cond-39":
        //scattered thunderstorms
        thunder();
        break;
    case "cond-40":
        //  scattered showers
        rain();
        break;
    case "cond-41":
        //heavy snow
        snow();
        break;
    case "cond-42":
        //scattered snow showers
        snow();
        break;
    case "cond-43":
        //heavy snow
        snow();
        break;
    case "cond-44":
        //partly cloudy
        cloud();
        break;
    case "cond-45":
        //thundershowers
        thunder();
        break;
    case "cond-46":
        //snow showers
        snow();
        break;
    case "cond-47":
        //isolated thundershowers
        thunder();
        break;
    default:
        //code block
         $("#back").css('background-image', "url(static/pic/bg/clear_day.jpg)");
  }
}

function fog(){
  if(day_or_night=="day"){
    $("#back").css("background-image", "url(static/pic/bg/foggy_day.jpg)");
    $("#back .felho").css("background-image", "url(static/pic/fog/fog_day.png)").css( {"background-size": "auto 100%"} );
  }else{
    $("#back").css("background-image", "url(static/pic/bg/foggy_night.jpg)");
    $("#back .felho").css("background-image", "url(static/pic/fog/fog_night.png)").css( {"background-size": "auto 100%"} );
  }

  fogAnim();
  function fogAnim(){
    $("#back .felho").animate({opacity: .1 },4000).animate({opacity: 1},2000).delay(4000);
    window.setTimeout(function() { fogAnim() }, 10000)
  }
};//fog

function cloud(){
  if(day_or_night=="day"){
    $("#back").css("background-image", "url(static/pic/bg/white_cloudy_day.jpg)");
    $("#back").prepend("<div class='cloud'></div>");
    $("#back .cloud").css("background-image", "url(static/pic/white-cloud-day/white_cloud_day_1.png)").css( {"background-size": "100% auto"} );

  }else{
    $("#back").css("background-image", "url(static/pic/bg/dark_cloudy_day.jpg)");
    $("#back").prepend("<div class='cloud'></div>");    
    $("#back .cloud").css("background-image", "url(static/pic/grey-cloud-day/grey_cloud_day_1.png)").css( {"background-size": "auto 100%"} );
  }

};

function sunny(){
  if(day_or_night=="day"){
    $("#back").css("background-image", "url(static/pic/bg/clear_day.jpg)");
    $("#back").prepend("<div class='sun'></div>");
    $("#back .sun").css("background-image", "url(static/pic/sun.png)").css( {"background-size": "60%", "background-position": "top"} );
  }else{
    $("#back").css("background-image", "url(static/pic/bg/clear_night.jpg)");
     $("#back").prepend("<div class='sun'></div>");
    $("#back .sun").css("background-image", "url(static/pic/moon.png)").css( {"background-size": "60%", "background-position": "top"} );
  }
};

function thunder(){
  $("#back").css("background-image", "url(static/pic/bg/dark_cloudy_day.jpg)");
  $("#back .felho").addClass("thunder");
 
}

function rain(){
  if(day_or_night=="day"){
    $("#back").css("background-image", "url(static/pic/bg/clear_day.jpg)");
    $("#back .felho").css("background-image", "url(static/pic/rain/rain_day.png)");
    $("#back .felho").append("<div class='small'></day>").addClass("rainkulso");
    $("#back .felho .small").css("background-image", "url(static/pic/rain/raindrops.png)").addClass("rainbelso");
  }else{
    $("#back").css("background-image", "url(static/pic/bg/clear_night.jpg)");
    $("#back .felho").css("background-image", "url(static/pic/rain/rain_night.png)");
    $("#back .felho").append("<div class='small'></day>").addClass("rainkulso");
    $("#back .felho .small").css("background-image", "url(static/pic/rain/raindrops.png)").addClass("rainbelso");
  }
}

function snow(){
  if(day_or_night=="day"){
    $("#back").css("background-image", "url(static/pic/bg/clear_day.jpg)");
    $("#back .felho").css("background-image", "url(static/pic/snow/snow_big_day.png)");
    $("#back .felho").append("<div class='small'></day>").addClass("snowkulso");
    $("#back .felho .small").css("background-image", "url(static/pic/snow/snow_small_day.png)").addClass("snowbelso");
  }else{
    $("#back").css("background-image", "url(static/pic/bg/clear_night.jpg)");
    $("#back .felho").css("background-image", "url(static/pic/snow/snow_big_night.png)");
    $("#back .felho").append("<div class='small'></day>").addClass("snowkulso");
    $("#back .felho .small").css("background-image", "url(static/pic/snow/snow_small_night.png)").addClass("snowbelso");
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////





function datum(x){
  var d = new Date();

  var month = d.getMonth()+1;
  var day = d.getDate();
  var hours = d.getHours();
  var minutes = d.getMinutes();

  daynight(hours);

  var date = (month<10 ? '0' : '') + month + '. ' + (day<10 ? '0' : '') + day;
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()]
  var time = 'time: '+hours+' : '+minutes;
  $(x).html(days+', '+date+'; '+time);
}