---
layout: post
title: Redux 15 - 进阶：异步流（Async Flow）
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/docs/advanced/AsyncFlow.md)

Without [middleware](https://github.com/reactjs/redux/blob/master/docs/advanced/Middleware.md), Redux store only supports [synchronous data flow](https://github.com/reactjs/redux/blob/master/docs/basics/DataFlow.md). This is what you get by default with [`createStore()`](https://github.com/reactjs/redux/blob/master/docs/api/createStore.md).

在不使用[中间件](https://github.com/reactjs/redux/blob/master/docs/advanced/Middleware.md)的情况下，Redux的Store对象只支持[同步数据流](https://github.com/reactjs/redux/blob/master/docs/basics/DataFlow.md)，这是使用[`createStore()`](https://github.com/reactjs/redux/blob/master/docs/api/createStore.md)创建Store的默认结果。

You may enhance [`createStore()`](https://github.com/reactjs/redux/blob/master/docs/api/createStore.md) with [`applyMiddleware()`](https://github.com/reactjs/redux/blob/master/docs/api/applyMiddleware.md). It is not required, but it lets you [express asynchronous actions in a convenient way](https://github.com/reactjs/redux/blob/master/docs/advanced/AsyncActions.md).

可以使用[`applyMiddleware()`](https://github.com/reactjs/redux/blob/master/docs/api/applyMiddleware.md)方法对[`createStore()`](https://github.com/reactjs/redux/blob/master/docs/api/createStore.md)进行增强。虽然这不是必须的，但使用中间件[可以方便的表达异步Action](/tech/2017/04/25/redux-14-advanced-AsyncActions.html)。

Asynchronous middleware like [redux-thunk](https://github.com/gaearon/redux-thunk) or [redux-promise](https://github.com/acdlite/redux-promise) wraps the store's [`dispatch()`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch) method and allows you to dispatch something other than actions, for example, functions or Promises. Any middleware you use can then interpret anything you dispatch, and in turn, can pass actions to the next middleware in the chain. For example, a Promise middleware can intercept Promises and dispatch a pair of begin/end actions asynchronously in response to each Promise.

像[redux-thunk](https://github.com/gaearon/redux-thunk)或[redux-promise](https://github.com/acdlite/redux-promise)之类的中间件都是封装了Store对象的[`dispatch()`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch)方法，以允许你派发Action之外的其他对象，比如函数或者Promise。集成的中间件可以用来解释派发的对应对象，并将Action传递到中间件链中的下一个对象。比如，一个Promise中间件可以解释Promise，并在响应中给各自的Promise派发一对开始/结束的异步Action。

When the last middleware in the chain dispatches an action, it has to be a plain object. This is when the [synchronous Redux data flow](https://github.com/reactjs/redux/blob/master/docs/basics/DataFlow.md) takes place.

当中间件链中的最后一个对象派发Action时，该Action必须是一个普通Action对象。此时会进入[Redux同步数据流](https://github.com/reactjs/redux/blob/master/docs/basics/DataFlow.md)中。

Check out [the full source code for the async example](https://github.com/reactjs/redux/blob/master/docs/advanced/ExampleRedditAPI.md).

签出[异步Redux示例的完整代码](https://github.com/reactjs/redux/blob/master/docs/advanced/ExampleRedditAPI.md)。

## 下一步（Next Steps）

Now you saw an example of what middleware can do in Redux, it's time to learn how it actually works, and how you can create your own. Go on to the next detailed section about [Middleware](https://github.com/reactjs/redux/blob/master/docs/advanced/Middleware.md). 

之前的代码示例中在Redux中使用了中间件，现在是时候学习一下它是怎么工作的了，并学习如何创建自己的中间件。继续去下一节详细学习[中间件](https://github.com/reactjs/redux/blob/master/docs/advanced/Middleware.md)吧。
