import tldjs from 'tldjs';
import cache from 'cache/cashbackCache';

export default (data, tab) => {
  const domain = tldjs.getDomain(tab.url);
  cache.set(domain, {dismissed: Date.now()});
};
