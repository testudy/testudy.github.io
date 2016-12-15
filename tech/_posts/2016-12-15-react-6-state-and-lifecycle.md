---
layout: post
title: React 6 - 状态和生命周期（State and Lifecycle）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/state-and-lifecycle.html)

Consider the ticking clock example from [one of the previous sections](/tech/2016/12/14/react-4-rendering-elements.html#updating-the-rendered-element).

回顾一下[前一节中](/tech/2016/12/14/react-4-rendering-elements.html#updating-the-rendered-element)时钟的例子。

So far we have only learned one way to update the UI.

目前为止我们只学习了上面一种更新UI的方式。

We call `ReactDOM.render()` to change the rendered output:

通过不断调用`ReactDOM.render()`方法来更新视图：

```js
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)

In this section, we will learn how to make the `Clock` component truly reusable and encapsulated. It will set up its own timer and update itself every second.

这一节中，将介绍如何封装一个可重用的`Clock`组件。在组件内部设置计时器按秒更新。

We can start by encapsulating how the clock looks:

第一步封装的clock组件如下所示：

```js
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/dpdoYR?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/dpdoYR?editors=0010)

However, it misses a crucial requirement: the fact that the `Clock` sets up a timer and updates the UI every second should be an implementation detail of the `Clock`.

但上述代码忽略了一个关键细节：`Clock`组件应该在其内部设置定时器按秒更新视图。

Ideally we want to write this once and have the `Clock` update itself:

理想情况下，`Clock`组件应该简单的写一次并实现自我更新：

```js
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

To implement this, we need to add "state" to the `Clock` component.

为了实现这个目标，需要在`Clock`组件中引入“state”的概念。

State is similar to props, but it is private and fully controlled by the component.

状态和属性类似，区别在于状态是组件私有的，并且完全由组件控制。

We [mentioned before](/tech/2016/12/14/react-5-components-and-props.html#functional-and-class-components) that components defined as classes have some additional features. Local state is exactly that: a feature available only to classes.

[之前](/tech/2016/12/14/react-5-components-and-props.html#functional-and-class-components)提到过类形式定义的组件有一些附加特性。本节讲解的本地状态就是一个只有类形式定义的组件可以使用的特性。

## 将函数形式组件转换为类形式组件（Converting a Function to a Class）

You can convert a functional component like `Clock` to a class in five steps:

1. Create an [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) with the same name that extends `React.Component`.

2. Add a single empty method to it called `render()`.

3. Move the body of the function into the `render()` method.

4. Replace `props` with `this.props` in the `render()` body.

5. Delete the remaining empty function declaration.

以`Clock`组件为例，将其从函数形式转换为类形式组件需要经过如下5步：

1. 继承`React.Component`创建一个同名[ES6类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)；

2. 在类中添加一个名为`render()`的空方法；

3. 把函数形式组件中的代码剪贴到`render()`方法中；

4. 把`render()`方法中的`props`替换为`this.props`；

5. 删除剩下的空函数。

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/zKRGpo?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` is now defined as a class rather than a function.

此时`Clock`组件已经从函数形式转换为类形式。

This lets us use additional features such as local state and lifecycle hooks.

接下来将本地状态和生命周期方法等特性添加到组件中。

## 在组件中添加本地状态（Adding Local State to a Class）

We will move the `date` from props to state in three steps:

1) Replace `this.props.date` with `this.state.date` in the `render()` method:

下面分3步，将`date`从属性转移到状态中：

1）在`render()`方法中用`this.state.date`替换`this.props.date`：

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) Add a [class constructor](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor) that assigns the initial `this.state`:

