---
layout: post
title: React 12 - 组合和继承对比（Composition vs Inheritance）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/composition-vs-inheritance.html)

React has a powerful composition model, and we recommend using composition instead of inheritance to reuse code between components.

React拥有强大的组合模型，并建议在组件之间使用组合而非继承以实现代码的重用。

In this section, we will consider a few problems where developers new to React often reach for inheritance, and show how we can solve them with composition.

在本节中，将研究几个React新手习惯于用继承模型解决的问题，并展示如何用组合模型来实现。

## 包含（Containment）

Some components don't know their children ahead of time. This is especially common for components like `Sidebar` or `Dialog` that represent generic "boxes".

一些组件在设计前无法获知自己要使用什么子组件，尤其在`Sidebar`和`Dialog`等通用“盒子”中比较常见。

We recommend that such components use the special `children` prop to pass children elements directly into their output:

在这样的组件中建议使用特殊的`children`属性来将子元素直接传递到输出中：

```js
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

This lets other components pass arbitrary children to them by nesting the JSX:

在其他组件中可以将嵌套的任意JSX子元素传递给他们：

```js
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/ozqNOV?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/ozqNOV?editors=0010)

Anything inside the `<FancyBorder>` JSX tag gets passed into the `FancyBorder` component as a `children` prop. Since `FancyBorder` renders `{props.children}` inside a `<div>`, the passed elements appear in the final output.

`<FancyBorder>`中的的任何JSX标签都被一起传入到`FancyBorder`组件中的`children`属性中。由于`FancyBorder`将`{props.children}`渲染到内部`<div>`中，被传入的元素呈现在最终输出中。

While this is less common, sometimes you might need multiple "holes" in a component. In such cases you may come up with your own convention instead of using `children`:

在某些个别情况下，一个组件可能会需要多个“占位”属性，在这种情况下，可以约定自定义的属性以代替`children`使用。

```js
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/gwZOJp?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/gwZOJp?editors=0010)

React elements like `<Contacts />` and `<Chat />` are just objects, so you can pass them as props like any other data.

`<Contacts />`和`<Chat />`等React元素本质上也是对象，所以可以将其像其他数据一样作为属性使用。

## 特例（Specialization）

Sometimes we think about components as being "special cases" of other components. For example, we might say that a `WelcomeDialog` is a special case of `Dialog`.

某些情况下一个组件可以看做另外一个组件的“特例”，比如，`WelcomeDialog`可以看做`Dialog`的特例。

In React, this is also achieved by composition, where a more "specific" component renders a more "generic" one and configures it with props:

在React中，也可以使用组合实现这个需求，偏“特例”的组件基于偏“通用”的组件，通过属性进行配置：

```js
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

Composition works equally well for components defined as classes:

对于用类定义的组件组合也同样适用：

```js
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/gwZbYa?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/gwZbYa?editors=0010)

## 如何看待继承（So What About Inheritance?）

At Facebook, we use React in thousands of components, and we haven't found any use cases where we would recommend creating component inheritance hierarchies.

在Facebook，已经使用React创建了上千组件，但并没有发现任何需要使用继承体系来创建组件的案例。

Props and composition give you all the flexibility you need to customize a component's look and behavior in an explicit and safe way. Remember that components may accept arbitrary props, including primitive values, React elements, or functions.

使用属性和组合有足够的弹性去明确、安全的定制一个组件的外观和行为。切记组件中可以接收任何类型的属性，包括原始值类型、React元素或方法等。

If you want to reuse non-UI functionality between components, we suggest extracting it into a separate JavaScript module. The components may import it and use that function, object, or a class, without extending it.

当在组件之间出现非UI相关功能的重用时，比如方法、对象或类时，建议将其抽取到独立的JavaScript模块。这样不需要组件继承该模块而是直接将其引入使用即可。
