import _ from 'lodash';
import tldjs from 'tldjs';
import {ORIGIN_SITE_API} from 'constants';
import tree from 'state';

chrome.webRequest.onBeforeSendHeaders.addListener(
  details => {
    const needsCookie = _.find(details.requestHeaders, h => h.name === 'x-wb-cookie');
    if (needsCookie && details.url.indexOf('v1/redirect') === -1) {
      details.requestHeaders.push({
        name: 'Cookie',
        value: `wb_session=${tree.get('sessionToken')}`
      });
    }

    return {requestHeaders: details.requestHeaders};
  },
  {urls: ['<all_urls>'], types: ['xmlhttprequest']},
  ['blocking', 'requestHeaders']
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  details => {
    const domain = tldjs.getDomain(details.url);
    if (
      (domain && domain.match(/wikibuy\.com|ivf-dev\.com|ivf-local\.com|ivaws\.com/)) ||
      details.url.indexOf(ORIGIN_SITE_API) > -1
    ) {
      details.requestHeaders.push({
        name: 'x-wb-extension',
        value: 'true'
      });
      const token = tree.get(['lastAccountSession', 'sessionToken']);
      if (token) {
        details.requestHeaders.push({
          name: 'x-wb-session',
          value: decodeURIComponent(token)
        });
      }
    }
    return {requestHeaders: details.requestHeaders};
  },
  {
    urls: [
      '*://*.wikibuy.com/*',
      '*://*.ivf-dev.com/*',
      '*://*.ivf-local.com/*',
      '*://*.ivaws.com/*'
    ],
    types: ['xmlhttprequest', 'main_frame']
  },
  ['blocking', 'requestHeaders']
);
