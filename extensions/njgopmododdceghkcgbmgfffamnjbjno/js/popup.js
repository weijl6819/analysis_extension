/////////////////////////////////////////////////////////
//
// FindFlix (C) JRKR.CO 2016 | GitHub.com/Jarker/FindFlix
//
/////////////////////////////////////////////////////////

//Adding Event Listeners to individual results after searching
function addEventListenersToResults(e) {
  var href = e.currentTarget.href;
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.update(tab.id, {url: href});
  });
}

function testStorage() {
  chrome.storage.sync.get("test", function(items) {
    console.log(items.test);
  });
}

//Using jQuery for the real-time searching
//as is the best documented library for real-time
//JSON searching.
$(document).ready(function() {
  $('#searchCategory').keyup(function() {
  var searchField = $('#searchCategory').val();
  console.log(searchField);
  var searchExpression = new RegExp(searchField, 'i');
  $.getJSON('data/categories.json', function(data) {
    var resultOutput = '';
    $.each(data, function(key, val) {
      if((val.title.search(searchExpression) != -1)) {
        resultOutput += '<div class="result">';
        resultOutput += '<a href="' + val.href + '">';
        resultOutput += val.title;
        resultOutput += '</a></div>';
        }
      });
      $('#resultsList').html(resultOutput);
    });
  });
  $('body').on('click', '.result a', addEventListenersToResults);
  chrome.storage.sync.set({"test": 'this is a test'});
  testStorage();
});
