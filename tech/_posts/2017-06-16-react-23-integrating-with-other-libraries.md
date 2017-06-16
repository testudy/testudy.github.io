---
layout: post
title: React 23 - 整合第三方库（Integrating with Other Libraries）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/integrating-with-other-libraries.html)

React can be used in any web application. It can be embedded in other applications and, with a little care, other applications can be embedded in React. This guide will examine some of the more common use cases, focusing on integration with [jQuery](https://jquery.com/) and [Backbone](http://backbonejs.org/), but the same ideas can be applied to integrating components with any existing code.

React可以用来开发任何Web应用，可以被集成在其他的应用中，做适当的工作也可以将其他应用集成在React中。下文主要以常见使用场景为例，主要介绍[jQuery](https://jquery.com/)和[Backbone](http://backbonejs.org/)的集成，但这种方式也可以应用到其他的现存代码中。

## 集成DOM操作插件（Integrating with DOM Manipulation Plugins）

React is unaware of changes made to the DOM outside of React. It determines updates based on its own internal representation, and if the same DOM nodes are manipulated by another library, React gets confused and has no way to recover.

React对外部的DOM修改操作无感知，其更新基于自己的内部表示，如果React生成的DOM节点被外部库修改，那么React并不能将其复原。

This does not mean it is impossible or even necessarily difficult to combine React with other ways of affecting the DOM, you just have to be mindful of what each are doing.

这并不是说将React与其他影响DOM的库集成是不可能的，或者难度很大的，只要清楚各项工作即可。

The easiest way to avoid conflicts is to prevent the React component from updating. You can do this by rendering elements that React has no reason to update, like an empty `<div />`.

避免因为React更新组件跟DOM操作产生冲突的最简单方式是，使用一个React不会主动更新的元素，比如空白`<div />`标签。

### 如何解决这个问题（How to Approach the Problem）

To demonstrate this, let's sketch out a wrapper for a generic jQuery plugin.

下面以常见的jQuery插件为例示范如何解决这个问题。

We will attach a [ref](https://facebook.github.io/react/docs/refs-and-the-dom.html) to the root DOM element. Inside `componentDidMount`, we will get a reference to it so we can pass it to the jQuery plugin.

可以将一个[ref](https://facebook.github.io/react/docs/refs-and-the-dom.html)绑定到根DOM元素上。在`componentDidMount`中，将获取到的引用传给jQuery插件。

To prevent React from touching the DOM after mounting, we will return an empty `<div />` from the `render()` method. The `<div />` element has no properties or children, so React has no reason to update it, leaving the jQuery plugin free to manage that part of the DOM:

为了避免React干扰DOM操作，在`render()`方法中返回不包含任何子元素和特性的空`<div />`，这样React没有任何理由更新该元素，完全交给jQuery插件来管理这部分DOM：

```js
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}
```

Note that we defined both `componentDidMount` and `componentWillUnmount` [lifecycle hooks](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle). Many jQuery plugins attach event listeners to the DOM so it's important to detach them in `componentWillUnmount`. If the plugin does not provide a method for cleanup, you will probably have to provide your own, remembering to remove any event listeners the plugin registered to prevent memory leaks.

注意上例中的`componentDidMount`和`componentWillUnmount`两个[生命周期方法](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle)。大多数jQuery插件会在DOM上附加事件监听，所以千万记得在`componentWillUnmout`方法中接触这些事件的绑定。如果插件没有提供响应的清除方法，必须自定义一个响应的清理方法，解绑插件的注册事件以避免内存泄露。

### 集成jQuery选择菜单插件（Integrating with jQuery Chosen Plugin）

For a more concrete example of these concepts, let's write a minimal wrapper for the plugin [Chosen](https://harvesthq.github.io/chosen/), which augments `<select>` inputs.

基于上面的概念完成一个更详细的例子，为增强`<select>`表单的[Chosen](https://harvesthq.github.io/chosen/)插件编写一个简单的包装器。

> **提醒（Note）:**
>
>Just because it's possible, doesn't mean that it's the best approach for React apps. We encourage you to use React components when you can. React components are easier to reuse in React applications, and often provide more control over their behavior and appearance.
>
> 并不鼓励在React应用中集成jQuery插件，应该在React应用中尽可能使用React组件。React组件在React应用中更易于重用，并且更容易控制其行为和展现。

First, let's look at what Chosen does to the DOM.

首先，了解一下Chosen在DOM中是怎么工作的。

If you call it on a `<select>` DOM node, it reads the attributes off of the original DOM node, hides it with an inline style, and then appends a separate DOM node with its own visual representation right after the `<select>`. Then it fires jQuery events to notify us about the changes.

Chosen插件工作在`<select>`DOM元素上，其读取原生DOM元素的属性，通过内联样式将其隐藏，然后在`<select>`追加一组新的DOM节点来展现新的样式。随后发生更改的时候会触发jQuery事件。

Let's say that this is the API we're striving for with our `<Chosen>` wrapper React component:

假如封装后的`<Chosen>`React组件如下所示：

```js
function Example() {
  return (
    <Chosen onChange={value => console.log(value)}>
      <option>vanilla</option>
      <option>chocolate</option>
      <option>strawberry</option>
    </Chosen>
  );
}
```

We will implement it as an [uncontrolled component](https://facebook.github.io/react/docs/uncontrolled-components.html) for simplicity.

其实现是一个简单的[非控制组件](https://facebook.github.io/react/docs/uncontrolled-components.html)。

First, we will create an empty component with a `render()` method where we return `<select>` wrapped in a `<div>`:

首先，创建一个空组件，`render()`方法的返回结果是一个用`<div>`包装起来的`<select>`：

```js
class Chosen extends React.Component {
  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

Notice how we wrapped `<select>` in an extra `<div>`. This is necessary because Chosen will append another DOM element right after the `<select>` node we passed to it. However, as far as React is concerned, `<div>` always only has a single child. This is how we ensure that React updates won't conflict with the extra DOM node appended by Chosen. It is important that if you modify the DOM outside of React flow, you must ensure React doesn't have a reason to touch those DOM nodes.

注意`<select>`包装在一个额外的`<div>`中。这在这个组件中是必须的，因为Chosen插件会在`<select>`节点之后插入其他的DOM元素。对React而言，`<div>`只是一个单一子元素而已。同时也确保React的更新操作不会影响Chosen追加的DOM节点——确保React修改DOM时，不会影响到该DOM之内的节点。

Next, we will implement the lifecycle hooks. We need to initialize Chosen with the ref to the `<select>` node in `componentDidMount`, and tear it down in `componentWillUnmount`:

下一步，实现生命周期方法，需要在`componentDidMount`方法中用`<select>`节点引用初始化Chosen，并且在`componentWillUnmount`方法中销毁：

```js
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/qmqeQx?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/qmqeQx?editors=0010)

Note that React assigns no special meaning to the `this.el` field. It only works because we have previously assigned this field from a `ref` in the `render()` method:

注意React中使用的`this.el`字段并没有特殊的意义，保持和`render()`方法中的`ref`字段使用一致即可：

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

This is enough to get our component to render, but we also want to be notified about the value changes. To do this, we will subscribe to the jQuery `change` event on the `<select>` managed by Chosen.

目前为止，对于组件的渲染已经足够了，但也需要监听值变化时发生的事件。为了实现这个功能，需要在jQuery对象上注册`change`事件。

We won't pass `this.props.onChange` directly to Chosen because component's props might change over time, and that includes event handlers. Instead, we will declare a `handleChange()` method that calls `this.props.onChange`, and subscribe it to the jQuery `change` event:

因为组件的props有可能随着时间的变化产生变化，所以不能将`this.props.onChange`事件处理函数直接传递给Chosen。而是需要定义一个`handleChange()`方法来调用`this.props.onChange`，并将其注册在jQuery的`change`事件上：

```js
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();

  this.handleChange = this.handleChange.bind(this);
  this.$el.on('change', this.handleChange);
}

componentWillUnmount() {
  this.$el.off('change', this.handleChange);
  this.$el.chosen('destroy');
}

handleChange(e) {
  this.props.onChange(e.target.value);
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/bWgbeE?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/bWgbeE?editors=0010)

Finally, there is one more thing left to do. In React, props can change over time. For example, the `<Chosen>` component can get different children if parent component's state changes. This means that at integration points it is important that we manually update the DOM in response to prop updates, since we no longer let React manage the DOM for us.

最后，还需要处理一件事。在React中，props会随着时间的变化而变化。比如，父组件的状态发生变化时，`<Chosen>`组件将获得不同的子元素。而React不会管理组件内部的DOM，所以当props发生变化时，需要手动更新相关的DOM：

Chosen's documentation suggests that we can use jQuery `trigger()` API to notify it about changes to the original DOM element. We will let React take care of updating `this.props.children` inside `<select>`, but we will also add a `componentDidUpdate()` lifecycle hook that notifies Chosen about changes in the children list:

Chosen的文档建议通过jQuery的`trigger()`API来通知原生DOM元素的变化。`<select>`元素内部的`this.props.children`由React维护，然后在`componentDidUpdate()`生命周期方法中通知Chosen更新子元素列表：

```js
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

This way, Chosen will know to update its DOM element when the `<select>` children managed by React change.

这样，当React更改了`<select>`的子元素时，Chosen将同步更新自身的DOM元素。

The complete implementation of the `Chosen` component looks like this:

完整的`Chosen`组件实现如下：

```js
class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger("chosen:updated");
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
    this.$el.chosen('destroy');
  }
  
  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/xdgKOz?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## 集成其他视图库（Integrating with Other View Libraries）

React can be embedded into other applications thanks to the flexibility of [`ReactDOM.render()`](https://facebook.github.io/react/docs/react-dom.html#render).

得益于[`ReactDOM.render()`](https://facebook.github.io/react/docs/react-dom.html#render)的能力，React可以嵌入到其他应用程序中。

Although React is commonly used at startup to load a single root React component into the DOM, `ReactDOM.render()` can also be called multiple times for independent parts of the UI which can be as small as a button, or as large as an app.

虽然启动时在DOM中加载单一的根React组件更常见，但`ReactDOM.render()`也可以被不同的UI部分，小到一个按钮，大到整个应用，分别独立调用多次。

In fact, this is exactly how React is used at Facebook. This lets us write applications in React piece by piece, and combine it with our existing server-generated templates and other client-side code.

事实上，这也是React在Facebook的使用方式。这样可以用React逐步的编写应用程序，并合并到现存的服务器端模板和客户端代码中。

### 用React替换基于字符串的渲染（Replacing String-Based Rendering with React）

A common pattern in older web applications is to describe chunks of the DOM as a string and insert it into the DOM like so: `$el.html(htmlString)`. These points in a codebase are perfect for introducing React. Just rewrite the string based rendering as a React component.

在过去的Web应用中，一种常见的模式是用一个字符串描述对应的DOM并将其插入到DOM中，比如：`$el.html(htmlString)`。这个点是非常适合用React替代的，将相关的基于字符串的渲染重写为一个React组件即可。

So the following jQuery implementation...

jQuery版本的实现如下...

```js
$('#container').html('<button id="btn">Say Hello</button>');
$('#btn').click(function() {
  alert('Hello!');
});
```

...could be rewritten using a React component:

...用React组件重写后如下：

```js
function Button() {
  return <button id="btn">Say Hello</button>;
}

ReactDOM.render(
  <Button />,
  document.getElementById('container'),
  function() {
    $('#btn').click(function() {
      alert('Hello!');
    });
  }
);
```

From here you could start moving more logic into the component and begin adopting more common React practices. For example, in components it is best not to rely on IDs because the same component can be rendered multiple times. Instead, we will use the [React event system](https://facebook.github.io/react/docs/handling-events.html) and register the click handler directly on the React `<button>` element:

此后可以逐步迁移更多的逻辑到组件中，并逐渐引入React的最佳实践。例如，由于组件会渲染多次，在其中使用ID属性是非常不合适的。使用[React事件系统](https://facebook.github.io/react/docs/handling-events.html)在React中的`<button>`元素上直接绑定事件处理：

```js
function Button(props) {
  return <button onClick={props.onClick}>Say Hello</button>;
}

function HelloButton() {
  function handleClick() {
    alert('Hello!');
  }
  return <Button onClick={handleClick} />;
}

ReactDOM.render(
  <HelloButton />,
  document.getElementById('container')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/RVKbvW?editors=1010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/RVKbvW?editors=1010)

You can have as many such isolated components as you like, and use `ReactDOM.render()` to render them to different DOM containers. Gradually, as you convert more of your app to React, you will be able to combine them into larger components, and move some of the `ReactDOM.render()` calls up the hierarchy.

可以像上面这样从应用中逐步分离出独立的组件，使用`ReactDOM.render()`将其渲染到不懂的DOM容器中。逐渐的，当应用中更多的部分迁移到React时，可以将这些组件合并为更大的组件，用组件嵌套代替原来的`ReactDOM.render()`调用。

### 嵌入React到Backbone视图中（Embedding React in a Backbone View）

[Backbone](http://backbonejs.org/) views typically use HTML strings, or string-producing template functions, to create the content for their DOM elements. This process, too, can be replaced with rendering a React component.

[Backbone](http://backbonejs.org/)视图是典型的HTML字符串模板，通过模板方法为DOM元素创建内容。这个过程，也可以使用React组件来渲染。

Below, we will create a Backbone view called `ParagraphView`. It will override Backbone's `render()` function to render a React `<Paragraph>` component into the DOM element provided by Backbone (`this.el`). Here, too, we are using [`ReactDOM.render()`](https://facebook.github.io/react/docs/react-dom.html#render):

下面会创建一个`ParagraphView`视图，在`render()`方法中渲染一个`<Paragraph>`组件到Backbone提供的`this.el`DOM元素中。这里使用的也是[`ReactDOM.render()`](https://facebook.github.io/react/docs/react-dom.html#render)方法。

```js
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    const text = this.model.get('text');
    ReactDOM.render(<Paragraph text={text} />, this.el);
    return this;
  },
  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    Backbone.View.prototype.remove.call(this);
  }
});
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/gWgOYL?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/gWgOYL?editors=0010)

It is important that we also call `ReactDOM.unmountComponentAtNode()` in the `remove` method so that React unregisters event handlers and other resources associated with the component tree when it is detached.

在`remove`方法中调用`ReactDOM.unmountComponentAtNode()`方法将React卸载——事件解绑，并释放其他资源是非常重要的。

When a component is removed *from within* a React tree, the cleanup is performed automatically, but because we are removing the entire tree by hand, we must call it this method.

当组件从React树*内部*删除时，清除的工作是自动进行的，但现在手动移除了整棵树，必须主动调用一下这个方法。

## 集成Model层（Integrating with Model Layers）

While it is generally recommended to use unidirectional data flow such as [React state](https://facebook.github.io/react/docs/lifting-state-up.html), [Flux](http://facebook.github.io/flux/), or [Redux](http://redux.js.org/), React components can use a model layer from other frameworks and libraries.

虽然通常情况下单向数据流，比如[React状态](https://facebook.github.io/react/docs/lifting-state-up.html)，[Flux](http://facebook.github.io/flux/)，或者[Redux](http://redux.js.org/)，但React组件也可以使用其他框架或库中的模型层。

### 在React组件中使用Backbone Model（Using Backbone Models in React Components）

The simplest way to consume [Backbone](http://backbonejs.org/) models and collections from a React component is to listen to the various change events and manually force an update.

在React组件中使用[Backbone](http://backbonejs.org/)模型和集合最简单的方式是监听响应的变化事件并进行强制更新。

Components responsible for rendering models would listen to `'change'` events, while components responsible for rendering collections would listen for `'add'` and `'remove'` events. In both cases, call [`this.forceUpdate()`](https://facebook.github.io/react/docs/react-component.html#forceupdate) to rerender the component with the new data.

渲染模型的组件需要监听`'change'`事件，渲染集合的组件需要监听`'add'`和`'remove'`事件。在所有的案例中，需要调用[`this.forceUpdate()`](https://facebook.github.io/react/docs/react-component.html#forceupdate)来使用新数据渲染组件。

In the example below, the `List` component renders a Backbone collection, using the `Item` component to render individual items.

下面的例子中，`List`组件渲染Backbone集合，`Item`组件渲染具体项目。

```js
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/GmrREm?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/GmrREm?editors=0010)

### 从Backbone模型中提取数据（Extracting Data from Backbone Models）

The approach above requires your React components to be aware of the Backbone models and collections. If you later plan to migrate to another data management solution, you might want to concentrate the knowledge about Backbone in as few parts of the code as possible.

上面的例子中React组件和Backbone的模型和集合产生了紧耦合。如果随后需要改变数据管理方案，代码中的耦合部分越少越好。

One solution to this is to extract the model's attributes as plain data whenever it changes, and keep this logic in a single place. The following is [a higher-order component](https://facebook.github.io/react/docs/higher-order-components.html) that extracts all attributes of a Backbone model into state, passing the data to the wrapped component.

一个可行的解决方案是当模型变化时将其属性提取到简单对象中，并且将这个逻辑集中在同一个地方。下面是一个将Backbone模型的所有属性提取到状态中的[高阶组件](https://facebook.github.io/react/docs/higher-order-components.html)，将数据传入被包装的组件中。

This way, only the higher-order component needs to know about Backbone model internals, and most components in the app can stay agnostic of Backbone.

这样一来，只有高阶组件和Backbone模型产生了耦合，大多数组件将和Backbone保持彼此独立。

In the example below, we will make a copy of the model's attributes to form the initial state. We subscribe to the `change` event (and unsubscribe on unmounting), and when it happens, we update the state with the model's current attributes. Finally, we make sure that if the `model` prop itself changes, we don't forget to unsubscribe from the old model, and subscribe to the new one.

在下面的例子中，将从模型的内部属性中创建一份拷贝。注册`change`事件（并在卸载生命周期方法中将其取消注册）并根据模型的属性更新状态。另外，需要保证当`model`属性自身发生变化时，需要取消旧模型的注册，并在新模型上注册。

Note that this example is not meant to be exhaustive with regards to working with Backbone, but it should give you an idea for how to approach this in a generic way:

注意这个例子只是和Backbone集成工作的演示，只是为你提供了一个如何对这类问题的通用想法：

```js
function connectToBackboneModel(WrappedComponent) {
  return class BackboneComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = Object.assign({}, props.model.attributes);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.props.model.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps.model.attributes));
      if (nextProps.model !== this.props.model) {
        this.props.model.off('change', this.handleChange);
        nextProps.model.on('change', this.handleChange);
      }
    }

    componentWillUnmount() {
      this.props.model.off('change', this.handleChange);
    }

    handleChange(model) {
      this.setState(model.changedAttributes());
    }

    render() {
      const propsExceptModel = Object.assign({}, this.props);
      delete propsExceptModel.model;
      return <WrappedComponent {...propsExceptModel} {...this.state} />;
    }
  }
}
```

To demonstrate how to use it, we will connect a `NameInput` React component to a Backbone model, and update its `firstName` attribute every time the input changes:

下面演示了如何使用上面的高阶组件，将`NameInput`组件和Backbone模型连接起来，当输入变化的时候更新其`firstName`属性：

```js
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      My name is {props.firstName}.
    </p>
  );
}

const BackboneNameInput = connectToBackboneModel(NameInput);

function Example(props) {
  function handleChange(e) {
    model.set('firstName', e.target.value);
  }

  return (
    <BackboneNameInput
      model={props.model}
      handleChange={handleChange}
    />
  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
ReactDOM.render(
  <Example model={model} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/PmWwwa?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/PmWwwa?editors=0010)

This technique is not limited to Backbone. You can use React with any model library by subscribing to its changes in the lifecycle hooks and, optionally, copying the data into the local React state.

这种技术不止局限于Backbone，也可以在React生命周期事件中订阅其他模型库的模型变化，并将数据拷贝到本地React状态中。
