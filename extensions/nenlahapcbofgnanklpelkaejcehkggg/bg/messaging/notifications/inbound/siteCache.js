import {default as getSite, setSite} from 'cache/siteCache';
import _ from 'lodash';
import getSiteDomainFromUrl from 'utility/getSiteDomainFromUrl';

export default (data = null, tab) => {
  if (_.isString(data) && data.indexOf('shopify.com') > -1) {
    return getSite(data);
  }
  if (data && _.isObject(data) && data.setSite) {
    const domain = tab ? getSiteDomainFromUrl(tab.url) : data.domain;
    setSite(domain, _.omit(data, ['domain, setSite']));
  }
  if (tab) {
    const domain = getSiteDomainFromUrl(tab.url);
    return getSite(domain);
  }
};
