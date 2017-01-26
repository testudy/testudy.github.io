---
layout: post
title: Redux 4 - 入门：三大原则（Three Principles）
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/docs/introduction/ThreePrinciples.md)

Redux can be described in three fundamental principles:

Redux可以用3个基本原则来描述：

### 单一数据源原则（Single source of truth）

**The [state](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#state) of your whole application is stored in an object tree within a single [store](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#store).**

**应用的整个[状态](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#state)存储在单例[store](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#store)的对象树中。**

This makes it easy to create universal apps, as the state from your server can be serialized and hydrated into the client with no extra coding effort. A single state tree also makes it easier to debug or introspect an application; it also enables you to persist your app's state in development, for a faster development cycle. Some functionality which has been traditionally difficult to implement - Undo/Redo, for example - can suddenly become trivial to implement, if all of your state is stored in a single tree.

在此基础上非常便于创建通用应用，不需要经过特殊的处理，直接将服务端的状态序列化后混合到客户端状态中即可。单例的状态树使得程序理解和调试都变得非常简单，可以在开发过程中针对某个时刻的状态反复调试，促进开发的节奏。将一个应用中所有的状态都存储在一个单例树上之后，一些在传统开发模式中难以实现的功能——比如回退/前进——突然变得简单起来。

```js
console.log(store.getState())

/* Prints
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
*/
```

### 状态只读（State is read-only）

**The only way to change the state is to emit an [action](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#action), an object describing what happened.**

**改变状态树的唯一方式是通过派发[action](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#action)——一个用来描述发生情况的对象**

This ensures that neither the views nor the network callbacks will ever write directly to the state. Instead, they express an intent to transform the state. Because all changes are centralized and happen one by one in a strict order, there are no subtle race conditions to watch out for. As actions are just plain objects, they can be logged, serialized, stored, and later replayed for debugging or testing purposes.

这确保了无论是用户输入还是网络响应等交互都不能直接修改应用状态。只能通过明确的传递一个Action来表达状态修改的意图。并且所有状态修改的操作均严格按照发生的顺序集中处理，不存在其他遗漏的情况。Action就是普通对象，可以用来记录日志，序列化，存储，也可以用来重现测试或调试Bug。

```js
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})
```

### 纯函数更改（Changes are made with pure functions）

**To specify how the state tree is transformed by actions, you write pure [reducers](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#reducer).**

**被称作[Reducer](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#reducer)的纯函数专门用来响应Action修改状态树。**

Reducers are just pure functions that take the previous state and an action, and return the next state. Remember to return new state objects, instead of mutating the previous state. You can start with a single reducer, and as your app grows, split it off into smaller reducers that manage specific parts of the state tree. Because reducers are just functions, you can control the order in which they are called, pass additional data, or even make reusable reducers for common tasks such as pagination.

Reducer是纯函数，接收当前状态和一个Action，并返回修改后的状态。切记是返回一个全新的状态对象，千万避免修改当前状态。创建应用可以从一个单独的Reducer开始，随着应用规模的增长，将其拆分为更小的Reducer用来分别处理状态树的各个部分。Reducer只是函数而已，可以在代码中根据需求控制其调用，传递额外的数据，也可以针对分页之类的常见任务抽象出可重用的Reducer。

```js

function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}

import { combineReducers, createStore } from 'redux'
let reducer = combineReducers({ visibilityFilter, todos })
let store = createStore(reducer)
```

That's it! Now you know what Redux is all about.

至此，你应该知道Redux是什么了。
