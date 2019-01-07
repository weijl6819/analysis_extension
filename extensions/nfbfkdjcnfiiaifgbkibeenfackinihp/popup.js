//var manifest = GetManifest();
var rdata = {}, xd;

function GetManifest() {
    var req = new XMLHttpRequest();
    req.open("GET", chrome.extension.getURL("manifest.json"), false);
    req.send(null);
    if(req.readyState == 4){
        return JSON.parse(req.responseText);
    }
}

function mes(s,t) {
  $('#mes').fadeIn();
  $('#mes').html('<div class="alert alert-dismissable alert-'+t+'"><button type="button" class="close" data-dismiss="alert">x</button>'+s+'</div>');
  if (t != 'danger')
    $('#mes').fadeOut(3000);
}

function SetFooter() {
  $("#files_in_db").html(rdata.length);
  $("#last_updated").html(format_time(new Date().getTime() - localStorage["u"])+' ago');
}

function SaveOptions() {
  localStorage["options"] = JSON.stringify(options);
}

function Reload() {
  if(xd && xd.readystate != 4) xd.abort();
  localStorage["rdata"] = JSON.stringify({});
  $('#data').html('<center>Downloading...</center>');
  xd = $.ajax({
    url: 'http://downloads.z3x-team.com/free_files.json',
    type: 'GET',
    cache: false
  })
  .done(function(e){	
	rdata = e;
    localStorage["rdata"] = pako.deflate(JSON.stringify(e), {to: 'string', level: 5});
    localStorage["u"] = new Date().getTime();
    ShowFiles('');
    SetFooter();
  })
  .fail(function(){
    localStorage["u"] = 0;
    $('#data').html('<center>Data not received!</center>');
  });
}

function NeedUpdate () {
  return parseInt(localStorage["u"]) + (24*60*60*1000) < new Date().getTime();
}

function ParsePath(s) {
  var output = {};
  output["file"] = s.substring(s.lastIndexOf('/')+1);
  output["path"] = s.substring(0,s.length-output["file"].length - 1);
  return output;
}

function format_size(i){
  if (Math.round(i / 1073741824) > 0) { return (i / (1024 * 1024 * 1024)).toFixed(2) + ' Gb';} else 
  if (Math.round(i / 1048576) > 0) { return (i / (1024 * 1024)).toFixed(2) + ' Mb';} else
  if (Math.round(i / 1024) > 0) { return (i / 1024).toFixed(2) + ' Kb';} else
  if (i < 1024) { return i+" B";}
}

function format_time(i){
  i = i / 1000;
  if (Math.round(i / 86400) > 1) { return Math.round(i / 86400) + ' days';} else 
  if (Math.round(i / 3600) > 1) { return Math.round(i / 3600) + ' hour(s)';} else
  if (Math.round(i / 60) > 1) { return Math.round(i / 60) + ' min.';} else
  { return Math.round(i)+" sec.";}
}

function ShowFiles(s) {
  localStorage["s"] = s;
  localStorage["i"] = -1;
  var t = '<table class="table table-hover" id="tbl">';
  var a = 0;
  for(var i = 0;i < rdata.length; i++) {
    if (a < 100) {
	  if (rdata[i].f != null)
      if (s == '' || rdata[i].f.toLowerCase().search(s.toLowerCase()) != -1) {
		//console.log(rdata[i].f);
        t += '<tr><td><a href="http://downloads.z3x-team.com/get_free_file.php?hash='+rdata[i].h+'" target="_blank">'+ParsePath(rdata[i].f).file+'</a><br><span class="label label-default">'+ParsePath(rdata[i].f).path+'</span>&nbsp;<span class="label label-success">'+format_size(rdata[i].s)+'</span>&nbsp;<span class="label label-info">Peers: '+(rdata[i].c > 1024 ? (rdata[i].c / 1024).toFixed(2)+' k' : rdata[i].c)+'</span></td></tr>';
        a += 1;
        localStorage["i"] = i;
      } 
    }
  }
  $('#data').html(t+'</table>');
  SetFooter();
}

function ShowFilesFrom() {
  var a = 0;
  for(var i = parseInt(localStorage["i"])+1;i < rdata.length; i++) {
    if (a < 100) {
      if (localStorage["s"] == '' || rdata[i].f.toLowerCase().search(localStorage["s"].toLowerCase()) != -1) {
        $("#tbl tr:last").after('<tr><td><a href="http://downloads.z3x-team.com/get_free_file.php?hash='+rdata[i].h+'" target="_blank">'+ParsePath(rdata[i].f).file+'</a><br><span class="label label-default">'+ParsePath(rdata[i].f).path+'</span>&nbsp;<span class="label label-success">'+format_size(rdata[i].s)+'</span>&nbsp;<span class="label label-info">Peers: '+(rdata[i].c > 1024 ? (rdata[i].c / 1024).toFixed(2)+' k' : rdata[i].c)+'</span></td></tr>');
        a += 1;
        localStorage["i"] = i;
      } 
    }
  }
  SetFooter();
}

function Init() {
  
  localStorage["u"] = localStorage["u"] == null ? 0 : localStorage["u"]; 
  localStorage["s"] = '';
  localStorage["i"] = -1;
  
  try { rdata = JSON.parse(pako.inflate(localStorage["rdata"],{to: 'string'}));} catch(err) {};

  $("#clear_button").click(function(){
    $("#search").val('').keyup();
  });

  $("#search").keyup(function(){
    ShowFiles($("#search").val());
  });

  if (NeedUpdate()) {
      Reload();
  }

  $("#update").click(function(){
    Reload();
  });

  $(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() == $(document).height())
      if (localStorage["i"] != -1){
        ShowFilesFrom();
    }
  });

  ShowFiles('');
  SetFooter();
}

document.addEventListener('DOMContentLoaded', function () {
  Init();
});
