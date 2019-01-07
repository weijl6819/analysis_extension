import _ from 'lodash';
import delay from './utility/delay';
import parsePrice from './utility/parsePrice';
import write from './utility/write';
import $ from 'jquery';
import {exponential} from 'backoff';
import Promise from 'bluebird';
import currentDomain from 'utility/currentDomain';
import sendMetric from 'utility/sendMetric';

// Script Getters
export function getElement(selector) {
  try {
    const selectors = selector.split(',');
    let el = null;
    _.forEach(selectors, s => {
      const els = $(s);
      if (els.length) {
        el = els[0];
        return false;
      }
    });
    return el;
  } catch (e) {
    return false;
  }
}

export function getPromoCodeEl(script) {
  const selector = _.get(script, 'promoInputSelector');
  return getElement(selector);
}

// Actions
function setValue(el, value) {
  try {
    // for sites using React 15.6 or newer
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    nativeInputValueSetter.call(el, value);
    const inputEvent = new Event('input', {bubbles: true});
    el.dispatchEvent(inputEvent);
  } catch (e) {
    el.value = value;
  }
}

export async function getTotal(script) {
  const t = script.getTotalDelay;
  if (t) {
    await delay(t);
  }
  return getCartTotal(script.cartTotalSelector, Boolean(script.useInnerText));
}

function click(selector) {
  try {
    const el = getElement(selector);
    if (el) {
      el.click();
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

function removeElement(el) {
  return el.parentNode.removeChild(el);
}

function runAction(value) {
  const clicked = click(value);
  if (!clicked) {
    runCode(value);
  }
}

// Methods
async function runCode(scriptContent) {
  const script = document.createElement('script');
  script.textContent = scriptContent;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}

async function writeCode(script, code) {
  const promoEl = getPromoCodeEl(script);
  if (promoEl) {
    setValue(promoEl, '');
    await write(promoEl, code);
  }
}

export async function removePrevious(script, lastCodeHadSavings) {
  const value = script.promoRemoveAction;
  const el = getElement(value);
  if (el || lastCodeHadSavings) {
    /*
    / If the "remove coupon" selector is available on the page,
    / or if we know we found savings on the last coupon,
    / try to remove the previous coupon
    */
    runAction(value);
    const t = script.postRemoveDelay;
    if (t) {
      await delay(t);
    }
    return true;
  }
  return false;
}

async function preApplyAction(script) {
  const value = script.preApplyAction;
  if (value && value.length) {
    runAction(value);
  }
  const t = script.preApplyDelay;
  if (t) {
    await delay(t);
  }
}

async function removeErrors(script) {
  const hideErrorsSelector = script.removeErrorAction;
  if (hideErrorsSelector) {
    const el = getElement(hideErrorsSelector);
    if (el) {
      removeElement(el);
    }
  }
}

// Exports

export async function applyCode(script, code) {
  await removeErrors(script);
  await preApplyAction(script);
  await writeCode(script, code);

  const value = script.promoApplyAction;
  setTimeout(() => {
    runAction(value);
  }, 1);
  return {
    code
  };
}

function getCartTotal(selectors, useInnerText = false) {
  selectors = selectors.split(',');
  const candidateTotals = [];
  _.forEach(selectors, selector => {
    const $els = $(selector);
    _.forEach($els, $el => {
      const total = parsePrice(useInnerText ? $el.innerText : $el.innerHTML);
      candidateTotals.push(total);
    });
  });
  // Pick the most likely price
  let bestCandidate;
  let lowerBound = 500;
  let upperBound = 5000;
  while (!bestCandidate && lowerBound >= 0) {
    bestCandidate = _.find(candidateTotals, c => c >= lowerBound && c < upperBound);
    lowerBound -= 50;
    upperBound += 10000;
  }
  if (!bestCandidate && bestCandidate !== 0) {
    bestCandidate = _.find(candidateTotals, c => parseInt(c));
  }
  return bestCandidate;
}

export function isCouponPage(script) {
  return new Promise((res, rej) => {
    const exponentialBackoff = exponential({
      randomisationFactor: 0,
      initialDelay: 50,
      maxDelay: 3000
    });
    exponentialBackoff.on('ready', (number, delay) => {
      try {
        const cartTotal = getCartTotal(script.cartTotalSelector, Boolean(script.useInnerText));
        const isCouponCustom = !!_.get(script, 'showCouponsSelector')
          ? getElement(script.showCouponsSelector)
          : true;
        if (!!(getPromoCodeEl(script) && cartTotal && isCouponCustom)) {
          res(true);
        } else {
          exponentialBackoff.backoff();
        }
      } catch (e) {
        const domain = currentDomain();
        sendMetric('track', 'isCouponPageError', {
          domain,
          pagePath: location.pathname,
          error: _.get(e, 'message')
        });
      }
    });
    exponentialBackoff.backoff();
  });
}
