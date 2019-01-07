import _ from 'lodash';

const ATTRIBUTE_REACTID = 'data-reactid';
/**
 * @method overrideStopPropagation
 * @see: http://bit.ly/1dPpxHl
 * @return {void}
 */
(function overrideStopPropagation() {
  const overriddenStop = Event.prototype.stopPropagation;
  Event.prototype.stopPropagation = function stopPropagation() {
    this.isPropagationStopped = true;
    overriddenStop.apply(this, arguments);
  };
})();

/**
 * @property components
 * @type {Array}
 */
const components = [];

/**
 * @property eventNames
 * @type {Array|null}
 */
const eventNames = null;

/**
 * Recursively discover a component via its React ID that is set as a data attribute
 * on each React element.
 *
 * @method findById
 * @param id {String}
 * @return {Object}
 */
export function findById(id) {
  let model;

  /**
   * @method find
   * @param {Object} renderedComponent
   * @param {Object} currentComponent
   * @return {void}
   */
  function find(renderedComponent, currentComponent) {
    if (renderedComponent._rootNodeID === id) {
      /**
       * @method bindModel
       * @return {void}
       */
      (function bindModel() {
        model = {
          properties: this._currentElement.props,
          component: currentComponent
        };
      }.bind(renderedComponent)());
      return;
    }
    if (_.get(renderedComponent, '_renderedChildren')) {
      const children = renderedComponent._renderedChildren;
      if (children) {
        Object.keys(children).forEach(index => {
          find(children[index], currentComponent);
        });
      }
    }

    if (renderedComponent._renderedComponent) {
      find(renderedComponent._renderedComponent, currentComponent);
    }
  }
  components.forEach(component => {
    find(component._reactInternalInstance._renderedComponent, component);
  });

  return model;
}

/**
 * @method transformKeys
 * @param {Object} map
 * @param {String} [transformer='toLowerCase']
 * @return {Object}
 */
export function transformKeys(map, transformer = 'toLowerCase') {
  const transformedMap = {};
  Object.keys(map).forEach(key => {
    transformedMap[key[transformer]()] = map[key];
  });
  return transformedMap;
}

/**
 * @method registerComponent
 * @param {Object} component
 * @return {void}
 */
export function registerComponent(component) {
  components.push(component);
}

/**
 * @method setupDelegation
 * @return {void}
 */
export function setupDelegation() {
  /**
   * Determines all of the event types supported by the current browser. Will cache the results
   * of this discovery for performance benefits.
   *
   * @property events
   * @type {Array}
   */
  const events =
    eventNames ||
    (() => {
      const aElement = document.createElement('a');
      const matcher = /^on/i;
      const eventNames = [];
      for (const key in aElement) {
        if (key.match(matcher)) {
          eventNames.push(key.replace(matcher, ''));
        }
      }
      return eventNames;
    })();

  events.forEach(eventType => {
    document.addEventListener(
      eventType,
      event => {
        const eventName = `on${event.type}`;
        const eventList = [];
        _.forEach(event.path, item => {
          if (event.isPropagationStopped) {
            // Method `stopPropagation` was invoked on the current event, which prevents
            // us from propagating any further.
            return;
          }

          if (!item.getAttribute || !item.hasAttribute(ATTRIBUTE_REACTID)) {
            // Current element is not a valid React element because it doesn't have a
            // React ID data attribute.
            return;
          }
          // Attempt to field the component by the associated React ID.
          const model = findById(item.getAttribute(ATTRIBUTE_REACTID));

          if (model && model.properties) {
            // Transform the current React events into lower case keys, so that we can pair them
            // up with the event types.
            const transformed = transformKeys(model.properties);
            if (transformed && transformed[eventName]) {
              // We defer the invocation of the event method, because otherwise React.js
              // will re-render, and the React IDs will then be "out of sync" for this event.
              if (transformed[eventName]) {
                // if (eventName === 'onmouseenter') {
                //   console.log(item, transformed[eventName], (transformed[eventName] && transformed[eventName].bind));
                // }
                eventList.push(transformed[eventName].bind(model.component, event));
              }
            }
            if (eventName === 'oninput' && 'onchange' in transformed) {
              eventList.push(transformed.onchange.bind(model.component, event));
            }
            if (eventName === 'onclick' && 'onchange' in transformed) {
              eventList.push(transformed.onchange.bind(model.component, event));
            }
          }
        });

        // Invoke each found event for the event type.
        eventList.forEach(eventInvocation => eventInvocation());
      },
      true
    );
  });
}
