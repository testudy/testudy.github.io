---
layout: post
title: React 15 - 上下文（Context）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/context.html)

> 提醒（Note）：
>
> As of React v15.5 the `React.PropTypes` helper is deprecated, and we recommend using the [`prop-types` library](https://www.npmjs.com/package/prop-types) to define `contextTypes`.
>
> 自React v15.5版本开始，`React.PropTypes`帮助方法已经被标记为废弃，建议使用[`prop-types` library](https://www.npmjs.com/package/prop-types)来定义`contextTypes`。

With React, it's easy to track the flow of data through your React components. When you look at a component, you can see which props are being passed, which makes your apps easy to reason about.

在React中，可以非常方便的跟踪React组件中的数据流，确定传入到组件中的Props进一步查找原因非常简单。

In some cases, you want to pass data through the component tree without having to pass the props down manually at every level.
You can do this directly in React with the powerful "context" API.

在某些情况下，可能需要在组件树的各个节点中都使用同一份数据，这时如果将其手工在每一个节点中传递非常笨拙，可以使用强大的“上下文”API来解决这个问题。


## 为什么尽量不要使用上下文（Why Not To Use Context）

The vast majority of applications do not need to use context.

绝大多数的应用不需要使用上下文。

If you want your application to be stable, don't use context. It is an experimental API and it is likely to break in future releases of React.

如果你期望自己的应用程序标准化，那么不要使用上下文。上下文是一个试验API，有可能在未来的React版本中删除。

If you aren't familiar with state management libraries like [Redux](https://github.com/reactjs/redux) or [MobX](https://github.com/mobxjs/mobx), don't use context. For many practical applications, these libraries and their React bindings are a good choice for managing state that is relevant to many components. It is far more likely that Redux is the right solution to your problem than that context is the right solution.

如果你不熟悉[Redux](https://github.com/reactjs/redux)或[MobX](https://github.com/mobxjs/mobx)之类的状态管理库，不要使用上下文。对于大多数的实际应用来说，使用Redux这些库以及相关的React绑定库来管理状态是一个比较好的解决方案，是比自己使用上下文更好的解决方案。

If you aren't an experienced React developer, don't use context. There is usually a better way to implement functionality just using props and state.

如果你是React开发新手，不要使用上下文。通常情况下，使用Props和State是更好的实现方法。

If you insist on using context despite these warnings, try to isolate your use of context to a small area and avoid using the context API directly when possible so that it's easier to upgrade when the API changes.

如果你不顾虑上面的警告，依然要使用上下文，尽量缩小上下文相关API的使用范围，以控制相关API升级时发生变化所造成的影响范围。

## 如何使用上下文（How To Use Context）

Suppose you have a structure like:

假设你的结构如下所示：

```javascript
class Button extends React.Component {
  render() {
    return (
      <button style={{'{{'}}background: this.props.color}}>
        {this.props.children}
      </button>
    );
  }
}

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button color={this.props.color}>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  render() {
    const color = "purple";
    const children = this.props.messages.map((message) =>
      <Message text={message.text} color={color} />
    );
    return <div>{children}</div>;
  }
}
```

In this example, we manually thread through a `color` prop in order to style the `Button` and `Message` components appropriately. Using context, we can pass this through the tree automatically:

在这个示例中，我们手动将`color`属性从`MessageList`组件中依次传递到`Message`和`Button`中。如果使用上下文，可以将这个属性自动的传递到整个组件树中：

```javascript
const PropTypes = require('prop-types');

class Button extends React.Component {
  render() {
    return (
      <button style={{'{{'}}background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}

Button.contextTypes = {
  color: PropTypes.string
};

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  getChildContext() {
    return {color: "purple"};
  }

  render() {
    const children = this.props.messages.map((message) =>
      <Message text={message.text} />
    );
    return <div>{children}</div>;
  }
}

MessageList.childContextTypes = {
  color: PropTypes.string
};
```

By adding `childContextTypes` and `getChildContext` to `MessageList` (the context provider), React passes the information down automatically and any component in the subtree (in this case, `Button`) can access it by defining `contextTypes`.

将`childContextTypes`和`getChildContext`添加到`MessageList`（作为上下文提供者）中，数据可以自动向下传递，其子树中定义`contextTypes`属性的组件（本例中是`Button`）都可以访问该数据。

If `contextTypes` is not defined, then `context` will be an empty object.

如果组件未定义`contextTypes`属性，则其`context`对象是空对象。

## 父子元素耦合（Parent-Child Coupling）

Context can also let you build an API where parents and children communicate. For example, one library that works this way is [React Router V4](https://reacttraining.com/react-router):

上下文也可以用来实现父子元素通信的API。比如，[React Router V4](https://reacttraining.com/react-router)库就基于这个原理工作：

```javascript
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
);
```

By passing down some information from the `Router` component, each `Link` and `Route` can communicate back to the containing `Router`.

`Router`组件可以向下传递数据，每一个`Link`和`Route`组件也可以将数据回传到包含它们的`Router`组件中。

Before you build components with an API similar to this, consider if there are cleaner alternatives. For example, you can pass entire React component as props if you'd like to.

当计划使用这类的API构建组件时，尽量思考一下有没有其他更清晰的替代方案。比如，是否可以传递整个React组件来实现需求？（编者按：后半句不太确切）

## 在生命周期方法中引用上下文（Referencing Context in Lifecycle Methods）

If `contextTypes` is defined within a component, the following [lifecycle methods](/react/docs/react-component.html#the-component-lifecycle) will receive an additional parameter, the `context` object:

对于拥有`contextTypes`属性的组件，其相关的[生命周期方法](/react/docs/react-component.html#the-component-lifecycle)会接收一个附加的`context`对象作为参数：

- [`constructor(props, context)`](/react/docs/react-component.html#constructor)
- [`componentWillReceiveProps(nextProps, nextContext)`](/react/docs/react-component.html#componentwillreceiveprops)
- [`shouldComponentUpdate(nextProps, nextState, nextContext)`](/react/docs/react-component.html#shouldcomponentupdate)
- [`componentWillUpdate(nextProps, nextState, nextContext)`](/react/docs/react-component.html#componentwillupdate)
- [`componentDidUpdate(prevProps, prevState, prevContext)`](/react/docs/react-component.html#componentdidupdate)

## 在无状态方法中引用上下文（Referencing Context in Stateless Functional Components）

Stateless functional components are also able to reference `context` if `contextTypes` is defined as a property of the function. The following code shows a `Button` component written as a stateless functional component.

定义了`contextTypes`属性的无状态函数式组件也可以引用`context`。下面是将`Button`组件用这种方式的重写。

```javascript
const PropTypes = require('prop-types');

const Button = ({children}, context) =>
  <button style={{'{{'}}background: context.color}}>
    {children}
  </button>;

Button.contextTypes = {color: PropTypes.string};
```

## 更新上下文（Updating Context）

Don't do it.

千万不要这样做。

React has an API to update context, but it is fundamentally broken and you should not use it.

React有一个更新上下文的API，但其基本上被破坏了（编者按：这句不准确），不应该使用它。

The `getChildContext` function will be called when the state or props changes. In order to update data in the context, trigger a local state update with `this.setState`. This will trigger a new context and changes will be received by the children.

当State或者Props更改的时候，`getChildContext`方法会被调用。可以使用`this.setState`来间接更新上下文，接收该上下文的子元素也会响应更新。

```javascript
const PropTypes = require('prop-types');

class MediaQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type:'desktop'};
  }

  getChildContext() {
    return {type: this.state.type};
  }

  componentDidMount() {
    const checkMediaQuery = () => {
      const type = window.matchMedia("(min-width: 1025px)").matches ? 'desktop' : 'mobile';
      if (type !== this.state.type) {
        this.setState({type});
      }
    };

    window.addEventListener('resize', checkMediaQuery);
    checkMediaQuery();
  }

  render() {
    return this.props.children;
  }
}

MediaQuery.childContextTypes = {
  type: PropTypes.string
};
```

The problem is, if a context value provided by component changes, descendants that use that value won't update if an intermediate parent returns `false` from `shouldComponentUpdate`. This is totally out of control of the components using context, so there's basically no way to reliably update the context. [This blog post](https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076) has a good explanation of why this is a problem and how you might get around it.

但问题是，如果使用了上下文组件的父组件中`shouldComponentUpdate`方法返回了`false`，则该子组件并不会被更新，如此以来并不能依赖上下文进行可靠的更新。[这篇博客](https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076)中介绍了这个问题的原因及解决方式。
