---
layout: post
title: React 5 - 组件和属性（Components and Props）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/components-and-props.html)

Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.

可以将UI拆分成独立可重用的组件，以对每一个组件进行独立思考。

Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called "props") and return React elements describing what should appear on the screen.

从概念上讲，组件类似于JavaScript中的函数。接收任意的输入（“props”），返回需要在屏幕上显示的React元素。

## 函数形式和类形式组件（Functional and Class Components）

The simplest way to define a component is to write a JavaScript function:

定义组件最简单的方式是使用如下的函数形式：

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

This function is a valid React component because it accepts a single "props" object argument with data and returns a React element. We call such components "functional" because they are literally JavaScript functions.

这个函数是一个有效的React组件，其接收一个简单的“props”对象参数，并且返回一个React元素。这种形式的组件称为”函数形式“，字面上就是一个JavaScript函数。

You can also use an [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) to define a component:

也可以使用[ES6类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)的形式定义定义组件：

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

The above two components are equivalent from React's point of view.

在React中上述两种形式的定义是完全等价的。

Classes have some additional features that we will discuss in the [next sections](/react/docs/state-and-lifecycle.html). Until then, we will use functional components for their conciseness.

[下一节](state-and-lifecycle.html)将讨论类形式组件的一些其他特性。此时，先使用简明的函数形式定义。

## 组件渲染（Rendering a Component）

Previously, we only encountered React elements that represent DOM tags:

之前，只在示例中使用了表示DOM标签的React元素：

```js
const element = <div />;
```

However, elements can also represent user-defined components:

元素也可以用来表示用户自定义的组件：

```js
const element = <Welcome name="Sara" />;
```

When React sees an element representing a user-defined component, it passes JSX attributes to this component as a single object. We call this object "props".

在React中，用元素表示的用户自定义组件，会把JSX属性集合构成的简单对象作为参数传给自身，这个简单对象称为“props”。

For example, this code renders "Hello, Sara" on the page:

比如，下面的代码在页面上渲染了“Hello, Sara”：

```js{1,5}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/YGYmEG?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/YGYmEG?editors=0010)

Let's recap what happens in this example:

1. We call `ReactDOM.render()` with the `<Welcome name="Sara" />` element.
2. React calls the `Welcome` component with `{name: 'Sara'}` as the props.
3. Our `Welcome` component returns a `<h1>Hello, Sara</h1>` element as the result.
4. React DOM efficiently updates the DOM to match `<h1>Hello, Sara</h1>`.

概括一下这个例子中发生了什么：

1. 将`<Welcome name="Sara" />`元素作为参数调用`ReactDOM.render()`方法；
2. React调用`Welcome`组件时传入props`{name: 'Sara'}`；
3. `Welcome`组件返回`<h1>Hello, Sara</h1>`元素；
4. React DOM将`<h1>Hello, Sara</h1>`成功更新到DOM中。

>**Caveat:**
>
>Always start component names with a capital letter.
>
>For example, `<div />` represents a DOM tag, but `<Welcome />` represents a component and requires `Welcome` to be in scope.

> **警告：**
>
> 组件名必须以大写字母开头。
>
> 比如，`<div />`表示一个DOM标签，`<Welcome />`表示一个组件（要求Welcome组件在当前作用域中定义）。

## 组件组合（Composing Components）

Components can refer to other components in their output. This lets us use the same component abstraction for any level of detail. A button, a form, a dialog, a screen: in React apps, all those are commonly expressed as components.

组件中可以嵌套引用其他的组件，组件可以在任意级别的细节中进行复用。在React应用中，按钮、表单、对话框和一个完整的界面都可以被抽象为组件。

For example, we can create an `App` component that renders `Welcome` many times:

如下所示，可以在`App`组件中多次复用`Welcome`组件：

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/KgQKPr?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/KgQKPr?editors=0010)

Typically, new React apps have a single `App` component at the very top. However, if you integrate React into an existing app, you might start bottom-up with a small component like `Button` and gradually work your way to the top of the view hierarchy.

典型的React应用中只需要在最顶级设置一个`App`组件即可。当需要在老项目中集成React时，可以从`Button`之类的底层小组件开始，按照视图层次的结构自下而上逐层集成。

>**Caveat:**
>
>Components must return a single root element. This is why we added a `<div>` to contain all the `<Welcome />` elements.

> **警告：**
>
> 组件的返回值是一个元素，即该元素必须有一个根元素。因此在上面的示例中将`<Welcome />`元素嵌套在`<div>`元素中。

## 组件拆分（Extracting Components）

Don't be afraid to split components into smaller components.

不要害怕将组件拆分成更小的组件。

For example, consider this `Comment` component:

如下例所示，看看这个`Comment`组件：

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/VKQwEo?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/VKQwEo?editors=0010)

It accepts `author` (an object), `text` (a string), and `date` (a date) as props, and describes a comment on a social media website.

这个组件的props包含`author`（对象），`text`（字符串）和`date`（日期）三个字段，作为社交网站上的一个评论模块。

This component can be tricky to change because of all the nesting, and it is also hard to reuse individual parts of it. Let's extract a few components from it.

上述组件结构较复杂难于维护，其中的个别部分也难于复用。接下来尝试从其中拆分出一些更小的组件。

First, we will extract `Avatar`:

第一步，拆分出`Avatar`组件：

```js
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

