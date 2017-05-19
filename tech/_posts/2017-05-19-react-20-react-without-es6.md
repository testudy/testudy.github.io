---
layout: post
title: React 20 - 不使用ES6（React Without ES6）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/react-without-es6.html)

Normally you would define a React component as a plain JavaScript class:

通常情况下，定义一个React组件和定义一个普通JavaScript类相似：

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

If you don't use ES6 yet, you may use the `create-react-class` module instead:

如果不适用ES6语法，也可以使用`create-react-class`模块替代：

```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

The API of ES6 classes is similar to `createReactClass()` with a few exceptions.

除个别情况外，`createReactClass()`的API和ES6的类形式基本一致。

## 声明默认属性（Declaring Default Props）

With functions and ES6 classes `defaultProps` is defined as a property on the component itself:

在函数形式和ES6类形式中，`defaultProps`直接定义在组件上：

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};
```

With `createReactClass()`, you need to define `getDefaultProps()` as a function on the passed object:

在`createReactClass()`中，需要在传入的配置对象中定义`getDefaultProps()`方法：

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```

## 设置初始状态（Setting the Initial State）

In ES6 classes, you can define the initial state by assigning `this.state` in the constructor:

在ES6类形式中，直接在构造函数中为`this.state`属性赋值初始状态即可：

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

With `createReactClass()`, you have to provide a separate `getInitialState` method that returns the initial state:

在`createReactClass()`中，必须提供一个单独的`getInitialState`方法来返回初始状态：

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## 自动绑定（Autobinding）

In React components declared as ES6 classes, methods follow the same semantics as regular ES6 classes. This means that they don't automatically bind `this` to the instance. You'll have to explicitly use `.bind(this)` in the constructor:

在ES6类形式的React组件中，方法的语义和正规的ES6类方法相同。这意味着不会不会自动将`this`绑定到实例方法上。必须在构造函数中显式的使用`.bind(this)`方法：

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // This line is important!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // Because `this.handleClick` is bound, we can use it as an event handler.
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

With `createReactClass()`, this is not necessary because it binds all methods:

在`createReactClass()`中，会自动绑定所有方法：

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
});
```

This means writing ES6 classes comes with a little more boilerplate code for event handlers, but the upside is slightly better performance in large applications.

有可能会感觉ES6类形式的事件处理器中会存在些许的模板代码，但在大型应用中这会带来更好的性能。

If the boilerplate code is too unattractive to you, you may enable the **experimental** [Class Properties](https://babeljs.io/docs/plugins/transform-class-properties/) syntax proposal with Babel:

如果不能接受这样的模板代码，可以借住Babel启用[类属性](https://babeljs.io/docs/plugins/transform-class-properties/)**试验**语法：


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
  }
  // WARNING: this syntax is experimental!
  // Using an arrow here binds the method:
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

Please note that the syntax above is **experimental** and the syntax may change, or the proposal might not make it into the language.

请注意上面的语法是**试验**阶段，未来可能会发生更改，也可能会从规范中剔除。

If you'd rather play it safe, you have a few options:

* Bind methods in the constructor.
* Use arrow functions, e.g. `onClick={(e) => this.handleClick(e)}`.
* Keep using `createReactClass`.

如果期待更安全，可以使用下面的方式：

* 在构造函数中显式绑定。
* 使用剪头函数，比如`onClick={(e) => this.handleClick(e)}`。
* 继续使用`createReactClass`。

## 混合（Mixins）

> **提醒（Note）：**
>
>ES6 launched without any mixin support. Therefore, there is no support for mixins when you use React with ES6 classes.
>
> ES6不提供Mixin的支持。就是说，当时用ES6类形式的时候不能使用任何Mixin。
>
>**We also found numerous issues in codebases using mixins, [and don't recommend using them in the new code](https://facebook.github.io/react/blog/2016/07/13/mixins-considered-harmful.html).**
>
> **我们发现在代码中使用Mixin会带来许多问题，[所以不建议在新代码中继续使用](https://facebook.github.io/react/blog/2016/07/13/mixins-considered-harmful.html)。**
>
>This section exists only for the reference.
>
> 写这一小节只是为了供参考而已。

Sometimes very different components may share some common functionality. These are sometimes called [cross-cutting concerns](https://en.wikipedia.org/wiki/Cross-cutting_concern). [`createReactClass`](https://facebook.github.io/react/docs/top-level-api.html#react.createclass) lets you use a legacy `mixins` system for that.

有时候，完全不同的组件之间会存在一些通用功能，这种情况被称作[横切关注点](https://zh.wikipedia.org/wiki/横切关注点)。[`createReactClass`](https://facebook.github.io/react/docs/top-level-api.html#react.createclass)提供了`mixins`功能来解决这个问题。

One common use case is a component wanting to update itself on a time interval. It's easy to use `setInterval()`, but it's important to cancel your interval when you don't need it anymore to save memory. React provides [lifecycle methods](https://facebook.github.io/react/docs/working-with-the-browser.html#component-lifecycle) that let you know when a component is about to be created or destroyed. Let's create a simple mixin that uses these methods to provide an easy `setInterval()` function that will automatically get cleaned up when your component is destroyed.

一个常见的情况是，比如组件中需要定时更新。可以简单通过`setInterval()`方法来实现，但重要的是在不需要使用它的时候将其销毁以释放内存。React提供了[生命周期方法](https://facebook.github.io/react/docs/working-with-the-browser.html#component-lifecycle)以监听组件的创建和销毁。下面使用mixin来实现组件销毁时自动将`setInterval()`方法销毁。

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // Use the mixin
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // Call a method on the mixin
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React has been running for {this.state.seconds} seconds.
      </p>
    );
  }
});

ReactDOM.render(
  <TickTock />,
  document.getElementById('example')
);
```

If a component is using multiple mixins and several mixins define the same lifecycle method (i.e. several mixins want to do some cleanup when the component is destroyed), all of the lifecycle methods are guaranteed to be called. Methods defined on mixins run in the order mixins were listed, followed by a method call on the component.

如果在一个组件中使用了多个Mixin并且有些Mixin定义了相同的生命周期方法（比如，几个Mixin都需要在组件销毁的时候做清理工作），所有的生命周期方法都会保证被调用到，组件会按照Mixin在组件中的定义顺序依次调用。
