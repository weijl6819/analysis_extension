import tldjs from 'tldjs';
import cache from 'cache/customNotificationCache';

export default async (data, tab) => {
  const url = tab.url;
  const domain = tldjs.getDomain(url);
  return cache.get(domain);
};
