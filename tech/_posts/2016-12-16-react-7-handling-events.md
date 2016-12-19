---
layout: post
title: React 7 - 事件处理（Handling Events）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/handling-events.html)

Handling events with React elements is very similar to handling events on DOM elements. There are some syntactic differences:

* React events are named using camelCase, rather than lowercase.
* With JSX you pass a function as the event handler, rather than a string.

React元素中的事件处理和DOM元素中的事件处理非常相似，但存在两处写法上的区别：

* React事件命名使用的是驼峰命名法，跟DOM中的全小写命名不一致；
* 在JSX中将一个函数作为事件处理器，在DOM中被当做字符串。

For example, the HTML:

如下例是HTML中的DOM事件处理：

```html
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

is slightly different in React:

跟React中存在些许差异：

```js
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

Another difference is that you cannot return `false` to prevent default behavior in React. You must call `preventDefault` explicitly. For example, with plain HTML, to prevent the default link behavior of opening a new page, you can write:

还有一个不同点是在React事件处理中不能通过返回`false`值来阻止默认行为，必须明确的调用`preventDefault`方法。如下例，在HTML中，可以直接阻止点击超链接打开新页面的默认行为。

```html
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
```

In React, this could instead be:

在React中，需要用下面的写法替代：

```js
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

Here, `e` is a synthetic event. React defines these synthetic events according to the [W3C spec](https://www.w3.org/TR/DOM-Level-3-Events/), so you don't need to worry about cross-browser compatibility. See the [`SyntheticEvent`](/react/docs/events.html) reference guide to learn more.

此处的`e`是一个合成事件对象，React中合成事件的定义遵循[W3C规范](https://www.w3.org/TR/DOM-Level-3-Events/)，不存在跨浏览器兼容性问题。查看[`SyntheticEvent`](/react/docs/events.html)文档了解详细信息。

When using React you should generally not need to call `addEventListener` to add listeners to a DOM element after it is created. Instead, just provide a listener when the element is initially rendered.

在React中通常不需要调用`addEventListener`对创建后的DOM元素绑定事件监听。如果需要事件监听，只需要在JSX代码中写上事件处理即可。

When you define a component using an [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes), a common pattern is for an event handler to be a method on the class. For example, this `Toggle` component renders a button that lets the user toggle between "ON" and "OFF" states:

在[ES6类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)形式定义的组件中，通常将事件处理器封装为类的一个方法。如下例中：`Toggle`组件中对按钮添加事件处理以在“ON”和“OFF”两个状态之间切换：

```js
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/xEmzGg?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/xEmzGg?editors=0010)

You have to be careful about the meaning of `this` in JSX callbacks. In JavaScript, class methods are not [bound](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind) by default. If you forget to bind `this.handleClick` and pass it to `onClick`, `this` will be `undefined` when the function is actually called.

千万注意`this`在JSX回调函数中所指向的对象。JavaScript中的类方法默认不[绑定](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)当前对象。当`onClick`的属性值`this.handleClick`没有进行绑定操作时，调用该方法时`this`的值是`undefined`。

This is not React-specific behavior; it is a part of [how functions work in JavaScript](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/). Generally, if you refer to a method without `()` after it, such as `onClick={this.handleClick}`, you should bind that method.

这是[JavaScript中函数的运行原理](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/)，而不是React特性行为。通常情况下在React中，在将方法作为事件处理器（是此方法，而不是此方法的返回值）时需要将这个方法绑定到当前对象上。

If calling `bind` annoys you, there are two ways you can get around this. If you are using the experimental [property initializer syntax](https://babeljs.io/docs/plugins/transform-class-properties/), you can use property initializers to correctly bind callbacks:

如果不喜欢`bind`方法，还有其他的两种写法。如果你正在使用未规范化的[属性初始化语法](https://babeljs.io/docs/plugins/transform-class-properties/)，可以用这个语法在回调函数中正确的绑定this对象：

```js
class LoggingButton extends React.Component {
  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

This syntax is enabled by default in [Create React App](https://github.com/facebookincubator/create-react-app).

这种写法是[Create React App](https://github.com/facebookincubator/create-react-app)中的推荐用法。

If you aren't using property initializer syntax, you can use an [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) in the callback:

属性初始化语法之外，也可以使用[箭头函数](https://github.com/facebookincubator/create-react-app)在回调中完成这个工作：

```js
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // This syntax ensures `this` is bound within handleClick
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}
```

The problem with this syntax is that a different callback is created each time the `LoggingButton` renders. In most cases, this is fine. However, if this callback is passed as a prop to lower components, those components might do an extra re-rendering. We generally recommend binding in the constructor to avoid this sort of performance problem.

这种方式的副作用是`LoggingButton`在每次渲染时都会生成新的回调函数，大多数情况下，这不是什么大问题。但是当这个回调是作为属性传递给底层的子组件的时候，可能会造成额外的重绘。通常建议在构造函数中完成绑定以避免这类性能问题。
