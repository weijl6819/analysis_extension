export function convertPrice(p) {
  if (p) {
    if (p.toLowerCase().indexOf('free') !== -1) {
      return 0;
    }
    const newAndUsedMatches = p.match(/from (\$[^\+]*)/i);
    if (newAndUsedMatches && newAndUsedMatches.length && newAndUsedMatches[1]) {
      return parseInt(newAndUsedMatches[1].replace(/[^0-9]/gi, ''));
    }
    return parseInt(p.replace(/[^0-9]/gi, ''));
  }
}

export default function getPriceFromSelector(selector, oneSelector) {
  let el;
  if (oneSelector) {
    const els = document.querySelectorAll(selector);
    if (els.length !== 1) {
      return 0;
    } else {
      el = els[0];
    }
  } else {
    el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  }
  if (el) {
    return convertPrice(el.innerText);
  }
  return 0;
}
