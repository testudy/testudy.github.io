---
layout: post
title: React 32 - 测试工具（Test Utilities）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/test-utils.html)

**引用（Importing）**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 with npm
```

## 概述（Overview）

`ReactTestUtils` makes it easy to test React components in the testing framework of your choice. At Facebook we use [Jest](https://facebook.github.io/jest/) for painless JavaScript testing. Learn how to get started with Jest through the Jest website's [React Tutorial](http://facebook.github.io/jest/docs/tutorial-react.html#content).

`ReactTestUtils`简化了测试框架中对React组件的测试，在Facebook使用[Jest](https://facebook.github.io/jest/)进行便捷的JavaScript测试。可以从Jest网站学习[React测试教程](http://facebook.github.io/jest/docs/tutorial-react.html#content)。

> 提示（Note）：
>
> Airbnb has released a testing utility called Enzyme, which makes it easy to assert, manipulate, and traverse your React Components' output. If you're deciding on a unit testing utility to use together with Jest, or any other test runner, it's worth checking out: [http://airbnb.io/enzyme/](http://airbnb.io/enzyme/)
>
> Airbnb发布了一套叫做Enzyme的测试工具，便于断言、操纵和遍历React组件。如果你打算选择一套测试工具配合Jest使用，或者其他测试框架，使用[http://airbnb.io/enzyme/](http://airbnb.io/enzyme/)很有价值。

 - [`Simulate`](#simulate)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)

## 参考（Reference）

## Shallow Rendering

When writing unit tests for React, shallow rendering can be helpful. Shallow rendering lets you render a component "one level deep" and assert facts about what its render method returns, without worrying about the behavior of child components, which are not instantiated or rendered. This does not require a DOM.

浅渲染只会渲染“表层”组件，并可以对其返回结果进行断言，这对于编写React单元测试非常有帮助。浅渲染不关心相关子组件的行为，也不关心是否被实例化或者渲染，并且不依赖于DOM。

> 提醒（Note）：
>
> The shallow renderer has moved to `react-test-renderer/shallow`.<br>
> [Learn more about shallow rendering on its reference page.](https://facebook.github.io/react/docs/shallow-renderer.html)
>
> 浅渲染已经迁移到`react-test-renderer/shallow`中。<br>
> [详细请查看浅渲染的参考页面](https://facebook.github.io/react/docs/shallow-renderer.html)。

## 其他工具（Other Utilities）

### `Simulate`

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

Simulate an event dispatch on a DOM node with optional `eventData` event data.

在DOM节点上模拟一个事件派发，并传入可选的`eventData`事件数据。

`Simulate` has a method for [every event that React understands](https://facebook.github.io/react/docs/events.html#supported-events).

`Simulate`支持[React理解的每一个事件](https://facebook.github.io/react/docs/events.html#supported-events)。

**点击一个元素（Clicking an element）**

```javascript
// <button ref="button">...</button>
const node = this.refs.button;
ReactTestUtils.Simulate.click(node);
```

**更改一个表单值，随后按回车键（Changing the value of an input field and then pressing ENTER）。**

```javascript
// <input ref="input" />
const node = this.refs.input;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> 提醒（Note）
>
> You will have to provide any event property that you're using in your component (e.g. keyCode, which, etc...) as React is not creating any of these for you.
>
> 必须指定在组件中用到的所有事件属性（比如keyCode、which等等），React不会补充任何事件属性。

* * *

### `renderIntoDocument()`

```javascript
renderIntoDocument(element)
```

Render a React element into a detached DOM node in the document. **This function requires a DOM.**

将React元素渲染到文档的独立DOM节点中。**该方法要求DOM。**

> 提醒（Note）：
>
> You will need to have `window`, `window.document` and `window.document.createElement` globally available **before** you import `React`. Otherwise React will think it can't access the DOM and methods like `setState` won't work.
>
> 在引用`React`**之前**，需要保证有`window`，`window.document`和`window.document.createElement`全局变量。否则React会认为其不可访问DOM，`setState`之类的方法也不能正常工作。

* * *

### `mockComponent()`

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Pass a mocked component module to this method to augment it with useful methods that allow it to be used as a dummy React component. Instead of rendering as usual, the component will become a simple `<div>` (or other tag if `mockTagName` is provided) containing any provided children.

在此方法中传入一个模拟的组件模块，来创建一个用作“鸭形”的React组件。跟通常渲染不同，这个组件会变成一个简单的`<div>`（或`mockTagName`中指定的其他标签）并包含提供的任意子元素。

* * *

### `isElement()`

```javascript
isElement(element)
```

Returns `true` if `element` is any React element.

如果`element`是任意React元素则返回`true`。

* * *

### `isElementOfType()`

```javascript
isElementOfType(
  element,
  componentClass
)
```

Returns `true` if `element` is a React element whose type is of a React `componentClass`.

如果`element`是指定`componentClass`类型的React元素则返回`true`。

* * *

### `isDOMComponent()`

```javascript
isDOMComponent(instance)
```

Returns `true` if `instance` is a DOM component (such as a `<div>` or `<span>`).

如果`instance`是一个DOM组件（比如`<div>`或者`<span>`），则返回`true`。

* * *

### `isCompositeComponent()`

```javascript
isCompositeComponent(instance)
```

Returns `true` if `instance` is a user-defined component, such as a class or a function.

如果`instance`是一个用户定义的组件，比如类或者函数，则返回`true`。

* * *

### `isCompositeComponentWithType()`

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

Returns `true` if `instance` is a component whose type is of a React `componentClass`.

如果`instance`是一个指定`componentClass`类型的React组件，则返回`true`。

* * *

### `findAllInRenderedTree()`

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

Traverse all components in `tree` and accumulate all components where `test(component)` is `true`. This is not that useful on its own, but it's used as a primitive for other test utils.

遍历`tree`中的所有组件，并记录`test(component)`为`true`的所有结果。直接使用该方法的意义不大，通常使用在其他测试工具中。

* * *

### `scryRenderedDOMComponentsWithClass()`

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Finds all DOM elements of components in the rendered tree that are DOM components with the class name matching `className`.

查找渲染树中的所有匹配`className`类名的DOM元素。

* * *

### `findRenderedDOMComponentWithClass()`

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

Like [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) but expects there to be one result, and returns that one result, or throws exception if there is any other number of matches besides one.

跟[`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)方法类似，但期望其只包含一个结果，并将其返回。如果结果数量不是1个，则抛出异常。

* * *

### `scryRenderedDOMComponentsWithTag()`

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

Finds all DOM elements of components in the rendered tree that are DOM components with the tag name matching `tagName`.

查找渲染树中的所有匹配`tagName`标签的DOM元素。

* * *

### `findRenderedDOMComponentWithTag()`

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

Like [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) but expects there to be one result, and returns that one result, or throws exception if there is any other number of matches besides one.

跟[`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)方法类似，但期望其只包含一个结果，并将其返回。如果结果数量不是1个，则抛出异常。

* * *

### `scryRenderedComponentsWithType()`

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

Finds all instances of components with type equal to `componentClass`.

查找所有`componentClass`类型的组件实例。

* * *

### `findRenderedComponentWithType()`

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

Same as [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) but expects there to be one result and returns that one result, or throws exception if there is any other number of matches besides one.

跟[`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)方法类似，但期望其只包含一个结果，并将其返回。如果结果数量不是1个，则抛出异常。

* * *

