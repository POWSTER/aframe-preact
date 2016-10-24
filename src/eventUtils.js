function titleToKebabCase(str) {
  return str.replace(/([^-])([A-Z])/, '$1-$2').toLowerCase();
}

/**
 * Determines event listeners to handle using props that start with `on`.
 * For example, `onClick` would prescribe to register an event handler for
 * `click`. `onIntersectionCleared` would prescribe to register event handler
 * for `intersection-cleared`.
 *
 * @param {object} possibleEventHandlers - Preact props object.
 * @returns {object} Events to register.
 */
export function getEventMappings(possibleEventHandlers) {
  return Object.keys(possibleEventHandlers)
    .filter(preactEventName => (
      !!preactEventName.match(/^on[A-Z]/))
      && possibleEventHandlers[preactEventName].constructor === Function
    ).reduce((handlers, preactEventName) => {
      const aframeEventName = titleToKebabCase(preactEventName.replace(/^on/, ''));
      handlers[aframeEventName] = possibleEventHandlers[preactEventName];
      return handlers;
    }, {});
}
