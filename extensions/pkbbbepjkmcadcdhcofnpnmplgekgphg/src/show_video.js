
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api?enablejsapi=1";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

document.addEventListener("DOMContentLoaded", function(){
  //if video was last time played, play it now too
  if(localStorage.getItem("video") && localStorage.getItem("last") =="youtube"){
    play();

  }
});

function play(){
  localStorage.setItem("last", "youtube");
  $('#upperPlane').hide();
  $('#lowerPlane').hide();
  $('#current_weather').hide();
  $('#weather_icon').hide();
  $('#current_description').hide();
  $('#time').hide();
  $('#date').hide();
  $('#next').hide();
  $('#navigation').css('margin-top','18px');
  $('#help').css('margin-top', '16px');
  $('#first').css('margin-top', '16px');
  // if youtube API already loaded, play video, else set timeout and try again
  if(typeof(YT) !== 'undefined' && YT && YT.Player){
    var url = localStorage.getItem("video");
    //if playlist
    if(url.indexOf("playlist")>=0){
      onYouTubeIframeAPIReadyP();
    }
    //if video
    else if(url.indexOf("watch")>=0){
      onYouTubeIframeAPIReadyV();
    }
    // if channel
    else if(url.indexOf("channel")>=0){
        $.get(
         "https://www.googleapis.com/youtube/v3/channels",{
         part : 'contentDetails',
         id : getUserName,
         key: 'AIzaSyD4lzW4Pg1oH25VebERS5nYQV6TXxUyiqo'},
         function(data) {
            $.each( data.items, function( i, item ) {
                //get uploaded playlists of channel
                id = item.contentDetails.relatedPlaylists.uploads;

                function onYouTubeIframeAPIReadyC() {
                  player = new YT.Player('player', {
                    height: '100%',
                    width: '100%',
                    playerVars:{
                      listType:'playlist',
                      list: id,
                      'rel': 0,
                      'showinfo': 1,
                      'controls': 1
                    },
                    events: {
                      'onReady': onPlayerReady
                    },
                    mute: true,
                    showYTLogo: false,
                    realfullscreen: true
                  });
                }
                onYouTubeIframeAPIReadyC();
            });
          }
        ).fail(function() {
            console.log("error");
        })
    }
    //if user
    else if(url.indexOf("user")>=0){
      $.get(
       "https://www.googleapis.com/youtube/v3/channels",{
       part : 'contentDetails',
       forUsername : getUserName,
       key: 'AIzaSyD4lzW4Pg1oH25VebERS5nYQV6TXxUyiqo'},
       function(data) {
          $.each( data.items, function( i, item ) {
            //get loaded playlist
              id = item.contentDetails.relatedPlaylists.uploads;
              function onYouTubeIframeAPIReadyC() {
                player = new YT.Player('player', {
                  height: '100%',
                  width: '100%',
                  playerVars:{
                    listType:'playlist',
                    list: id,
                    'rel': 0,
                    'showinfo': 1,
                    'controls': 1
                  },
                  events: {
                    'onReady': onPlayerReady
                  },
                  mute: true,
                  showYTLogo: false,
                  realfullscreen: true
                });
              }
              onYouTubeIframeAPIReadyC();
          });
        }
      ).fail(function() {
          console.log("error");
      })
    }
  }else{
    setTimeout(play, 100);
  }
}
//play playlist
function onYouTubeIframeAPIReadyP() {
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    playerVars:{
      listType:'playlist',
      list: getPId(),
      'rel':0
    },
    events: {
      'onReady': onPlayerReady
    },
    mute: true,
    showYTLogo: false,
    realfullscreen: true
  });
}
//play video
function onYouTubeIframeAPIReadyV() {
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: getVId(),
    events: {
      'onReady': onPlayerReady
    },
    playerVars:{
      'rel':0
    },
    mute: true,
    showYTLogo: false,
    realfullscreen: true
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  player.playVideo();
}
/*-------------------------------------------------------
  hide or show video when image or play ist clicked
-------------------------------------------------------*/
document.addEventListener("click", hideVideo);
function hideVideo(e){
  //image clicked
  if(e.target.classList.contains("change") || e.target.id == 'stopVideo'){
    try {
      var iframe = document.getElementById("player");
      iframe.style.display = "none";
      $('#upperPlane').show();
      $('#lowerPlane').show();
      $('#current_weather').show();
      $('#current_description').show();
      $('#weather_icon').show();
      $('#time').show();
      $('#date').show();
      $('#next').show();
      $('#navigation').css('margin-top','0px');
      $('#settings').css('margin-top', '0px');
      $('#help').css('margin-top', '0px');
      $('#first').css('margin-top', '0px');
      if (player) {
        player.pauseVideo();
      }

    } catch (e) {
      console.log(e);
    }
  }
  if(e.target.id == 'stopVideo'){
    if(player){
      $('#upperPlane').show();
      $('#lowerPlane').show();
      $('#current_weather').show();
      $('#current_description').show();
      $('#next').show();
      $('#navigation').css('margin-top','0px');
      $('#settings').css('margin-top', '0px');
      $('#help').css('margin-top', '0px');
      $('#first').css('margin-top', '0px');
      localStorage.setItem("last","img");

      player.stopVideo();
      player = undefined;
      var str = '<div id="player" ></div>';
      var Obj = document.getElementById('player');
      if(Obj.outerHTML) {
           Obj.outerHTML=str;
      }else{
         var tmpObj=document.createElement("div");
         tmpObj.innerHTML='<!--THIS DATA SHOULD BE REPLACED-->';
         ObjParent=Obj.parentNode;
         ObjParent.replaceChild(tmpObj,Obj); //here we placing our temporary data instead of our target, so we can find it then and replace it into whatever we want to replace to
         ObjParent.innerHTML=ObjParent.innerHTML.replace('<div><!--THIS DATA SHOULD BE REPLACED--></div>',str);
      }
    }else{
      alert('There\'s nothing to stop');
    }
  }
  // play clicked
  if(e.target.id =="submit2" || e.target.id == 'suggestion0' || e.target.id == 'suggestion1' || e.target.id == 'suggestion2'){
    localStorage.setItem("last", "youtube");
    var iframe = document.getElementById("player");
    iframe.style.display = "inline";

     /*---------------------------------------------------------

     the HTML iframe element wich has been created by the youtube
     API has to be replaced with the previous div, after this the
     new video can be played with play() and the youtube api

     ------------------------------------------------------------*/

     player = undefined;

     var str = '<div id="player" ></div>';
     var Obj = document.getElementById('player');
     if(Obj.outerHTML) {
          Obj.outerHTML=str;
     }else{
        var tmpObj=document.createElement("div");
        tmpObj.innerHTML='<!--THIS DATA SHOULD BE REPLACED-->';
        ObjParent=Obj.parentNode;
        ObjParent.replaceChild(tmpObj,Obj); //here we placing our temporary data instead of our target, so we can find it then and replace it into whatever we want to replace to
        ObjParent.innerHTML=ObjParent.innerHTML.replace('<div><!--THIS DATA SHOULD BE REPLACED--></div>',str);
     }
     if(e.target.id == "submit2"){
       var v = document.getElementById("v");
       v = v.value;
       if(v != ""){
         window.localStorage.setItem("video", v);
       }else{
         window.localStorage.setItem("last", null);
       }
     }
     play();
     document.getElementById("next").style.display = "none";
  }
}

