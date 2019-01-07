
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
/**
 * Copyright 2011 Zoee Silcock (zoeetrope.com)
 *
 * This file is part of Reddit Hover Text.
 *
 * Reddit Hover Text is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Reddit Hover Text is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Reddit Hover Text. If not, see <http://www.gnu.org/licenses/>.
 **/

/**
 * The timeout variable we use to delay showing and hiding of the hover div.
 **/
var hideTimeout;
var showTimeout;
/**
 * The url whose data we have in the hover div currently, it's used to avoid
 * asking for the same data several times in a row.
 **/
var lastUrl;
/**
 * The link_id whose data we have in the hover div currently, it's used to avoid
 * asking for the same data several times in a row.
 **/
var lastLink;

/**
 * This is where the magic starts as soon as the page has finished loading.
 * We go through all the anchor tags with the class title and check if they
 * are text based submissions and not url submissions. We add eventhandlers for
 * mouseenter and mouseleave to the text submissions.
 **/
$(document).ready(function() {
  initHover();

  $('div.content').on('mouseenter', 'a.title', handleMouseEnter);
  $('div.content').on('mouseleave', 'a.title', handleMouseLeave);
});

/**
 * This function adds the floating div we use to display the content. We are
 * handling mouseenter and mouseleave events on it to avoid hiding the hover
 * when the user moves the mouse over it. This allows the user to press links
 * in the content.
 **/
function initHover() {
  $('body').append('<div id="reddit-hover">a</div>');
  $('#reddit-hover').hide();

  $('#reddit-hover').hover(function() {
    if(hideTimeout !== null) {
      // Don't hide the hover if the mouse enters the hover.
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  }, handleMouseLeave);
}

/**
 * This is the event handler for mouseenter on the links. First we check to see
 * if there is a hideHover() pending, if so we will cancel it. Next we will
 * check if we need to request new data via ajax. Finally we show the hover
 * with a 250 ms delay to avoid unintended triggers.
 *
 * @argument {object} e The event object.
 **/
function handleMouseEnter(e) {
  var thingElement = $(e.target).closest('.thing');
  var linkId = $(thingElement).data('fullname');
  var url = $(e.target).attr('href');
  var showDelay = 250;
  var regex = new RegExp('/r/.*/comments');

  if (regex.exec(url) !== null &&
      $(e.target).closest('.entry').find('.expando-button.selftext').length === 1) {
    if(hideTimeout !== null && lastLink !== linkId) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
      showDelay = 0;
    }

    showTimeout = setTimeout(function() {
      showTimeout = null;
      if (lastLink !== linkId) {
	lastUrl = window.location.protocol + '//www.reddit.com' + url;
	populateHover(linkId);
      }

      positionHover($(e.target));
      showHover();
    }, showDelay);
  }
}

/**
 * This is the event handler for mouseleave both on links and on the actual
 * hover div. We use a 250 ms timeout which allows the user to move from the
 * link to the hover and back without hiding the hover.
 *
 * @argument {object} e The event object.
 **/
function handleMouseLeave(e) {
  if(showTimeout !== null) {
    clearTimeout(showTimeout);
    showTimeout = null;
  } else {
    hideTimeout = setTimeout(function() {
      hideTimeout = null;
      hideHover();
    }, 250);
  }
}

/**
 * This function positions the hover div based on the location of the link
 * it is attached to.
 *
 * @argument {object} element The element used to decide the placement of the
 * hover div.
 **/
function positionHover(element) {
  var position = $(element).offset();

  $('#reddit-hover').css('left', position.left);
  $('#reddit-hover').css('top', position.top + $(element).height() + 2);
}

/**
 * This is where we actually put content into the hover div. We start by
 * placing our loading gif so the user knows that we are retreiving the data.
 * Next we trigger an ajax call to the link and extract the selftext_html
 * from the JSON result.
 *
 * @argument {string} linkId The id of the link to fetch.
 **/
function populateHover(linkId) {
  lastLink = linkId;
  $('#reddit-hover').html('<img src="' + chrome.extension.getURL(getLoadingImage()) + '" />');

  $.ajax({
    url: window.location.protocol + '//www.reddit.com/api/expando',
    type: 'POST',
    data: {
      'link_id': linkId
    },
    success: function(data) {
      $('#reddit-hover').html(html_entity_decode(data));
      $('#reddit-hover').prepend(getOptionsDiv());

      if (markAsVisitedEnabled()) {
	chrome.extension.sendRequest({action: 'addUrlToHistory', url: lastUrl});
      }
    }
  }).fail(function() {
    hideHover();
    lastUrl = '';
    lastLink = null;
    $('#reddit-hover').html('');
  });
}

/**
 * This shows the hover div, it's in a separate function in case we decide to
 * put an animation on it later.
 **/
function showHover() {
  $('#reddit-hover').show();
}

/**
 * This hides the hover div, it's in a separate function in case we decide to
 * put an animation on it later.
 **/
function hideHover() {
  $('#reddit-hover').hide();
}

function getLoadingImage() {
  if ($('body.res-nightmode').length) {
    return "ajax-loader-night.gif";
  } else {
    return "ajax-loader.gif";
  }
}

function getOptionsDiv() {
  var div = $('<div class="optionsDiv"></div>');
  var markAsVisited = $('<a href="#">Mark as visited</a>');
  var visitedHelp = $('<span>(Click to toggle marking links as visited.)</span>');

  if(!markAsVisitedEnabled()) {
    markAsVisited.addClass('enableisited');
  } else {
    markAsVisited.addClass('disableVisited');
  }

  $(markAsVisited).bind('click', function(event) {
    event.preventDefault();
    toggleMarkAsVisited();

    if(!markAsVisitedEnabled()) {
      $(this).addClass('enableVisited');
      $(this).removeClass('disableVisited');
    } else {
      $(this).addClass('disableVisited');
      $(this).removeClass('enableVisited');

      chrome.extension.sendRequest({action: 'addUrlToHistory', url: lastUrl});
    }
  });

  $(markAsVisited).bind('mouseenter', {help: visitedHelp}, function(event) {
    $(event.data.help).show();
  });
  $(markAsVisited).bind('mouseleave', {help: visitedHelp}, function(event) {
    $(event.data.help).hide();
  });

  $(div).prepend(visitedHelp);
  $(visitedHelp).hide();
  $(div).prepend(markAsVisited);

  return div;
}

function toggleMarkAsVisited() {
  if(markAsVisitedEnabled()) {
    localStorage.setItem('markAsVisited', false);
  } else {
    localStorage.setItem('markAsVisited', true);
  }
}

function markAsVisitedEnabled() {
  return localStorage.getItem('markAsVisited') === 'true';
}

/**
 * A helper function for translating html entities into their real characters
 * since we are using the html markup that reddit provides to format the data
 * in the hover div.
 *
 * @argument {string} str The input string.
 **/
function html_entity_decode(str) {
  return $('<textarea />').html(str).text();
}
