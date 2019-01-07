import Promise from 'bluebird';

function simulateCustomEvent(type, el, options) {
  return new Promise(resolve => {
    var event = new Event(type, options);
    el.dispatchEvent(event);
    resolve();
  });
}

function simulateKeyboardEvent(type, el, key) {
  return new Promise(resolve => {
    try {
      var charCode = key.charCodeAt(0);
      var event = document.createEvent('KeyboardEvent');
      Object.defineProperty(event, 'keyCode', {
        get: function() {
          return this.charCodeVal;
        }
      });
      Object.defineProperty(event, 'which', {
        get: function() {
          return this.charCodeVal;
        }
      });

      if (event.initKeyboardEvent) {
        event.initKeyboardEvent(
          type,
          true,
          true,
          document.defaultView,
          false,
          false,
          false,
          false,
          charCode,
          charCode
        );
      } else {
        event.initKeyEvent(
          type,
          true,
          true,
          document.defaultView,
          false,
          false,
          false,
          false,
          charCode,
          0
        );
      }
      event.charCodeVal = charCode;
      el.dispatchEvent(event);
      if (type === 'keypress') {
        el.value = el.value + key;
      }
    } catch (e) {}
    resolve();
  });
}

function sendKey(key, el) {
  return new Promise(resolve => {
    setTimeout(() => {
      simulateKeyboardEvent('keydown', el, key)
        .then(() => simulateKeyboardEvent('keypress', el, key))
        .then(() => simulateCustomEvent('input', el, {bubbles: true}))
        .then(() => simulateCustomEvent('change', el))
        .then(() => simulateKeyboardEvent('keyup', el, key))
        .then(() => resolve());
    }, 10);
  });
}

export default async function writeToEl(el, text) {
  await simulateCustomEvent('focus', el);
  for (let i = 0; i < text.length; ++i) {
    await sendKey(text[i], el);
  }
  await simulateCustomEvent('blur', el);
}
