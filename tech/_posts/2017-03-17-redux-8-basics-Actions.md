---
layout: post
title: Redux 8 - 基础：Action
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/docs/basics/Actions.md)

First, let's define some actions.

首先，对Action做如下一些定义。

**Actions** are payloads of information that send data from your application to your store. They are the *only* source of information for the store. You send them to the store using [`store.dispatch()`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch).

**Action**是应用发送到Store中数据的信息载体，也是Store中数据的*唯一*来源。使用[`store.dispatch()`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch)方法可以将他们发送到Store中。

Here's an example action which represents adding a new todo item:

下面这个Action示例表示添加一个新的Todo项：

```js
const ADD_TODO = 'ADD_TODO'
```

```js
{
  type: ADD_TODO,
  text: 'Build my first Redux app'
}
```

Actions are plain JavaScript objects. Actions must have a `type` property that indicates the type of action being performed. Types should typically be defined as string constants. Once your app is large enough, you may want to move them into a separate module.

Action只是一个简单的JavaScript对象，其必须包含一个表示正在发生行为类型的`type`属性。Type属性通常被定义为一个字符串常量。当程序足够大的时候，可能需要将所有的类型定义迁移到一个单独的文件中。

```js
import { ADD_TODO, REMOVE_TODO } from '../actionTypes'
```

>##### 关于模板代码的建议（Note on Boilerplate）

>You don't have to define action type constants in a separate file, or even to define them at all. For a small project, it might be easier to just use string literals for action types. However, there are some benefits to explicitly declaring constants in larger codebases. Read [Reducing Boilerplate](https://github.com/reactjs/redux/blob/master/docs/recipes/ReducingBoilerplate.md) for more practical tips on keeping your codebase clean.
>
> 将Action类型常量定义在一个单独的文件中并不是必须的，甚至根本不需要将Action类型定义出来。在一个小项目中，直接使用字符串字面量是更简单的做法。但是在一个复杂的项目中将这些变量显式的定义出来就有优势了。阅读[减少模板代码](https://github.com/reactjs/redux/blob/master/docs/recipes/ReducingBoilerplate.md)获取更多的实践技巧以保持代码的简洁。

Other than `type`, the structure of an action object is really up to you. If you're interested, check out [Flux Standard Action](https://github.com/acdlite/flux-standard-action) for recommendations on how actions could be constructed.

Action对象结构中`type`之外部分取决于你。如果有兴趣，可以参考[Flux Standard Action](https://github.com/acdlite/flux-standard-action)来构建Action对象。

We'll add one more action type to describe a user ticking off a todo as completed. We refer to a particular todo by `index` because we store them in an array. In a real app, it is wiser to generate a unique ID every time something new is created.

接下来再创建一个表示用户点选完成Todo的Action类型。由于所有Todo存储在一个数组中，可以通过`index`来指向一个具体的Todo。在真实的应用场景中，我们需要在新条目创建的时候构建适应范围更广的唯一ID。

```js
{
  type: TOGGLE_TODO,
  index: 5
}
```

It's a good idea to pass as little data in each action as possible. For example, it's better to pass `index` than the whole todo object.

最好在每个Action中传递尽可能少的数据，例如，传递一个单独的`index`要优于传递整个Todo对象。

Finally, we'll add one more action type for changing the currently visible todos.

最后，再添加一个用来更改当前Todo显示状态的Action类型。

```js
{
  type: SET_VISIBILITY_FILTER,
  filter: SHOW_COMPLETED
}
```

## Action Creators

**Action creators** are exactly that—functions that create actions. It's easy to conflate the terms “action” and “action creator,” so do your best to use the proper term.

**Action Creator**是用来创建Action对象。概念上“Action”和“Action Creator”非常容易混淆，使用这两个术语时要注意区分两者概念上的差别。

In Redux action creators simply return an action:

在Redux中，Action Creator仅仅返回一个Action：

```js
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
```

This makes them portable and easy to test.

这使得他们易于移植，并且易于测试。

In [traditional Flux](http://facebook.github.io/flux), action creators often trigger a dispatch when invoked, like so:

在[正宗的Flux](http://facebook.github.io/flux)中，Action Creator在调用的时候常常会同时触发一个事件派发，就像下面这样：

```js
function addTodoWithDispatch(text) {
  const action = {
    type: ADD_TODO,
    text
  }
  dispatch(action)
}
```

In Redux this is *not* the case.  
Instead, to actually initiate a dispatch, pass the result to the `dispatch()` function:

在Redux中*不是*这样的。  
需要将Action Creator的执行结果显式的传入到`dispatch()`方法中：

```js
dispatch(addTodo(text))
dispatch(completeTodo(index))
```

Alternatively, you can create a **bound action creator** that automatically dispatches:

或者，创建一个**绑定Action Creator**以自动派发事件：

```js
const boundAddTodo = (text) => dispatch(addTodo(text))
const boundCompleteTodo = (index) => dispatch(completeTodo(index))
```

Now you'll be able to call them directly:

这样就可以直接调用他们了：

```
boundAddTodo(text)
boundCompleteTodo(index)
```

The `dispatch()` function can be accessed directly from the store as [`store.dispatch()`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch), but more likely you'll access it using a helper like [react-redux](http://github.com/gaearon/react-redux)'s `connect()`. You can use [`bindActionCreators()`](https://github.com/reactjs/redux/blob/master/docs/api/bindActionCreators.md) to automatically bind many action creators to a `dispatch()` function.

可以通过[`store.dispatch()`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch)直接访问`dispatch()`方法，但更方便的是使用帮助方法，如[react-redux](http://github.com/gaearon/react-redux)中的`connect()`方法。使用[`bindActionCreators()`](https://github.com/reactjs/redux/blob/master/docs/api/bindActionCreators.md)将多个Action Creator绑定到`dispatch()`方法。

Action creators can also be asynchronous and have side-effects. You can read about [async actions](https://github.com/reactjs/redux/blob/master/docs/advanced/AsyncActions.md) in the [advanced tutorial](https://github.com/reactjs/redux/blob/master/docs/advanced/README.md) to learn how to handle AJAX responses and compose action creators into async control flow. Don't skip ahead to async actions until you've completed the basics tutorial, as it covers other important concepts that are prerequisite for the advanced tutorial and async actions.

Action Creator也可以使用在异步处理中，阅读[进阶教程](https://github.com/reactjs/redux/blob/master/docs/advanced/README.md)中的[async actions](https://github.com/reactjs/redux/blob/master/docs/advanced/AsyncActions.md)学习如何处理Ajax响应，以及如何将Action Creator组合到异步流程中。但是在完全掌握这里的基础部分之前，千万不要直接跳到异步Action章节，这里的基础部分涵盖了很多进阶教程和异步Action中的重要概念。

## 源代码（Source Code）

### `actions.js`

```js
/*
 * action types
 */

export const ADD_TODO = 'ADD_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

/*
 * other constants
 */

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

/*
 * action creators
 */

export function addTodo(text) {
  return { type: ADD_TODO, text }
}

export function toggleTodo(index) {
  return { type: TOGGLE_TODO, index }
}

export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter }
}
```

## 下一步（Next Steps）

Now let's [define some reducers](Reducers.md) to specify how the state updates when you dispatch these actions!

接下来要[定义一些Reducer](Reducers.md)用来具体说明当派发这些Action的时候如何处理状态更新。

