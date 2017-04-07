---
layout: post
title: Redux 9 - 基础：Reducers
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md)

[Actions](/tech/2017/03/17/redux-8-basics-Actions.html) describe the fact that *something happened*, but don't specify how the application's state changes in response. This is the job of reducers.

[Action](/tech/2017/03/17/redux-8-basics-Actions.html)描述的是*发生了什么*事实，接下来由Reducer更新应用的状态。

## 涉及状态的形式（Designing the State Shape）

In Redux, all the application state is stored as a single object. It's a good idea to think of its shape before writing any code. What's the minimal representation of your app's state as an object?

在Redux中，应用程序的所有状态存储在一个对象单例中。在编码之前思考其表现形式是一个良好的工作习惯。Store对象所表示的应用程序状态的最小属性集合是什么呢？

For our todo app, we want to store two different things:

* The currently selected visibility filter;
* The actual list of todos.

You'll often find that you need to store some data, as well as some UI state, in the state tree. This is fine, but try to keep the data separate from the UI state.

在前面的Todo应用中，需要存储两个不同的状态：

* 当前可视过滤器的选中状态；
* 实际Todo列表。

在状态树中会同时存储数据和UI状态两种不同类型的值，尽量将这两者分离存储。

```js
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
```

>##### 需要注意实体之间的关系（Note on Relationships）

