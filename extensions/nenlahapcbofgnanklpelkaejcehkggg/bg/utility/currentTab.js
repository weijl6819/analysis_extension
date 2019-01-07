import Promise from 'bluebird';
const promisifyChromeFunctions = require('./promisifyChromeFunctions');
promisifyChromeFunctions(chrome.tabs);

module.exports = function currentTab() {
  return new Promise(resolve => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      const tab = tabs && tabs.length ? tabs[0] : tabs && tabs.id ? tabs : {};
      resolve(tab);
    });
  });
};
