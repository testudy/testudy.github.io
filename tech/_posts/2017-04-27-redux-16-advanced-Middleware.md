---
layout: post
title: Redux 16 - 进阶：中间件（Middleware）
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/docs/advanced/Middleware.md)

You've seen middleware in action in the [Async Actions](https://github.com/reactjs/redux/blob/master/docs/advanced/AsyncActions.md) example. If you've used server-side libraries like [Express](http://expressjs.com/) and [Koa](http://koajs.com/), you were also probably already familiar with the concept of *middleware*. In these frameworks, middleware is some code you can put between the framework receiving a request, and the framework generating a response. For example, Express or Koa middleware may add CORS headers, logging, compression, and more. The best feature of middleware is that it's composable in a chain. You can use multiple independent third-party middleware in a single project.

在[异步Actions](/tech/2017/04/25/redux-14-advanced-AsyncActions.html)示例中已经使用过中间件。如果你使用过[Express](http://expressjs.com/)和[Koa](http://koajs.com/)之类的服务器端框架，就应该了解和*中间件*相似的概念。在这些框架中，可以编写一些中间件放置在框架请求接收和生成响应之间。比如，Express和Koa的中间件可以实现添加CORS首部，日志，压缩等其他功能。中间件最好的特性是可以链式操作。可以在一个简单的项目中使用不同的多个相互独立的第三方中间件。

Redux middleware solves different problems than Express or Koa middleware, but in a conceptually similar way. **It provides a third-party extension point between dispatching an action, and the moment it reaches the reducer.** People use Redux middleware for logging, crash reporting, talking to an asynchronous API, routing, and more.

Redux中间件的概念跟Express和Koa的中间件类似，但解决的问题有所差异。**Redux在Action派发和Reducer接收之间为第三方扩展提供了一个时间点。**使用Redux的中间件可以实现日志记录，崩溃上报，异步API的使用，路由等其他功能。

This article is divided into an in-depth intro to help you grok the concept, and [a few practical examples](#seven-examples) to show the power of middleware at the very end. You may find it helpful to switch back and forth between them, as you flip between feeling bored and inspired.

这篇文章会尝试对中间件进行一个深入的介绍以帮助你掌握这个概念，并在最后提供了[一些实际的示例](#seven-examples)来展示中间件的强大作用。可以把文中的概念部分跟后面的示例对照着看，仔细揣摩。

## 理解中间件（Understanding Middleware）

While middleware can be used for a variety of things, including asynchronous API calls, it's really important that you understand where it comes from. We'll guide you through the thought process leading to middleware, by using logging and crash reporting as examples.

中间件可以用来解决很多问题，比如异步API调用，理解中间件的原理对中间件的使用非常重要。下面会以日志记录和崩溃上报为例来逐步学习。

### 问题：日志记录（Problem: Logging）

One of the benefits of Redux is that it makes state changes predictable and transparent. Every time an action is dispatched, the new state is computed and saved. The state cannot change by itself, it can only change as a consequence of a specific action.

Redux的优势之一是状态的变化都是可预测并且透明的。每次Action的派发，会计算并保存一个新的状态。状态本身不能改变自己，它的改变一定是由一个特定的Action触发的。

Wouldn't it be nice if we logged every action that happens in the app, together with the state computed after it? When something goes wrong, we can look back at our log, and figure out which action corrupted the state.

如果把应用中每次发生的Action和相应计算后的状态都记录起来，那么当程序出错的时候，只需回顾日志，并把相应的导致状态出错的Action找出来即可。

<img src='/tech/media/redux-middleware-logging.png' width='70%'>

How do we approach this with Redux?

在Redux中应该怎么做呢？

### 尝试#1：手动记录（Attempt #1: Logging Manually）

The most naïve solution is just to log the action and the next state yourself every time you call [`store.dispatch(action)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch). It's not really a solution, but just a first step towards understanding the problem.

最简单的方式是每次调用[`store.dispatch(action)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch)手工记录。这个办法在项目中很难使用，但可以帮助我们更进一步理解这个问题。

>##### 备注（Note）
>
>If you're using [react-redux](https://github.com/gaearon/react-redux) or similar bindings, you likely won't have direct access to the store instance in your components. For the next few paragraphs, just assume you pass the store down explicitly.
>
> 如果你正在使用[react-redux](https://github.com/gaearon/react-redux)之类的绑定库，在组件中并不能直接访问store实例。在接下来几段的讲解中，假设store是明确传递的。

Say, you call this when creating a todo:

现在，创建一个Todo：

```js
store.dispatch(addTodo('Use Redux'))
```

To log the action and state, you can change it to something like this:

为了记录这个Action和相应的State，可以将代码做如下更改：

```js
let action = addTodo('Use Redux')

console.log('dispatching', action)
store.dispatch(action)
console.log('next state', store.getState())
```

This produces the desired effect, but you wouldn't want to do it every time.

这样做可以实现需求，但你并不想每次都这样做。

### 尝试#2：包装Dispatch方法（Attempt #2: Wrapping Dispatch）

You can extract logging into a function:

可以将日志记录提取到一个单独的方法中：

```js
function dispatchAndLog(store, action) {
  console.log('dispatching', action)
  store.dispatch(action)
  console.log('next state', store.getState())
}
```

You can then use it everywhere instead of `store.dispatch()`:

这样就可以代替`store.dispatch()`：

```js
dispatchAndLog(store, addTodo('Use Redux'))
```

We could end this here, but it's not very convenient to import a special function every time.

在这里好像可以结束了，但每次引入一个特殊的方法真的有点不方便。

### 尝试#3：替换Dispatch方法（Attempt #3: Monkeypatching Dispatch）

What if we just replace the `dispatch` function on the store instance? The Redux store is just a plain object with [a few methods](https://github.com/reactjs/redux/blob/master/docs/api/Store.md), and we're writing JavaScript, so we can just monkeypatch the `dispatch` implementation:

是否可以替换Store实例的`dispatch`方法？Redux的Store对象只是有[一些方法](https://github.com/reactjs/redux/blob/master/docs/api/Store.md)的普通JavaScript对象，可以覆盖重写`dispatch`方法的实现：

```js
let next = store.dispatch
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}
```

This is already closer to what we want!  No matter where we dispatch an action, it is guaranteed to be logged. Monkeypatching never feels right, but we can live with this for now.

这个尝试已经非常接近我们的需求！现在不管在哪儿派发一个Action，都会被正确记录。但Monkeypatching总有一些坏代码的味道，但暂时先用这种方法实现。

### 问题：崩溃上报（Problem: Crash Reporting）

What if we want to apply **more than one** such transformation to `dispatch`?

如果需要在`dispatch`上使用**更多**的转换该如何处理呢？

A different useful transformation that comes to my mind is reporting JavaScript errors in production. The global `window.onerror` event is not reliable because it doesn't provide stack information in some older browsers, which is crucial to understand why an error is happening.

另一个有用的功能是上报应用的运行错误。找到出错的原因是非常重要的，但全局的`window.onerror`事件在较老的浏览器中不能捕获出错的堆栈信息。

Wouldn't it be useful if, any time an error is thrown as a result of dispatching an action, we would send it to a crash reporting service like [Sentry](https://getsentry.com/welcome/) with the stack trace, the action that caused the error, and the current state? This way it's much easier to reproduce the error in development.

所有的错误都可以在派发Action时捕获，如果将错误相关的Action和State上报到[Sentry](https://getsentry.com/welcome/)之类的平台，就可以很方便的将错误在开发环境中重现。

However, it is important that we keep logging and crash reporting separate. Ideally we want them to be different modules, potentially in different packages. Otherwise we can't have an ecosystem of such utilities. (Hint: we're slowly getting to what middleware is!)

如果可以，将日志记录和崩溃上报分开是非常重要的，拆分为不同的模块，封装在不同的包中。否则很难创建一组能相互协作的工具组件生态。（提醒：中间件的概念正在慢慢引出！）

If logging and crash reporting are separate utilities, they might look like this:

可以将日志记录和崩溃上报拆分为如下形式：

```js
function patchStoreToAddLogging(store) {
  let next = store.dispatch
  store.dispatch = function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}

function patchStoreToAddCrashReporting(store) {
  let next = store.dispatch
  store.dispatch = function dispatchAndReportErrors(action) {
    try {
      return next(action)
    } catch (err) {
      console.error('Caught an exception!', err)
      Raven.captureException(err, {
        extra: {
          action,
          state: store.getState()
        }
      })
      throw err
    }
  }
}
```

If these functions are published as separate modules, we can later use them to patch our store:

如果上面的函数是发布到各自的模块中，可以在项目中如下使用：

```js
patchStoreToAddLogging(store)
patchStoreToAddCrashReporting(store)
```

Still, this isn't nice.

但，代码可以更优雅！

### 尝试#4：隐藏Monkeypatching（Attempt #4: Hiding Monkeypatching）

Monkeypatching is a hack. “Replace any method you like”, what kind of API is that? Let's figure out the essence of it instead. Previously, our functions replaced `store.dispatch`. What if they *returned* the new `dispatch` function instead?

Monkeypatching是一种Hack方式。“可以替换你想替换的任何方法”，这样的API使用方式非常不友好。现在尝试将其使用方式优化。之前是在函数直接替换了`store.dispatch`，这个函数是否可以*返回*一个新的`dispatch`函数呢？

```js
function logger(store) {
  let next = store.dispatch

  // Previously:
  // store.dispatch = function dispatchAndLog(action) {

  return function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}
```

We could provide a helper inside Redux that would apply the actual monkeypatching as an implementation detail:

然后在Redux内部提供一个帮助方法，隐藏Monkeypatching的实现细节：

```js
function applyMiddlewareByMonkeypatching(store, middlewares) {
  middlewares = middlewares.slice()
  middlewares.reverse()

  // Transform dispatch function with each middleware.
  middlewares.forEach(middleware =>
    store.dispatch = middleware(store)
  )
}
```

We could use it to apply multiple middleware like this:

可以像下面这样同时应用应用多个中间件：

```js
applyMiddlewareByMonkeypatching(store, [ logger, crashReporter ])
```

However, it is still monkeypatching.  
The fact that we hide it inside the library doesn't alter this fact.

但这本质上依然是一个Monkeypatching。只是将实现隐藏了起来，表面上没有修改而已。

### 尝试#5：删除Monkeypatching（Attempt #5: Removing Monkeypatching）

Why do we even overwrite `dispatch`? Of course, to be able to call it later, but there's also another reason: so that every middleware can access (and call) the previously wrapped `store.dispatch`:

回想一下为什么要覆盖`dispatch`方法呢？一个原因是为了随后对其进行调用，另一个原因是：使每一个中间件都可以调用上一个中间件包装后的`store.dispatch`方法：

```js
function logger(store) {
  // Must point to the function returned by the previous middleware:
  let next = store.dispatch

  return function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}
```

It is essential to chaining middleware!

链式中间件非常重要！

If `applyMiddlewareByMonkeypatching` doesn't assign `store.dispatch` immediately after processing the first middleware, `store.dispatch` will keep pointing to the original `dispatch` function. Then the second middleware will also be bound to the original `dispatch` function.

如果`applyMiddlewareByMonkeypatching`不立即覆盖`store.dispatch`方法，那么`store.dispatch`将保持原来的`dispatch`方法。随后调用的中间件也可以访问到原始的`dispatch`方法。

But there's also a different way to enable chaining. The middleware could accept the `next()` dispatch function as a parameter instead of reading it from the `store` instance.

当然，也可以用其他的方法实现链式调用。中间件可以接收一个`next()`方法作为参数来代替上面的`store`实例对象：

```js
function logger(store) {
  return function wrapDispatchToAddLogging(next) {
    return function dispatchAndLog(action) {
      console.log('dispatching', action)
      let result = next(action)
      console.log('next state', store.getState())
      return result
    }
  }
}
```

It's a [“we need to go deeper”](http://knowyourmeme.com/memes/we-need-to-go-deeper) kind of moment, so it might take a while for this to make sense. The function cascade feels intimidating. ES6 arrow functions make this [currying](https://en.wikipedia.org/wiki/Currying) easier on eyes:

现在可以试着[“进一步思考”](http://knowyourmeme.com/memes/we-need-to-go-deeper)。函数的层层嵌套看起来并不那么友好，可以用ES6的箭头函数让其[柯里化](https://zh.wikipedia.org/wiki/柯里化)看起来更简洁：

```js
const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
    throw err
  }
}
```

**This is exactly what Redux middleware looks like.**

**这就是Redux中间件的格式。**

Now middleware takes the `next()` dispatch function, and returns a dispatch function, which in turn serves as `next()` to the middleware to the left, and so on. It's still useful to have access to some store methods like `getState()`, so `store` stays available as the top-level argument.

中间件通过接收`next()`接收dispatch函数，随后返回一个新的dispatch函数，并将其作为下一个中间件的`next()`参数。这样把`store`作为顶级参数，所有的中间件都可以访问到Store中`getState()`之类的方法。

### 尝试#6：应用中间件（Attempt #6: Naïvely Applying the Middleware）

Instead of `applyMiddlewareByMonkeypatching()`, we could write `applyMiddleware()` that first obtains the final, fully wrapped `dispatch()` function, and returns a copy of the store using it:

重写一个`applyMiddleware()`代替原来的`applyMiddlewareByMonkeypatching()`函数，来把`dispatch()`函数完全包装，并返回一个Store的拷贝进行使用：

```js
// Warning: Naïve implementation!
// That's *not* Redux API.

function applyMiddleware(store, middlewares) {
  middlewares = middlewares.slice()
  middlewares.reverse()

  let dispatch = store.dispatch
  middlewares.forEach(middleware =>
    dispatch = middleware(store)(dispatch)
  )

  return Object.assign({}, store, { dispatch })
}
```

The implementation of [`applyMiddleware()`](https://github.com/reactjs/redux/blob/master/docs/api/applyMiddleware.md) that ships with Redux is similar, but **different in three important aspects**:

* It only exposes a subset of the [store API](https://github.com/reactjs/redux/blob/master/docs/api/Store.md) to the middleware: [`dispatch(action)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch) and [`getState()`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#getState).

* It does a bit of trickery to make sure that if you call `store.dispatch(action)` from your middleware instead of `next(action)`, the action will actually travel the whole middleware chain again, including the current middleware. This is useful for asynchronous middleware, as we have seen [previously](https://github.com/reactjs/redux/blob/master/docs/advanced/AsyncActions.md).

* To ensure that you may only apply middleware once, it operates on `createStore()` rather than on `store` itself. Instead of `(store, middlewares) => store`, its signature is `(...middlewares) => (createStore) => createStore`.

最后实现的[`applyMiddleware()`](https://github.com/reactjs/redux/blob/master/docs/api/applyMiddleware.md)函数和Redux中的非常相似，但还是有*3点本质上的不同*：

* Redux只在其中间件中暴露了一部分[store API](https://github.com/reactjs/redux/blob/master/docs/api/Store.md)：[`dispatch(action)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch)和[`getState()`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#getState)。

* 需要注意，如果在中间件中使用`store.dispatch(action)`来代替`next(action)`，那么Action将重新被所有的中间件链处理，包括当前的中间件。这在异步中间件中非常有用，详见[前章](https://github.com/reactjs/redux/blob/master/docs/advanced/AsyncActions.md)。

* 确保同一个中间件不会被重复使用，在`createStore()`方法中应用而不是`store`本身。将函数签名`(store, middlewares) => store`替换为`(...middlewares) => (createStore) => createStore`。

Because it is cumbersome to apply functions to `createStore()` before using it, `createStore()` accepts an optional last argument to specify such functions.

为了方便使用，`createStore`的最后一个参数接收一个函数来进行中间件的处理。

### 最终版本（The Final Approach）

Given this middleware we just wrote:

代码整理如下：

```js
const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
    throw err
  }
}
```

Here's how to apply it to a Redux store:

接下来演示一下如何在Redux的Store中使用：

```js
import { createStore, combineReducers, applyMiddleware } from 'redux'

let todoApp = combineReducers(reducers)
let store = createStore(
  todoApp,
  // applyMiddleware() tells createStore() how to handle middleware
  applyMiddleware(logger, crashReporter)
)
```

That's it! Now any actions dispatched to the store instance will flow through `logger` and `crashReporter`:

接下来，派发到Store实例的任何Action都会通过`logger`和`crashReporter`处理：

```js
// Will flow through both logger and crashReporter middleware!
store.dispatch(addTodo('Use Redux'))
```

## 7个示例（Seven Examples）

If your head boiled from reading the above section, imagine what it was like to write it. This section is meant to be a relaxation for you and me, and will help get your gears turning.

如果你是从头开始阅读的，想象一下你会如何实现他。现在可以放松一下了，从此你的工具箱多了一个强大的工具。

Each function below is a valid Redux middleware. They are not equally useful, but at least they are equally fun.

下面的每一个中间件都是有效的。他们的使用范围和场景不同，但看看还是挺有意思的。

```js
/**
 * Logs all actions and states after they are dispatched.
 */
const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}

/**
 * Sends crash reports as state is updated and listeners are notified.
 */
const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
    throw err
  }
}

/**
 * Schedules actions with { meta: { delay: N } } to be delayed by N milliseconds.
 * Makes `dispatch` return a function to cancel the timeout in this case.
 */
const timeoutScheduler = store => next => action => {
  if (!action.meta || !action.meta.delay) {
    return next(action)
  }

  let timeoutId = setTimeout(
    () => next(action),
    action.meta.delay
  )

  return function cancel() {
    clearTimeout(timeoutId)
  }
}

/**
 * Schedules actions with { meta: { raf: true } } to be dispatched inside a rAF loop
 * frame.  Makes `dispatch` return a function to remove the action from the queue in
 * this case.
 */
const rafScheduler = store => next => {
  let queuedActions = []
  let frame = null

  function loop() {
    frame = null
    try {
      if (queuedActions.length) {
        next(queuedActions.shift())
      }
    } finally {
      maybeRaf()
    }
  }

  function maybeRaf() {
    if (queuedActions.length && !frame) {
      frame = requestAnimationFrame(loop)
    }
  }

  return action => {
    if (!action.meta || !action.meta.raf) {
      return next(action)
    }

    queuedActions.push(action)
    maybeRaf()

    return function cancel() {
      queuedActions = queuedActions.filter(a => a !== action)
    }
  }
}

/**
 * Lets you dispatch promises in addition to actions.
 * If the promise is resolved, its result will be dispatched as an action.
 * The promise is returned from `dispatch` so the caller may handle rejection.
 */
const vanillaPromise = store => next => action => {
  if (typeof action.then !== 'function') {
    return next(action)
  }

  return Promise.resolve(action).then(store.dispatch)
}

/**
 * Lets you dispatch special actions with a { promise } field.
 *
 * This middleware will turn them into a single action at the beginning,
 * and a single success (or failure) action when the `promise` resolves.
 *
 * For convenience, `dispatch` will return the promise so the caller can wait.
 */
const readyStatePromise = store => next => action => {
  if (!action.promise) {
    return next(action)
  }

  function makeAction(ready, data) {
    let newAction = Object.assign({}, action, { ready }, data)
    delete newAction.promise
    return newAction
  }

  next(makeAction(false))
  return action.promise.then(
    result => next(makeAction(true, { result })),
    error => next(makeAction(true, { error }))
  )
}

/**
 * Lets you dispatch a function instead of an action.
 * This function will receive `dispatch` and `getState` as arguments.
 *
 * Useful for early exits (conditions over `getState()`), as well
 * as for async control flow (it can `dispatch()` something else).
 *
 * `dispatch` will return the return value of the dispatched function.
 */
const thunk = store => next => action =>
  typeof action === 'function' ?
    action(store.dispatch, store.getState) :
    next(action)


// You can use all of them! (It doesn't mean you should.)
let todoApp = combineReducers(reducers)
let store = createStore(
  todoApp,
  applyMiddleware(
    rafScheduler,
    timeoutScheduler,
    thunk,
    vanillaPromise,
    readyStatePromise,
    logger,
    crashReporter
  )
)
```
