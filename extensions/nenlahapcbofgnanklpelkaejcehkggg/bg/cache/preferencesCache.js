import LRU from 'lru-cache';
import Promise from 'bluebird'; // jshint ignore:line
import exponentialBackoff from 'iv-exponential-backoff';
import {getPreferences as fetchPreferences} from 'api/preferences';

const cache = LRU({
  max: 15,
  maxAge: 1000 * 60 * 10 // 10 min
});

export function clear() {
  cache.reset();
}

export default function getPreferences() {
  const prefs = cache.get('preferences');
  if (prefs) {
    return Promise.resolve(prefs);
  }
  return exponentialBackoff(async () => {
    const json = await fetchPreferences();
    return json;
  }).then(json => {
    cache.set('preferences', json);
    return json;
  });
}
