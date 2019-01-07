import tldjs from 'tldjs';

export default function initSite() {
  try {
    const domain = tldjs.getDomain(window.location.href);
    const result = require('../sites/' + domain + '/index');
    if (result) {
      return result.default();
    }
  } catch (e) {
    console.log(e);
    return {
      error: 'Site not supported'
    };
  }
}
