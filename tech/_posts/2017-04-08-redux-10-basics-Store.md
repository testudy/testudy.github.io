---
layout: post
title: Redux 10 - 基础：Store
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/docs/basics/Store.md)

In the previous sections, we defined the [actions](https://github.com/reactjs/redux/blob/master/docs/basics/Actions.md) that represent the facts about “what happened” and the [reducers](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md) that update the state according to those actions.

在之前的文档中，已经说明了[Action](/tech/2017/03/17/redux-8-basics-Actions.html)——表示“发生了什么”和[Reducer](/tech/2017/04/07/redux-9-basics-Reducers.html)——根据Action进行状态的更新。

The **Store** is the object that brings them together. The store has the following responsibilities:

* Holds application state;
* Allows access to state via [`getState()`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#getState);
* Allows state to be updated via [`dispatch(action)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch);
* Registers listeners via [`subscribe(listener)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#subscribe);
* Handles unregistering of listeners via the function returned by [`subscribe(listener)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#subscribe).

**Store**是一个将Action和Reducer连接起来的对象，有以下作用：

* 维护应用状态；
* 通过[`getState()`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#getState)方法访问应用状态；
* 通过[`dispatch(action)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch)方法更新应用状态；
* 通过[`subscribe(listener)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#subscribe)方法注册观察者对象；
* 通过[`subscribe(listener)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#subscribe)方法的返回值撤销观察者对象。

It's important to note that you'll only have a single store in a Redux application. When you want to split your data handling logic, you'll use [reducer composition](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#splitting-reducers) instead of many stores.

千万注意在Redux应用中只有一个单例的Store对象，如果需要拆分数据的处理逻辑，可以使用[reducer composition](/tech/2017/04/07/redux-9-basics-Reducers.html#splitting-reducers)来代替多个Store的方式。

It's easy to create a store if you have a reducer. In the [previous section](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md), we used [`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md) to combine several reducers into one. We will now import it, and pass it to [`createStore()`](https://github.com/reactjs/redux/blob/master/docs/api/createStore.md).

创建一个Store很简单，只需将[上一节中](/tech/2017/04/07/redux-9-basics-Reducers.html)中用[`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md)合并多个子Reducer生成的主Reducer引入，并传到[`createStore()`](https://github.com/reactjs/redux/blob/master/docs/api/createStore.md)方法中即可。

```js
import { createStore } from 'redux'
import todoApp from './reducers'
let store = createStore(todoApp)
```

You may optionally specify the initial state as the second argument to [`createStore()`](https://github.com/reactjs/redux/blob/master/docs/api/createStore.md). This is useful for hydrating the state of the client to match the state of a Redux application running on the server.

可以将初始化状态作为[`createStore()`](https://github.com/reactjs/redux/blob/master/docs/api/createStore.md)方法的第二个可选参数传入。对于服务器端和浏览器端同构渲染的Redux应用非常有用，可以将客户端的状态和服务器端渲染的状态匹配。

```js
let store = createStore(todoApp, window.STATE_FROM_SERVER)
```

## 派发Action（Dispatching Actions）

Now that we have created a store, let's verify our program works! Even without any UI, we can already test the update logic.

现在已经创建好了Store，来验证一下程序是否工作正常！即使在没有UI的情况下，也可以简单方便的测试代码更新后的逻辑。

```js
import { addTodo, toggleTodo, setVisibilityFilter, VisibilityFilters } from './actions'

// Log the initial state
console.log(store.getState())

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

// Dispatch some actions
store.dispatch(addTodo('Learn about actions'))
store.dispatch(addTodo('Learn about reducers'))
store.dispatch(addTodo('Learn about store'))
store.dispatch(toggleTodo(0))
store.dispatch(toggleTodo(1))
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))

// Stop listening to state updates
unsubscribe()
```

You can see how this causes the state held by the store to change:

可以跟踪查看一下Store中维护的状态是如何变化的：

<img src='/tech/media/store-without-ui-test-result.png' width='100%'>

We specified the behavior of our app before we even started writing the UI. We won't do this in this tutorial, but at this point you can write tests for your reducers and action creators. You won't need to mock anything because they are just [pure](https://github.com/reactjs/redux/blob/master/docs/introduction/ThreePrinciples.md#changes-are-made-with-pure-functions) functions. Call them, and make assertions on what they return.

如上所示在UI编码之前就可以执行应用[pure]。在这个教程中不会这样做，但基于此可以编写Reducer和Action Creator的测试用例，而且不需要Mock任何上下文，因为这两者都是[纯函数](/tech/2017/01/23/redux-4-introduction-ThreePrinciples.html)。调用，并对其返回值进行断言即可。

## 源代码（Source Code）

#### `index.js`

```js
import { createStore } from 'redux'
import todoApp from './reducers'

let store = createStore(todoApp)
```

## 下一步（Next Steps）

Before creating a UI for our todo app, we will take a detour to see [how the data flows in a Redux application](https://github.com/reactjs/redux/blob/master/docs/basics/DataFlow.md).

之前已经创建了Todo应用的UI，接下来会完整的跟踪一下[Redux应用中数据是如何流动](https://github.com/reactjs/redux/blob/master/docs/basics/DataFlow.md)的。
