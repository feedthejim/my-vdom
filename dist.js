'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** @jsx h */

var h = function h(type, props) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    type: type,
    props: props || {},
    children: children
  };
};

var createElement = function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  var $el = document.createElement(node.type);
  setProps($el, node.props);
  node.children.map(createElement).forEach($el.appendChild.bind($el));
  return $el;
};

var updateElement = function updateElement($parent, newNode, oldNode) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  if (!oldNode) {
    $parent.appendChild(createElement(newNode));
  } else if (!newNode) {
    $parent.removeChild($parent.childNodes[index]);
  } else if (changed(newNode, oldNode)) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
  } else if (newNode.type) {
    updateProps($parent.childNodes[index], newNode.props, oldNode.props);
    var newLength = newNode.children.length;
    var oldLength = oldNode.children.length;
    for (var i = 0; i < newLength || i < oldLength; i++) {
      updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
    }
  }
};

var changed = function changed(node1, node2) {
  return (typeof node1 === 'undefined' ? 'undefined' : _typeof(node1)) !== (typeof node2 === 'undefined' ? 'undefined' : _typeof(node2)) || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type;
};

var isCustomProp = function isCustomProp(name) {
  return false;
};

var setBooleanProp = function setBooleanProp($target, name, value) {
  if (value) {
    $target.setAttribute(name, value);
    $target[name] = true;
  } else {
    $target[name] = false;
  }
};

var setProp = function setProp($target, name, value) {
  if (isCustomProp(name)) {
    return;
  } else if (name === 'className') {
    $target.setAttribute('class', value);
  } else if (typeof value === 'boolean') {
    setBooleanProp($target, name, value);
  } else {
    $target.setAttribute(name, value);
  }
};

var setProps = function setProps($target, props) {
  Object.entries(props).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        value = _ref2[1];

    setProp($target, name, value);
  });
};

var removeBooleanProp = function removeBooleanProp($target, name) {
  $target.removeAttribute(name);
  $target[name] = false;
};
var removeProp = function removeProp($target, name, value) {
  if (isCustomProp(name)) {
    return;
  } else if (name === 'className') {
    $target.removeAttribute('class');
  } else if (typeof value === 'boolean') {
    removeBooleanProp($target, name);
  } else {
    $target.removeAttribute(name);
  }
};

var updateProp = function updateProp($target, name, newVal, oldVal) {
  if (!newVal) {
    removeProp($target, name, oldVal);
  } else if (!oldVal || newVal !== oldVal) {
    setProp($target, name, newVal);
  }
};

var updateProps = function updateProps($target, newProps) {
  var oldProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var props = _extends({}, newProps, oldProps);
  Object.keys(props).forEach(function (name) {
    updateProp($target, name, newProps[name], oldProps[name]);
  });
};

// const a = (
//   <ul className="list">
//     <li>toto</li>
//     <li>tata</li>
//   </ul>
// );

// const b = (
//   <ul>
//     <li>item 1</li>
//     <li>hello!</li>
//   </ul>
// );

var c = h(
  'ul',
  { style: 'list-style: none;' },
  h(
    'li',
    { className: 'item' },
    'item 1'
  ),
  h(
    'li',
    { className: 'item' },
    h('input', { type: 'checkbox', checked: true }),
    h('input', { type: 'text', disabled: false })
  )
);

var d = h(
  'ul',
  { style: 'list-style: none;' },
  h(
    'li',
    { className: 'item item2' },
    'item 1'
  ),
  h(
    'li',
    { style: 'background: red;' },
    h('input', { type: 'checkbox', checked: false }),
    h('input', { type: 'text', disabled: true })
  )
);
// to check which entities are accessed and when, pretty cool ES6 feature
var handler = function handler(objectName) {
  return {
    get: function get(target, name) {
      console.log(objectName + ': accessing ' + name);
      return target[name];
    },
    set: function set(obj, prop, value) {
      console.log(objectName + ': setting field: ' + prop + ' with ' + value);
      obj[prop] = value;
      return true;
    }
  };
};

// const aProxy = new Proxy(a, handler('a'));
// const bProxy = new Proxy(b, handler('b'));
var cProxy = new Proxy(c, handler('c'));
var dProxy = new Proxy(d, handler('d'));

var $root = document.getElementById('root');
var $reload = document.getElementById('reload');

// updateElement($root, aProxy);
updateElement($root, cProxy);
$reload.addEventListener('click', function () {
  // updateElement($root, bProxy, aProxy);
  updateElement($root, dProxy, cProxy);
});
