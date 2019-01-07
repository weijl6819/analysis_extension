import tld from 'tldjs';

let currentDomain;
export default () => {
  return currentDomain || tld.getDomain(location.href);
};

export function setDomain(domain) {
  currentDomain = domain;
}
