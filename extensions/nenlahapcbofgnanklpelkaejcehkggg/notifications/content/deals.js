import tldjs from 'tldjs';

export default function initSite() {
  try {
    const domain = tldjs.getDomain(window.location.href);
    const result = require('./dealSites/' + domain + '/index');
    if (result) {
      return result.default();
    }
  } catch (e) {
    return {
      error: 'Site not supported'
    };
  }
}
