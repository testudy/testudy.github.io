---
layout: post
title: Redux 7 - 入门：示例（Examples）
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md)

Redux is distributed with a few examples in its [source code](https://github.com/reactjs/redux/tree/master/examples).

在Redux[源代码](https://github.com/reactjs/redux/tree/master/examples)中包含如下一些示例。

## Counter Vanilla

Run the [Counter Vanilla](https://github.com/reactjs/redux/tree/master/examples/counter-vanilla) example:

运行[Counter Vanilla](https://github.com/reactjs/redux/tree/master/examples/counter-vanilla)示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/counter-vanilla
open index.html
```

It does not require a build system or a view framework and exists to show the raw Redux API used with ES5.

该示例运行不依赖编译系统，也不依赖视图框架，使用ES5语法直接演示原生Redux API的使用方法。

## Counter

Run the [Counter](https://github.com/reactjs/redux/tree/master/examples/counter) example:

运行[Counter](https://github.com/reactjs/redux/tree/master/examples/counter)示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/counter
npm install
npm start

open http://localhost:3000/
```

This is the most basic example of using Redux together with React. For simplicity, it re-renders the React component manually when the store changes. In real projects, you will likely want to use the highly performant [React Redux](https://github.com/reactjs/react-redux) bindings instead.

这是一个最简单的Redux和React一起使用的示例。简单起见，当store发生变化时，会手动重新渲染React组件。

This example includes tests.

该示例包含相应的完整测试用例。

## Todos

Run the [Todos](https://github.com/reactjs/redux/tree/master/examples/todos) example:

运行[Todos](https://github.com/reactjs/redux/tree/master/examples/todos)示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/todos
npm install
npm start

open http://localhost:3000/
```

This is the best example to get a deeper understanding of how the state updates work together with components in Redux. It shows how reducers can delegate handling actions to other reducers, and how you can use [React Redux](https://github.com/reactjs/react-redux) to generate container components from your presentational components.

这是更好的理解如何在Redux中进行组件状态更新的示例。它演示了Reducer如何集成在一起处理响应，以及如何使用[React Redux](https://github.com/reactjs/react-redux)来生成容器组件。

This example includes tests.

该示例包含相应的完整测试用例。

## Todos with Undo

Run the [Todos with Undo](https://github.com/reactjs/redux/tree/master/examples/todos-with-undo) example:

运行[Todos with Undo](https://github.com/reactjs/redux/tree/master/examples/todos-with-undo)示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/todos-with-undo
npm install
npm start

open http://localhost:3000/
```

This is a variation on the previous example. It is almost identical, but additionally shows how wrapping your reducer with [Redux Undo](https://github.com/omnidan/redux-undo) lets you add a Undo/Redo functionality to your app with a few lines of code.

该示例是上一个示例的变体，两者基本上相同，但是这个示例演示了如何使用[Redux Undo](https://github.com/omnidan/redux-undo)在仅仅添加几行代码的情况下包装Reducer为程序添加Undo/Redo功能。

## TodoMVC

Run the [TodoMVC](https://github.com/reactjs/redux/tree/master/examples/todomvc) example:

运行[TodoMVC](https://github.com/reactjs/redux/tree/master/examples/todomvc)示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/todomvc
npm install
npm start

open http://localhost:3000/
```

This is the classical [TodoMVC](http://todomvc.com/) example. It's here for the sake of comparison, but it covers the same points as the Todos example.

这是经典的[TodoMVC](http://todomvc.com/)示例翻版。放在这里仅仅是为了做比较，但是涵盖了和Todos示例完全相同的功能点。

This example includes tests.

该示例包含相应的完整测试用例。

## Shopping Cart

Run the [Shopping Cart](https://github.com/reactjs/redux/tree/master/examples/shopping-cart) example:

运行[Shopping Cart](https://github.com/reactjs/redux/tree/master/examples/shopping-cart)示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/shopping-cart
npm install
npm start

open http://localhost:3000/
```

This example shows important idiomatic Redux patterns that become important as your app grows. In particular, it shows how to store entities in a normalized way by their IDs, how to compose reducers on several levels, and how to define selectors alongside the reducers so the knowledge about the state shape is encapsulated. It also demonstrates logging with [Redux Logger](https://github.com/fcomb/redux-logger) and conditional dispatching of actions with [Redux Thunk](https://github.com/gaearon/redux-thunk) middleware.

这个示例演示了在不断膨胀的应用中通常所使用Redux的模式。特别是，它展示了在标准模式中如何根据ID存储实例，如何在不同的粒度上组织Selector，以及如何定义Selector获取需要的State。并同时演示了[Redux Logger](https://github.com/fcomb/redux-logger)中间件记录日志和通过[Redux Thunk](https://github.com/gaearon/redux-thunk)中间件派发行为。

## Tree View

Run the [Tree View](https://github.com/reactjs/redux/tree/master/examples/tree-view) example:

运行[Tree View](https://github.com/reactjs/redux/tree/master/examples/tree-view)示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/tree-view
npm install
npm start

open http://localhost:3000/
```

This example demonstrates rendering a deeply nested tree view and representing its state in a normalized form so it is easy to update from reducers. Good rendering performance is achieved by the container components granularly subscribing only to the tree nodes that they render.

这个示例演示了如何渲染一个树形视图，以及如何将其状态组织成一个规范化的形式以便于在Reducer中进行更新。最后，通过在容器组件中对树节点的订阅实现了一个较好的渲染性能。

This example includes tests.

该示例包含相应的完整测试用例。

## Async

Run the [Async](https://github.com/reactjs/redux/tree/master/examples/async) example:

运行[Async](https://github.com/reactjs/redux/tree/master/examples/async)示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/async
npm install
npm start

open http://localhost:3000/
```

This example includes reading from an asynchronous API, fetching data in response to user input, showing loading indicators, caching the response, and invalidating the cache. It uses [Redux Thunk](https://github.com/gaearon/redux-thunk) middleware to encapsulate asynchronous side effects.

该示例包含异步API读取，获取用户输入，加载指示器，缓存响应，以及清除缓存。通过使用[Redux Thunk](https://github.com/gaearon/redux-thunk)来封装异步操作。

## Universal

Run the [Universal](https://github.com/reactjs/redux/tree/master/examples/universal) example:

运行[Universal](https://github.com/reactjs/redux/tree/master/examples/universal)示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/universal
npm install
npm start

open http://localhost:3000/
```

This is a basic demonstration of [server rendering](https://github.com/reactjs/redux/blob/master/docs/recipes/ServerRendering.md) with Redux and React. It shows how to prepare the initial store state on the server, and pass it down to the client so the client store can boot up from an existing state.

这是一个基础的基于Redux和React进行的[服务器端渲染](https://github.com/reactjs/redux/blob/master/docs/recipes/ServerRendering.md)示例。展示了如何在服务器端准备初始化数据，以及如何将这个状态传递到客户端以便于客户端从同一个状态启动。

## Real World

Run the [Real World](https://github.com/reactjs/redux/tree/master/examples/real-world) example:

运行[Real World](https://github.com/reactjs/redux/tree/master/examples/real-world)示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/real-world
npm install
npm start

open http://localhost:3000/
```

This is the most advanced example. It is dense by design. It covers keeping fetched entities in a normalized cache, implementing a custom middleware for API calls, rendering partially loaded data, pagination, caching responses, displaying error messages, and routing. Additionally, it includes Redux DevTools.

这是目前最高级的经过精心设计的示例。其涵盖了响应实体的规范化缓存，实现API调用中间件，部分数据加载渲染，分页，响应缓存，错误信息展示，以及路由的使用。另外，这个示例中使用了Redux DevTools。

## 更多示例（More Examples）

You can find more examples in [Awesome Redux](https://github.com/xgrommx/awesome-redux).

在[Awesome Redux](https://github.com/xgrommx/awesome-redux)查看更多示例。
