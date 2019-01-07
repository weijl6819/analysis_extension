import tldjs from 'tldjs';
import cache from 'cache/customNotificationCache';

export default (data, tab) => {
  const domain = tldjs.getDomain(tab.url);
  cache.set(domain, {engaged: Date.now()});
};