The `Avatar` doesn't need to know that it is being rendered inside a `Comment`. This is why we have given its prop a more generic name: `user` rather than `author`.

拆分出来的`Avatar`组件不需要限制自身只在`Comment`组件中渲染。因此，将其属性名`author`调整为一个更通用的名字`user`。

We recommend naming props from the component's own point of view rather than the context in which it is being used.

建议属性命名优先从组件自身的通用角度考虑，避免将属性名和其使用的上下文过度相关联。

We can now simplify `Comment` a tiny bit:

现在可以对`Comment`组件完成第一步小简化：

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

Next, we will extract a `UserInfo` component that renders an `Avatar` next to user's name:

下一步，拆分出`UserInfo`组件，在用户名前面渲染一个`Avatar`。

```js
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

This lets us simplify `Comment` even further:

接下来可以进一步简化`Comment` 组件：

```js
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/rrJNJY?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/rrJNJY?editors=0010)

Extracting components might seem like grunt work at first, but having a palette of reusable components pays off in larger apps. A good rule of thumb is that if a part of your UI is used several times (`Button`, `Panel`, `Avatar`), or is complex enough on its own (`App`, `FeedStory`, `Comment`), it is a good candidate to be a reusable component.

初步看组件拆分是一个体力活，但随着组件的不断拆分会逐渐形成一个可以在构建更大型App中直接使用的组件库。一个比较好的实践经验是：如果一个常见UI多次出现（比如`Button`，`Panel`，`Avatar`），或者一个组件本身过于复杂（比如`App`，`FeedStory`，`Comment`），这时都建议拆分成更小的可复用组件。

## 只读属性（Props are Read-Only）

Whether you declare a component [as a function or a class](#functional-and-class-components), it must never modify its own props. Consider this `sum` function:

使用[函数形式或类形式](#functional-and-class-components)定义组件，都禁止在内部修改其属性值。比如下面的`sum`函数：

```js
function sum(a, b) {
  return a + b;
}
```

Such functions are called ["pure"](https://en.wikipedia.org/wiki/Pure_function) because they do not attempt to change their inputs, and always return the same result for the same inputs.

这样的函数被称为[“纯函数”](https://zh.wikipedia.org/wiki/纯函数)，在其内部不修改输入值，对同样的输入总是返回相同的输出。

In contrast, this function is impure because it changes its own input:

下面这个例子不属于纯函数，在函数内部修改了输入值：

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React is pretty flexible but it has a single strict rule:

React非常灵活，但其严格要求一条：

**All React components must act like pure functions with respect to their props.**

**所有组件的行为必须符合纯函数的要求，在其内部禁止改变属性值。**

Of course, application UIs are dynamic and change over time. In the [next section](/react/docs/state-and-lifecycle.html), we will introduce a new concept of "state". State allows React components to change their output over time in response to user actions, network responses, and anything else, without violating this rule.

实际上，应用视图会随着时间动态变化。在[下一节](./state-and-lifecycle.html)会讲解一个新的概念“state”。在遵守纯函数要求的前提下，React组件通过state响应用户交互、网络返回和其他变化。
