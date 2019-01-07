import UAParser from 'ua-parser-js';
import _ from 'lodash';
const uaParser = new UAParser();

export function getContextProperties() {
  const uaResult = uaParser.getResult();
  return {
    userAgent: window.navigator.userAgent,
    browser: _.get(uaResult, 'browser'),
    device: {
      model: _.get(uaResult, 'device.model'),
      type: _.get(uaResult, 'device.type'),
      manufacturer: _.get(uaResult, 'device.vendor')
    },
    locale: _.get(window, 'navigator.language'),
    os: _.get(uaResult, 'os'),
    screen: {
      width: _.get(window, 'screen.availWidth') || _.get(window, 'screen.width'),
      height: _.get(window, 'screen.availHeight') || _.get(window, 'screen.height'),
      density: window.devicePixelRatio
    },
    page: {
      path: _.get(window, 'location.pathname'),
      url: _.get(window, 'location.href'),
      referrer: _.get(document, 'referrer'),
      search: _.get(window, 'location.search'),
      title: _.get(document, 'title')
    }
  };
}
