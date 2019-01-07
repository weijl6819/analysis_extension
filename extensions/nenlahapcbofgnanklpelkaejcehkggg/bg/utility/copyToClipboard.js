module.exports = function copyTextToClipboard(str) {
  document.oncopy = function(event) {
    event.clipboardData.setData('text/plain', str);
    event.preventDefault();
    document.oncopy = null;
  };
  document.execCommand('copy', false, null);
};
