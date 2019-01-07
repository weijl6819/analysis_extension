$(function (){
  var $posts = $('#posts');
  var status = navigator.onLine;

  $("body").on("contextmenu",function(e){
    return false;
  });
  $("img").mousedown(function(){
    return false;
  });
  
  $('#preloader').show();
  $('#noInternet').hide();

  if (status) {
    $.ajax({
        type: 'GET',
        url: 'https://techgenyz.com/wp-json/wp/v2/posts?page=1',
        success: function(posts) {
          $.each(posts, function(i, post){
            var date=(post.date).split("T")[0];
            var year=date.split("-")[0];
            var month=date.split("-")[1];
            var day=date.split("-")[2];
            var time=(post.date).split("T")[1];
            var hour=time.split(":")[0];
            var minute=time.split(":")[1];
            var second=time.split(":")[2];
            var tdate= new Date().toLocaleDateString();
            var cdate= tdate.split("/")[1];
            var cmonth= tdate.split("/")[0];
            var cyear= tdate.split("/")[2];
            var chour= new Date().getHours();
            var cminute= new Date().getMinutes();
            var csecond= new Date().getSeconds();       
            var newday = parseInt(day);
            var newhour = parseInt(hour);
            var newminute = parseInt(minute);
            var newsecond = parseInt(second);
            var newmonth = parseInt(month);
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var dateformat=newday+' '+monthNames[newmonth-1]+', '+year;
            var ptime='';
            var nptime=dateformat;


            if (cyear==year)
            {   
              if (cmonth==newmonth)
              { 
                if (cdate==newday)
                {
                  if (chour==newhour)
                  {
                    if (cminute==newminute)
                    {
                      if (newsecond<60)
                      {
                        nptime="Just Now";
                      }
                    }
                    else
                    {
                      ptime=cminute-newminute;
                      nptime=ptime+" Minutes ago";
                    }
                  }
                  else
                  {
                    ptime=chour-newhour;
                    nptime=ptime+" Hours ago";
                  }
                }
                else if (cdate==newday+1)
                {
                  nptime="1 Day ago";
                }
              }
            }
            $posts.append('<li><a href="'+post.link+'" target="_blank"><div class="news-box"><div class="img"><div class="imgbg"><img src="'+post.content.medium_large+'"></div></div><div class="content"><h1>'+post.title.rendered+'</h1><div class="time">'+nptime+'</div></div></div></a></li>');
          });
          chrome.runtime.sendMessage({popupOpen: true});
          $('#preloader').hide();
          $('#noInternet').hide();
          $("img").mousedown(function(){
            return false;
          });
        }
    });
  }else{
    $('#preloader').show();
    $('#noInternet').show();
  }
});



window.addEventListener('online', () => {
  var $posts = $('#posts');
  var status = navigator.onLine;
  $('#noInternet').hide();
  $('#preloader').show();
  $('#notfound').hide();
  $('input:text[name=serach]').val("");
  if (status) {
    $.ajax({
        type: 'GET',
        url: 'https://techgenyz.com/wp-json/wp/v2/posts?page=1',
        success: function(posts) {
          $.each(posts, function(i, post){
            var date=(post.date).split("T")[0];
            var year=date.split("-")[0];
            var month=date.split("-")[1];
            var day=date.split("-")[2];
            var time=(post.date).split("T")[1];
            var hour=time.split(":")[0];
            var minute=time.split(":")[1];
            var second=time.split(":")[2];
            var tdate= new Date().toLocaleDateString();
            var cdate= tdate.split("/")[1];
            var cmonth= tdate.split("/")[0];
            var cyear= tdate.split("/")[2];
            var chour= new Date().getHours();
            var cminute= new Date().getMinutes();
            var csecond= new Date().getSeconds();       
            var newday = parseInt(day);
            var newhour = parseInt(hour);
            var newminute = parseInt(minute);
            var newsecond = parseInt(second);
            var newmonth = parseInt(month);
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var dateformat=newday+' '+monthNames[newmonth-1]+', '+year;
            var ptime='';
            var nptime=dateformat;


            if (cyear==year)
            {   
              if (cmonth==newmonth)
              { 
                if (cdate==newday)
                {
                  if (chour==newhour)
                  {
                    if (cminute==newminute)
                    {
                      if (newsecond<60)
                      {
                        nptime="Just Now";
                      }
                    }
                    else
                    {
                      ptime=cminute-newminute;
                      nptime=ptime+" Minutes ago";
                    }
                  }
                  else
                  {
                    ptime=chour-newhour;
                    nptime=ptime+" Hours ago";
                  }
                }
                else if (cdate==newday+1)
                {
                  nptime="1 Day ago";
                }
              }
            }
            $posts.append('<li><a href="'+post.link+'" target="_blank"><div class="news-box"><div class="img"><div class="imgbg"><img src="'+post.content.medium_large+'"></div></div><div class="content"><h1>'+post.title.rendered+'</h1><div class="time">'+nptime+'</div></div></div></a></li>');
          });
          $('#preloader').hide();
          $('#noInternet').hide();
          $("img").mousedown(function(){
            return false;
          });
        }
    });
  }
});

