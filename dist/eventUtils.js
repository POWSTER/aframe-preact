'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventMappings = getEventMappings;
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
function getEventMappings(possibleEventHandlers) {
  return Object.keys(possibleEventHandlers).filter(function (preactEventName) {
    return !!preactEventName.match(/^on[A-Z]/) && possibleEventHandlers[preactEventName].constructor === Function;
  }).reduce(function (handlers, preactEventName) {
    var aframeEventName = titleToKebabCase(preactEventName.replace(/^on/, ''));
    handlers[aframeEventName] = possibleEventHandlers[preactEventName];
    return handlers;
  }, {});
}