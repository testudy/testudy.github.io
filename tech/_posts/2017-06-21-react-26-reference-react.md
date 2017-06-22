---
layout: post
title: React 26 - React底层API参考（React Top-Level API）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/react-api.html)

`React` is the entry point to the React library. If you load React from a `<script>` tag, these top-level APIs are available on the `React` global. If you use ES6 with npm, you can write `import React from 'react'`. If you use ES5 with npm, you can write `var React = require('react')`.

`React`是React库的入口对象。如果使用`<script>`标签加载的React，底层API可以从全局的`React`对象中引用。如果使用ES6和npm，可以写作`import React from 'react'`。如果使用ES5和npm，可以写作`var React = require('react')`。

## 概述（Overview）

### 组件（Components）

React components let you split the UI into independent, reusable pieces, and think about each piece in isolation. React components can be defined by subclassing `React.Component` or `React.PureComponent`.

使用React组件可以将UI拆分为独立，重用，隔离的个体。React组件类可以从`React.Component`和`React.PureComponent`两个类继承定义。

 - [`React.Component`](#react.component)
 - [`React.PureComponent`](#react.purecomponent)

If you don't use ES6 classes, you may use the `create-react-class` module instead. See [Using React without ES6](https://facebook.github.io/react/docs/react-without-es6.html) for more information.

如果不使用ES6类语法，可用`create-react-class`替代。详情可查看[不使用ES6](https://facebook.github.io/react/docs/react-without-es6.html)。

### 创建React元素（Creating React Elements）

We recommend [using JSX](https://facebook.github.io/react/docs/introducing-jsx.html) to describe what your UI should look like. Each JSX element is just syntactic sugar for calling [`React.createElement()`](#createelement). You will not typically invoke the following methods directly if you are using JSX.

建议[使用JSX](https://facebook.github.io/react/docs/introducing-jsx.html)来描述UI。每个JSX元素都是[`React.createElement()`](#createelement)方法调用的语法糖，在JSX中不需要手写下面的两个方法。

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

See [Using React without JSX](https://facebook.github.io/react/docs/react-without-jsx.html) for more information.

详情可查看[不使用JSX](https://facebook.github.io/react/docs/react-without-jsx.html)。


### 元素转换（Transforming Elements）

`React` also provides some other APIs:

`React`同时提供了下列API：

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#react.children)

* * *

## 参考（Reference）

### `React.Component`

`React.Component` is the base class for React components when they are defined using [ES6 classes](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes).

`React.Component`是使用[ES6类](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes)定义组件的基类。

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

See the [React.Component API Reference](https://facebook.github.io/react/docs/react-component.html) for a list of methods and properties related to the base `React.Component` class.

`React.Component`基类的相关方法和属性列表，可从[React.Component API参考](https://facebook.github.io/react/docs/react-component.html)查看。

* * *

### `React.PureComponent`

`React.PureComponent` is exactly like [`React.Component`](#react.component) but implements [`shouldComponentUpdate()`](https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate) with a shallow prop and state comparison.

`React.PureComponent`与[`React.Component`](#react.component)完全相同，但是前者实现了[`shouldComponentUpdate()`](https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate)Props和State的浅比较。

If your React component's `render()` function renders the same result given the same props and state, you can use `React.PureComponent` for a performance boost in some cases.

如果某React组件的`render()`方法对于相同的Props和State，总是返回相同的结果，在某些情况下可以使用`React.PureComponent`来优化性能。

> 提醒（Note）

> `React.PureComponent`'s `shouldComponentUpdate()` only shallowly compares the objects. If these contain complex data structures, it may produce false-negatives for deeper differences. Only extend `PureComponent` when you expect to have simple props and state, or use [`forceUpdate()`](https://facebook.github.io/react/docs/react-component.html#forceupdate) when you know deep data structures have changed. Or, consider using [immutable objects](https://facebook.github.io/immutable-js/) to facilitate fast comparisons of nested data.
>
> `React.PureComponent`的`shouldComponentUpdate()`进行的是对象的浅比较。如果包含复杂的数据结构，可能会由于生层次的不同产生负面作用。只针对简单的Props和State使用`PureComponent`，或者当已知数据发生深层次结构变化的时候执行[`forceUpdate()`](https://facebook.github.io/react/docs/react-component.html#forceupdate)方法。最好是针对嵌套数据使用[不可变数据类型](https://facebook.github.io/immutable-js/)以提高对比的性能。
>
> Furthermore, `React.PureComponent`'s `shouldComponentUpdate()` skips prop updates for the whole component subtree. Make sure all the children components are also "pure".
>
> 另外，`React.PureComponent`的`shouldComponentUpdate()`方法会跳过整个组件子树的属性更新，需要确保所有的子组件也是纯函数。

* * *

### `createElement()`

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

Create and return a new [React element](https://facebook.github.io/react/docs/rendering-elements.html) of the given type. The type argument can be either a tag name string (such as `'div'` or `'span'`), or a [React component](https://facebook.github.io/react/docs/components-and-props.html) type (a class or a function).

根据给定的类型创建并返回一个新的[React元素](https://facebook.github.io/react/docs/rendering-elements.html)，类型参数可以是一个标签名字符串（比如`'div'`或者`'span'`），也可以是[React组件](https://facebook.github.io/react/docs/components-and-props.html)类型（一个类或者一个方法）。

Convenience wrappers around `React.createElement()` for DOM components are provided by `React.DOM`. For example, `React.DOM.a(...)` is a convenience wrapper for `React.createElement('a', ...)`. They are considered legacy, and we encourage you to either use JSX or use `React.createElement()` directly instead.

`React.DOM`为DOM组件提供了一组`React.createElement()`的快捷方法。比如，`React.DOM.a(...)`代表`React.createElement('a', ...)`。但需要注意的是这些方法是历史遗留方法，建议使用JSX或直接使用`React.createElement()`代替。

Code written with [JSX](https://facebook.github.io/react/docs/introducing-jsx.html) will be converted to use `React.createElement()`. You will not typically invoke `React.createElement()` directly if you are using JSX. See [React Without JSX](https://facebook.github.io/react/docs/react-without-jsx.html) to learn more.

[JSX](https://facebook.github.io/react/docs/introducing-jsx.html)写的代码会被转化成`React.createElement()`方法的形式。在JSX中不需要手写`React.createElement()`方法。详情可查看[不使用JSX](https://facebook.github.io/react/docs/react-without-jsx.html)。

* * *

### `cloneElement()`

```
React.cloneElement(
  element,
  [props],
  [...children]
)
```

Clone and return a new React element using `element` as the starting point. The resulting element will have the original element's props with the new props merged in shallowly. New children will replace existing children. `key` and `ref` from the original element will be preserved.

以`element`作为根元素，克隆并返回一个新的React元素，新元素中包含源元素的Props以及新的Props进行的浅合并。新的子元素会替换掉原来的子元素。原始元素中的`key`和`ref`将被保留。

`React.cloneElement()` is almost equivalent to:

`React.cloneElement()`等同于：

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

However, it also preserves `ref`s. This means that if you get a child with a `ref` on it, you won't accidentally steal it from your ancestor. You will get the same `ref` attached to your new element.

由于保留了`ref`，这就意味着用`ref`获取的子元素，不是引用源对象中的元素，已经赋予了新的元素。

This API was introduced as a replacement of the deprecated `React.addons.cloneWithProps()`.

这个API被设计用来替换废弃掉的`React.addons.cloneWithProps()`。

* * *

### `createFactory()`

```javascript
React.createFactory(type)
```

Return a function that produces React elements of a given type. Like [`React.createElement()`](#createElement), the type argument can be either a tag name string (such as `'div'` or `'span'`), or a [React component](https://facebook.github.io/react/docs/components-and-props.html) type (a class or a function).

根据给定的类型返回一个用来创建React元素的的工厂方法。接收的参数类型跟[`React.createElement()`](#createElement)相同，参数可以是一个标签名字符串（比如`'div'`或者`'span'`），也可以是[React组件](https://facebook.github.io/react/docs/components-and-props.html)类型（一个类或者一个方法）。

This helper is considered legacy, and we encourage you to either use JSX or use `React.createElement()` directly instead.

这个帮助方式是历史遗留方法，建议使用JSX或者使用`React.createElement()`直接替代。

You will not typically invoke `React.createFactory()` directly if you are using JSX. See [React Without JSX](https://facebook.github.io/react/docs/react-without-jsx.html) to learn more.

在JSX中不需要手写`React.createFactory()`方法。详情可查看[不使用JSX](https://facebook.github.io/react/docs/react-without-jsx.html)。

* * *

### `isValidElement()`

```javascript
React.isValidElement(object)
```

Verifies the object is a React element. Returns `true` or `false`.

验证对象是否是一个React元素，返回`true`或`false`。

* * *

### `React.Children`

`React.Children` provides utilities for dealing with the `this.props.children` opaque data structure.

`React.Children`为操作`this.props.children`封装起来的数据结构提供了一组工具方法。

#### `React.Children.map`

```javascript
React.Children.map(children, function[(thisArg)])
```

Invokes a function on every immediate child contained within `children` with `this` set to `thisArg`. If `children` is a keyed fragment or array it will be traversed: the function will never be passed the container objects. If children is `null` or `undefined`, returns `null` or `undefined` rather than an array.

将`children`中的每一个元素作为回调函数的参数`thisArg`值逐个调用，并返回一个返回值组成的数组。如果`children`是一个文档碎片或者数组会遍历其元素：这个方法不会遍历容器对象。如果children是`null`或`undefined`，直接返回`null`或`undefined`比返回一个数组更合适。

#### `React.Children.forEach`

```javascript
React.Children.forEach(children, function[(thisArg)])
```

Like [`React.Children.map()`](#react.children.map) but does not return an array.

跟[`React.Children.map()`](#react.children.map)一样，但是不会返回数组。

#### `React.Children.count`

```javascript
React.Children.count(children)
```

Returns the total number of components in `children`, equal to the number of times that a callback passed to `map` or `forEach` would be invoked.

返回`children`的组件总数量，其值等于`map`或`forEach`中回调函数调用的次数。

#### `React.Children.only`

```javascript
React.Children.only(children)
```

Returns the only child in `children`. Throws otherwise.

返回`children`中的唯一子元素，其他情况会抛出异常错误。

#### `React.Children.toArray`

```javascript
React.Children.toArray(children)
```

Returns the `children` opaque data structure as a flat array with keys assigned to each child. Useful if you want to manipulate collections of children in your render methods, especially if you want to reorder or slice `this.props.children` before passing it down.

返回`children`中元素扁平化后组成的数组。当在渲染方法中需要操作children的时候会非常有用，比如向下传递时对其排序或切割。

> 提醒（Note）：
>
> `React.Children.toArray()` changes keys to preserve the semantics of nested arrays when flattening lists of children. That is, `toArray` prefixes each key in the returned array so that each element's key is scoped to the input array containing it.
>
> `React.Children.toArray()`在扁平化数组时会改变元素的key以保持嵌套数组的语义，`toArray`方法会将每个元素的key前面逐层加上其索引。
