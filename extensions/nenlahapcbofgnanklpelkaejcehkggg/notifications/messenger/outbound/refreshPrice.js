import invoke from 'messenger';

export default msg => {
  return invoke('refreshPrice', msg);
};
