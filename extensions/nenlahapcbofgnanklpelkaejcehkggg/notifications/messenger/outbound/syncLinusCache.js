import invoke from 'messenger';

export default (method, key, value) => {
  return invoke('syncLinusCache', {
    method,
    key,
    value
  });
};
