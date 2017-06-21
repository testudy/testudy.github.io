---
layout: post
title: React 25 - 子级校正（Reconciliation）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/reconciliation.html)

> ### 说明
> 曹楠的博客中已经有详细准确翻译[【翻译】Reconciliation React比对算法](https://github.com/cnsnake11/blog/blob/master/ReactNative翻译/Reconciliation.md)，下面是个人学习记录。

React provides a declarative API so that you don't have to worry about exactly what changes on every update. This makes writing applications a lot easier, but it might not be obvious how this is implemented within React. This article explains the choices we made in React's "diffing" algorithm so that component updates are predictable while being fast enough for high-performance apps.

React提供了一组声明式的API来方便的编写应用程序，React隐藏了内部实现，用户也不用关心程序更新时发生了哪些操作。这篇文章解释了React的“差异比较“算法中的各种条件选择，让用户对组件更新心里有数，以便创建更高效的应用程序。

## 动机（Motivation）

When you use React, at a single point in time you can think of the `render()` function as creating a tree of React elements. On the next state or props update, that `render()` function will return a different tree of React elements. React then needs to figure out how to efficiently update the UI to match the most recent tree.

在React中，调用`render()`方法会创建一棵React元素树，当State或Props更新时，`render()`方法会返回另一棵改变后的React元素树。此时React需要找出两者之间的差异来高效的更新UI。

There are some generic solutions to this algorithmic problem of generating the minimum number of operations to transform one tree into another. However, the [state of the art algorithms](http://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf) have a complexity in the order of O(n<sup>3</sup>) where n is the number of elements in the tree.

有一些常用的算法可以来计算从一棵树转换到另外一棵树的最少操作步骤，但[目前最好的算法](http://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf)复杂度是O(n<sup>3</sup>)（n是树中元素的数量）。

If we used this in React, displaying 1000 elements would require in the order of one billion comparisons. This is far too expensive. Instead, React implements a heuristic O(n) algorithm based on two assumptions:

1. Two elements of different types will produce different trees.
2. The developer can hint at which child elements may be stable across different renders with a `key` prop.

In practice, these assumptions are valid for almost all practical use cases.

如果在React中使用这个算法，1000个元素就需要10亿次比较，消耗太大。所以基于下面两个前提，React实现了启发式O(n)的算法：

1. 两个不同类型的元素会产生两个不同的树；
2. 开发者可以设置`key`属性来唯一标识一个子元素。

在实际使用中，这两个假设对大多数场景都适用。

## 差异比较算法（The Diffing Algorithm）

When diffing two trees, React first compares the two root elements. The behavior is different depending on the types of the root elements.

当比较两棵树时，React首先比较的是两棵树的根元素，根据不同的情况下执行不同的操作。

### 元素类型不同（Elements Of Different Types）

Whenever the root elements have different types, React will tear down the old tree and build the new tree from scratch. Going from `<a>` to `<img>`, or from `<Article>` to `<Comment>`, or from `<Button>` to `<div>` - any of those will lead to a full rebuild.

当根元素类型不同的时候，React会卸载掉旧树，并完全创建新树替代。无论把`<a>`替换为`<img>`，或者把`<Article>`替换为`<Comment>`，或者把`<Button>`替换为`<div>`，所有的这种替换都会导致一次子树的全部构建。

When tearing down a tree, old DOM nodes are destroyed. Component instances receive `componentWillUnmount()`. When building up a new tree, new DOM nodes are inserted into the DOM. Component instances receive `componentWillMount()` and then `componentDidMount()`. Any state associated with the old tree is lost.

当卸载一棵旧树的时候，对应的旧DOM节点都会被销毁。组件实例会调用`componentWillUnmout()`方法。当新树构建完成的时候，对应的新DOM节点会插入到DOM中。组件实例会调用`componentWillMount()`和`componentDidMount()`。旧树相关的状态都会被丢弃。

Any components below the root will also get unmounted and have their state destroyed. For example, when diffing:

旧树下面的所有组件都会被卸载，相关的状态都会被销毁。比如下例中的差异比较时：

```xml
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

This will destroy the old `Counter` and remount a new one.

旧的`<Counter>`将会被销毁，并创建一个新的元素。

### DOM元素类型相同（DOM Elements Of The Same Type）

When comparing two React DOM elements of the same type, React looks at the attributes of both, keeps the same underlying DOM node, and only updates the changed attributes. For example:

当对比的两个React DOM元素类型相同时，React会保留相同的底层DOM元素，将属性进行对比并更新变化的特性。比如：

```xml
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

By comparing these two elements, React knows to only modify the `className` on the underlying DOM node.

对上面两个元素对比之后，React只修改底层DOM元素的`className`特性。

When updating `style`, React also knows to update only the properties that changed. For example:

当`style`特性更新之后，React也只修改对应元素的style属性。比如：

```xml
<div style={{'{{'}}color: 'red', fontWeight: 'bold'}} />

<div style={{'{{'}}color: 'green', fontWeight: 'bold'}} />
```

When converting between these two elements, React knows to only modify the `color` style, not the `fontWeight`.

对上面两个元素对比之后，React只修改`color`样式属性，而不会修改`fontWeight`。

After handling the DOM node, React then recurses on the children.

DOM节点处理完成后，在对其子节点进行递归处理。

### 组件元素类型相同（Component Elements Of The Same Type）

When a component updates, the instance stays the same, so that state is maintained across renders. React updates the props of the underlying component instance to match the new element, and calls `componentWillReceiveProps()` and `componentWillUpdate()` on the underlying instance.

这种情况下组件更新的时候会保持同一个组件实例，调用渲染方法以同步状态。React更新子元素的Props以生成新的元素，并调用子元素的`componentWillReceiveProps()`和`componentWillUpdate()`方法。

Next, the `render()` method is called and the diff algorithm recurses on the previous result and the new result.

随后调用`render()`方法，并在旧树和新树之间递归执行差异比较算法。

### 递归子元素（Recursing On Children）

By default, when recursing on the children of a DOM node, React just iterates over both lists of children at the same time and generates a mutation whenever there's a difference.

默认情况下，会对DOM节点的子元素进行递归操作，React只需要遍历所有子元素，出现差异时进行修改。

For example, when adding an element at the end of the children, converting between these two trees works well:

如下在子元素的尾部添加一个新元素是，两棵树之间的转换工作如下：

```xml
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

React will match the two `<li>first</li>` trees, match the two `<li>second</li>` trees, and then insert the `<li>third</li>` tree.

React会匹配两棵树中的`<li>first</li>`和`<li>second</li>`，然后插入`<li>third</li>`到树中。

If you implement it naively, inserting an element at the beginning has worse performance. For example, converting between these two trees works poorly:

但如果使用的过于随意，在开始处插入一个元素将会导致很差的性能。比如，下面两棵树的转换性能会比较差：

```xml
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

React will mutate every child instead of realizing it can keep the `<li>Duke</li>` and `<li>Villanova</li>` subtrees intact. This inefficiency can be a problem.

React会修改每一个子元素，而无法识别`<li>Duke</li>`和`<li>Villanova</li>`两个元素并没有变化，这样的话某些情况下会导致问题。

### Keys

In order to solve this issue, React supports a `key` attribute. When children have keys, React uses the key to match children in the original tree with children in the subsequent tree. For example, adding a `key` to our inefficient example above can make the tree conversion efficient:

为了解决上面的问题，React支持`key`特性，当子元素有key特性时，会使用key特性作为树中子元素的匹配标识。比如，在上面低效的例子中增加一个`key`特性可以让其转换高效起来：

```xml
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

Now React knows that the element with key `'2014'` is the new one, and the elements with the keys `'2015'` and `'2016'` have just moved.

这样的话，React会识别出key特性为`'2014'`的元素是一个新元素，`'2015'`和`'2016'`两个元素只是移动了位置而已。

In practice, finding a key is usually not hard. The element you are going to display may already have a unique ID, so the key can just come from your data:

实际上，找到这样一个key特性通常情况下并不难。如果将要渲染的元素包含一个Unique ID，直接如下使用这个ID即可：

```js
<li key={item.id}>{item.name}</li>
```

When that's not the case, you can add a new ID property to your model or hash some parts of the content to generate a key. The key only has to be unique among its siblings, not globally unique.

当不存在这样的ID属性时，可以在Model中创建一个ID属性，或者将内容的一部分Hash生成一个Key，这个Key只需要在其兄弟元素中保持唯一即可，并不要求全局唯一性。

As a last resort, you can pass item's index in the array as a key. This can work well if the items are never reordered, but reorders will be slow.

最后一个方法是，将数据项在数组中的索引值作为key特性。当数组顺序不发生变化的时候这样没问题，但当数组重新排序后性能会比较差。

## 权衡（Tradeoffs）

It is important to remember that the reconciliation algorithm is an implementation detail. React could rerender the whole app on every action; the end result would be the same. We are regularly refining the heuristics in order to make common use cases faster.

子级校正算法是React中的细节实现。React不用子级校正算法的话也可以在每次重新渲染时渲染全部App；但最终结果是相同的。官方正在不断改进这个启发式算法，以使得在常见案例性能更快。

In the current implementation, you can express the fact that a subtree has been moved amongst its siblings, but you cannot tell that it has moved somewhere else. The algorithm will rerender that full subtree.

在目前的算法实现中，会发现当一个子树移动到其兄弟元素之间时，并不能发现该子树是被移动了。目前的算法会重新渲染整个子树。

Because React relies on heuristics, if the assumptions behind them are not met, performance will suffer.

1. The algorithm will not try to match subtrees of different component types. If you see yourself alternating between two component types with very similar output, you may want to make it the same type. In practice, we haven't found this to be an issue.

2. Keys should be stable, predictable, and unique. Unstable keys (like those produced by `Math.random()`) will cause many component instances and DOM nodes to be unnecessarily recreated, which can cause performance degradation and lost state in child components.

React实现的是启发式算法，如果算法假设的前提条件没有满足，对性能的影响会非常大。

1. 该算法不会尝试匹配不同组件类型的子树。如果发现两个组件的输出结果非常相似，可以尝试将两者合并为同一个类型。实际上，目前还没有发现这个原因导致的性能问题。
2. Key应该是标准的，可预期的，并且唯一的。不标准的Key（比如`Math.random()`产生的）将导致很多不必要的组件实例和DOM节点被创建，这会导致性能下降和子组件的状态丢失。
