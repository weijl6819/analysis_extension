import invoke from 'messenger';

export default ({prime}) => {
  return invoke('setPrime', {prime});
};
