'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scene = exports.Entity = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.serializeComponents = serializeComponents;

var _preact = require('preact');

var _styleAttr = require('style-attr');

var _styleAttr2 = _interopRequireDefault(_styleAttr);

var _eventUtils = require('./eventUtils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * <a-entity>
 */
var Entity = exports.Entity = function (_Component) {
  _inherits(Entity, _Component);

  function Entity() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Entity);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Entity.__proto__ || Object.getPrototypeOf(Entity)).call.apply(_ref, [this].concat(args))), _this), _this.attachEvents = function (el) {
      if (!el) {
        return;
      }
      attachEventsToElement(el, Object.assign({}, _this.props.events, (0, _eventUtils.getEventMappings)(_this.props)));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Entity, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      // Allow through normal attributes..
      var otherProps = {};
      ['id', 'mixin'].forEach(function (propName) {
        if (_this2.props[propName]) {
          otherProps[propName] = _this2.props[propName];
        }
      });

      return (0, _preact.h)(this.props.primitive || 'a-entity', Object.assign({ ref: this.attachEvents }, otherProps, serializeComponents(this.props)), this.props.children);
    }
  }]);

  return Entity;
}(_preact.Component);

/**
 * <a-scene>
 */


var Scene = exports.Scene = function (_Component2) {
  _inherits(Scene, _Component2);

  function Scene() {
    var _ref2;

    var _temp2, _this3, _ret2;

    _classCallCheck(this, Scene);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this3 = _possibleConstructorReturn(this, (_ref2 = Scene.__proto__ || Object.getPrototypeOf(Scene)).call.apply(_ref2, [this].concat(args))), _this3), _this3.attachEvents = function (el) {
      if (!el) {
        return;
      }
      attachEventsToElement(el, Object.assign({}, _this3.props.events, (0, _eventUtils.getEventMappings)(_this3.props)));
    }, _temp2), _possibleConstructorReturn(_this3, _ret2);
  }

  _createClass(Scene, [{
    key: 'render',
    value: function render() {
      var _this4 = this;

      // Allow through normal attributes..
      var otherProps = {};
      ['id', 'mixin'].forEach(function (propName) {
        if (_this4.props[propName]) {
          otherProps[propName] = _this4.props[propName];
        }
      });

      return React.createElement(
        'a-scene',
        _extends({
          ref: this.attachEvents
        }, otherProps, serializeComponents(this.props)),
        this.props.children
      );
    }
  }]);

  return Scene;
}(_preact.Component);

/**
 * Serialize Preact props to A-Frame components.
 *
 * {primitive: box; width: 10} to 'primitive: box; width: 10'
 */


function serializeComponents(props) {
  var components = AFRAME.components;

  var serialProps = {};
  Object.keys(props).forEach(function (component) {
    // Allow these.
    if (['class', 'children', 'id', 'mixin'].indexOf(component) !== -1) {
      return;
    }

    // className to class.
    if (component === 'className') {
      serialProps.class = props[component];
      serialProps.className = props[component];
      return;
    }

    if (props[component].constructor === Function) {
      return;
    }

    var ind = Object.keys(components).indexOf(component.split('__')[0]);
    // Discards props that aren't components.
    if (ind === -1) {
      return;
    }

    if (props[component].constructor === Array) {
      // Stringify components passed as array.
      serialProps[component] = props[component].join(' ');
    } else if (props[component].constructor === Object) {
      // Stringify components passed as object.
      serialProps[component] = _styleAttr2.default.stringify(props[component]);
    } else if (props[component].constructor === Boolean) {
      if (components[component].schema.type === 'boolean') {
        // If the component takes one property and it is Boolean
        // just passes in the prop.
        serialProps[component] = props[component];
      } else if (props[component] === true) {
        // Otherwise if it is true, assumes component is blank.
        serialProps[component] = "";
      } else {
        // Otherwise if false lets aframe coerce.
        serialProps[component] = props[component];
      }
    } else {
      // Do nothing for components otherwise.
      serialProps[component] = props[component];
    }
  });
  return serialProps;
};

/**
 * Register event handlers to ref.
 */
function attachEventsToElement(el, eventMap) {
  if (!eventMap) {
    return;
  }
  Object.keys(eventMap).forEach(function (eventName) {
    el.addEventListener(eventName, function (event) {
      eventMap[eventName](event);
    });
  });
}