function getUserName(){
  var user = localStorage.getItem("video");
  var userId;
  if(user.indexOf("user")>=0){
    for(var i = 0; i<user.length; i++){
      if(user[i] == "u" && user[i+1]== "s" && user[i+2] =="e" && user[i+3] =="r"){
        i=i+5;
        userId=user.slice(i, user.length);
        i= user.length;
      }
    }
  }else{
    var index = user.indexOf("channel");
    userId = user.slice(index+8, user.length);
  }
  return userId;
}

//Get ID of video URL
function getVId(){
  var v = localStorage.getItem("video");
  var id;

  for(var i = 0; i<v.length; i++){

    if(v[i]=="v"){
      id = v.slice(i+2, v.length);
      i=v.length;
    }
  }
  return id;
}

//get ID of playlist URL
function getPId(){
  var id;
  var playlistURL = localStorage.getItem('video');
  var playlistId;
  for(var i=0; i<playlistURL.length; i++){
    if(playlistURL[i]=="?" && playlistURL[i+1] =="l" && playlistURL[i+2]=="i" && playlistURL[i+3]=="s" && playlistURL[i+4]=="t"){
      playlistId = playlistURL.slice(i+6, playlistURL.length);
      i= playlistURL.length;
    }
  }
  id = playlistId;
  return id;
}
