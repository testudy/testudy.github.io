---
layout: post
title: Redux 14 - 进阶：异步Action（Async Actions）
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/docs/advanced/AsyncActions.md)

In the [basics guide](https://github.com/reactjs/redux/blob/master/docs/basics/README.md), we built a simple todo application. It was fully synchronous. Every time an action was dispatched, the state was updated immediately.

在[基础指南](https://github.com/reactjs/redux/blob/master/docs/basics/README.md)中创建了一个简单的Todo应用程序。这个程序中是全同步的交互，派发的所有Action，相应的State会立即被更新。

In this guide, we will build a different, asynchronous application. It will use the Reddit API to show the current headlines for a selected subreddit. How does asynchronicity fit into Redux flow?

在这份指南中，会创建一个采用异步交互方式的应用程序。通过调用Reddit API获取当前订阅的头条信息。接下来讲解如何在Redux流程中使用异步处理？

## Actions

When you call an asynchronous API, there are two crucial moments in time: the moment you start the call, and the moment when you receive an answer (or a timeout).

当调用异步API时，这里需要关注两个关键的时间点：一个是请求调用时，另一个是接收到响应后（或超时响应）。

Each of these two moments usually require a change in the application state; to do that, you need to dispatch normal actions that will be processed by reducers synchronously. Usually, for any API request you'll want to dispatch at least three different kinds of actions:

* **An action informing the reducers that the request began.**

  The reducers may handle this action by toggling an `isFetching` flag in the state. This way the UI knows it's time to show a spinner.

* **An action informing the reducers that the request finished successfully.**

  The reducers may handle this action by merging the new data into the state they manage and resetting `isFetching`. The UI would hide the spinner, and display the fetched data.

* **An action informing the reducers that the request failed.**

  The reducers may handle this action by resetting `isFetching`. Additionally, some reducers may want to store the error message so the UI can display it.

在这两个时间点，通常情况下应用程序的状态都会发生变化；对应的Action需要传递到Reducer中同步处理。一半情况下，至少需要处理3个不同的Action：

* **一个Action用来通知Reducer请求已经开始。**

    Reducer更改`isFetching`标识状态。UI响应显示一个加载指示器。

* **一个Action用来通知Reducer请求以成功结束。**

    Reducer将获取到的新数据合并到原状态中，并重置`isFetching`标识状态。UI响应隐藏加载指示器，并显示获取到的数据。

* **一个Action用来通知Reducer请求以失败结束。**

    Reducer重置`isFetching`标识状态。同时，在其他的Reducer中处理相关的错误信息，UI响应将其显示。

You may use a dedicated `status` field in your actions:

可以在Action中定义一个专用的`status`字段来区分不同的Action：

```js
{ type: 'FETCH_POSTS' }
{ type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
{ type: 'FETCH_POSTS', status: 'success', response: { ... } }
```

Or you can define separate types for them:

或定义不同的Action类型：

```js
{ type: 'FETCH_POSTS_REQUEST' }
{ type: 'FETCH_POSTS_FAILURE', error: 'Oops' }
{ type: 'FETCH_POSTS_SUCCESS', response: { ... } }
```

Choosing whether to use a single action type with flags, or multiple action types, is up to you. It's a convention you need to decide with your team. Multiple types leave less room for a mistake, but this is not an issue if you generate action creators and reducers with a helper library like [redux-actions](https://github.com/acdlite/redux-actions).

选择哪种Action的形式取决于你，但在团队内部应该有一个统一的约定。使用多个类型在项目中可能会带来一些错误，但如果使用[redux-actions](https://github.com/acdlite/redux-actions)之类的帮助库来生成Action Creator和Reducer可以在一定程度上避免这个问题。

Whatever convention you choose, stick with it throughout the application.  
We'll use separate types in this tutorial.

无论选择哪种类型，在同一个应用中要保持一致，下面的教程中会使用单独的Action类型。

## 同步Action Creator（Synchronous Action Creators）

Let's start by defining the several synchronous action types and action creators we need in our example app. Here, the user can select a subreddit to display:

首先定义几个同步Action类型和几个需要在示例代码中使用的相关Action Creator。下面的代码是，用户选择一个需要展示的订阅主题：

#### `actions.js`

```js
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'

export function selectSubreddit(subreddit) {
  return {
    type: SELECT_SUBREDDIT,
    subreddit
  }
}
```

They can also press a “refresh” button to update it:

也可以通过一个“刷新”按钮来进行更新操作：

```js
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'

export function invalidateSubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  }
}
```

These were the actions governed by the user interaction. We will also have another kind of action, governed by the network requests. We will see how to dispatch them later, but for now, we just want to define them.

上面定义的是跟用户操作相关的Action，此外还需要定义一些其他类型的Action，比如网络请求相关的Action。现在先将它们定义下来，后面再演示如何进行使用。

When it's time to fetch the posts for some subreddit, we will dispatch a `REQUEST_POSTS` action:

当获取订阅相关的信息时，会派发如下这个`REQUEST_POSTS`Action：

```js
export const REQUEST_POSTS = 'REQUEST_POSTS'

function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}
```

It is important for it to be separate from `SELECT_SUBREDDIT` or `INVALIDATE_SUBREDDIT`. While they may occur one after another, as the app grows more complex, you might want to fetch some data independently of the user action (for example, to prefetch the most popular subreddits, or to refresh stale data once in a while). You may also want to fetch in response to a route change, so it's not wise to couple fetching to some particular UI event early on.

将`SELECT_SUBREDDIT`和`INVALIDATE_SUBREDDIT`两种类型区分非常重要。目前来看，这两个Action会先后发生，但是当应用逐渐更复杂的时候，数据获取会依赖于其他的用户行为（比如，预先获取最流行的订阅主题，或定时刷新过期的数据）。路由的变化的时候也可能需要获取数据，所以建议尽早将UI事件和数据获取分开：

Finally, when the network request comes through, we will dispatch `RECEIVE_POSTS`:

当最终网络请求完成的时候，需要派发一个`RECEIVE_POSTS`Action：

```js
export const RECEIVE_POSTS = 'RECEIVE_POSTS'

function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}
```

This is all we need to know for now. The particular mechanism to dispatch these actions together with network requests will be discussed later.

目前为止我们了解这些就可以了。稍后会在网络请求中将相关的Action串联起来。

>##### 备注请求错误的处理（Note on Error Handling）
>
>In a real app, you'd also want to dispatch an action on request failure. We won't implement error handling in this tutorial, but the [real world example](https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md#real-world) shows one of the possible approaches.
>
> 在应用的实际使用中，网络请求出错时需要派发一个Action来处理。本教程中不会实现错误的处理，可以参考[real world example](https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md#real-world)这个示例来进行错误的处理。

## State结构设计（Designing the State Shape）

Just like in the basic tutorial, you'll need to [design the shape of your application's state](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#designing-the-state-shape) before rushing into the implementation. With asynchronous code, there is more state to take care of, so we need to think it through.

跟基础教程中一样，在开始编码实现之前首先需要[设计应用程序的State结构](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#designing-the-state-shape)。尤其对于异步代码来说，涉及更多的状态，更需将其考虑充分。

This part is often confusing to beginners, because it is not immediately clear what information describes the state of an asynchronous application, and how to organize it in a single tree.

初学者经常对这一部分产生疑惑，很难快速清晰的描述异步应用中需要用到的各种状态，以及如何将其组织在同一颗树中。

We'll start with the most common use case: lists. Web applications often show lists of things. For example, a list of posts, or a list of friends. You'll need to figure out what sorts of lists your app can show. You want to store them separately in the state, because this way you can cache them and only fetch again if necessary.

下面从最常用的案例——列表入手。Web应用大多数用来展示一组列表数据。比如，一组博文，或者一组联系人。所以，需要搞清楚应用程序中需要展示的列表类型，将它们分别存储在State中，方便后续的缓存和按需获取。

Here's what the state shape for our “Reddit headlines” app might look like:

“Reddit headlines”应用的State结构如下所示：

```js
{
  selectedSubreddit: 'frontend',
  postsBySubreddit: {
    frontend: {
      isFetching: true,
      didInvalidate: false,
      items: []
    },
    reactjs: {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: 1439478405547,
      items: [
        {
          id: 42,
          title: 'Confusion about Flux and Relay'
        },
        {
          id: 500,
          title: 'Creating a Simple Application Using React JS and Flux Architecture'
        }
      ]
    }
  }
}
```

There are a few important bits here:

* We store each subreddit's information separately so we can cache every subreddit. When the user switches between them the second time, the update will be instant, and we won't need to refetch unless we want to. Don't worry about all these items being in memory: unless you're dealing with tens of thousands of items, and your user rarely closes the tab, you won't need any sort of cleanup.

* For every list of items, you'll want to store `isFetching` to show a spinner, `didInvalidate` so you can later toggle it when the data is stale, `lastUpdated` so you know when it was fetched the last time, and the `items` themselves. In a real app, you'll also want to store pagination state like `fetchedPageCount` and `nextPageUrl`.

这里有几个重要的细节：

* 每个订阅主题信息分别存储以便于独立缓存。当用户在不同主题直接切换的时候，用户可以马上看到更新，并不需要每次刷新数据，只在我们需要的时候刷新即可。不要担心所有的数据存储的内存占用问题：除非你需要处理上万条数据，并且你的目标用户不关闭当前页面，否则你不要关心内存的清理问题。

* 对待每一个数据条目，需要分别存储加载指示器状态`isFetching`，数据状态`didInvalidate`，最新更新事件状态`lastUpdated`，和本身的数据`items`。在真实场景中，还需要存储分页相关状态`fetchedPageCount`和`nextPageUrl`等。

>##### 备注实体的嵌套（Note on Nested Entities）
>
>In this example, we store the received items together with the pagination information. However, this approach won't work well if you have nested entities referencing each other, or if you let the user edit items. Imagine the user wants to edit a fetched post, but this post is duplicated in several places in the state tree. This would be really painful to implement.
>
> 在这个例子中，接收到的数据根据分页信息存储。当出现实体嵌套或者用户编辑信息的时候，这样的数据组织方式并不友好。想象一下，用户要编辑一条获取到的博文，但这篇博文被复制在状态树的多个不同位置。这对代码实现来说会非常痛苦。
>
>If you have nested entities, or if you let users edit received entities, you should keep them separately in the state as if it was a database. In pagination information, you would only refer to them by their IDs. This lets you always keep them up to date. The [real world example](https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md#real-world) shows this approach, together with [normalizr](https://github.com/paularmstrong/normalizr) to normalize the nested API responses. With this approach, your state might look like this:
>
> 如果存在实体嵌套，或者需要用户编辑接收到的实体，那么应该保持状态的存储符合基本的[数据库范式（编者按）](https://zh.wikipedia.org/wiki/数据库规范化)。在分页中仅仅通过ID来关联。这样，数据将保持同步更新。在[real world example](https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md#real-world)示例中，通过[normalizr](https://github.com/paularmstrong/normalizr)将数据格式化。根据这个建议，状态的组织结构看起来如下所示：
>
>```js
> {
>   selectedSubreddit: 'frontend',
>   entities: {
>     users: {
>       2: {
>         id: 2,
>         name: 'Andrew'
>       }
>     },
>     posts: {
>       42: {
>         id: 42,
>         title: 'Confusion about Flux and Relay',
>         author: 2
>       },
>       100: {
>         id: 100,
>         title: 'Creating a Simple Application Using React JS and Flux Architecture',
>         author: 2
>       }
>     }
>   },
>   postsBySubreddit: {
>     frontend: {
>       isFetching: true,
>       didInvalidate: false,
>       items: []
>     },
>     reactjs: {
>       isFetching: false,
>       didInvalidate: false,
>       lastUpdated: 1439478405547,
>       items: [ 42, 100 ]
>     }
>   }
> }
>```
>
>In this guide, we won't normalize entities, but it's something you should consider for a more dynamic application.
>
> 在本教程中，不会使用实体的格式化，但在大多数动态应用中，需要注意这个细节。

## Action处理（Handling Actions）

Before going into the details of dispatching actions together with network requests, we will write the reducers for the actions we defined above.

在进行网络请求和Action派发之前，下面需要先进行Reducer的定义。

>##### 备注Reducer的组合（Note on Reducer Composition）
>
> Here, we assume that you understand reducer composition with [`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md), as described in the [Splitting Reducers](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#splitting-reducers) section on the [basics guide](https://github.com/reactjs/redux/blob/master/docs/basics/README.md). If you don't, please [read it first](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#splitting-reducers).
>
> 继续编码之前，假设你已经理解[`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md)，在[基础教程](https://github.com/reactjs/redux/blob/master/docs/basics/README.md)的[Reducers拆分](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#splitting-reducers)小节中详细讲解过。如果你还不了解这个知识点，需要[首先学习](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#splitting-reducers)一下。

#### `reducers.js`

```js
import { combineReducers } from 'redux'
import {
  SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT,
  REQUEST_POSTS, RECEIVE_POSTS
} from '../actions'

function selectedSubreddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_SUBREDDIT:
      return action.subreddit
    default:
      return state
  }
}

function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function postsBySubreddit(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.subreddit]: posts(state[action.subreddit], action)
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsBySubreddit,
  selectedSubreddit
})

export default rootReducer
```

In this code, there are two interesting parts:

这段代码中，有两个需要注意的细节：

* We use ES6 computed property syntax so we can update `state[action.subreddit]` with `Object.assign()` in a concise way. This:

  在`Object.assign()`中使用ES6的计算属性语法更新`state[action.subreddit]`，让代码更简洁：

  ```js
  return Object.assign({}, state, {
    [action.subreddit]: posts(state[action.subreddit], action)
  })
  ```
  is equivalent to this:

  等效于：

  ```js
  let nextState = {}
  nextState[action.subreddit] = posts(state[action.subreddit], action)
  return Object.assign({}, state, nextState)
  ```
* We extracted `posts(state, action)` that manages the state of a specific post list. This is just [reducer composition](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#splitting-reducers)! It is our choice how to split the reducer into smaller reducers, and in this case, we're delegating updating items inside an object to a `posts` reducer. The [real world example](https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md#real-world) goes even further, showing how to create a reducer factory for parameterized pagination reducers.

  抽象出`posts(state, action)`方法来管理指定的发布列表状态。这也是[Reducer组合](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#splitting-reducers)的一部分！可以根据我们的选择，将Reducer拆分为更小的Reducer，在这个例子中，将列表的更新委托给`posts`Reducer。在[real world example](https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md#real-world)的代码中，使用了参数化Reducer工厂的方式。

Remember that reducers are just functions, so you can use functional composition and higher-order functions as much as you feel comfortable.

Reducer只是一个方法而已，可以将方法任意组合或使用高阶方法，开心就好。

## 异步Action Creator（Async Action Creators）

Finally, how do we use the synchronous action creators we [defined earlier](#synchronous-action-creators) together with network requests? The standard way to do it with Redux is to use the [Redux Thunk middleware](https://github.com/gaearon/redux-thunk). It comes in a separate package called `redux-thunk`. We'll explain how middleware works in general [later](https://github.com/reactjs/redux/blob/master/docs/advanced/Middleware.md); for now, there is just one important thing you need to know: by using this specific middleware, an action creator can return a function instead of an action object. This way, the action creator becomes a [thunk](https://en.wikipedia.org/wiki/Thunk).

但是最终，应该如何在网络请求中使用[之前定义](#synchronous-action-creators)的同步版本的Action Creator呢？Redux中标准的做法是使用[Redux Thunk中间件](https://github.com/gaearon/redux-thunk)。这个中间件被拆分为一个单独的`redux-thunk`项目。[后面的章节](https://github.com/reactjs/redux/blob/master/docs/advanced/Middleware.md)中我们会简介中间件的感念和使用；目前需要了解的重点是：通过使用这个中间件，Action Creator返回的是一个函数，而不是原来的Action对象。这样来看，Action Creator就变为了一个[thunk](https://en.wikipedia.org/wiki/Thunk)（编者按：[阮一峰老师的解释](http://www.ruanyifeng.com/blog/2015/05/thunk.html)）。

When an action creator returns a function, that function will get executed by the Redux Thunk middleware. This function doesn't need to be pure; it is thus allowed to have side effects, including executing asynchronous API calls. The function can also dispatch actions—like those synchronous actions we defined earlier.

Action Creator返回的函数，会在Redux Thunk中间件中执行。这个函数可以不是纯函数；可以执行一些具有副作用的操作，包括异步API的调用等。之前定义的同步Action可以在这个函数中派发。

We can still define these special thunk action creators inside our `actions.js` file:

特殊的Thunk Action Creator也可以定义在`actions.js`文件中：

#### `actions.js`

```js
import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchPosts('reactjs'))

export function fetchPosts(subreddit) {

  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function (dispatch) {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestPosts(subreddit))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(
        response => response.json(),
        
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => console.log('An error occured.', error)
      )
      .then(json =>

        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receivePosts(subreddit, json))
      )
  }
}
```

>##### 备注`fetch`（Note on `fetch`）
>
>We use [`fetch` API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) in the examples. It is a new API for making network requests that replaces `XMLHttpRequest` for most common needs. Because most browsers don't yet support it natively, we suggest that you use [`isomorphic-fetch`](https://github.com/matthew-andrews/isomorphic-fetch) library:
>
> 上面的代码中使用了[`fetch` API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API)。用来替代`XMLHttpRequest`的使用。目前大多数浏览器还不原生支持，建议使用[`isomorphic-fetch`](https://github.com/matthew-andrews/isomorphic-fetch)库来替代：
>
>```js
// Do this in every file where you use `fetch`
>import fetch from 'isomorphic-fetch'
>```
>
>Internally, it uses [`whatwg-fetch` polyfill](https://github.com/github/fetch) on the client, and [`node-fetch`](https://github.com/bitinn/node-fetch) on the server, so you won't need to change API calls if you change your app to be [universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9).
>
> 在`isomorphic-fetch`内部，客户端会调用[`whatwg-fetch` polyfill](https://github.com/github/fetch)，服务器端则调用[`node-fetch`](https://github.com/bitinn/node-fetch)，在[通用应用中](https://medium.com/@mjackson/universal-javascript-4761051b7ae9)可以共用代码。
>
>Be aware that any `fetch` polyfill assumes a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) polyfill is already present. The easiest way to ensure you have a Promise polyfill is to enable Babel's ES6 polyfill in your entry point before any other code runs:
>
> 需要注意的是任何`fetch`垫片，假设[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)垫片已经存在。最简单的启用Promise垫片的方法是在入口文件的所有代码之前引入下面代码：
>
>```js
>// Do this once before any other code in your app
>import 'babel-polyfill'
>```

How do we include the Redux Thunk middleware in the dispatch mechanism? We use the [`applyMiddleware()`](https://github.com/reactjs/redux/blob/master/docs/api/applyMiddleware.md) store enhancer from Redux, as shown below:

如何将Redux Thunk中间件引入进来呢？可以在Redux中使用[`applyMiddleware()`](https://github.com/reactjs/redux/blob/master/docs/api/applyMiddleware.md)来增强Store对象，如下所示：

#### `index.js`

```js
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { selectSubreddit, fetchPosts } from './actions'
import rootReducer from './reducers'

const loggerMiddleware = createLogger()

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

store.dispatch(selectSubreddit('reactjs'))
store.dispatch(fetchPosts('reactjs')).then(() =>
  console.log(store.getState())
)
```

The nice thing about thunks is that they can dispatch results of each other:

Thunks的结果可以完美的在彼此中派发：

#### `actions.js`

```js
import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

function fetchPosts(subreddit) {
  return dispatch => {
    dispatch(requestPosts(subreddit))
    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(subreddit, json)))
  }
}

function shouldFetchPosts(state, subreddit) {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

export function fetchPostsIfNeeded(subreddit) {

  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchPosts(subreddit))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}
```

This lets us write more sophisticated async control flow gradually, while the consuming code can stay pretty much the same:

在此基础上可以构建更复杂的异步控制流，涉及到的原业务代码不用更改：

#### `index.js`

```js
store.dispatch(fetchPostsIfNeeded('reactjs')).then(() =>
  console.log(store.getState())
)
```

>##### 备注服务器端渲染（Note about Server Rendering）
>
>Async action creators are especially convenient for server rendering. You can create a store, dispatch a single async action creator that dispatches other async action creators to fetch data for a whole section of your app, and only render after the Promise it returns, completes. Then your store will already be hydrated with the state you need before rendering.
>
> 异步Action Creator也便于在服务器端渲染。创建一个Store单例，派发一个简单的异步Action Creator来获取应用需要的数据，完全返回数据后进行渲染输出即可。然后将服务器端的Store合并到客户端Store中。

[Thunk middleware](https://github.com/gaearon/redux-thunk) isn't the only way to orchestrate asynchronous actions in Redux:

- You can use [redux-promise](https://github.com/acdlite/redux-promise) or [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware) to dispatch Promises instead of functions.
- You can use [redux-observable](https://github.com/redux-observable/redux-observable) to dispatch Observables.
- You can use the [redux-saga](https://github.com/yelouafi/redux-saga/) middleware to build more complex asynchronous actions.
- You can use the [redux-pack](https://github.com/lelandrichardson/redux-pack) middleware to dispatch promise-based asynchronous actions.
- You can even write a custom middleware to describe calls to your API, like the [real world example](https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md#real-world) does.

It is up to you to try a few options, choose a convention you like, and follow it, whether with, or without the middleware.

除[Thunk中间件](https://github.com/gaearon/redux-thunk)之外还有其他方式可以用来处理相同的工作：

- 可以使用[redux-promise](https://github.com/acdlite/redux-promise)或[redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware)来返回Promise以代替函数；
- 可以使用[redux-observable](https://github.com/redux-observable/redux-observable)派发可观察对象；
- 可以使用[redux-saga](https://github.com/yelouafi/redux-saga/)中间件来构建更复杂的异步Action；
- 可以使用[redux-pack](https://github.com/lelandrichardson/redux-pack)中间件来派发一个基于Promise的异步Action；
- 也可以像[real world example](https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md#real-world)示例中那样自定义一个中间件来描述API调用。

选择一个你喜欢的方案，无论是不是中间件，遵循其约定和规范。

## 和UI连接（Connecting to UI）

Dispatching async actions is no different from dispatching synchronous actions, so we won't discuss this in detail. See [Usage with React](https://github.com/reactjs/redux/blob/master/docs/basics/UsageWithReact.md) for an introduction into using Redux from React components. See [Example: Reddit API](https://github.com/reactjs/redux/blob/master/docs/advanced/ExampleRedditAPI.md) for the complete source code discussed in this example.

派发异步Action和同步Action没有任何区别，在这里不再进行讨论。可以从[和React一起使用](https://github.com/reactjs/redux/blob/master/docs/basics/UsageWithReact.md)中学习如何在React组件中使用Redux。查看[示例：Reddit API](https://github.com/reactjs/redux/blob/master/docs/advanced/ExampleRedditAPI.md)的全部源码。

## 下一步（Next Steps）

Read [Async Flow](https://github.com/reactjs/redux/blob/master/docs/advanced/AsyncFlow.md) to recap how async actions fit into the Redux flow.

学习[异步流](https://github.com/reactjs/redux/blob/master/docs/advanced/AsyncFlow.md)，将其整合到Redux流中。