>In a more complex app, you're going to want different entities to reference each other. We suggest that you keep your state as normalized as possible, without any nesting. Keep every entity in an object stored with an ID as a key, and use IDs to reference it from other entities, or lists. Think of the app's state as a database. This approach is described in [normalizr's](https://github.com/paularmstrong/normalizr) documentation in detail. For example, keeping `todosById: { id -> todo }` and `todos: array<id>` inside the state would be a better idea in a real app, but we're keeping the example simple.
>
>在复杂的App中，会存在不同的实体相互引用。建议不要相互嵌套，尽量保持状态的规范化。在同一个对象用ID关联所有的实体，不同的实体中使用ID进行对象的引用，遵循数据库范式的约束。这种约束在[normalizr's](https://github.com/paularmstrong/normalizr)文档中有详细的描述。比如，在真实的App中状态中，用`todosById: { id -> todo }`和`todos: array<id>`这样的结构存储是一个更好的选择。在这里为了保持示例的简单性会适当违反前面的原则。

## Action处理（Handling Actions）

Now that we've decided what our state object looks like, we're ready to write a reducer for it. The reducer is a pure function that takes the previous state and an action, and returns the next state.

目前为止已经确定了State对象的格式，接下来会进行Reducer的编码。Reducer本质上就是一个纯函数，接收当前状态和一个Action作为参数，并返回更新后的最新状态。

```js
(previousState, action) => newState
```

It's called a reducer because it's the type of function you would pass to [`Array.prototype.reduce(reducer, ?initialValue)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce). It's very important that the reducer stays pure. Things you should **never** do inside a reducer:

* Mutate its arguments;
* Perform side effects like API calls and routing transitions;
* Call non-pure functions, e.g. `Date.now()` or `Math.random()`.

We'll explore how to perform side effects in the [advanced walkthrough](https://github.com/reactjs/redux/blob/master/docs/advanced/README.md). For now, just remember that the reducer must be pure. **Given the same arguments, it should calculate the next state and return it. No surprises. No side effects. No API calls. No mutations. Just a calculation.**

将这个函数叫做Reducer，来源于[`Array.prototype.reduce(reducer, ?initialValue)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)中的说法。将其保持纯函数的约束非常重要，下面这些事你*千万*不能做：

* 修改参数；
* 进行API调用或路由跳转这样有副作用的操作；
* 调用非纯函数，比如`Date.now()`或`Math.random()`等。

在[高级进阶](https://github.com/reactjs/redux/blob/master/docs/advanced/README.md)中会进行有副作用操作的讲解。但目前为止，只需要记住Reducer必须是纯函数。**输入相同的参数，仅仅计算最新状态并将其返回。没有意外。没有副作用。没有API调用。没有修改。只是纯计算。**

With this out of the way, let's start writing our reducer by gradually teaching it to understand the [actions](/tech/2017/03/17/redux-8-basics-Actions.html) we defined earlier.

在上面概念的基础上，开始逐步实现相关的Reducer，和之前定义的[Action](/tech/2017/03/17/redux-8-basics-Actions.html)逐步集成。

We'll start by specifying the initial state. Redux will call our reducer with an `undefined` state for the first time. This is our chance to return the initial state of our app:

首先指定状态的初始值。Redux首次调用Reducer时传入的是一个`undefined`参数，此时返回应用的初始状态值即可。

```js
import { VisibilityFilters } from './actions'

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
}

function todoApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }

  // For now, don't handle any actions
  // and just return the state given to us.
  return state
}
```

One neat trick is to use the [ES6 default arguments syntax](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/default_parameters) to write this in a more compact way:

可以使用[ES6的参数默认值语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Default_parameters)来让编码更紧凑：

```js
function todoApp(state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  return state
}
```

Now let's handle `SET_VISIBILITY_FILTER`. All it needs to do is to change `visibilityFilter` on the state. Easy:

现在来处理`SET_VISIBILITY_FILTER`状态。所做的工作只是改变状态上的`visibilityFilter`属性。如下所示：

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}
```

Note that:

1. **We don't mutate the `state`.** We create a copy with [`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign). `Object.assign(state, { visibilityFilter: action.filter })` is also wrong: it will mutate the first argument. You **must** supply an empty object as the first parameter. You can also enable the [object spread operator proposal](https://github.com/reactjs/redux/blob/master/docs/basics/UsingObjectSpreadOperator.md) to write `{ ...state, ...newState }` instead.

2. **We return the previous `state` in the `default` case.** It's important to return the previous `state` for any unknown action.

谨记：

1. **不要修改`state`。**上面的代码中使用[`Object.assign()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)创建了一个State副本。但`Object.assign(state, { visibilityFilter: action.filter })`是错误的写法：第一个参数被修改了。第一个参数**必须**是一个空对象。建议使用[对象展开操作符](https://github.com/reactjs/redux/blob/master/docs/basics/UsingObjectSpreadOperator.md)的写法`{ ...state, ...newState }`代替。

2. **`default`分支默认返回之前的`state`**。对于未知的Action返回之前的`state`。

>##### Note on `Object.assign`
>
>[`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) is a part of ES6, but is not implemented by most browsers yet. You'll need to either use a polyfill, a [Babel plugin](https://www.npmjs.com/package/babel-plugin-transform-object-assign), or a helper from another library like [`_.assign()`](https://lodash.com/docs#assign).

> ##### `Object.assign`说明
>
> [`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)是ES6规范的一部分，但目前一些浏览器尚未实现。可以使用一个Polyfill，比如[Babel plugin](https://www.npmjs.com/package/babel-plugin-transform-object-assign)，或者使用一个[`_.assign()`](https://lodash.com/docs#assign)之类的工具库。

>##### Note on `switch` and Boilerplate
>
>The `switch` statement is *not* the real boilerplate. The real boilerplate of Flux is conceptual: the need to emit an update, the need to register the Store with a Dispatcher, the need for the Store to be an object (and the complications that arise when you want a universal app). Redux solves these problems by using pure reducers instead of event emitters.
>
>It's unfortunate that many still choose a framework based on whether it uses `switch` statements in the documentation. If you don't like `switch`, you can use a custom `createReducer` function that accepts a handler map, as shown in [“reducing boilerplate”](https://github.com/reactjs/redux/blob/master/docs/recipes/ReducingBoilerplate.md#reducers).

> ##### `switch`和样板代码说明
>
> `switch`状态*不是*真正的样板代码，Flux中的样板代码偏概念性：需要派发一个更新，并在Store上注册一个Dispatcher，Store需要作为一个对象（以及在通用App中的并发处理）。Redux借住Reducer代替事件派发来解决这些难题。
>
> 不能根据是否使用`switch`来区分框架。如果不习惯`switch`，可以使用`createReducer`方法来映射状态的处理，参考[“减少样板代码”](https://github.com/reactjs/redux/blob/master/docs/recipes/ReducingBoilerplate.md#reducers)。

## 处理更多的Action（Handling More Actions）

We have two more actions to handle! Just like we did with `SET_VISIBILITY_FILTER`, we'll import the `ADD_TODO` and `TOGGLE_TODO` actions and then extend our reducer to handle `ADD_TODO`.

接下来还有两个Action需要处理！参考`SET_VISIBILITY_FILTER`的处理，引入`ADD_TODO`和`TOGGLE_TODO`Action，接下来首先处理`ADD_TODO`。

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      })    
    default:
      return state
  }
}
```

Just like before, we never write directly to `state` or its fields, and instead we return new objects. The new `todos` is equal to the old `todos` concatenated with a single new item at the end. The fresh todo was constructed using the data from the action.

跟之前一样，禁止直接更改`state`或它的属性，还是返回一个新对象。新的`todos`对象等同于在旧的`todos`对象尾部拼接一个新的todo对象。新的todo对象根据Action中的数据构造。

Finally, the implementation of the `TOGGLE_TODO` handler shouldn't come as a complete surprise:

最后，跟前面一张将`TOGGLE_TODO`处理完成：

```js
case TOGGLE_TODO:
  return Object.assign({}, state, {
    todos: state.todos.map((todo, index) => {
      if (index === action.index) {
        return Object.assign({}, todo, {
          completed: !todo.completed
        })
      }
      return todo
    })
  })
```

Because we want to update a specific item in the array without resorting to mutations, we have to create a new array with the same items except the item at the index. If you find yourself often writing such operations, it's a good idea to use a helper like [immutability-helper](https://github.com/kolodny/immutability-helper), [updeep](https://github.com/substantial/updeep), or even a library like [Immutable](http://facebook.github.io/immutable-js/) that has native support for deep updates. Just remember to never assign to anything inside the `state` unless you clone it first.

因为上面的代码中只需要处理数组中的一个指定项，并不需要将数组顺序重排，所以用旧的数组元素创建一个新的数组，并将需要修改的元素重新生成。如果这样的操作很常见，建议使用[immutability-helper](https://github.com/kolodny/immutability-helper)，[updeep](https://github.com/substantial/updeep)之类的辅助工具，或者使用[Immutable](http://facebook.github.io/immutable-js/)这样支持原生不变数据类型的库。切记不要修改`state`的任何属性，除非事先将其进行了拷贝。

## 拆分Reducer（Splitting Reducers）

Here is our code so far. It is rather verbose:

目前代码整体如下所示，比较冗长：

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      })
    case TOGGLE_TODO:
      return Object.assign({}, state, {
        todos: state.todos.map((todo, index) => {
          if(index === action.index) {
            return Object.assign({}, todo, {
              completed: !todo.completed
            })
          }
          return todo
        })
      })
    default:
      return state
  }
}
```

Is there a way to make it easier to comprehend? It seems like `todos` and `visibilityFilter` are updated completely independently. Sometimes state fields depend on one another and more consideration is required, but in our case we can easily split updating `todos` into a separate function:

是否有办法让其变得更简单？`todos`和`visibilityFilter`两者看起来是完全独立的两部分。某些情况下，状态字段之间存在相互依赖，但在这个案例中，可以简单的将`todos`拆分到单独的方法中：

```js
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}

