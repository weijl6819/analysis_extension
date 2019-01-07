import invoke from 'messenger';

export default data => {
  return invoke('deleteAdvice', data);
};
