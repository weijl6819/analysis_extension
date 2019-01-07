import tldjs from 'tldjs';

export default function getSiteDomainFromUrl(url) {
  const domain = tldjs.getDomain(url);
  const subdomain = tldjs.getSubdomain(url);
  const fullDomain = `${subdomain}.${domain}`;
  return subdomain ? fullDomain : domain;
}
