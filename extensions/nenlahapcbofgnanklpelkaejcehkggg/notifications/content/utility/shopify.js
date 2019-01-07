export default function getShopifyDomain(domain) {
  try {
    const URL = document.URL;
    const shopifyMatch = URL.match(/shopify\.com\/\d+/);
    if (shopifyMatch) {
      return shopifyMatch[0];
    }

    if (
      !!document.querySelector('#checkout_reduction_code') &&
      !!document.querySelector('.payment-due__price') &&
      !!document.querySelector('.order-summary__section--discount')
    ) {
      return domain;
    }

    const chronoMatch = URL.match(/chronotrack\.com\/r\/\d+/);
    if (chronoMatch) {
      return chronoMatch[0];
    }

    const analyticsScript = document.querySelector('script.analytics');
    if (analyticsScript) {
      const match = analyticsScript.innerHTML.match(/\:\{\"shopId\"\:(\d+)\}/);
      if (match) {
        // Note: this appears necessary only for sites that will require site-specific stuff
        return `shopify.com/${match[1]}`;
      }
    }
  } catch (e) {}
}
