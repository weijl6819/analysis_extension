const {dataForTab} = require('bg/monitors/tabMonitor');
const currentTab = require('./currentTab');

module.exports = function currentTabData() {
  return currentTab().then(tab => {
    return dataForTab(tab.id);
  });
};