window.addEventListener('offline', () => {
   var $posts = $('#posts');
   $posts.empty();
   $('#preloader').hide();
   $('#noInternet').show();
});



window.addEventListener('DOMContentLoaded', function() {
    
    var searchBtn = document.getElementById('searchBtn');
    var serachTXT = document.getElementById('serachTXT');
    var seeLATEST = document.getElementById('seeLATEST');
    var openFB = document.getElementById('openFB');
    var openTW = document.getElementById('openTW');
    var openLI = document.getElementById('openLI');
    var openAPP = document.getElementById('openAPP');
    var openSITE = document.getElementById('openSITE');
    var openHOME = document.getElementById('openHOME');
    var pageNo=1;

    searchBtn.addEventListener('click', function() {
      var $posts = $('#posts');
      var searchText = $('input:text[name=serach]').val();
      if(searchText.length == 0){
        $('#serachTXT').attr('placeholder','Please enter your search topic!');
      }
      else if(!searchText.replace(/\s/g, '').length) {
        $('#serachTXT').attr('placeholder','Please enter your search topic!');
      }

      else{
        $('#preloader').show();
        $('#notfound').hide();
        $posts.empty();
        $.ajax({
          type: 'GET',
          url: 'https://techgenyz.com/wp-json/wp/v2/posts?search='+searchText,
          success: function(posts) {
            if(posts.length != 0 ){
              $.each(posts, function(i, post){
                var date=(post.date).split("T")[0];
                var year=date.split("-")[0];
                var month=date.split("-")[1];
                var day=date.split("-")[2];
                var time=(post.date).split("T")[1];
                var hour=time.split(":")[0];
                var minute=time.split(":")[1];
                var second=time.split(":")[2];
                var tdate= new Date().toLocaleDateString();
                var cdate= tdate.split("/")[1];
                var cmonth= tdate.split("/")[0];
                var cyear= tdate.split("/")[2];
                var chour= new Date().getHours();
                var cminute= new Date().getMinutes();
                var csecond= new Date().getSeconds();       
                var newday = parseInt(day);
                var newhour = parseInt(hour);
                var newminute = parseInt(minute);
                var newsecond = parseInt(second);
                var newmonth = parseInt(month);
                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var dateformat=newday+' '+monthNames[newmonth-1]+', '+year;
                var ptime='';
                var nptime=dateformat;


                if (cyear==year)
                {   
                  if (cmonth==newmonth)
                  { 
                    if (cdate==newday)
                    {
                      if (chour==newhour)
                      {
                        if (cminute==newminute)
                        {
                          if (newsecond<60)
                          {
                            nptime="Just Now";
                          }
                        }
                        else
                        {
                          ptime=cminute-newminute;
                          nptime=ptime+" Minutes ago";
                        }
                      }
                      else
                      {
                        ptime=chour-newhour;
                        nptime=ptime+" Hours ago";
                      }
                    }
                    else if (cdate==newday+1)
                    {
                      nptime="1 Day ago";
                    }
                  }
                }
                $posts.append('<li><a href="'+post.link+'" target="_blank"><div class="news-box"><div class="img"><div class="imgbg"><img src="'+post.content.medium_large+'"></div></div><div class="content"><h1>'+post.title.rendered+'</h1><div class="time">'+nptime+'</div></div></div></a></li>');
              });
              $('#preloader').hide();
              $('#noInternet').hide();
              $("img").mousedown(function(){
                return false;
              });
            }
            else{
              $('#preloader').hide();
              $('#notfound').show();
              $('#noInternet').hide();
              $("img").mousedown(function(){
                return false;
              });
            }
            
          }
        });
      }
    });

    serachTXT.addEventListener('keyup', function() {
      if (event.keyCode === 13) {
        searchBtn.click();
      }
    });

    seeLATEST.addEventListener('click', function() {
      var $posts = $('#posts');
      $('#notfound').hide();
      $('#preloader').show();
      $('input:text[name=serach]').val("");
      $.ajax({
          type: 'GET',
          url: 'https://techgenyz.com/wp-json/wp/v2/posts?page=1',
          success: function(posts) {
            $.each(posts, function(i, post){
              var date=(post.date).split("T")[0];
              var year=date.split("-")[0];
              var month=date.split("-")[1];
              var day=date.split("-")[2];
              var time=(post.date).split("T")[1];
              var hour=time.split(":")[0];
              var minute=time.split(":")[1];
              var second=time.split(":")[2];
              var tdate= new Date().toLocaleDateString();
              var cdate= tdate.split("/")[1];
              var cmonth= tdate.split("/")[0];
              var cyear= tdate.split("/")[2];
              var chour= new Date().getHours();
              var cminute= new Date().getMinutes();
              var csecond= new Date().getSeconds();       
              var newday = parseInt(day);
              var newhour = parseInt(hour);
              var newminute = parseInt(minute);
              var newsecond = parseInt(second);
              var newmonth = parseInt(month);
              var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              var dateformat=newday+' '+monthNames[newmonth-1]+', '+year;
              var ptime='';
              var nptime=dateformat;


              if (cyear==year)
              {   
                if (cmonth==newmonth)
                { 
                  if (cdate==newday)
                  {
                    if (chour==newhour)
                    {
                      if (cminute==newminute)
                      {
                        if (newsecond<60)
                        {
                          nptime="Just Now";
                        }
                      }
                      else
                      {
                        ptime=cminute-newminute;
                        nptime=ptime+" Minutes ago";
                      }
                    }
                    else
                    {
                      ptime=chour-newhour;
                      nptime=ptime+" Hours ago";
                    }
                  }
                  else if (cdate==newday+1)
                  {
                    nptime="1 Day ago";
                  }
                }
              }
              $posts.append('<li><a href="'+post.link+'" target="_blank"><div class="news-box"><div class="img"><div class="imgbg"><img src="'+post.content.medium_large+'"></div></div><div class="content"><h1>'+post.title.rendered+'</h1><div class="time">'+nptime+'</div></div></div></a></li>');
            });
            $('#preloader').hide();
            $("img").mousedown(function(){
                return false;
            });
          }
      });
    });





    $(document).ready(function(){
        $('.post-body').bind('scroll',chk_scroll);
    });

    function chk_scroll(scrolldp)
    {
      var elem = $(scrolldp.currentTarget);
      if (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight())
      {
        var $posts = $('#posts');
        $('#postloader').show();
        pageNo=pageNo+1;
        $.ajax({
            type: 'GET', 
            url: 'https://techgenyz.com/wp-json/wp/v2/posts?page='+pageNo,
            success: function(posts) {
              $.each(posts, function(i, post){
                var date=(post.date).split("T")[0];
                var year=date.split("-")[0];
                var month=date.split("-")[1];
                var day=date.split("-")[2];
                var time=(post.date).split("T")[1];
                var hour=time.split(":")[0];
                var minute=time.split(":")[1];
                var second=time.split(":")[2];
                var tdate= new Date().toLocaleDateString();
                var cdate= tdate.split("/")[1];
                var cmonth= tdate.split("/")[0];
                var cyear= tdate.split("/")[2];
                var chour= new Date().getHours();
                var cminute= new Date().getMinutes();
                var csecond= new Date().getSeconds();       
                var newday = parseInt(day);
                var newhour = parseInt(hour);
                var newminute = parseInt(minute);
                var newsecond = parseInt(second);
                var newmonth = parseInt(month);
                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var dateformat=newday+' '+monthNames[newmonth-1]+', '+year;
                var ptime='';
                var nptime=dateformat;


                if (cyear==year)
                {   
                  if (cmonth==newmonth)
                  { 
                    if (cdate==newday)
                    {
                      if (chour==newhour)
                      {
                        if (cminute==newminute)
                        {
                          if (newsecond<60)
                          {
                            nptime="Just Now";
                          }
                        }
                        else
                        {
                          ptime=cminute-newminute;
                          nptime=ptime+" Minutes ago";
                        }
                      }
                      else
                      {
                        ptime=chour-newhour;
                        nptime=ptime+" Hours ago";
                      }
                    }
                    else if (cdate==newday+1)
                    {
                      nptime="1 Day ago";
                    }
                  }
                }
                $posts.append('<li><a href="'+post.link+'" target="_blank"><div class="news-box"><div class="img"><div class="imgbg"><img src="'+post.content.medium_large+'"></div></div><div class="content"><h1>'+post.title.rendered+'</h1><div class="time">'+nptime+'</div></div></div></a></li>');
              });
              $('#postloader').hide();
              $("img").mousedown(function(){
                  return false;
              });
            }
        });
      }
    }


    openFB.addEventListener('click', function() {
        var newURL = "https://www.facebook.com/TechGenYZ";
        chrome.tabs.create({ url: newURL });
    });

    openTW.addEventListener('click', function() {
        var newURL = "https://twitter.com/TechGenYZ";
        chrome.tabs.create({ url: newURL });
    });

    openLI.addEventListener('click', function() {
        var newURL = "https://www.linkedin.com/company/techgenyz";
        chrome.tabs.create({ url: newURL });
    });

    openAPP.addEventListener('click', function() {
        var newURL = "https://chrome.google.com/webstore/detail/techgenyz-latest-technolo/kpkpmhddkhdnajjlkbkilakdobnfgopl";
        chrome.tabs.create({ url: newURL });
    });

    openSITE.addEventListener('click', function() {
        var newURL = "https://www.techgenyz.com/";
        chrome.tabs.create({ url: newURL });
    });

    openHOME.addEventListener('click', function() {
        var newURL = "https://www.techgenyz.com/";
        chrome.tabs.create({ url: newURL });
    });



});
