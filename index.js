/** @jsx h */


// our render function
const h = (type, props, ...children) => ({
  type,
  props: props || {},
  children,
});

// our "react.createElement" function
const createElement = node => {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  const $el = document.createElement(node.type);
  setProps($el, node.props);
  addEventListeners($el, node.props);
  // create all elements recursively and add them to the current element
  node.children.map(createElement).forEach($el.appendChild.bind($el));
  return $el;
};



/**
 * there's 4 case when "updating" an element:
 * - it's a new element, so we just insert it
 * - it's an old element that we chose to remove
 * - we have an old and new element to compare, to see if it has changed/updated or not
 * - else we update its props, and update its children 
 */
const updateElement = ($parent, newNode, oldNode, index = 0) => {
  if (!oldNode) {
    $parent.appendChild(createElement(newNode));
  } else if (!newNode) {
    $parent.removeChild($parent.childNodes[index]);
  } else if (changed(newNode, oldNode)) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
  } else if (newNode.type) {
    updateProps($parent.childNodes[index], newNode.props, oldNode.props);
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        $parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i,
      );
    }
  }
};

// helper function to check if a node has changed
const changed = (node1, node2) =>
  typeof node1 !== typeof node2 ||
  (typeof node1 === 'string' && node1 !== node2) ||
  node1.type !== node2.type ||
  node.props.forceUpdate;

// a special props case where we want to set a value only if it exists 
const setBooleanProp = ($target, name, value) => {
  if (value) {
    $target.setAttribute(name, value);
    $target[name] = true;
  } else {
    $target[name] = false;
  }
};

// where we can choose to handle specials attributes (v-for, ng-for etc)
// or otherwise set it directly
const setProp = ($target, name, value) => {
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

const setProps = ($target, props) => {
  Object.entries(props).forEach(([name, value]) => {
    setProp($target, name, value);
  });
};

const removeBooleanProp = ($target, name) => {
  $target.removeAttribute(name);
  $target[name] = false;
};

const removeProp = ($target, name, value) => {
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

const updateProp = ($target, name, newVal, oldVal) => {
  if (!newVal) {
    removeProp($target, name, oldVal);
  } else if (!oldVal || newVal !== oldVal) {
    setProp($target, name, newVal);
  }
};

const updateProps = ($target, newProps, oldProps = {}) => {
  const props = {
    ...newProps,
    ...oldProps,
  };
  Object.keys(props).forEach(name => {
    updateProp($target, name, newProps[name], oldProps[name]);
  });
};

// example of a prefixed event (ex: onClick, @click in vue etc)
const isEventProp = name => {
  return /^on/.test(name);
};

const extractEventName = name => {
  return name.slice(2).toLowerCase();
};

const isCustomProp = name => {
  return isEventProp(name) || name === 'forceUpdate';
};

const addEventListeners = ($target, props) => {
  Object.keys(props).forEach(name => {
    if (isEventProp(name)) {
      $target.addEventListener(extractEventName(name), props[name]);
    }
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

const c = (
  <ul style="list-style: none;">
    <li className="item">item 1</li>
    <li className="item">
      <input type="checkbox" checked={true} />
      <input type="text" disabled={false} />
    </li>
  </ul>
);

const d = (
  <ul style="list-style: none;">
    <li className="item item2">item 1</li>
    <li style="background: red;">
      <input type="checkbox" checked={false} />
      <input type="text" disabled={true} />
    </li>
  </ul>
);
// to check which entities are accessed and when, pretty cool ES6 feature
const handler = objectName => ({
  get: (target, name) => {
    console.log(`${objectName}: accessing ${name}`);
    return target[name];
  },
  set: (obj, prop, value) => {
    console.log(`${objectName}: setting field: ${prop} with ${value}`);
    obj[prop] = value;
    return true;
  },
});

// const aProxy = new Proxy(a, handler('a'));
// const bProxy = new Proxy(b, handler('b'));
const cProxy = new Proxy(c, handler('c'));
const dProxy = new Proxy(d, handler('d'));

const $root = document.getElementById('root');
const $reload = document.getElementById('reload');

// updateElement($root, aProxy);
updateElement($root, cProxy);
$reload.addEventListener('click', () => {
  // updateElement($root, bProxy, aProxy);
  updateElement($root, dProxy, cProxy);
});
