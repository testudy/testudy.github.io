---
layout: post
title: Redux 1 - 简介（Readme）
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/README.md)

# <a href='http://redux.js.org'><img src='https://camo.githubusercontent.com/f28b5bc7822f1b7bb28a96d8d09e7d79169248fc/687474703a2f2f692e696d6775722e636f6d2f4a65567164514d2e706e67' height='60'></a>

Redux is a predictable state container for JavaScript apps.  
(If you're looking for a WordPress framework, check out [Redux Framework](https://reduxframework.com/).)

Redux是一个可预测的JavaScript应用程序的状态容器。
（如果你要寻找的是同名WordPress框架，打开[Redux Framework](https://reduxframework.com/)查看）。

It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test. On top of that, it provides a great developer experience, such as [live code editing combined with a time traveling debugger](https://github.com/gaearon/redux-devtools).

基于Redux可以编写在不同运行环境中（客户端，服务端，和原生程序）行为一致的应用程序，并便于测试的进行。此外，其提供了优秀的开发体验，比如[实时刷新和时间旅行调试](https://github.com/gaearon/redux-devtools)。

You can use Redux together with [React](https://facebook.github.io/react/), or with any other view library.  
It is tiny (2kB, including dependencies).

可在包含依赖的情况下，它是一个只有2KB的微型库，可以和[React](https://facebook.github.io/react/)或其他视图层库配合使用。

[![build status](https://img.shields.io/travis/reactjs/redux/master.svg?style=flat-square)](https://travis-ci.org/reactjs/redux)
[![npm version](https://img.shields.io/npm/v/redux.svg?style=flat-square)](https://www.npmjs.com/package/redux)
[![npm downloads](https://img.shields.io/npm/dm/redux.svg?style=flat-square)](https://www.npmjs.com/package/redux)
[![redux channel on discord](https://img.shields.io/badge/discord-%23redux%20%40%20reactiflux-61dafb.svg?style=flat-square)](https://discord.gg/0ZcbPKXt5bZ6au5t)
[![#rackt on freenode](https://img.shields.io/badge/irc-%23rackt%20%40%20freenode-61DAFB.svg?style=flat-square)](https://webchat.freenode.net/)
[![Changelog #187](https://img.shields.io/badge/changelog-%23187-lightgrey.svg?style=flat-square)](https://changelog.com/187)

>**Learn Redux from its creator:**  
>**[Getting Started with Redux](https://egghead.io/series/getting-started-with-redux) (30 free videos)**

>**跟着作者学Redux：**  
>**[Redux入门](https://egghead.io/series/getting-started-with-redux) （30个免费视频）**

### 赞誉（Testimonials）

>[“Love what you're doing with Redux”](https://twitter.com/jingc/status/616608251463909376)  
>Jing Chen, creator of Flux

>[“因Redux而爱上工作”](https://twitter.com/jingc/status/616608251463909376)  
>Jing Chen，Flux作者

>[“I asked for comments on Redux in FB's internal JS discussion group, and it was universally praised. Really awesome work.”](https://twitter.com/fisherwebdev/status/616286955693682688)  
>Bill Fisher, author of Flux documentation

>[“在FB内部的JS讨论组中讨论Redux时，大家普遍对其肯定”](https://twitter.com/fisherwebdev/status/616286955693682688)  
>Bill Fisher，Flux文档作者

>[“It's cool that you are inventing a better Flux by not doing Flux at all.”](https://twitter.com/andrestaltz/status/616271392930201604)  
>André Staltz, creator of Cycle

>[“非常漂亮，你发明了一个完全不同的更好的Flux”](https://twitter.com/andrestaltz/status/616271392930201604)  
>André Staltz, Cycle作者

### 在进一步学习之前（Before Proceeding Further）

>**Also read why you might not be needing Redux:**  
>**[“You Might Not Need Redux”](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)**

>**也读一下为什么有可能你并不需要Redux：**  
>**[“你可能并不需要Redux”](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)**

### 开发缘由（Developer Experience）

I wrote Redux while working on my React Europe talk called [“Hot Reloading with Time Travel”](https://www.youtube.com/watch?v=xsSnOQynTHs). My goal was to create a state management library with minimal API but completely predictable behavior, so it is possible to implement logging, hot reloading, time travel, universal apps, record and replay, without any buy-in from the developer.

开发Redux是我在React欧洲工作的时候讨论一个叫做[“Hot Reloading with Time Travel”](https://www.youtube.com/watch?v=xsSnOQynTHs)的问题。目标是创建一个最小API集合的状态管理库，并且完全可预测程序执行的行为，同时实现日志记录，热加载，时间旅行，通用应用，记录和重演，同时避免对开发者造成额外的学习和工作成本。

### 影响（Influences）

Redux evolves the ideas of [Flux](http://facebook.github.io/flux/), but avoids its complexity by taking cues from [Elm](https://github.com/evancz/elm-architecture-tutorial/).  
Whether you have used them or not, Redux only takes a few minutes to get started with.

Redux是[Flux](http://facebook.github.io/flux/)思想的发展，同时避免了其复杂性，并吸取了[Elm](https://github.com/evancz/elm-architecture-tutorial/)的解决思路。  
无论是否使用过Redux，只需要几分钟即可以快速上手。

### 安装（Installation）

To install the stable version:

正式版本安装：

```
npm install --save redux
```

This assumes you are using [npm](https://www.npmjs.com/) as your package manager.  

上面方法假设使用[npm](https://www.npmjs.com/)做包管理器。

If you're not, you can [access these files on unpkg](https://unpkg.com/redux/), download them, or point your package manager to them.

如果不使用npm，可以[从unpkg访问文件](https://unpkg.com/redux/)，并完成下载，或者使用熟悉的包管理器访问。

Most commonly people consume Redux as a collection of [CommonJS](http://webpack.github.io/docs/commonjs.html) modules. These modules are what you get when you import `redux` in a [Webpack](http://webpack.github.io), [Browserify](http://browserify.org/), or a Node environment. If you like to live on the edge and use [Rollup](http://rollupjs.org), we support that as well.

通常情况下将Redux作为一组[CommonJS](http://webpack.github.io/docs/commonjs.html)模块的集合，可以在[Webpack](http://webpack.github.io)，[Browserify](http://browserify.org/)或Node环境中将其引入。同时也对新式的[Rollup](http://rollupjs.org)提供支持。

If you don't use a module bundler, it's also fine. The `redux` npm package includes precompiled production and development [UMD](https://github.com/umdjs/umd) builds in the [`dist` folder](https://unpkg.com/redux/dist/). They can be used directly without a bundler and are thus compatible with many popular JavaScript module loaders and environments. For example, you can drop a UMD build as a [`<script>` tag](https://unpkg.com/redux/dist/redux.js) on the page, or [tell Bower to install it](https://github.com/reactjs/redux/pull/1181#issuecomment-167361975). The UMD builds make Redux available as a `window.Redux` global variable.

可以在不使用模块管理器的情况下直接引用`redux`。在`npm`包的[`dist` folder](https://unpkg.com/redux/dist/)目录中包含预编译生产和开发环境的[UMD](https://github.com/umdjs/umd)构建版本。可以将其直接引用，同时更好的与大多数主流的JavaScritp模块加载器兼容。比如，在页面中直接使用[`<script>` tag](https://unpkg.com/redux/dist/redux.js)引用，也可以[使用Bower安装](https://github.com/reactjs/redux/pull/1181#issuecomment-167361975)。UMD版本会创建一个`window.Redux`的全局变量。

The Redux source code is written in ES2015 but we precompile both CommonJS and UMD builds to ES5 so they work in [any modern browser](http://caniuse.com/#feat=es5). You don't need to use Babel or a module bundler to [get started with Redux](https://github.com/reactjs/redux/blob/master/examples/counter-vanilla/index.html).

Redux源码使用ES2015的语法，但已经预编译好了ES5语法的CommonJS和UMD版本可以运行在[任何现代浏览器](http://caniuse.com/#feat=es5)中。不需要引用Babel或打包器就可以[直接开始Redux学习](https://github.com/reactjs/redux/blob/master/examples/counter-vanilla/index.html)。

#### Complementary Packages

Most likely, you'll also need [the React bindings](https://github.com/reactjs/react-redux) and [the developer tools](https://github.com/gaearon/redux-devtools).

```
npm install --save react-redux
npm install --save-dev redux-devtools
```

Note that unlike Redux itself, many packages in the Redux ecosystem don't provide UMD builds, so we recommend using CommonJS module bundlers like [Webpack](http://webpack.github.io) and [Browserify](http://browserify.org/) for the most comfortable development experience.

### The Gist

The whole state of your app is stored in an object tree inside a single *store*.  
The only way to change the state tree is to emit an *action*, an object describing what happened.  
To specify how the actions transform the state tree, you write pure *reducers*.

That's it!

```js
import { createStore } from 'redux'

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(counter)

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.

store.subscribe(() =>
  console.log(store.getState())
)

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1
```

Instead of mutating the state directly, you specify the mutations you want to happen with plain objects called *actions*. Then you write a special function called a *reducer* to decide how every action transforms the entire application's state.

If you're coming from Flux, there is a single important difference you need to understand. Redux doesn't have a Dispatcher or support many stores. Instead, there is just a single store with a single root reducing function. As your app grows, instead of adding stores, you split the root reducer into smaller reducers independently operating on the different parts of the state tree. This is exactly like how there is just one root component in a React app, but it is composed out of many small components.

This architecture might seem like an overkill for a counter app, but the beauty of this pattern is how well it scales to large and complex apps. It also enables very powerful developer tools, because it is possible to trace every mutation to the action that caused it. You can record user sessions and reproduce them just by replaying every action.

### Learn Redux from Its Creator

[Getting Started with Redux](https://egghead.io/series/getting-started-with-redux) is a video course consisting of 30 videos narrated by Dan Abramov, author of Redux. It is designed to complement the “Basics” part of the docs while bringing additional insights about immutability, testing, Redux best practices, and using Redux with React. **This course is free and will always be.**

>[“Great course on egghead.io by @dan_abramov - instead of just showing you how to use #redux, it also shows how and why redux was built!”](https://twitter.com/sandrinodm/status/670548531422326785)  
>Sandrino Di Mattia

>[“Plowing through @dan_abramov 'Getting Started with Redux' - its amazing how much simpler concepts get with video.”](https://twitter.com/chrisdhanaraj/status/670328025553219584)  
>Chris Dhanaraj

>[“This video series on Redux by @dan_abramov on @eggheadio is spectacular!”](https://twitter.com/eddiezane/status/670333133242408960)  
>Eddie Zaneski

>[“Come for the name hype. Stay for the rock solid fundamentals. (Thanks, and great job @dan_abramov and @eggheadio!)”](https://twitter.com/danott/status/669909126554607617)  
>Dan

>[“This series of videos on Redux by @dan_abramov is repeatedly blowing my mind - gunna do some serious refactoring”](https://twitter.com/gelatindesign/status/669658358643892224)  
>Laurence Roberts

So, what are you waiting for?

#### [Watch the 30 Free Videos!](https://egghead.io/series/getting-started-with-redux)

If you enjoyed my course, consider supporting Egghead by [buying a subscription](https://egghead.io/pricing). Subscribers have access to the source code for the example in every one of my videos, as well as to tons of advanced lessons on other topics, including JavaScript in depth, React, Angular, and more. Many [Egghead instructors](https://egghead.io/instructors) are also open source library authors, so buying a subscription is a nice way to thank them for the work that they've done.

### 文档（Documentation）

* [简介（Introduction）](http://redux.js.org/docs/introduction/index.html)
* [基础（Basics）](http://redux.js.org/docs/basics/index.html)
* [高级（Advanced）](http://redux.js.org/docs/advanced/index.html)
* [技巧（Recipes）](http://redux.js.org/docs/recipes/index.html)
* [常见问题（Troubleshooting）](http://redux.js.org/docs/Troubleshooting.html)
* [术语（Glossary）](http://redux.js.org/docs/Glossary.html)
* [API参考（API Reference）](http://redux.js.org/docs/api/index.html)

For PDF, ePub, and MOBI exports for offline reading, and instructions on how to create them, please see: [paulkogel/redux-offline-docs](https://github.com/paulkogel/redux-offline-docs).

如果要导出PDF，ePub或MOBIle以离线阅读，可以从[paulkogel/redux-offline-docs](https://github.com/paulkogel/redux-offline-docs)学习如何创建。

### 实例（Examples）

* [Counter Vanilla](http://redux.js.org/docs/introduction/Examples.html#counter-vanilla) ([source](https://github.com/reactjs/redux/tree/master/examples/counter-vanilla))
* [Counter](http://redux.js.org/docs/introduction/Examples.html#counter) ([source](https://github.com/reactjs/redux/tree/master/examples/counter))
* [Todos](http://redux.js.org/docs/introduction/Examples.html#todos) ([source](https://github.com/reactjs/redux/tree/master/examples/todos))
* [Todos with Undo](http://redux.js.org/docs/introduction/Examples.html#todos-with-undo) ([source](https://github.com/reactjs/redux/tree/master/examples/todos-with-undo))
* [TodoMVC](http://redux.js.org/docs/introduction/Examples.html#todomvc) ([source](https://github.com/reactjs/redux/tree/master/examples/todomvc))
* [Shopping Cart](http://redux.js.org/docs/introduction/Examples.html#shopping-cart) ([source](https://github.com/reactjs/redux/tree/master/examples/shopping-cart))
* [Tree View](http://redux.js.org/docs/introduction/Examples.html#tree-view) ([source](https://github.com/reactjs/redux/tree/master/examples/tree-view))
* [Async](http://redux.js.org/docs/introduction/Examples.html#async) ([source](https://github.com/reactjs/redux/tree/master/examples/async))
* [Universal](http://redux.js.org/docs/introduction/Examples.html#universal) ([source](https://github.com/reactjs/redux/tree/master/examples/universal))
* [Real World](http://redux.js.org/docs/introduction/Examples.html#real-world) ([source](https://github.com/reactjs/redux/tree/master/examples/real-world))

If you're new to the NPM ecosystem and have troubles getting a project up and running, or aren't sure where to paste the gist above, check out [simplest-redux-example](https://github.com/jackielii/simplest-redux-example) that uses Redux together with React and Browserify.

对于NPM新手，项目启动运行比较困难，或者不确定上面的要点要写在什么位置，签出[入门Redux示例](https://github.com/jackielii/simplest-redux-example)基于React和Browserify开始Redux学习。

### 讨论（Discussion）

Join the [#redux](https://discord.gg/0ZcbPKXt5bZ6au5t) channel of the [Reactiflux](http://www.reactiflux.com) Discord community.

加入[Reactiflux](http://www.reactiflux.com) Discord社区的[#redux](https://discord.gg/0ZcbPKXt5bZ6au5t)频道。

### 感谢（Thanks）

* [The Elm Architecture](https://github.com/evancz/elm-architecture-tutorial) for a great intro to modeling state updates with reducers;
* [Turning the database inside-out](http://www.confluent.io/blog/turning-the-database-inside-out-with-apache-samza/) for blowing my mind;
* [Developing ClojureScript with Figwheel](https://www.youtube.com/watch?v=j-kj2qwJa_E) for convincing me that re-evaluation should “just work”;
* [Webpack](https://github.com/webpack/docs/wiki/hot-module-replacement-with-webpack) for Hot Module Replacement;
* [Flummox](https://github.com/acdlite/flummox) for teaching me to approach Flux without boilerplate or singletons;
* [disto](https://github.com/threepointone/disto) for a proof of concept of hot reloadable Stores;
* [NuclearJS](https://github.com/optimizely/nuclear-js) for proving this architecture can be performant;
* [Om](https://github.com/omcljs/om) for popularizing the idea of a single state atom;
* [Cycle](https://github.com/cyclejs/cycle-core) for showing how often a function is the best tool;
* [React](https://github.com/facebook/react) for the pragmatic innovation.

Special thanks to [Jamie Paton](http://jdpaton.github.io) for handing over the `redux` NPM package name.

特别感谢[Jamie Paton](http://jdpaton.github.io)将`redux`NPM包名转让。

### Logo

You can find the official logo [on GitHub](https://github.com/reactjs/redux/tree/master/logo).

可以在[GitHub](https://github.com/reactjs/redux/tree/master/logo)上找到官方Logo。

### 升级日志（Change Log）

This project adheres to [Semantic Versioning](http://semver.org/).  
Every release, along with the migration instructions, is documented on the Github [Releases](https://github.com/reactjs/redux/releases) page.

项目遵循[语义话版本](http://semver.org/)。  
每次发版以及相应的变更说明，在Github在[发布](https://github.com/reactjs/redux/releases)页面都可以找到对应文档。

### 赞助商（Patrons）

The work on Redux was [funded by the community](https://www.patreon.com/reactdx).  
Meet some of the outstanding companies that made it possible:

Redux工作由[社区赞助](https://www.patreon.com/reactdx)。  
没有下面这些优秀的公司，就没有Redux：

* [Webflow](https://github.com/webflow)
* [Ximedes](https://www.ximedes.com/)

[See the full list of Redux patrons.](PATRONS.md)

[Redux赞助商清单](https://github.com/reactjs/redux/blob/master/PATRONS.md)

### 许可（License）

MIT
