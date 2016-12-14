---
layout: post
title: React 2 - Hello World（Hello World）
tags: 原创 技术 翻译 React
---

The easiest way to get started with React is to use [this Hello World example code on CodePen](http://codepen.io/gaearon/pen/ZpvBNJ?editors=0010). You don't need to install anything; you can just open it in another tab and follow along as we go through examples. If you'd rather use a local development environment, check out the [Installation](/react/docs/installation.html) page.

在CodePen上尝试[Hello World](http://codepen.io/gaearon/pen/ZpvBNJ?editors=0010)是体验React最便捷的方式。什么都不需要安装，只需要在另一个tab页面中打开并一步一步跟随示例即可。如果你更喜欢在本地开发环境，请参考[使用方法](/tech/2016/12/13/react-installation.html)中的操作。

The smallest React example looks like this:

最简单的React示例如下所示：

```js
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

It renders a header saying "Hello World" on the page.

这个示例在页面上渲染出一个“Hello World”的标题。

The next few sections will gradually introduce you to using React. We will examine the building blocks of React apps: elements and components. Once you master them, you can create complex apps from small reusable pieces.

后续的几个章节会逐渐介绍React的使用方法。把React应用构建中的各个细节进行讲解和演示，主要包括：元素和组件。一旦你掌握这些细节，就可以通过可复用的组件创建复杂的应用。

## 关于JavaScript（A Note on JavaScript）

React is a JavaScript library, and so it assumes you have a basic understanding of the JavaScript language. If you don't feel very confident, we recommend [refreshing your JavaScript knowledge](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) so you can follow along more easily.

React是一个JavaScript库，对其学习需要掌握基本的JavaScript语言。如果你对JavaScript不足够了解，推荐[重新介绍 JavaScript（JS 教程）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A_re-introduction_to_JavaScript) 以为后续的学习打下基础。

We also use some of the ES6 syntax in the examples. We try to use it sparingly because it's still relatively new, but we encourage you to get familiar with [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), and [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) statements. You can use <a href="http://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact&experimental=false&loose=false&spec=false&code=const%20element%20%3D%20%3Ch1%3EHello%2C%20world!%3C%2Fh1%3E%3B%0Aconst%20container%20%3D%20document.getElementById('root')%3B%0AReactDOM.render(element%2C%20container)%3B%0A">Babel REPL</a> to check what ES6 code compiles to.

接下来的例子中会谨慎的涉及到部分ES6的语法，毕竟ES6语法还不足够普及，但是鼓励使用[arrow functions](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，[classes](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)，[template literals](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/template_strings)，[`let`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let)，and [`const`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const)语法。你可以使用<a href="http://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact&experimental=false&loose=false&spec=false&code=const%20element%20%3D%20%3Ch1%3EHello%2C%20world!%3C%2Fh1%3E%3B%0Aconst%20container%20%3D%20document.getElementById('root')%3B%0AReactDOM.render(element%2C%20container)%3B%0A">Babel REPL</a>检查语法的编译结果。
