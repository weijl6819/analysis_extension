import invoke from 'messenger';

export default (data, options) => {
  return invoke('setContentApiImpression', data, options);
};
