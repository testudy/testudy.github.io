---
layout: post
title: React 4 - 元素渲染（Rendering Elements）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/rendering-elements.html)

Elements are the smallest building blocks of React apps.

元素是React应用中最基础的组成部分。

An element describes what you want to see on the screen:

元素描述的是你期望在屏幕中看到的视图：

```js
const element = <h1>Hello, world</h1>;
```

Unlike browser DOM elements, React elements are plain objects, and are cheap to create. React DOM takes care of updating the DOM to match the React elements.

跟浏览器中的DOM元素有所不同，React元素是一个普通对象，实例化成本较低。React DOM负责将React元素更新到对应的浏览器DOM中。

>**Note:**
>
>One might confuse elements with a more widely known concept of "components". We will introduce components in the [next section](./react-5-components-and-props.html). Elements are what components are "made of", and we encourage you to read this section before jumping ahead.

> **备注：**
> 
> 元素容易跟另外一个更通用的“组件”概念上产生混淆。[下一节](./react-5-components-and-props.html)会讲解组件的概念，可以先忽略这个差异继续看完本节。

## 元素渲染到DOM（Rendering an Element into the DOM）

Let's say there is a `<div>` somewhere in your HTML file:

假设你的HTML文件中存在如下一个`<div>`元素：

```html
<div id="root"></div>
```

We call this a "root" DOM node because everything inside it will be managed by React DOM.

将这个div元素称为"root"节点，接下来React DOM管理的所有元素将在这个节点中进行渲染。

Applications built with just React usually have a single root DOM node. If you are integrating React into an existing app, you may have as many isolated root DOM nodes as you like.

用React单独创建的应用通常在页面中仅有一个单一的根DOM节点。如果是在现有的项目中集成React，可以根据需要使用多个相互独立的DOM节点。

To render a React element into a root DOM node, pass both to `ReactDOM.render()`:

将React元素渲染到一个DOM节点中，只需要将两者都传入`ReactDOM.render()`方法中即可：

```js
const element = <h1>Hello, world</h1>;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/rrpgNB?editors=1010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/rrpgNB?editors=1010)

It displays "Hello World" on the page.

页面将显示“Hello World”的字符串。

## 更新已经渲染的元素（Updating the Rendered Element）

React elements are [immutable](https://en.wikipedia.org/wiki/Immutable_object). Once you create an element, you can't change its children or attributes. An element is like a single frame in a movie: it represents the UI at a certain point in time.

React元素是[不可变对象](https://zh.wikipedia.org/wiki/不可變物件)。一经创建，子元素和属性即不可修改。元素就像电影中的一帧：显示的是某一个时刻的UI画面。

With our knowledge so far, the only way to update the UI is to create a new element, and pass it to `ReactDOM.render()`.

基于目前已经了解的知识，唯一可以更新UI的方法就是创建一个新元素，传递给`ReactDOM.render()`方法。

Consider this ticking clock example:

看一下下面这个时钟更新的例子：

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

It calls `ReactDOM.render()` every second from a [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) callback.

设置[`setInterval()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setInterval)每秒钟调用`ReactDOM.render()`方法一次。

>**Note:**
>
>In practice, most React apps only call `ReactDOM.render()` once. In the next sections we will learn how such code gets encapsulated into [stateful components](/tech/2016/12/15/react-6-state-and-lifecycle.html).
>
>We recommend that you don't skip topics because they build on each other.

> **备注：**
>
> 在具体实践中，大多数React应用只调用`ReactDOM.render()`一次。下一节中会学习如何将上述类型的代码封装在[状态化组件](/tech/2016/12/15/react-6-state-and-lifecycle.html)中。
>
> 建议不要跳过任何学习的主题，因为各个主题之间均存在关联性，互为基础。

## React只按需更新（React Only Updates What's Necessary）

React DOM compares the element and its children to the previous one, and only applies the DOM updates necessary to bring the DOM to the desired state.

React DOM会通过对比元素自身（包含子元素）和之前的差异，仅将这部分差异按需更新到DOM中完成视图的更新。

You can verify by inspecting the [last example](http://codepen.io/gaearon/pen/gwoJZk?editors=0010) with the browser tools:

你可以用浏览器的元素检查器观测这个[最新示例](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)，以验证上述更新原理。

![DOM inspector showing granular updates](/tech/media/granular-dom-updates.gif)

Even though we create an element describing the whole UI tree on every tick, only the text node whose contents has changed gets updated by React DOM.

即使每次tick调用时创建的是一个完整的UI树，React DOM也只会更新发生变化的文本节点。

In our experience, thinking about how the UI should look at any given moment rather than how to change it over time eliminates a whole class of bugs.

从经验看来，从UI在某个时刻应该展现成什么样子的角度思考，会比思考在这个时刻应该怎么改变UI减少很多Bug。
