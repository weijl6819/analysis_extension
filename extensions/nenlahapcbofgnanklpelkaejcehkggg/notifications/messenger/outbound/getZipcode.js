import invoke from 'messenger';

export default ({zipcode}) => {
  return invoke('getZipcode', {zipcode});
};
