---
layout: post
title: React 19 - 不使用JSX（React Without JSX）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/react-without-jsx.html)

JSX is not a requirement for using React. Using React without JSX is especially convenient when you don't want to set up compilation in your build environment.

在React中，JSX并不是必选项。当项目中不引入编译机制的时候，不使用JSX反而会更方便。

Each JSX element is just syntactic sugar for calling `React.createElement(component, props, ...children)`. So, anything you can do with JSX can also be done with just plain JavaScript.

JSX元素只是`React.createElement(component, props, ...children)`方法的语法糖而已，所以，用JSX可以完成的工作，用纯JavaScript也同样可以完成。

For example, this code written with JSX:

比如，用JSX编写的代码如下：

```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

can be compiled to this code that does not use JSX:

被编译后的纯JavaScript代码如下：

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

If you're curious to see more examples of how JSX is converted to JavaScript, you can try out [the online Babel compiler](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-0&code=function%20hello()%20%7B%0A%20%20return%20%3Cdiv%3EHello%20world!%3C%2Fdiv%3E%3B%0A%7D).

如果你比较好奇JSX和JavaScript的转化，可以用[Babel在线编译器](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-0&code=function%20hello()%20%7B%0A%20%20return%20%3Cdiv%3EHello%20world!%3C%2Fdiv%3E%3B%0A%7D)试一试。

The component can either be provided as a string, or as a subclass of `React.Component`, or a plain function for stateless components.

被编译的组件可以是一个纯字符串，也可以是一个`React.Component`的子类，或者一个无状态的纯函数组件。

If you get tired of typing `React.createElement` so much, one common pattern is to assign a shorthand:

如果不喜欢每次都敲打`React.createElement`这么多字母，可以将其赋值给一个短变量，如下所示：

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

If you use this shorthand form for `React.createElement`, it can be almost as convenient to use React without JSX.

在不使用JSX的大多数情况下，用这种短变量名的方式会更方便。

Alternatively, you can refer to community projects such as [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) and [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers) which offer a terser syntax.

或者，可以使用社区项目[`react-hyperscript`](https://github.com/mlmorg/react-hyperscript)和[`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers)所提供的简短语法。
