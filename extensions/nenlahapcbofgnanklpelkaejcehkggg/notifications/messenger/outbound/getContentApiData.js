import invoke from 'messenger';

export default (data, options) => {
  return invoke('getContentApiData', data, options);
};