function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
    case TOGGLE_TODO:
      return Object.assign({}, state, {
        todos: todos(state.todos, action)
      })
    default:
      return state
  }
}
```

Note that `todos` also accepts `state`—but it's an array! Now `todoApp` just gives it the slice of the state to manage, and `todos` knows how to update just that slice. **This is called *reducer composition*, and it's the fundamental pattern of building Redux apps.**

注意`todos`也接收一个`state`参数，但这个参数是一个数组！`todoApp`只是将状态的一部分交给`todos`管理，`todos`只需要处理这个片段即可。**这种方式叫做*Reducer组合*，也是构建Redux应用的基本模式。**

Let's explore reducer composition more. Can we also extract a reducer managing just `visibilityFilter`? We can.

继续尝试Reducer组合模式，也可以将`visibilityFilter`的管理拆分出来。

Below our imports, let's use [ES6 Object Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to declare `SHOW_ALL`:

下面的导入语法中，使用[ES6析构赋值语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)来定义`SHOW_ALL`：

```js
const { SHOW_ALL } = VisibilityFilters;
```

Then:

继续编码：

```js
function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}
```

Now we can rewrite the main reducer as a function that calls the reducers managing parts of the state, and combines them into a single object. It also doesn't need to know the complete initial state anymore. It's enough that the child reducers return their initial state when given `undefined` at first.

现在可以将主Reducer重写，其负责调用其他的Reducer来管理状态的不同部分，并将他们合并到一个对象中。主Reducer也不再需要知道完整的初始化状态。当子Reducer接收`undefined`时，返回各自的初始状态即可。

```js
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}