2）添加一个[构造函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes#构造器)，完成`this.state`的初始化：

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Note how we pass `props` to the base constructor:

注意在构造函数中调用父类的构造函数，传入`props`参数：

```js
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

Class components should always call the base constructor with `props`.

类形式的组件必须在构造函数中调用父类的构造函数（传入`props`参数）。

3) Remove the `date` prop from the `<Clock />` element:

3）从`<Clock />`元素中删除`date`属性：

```js
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

We will later add the timer code back to the component itself.

接下来会在组件中添加定时器相关的代码。

The result looks like this:

目前的代码看起来如下所示：

```js
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/KgQpJd?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/KgQpJd?editors=0010)

Next, we'll make the `Clock` set up its own timer and update itself every second.

下一步，会在`Clock`组件中实现自己的定时器并按秒更新自身。

## 在组件中添加生命周期方法（Adding Lifecycle Methods to a Class）

In applications with many components, it's very important to free up resources taken by the components when they are destroyed.

在包含很多组件的应用中，销毁组件时进行内存等资源占用的释放是非常重要的。

We want to [set up a timer](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) whenever the `Clock` is rendered to the DOM for the first time. This is called "mounting" in React.

当`Clock`组件第一次渲染到DOM时需要[设置定时器](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setInterval)。这个过程在React中被称为“加载”。

We also want to [clear that timer](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) whenever the DOM produced by the `Clock` is removed. This is called "unmounting" in React.

当`Clock`组件对应的DOM被删除时需要[清除定时器](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/clearInterval)。这个过程在React中被称为“卸载”。

We can declare special methods on the component class to run some code when a component mounts and unmounts:

在组件类中可以定义一些其他方法，以供组件加载和卸载时调用：

```js
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

These methods are called "lifecycle hooks".

这些方法都属于“生命周期方法”。

The `componentDidMount()` hook runs after the component output has been rendered to the DOM. This is a good place to set up a timer:

组件渲染到DOM之后会调用`componentDidMount()`方法。这个时机适合设置定时器：

```js
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

Note how we save the timer ID right on `this`.

注意timerId是如何保存到`this`。

While `this.props` is set up by React itself and `this.state` has a special meaning, you are free to add additional fields to the class manually if you need to store something that is not used for the visual output.

`this.props`是由React本身设置的，`this.state`被指定于特殊意义，对于跟视图渲染不相关的字段，可以在组件类中自由定义。

If you don't use something in `render()`, it shouldn't be in the state.

如果字段不在`render()`方法中适用，则该字段严禁出现在state中。

We will tear down the timer in the `componentWillUnmount()` lifecycle hook:

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Finally, we will implement the `tick()` method that runs every second.

It will use `this.setState()` to schedule updates to the component local state:

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/amqdNA?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/amqdNA?editors=0010)

Now the clock ticks every second.

Let's quickly recap what's going on and the order in which the methods are called:

1) When `<Clock />` is passed to `ReactDOM.render()`, React calls the constructor of the `Clock` component. Since `Clock` needs to display the current time, it initializes `this.state` with an object including the current time. We will later update this state.

2) React then calls the `Clock` component's `render()` method. This is how React learns what should be displayed on the screen. React then updates the DOM to match the `Clock`'s render output.

3) When the `Clock` output is inserted in the DOM, React calls the `componentDidMount()` lifecycle hook. Inside it, the `Clock` component asks the browser to set up a timer to call `tick()` once a second.

4) Every second the browser calls the `tick()` method. Inside it, the `Clock` component schedules a UI update by calling `setState()` with an object containing the current time. Thanks to the `setState()` call, React knows the state has changed, and calls `render()` method again to learn what should be on the screen. This time, `this.state.date` in the `render()` method will be different, and so the render output will include the updated time. React updates the DOM accordingly.

5) If the `Clock` component is ever removed from the DOM, React calls the `componentWillUnmount()` lifecycle hook so the timer is stopped.

## Using State Correctly

There are three things you should know about `setState()`.

### Do Not Modify State Directly

For example, this will not re-render a component:

```js
// Wrong
this.state.comment = 'Hello';
```

Instead, use `setState()`:

```js
// Correct
this.setState({comment: 'Hello'});
```

The only place where you can assign `this.state` is the constructor.

### State Updates May Be Asynchronous

React may batch multiple `setState()` calls into a single update for performance.

Because `this.props` and `this.state` may be updated asynchronously, you should not rely on their values for calculating the next state.

For example, this code may fail to update the counter:

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

To fix it, use a second form of `setState()` that accepts a function rather than an object. That function will receive the previous state as the first argument, and the props at the time the update is applied as the second argument:

```js
// Correct
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));
```

We used an [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) above, but it also works with regular functions:

```js
// Correct
this.setState(function(prevState, props) {
  return {
    counter: prevState.counter + props.increment
  };
});
```

### State Updates are Merged

When you call `setState()`, React merges the object you provide into the current state.

For example, your state may contain several independent variables:

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

Then you can update them independently with separate `setState()` calls:

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

The merging is shallow, so `this.setState({comments})` leaves `this.state.posts` intact, but completely replaces `this.state.comments`.

## The Data Flows Down

Neither parent nor child components can know if a certain component is stateful or stateless, and they shouldn't care whether it is defined as a function or a class.

This is why state is often called local or encapsulated. It is not accessible to any component other than the one that owns and sets it.

A component may choose to pass its state down as props to its child components:

```js
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
```

This also works for user-defined components:

```js
<FormattedDate date={this.state.date} />
```

The `FormattedDate` component would receive the `date` in its props and wouldn't know whether it came from the `Clock`'s state, the props, or was typed by hand:

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/zKRqNB?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/zKRqNB?editors=0010)

This is commonly called a "top-down" or "unidirectional" data flow. Any state is always owned by some specific component, and any data or UI derived from that state can only affect components "below" them in the tree.

If you imagine a component tree as a waterfall of props, each component's state is like an additional water source that joins it at an arbitrary point but also flows down.

To show that all components are truly isolated, we can create an `App` component that renders three `<Clock>`s:

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/vXdGmd?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/vXdGmd?editors=0010)

Each `Clock` sets up its own timer and updates independently.

In React apps, whether a component is stateful or stateless is considered an implementation detail of the component that may change over time. You can use stateless components inside stateful components, and vice versa.
