import LRU from 'lru-cache';

const cache = LRU({
  max: 15,
  maxAge: 1000 * 60 * 60 * 1 // 1 hour
});

export default cache;
