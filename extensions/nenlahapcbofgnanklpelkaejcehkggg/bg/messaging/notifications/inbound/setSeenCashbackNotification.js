import tldjs from 'tldjs';
import cache from 'cache/cashbackCache';

export default (data, tab) => {
  const domain = tldjs.getDomain(tab.url);
  const cashback = cache.get(domain);
  cache.set(domain, {
    hasSeenFirst: Date.now(),
    seenCount: (cashback && cashback.seenCount ? cashback.seenCount : 0) + 1
  });
};
