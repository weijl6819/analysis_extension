function update(){
chrome.storage.local.get(['user'], function(result) {
  //console.log('Value currently is ' + result.user);
  if(result.user != undefined){document.getElementById('username').value = result.user;}else{document.getElementById('username').value = ''}
});
chrome.storage.local.get(['pass'], function(result) {
  //console.log('Value currently is ' + result.user);
  if(result.pass!= undefined){document.getElementById('password').value = result.pass;}else{document.getElementById('password').value = '';}
});
chrome.storage.local.get(['bid'], function(result) {
  //console.log('Value currently is ' + result.user);
  if(result.bid!= undefined){document.getElementById('bid').value = result.bid;}else{document.getElementById('bid').value = '';}
});
chrome.storage.local.get(['offset1'], function(result) {
  //console.log('Value currently is ' + result.user);
  if(result.offset1!= undefined){document.getElementById('offset1').value = result.offset1;}else{document.getElementById('offset1').value='';}
});
chrome.storage.local.get(['offset2'], function(result) {
  //console.log('Value currently is ' + result.user);
  if(result.offset2!= undefined){document.getElementById('offset2').value = result.offset2;}else{document.getElementById('offset2').value='';}
});
}
update();
  let page = document.getElementById('buttonDiv');
  let button = document.createElement('button');
  button.type="submit";
  button.value="save";
  var t = document.createTextNode("SAVE");
  button.appendChild(t);
  button.addEventListener('click', function() {
          var user = document.getElementById('username').value;
          var pass = document.getElementById('password').value;
          var bid = document.getElementById('bid').value;
          var offset1 = document.getElementById('offset1').value;
          var offset2 = document.getElementById('offset2').value;
          
          chrome.storage.local.set({'user': user}, function() {
        })
          chrome.storage.local.set({'pass': pass}, function() {
        })
          chrome.storage.local.set({'bid': bid}, function() {
        })
          chrome.storage.local.set({'offset1': offset1}, function() {
        })
          chrome.storage.local.set({'offset2': offset2}, function() {
        })
          update();
        })
   page.appendChild(button);

  let button2 = document.createElement('button');
  var t2 = document.createTextNode("CLEAR");
  button2.appendChild(t2);
  button2.addEventListener('click', function() {
          chrome.storage.local.clear(function(){update()});
        })
   page.appendChild(button2);