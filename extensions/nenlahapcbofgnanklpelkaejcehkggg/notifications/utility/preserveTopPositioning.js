import _ from 'lodash';
import hasFeature from 'utility/hasFeature';

const demotedEls = new WeakSet();
const ourEls = new WeakSet();

const initStylesheet = _.once(parent => {
  const el = document.createElement('style');
  el.type = 'text/css';
  el.appendChild(document.createTextNode(''));
  parent.appendChild(el);
  return el;
});

const buildSelector = el => {
  let selector = el.tagName;
  if (el.id) {
    selector += /[#\s\n]/.test(el.id) ? '[id]' : `#${el.id}`;
  }
  _.forEach(el.classList, c => {
    selector += `.${c}`;
  });

  _.forEach(el.getAttributeNames(), attr => {
    selector += `[${attr}]`;
  });

  return selector;
};

const demoteEl = (el, depth = 0) => {
  let insertPoint = document.head;
  if (el && el.shadowRoot) {
    el = el.shadowRoot.querySelector('div');
    insertPoint = el;
    if (!el) {
      return;
    }
  }
  const style = window.getComputedStyle(el);
  const zIndex = parseInt(style.zIndex);
  if (zIndex && zIndex >= 2147483647) {
    const styleEl = initStylesheet(insertPoint);
    styleEl.sheet.insertRule(
      `${buildSelector(el)} { z-index: 2147483646 !important; }`,
      styleEl.sheet.rules.length
    );
  } else if (depth < 10) {
    _.forEach(el.children, childEl => {
      demoteEl(childEl, depth + 1);
    });
  }
  demotedEls.add(el);
};

const check = preservedEl => {
  let el = document.documentElement.lastElementChild;
  while (el && el !== document.body && el !== document.head && el !== preservedEl) {
    if (!demotedEls.has(el) && !ourEls.has(el)) {
      demoteEl(el);
    }

    el = el.previousElementSibling;
  }
};

// This function attempts to make sure that no other element on the page is shown on top of the specified element
export default preservedEl => {
  if (hasFeature('n_pt_1')) {
    ourEls.add(preservedEl);
    document.documentElement.appendChild(preservedEl);
    setTimeout(() => {
      check(preservedEl);
      const observer = new MutationObserver(mutations => {
        check(preservedEl);
      });
      observer.observe(document.documentElement, {childList: true});
    }, 500);
  } else {
    document.body.appendChild(preservedEl);
  }
};
