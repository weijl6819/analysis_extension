function fetch_feed() {
  chrome.extension.sendRequest({'action' : 'fetch_feed', 'url' : 'http://smallgarden-ideas.com/feed/'}, 
    function(response) {
      display_stories(response);
    }
  );
}

function display_stories(feed_data) {
  var xml_doc = $.parseXML(feed_data);
  $xml = $(xml_doc);
  //$('#popup').html('<div id="logo"></div><br clear="all" />');
  /*$('#logo')[0].addEventListener('click', function() {
    open_item('http://lifehacker.com/')
    window.close() } )*/

  var items = $xml.find("item");
  items.each(function(index, element) {
    var post = parse_post(element);
    var item = '';
    var class2 = '';
    if (index >= localStorage['unread_count']) {
      // // console.log('visited');
      item += '<div class="post read">';
    }
    else {
      item += '<div class="post">'
    }
    item += '<a href="' + post.url + '">\
            <div id="' + post.id + '" class="item">\
              <img src="' + post.img + '" width="75" height="75" />\
              <h4>' + post.title + '</h4>\
              <span class="description">' + post.description + '...</span>\
            </div>\
          </a>';
    item += '</div>';
    $('#popup').append(item);
    // TODO why isn't jQuery's .on defined?
    var $item = $('div[id="' + post.id + '"]')
    console.log('$item', $item)
    $item[0].addEventListener('click', function() {
      open_item(post.url) } )
  });
}

$(document).ready(function() {
  fetch_feed();
});
