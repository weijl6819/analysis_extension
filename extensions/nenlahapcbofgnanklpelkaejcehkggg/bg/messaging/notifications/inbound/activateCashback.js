import tldjs from 'tldjs';
import cache from 'cache/cashbackCache';
import {standDown} from 'monitors/afsrcMonitor';

export default ({redirectURL}, tab) => {
  standDown(tab.url);
  const domain = tldjs.getDomain(tab.url);
  cache.set(domain, {activated: Date.now()});
};
