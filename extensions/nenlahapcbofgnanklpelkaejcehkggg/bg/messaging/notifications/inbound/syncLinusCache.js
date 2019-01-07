import * as linus from 'iv-linus';

export default async input => {
  const {method, key, value} = input;
  return linus.cache[method](key, value);
};
