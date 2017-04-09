---
layout: post
title: Redux 11 - 基础：数据流（Data Flow）
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/docs/basics/DataFlow.md)

Redux architecture revolves around a **strict unidirectional data flow**.

Redux架构基于**严格的单向数据流**。

This means that all data in an application follows the same lifecycle pattern, making the logic of your app more predictable and easier to understand. It also encourages data normalization, so that you don't end up with multiple, independent copies of the same data that are unaware of one another.

这意味着应用程序中的所有数据都遵循相同的生命周期，使得应用的逻辑便于预测和易于理解。同时鼓励数据的规范化，以避免应用程序中存在同一份数据的不同副本而造成的数据差异。

If you're still not convinced, read [Motivation](https://github.com/reactjs/redux/blob/master/docs/introduction/Motivation.md) and [The Case for Flux](https://medium.com/@dan_abramov/the-case-for-flux-379b7d1982c6) for a compelling argument in favor of unidirectional data flow. Although [Redux is not exactly Flux](https://github.com/reactjs/redux/blob/master/docs/introduction/PriorArt.md), it shares the same key benefits.

如果对此存在疑虑，可以阅读[动机](/tech/2017/01/19/redux-2-introduction-Motivation.html)和[The Case for Flux](https://medium.com/@dan_abramov/the-case-for-flux-379b7d1982c6)更多的理解使用单向数据流的意义。虽然[Redux不是严格意义上的Flux](/tech/2017/02/24/redux-5-introduction-PriorArt.html)，但两者拥有相同的优势。

The data lifecycle in any Redux app follows these 4 steps:

Redux应用程序中所有数据的生命周期都遵循以下4步：

1.  **You call** [`store.dispatch(action)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch).

    **调用** [`store.dispatch(action)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch).

    An [action](https://github.com/reactjs/redux/blob/master/docs/basics/Actions.md) is a plain object describing *what happened*. For example:

    [Action](/tech/2017/03/17/redux-8-basics-Actions.html)是一个描述*发生情况*的简单对象，如下所示：

    ```js
    { type: 'LIKE_ARTICLE', articleId: 42 }
    { type: 'FETCH_USER_SUCCESS', response: { id: 3, name: 'Mary' } }
    { type: 'ADD_TODO', text: 'Read the Redux docs.' }
    ```

    Think of an action as a very brief snippet of news. “Mary liked article 42.” or “‘Read the Redux docs.' was added to the list of todos.”

    Action可以看做是一个简短的信息描述。“Mary liked article 42.”或者“在Todo列表中添加'Read the Redux docs.'。

    You can call [`store.dispatch(action)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch) from anywhere in your app, including components and XHR callbacks, or even at scheduled intervals.

    可以在应用中的任何地方调用[`store.dispatch(action)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#dispatch)，包括组件、XHR请求回调，或者计划任务中。

2.  **The Redux store calls the reducer function you gave it.**

    ** Redux的Store对象调用指定的Reducer。**

    The [store](https://github.com/reactjs/redux/blob/master/basics/Store.md) will pass two arguments to the [reducer](https://github.com/reactjs/redux/blob/master/basics/Reducers.md): the current state tree and the action. For example, in the todo app, the root reducer might receive something like this:

    [Store](/tech/2017/04/08/redux-10-basics-Store.html)传递给[Reducer](/tech/2017/04/07/redux-9-basics-Reducers.html)：当前的状态树和Action。在Todo应用中，主Reducer的接收到的参数类似下面的演示：

    ```js
    // The current application state (list of todos and chosen filter)
    let previousState = {
        visibleTodoFilter: 'SHOW_ALL',
        todos: [ 
            {
                text: 'Read the docs.',
                complete: false
            }
        ]
    }

    // The action being performed (adding a todo)
    let action = {
        type: 'ADD_TODO',
        text: 'Understand the flow.'
    }

    // Your reducer returns the next application state
    let nextState = todoApp(previousState, action)
    ```

    Note that a reducer is a pure function. It only *computes* the next state. It should be completely predictable: calling it with the same inputs many times should produce the same outputs. It shouldn't perform any side effects like API calls or router transitions. These should happen before an action is dispatched.

    注意Reducer是一个纯函数。其仅仅*计算*下一个状态。它的行为是完全可预测的：多次调用中，只要输入参数相同就会返回相同的输出结果。其不应该产生API调用或者路由切换等任何副作用。这些调用应该在Action派发前发生。

3.  **The root reducer may combine the output of multiple reducers into a single state tree.**

    **主Reducer会将多个子Reducer的返回值合并到一个状态树对象中。**

    How you structure the root reducer is completely up to you. Redux ships with a [`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md) helper function, useful for “splitting” the root reducer into separate functions that each manage one branch of the state tree.

    可以自由组织主Reducer的结构。Redux提供了一个[`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md)帮助方法，用来将主Reducer“拆分”到多个子分支Reducer中。

    Here's how [`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md) works. Let's say you have two reducers, one for a list of todos, and another for the currently selected filter setting:

    接下来演示一下[`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md)是如何工作的。假设你有两个Reducer，一个用来管理Todo列表，另一个用来管理当前选中的过滤设置：

    ```js
    function todos(state = [], action) {
        // Somehow calculate it...
        return nextState
    }

    function visibleTodoFilter(state = 'SHOW_ALL', action) {
        // Somehow calculate it...
        return nextState
    }

    let todoApp = combineReducers({
        todos,
        visibleTodoFilter
    })
    ```

    When you emit an action, `todoApp` returned by `combineReducers` will call both reducers:

    当派发一个Action时，`combineReducers`返回的`todoApp`将调用所有的子Reducer：

    ```js
    let nextTodos = todos(state.todos, action)
    let nextVisibleTodoFilter = visibleTodoFilter(state.visibleTodoFilter, action)
    ```

    It will then combine both sets of results into a single state tree:

    然后将所有的执行结果集合到一个单独的状态对象树中：

    ```js
    return {
        todos: nextTodos,
        visibleTodoFilter: nextVisibleTodoFilter
    }
    ```

    While [`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md) is a handy helper utility, you don't have to use it; feel free to write your own root reducer!

    虽然[`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md)是一个好用的帮助方法，但并不是必须使用它；根据感觉编写主Reducer，开心就好！

4.  **The Redux store saves the complete state tree returned by the root reducer.**

    **Redux Store将主Reducer返回的完整状态树保存。**

    This new tree is now the next state of your app! Every listener registered with [`store.subscribe(listener)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#subscribe) will now be invoked; listeners may call [`store.getState()`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#getState) to get the current state.

    这个新的状态树对象就是应用程序的下一个状态！随后调用所有通过[`store.subscribe(listener)`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#subscribe)注册的监听器；在监听器中通过调用[`store.getState()`](https://github.com/reactjs/redux/blob/master/docs/api/Store.md#getState)方法获取应用程序的当前最新状态。

    Now, the UI can be updated to reflect the new state. If you use bindings like [React Redux](https://github.com/gaearon/react-redux), this is the point at which `component.setState(newState)` is called.

    现在，可以将UI和最新状态同步。如果在使用[React Redux](https://github.com/gaearon/react-redux)之类的绑定库，此时会自动调用`component.setState(newState)`方法。

## 下一步（Next Steps）

Now that you know how Redux works, let's [connect it to a React app](https://github.com/reactjs/redux/blob/master/docs/basics/UsageWithReact.md).

现在已经理解了Redux的工作原理，接下来[将其和一个React应用链接起来](https://github.com/reactjs/redux/blob/master/docs/basics/UsageWithReact.md)。

>##### 提醒高级用户（Note for Advanced Users）
>If you're already familiar with the basic concepts and have previously completed this tutorial, don't forget to check out [async flow](https://github.com/reactjs/redux/blob/master/docs/advanced/AsyncFlow.md) in the [advanced tutorial](https://github.com/reactjs/redux/blob/master/docs/advanced/README.md) to learn how middleware transforms [async actions](https://github.com/reactjs/redux/blob/master/docs/advanced/AsyncActions.md) before they reach the reducer.
>
>如果已经学会了所有的基础概念，并且完整的学习了之前的教程，记得学习[高级教程](https://github.com/reactjs/redux/blob/master/docs/advanced/README.md)中的[异步数据流](https://github.com/reactjs/redux/blob/master/docs/advanced/AsyncFlow.md)部分，学习如何使用中间件转化[异步Action](https://github.com/reactjs/redux/blob/master/docs/advanced/AsyncActions.md)供Reducer使用。
