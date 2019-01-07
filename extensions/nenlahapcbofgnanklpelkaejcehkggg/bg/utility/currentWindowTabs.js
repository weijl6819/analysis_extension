const promisifyChromeFunctions = require('./promisifyChromeFunctions');
promisifyChromeFunctions(chrome.tabs);

module.exports = function currentWindowTabs() {
  return chrome.tabs.queryAsync({currentWindow: true}).then(tabs => {
    return tabs;
  });
};
