
function rain() {
  chrome.tabs.executeScript({
    file: 'nCage.js'
  }); 
  window.close();
}

function God() {
  chrome.tabs.executeScript({
    file: 'God.js'
  }); 
  window.close();
}
function pepe() {
  chrome.tabs.executeScript({
    file: 'pepe.js'
  }); 
  window.close();
}
function Illuminati() {
  chrome.tabs.executeScript({
    file: 'Illuminati.js'
  }); 
  window.close();

}
function Money() {
  chrome.tabs.executeScript({
    file: 'Money.js'
  }); 
  window.close();

}
function Fedora() {
  chrome.tabs.executeScript({
    file: 'Fedora.js'
  }); 
  window.close();

}

function stopAll() {
  chrome.tabs.executeScript({
    file: 'stopall.js'
  }); 
}



document.getElementById('nCage').addEventListener('click', rain);
document.getElementById('God').addEventListener('click', God);
document.getElementById('pepe').addEventListener('click', pepe);
document.getElementById('Illuminati').addEventListener('click', Illuminati);
document.getElementById('Money').addEventListener('click', Money);
document.getElementById('Fedora').addEventListener('click', Fedora);
document.getElementById('stopAll').addEventListener('click', stopAll);
