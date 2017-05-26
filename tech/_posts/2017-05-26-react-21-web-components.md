---
layout: post
title: React 21 - Web组件（Web Components）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/web-components.html)

React and [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) are built to solve different problems.  Web Components provide strong encapsulation for reusable components, while React provides a declarative library that keeps the DOM in sync with your data. The two goals are complementary. As a developer, you are free to use React in your Web Components, or to use Web Components in React, or both.

React和[Web组件](https://developer.mozilla.org/en-US/docs/Web/Web_Components)的设计初衷用来解决不同的问题。Web组件侧重于组件的重用，而React是一个保持DOM和数据同步的声明式编程库。这两个目标并不冲突。作为开发者，可以自由的将React使用在Web组件中，也可以将Web组件使用在React中，或者两者并存。

Most people who use React don't use Web Components, but you may want to, especially if you are using third-party UI components that are written using Web Components.

大多数情况下React不会跟Web组件混合使用，但是如果需要，比如当引入一个遵循Web组件标准编写的第三方UI组件库时，直接使用即可。

## 在React中使用Web组件（Using Web Components in React）

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Hello <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> 备注（Note）：
>
> Web Components often expose an imperative API. For instance, a `video` Web Component might expose `play()` and `pause()` functions. To access the imperative APIs of a Web Component, you will need to use a ref to interact with the DOM node directly. If you are using third-party Web Components, the best solution is to write a React component that behaves as a wrapper for your Web Component.
>
> Web组件通常会暴露一组交互API。比如，`video`Web组件会暴露`play()`和`pause()`方法。为了可以操作Web组件的API，需要使用Ref来直接操作DOM节点。如果使用的是第三方Web组件，最好的解决方案是将Web组件用React封装后再使用。
>
> Events emitted by a Web Component may not properly propagate through a React render tree.
> You will need to manually attach event handlers to handle these events within your React components.
>
> Web组件派发的事件，有可能不能正确的传递到渲染树中。
> 这种情况下，需要在React组件中手工处理事件。

One common confusion is that Web Components use "class" instead of "className".

一个常见的容易困惑的细节是，在Web组件中需要使用“class”代替“className”。

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>front</div>
      <div>back</div>
    </brick-flipbox>
  );
}
```

## 在Web组件中使用React（Using React in your Web Components）

```javascript
const proto = Object.create(HTMLElement.prototype, {
  attachedCallback: {
    value: function() {
      const mountPoint = document.createElement('span');
      this.createShadowRoot().appendChild(mountPoint);

      const name = this.getAttribute('name');
      const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
      ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
    }
  }
});
document.registerElement('x-search', {prototype: proto});
```
