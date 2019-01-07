
// Saves options to chrome.storage.sync.
function save_options() {
  var comment = document.getElementById('comment').checked;
  var fbshare = document.getElementById('fbshare').checked;
  var fbmessage = document.getElementById('fbmessage').checked;
   var tweet = document.getElementById('tweet').checked;
   var reddit = document.getElementById('reddit').checked;
   var instapaper = document.getElementById('instapaper').checked;
   var evernote = document.getElementById('evernote').checked;
   var pocket = document.getElementById('pocket').checked;
   var mail = document.getElementById('mail').checked;
    var ytplay = document.getElementById('ytplay').checked;
     var newtab = document.getElementById('newtab').checked;
      var shortener = document.getElementById('shortener').checked;
       var removeads = document.getElementById('removeads').checked;
       var justMain = document.getElementById('justMain').checked;
       var favicon = document.getElementById('favicon').checked;
       var urlclickable = document.getElementById('urlclickable').checked;

       
  chrome.storage.sync.set({
    fbshare: fbshare,
    fbmessage: fbmessage,
    comment: comment,
    tweet: tweet,
    reddit: reddit,
    instapaper: instapaper,
    evernote: evernote,
    pocket: pocket,
    mail: mail,
    ytplay: ytplay,
    newtab: newtab,
    shortener: shortener,
    urlclickable: urlclickable,
    removeads: removeads,
    justMain: justMain,
    favicon: favicon
    
    
  }, function() {
    // Update status to let user know options were saved.
/*
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
*/
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    fbshare: true,
    fbmessage: true,
    comment: false,
    tweet: true,
    reddit: false,
    instapaper: false,
    evernote: true,
    pocket: true,
    mail: true,
    ytplay: true,
    newtab: true,
    shortener: true,
    removeads: true,
    urlclickable: true,
    favicon: true,
    justMain: true

        
  }, function(items) {
    document.getElementById('comment').checked = items.comment;
    document.getElementById('fbshare').checked = items.fbshare;
     document.getElementById('fbmessage').checked = items.fbmessage;
    document.getElementById('tweet').checked = items.tweet;
    document.getElementById('reddit').checked = items.reddit;
    document.getElementById('instapaper').checked = items.instapaper;
    document.getElementById('evernote').checked = items.evernote;
      document.getElementById('pocket').checked = items.pocket;
    document.getElementById('mail').checked = items.mail;
    document.getElementById('ytplay').checked = items.ytplay;
    document.getElementById('newtab').checked = items.newtab;
    document.getElementById('shortener').checked = items.shortener;
    document.getElementById('removeads').checked = items.removeads;
     document.getElementById('urlclickable').checked = items.urlclickable;
     document.getElementById('justMain').checked = items.justMain;
     document.getElementById('favicon').checked = items.favicon;
    
  });
}


document.addEventListener('DOMContentLoaded', restore_options);
/*
document.getElementById('save').addEventListener('click',
    save_options);
*/

    
    var classname = document.getElementsByClassName("option");

for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', save_options, false);
}

 