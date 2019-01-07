export default async data => {
  if (data && data.redirect) {
    chrome.tabs.create({url: data.redirect, active: true}, tab => {});
  }
};
