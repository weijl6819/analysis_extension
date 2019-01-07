import tree from 'state';
import _ from 'lodash';

export default function cleanRunCache() {
  const cache = tree.select(['runCache']);
  if (cache) {
    _.forOwn(cache.get(), (data, key) => {
      if (data.expires < Date.now()) {
        cache.unset(key);
      }
    });
  }
}
