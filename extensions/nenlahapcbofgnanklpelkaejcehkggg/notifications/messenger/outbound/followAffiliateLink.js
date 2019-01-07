import invoke from 'messenger';

export default url => {
  return invoke('followAffiliateLink', {url});
};
