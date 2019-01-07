import invoke from 'messenger';

export default msg => {
  return invoke('setZipcode', msg);
};
