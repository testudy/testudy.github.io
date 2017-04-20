---
layout: post
title: React 14 - 高阶组件（Higher-Order Components）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/higher-order-components.html)

A higher-order component (HOC) is an advanced technique in React for reusing component logic. HOCs are not part of the React API, per se. They are a pattern that emerges from React's compositional nature.

高阶组件（HOC）是React中重用组件逻辑的一项高级技术。它并不是由React API定义出来的功能，而是由React的组合特性衍生出来的一种设计模式。

Concretely, **a higher-order component is a function that takes a component and returns a new component.**

概念上说，**高阶组件本质上也是一个函数，其接收一个组件，并返回一个新的组件**。

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Whereas a component transforms props into UI, a higher-order component transforms a component into another component.

普通组件用来将Props转化为UI，高阶组件则将组件转化为另一个组件。

HOCs are common in third-party React libraries, such as Redux's [`connect`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) and Relay's [`createContainer`](https://facebook.github.io/relay/docs/api-reference-relay.html#createcontainer-static-method).

HOC在React的第三方库中很常见，比如Redux的[`connect`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)方法，还有Relay的[`createContainer`](https://facebook.github.io/relay/docs/api-reference-relay.html#createcontainer-static-method)方法等。

In this document, we'll discuss why higher-order components are useful, and how to write your own.

在这份文档中，会展开分析一下高阶组件的用途，为什么使用高阶组件，以及如何实现。

## 使用高阶组件解决[横切关注点](https://zh.wikipedia.org/wiki/横切关注点)（Use HOCs For Cross-Cutting Concerns）

> **提醒（Note）**
>
> We previously recommended mixins as a way to handle cross-cutting concerns. We've since realized that mixins create more trouble than they are worth. [Read more](https://facebook.github.io/react/blog/2016/07/13/mixins-considered-harmful.html) about why we've moved away from mixins and how you can transition your existing components.
>
> 之前曾建议使用Mixin解决横切关注点问题，但目前已经发现Mixin所带来的副作用远远大于其所解决的问题。[可以了解更多](https://facebook.github.io/react/blog/2016/07/13/mixins-considered-harmful.html)为什么将解决方案从Mixin迁移，以及如何转换现有的组件。

Components are the primary unit of code reuse in React. However, you'll find that some patterns aren't a straightforward fit for traditional components.

组件是React中代码重用的主要单元。但是，某些模式并不能在传统组件中直接使用。

For example, say you have a `CommentList` component that subscribes to an external data source to render a list of comments:

如下例，假设有一个`CommentList`组件，订阅一个外部数据源来渲染评论列表：

```js
class CommentList extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" is some global data source
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Subscribe to changes
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Clean up listener
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Update component state whenever the data source changes
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

Later, you write a component for subscribing to a single blog post, which follows a similar pattern:

接下来，编写了一个新的组件用来订阅单条博文，这两个组件遵循基本相同的模式：

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList` and `BlogPost` aren't identical — they call different methods on `DataSource`, and they render different output. But much of their implementation is the same:

- On mount, add a change listener to `DataSource`.
- Inside the listener, call `setState` whenever the data source changes.
- On unmount, remove the change listener.

`CommentList`和`BlogPost`是两个不同的组件——两者调用`DataSource`上的不同方法，渲染不同的内容。但两者的实现模式是相同的：

- 在挂载事件中，在`DataSource`上绑定一个改变事件监听器；
- 在事件监听中，当数据源发生改变的时候会调用`setState`方法；
- 在卸载事件中，移除事件监听器。

You can imagine that in a large app, this same pattern of subscribing to `DataSource` and calling `setState` will occur over and over again. We want an abstraction that allows us to define this logic in a single place and share them across many components. This is where higher-order components excel.

试着想一下，在一个大型的App中，同上的订阅`DataSource`、调用`setState`的模式反复出现。这时候，需要思考如何将这个逻辑抽象定义在同一个地方，并复用在所有需要的组件中。这时候用高阶组件就非常合适了。

We can write a function that creates components, like `CommentList` and `BlogPost`, that subscribe to `DataSource`. The function will accept as one of its arguments a child component that receives the subscribed data as a prop. Let's call the function `withSubscription`:

可以编写一个用来创建`CommentList`和`BlogPost`这类组件的方法，同时完成`DataSource`的订阅。这个方法接收一个子组件作为参数，并将订阅的数据作为prop传递给该子组件。暂时将这个方法叫做`withSubscription`：

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
});
```

The first parameter is the wrapped component. The second parameter retrieves the data we're interested in, given a `DataSource` and the current props.

第一个参数是被封装的子组件。第二个参数是用来生成子组件需求数据的方法，这个方法接收`DataSource`和当前Props两个参数。

When `CommentListWithSubscription` and `BlogPostWithSubscription` are rendered, `CommentList` and `BlogPost` will be passed a `data` prop with the most current data retrieved from `DataSource`:

当组件`CommentListWithSubscription`和`BlogPostWithSubscription`渲染时，会把从`DataSource`获取到的最新数据传递到`CommentList`和`BlogPost`组件的`data`属性中：

```js
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

Note that an HOC doesn't modify the input component, nor does it use inheritance to copy its behavior. Rather, an HOC *composes* the original component by *wrapping* it in a container component. An HOC is a pure function with zero side-effects.

注意高阶组件不会修改子组件，也不继承拷贝子组件的行为。高阶组件只是通过*组合*的方式将子组件*包装*在容器组件中，是一个0副作用的纯函数。

And that's it! The wrapped component receives all the props of the container, along with a new prop, `data`, which it uses to render its output. The HOC isn't concerned with how or why the data is used, and the wrapped component isn't concerned with where the data came from.

如上所示，包装在容器组件内部的子组件接收容器组件的所有Props，通过新的`data`来渲染输出。高阶组件不关心数据为什么以及如何被使用，被包装的子组件也不关心数据从哪儿来。

Because `withSubscription` is a normal function, you can add as many or as few arguments as you like. For example, you may want to make the name of the `data` prop configurable, to further isolate the HOC from the wrapped component. Or you could accept an argument that configures `shouldComponentUpdate`, or one that configures the data source. These are all possible because the HOC has full control over how the component is defined.

`withSubscription`只是一个简单的函数，可以根据需要添加任意多或任意少的参数，来实现上例中`data`属性名的配置，以将子组件和高阶组件进一步解耦。也可以接收参数来配置`shouldComponentUpdate`和数据源对象。可以在高阶函数中编码实现想要的任意功能。

Like components, the contract between `withSubscription` and the wrapped component is entirely props-based. This makes it easy to swap one HOC for a different one, as long as they provide the same props to the wrapped component. This may be useful if you change data-fetching libraries, for example.

跟组件一样，`withSubscription`和子组件也是基于Prop通信。可以简单的将一个高阶组件更换为另一个，只要两者提供相同的Prop即可。比如，切换不同的数据通信库。

## 禁止修改原组件（Don't Mutate the Original Component. Use Composition.）

Resist the temptation to modify a component's prototype (or otherwise mutate it) inside an HOC.

拒绝在高阶组件中修改组件原型（或者其他方式的修改）。

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentWillReceiveProps(nextProps) {
    console.log('Current props: ', this.props);
    console.log('Next props: ', nextProps);
  }
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return InputComponent;
}

