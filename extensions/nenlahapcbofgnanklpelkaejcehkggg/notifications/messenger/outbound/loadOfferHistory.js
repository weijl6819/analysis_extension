import invoke from 'messenger';

export default msg => {
  return invoke('loadOfferHistory', msg);
};
