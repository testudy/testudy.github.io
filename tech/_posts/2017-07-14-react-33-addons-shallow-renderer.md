---
layout: post
title: React 33 - 浅渲染（Shallow Renderer）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/shallow-renderer.html)

**引用（Importing）**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 with npm
```

## 概述（Overview）

When writing unit tests for React, shallow rendering can be helpful. Shallow rendering lets you render a component "one level deep" and assert facts about what its render method returns, without worrying about the behavior of child components, which are not instantiated or rendered. This does not require a DOM.

浅渲染只会渲染“表层”组件，并可以对其返回结果进行断言，这对于编写React单元测试非常有帮助。浅渲染不关心相关子组件的行为，也不关心是否被实例化或者渲染，并且不依赖于DOM。

For example, if you have the following component:

如下例所示，假如有一个如下组件：

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Title</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

Then you can assert:

可以进行断言：

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// in your test:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Title</span>,
  <Subcomponent foo="bar" />
]);
```

Shallow testing currently has some limitations, namely not supporting refs.

目前浅渲染测试还存在一些限制，比如不支持引用。

> 提醒（Note）：
>
> We also recommend checking out Enzyme's [Shallow Rendering API](http://airbnb.io/enzyme/docs/api/shallow.html). It provides a nicer higher-level API over the same functionality.
>
> 建议使用Enzyme的[浅渲染API](http://airbnb.io/enzyme/docs/api/shallow.html)，这个库提供了一组功能相同方便使用的高层次接口。

## 参考（Reference）

### `shallowRenderer.render()`

You can think of the shallowRenderer as a "place" to render the component you're testing, and from which you can extract the component's output.

可以把shallowRender想象为一个用来渲染测试组件的“场所”，可以从中获得组件的输出值。

`shallowRenderer.render()` is similar to [`ReactDOM.render()`](https://facebook.github.io/react/docs/react-dom.html#render) but it doesn't require DOM and only renders a single level deep. This means you can test components isolated from how their children are implemented.

`shallowRenderer.render()`跟[`ReactDOM.render()`](https://facebook.github.io/react/docs/react-dom.html#render)方法非常相似，区别是不要求DOM，而且仅渲染表层组件。这意味着可以独立于子组件进行单独测试。

### `shallowRenderer.getRenderOutput()`

After `shallowRenderer.render()` has been called, you can use `shallowRenderer.getRenderOutput()` to get the shallowly rendered output.

`shallowRenderer.render()`方法调用之后，可以调用`shallowRenderer.getRenderOutput()`方法获得浅层的渲染结果。

You can then begin to assert facts about the output.

随后对渲染结果进行断言。
