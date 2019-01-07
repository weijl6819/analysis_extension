export default request => {
  chrome.tabs.create({url: request.url, active: !!request.active}, tab => {});
};
