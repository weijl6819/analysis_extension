export default async (data, tab) => {
  return new Promise(res => {
    chrome.tabs.executeScript(tab.id, {file: `/GENERATED/${data.name}.js`}, res);
  });
};
