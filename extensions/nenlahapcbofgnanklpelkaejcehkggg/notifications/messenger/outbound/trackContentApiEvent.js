import invoke from 'messenger';

export default (data, options) => {
  return invoke('trackContentApiEvent', data, options);
};
