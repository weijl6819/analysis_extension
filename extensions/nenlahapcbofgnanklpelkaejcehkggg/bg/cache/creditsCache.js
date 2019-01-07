import LRU from 'lru-cache';
import Promise from 'bluebird'; // jshint ignore:line
import exponentialBackoff from 'iv-exponential-backoff';
import {getCredits as fetchCredits} from 'api/preferences';

const cache = LRU({
  max: 15,
  maxAge: 1000 * 60 * 10 // 10 min
});

export function clear() {
  cache.reset();
}

export default function getPreferences() {
  const prefs = cache.get('credits');
  if (prefs) {
    return Promise.resolve(prefs);
  }
  return exponentialBackoff(async () => {
    const json = await fetchCredits();
    return json;
  }).then(json => {
    cache.set('credits', json);
    return json;
  });
}
