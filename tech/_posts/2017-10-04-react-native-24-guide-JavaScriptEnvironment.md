---
layout: post
title: React Native 24 - 指南：JavaScript运行环境（JavaScript Environment）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/javascript-environment.html)

## JavaScript运行时（JavaScript Runtime）

When using React Native, you're going to be running your JavaScript code in two environments:

* On iOS simulators and devices, Android emulators and devices React Native uses [JavaScriptCore](http://trac.webkit.org/wiki/JavaScriptCore) which is the JavaScript engine that powers Safari. On iOS JSC doesn't use JIT due to the absence of writable executable memory in iOS apps.
* When using Chrome debugging, it runs all the JavaScript code within Chrome itself and communicates with native code via WebSocket. So you are using [V8](https://code.google.com/p/v8/).

React Native中的JavaScript代码运行在两种环境中：

* 在iOS模拟器以及设备、Android模拟器以及设备，React Native运行在[JavaScriptCore](http://trac.webkit.org/wiki/JavaScriptCore)中——驱动Safari浏览器的JavaScript引擎。由于在iOS的应用程序中中不存在可写内存，所以JSC不能启用JIT。
* 当用Chrome调试的时候，所有的JavaScript代码运行在Chrome内部的[V8](https://code.google.com/p/v8/)引擎上，并通过WebSocket将执行结果通信。

While both environments are very similar, you may end up hitting some inconsistencies. We're likely going to experiment with other JS engines in the future, so it's best to avoid relying on specifics of any runtime.

这两种执行环境非常相似，但也可能遇到不完全一致的情况。在未来有可能会更换JS引擎，所以最好避免代码依赖于特定的运行环境特性。

## JavaScritp语法转换（JavaScript Syntax Transformers）

Syntax transformers make writing code more enjoyable by allowing you to use new JavaScript syntax without having to wait for support on all interpreters.

借住语法转换器可以用更舒服的方式编写代码，充分使用JavaScript新的语法特性，而不必等解释器的支持。

As of version 0.5.0, React Native ships with the [Babel JavaScript compiler](https://babeljs.io). Check [Babel documentation](https://babeljs.io/docs/plugins/#transform-plugins) on its supported transformations for more details.

从0.5.0版本开始，React Native中集成了[Babel JavaScript编译器](https://babeljs.io)。查看[Babel文档](https://babeljs.io/docs/plugins/#transform-plugins)以获取更多支持转换的详细信息。

Here's a full list of React Native's [enabled transformations](https://github.com/facebook/react-native/blob/master/babel-preset/configs/main.js#L16).

点击查看React Native中[启用的语法转换](https://github.com/facebook/react-native/blob/master/babel-preset/configs/main.js#L16)清单。

ES5

* Reserved Words: `promise.catch(function() { });`

ES6

* [Arrow functions](http://babeljs.io/docs/learn-es2015/#arrows): `<C onPress={() => this.setState({pressed: true})}`
* [Block scoping](https://babeljs.io/docs/learn-es2015/#let-const): `let greeting = 'hi';`
* [Call spread](http://babeljs.io/docs/learn-es2015/#default-rest-spread): `Math.max(...array);`
* [Classes](http://babeljs.io/docs/learn-es2015/#classes): `class C extends React.Component { render() { return <View />; } }`
* [Constants](https://babeljs.io/docs/learn-es2015/#let-const): `const answer = 42;`
* [Destructuring](http://babeljs.io/docs/learn-es2015/#destructuring): `var {isActive, style} = this.props;`
* [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of): `for (var num of [1, 2, 3]) {}`
* [Modules](http://babeljs.io/docs/learn-es2015/#modules): `import React, { Component } from 'react';`
* [Computed Properties](http://babeljs.io/docs/learn-es2015/#enhanced-object-literals): `var key = 'abc'; var obj = {[key]: 10};`
* [Object Concise Method](http://babeljs.io/docs/learn-es2015/#enhanced-object-literals): `var obj = { method() { return 10; } };`
* [Object Short Notation](http://babeljs.io/docs/learn-es2015/#enhanced-object-literals): `var name = 'vjeux'; var obj = { name };`
* [Rest Params](https://github.com/sebmarkbage/ecmascript-rest-spread): `function(type, ...args) { }`
* [Template Literals](http://babeljs.io/docs/learn-es2015/#template-strings): ``var who = 'world'; var str = `Hello ${who}`;``

ES7

* [Object Spread](https://github.com/sebmarkbage/ecmascript-rest-spread): `var extended = { ...obj, a: 10 };`
* [Function Trailing Comma](https://github.com/jeffmo/es-trailing-function-commas): `function f(a, b, c,) { }`
* [Async Functions](https://github.com/tc39/ecmascript-asyncawait): `async function doStuffAsync() { const foo = await doOtherStuffAsync(); }`;

特殊（Specific）

* [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html): `<View style={{color: 'red'}} />`
* [Flow](http://flowtype.org/): `function foo(x: ?number): string {}`


## 垫片（Polyfills）

Many standards functions are also available on all the supported JavaScript runtimes.

所有JavaScript运行时中支持的大多数标准方法也是可用的。

Browser

* [console.{log, warn, error, info, trace, table}](https://developer.chrome.com/devtools/docs/console-api)
* [CommonJS require](https://nodejs.org/docs/latest/api/modules.html)
* [XMLHttpRequest, fetch](docs/network.html#content)
* [{set, clear}{Timeout, Interval, Immediate}, {request, cancel}AnimationFrame](docs/timers.html#content)
* [navigator.geolocation](docs/geolocation.html#content)

ES6

* [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
* String.prototype.{[startsWith](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith), [endsWith](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith), [repeat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeats), [includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes)}
* [Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)
* Array.prototype.{[find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find), [findIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex), [includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)}

ES7

* Object.{[entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries), [values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values)}

特殊（Specific）

* `__DEV__`
