---
layout: post
title: Redux 2 - 入门：核心概念（Core Concepts）
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/docs/introduction/CoreConcepts.md)

Redux itself is very simple.

Redux本身非常简单。

Imagine your app’s state is described as a plain object. For example, the state of a todo app might look like this:

试着用一个简单对象来描述应用的状态。例如，可以把Todo应用的状态如下描述：

```js
{
  todos: [{
    text: 'Eat food',
    completed: true
  }, {
    text: 'Exercise',
    completed: false
  }],
  visibilityFilter: 'SHOW_COMPLETED'
}
```

This object is like a “model” except that there are no setters. This is so that different parts of the code can’t change the state arbitrarily, causing hard-to-reproduce bugs.

这个对象看起来像“model”，但与“model”有一个重要的区别是禁止set操作。就是说在代码的不同部分不能随意更改状态——这种随意性往往会带来难以调试的bug。

To change something in the state, you need to dispatch an action. An action is a plain JavaScript object (notice how we don’t introduce any magic?) that describes what happened. Here are a few example actions:

如果要更改state需要派发一个Action。Action是一个用来描述应用变化情况的简单JavaScirpt对象（注意这里不存在任何魔术）。下面是几个Action的例子：

```js
{ type: 'ADD_TODO', text: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', index: 1 }
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
```

Enforcing that every change is described as an action lets us have a clear understanding of what’s going on in the app. If something changed, we know why it changed. Actions are like breadcrumbs of what has happened.
Finally, to tie state and actions together, we write a function called a reducer. Again, nothing magic about it—it’s just a function that takes state and action as arguments, and returns the next state of the app.
It would be hard to write such function for a big app, so we write smaller functions managing parts of the state:

强制规定将每一次变化都描述为一个Action对象，使得我们可以清晰的理解程序中发生变化的情况。对于这些变化，清晰的知道为什么变化。Action就像程序中发生变化情况的面包屑。
最后，再通过Reducer方法，将State和Action结合在一起。再次注意，这里不存在什么魔术事件，Reducer仅仅是一个普通方法，接收State和Action作为参数，并返回应用的下一个状态。
很难将一个庞大的应用状态都用一个方法来处理状态，可以将其拆分成若干个较小的方法组合来管理状态的各个部分：

```js
function visibilityFilter(state = 'SHOW_ALL', action) {
  if (action.type === 'SET_VISIBILITY_FILTER') {
    return action.filter;
  } else {
    return state;
  }
}

function todos(state = [], action) {
  switch (action.type) {
  case 'ADD_TODO':
    return state.concat([{ text: action.text, completed: false }]);
  case 'TOGGLE_TODO':
    return state.map((todo, index) =>
      action.index === index ?
        { text: todo.text, completed: !todo.completed } :
        todo
   )
  default:
    return state;
  }
}
```

And we write another reducer that manages the complete state of our app by calling those two reducers for the corresponding state keys:

最后编写一个单独的总Reducer，通过相关键（编者按：下例中和方法同名的键）来管理上述两个Reducer方法，以形成完整的应用状态：

```js
function todoApp(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  };
}
```

This is basically the whole idea of Redux. Note that we haven’t used any Redux APIs. It comes with a few utilities to facilitate this pattern, but the main idea is that you describe how your state is updated over time in response to action objects, and 90% of the code you write is just plain JavaScript, with no use of Redux itself, its APIs, or any magic.

至此基本上就把Redux的全部思想介绍完了。注意目前没有使用任何Redux的API。Redux的API只是用来帮助实现该思想模式的一组工具方法，编码的关键是如何将随着时间变化的响应的状态描述为Action对象，90%的工作都是在编写简单JavaScript对象，这不会涉及到Redux本身，也不会涉及到它的API，更没有什么魔法。