// EnhancedComponent will log whenever props are received
const EnhancedComponent = logProps(InputComponent);
```

There are a few problems with this. One is that the input component cannot be reused separately from the enhanced component. More crucially, if you apply another HOC to `EnhancedComponent` that *also* mutates `componentWillReceiveProps`, the first HOC's functionality will be overridden! This HOC also won't work with function components, which do not have lifecycle methods.

像上面这样的代码修改会存在一些问题。一个问题是输入组件不能跟增强后的组件分开使用。更严重的问题是，如果传入`EnhancedComponent`组件中的子组件，之前被另外一个高阶组件修改过`componentWillReceiveProps`方法，则该修改将被后面的高阶组件覆盖！同时这个高阶组件也不能接收Function组件，因为这个组件不需要包含生命周期方法。

Mutating HOCs are a leaky abstraction—the consumer must know how they are implemented in order to avoid conflicts with other HOCs.

高阶组件中进行组件修改是一种[抽象泄露](https://zh.wikipedia.org/wiki/抽象泄漏)，消费者必须知道这些高阶组件的实现细节以避免对其他高阶组件产生影响。

Instead of mutation, HOCs should use composition, by wrapping the input component in a container component:

在高阶组件中应该是用组合代替修改，即将子组件包装在一个容器组件中：

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    }
    render() {
      // Wraps the input component in a container, without mutating it. Good!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

This HOC has the same functionality as the mutating version while avoiding the potential for clashes. It works equally well with class and functional components. And because it's a pure function, it's composable with other HOCs, or even with itself.

这个组合版本的高阶组件和之前的修改版本功能一致，避免了潜在的冲突，适用于Class形式组件和Function形式组件。这个组合版本的高阶组件只是一个纯函数，可以与其他的高阶组件，甚至自身进行组合。

You may have noticed similarities between HOCs and a pattern called **container components**. Container components are part of a strategy of separating responsibility between high-level and low-level concerns. Containers manage things like subscriptions and state, and pass props to components that handle things like rendering UI. HOCs use containers as part of their implementation. You can think of HOCs as parameterized container component definitions.

你可能已经注意到高阶组件和**容器组件**这两者很相似。容器组件是分割高级别和低级别关注点的一种策略。容器处理订阅和状态，并通过属性传递给UI组件。容器是高阶组件实现的一部分。可以看做高阶组件是参数化的容器组件。

## 约定：传递高阶组件不相关的子组件固有属性（Convention: Pass Unrelated Props Through to the Wrapped Component）

HOCs add features to a component. They shouldn't drastically alter its contract. It's expected that the component returned from an HOC has a similar interface to the wrapped component.

高阶组件在为子组件添加特性的同事，要保持子组件的接口不受影响。高阶组件应该返回一个兼容子组件接口的新组件。

HOCs should pass through props that are unrelated to its specific concern. Most HOCs contain a render method that looks something like this:

高阶组件应该将子组件的固有属性传递过去，大多数高阶组件包含如下所示的render方法：

```js
render() {
  // Filter out extra props that are specific to this HOC and shouldn't be
  // passed through
  const { extraProp, ...passThroughProps } = this.props;

  // Inject props into the wrapped component. These are usually state values or
  // instance methods.
  const injectedProp = someStateOrInstanceMethod;

  // Pass props to wrapped component
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

This convention helps ensure that HOCs are as flexible and reusable as possible.

这个约定是为了保证高阶组件的适用性和重用性。

## 约定：尽可能保持可组合性（Convention: Maximizing Composability）

Not all HOCs look the same. Sometimes they accept only a single argument, the wrapped component:

高阶组件的形式比较多。有时只接收一个单一的参数，即需要被包装的组件：

```js
const NavbarWithRouter = withRouter(Navbar);
```

Usually, HOCs accept additional arguments. In this example from Relay, a config object is used to specify a component's data dependencies:

通常情况下下，高阶组件会接收一个附加参数。比如在Relay中，config对象用来定制组件的数据依赖：

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

The most common signature for HOCs looks like this:

高阶组件最常见的函数签名如下所示：

```js
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(Comment);
```

*What?!* If you break it apart, it's easier to see what's going on.

*啊哈？！*如果将其拆分成两部分，就比较容易理解了。

```js
// connect is a function that returns another function
const enhance = connect(commentListSelector, commentListActions);
// The returned function is an HOC, which returns a component that is connected
// to the Redux store
const ConnectedComment = enhance(CommentList);
```
In other words, `connect` is a higher-order function that returns a higher-order component!

换句话说就是，`connect`是一个高阶函数，并返回一个高阶组件！

This form may seem confusing or unnecessary, but it has a useful property. Single-argument HOCs like the one returned by the `connect` function have the signature `Component => Component`. Functions whose output type is the same as its input type are really easy to compose together.

这种形式初看起来令人困惑，或者说并不必须，但也可能是个有用的特性。单参数的高阶组件等效于签名是`Component => Component`的`connect`方法，输出类型和输入类型相同的组件很容易相互组合。

```js
// Instead of doing this...
const EnhancedComponent = connect(commentSelector)(withRouter(WrappedComponent))

// ... you can use a function composition utility
// compose(f, g, h) is the same as (...args) => f(g(h(...args)))
const enhance = compose(
  // These are both single-argument HOCs
  connect(commentSelector),
  withRouter
)
const EnhancedComponent = enhance(WrappedComponent)
```

(This same property also allows `connect` and other enhancer-style HOCs to be used as decorators, an experimental JavaScript proposal.)

（在代码中`connect`和其他增强型的高阶组件也可以使用Decorator语法，JavaScript规范实验建议。）

The `compose` utility function is provided by many third-party libraries including lodash (as [`lodash.flowRight`](https://lodash.com/docs/#flowRight)), [Redux](http://redux.js.org/docs/api/compose.html), and [Ramda](http://ramdajs.com/docs/#compose).

很多第三方工具库都提供了`compose`工具方法（比如[`lodash.flowRight`](https://lodash.com/docs/#flowRight)），[Redux](http://redux.js.org/docs/api/compose.html)，和[Ramda](http://ramdajs.com/docs/#compose)。

## 约定：将组件显示名字包装起来以便于调试（Convention: Wrap the Display Name for Easy Debugging）

The container components created by HOCs show up in the [React Developer Tools](https://github.com/facebook/react-devtools) like any other component. To ease debugging, choose a display name that communicates that it's the result of an HOC.

由高阶组件创建的容器组件跟普通组件一样也会显示在[React Developer Tools](https://github.com/facebook/react-devtools)中。为了便于调试，最好在名字中标识其相关创建的高阶组件信息。

The most common technique is to wrap the display name of the wrapped component. So if your higher-order component is named `withSubscription`, and the wrapped component's display name is `CommentList`, use the display name `WithSubscription(CommentList)`:

最常见的方式是将子组件名字包裹起来。比如，高阶组件的名字叫做`withSubscription`，被包裹的子组件叫做`CommentList`，则显示名字为`WithSubscription(CommentList)`：

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```


## 提醒（Caveats）

Higher-order components come with a few caveats that aren't immediately obvious if you're new to React.

对于React新手来说，下列相关高阶组件的提醒可能不那么容易理解。

### 不要在render方法内部使用高阶组件（Don't Use HOCs Inside the render Method）

React's diffing algorithm (called reconciliation) uses component identity to determine whether it should update the existing subtree or throw it away and mount a new one. If the component returned from `render` is identical (`===`) to the component from the previous render, React recursively updates the subtree by diffing it with the new one. If they're not equal, the previous subtree is unmounted completely.

React的差分算法（叫做Reconciliation）根据组件标识来决定是应该更新其现存的子树，还是更替自身。如果组件`render`方法的返回值跟之前的返回值相同，则将两者的子树递归对比更新。如果不相同，之前的子树被新子树完全替换。

Normally, you shouldn't need to think about this. But it matters for HOCs because it means you can't apply an HOC to a component within the render method of a component:

一般情况下，不需要考虑这个细节。但在高阶组件中，这决定了不能在render方法中使用高阶组件：

```js
render() {
  // A new version of EnhancedComponent is created on every render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // That causes the entire subtree to unmount/remount each time!
  return <EnhancedComponent />;
}
```

The problem here isn't just about performance — remounting a component causes the state of that component and all of its children to be lost.

这个问题不只关乎性能——更替一个组件会导致自身及其所有的子元素状态都会丢失。

Instead, apply HOCs outside the component definition so that the resulting component is created only once. Then, its identity will be consistent across renders. This is usually what you want, anyway.

为了避免这个问题，将使用高阶组件的定义在组件外部，这样渲染结果中，该组件只会被渲染一次。随后在先后渲染中会保持同一个标识。这是通常情况下的使用方式。

In those rare cases where you need to apply an HOC dynamically, you can also do it inside a component's lifecycle methods or its constructor.

当然，在某些需要动态选择需要使用的高阶组件的情况下，可以在生命周期方法或其构造函数中使用高阶组件。

### Static Methods Must Be Copied Over

Sometimes it's useful to define a static method on a React component. For example, Relay containers expose a static method `getFragment` to facilitate the composition of GraphQL fragments.

在某些情况下，在React组件中定义静态方法非常有用。比如，Relay容器暴露了`getFragment`这个静态方法，以便于构造GraphQL片段。

When you apply an HOC to a component, though, the original component is wrapped with a container component. That means the new component does not have any of the static methods of the original component.

高阶组件对子组件包装之后会返回一个容器组件，这意味着新组件不包含任何子组件中包含的静态方法。

```js
// Define a static method
WrappedComponent.staticMethod = function() {/*...*/}
// Now apply an HOC
const EnhancedComponent = enhance(WrappedComponent);

// The enhanced component has no static method
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

To solve this, you could copy the methods onto the container before returning it:

为了解决这个问题，应该将静态方法拷贝到容器组件之后，再将其返回：

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Must know exactly which method(s) to copy :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

However, this requires you to know exactly which methods need to be copied. You can use [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) to automatically copy all non-React static methods:

但是，这要求你清楚所有需要拷贝的方法。可以使用[hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics)来自动的拷贝所有非React的静态方法：

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

Another possible solution is to export the static method separately from the component itself.

另一个解决方案是将组件自身和静态方法分别导出。

```js
// Instead of...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export the method separately...
export { someFunction };

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js';
```

### Ref相关属性不能被传递（Refs Aren't Passed Through）

While the convention for higher-order components is to pass through all props to the wrapped component, it's not possible to pass through refs. That's because `ref` is not really a prop — like `key`, it's handled specially by React. If you add a ref to an element whose component is the result of an HOC, the ref refers to an instance of the outermost container component, not the wrapped component.

在高阶组件中，虽然通常情况下会将所有的属性传递给被包装的子组件，但Ref相关属性并不会进行传递。原因是`ref`并不是一个通常的属性——比如`key`，这些属性是React内部使用的。如果在高阶组件创建的组件中使用Ref相关属性，则这些属性会跟外层的容器组件建立关联，而不是内部被包装的组件。

If you find yourself facing this problem, the ideal solution is to figure out how to avoid using `ref` at all. Occasionally, users who are new to the React paradigm rely on refs in situations where a prop would work better.

如果发现正在受这个问题的困扰，理想的方法是找出避免使用`ref`的根本办法。某些情况下，参考React文档的范例，Prop比Ref工作的更好。

That said, there are times when refs are a necessary escape hatch — React wouldn't support them otherwise. Focusing an input field is an example where you may want imperative control of a component. In that case, one solution is to pass a ref callback as a normal prop, by giving it a different name:

这就是说：当需要使用Ref的时候——React却不支持。比如，当你需要控制一个输入组件的时候，可以传递一个回调函数作为普通属性，以为其提供不同的名字：

```js
function Field({ inputRef, ...rest }) {
  return <input ref={inputRef} {...rest} />;
}

// Wrap Field in a higher-order component
const EnhancedField = enhance(Field);

// Inside a class component's render method...
<EnhancedField
  inputRef={(inputEl) => {
    // This callback gets passed through as a regular prop
    this.inputEl = inputEl
  }}
/>

// Now you can call imperative methods
this.inputEl.focus();
```

This is not a perfect solution by any means. We prefer that refs remain a library concern, rather than require you to manually handle them. We are exploring ways to solve this problem so that using an HOC is unobservable.

但是这并是一个良好的解决办法。我们正在思考是否需要提供一个库来解决这个问题，以避免手工处理这些问题，最终我们期望高阶组件的使用完全透明化。
