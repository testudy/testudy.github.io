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

选择哪种Action的形式取决于你，但在团队内部应该有一个统一的约定。多个类型在使用中会带来可能的错误，但如果使用[redux-actions](https://github.com/acdlite/redux-actions)之类的帮助库来生成Action Creator和Reducer可以在一定程度上避免这个问题。

Whatever convention you choose, stick with it throughout the application.  
We'll use separate types in this tutorial.

无论选择哪种类型，在同一个应用中要保持一致，下面的教程中会使用单独的Action类型。

## 异步Action Creator（Synchronous Action Creators）

Let's start by defining the several synchronous action types and action creators we need in our example app. Here, the user can select a subreddit to display:

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

When it's time to fetch the posts for some subreddit, we will dispatch a `REQUEST_POSTS` action:

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

Finally, when the network request comes through, we will dispatch `RECEIVE_POSTS`:

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

>##### Note on Error Handling

>In a real app, you'd also want to dispatch an action on request failure. We won't implement error handling in this tutorial, but the [real world example](https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md#real-world) shows one of the possible approaches.

## Designing the State Shape

Just like in the basic tutorial, you'll need to [design the shape of your application's state](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#designing-the-state-shape) before rushing into the implementation. With asynchronous code, there is more state to take care of, so we need to think it through.

This part is often confusing to beginners, because it is not immediately clear what information describes the state of an asynchronous application, and how to organize it in a single tree.

We'll start with the most common use case: lists. Web applications often show lists of things. For example, a list of posts, or a list of friends. You'll need to figure out what sorts of lists your app can show. You want to store them separately in the state, because this way you can cache them and only fetch again if necessary.

Here's what the state shape for our “Reddit headlines” app might look like:

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

>##### Note on Nested Entities

>In this example, we store the received items together with the pagination information. However, this approach won't work well if you have nested entities referencing each other, or if you let the user edit items. Imagine the user wants to edit a fetched post, but this post is duplicated in several places in the state tree. This would be really painful to implement.

>If you have nested entities, or if you let users edit received entities, you should keep them separately in the state as if it was a database. In pagination information, you would only refer to them by their IDs. This lets you always keep them up to date. The [real world example](https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md#real-world) shows this approach, together with [normalizr](https://github.com/paularmstrong/normalizr) to normalize the nested API responses. With this approach, your state might look like this:

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

>In this guide, we won't normalize entities, but it's something you should consider for a more dynamic application.

## Handling Actions

Before going into the details of dispatching actions together with network requests, we will write the reducers for the actions we defined above.

>##### Note on Reducer Composition

> Here, we assume that you understand reducer composition with [`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md), as described in the [Splitting Reducers](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#splitting-reducers) section on the [basics guide](https://github.com/reactjs/redux/blob/master/docs/basics/README.md). If you don't, please [read it first](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#splitting-reducers).

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

* We use ES6 computed property syntax so we can update `state[action.subreddit]` with `Object.assign()` in a concise way. This:

  ```js
  return Object.assign({}, state, {
    [action.subreddit]: posts(state[action.subreddit], action)
  })
  ```
  is equivalent to this:

  ```js
  let nextState = {}
  nextState[action.subreddit] = posts(state[action.subreddit], action)
  return Object.assign({}, state, nextState)
  ```
* We extracted `posts(state, action)` that manages the state of a specific post list. This is just [reducer composition](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#splitting-reducers)! It is our choice how to split the reducer into smaller reducers, and in this case, we're delegating updating items inside an object to a `posts` reducer. The [real world example](https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md#real-world) goes even further, showing how to create a reducer factory for parameterized pagination reducers.

Remember that reducers are just functions, so you can use functional composition and higher-order functions as much as you feel comfortable.

## Async Action Creators

Finally, how do we use the synchronous action creators we [defined earlier](#synchronous-action-creators) together with network requests? The standard way to do it with Redux is to use the [Redux Thunk middleware](https://github.com/gaearon/redux-thunk). It comes in a separate package called `redux-thunk`. We'll explain how middleware works in general [later](Middleware.md); for now, there is just one important thing you need to know: by using this specific middleware, an action creator can return a function instead of an action object. This way, the action creator becomes a [thunk](https://en.wikipedia.org/wiki/Thunk).

When an action creator returns a function, that function will get executed by the Redux Thunk middleware. This function doesn't need to be pure; it is thus allowed to have side effects, including executing asynchronous API calls. The function can also dispatch actions—like those synchronous actions we defined earlier.

We can still define these special thunk action creators inside our `actions.js` file:

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

>##### Note on `fetch`

>We use [`fetch` API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) in the examples. It is a new API for making network requests that replaces `XMLHttpRequest` for most common needs. Because most browsers don't yet support it natively, we suggest that you use [`isomorphic-fetch`](https://github.com/matthew-andrews/isomorphic-fetch) library:

>```js
// Do this in every file where you use `fetch`
>import fetch from 'isomorphic-fetch'
>```

>Internally, it uses [`whatwg-fetch` polyfill](https://github.com/github/fetch) on the client, and [`node-fetch`](https://github.com/bitinn/node-fetch) on the server, so you won't need to change API calls if you change your app to be [universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9).

>Be aware that any `fetch` polyfill assumes a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) polyfill is already present. The easiest way to ensure you have a Promise polyfill is to enable Babel's ES6 polyfill in your entry point before any other code runs:

>```js
>// Do this once before any other code in your app
>import 'babel-polyfill'
>```

How do we include the Redux Thunk middleware in the dispatch mechanism? We use the [`applyMiddleware()`](https://github.com/reactjs/redux/blob/master/docs/api/applyMiddleware.md) store enhancer from Redux, as shown below:

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

#### `index.js`

```js
store.dispatch(fetchPostsIfNeeded('reactjs')).then(() =>
  console.log(store.getState())
)
```

>##### Note about Server Rendering

>Async action creators are especially convenient for server rendering. You can create a store, dispatch a single async action creator that dispatches other async action creators to fetch data for a whole section of your app, and only render after the Promise it returns, completes. Then your store will already be hydrated with the state you need before rendering.

[Thunk middleware](https://github.com/gaearon/redux-thunk) isn't the only way to orchestrate asynchronous actions in Redux:
- You can use [redux-promise](https://github.com/acdlite/redux-promise) or [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware) to dispatch Promises instead of functions.
- You can use [redux-observable](https://github.com/redux-observable/redux-observable) to dispatch Observables.
- You can use the [redux-saga](https://github.com/yelouafi/redux-saga/) middleware to build more complex asynchronous actions.
- You can use the [redux-pack](https://github.com/lelandrichardson/redux-pack) middleware to dispatch promise-based asynchronous actions.
- You can even write a custom middleware to describe calls to your API, like the [real world example](https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md#real-world) does.

It is up to you to try a few options, choose a convention you like, and follow it, whether with, or without the middleware.

## Connecting to UI

Dispatching async actions is no different from dispatching synchronous actions, so we won't discuss this in detail. See [Usage with React](https://github.com/reactjs/redux/blob/master/docs/basics/UsageWithReact.md) for an introduction into using Redux from React components. See [Example: Reddit API](ExampleRedditAPI.md) for the complete source code discussed in this example.

## Next Steps

Read [Async Flow](AsyncFlow.md) to recap how async actions fit into the Redux flow.