function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  }
}
```

**Note that each of these reducers is managing its own part of the global state. The `state` parameter is different for every reducer, and corresponds to the part of the state it manages.**

**注意，每个Reducer管理全局状态中各自的那一部分状态，他们的`state`参数各不相同，分别表示各自所管理的那一部分状态。**

This is already looking good! When the app is larger, we can split the reducers into separate files and keep them completely independent and managing different data domains.

目前看起来还是非常不错的！当应用进一步变大是，可以将Reducer拆分到单独的文件中，保持各自的完全独立，分别管理不同的数据域。

Finally, Redux provides a utility called [`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md) that does the same boilerplate logic that the `todoApp` above currently does. With its help, we can rewrite `todoApp` like this:

最后，Redux提供了一个叫做[`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md)的工具方法来实现上面的样板代码逻辑。接下来如下重构`todoApp`：

```js
import { combineReducers } from 'redux'

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp
```

Note that this is equivalent to:

等价于原来的下面部分：

```js
export default function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  }
}
```

You could also give them different keys, or call functions differently. These two ways to write a combined reducer are equivalent:

也可以包含不同键值，或起不同的方法名。下面的两种写法是等价的：

```js
const reducer = combineReducers({
  a: doSomethingWithA,
  b: processB,
  c: c
})
```

```js
function reducer(state = {}, action) {
  return {
    a: doSomethingWithA(state.a, action),
    b: processB(state.b, action),
    c: c(state.c, action)
  }
}
```

All [`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md) does is generate a function that calls your reducers **with the slices of state selected according to their keys**, and combining their results into a single object again. [It's not magic.](https://github.com/reactjs/redux/issues/428#issuecomment-129223274) And like other reducers, `combineReducers()` does not create a new object if all of the reducers provided to it do not change state.

[`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md)只是返回一个方法，在这个方法内部根据**状态的不同部分对应的键名**来调用同名的Reducer，并所有Reducer的执行结果合并进一个对象中。[这只是一个普通方法](https://github.com/reactjs/redux/issues/428#issuecomment-129223274)。跟通常的Reducer一样，如果子Reducer的执行结果不变，则其返回值也不会变化。

>##### ES6重度用户说明（Note for ES6 Savvy Users）
>
>Because `combineReducers` expects an object, we can put all top-level reducers into a separate file, `export` each reducer function, and use `import * as reducers` to get them as an object with their names as the keys:
>
> `combineReducers`方法接收一个对象参数，可以将顶级的Reducer在单独的文件中`export`，然后使用`import * as reducers`将他们引用到同一个对象中：
>
>```js
>import { combineReducers } from 'redux'
>import * as reducers from './reducers'
>
>const todoApp = combineReducers(reducers)
>```
>
>Because `import *` is still new syntax, we don't use it anymore in the documentation to avoid [confusion](https://github.com/reactjs/redux/issues/428#issuecomment-129223274), but you may encounter it in some community examples.
>
> `import *`目前是一个比较新的语法，[为避免混乱](https://github.com/reactjs/redux/issues/428#issuecomment-129223274)在文档中不会使用这个语法，但在其他例子中有可能看到这种用法。

## 源代码（Source Code）

#### `reducers.js`

```js
import { combineReducers } from 'redux'
import { ADD_TODO, TOGGLE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from './actions'
const { SHOW_ALL } = VisibilityFilters

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp
```

## 下一步（Next Steps）

Next, we'll explore how to [create a Redux store](https://github.com/reactjs/redux/blob/master/docs/basics/Store.md) that holds the state and takes care of calling your reducer when you dispatch an action.

接下来，将演示如何[创建一个Redux Store](https://github.com/reactjs/redux/blob/master/docs/basics/Store.md)来保存状态和Reducer的调用。
