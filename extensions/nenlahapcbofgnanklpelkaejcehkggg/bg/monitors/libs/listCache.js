import LRU from 'lru-cache';
import Promise from 'bluebird'; // jshint ignore:line
import exponentialBackoff from 'iv-exponential-backoff';
import {BloomFilter} from 'iv-bloomfilter';
import {getBloom} from 'api/site';
import publicSuffixList from 'iv-public-suffix-list';

const cache = LRU({
  max: 15,
  maxAge: 1000 * 60 * 60 * 24
});

function getLists() {
  const lists = cache.get('lists');
  if (lists) {
    return Promise.resolve(lists);
  }
  return exponentialBackoff(async () => {
    const json = await getBloom();
    return json;
  }).then(lists => {
    const backlistConfig = lists.blacklistC;
    const whitelistConfig = lists.whitelistC;
    const tracklistConfig = lists.tracklistC;
    const whitelistFilter = new BloomFilter(
      whitelistConfig.bitsPerKey,
      whitelistConfig.numKeys,
      whitelistConfig.filter
    );
    const blacklistFilter = new BloomFilter(
      backlistConfig.bitsPerKey,
      backlistConfig.numKeys,
      backlistConfig.filter
    );
    const tracklistFilter = new BloomFilter(
      tracklistConfig.bitsPerKey,
      tracklistConfig.numKeys,
      tracklistConfig.filter
    );
    const data = {
      whitelist: whitelistFilter,
      blacklist: blacklistFilter,
      tracklist: tracklistFilter
    };
    cache.set('lists', data);
    return data;
  });
}

function checkDomain(host, domain, filter) {
  if (host !== domain) {
    if (filter.has(host)) {
      return true;
    }
    const domains = host.split('.');
    const currentPart = domains.shift();
    const nextDomain = domains.join('.');
    return checkDomain(nextDomain, domain, filter);
  } else {
    return filter.has(host);
  }
}

export function isBlacklisted(host) {
  const domain = publicSuffixList.getDomain(host);
  return getLists().then(function(lists) {
    // Check if any of the domains are whitelisted
    if (checkDomain(host, domain, lists.whitelist)) {
      return false;
    }
    // Check if any of the domains are blacklisted
    return checkDomain(host, domain, lists.blacklist);
  });
}

export function isWhitelisted(host) {
  const domain = publicSuffixList.getDomain(host);
  return getLists().then(function(lists) {
    return checkDomain(host, domain, lists.whitelist);
  });
}

export function isTracklisted(host) {
  const domain = publicSuffixList.getDomain(host);
  return getLists().then(function(lists) {
    return checkDomain(host, domain, lists.tracklist);
  });
}

// Preload bloom
getBloom();
