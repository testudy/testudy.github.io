---
layout: post
title: React 27 - React.Component API参考
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/react-component.html)


[Components](https://facebook.github.io/react/docs/components-and-props.html) let you split the UI into independent, reusable pieces, and think about each piece in isolation. `React.Component` is provided by [`React`](https://facebook.github.io/react/docs/react-api.html).

使用[组件](https://facebook.github.io/react/docs/components-and-props.html)可以将UI拆分为独立，重用，隔离的个体。`React.Component`由[`React`]对象(https://facebook.github.io/react/docs/react-api.html)提供。

## 概述（Overview）

`React.Component` is an abstract base class, so it rarely makes sense to refer to `React.Component` directly. Instead, you will typically subclass it, and define at least a [`render()`](#render) method.

`React.Component`是一个抽象基类，直接使用`React.Component`没有意义，而是需要实现其子类，并且至少要定义一个[`render()`](#render)方法。

Normally you would define a React component as a plain [JavaScript class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes):

常见情况是用[JavaScript类](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes)定义一个React组件：

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

If you don't use ES6 yet, you may use the [`create-react-class`](https://facebook.github.io/react/docs/react-api.html#createclass) module instead. Take a look at [Using React without ES6](https://facebook.github.io/react/docs/react-without-es6.html) to learn more.

如果还没有使用ES6，可以使用[`create-react-class`](https://facebook.github.io/react/docs/react-api.html#createclass)模块代替。更多信息可参考[不使用ES6](https://facebook.github.io/react/docs/react-without-es6.html)。

### 组件生命周期（The Component Lifecycle）

Each component has several "lifecycle methods" that you can override to run code at particular times in the process. Methods prefixed with **`will`** are called right before something happens, and methods prefixed with **`did`** are called right after something happens.

可以在组件中覆盖特定的“生命周期方法”。**`will`**前缀的方法在某事件发生之前触发，**`did`**前缀的方法在某事件发生后立即触发。

#### 加载（Mounting）

These methods are called when an instance of a component is being created and inserted into the DOM:

当组件实例创建并插入DOM中时，会调用下列方法：

- [`constructor()`](#constructor)
- [`componentWillMount()`](#componentwillmount)
- [`render()`](#render)
- [`componentDidMount()`](#componentdidmount)

#### 更新（Updating）

An update can be caused by changes to props or state. These methods are called when a component is being re-rendered:

Props或State的改变会导致组件更新操作。当组件重新渲染时会调用下列方法：

- [`componentWillReceiveProps()`](#componentwillreceiveprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [`componentWillUpdate()`](#componentwillupdate)
- [`render()`](#render)
- [`componentDidUpdate()`](#componentdidupdate)

#### 卸载（Unmounting）

This method is called when a component is being removed from the DOM:

组件从DOM中删除时会调用下面的方法：

- [`componentWillUnmount()`](#componentwillunmount)

### 其他API（Other APIs）

Each component also provides some other APIs:

组件中也提供了下列API：

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### 类属性（Class Properties）

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### 实例属性（Instance Properties）

  - [`props`](#props)
  - [`state`](#state)

* * *

## 参考（Reference）

### `render()`

```javascript
render()
```

The `render()` method is required.

`render()`是必须方法。

When called, it should examine `this.props` and `this.state` and return a single React element. This element can be either a representation of a native DOM component, such as `<div />`, or another composite component that you've defined yourself.

当调用这个方法的时候，会检查`this.props`和`this.state`，并且返回一个React元素——可以是一个表示原生DOM的组件，比如`<div />`，也可以是一个自定义的复合组件。

You can also return `null` or `false` to indicate that you don't want anything rendered. When returning `null` or `false`, `ReactDOM.findDOMNode(this)` will return `null`.

可以返回`null`或`false`来表示没有渲染任何内容，此时，`ReactDOM.findDOMNode(this)`将返回`null`。

The `render()` function should be pure, meaning that it does not modify component state, it returns the same result each time it's invoked, and it does not directly interact with the browser. If you need to interact with the browser, perform your work in `componentDidMount()` or the other lifecycle methods instead. Keeping `render()` pure makes components easier to think about.

`render()`应该是一个纯函数，意味着状态不变，返回的结果就不变，并且返回结果不会直接作用于浏览器。如果需要和浏览器直接交互，可以在`componentDidMount()`或其他生命周期方法中操作。保持`render()`方法的纯粹性有利于后续的思考。

> 提醒（Note）
>
> `render()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.
>
> [`shouldComponentUpdate()`](#shouldcomponentupdate)方法返回false的时候`render()`方法不会调用。

* * *

### `constructor()`

```javascript
constructor(props)
```

The constructor for a React component is called before it is mounted. When implementing the constructor for a `React.Component` subclass, you should call `super(props)` before any other statement. Otherwise, `this.props` will be undefined in the constructor, which can lead to bugs.

React组件的构造函数会在加载前被调用，必须在`React.Component`子类中的构造函数的第一行代码写`super(props)`，否则，`this.props`在构造函数中将是undefined，可能导致一些错误。

The constructor is the right place to initialize state. If you don't initialize state and you don't bind methods, you don't need to implement a constructor for your React component.

构造函数中是初始化状态的一个合适的地方。如果不需要初始化状态，也不需要绑定方法，可以不在React组件中写构造函数。

It's okay to initialize state based on props. This effectively "forks" the props and sets the state with the initial props. Here's an example of a valid `React.Component` subclass constructor:

基于Props初始化State是合法的，可以有效的将Props传递给State，下面这个例子是一个有效的`React.Component`的子类构造函数：

```js
constructor(props) {
  super(props);
  this.state = {
    color: props.initialColor
  };
}
```

Beware of this pattern, as state won't be up-to-date with any props update. Instead of syncing props to state, you often want to [lift the state up](https://facebook.github.io/react/docs/lifting-state-up.html).

需要注意的是，这种用法中State不会随着Props更新。如果需要同步Props到State，[状态提升](https://facebook.github.io/react/docs/lifting-state-up.html)一般可以满足需求。

If you "fork" props by using them for state, you might also want to implement [`componentWillReceiveProps(nextProps)`](#componentwillreceiveprops) to keep the state up-to-date with them. But lifting state up is often easier and less bug-prone.

如果将Props传递给State，还需要实现[`componentWillReceiveProps(nextProps)`](#componentwillreceiveprops)方法来保持State和Props同步。但是状态提升更容易并且不容易出错。

* * *

### `componentWillMount()`

```javascript
componentWillMount()
```

`componentWillMount()` is invoked immediately before mounting occurs. It is called before `render()`, therefore setting state synchronously in this method will not trigger a re-rendering. Avoid introducing any side-effects or subscriptions in this method.

`componentWillMount()`在加载发生之前的那一刻调用，由于是在`render()`之前调用，在这个方法中同步设置State不会触发重新渲染。避免在这个方法中进行有副作用的操作或订阅。

This is the only lifecycle hook called on server rendering. Generally, we recommend using the `constructor()` instead.

这个方法是服务器端渲染中唯一调用的生命周期方法。通常情况下，建议将逻辑迁移到`constructor()`中。

* * *

### `componentDidMount()`

```javascript
componentDidMount()
```

`componentDidMount()` is invoked immediately after a component is mounted. Initialization that requires DOM nodes should go here. If you need to load data from a remote endpoint, this is a good place to instantiate the network request. Setting state in this method will trigger a re-rendering.

`componentDidMount()`在加载发生之后的那一刻调用。需要DOM节点的初始化操作需要在这里进行。如果需要从远端加载数据，适合在这个方法中发送网络请求。在这个方法中设置State将会触发重新渲染。

* * *

### `componentWillReceiveProps()`

```javascript
componentWillReceiveProps(nextProps)
```

`componentWillReceiveProps()` is invoked before a mounted component receives new props. If you need to update the state in response to prop changes (for example, to reset it), you may compare `this.props` and `nextProps` and perform state transitions using `this.setState()` in this method.

已经加载的组件接收到新Props后会调用`componentWillReceiveProps()`方法。如果需要在Props更改时更新State（比如，重置State），可以在这个方法中将`this.props`和`nextProps`进行比较，然后使用`this.setState()`设置State即可。

Note that React may call this method even if the props have not changed, so make sure to compare the current and next values if you only want to handle changes. This may occur when the parent component causes your component to re-render.

需要注意的是，即使Props未发生变化，这个方法也可能被调用，可以通过比较前后两个值的差别来处理变化。比如当父组件更新时可能导致子组件重新渲染。

React doesn't call `componentWillReceiveProps` with initial props during [mounting](#mounting). It only calls this method if some of component's props may update. Calling `this.setState` generally doesn't trigger `componentWillReceiveProps`.

React在用初始化属性[加载](#mounting)时，不会调用`componentWillReceiveProps`方法。只有当组件的Props可能更新时才会调用。调用`this.setState`方法通常不会触发`componentWillReceiveProps`。

* * *

### `shouldComponentUpdate()`

```javascript
shouldComponentUpdate(nextProps, nextState)
```

Use `shouldComponentUpdate()` to let React know if a component's output is not affected by the current change in state or props. The default behavior is to re-render on every state change, and in the vast majority of cases you should rely on the default behavior.

可以使用`shouldComponentUpdate()`方法来通知React当前组件的输出结果是否受当前State和Props的更改。默认行为时每次State的变化都会重新渲染，大多数情况下使用该默认行为即可。

`shouldComponentUpdate()` is invoked before rendering when new props or state are being received. Defaults to `true`. This method is not called for the initial render or when `forceUpdate()` is used.

当接收到新Props或State时，会在渲染之前调用`shouldComponentUpdate()`方法，默认返回`true`。当初始化渲染或者调用`forceUpdate()`时，不会调用该方法。

Returning `false` does not prevent child components from re-rendering when *their* state changes.

返回`false`并不会阻止子组件因为子组件“自身”状态变化导致的重新渲染。

Currently, if `shouldComponentUpdate()` returns `false`, then [`componentWillUpdate()`](#componentwillupdate), [`render()`](#render), and [`componentDidUpdate()`](#componentdidupdate) will not be invoked. Note that in the future React may treat `shouldComponentUpdate()` as a hint rather than a strict directive, and returning `false` may still result in a re-rendering of the component.

如果`shouldComponentUpdate()`方法返回`false`，那么[`componentWillUpdate()`](#componentwillupdate)，[`render()`](#render)，和[`componentDidUpdate()`](#componentdidupdate)方法都不会调用。需要注意的是，未来的`shouldComponentUpdate()`可能仅作为一个对引擎的提示参考，而不是一个严格的执行行为，也就是说即使返回`false`也有可能重新渲染组件。

If you determine a specific component is slow after profiling, you may change it to inherit from [`React.PureComponent`](https://facebook.github.io/react/docs/react-api.html#react.purecomponent) which implements `shouldComponentUpdate()` with a shallow prop and state comparison. If you are confident you want to write it by hand, you may compare `this.props` with `nextProps` and `this.state` with `nextState` and return `false` to tell React the update can be skipped.

如果某个组件产生了性能问题，可以继承自[`React.PureComponent`](https://facebook.github.io/react/docs/react-api.html#react.purecomponent)，该基类在 `shouldComponentUpdate()`中实现了Props和State的浅比较。如果需要手工编写相关条件，可以将`this.props`和`nextProps`，以及`this.state`和`nextState`对比，并且返回`false`来告诉React跳过该组件的更新。

* * *

### `componentWillUpdate()`

```javascript
componentWillUpdate(nextProps, nextState)
```

`componentWillUpdate()` is invoked immediately before rendering when new props or state are being received. Use this as an opportunity to perform preparation before an update occurs. This method is not called for the initial render.

在接收到新Props和新State进行渲染之前会调用`componentWillUpdate()`方法，可以在这个方法中进行更新操作的准备工作。在初始化渲染时，不会调用该方法。

Note that you cannot call `this.setState()` here. If you need to update state in response to a prop change, use `componentWillReceiveProps()` instead.

需要注意的是，不要在这里调用`this.setState()`方法。如果State需要响应Props的变化，在`componentWillReceiveProps()`中操作更合适。

> 提醒（Note）
>
> `componentWillUpdate()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.
>
> 如果[`shouldComponentUpdate()`](#shouldcomponentupdate)返回`false`，则不会调用`componentWillUpdate()`方法。

* * *

### `componentDidUpdate()`

```javascript
componentDidUpdate(prevProps, prevState)
```

`componentDidUpdate()` is invoked immediately after updating occurs. This method is not called for the initial render.

更新操作完成之后会立即调用`componentDidUpdate()`方法，但在初始化渲染时不会调用。

Use this as an opportunity to operate on the DOM when the component has been updated. This is also a good place to do network requests as long as you compare the current props to previous props (e.g. a network request may not be necessary if the props have not changed).

可以在这个方法中对更新后的DOM进行操作，也可以根据状态前后的变化来发起网络请求（如果Props没有发生变化，也就没必要发送网络请求）。

> 提醒（Note）
>
> `componentDidUpdate()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.
>
> 当[`shouldComponentUpdate()`](#shouldcomponentupdate)返回`false`时，不会调用`componentDidUpdate()`方法。

* * *

### `componentWillUnmount()`

```javascript
componentWillUnmount()
```

`componentWillUnmount()` is invoked immediately before a component is unmounted and destroyed. Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any DOM elements that were created in `componentDidMount`

当一个组件卸载或销毁之前会立刻调用`compnoentWillUnmount()`方法。可以在这个方法中做一些必要的清理工作，比如无效的计时器，取消网络请求，或者清除在`componentDidMount`中创建的DOM元素。

* * *

### `setState()`

```javascript
setState(updater, [callback])
```

`setState()` enqueues changes to the component state and tells React that this component and its children need to be re-rendered with the updated state. This is the primary method you use to update the user interface in response to event handlers and server responses.

`setState()`方法将组件的状态追加到修改队列，并通知React该组件及其子组件需要根据更新后的State重新渲染。这是根据用户响应和服务器返回更新用户UI的主要方法。

Think of `setState()` as a *request* rather than an immediate command to update the component. For better perceived performance, React may delay it, and then update several components in a single pass. React does not guarantee that the state changes are applied immediately.

可以将`setState()`想象为*请求*组件更新，而不是直接调用。为了更好的性能，React可能会延迟执行，将几次组件的更新操作合在一起执行。React不一定会在该方法调用后立即更新状态。

`setState()` does not always immediately update the component. It may batch or defer the update until later. This makes reading `this.state` right after calling `setState()` a potential pitfall. Instead, use `componentDidUpdate` or a `setState` callback (`setState(updater, callback)`), either of which are guaranteed to fire after the update has been applied. If you need to set the state based on the previous state, read about the `updater` argument below.

`setState()`并不总是立刻更新组件，它可能批量更新或者延迟执行。在`setState()`调用之后立即读取`this.state`是一个常见的陷阱，为了保证更新已经执行，建议在`componentDidUpdate`或使用`setState`的回掉函数（`setState(updater, callback)`）。如果需要基于之前的State设置State，参考下面的`updater`参数的用法。

`setState()` will always lead to a re-render unless `shouldComponentUpdate()` returns `false`. If mutable objects are being used and conditional rendering logic cannot be implemented in `shouldComponentUpdate()`, calling `setState()` only when the new state differs from the previous state will avoid unnecessary re-renders.

`setState()`总是会导致重新渲染，除非`shouldComponentUpdate()`返回`false`。如果State是可变数据，并且在`shouldComponentUpdate()`中无法进行田间判断，只在State发生变化的时候调用`setState()`以避免不必要的重新渲染。

The first argument is an `updater` function with the signature:

第一个参数`updater`可以是一个如下签名的函数：

```javascript
(prevState, props) => stateChange
```

`prevState` is a reference to the previous state. It should not be directly mutated. Instead, changes should be represented by building a new object based on the input from `prevState` and `props`. For instance, suppose we wanted to increment a value in state by `props.step`:

`prevState`是之前状态的引用，不能被直接修改。而是应该基于`prevState`和`props`构建一个新对象来表示新的状态。如下例，假设根据`props.step`来增加值：

```javascript
this.setState((prevState, props) => {
  return {counter: prevState.counter + props.step};
});
```

Both `prevState` and `props` received by the updater function are guaranteed to be up-to-date. The output of the updater is shallowly merged with `prevState`.

updater函数接收的`prevState`和`props`参数都是最新的。输出值是基于`prevState`的浅拷贝。

The second parameter to `setState()` is an optional callback function that will be executed once `setState` is completed and the component is re-rendered. Generally we recommend using `componentDidUpdate()` for such logic instead.

`setState()`函数的第二个参数是可选的回调函数，当`setState`完成并且组件重新渲染后会调用。通常建议使用`componentDidUpdate()`来代替。

You may optionally pass an object as the first argument to `setState()` instead of a function:

也可以将一个对象作为第一个参数传入`setState()`中：

```javascript
setState(stateChange, [callback])
```

This performs a shallow merge of `stateChange` into the new state, e.g., to adjust a shopping cart item quantity:

这会通过将`stateChange`浅合并到新State中，比如下面的实例中修改购物车商品的数量：

```javascript
this.setState({quantity: 2})
```

This form of `setState()` is also asynchronous, and multiple calls during the same cycle may be batched together. For example, if you attempt to increment an item quantity more than once in the same cycle, that will result in the equivalent of:

`setState()`也是一个异步的调用，在同一个生命周期中的多次调用会合并在一起批量执行。比如，如果在同一个生命周期中多次添加商品数量，执行效果相当于：

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

Subsequent calls will override values from previous calls in the same cycle, so the quantity will only be incremented once. If the next state depends on the previous state, we recommend using the updater function form, instead:

当前生命周期中的重复调用序列中，后者会覆盖前者的值，所以相当于只增加了1次。如果后面的State依赖于之前的State，建议使用updater回调函数的形式代替：

```js
this.setState((prevState) => {
  return {counter: prevState.quantity + 1};
});
```

For more detail, see the [State and Lifecycle guide](https://facebook.github.io/react/docs/state-and-lifecycle.html).

为获更详细信息，可以查看[State和生命周期指南](https://facebook.github.io/react/docs/state-and-lifecycle.html).

* * *

### `forceUpdate()`

```javascript
component.forceUpdate(callback)
```

By default, when your component's state or props change, your component will re-render. If your `render()` method depends on some other data, you can tell React that the component needs re-rendering by calling `forceUpdate()`.

默认情况下，组件的State或Props更新后组件会自动重新渲染。但如果`render()`方法依赖于一些其他的数据，可以通过`forceUpdate()`来让React强制重新渲染。

Calling `forceUpdate()` will cause `render()` to be called on the component, skipping `shouldComponentUpdate()`. This will trigger the normal lifecycle methods for child components, including the `shouldComponentUpdate()` method of each child. React will still only update the DOM if the markup changes.

调用`forceUpdate()`将导致组件跳过`shouldComponentUpdate()`方法直接调用`render()`方法。但在子组件中会触发通常更新流程中调用的生命周期方法，包括`shouldComponentUpdate()`方法。最终React只会实际更新发生变化的DOM。

Normally you should try to avoid all uses of `forceUpdate()` and only read from `this.props` and `this.state` in `render()`.

通常情况下，应该避免使用`forceUpdate()`方法，并且在`render()`方法中仅读取`this.props`和`this.state`。

* * *

## 类属性（Class Properties）

### `defaultProps`

`defaultProps` can be defined as a property on the component class itself, to set the default props for the class. This is used for undefined props, but not for null props. For example:

`defaultProps`可以被定义为组件类自身的属性，来设置类的默认Props。这种方式可以来给没有定义的Props赋值，但不适用于null属性。比如：

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

If `props.color` is not provided, it will be set by default to `'blue'`:

如果没有提供`props.color`，它将被设置为默认的`'blue'`值。

```js
  render() {
    return <CustomButton /> ; // props.color will be set to blue
  }
```

If `props.color` is set to null, it will remain null:

如果`props.color`设置为null，则将保持使用null：

```js
  render() {
    return <CustomButton color={null} /> ; // props.color will remain null
  }
```

* * *

### `displayName`

The `displayName` string is used in debugging messages. JSX sets this value automatically; see [JSX in Depth](https://facebook.github.io/react/docs/jsx-in-depth.html).

`displayName`字符串用来设置调试信息。JSX会自动设置该属性，从[深入JSX](https://facebook.github.io/react/docs/jsx-in-depth.html)查看详细。

* * *

## 实例属性（Instance Properties）

### `props`

`this.props` contains the props that were defined by the caller of this component. See [Components and Props](https://facebook.github.io/react/docs/components-and-props.html) for an introduction to props.

`this.props`包含着父组件传递给当前组件的Props，从[组件和Props](https://facebook.github.io/react/docs/components-and-props.html)查看Props的介绍。

In particular, `this.props.children` is a special prop, typically defined by the child tags in the JSX expression rather than in the tag itself.

有一种特殊情况，`this.props.children`是一个特殊的Prop，建议用JSX子标签的形式定义，避免设置为标签自身的属性。

### `state`

The state contains data specific to this component that may change over time. The state is user-defined, and it should be a plain JavaScript object.

State包含组件自身相关的数据，这些数据可能需要实时变化。State是用户定义的，是一个简单的JavaScript对象。

If you don't use it in `render()`, it shouldn't be in the state. For example, you can put timer IDs directly on the instance.

如果不需要在`render()`方法中使用，则不应该定义在State中。如下里，可以直接将定时器的ID定义在实例属性上。

See [State and Lifecycle](https://facebook.github.io/react/docs/state-and-lifecycle.html) for more information about the state.

从[State和生命周期](https://facebook.github.io/react/docs/state-and-lifecycle.html)查看更多关于State的信息。

Never mutate `this.state` directly, as calling `setState()` afterwards may replace the mutation you made. Treat `this.state` as if it were immutable.

禁止直接更改`this.state`，通过调用`setState()`来进行修改，假设`this.state`是不可变数据。