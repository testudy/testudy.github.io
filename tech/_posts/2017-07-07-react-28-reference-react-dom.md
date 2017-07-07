---
layout: post
title: React 28 - ReactDOM
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/react-dom.html)

If you load React from a `<script>` tag, these top-level APIs are available on the `ReactDOM` global. If you use ES6 with npm, you can write `import ReactDOM from 'react-dom'`. If you use ES5 with npm, you can write `var ReactDOM = require('react-dom')`.

如果是通过`<script>`标签加载React，可以通过全局的`ReactDOM`对象直接使用本文中的底层API。如果使用的是NPM和ES6，可以写成`import ReactDOM from 'react-dom'`。如果使用的是NPM和ES5，可以写成`var ReactDOM = require('react-dom')`。

## 概述（Overview）

The `react-dom` package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside of the React model if you need to. Most of your components should not need to use this module.

`react-dom`包提供了DOM相关的方法，用在App的顶层组件中，如果需要也可以在外部操作React模型。大多数组件不需要使用这个模块。

- [`render()`](#render)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)

### 浏览器支持（Browser Support）

React supports all popular browsers, including Internet Explorer 9 and above.

React支持大多数主流的浏览器，包括IE9+。

> 提醒（Note）
>
> We don't support older browsers that don't support ES5 methods, but you may find that your apps do work in older browsers if polyfills such as [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) are included in the page. You're on your own if you choose to take this path.
>
> React不支持没有实现ES5的老版本浏览器，可以在页面中加载[es5-shim和es5-sham](https://github.com/es-shims/es5-shim)垫片以在老版本的浏览器中运行。如果使用这种方式，有可能还需要自己解决一些其他问题。

* * *

## 参考（Reference）

### `render()`

```javascript
ReactDOM.render(
  element,
  container,
  [callback]
)
```

Render a React element into the DOM in the supplied `container` and return a [reference](https://facebook.github.io/react/docs/more-about-refs.html) to the component (or returns `null` for [stateless components](https://facebook.github.io/react/docs/components-and-props.html#functional-and-class-components)).

将React元素渲染到提供的`container`元素中，并返回对应组件的[引用](https://facebook.github.io/react/docs/more-about-refs.html)（对于[无状态组件](https://facebook.github.io/react/docs/components-and-props.html#functional-and-class-components)则返回`null`）。

If the React element was previously rendered into `container`, this will perform an update on it and only mutate the DOM as necessary to reflect the latest React element.

如果React元素之前被渲染到`container`中，则会触发一个更新操作，只更新需要必要的DOM以保持和最新的React元素同步。

If the optional callback is provided, it will be executed after the component is rendered or updated.

如果提供了可选的回调函数，当组件被渲染或更新之后会调用该函数。

> 提醒（Note）：
>
> `ReactDOM.render()` controls the contents of the container node you pass in. Any existing DOM elements inside are replaced when first called. Later calls use React’s DOM diffing algorithm for efficient updates.
>
> `ReactDOM.render()`会接管容器节点中的内容，首次调用时容器内部存在的任何DOM元素都会被替换掉。之后调用这个方法，会使用React的DOM增量更新算法更新。
>
> `ReactDOM.render()` does not modify the container node (only modifies the children of the container). It may be possible to insert a component to an existing DOM node without overwriting the existing children.
>
> `ReactDOM.render()`不会修改容器节点本身（只会修改其中的子元素）。也可以插入组件到一个现存的DOM节点中而不覆盖已经存在的子元素（按：跟上面这段冲突？）。
>
> `ReactDOM.render()` currently returns a reference to the root `ReactComponent` instance. However, using this return value is legacy
> and should be avoided because future versions of React may render components asynchronously in some cases. If you need a reference to the root `ReactComponent` instance, the preferred solution is to attach a
> [callback ref](https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute) to the root element.
>
> 当前的`ReactDOM.render()`方法会返回根`ReactComponent`组件的实例对象，这个方法是一个遗留方法，在未来的React版本中在某些情况下可能会异步的渲染组件。如果需要使用根`ReactComponent`实例的引用，推荐使用[回调引用](https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute)的形式来代替。

* * *

### `unmountComponentAtNode()`

```javascript
ReactDOM.unmountComponentAtNode(container)
```

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.

从DOM中删除已经加载的React组件，清理事件绑定和状态，并返回`true`；如果容器中没有加载任何组件，调用这个方法什么都不会做，并返回`false`。

* * *

### `findDOMNode()`

```javascript
ReactDOM.findDOMNode(component)
```
If this component has been mounted into the DOM, this returns the corresponding native browser DOM element. This method is useful for reading values out of the DOM, such as form field values and performing DOM measurements. **In most cases, you can attach a ref to the DOM node and avoid using `findDOMNode` at all.** When `render` returns `null` or `false`, `findDOMNode` returns `null`.

如果组件已经被加载到DOM中，这个方法会返回组件对应的浏览器原生DOM元素。对于从DOM元素中读取值很有用，比如读取表单的值或者测量DOM元素。**在大多数情况下，可以完全使用DOM节点的引用来代替`findDOMNode`。**当`render`方法返回`null`或`false`时，`findDOMNode`会返回`null`。

> 提醒（Note）：
>
> `findDOMNode` is an escape hatch used to access the underlying DOM node. In most cases, use of this escape hatch is discouraged because it pierces the component abstraction.
>
> `findDOMNode`是一个访问底层DOM节点的方法。在大多数情况下不鼓励使用，因为会破坏组件的抽象。
>
> `findDOMNode` only works on mounted components (that is, components that have been placed in the DOM). If you try to call this on a component that has not been mounted yet (like calling `findDOMNode()` in `render()` on a component that has yet to be created) an exception will be thrown.
>
> `findDOMNode`只能工作在加载的组件上（即组件已经位于DOM中）。如果尝试调用一个尚未加载的组件（比如在尚未创建完成组件的`render()`方法中调用`findDOMNode()`）将会抛出一个异常。
>
> `findDOMNode` cannot be used on functional components.
> `findDOMNode`不能被应用在函数型组件中。
