---
layout: post
title: Redux 5 - 入门：现有技术（Prior Art）
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/docs/introduction/PriorArt.md)


Redux has a mixed heritage. It is similar to some patterns and technologies, but is also different from them in important ways. We'll explore some of the similarities and the differences below.

Redux类似于一个混血儿，和一些现有模式和技术比较相似，但也存在一些重要的不同。下面将分析一下Redux和这些技术之间的相同点和不同点。

### Flux

Can Redux be considered a [Flux](https://facebook.github.io/flux/) implementation?  
[Yes](https://twitter.com/fisherwebdev/status/616278911886884864), and [no](https://twitter.com/andrestaltz/status/616270755605708800).

(Don't worry, [Flux creators](https://twitter.com/jingc/status/616608251463909376) [approve of it](https://twitter.com/fisherwebdev/status/616286955693682688), if that's all you wanted to know.)

Redux遵循[Flux](https://facebook.github.io/flux/)的规范吗？  
[是](https://twitter.com/fisherwebdev/status/616278911886884864)，或[不是](https://twitter.com/andrestaltz/status/616270755605708800)。

（如果你纠结于这个问题，不要担心，[Flux创建者](https://twitter.com/jingc/status/616608251463909376)[同意这个说法](https://twitter.com/fisherwebdev/status/616286955693682688)。

Redux was inspired by several important qualities of Flux. Like Flux, Redux prescribes that you concentrate your model update logic in a certain layer of your application (“stores” in Flux, “reducers” in Redux). Instead of letting the application code directly mutate the data, both tell you to describe every mutation as a plain object called an “action”.

Redux的灵感来源于Flux的一些重要特性。跟Flux一样，Redux规定在一个确定的应用层中更新数据模型（Flux中的“Stores”对应于Redux中的“Reducer”），以避免在代码中直接修改数据，同时两者都会用一个简单的“Action”对象描述每一个修改和变化。

Unlike Flux, **Redux does not have the concept of a Dispatcher**. This is because it relies on pure functions instead of event emitters, and pure functions are easy to compose and don't need an additional entity managing them. Depending on how you view Flux, you may see this as either a deviation or an implementation detail. Flux has often been [described as `(state, action) => state`](https://speakerdeck.com/jmorrell/jsconf-uy-flux-those-who-forget-the-past-dot-dot-dot-1). In this sense, Redux is true to the Flux architecture, but makes it simpler thanks to pure functions.

跟Flux不同的是，**Redux中不存在Dispatcher的概念**。这是因为Redux中使用纯函数代替了事件派发对象，纯函数易于组合，并且不依赖额外的对象管理。从不同的角度理解Flux，既可以看做两者的差异，也可以看做不同的实现方式。Flux通常[被描述为`(state, action) => state`](https://speakerdeck.com/jmorrell/jsconf-uy-flux-those-who-forget-the-past-dot-dot-dot-1)。从这个意义上说，Redux确实是Flux的一种实现，只是其采用了更简单的纯函数。

Another important difference from Flux is that **Redux assumes you never mutate your data**. You can use plain objects and arrays for your state just fine, but mutating them inside the reducers is strongly discouraged. You should always return a new object, which is easy with the [object spread operator proposal](https://github.com/reactjs/redux/blob/master/docs/recipes/UsingObjectSpreadOperator.md), or with a library like [Immutable](https://facebook.github.io/immutable-js).

于Flux另一个显著的不同是**Redux假设你从不更改数据**。你只需使用简单对象或者数据来存储状态就好，但坚决反对在Reducer内部对其进行修改。你应该总是返回一个新的对象，使用[对象展开运算符](https://github.com/reactjs/redux/blob/master/docs/recipes/UsingObjectSpreadOperator.md)，或者[Immutable](https://facebook.github.io/immutable-js)的库可以简化对象的操作。

While it is technically *possible* to [write impure reducers](https://github.com/reactjs/redux/issues/328#issuecomment-125035516) that mutate the data for performance corner cases, we actively discourage you from doing this. Development features like time travel, record/replay, or hot reloading will break. Moreover it doesn't seem like immutability poses performance problems in most real apps, because, as [Om](https://github.com/omcljs/om) demonstrates, even if you lose out on object allocation, you still win by avoiding expensive re-renders and re-calculations, as you know exactly what changed thanks to reducer purity.

虽然从技术的角度*可以*[编写一个非纯函数型的Reducer](https://github.com/reactjs/redux/issues/328#issuecomment-125035516)以提高数据修改的性能，但确实不鼓励这样做。如时间旅行，记录/重放，或热加载之类的开发功能将被破坏。此外在大多数真实应用中修改数据并不能带来性能上的提升，如[Om](https://github.com/omcljs/om)所示，即使你不进行对象的分配，依然可以通过避免昂贵的重绘和重算来取得性能优势，因为在纯函数型的Reducer中可以清晰的知道什么发生了变化。

### Elm

[Elm](http://elm-lang.org/) is a functional programming language inspired by Haskell and created by [Evan Czaplicki](https://twitter.com/czaplic). It enforces [a “model view update” architecture](https://github.com/evancz/elm-architecture-tutorial/), where the update has the following signature: `(action, state) => state`. Elm “updaters” serve the same purpose as reducers in Redux.

[Elm](http://elm-lang.org/)是[Evan Czaplicki](https://twitter.com/czaplic)受Haskell启发而创建的一套函数式编程语言。强制[“模型、视图、更新”架构](https://github.com/evancz/elm-architecture-tutorial/)，其中的更新部分的函数签名是：`(action, state) => state`。Redux中的Reducer和Elm中的“Updater”起相同的作用。

Unlike Redux, Elm is a language, so it is able to benefit from many things like enforced purity, static typing, out of the box immutability, and pattern matching (using the `case` expression). Even if you don't plan to use Elm, you should read about the Elm architecture, and play with it. There is an interesting [JavaScript library playground implementing similar ideas](https://github.com/paldepind/noname-functional-frontend-framework). We should look there for inspiration on Redux! One way that we can get closer to the static typing of Elm is by [using a gradual typing solution like Flow](https://github.com/reactjs/redux/issues/290).

跟Redux不同的是，Elm是一门语言，所以它可以从强制纯函数，静态类型，开箱不可变，和模式匹配（使用`case`表达式）等获得很多优势。即使你不打算将Elm用在工作中，学习一下Elm的架构思想总是好的，并将这种思想用在工作中。这里有一个有趣的[JavaScript库演示了类似想法的实现](https://github.com/paldepind/noname-functional-frontend-framework)。我们将其看做Redux灵感的来源。可以通过[使用Flow之类的类型检查器](https://github.com/reactjs/redux/issues/290)获得接近于Elm中的静态类型。

### Immutable

[Immutable](https://facebook.github.io/immutable-js) is a JavaScript library implementing persistent data structures. It is performant and has an idiomatic JavaScript API.

[Immutable](https://facebook.github.io/immutable-js)是一个实现了不可变数据结构的JavaScript库。拥有高性能和一组易于使用的惯用JavaScript API。

Immutable and most similar libraries are orthogonal to Redux. Feel free to use them together!

Immutable以及相似的库于Redux不冲突，可以自由的将他们组合在一起！

**Redux doesn't care *how* you store the state—it can be a plain object, an Immutable object, or anything else.** You'll probably want a (de)serialization mechanism for writing universal apps and hydrating their state from the server, but other than that, you can use any data storage library *as long as it supports immutability*. For example, it doesn't make sense to use Backbone for Redux state, because Backbone models are mutable.

**Redux不关心状态*如何*存储，可以用一个简单对象来实现，也可以使用一个不可变对象来实现，或者其他方式实现。**。你可能需要为通用App实现一套（反）序列化机制，并将服务器端的数据混合进客户端，但无论无何，你可以使用任意的*只要支持不可变*数据存储的库。比如，不能使用Backbone作为Redux状态，因为Backbone的Model是可变的。

Note that, even if your immutable library supports cursors, you shouldn't use them in a Redux app. The whole state tree should be considered read-only, and you should use Redux for updating the state, and subscribing to the updates. Therefore writing via cursor doesn't make sense for Redux. **If your only use case for cursors is decoupling the state tree from the UI tree and gradually refining the cursors, you should look at selectors instead.** Selectors are composable getter functions. See [reselect](http://github.com/faassen/reselect) for a really great and concise implementation of composable selectors.

需要注意的是，即使所选用的不可变库支持游标，在Redux应用中也禁止使用该特性。整个状态树永远是只读状态，应该使用Redux进行状态的更新，并在其中订阅相关的更新。因此，在Redux中通过游标写入没有任何意义。**如果只是通过逐步细化游标在状态树和UI树之间解耦，应该使用选择器代替。**选择器是一组Getter方法的组合。[reselect](http://github.com/faassen/reselect)是一个强大并且实现简洁的选择器组合库。

### Baobab

[Baobab](https://github.com/Yomguithereal/baobab) is another popular library implementing immutable API for updating plain JavaScript objects. While you can use it with Redux, there is little benefit in using them together.

[Baobab](https://github.com/Yomguithereal/baobab)是另一个流行的JavaScript不可变数据类型库，拥有一组更新普通JavaScript对象的API。但将其和Redux一起使用，几乎没有任何益处。

Most of the functionality Baobab provides is related to updating the data with cursors, but Redux enforces that the only way to update the data is to dispatch an action. Therefore they solve the same problem differently, and don't complement each other.

Baobab提供的大多数功能是数据游标相关的数据更新，但是Redux强制只能通过Action来更新数据。所以，这是针对同一个问题的不同解决思路，两者之间没有互补的关系。

Unlike Immutable, Baobab doesn't yet implement any special efficient data structures under the hood, so you don't really win anything from using it together with Redux. It's easier to just use plain objects in this case.

跟Immutable不同，Baobab底层并没有一个特殊高效的数据结构实现，所以将其和Redux一起使用不会获得任何好处。在这种情况下，用一个简单的JavaScript对象更简单一些。

### RxJS

[RxJS](https://github.com/ReactiveX/RxJS) is a superb way to manage the complexity of asynchronous apps. In fact [there is an effort to create a library that models human-computer interaction as interdependent observables](http://cycle.js.org).

[RxJS](https://github.com/ReactiveX/RxJS)是一个非常优秀的用来管理App中的复杂异步数据的实现方式。实际上，[这是一个致力于创建可观察人机交互模型的库](http://cycle.js.org)。

Does it make sense to use Redux together with RxJS? Sure! They work great together. For example, it is easy to expose a Redux store as an observable:

Redux和RxJS一起使用是否会取得良好的效果吗？当然是。这两者在一起工作非常友好。比如，使用RxJS可以很方便的将Redux store封装为一个可观察对象：

```js
function toObservable(store) {
  return {
    subscribe({ next }) {
      const unsubscribe = store.subscribe(() => next(store.getState()))
      next(store.getState())
      return { unsubscribe }
    }
  }
}
```

Similarly, you can compose different asynchronous streams to turn them into actions before feeding them to `store.dispatch()`.

类似的，也可以将不同的异步流整合到Action中，在将其`store.dispatch()`。

The question is: do you really need Redux if you already use Rx? Maybe not. It's not hard to [re-implement Redux in Rx](https://github.com/jas-chen/rx-redux). Some say it's a two-liner using Rx `.scan()` method. It may very well be!

有一个问题是：假如你正在使用Rx，那么你是否还有必要使用Redux？也许不，[用Rx重新实现Redux](https://github.com/jas-chen/rx-redux)并不是一件难事。有人说用两行Rx代码`.scan()`即可实现，这完全可能。

If you're in doubt, check out the Redux source code (there isn't much going on there), as well as its ecosystem (for example, [the developer tools](https://github.com/gaearon/redux-devtools)). If you don't care too much about it and want to go with the reactive data flow all the way, you might want to explore something like [Cycle](http://cycle.js.org) instead, or even combine it with Redux. Let us know how it goes!

对于Redux，如果你心中还有疑虑，建议通读其源码（这里不会进行更深入的讲解），和其系统内代码（比如[Redux开发工具](https://github.com/gaearon/redux-devtools)）。如果你不关心这么多，只是想获取灵活的数据，可以看看[Cycle](http://cycle.js.org)，或者将其和Redux一起使用。接下来一起看看怎么用Redux。
