---
layout: post
title: React 22 - 引用和DOM（Refs and the DOM）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/refs-and-the-dom.html)

In the typical React dataflow, [props](https://facebook.github.io/react/docs/components-and-props.html) are the only way that parent components interact with their children. To modify a child, you re-render it with new props. However, there are a few cases where you need to imperatively modify a child outside of the typical dataflow. The child to be modified could be an instance of a React component, or it could be a DOM element. For both of these cases, React provides an escape hatch.

在典型的React数据流中，[Props](https://facebook.github.io/react/docs/components-and-props.)是父组件操作子组件的唯一方式。当需要修改一个子元素的时候，更新相关的Props重新渲染即可。但在个别情况下，需要直接修改子元素——可能是一个React组件，也可能是一个DOM元素。对于这两种情况，React提供了一个特殊的操作方法。

### 使用引用的时机（When to Use Refs）

There are a few good use cases for refs:

* Managing focus, text selection, or media playback.
* Triggering imperative animations.
* Integrating with third-party DOM libraries.

适合使用引用的案例如下：

* 管理输入框焦点，文本选择和媒体回放。
* 触发高性能动画。
* 集成第三方DOM库。

Avoid using refs for anything that can be done declaratively.

应该用声明的方式来解决问题，尽量避免使用引用。

For example, instead of exposing `open()` and `close()` methods on a `Dialog` component, pass an `isOpen` prop to it.

比如，在`Dialog`组件中用`isOpen`属性替代`open()`和`close()`方法。

### 千万不要滥用引用（Don't Overuse Refs）

Your first inclination may be to use refs to "make things happen" in your app. If this is the case, take a moment and think more critically about where state should be owned in the component hierarchy. Often, it becomes clear that the proper place to "own" that state is at a higher level in the hierarchy. See the [Lifting State Up](https://facebook.github.io/react/docs/lifting-state-up.html) guide for examples of this.

如果使用引用的首要目标是使用引用让App“流程工作”起来。遇到这种情况，建议花些时间思考一下这样做的危害，以及State被当前组件拥有是否合适。通常情况下，将State上移到更高的组件层级中问题可以被更明晰的解决。可以参考[状态提升](https://facebook.github.io/react/docs/lifting-state-up.html)中的示例来解决这个问题。

### 引用DOM元素（Adding a Ref to a DOM Element）

React supports a special attribute that you can attach to any component. The `ref` attribute takes a callback function, and the callback will be executed immediately after the component is mounted or unmounted.

React提供了一个可以附加到任何组件的特殊属性——`ref`属性值是一个回调函数，当组件加载或卸载的时候会立即被调用。

When the `ref` attribute is used on an HTML element, the `ref` callback receives the underlying DOM element as its argument. For example, this code uses the `ref` callback to store a reference to a DOM node:

当在一个HTML元素中使用`ref`属性时，`ref`的回调函数接收一个底层DOM元素作为其参数。比如，下面的代码使用`ref`回调函数将一个DOM节点的引用存储起来：

```javascript
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.focus = this.focus.bind(this);
  }

  focus() {
    // Explicitly focus the text input using the raw DOM API
    this.textInput.focus();
  }

  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={(input) => { this.textInput = input; }} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focus}
        />
      </div>
    );
  }
}
```

React will call the `ref` callback with the DOM element when the component mounts, and call it with `null` when it unmounts.

React在组件加载的时候将底层DOM元素作为参数调用`ref`回调函数，卸载的时候用`null`作为参数调用。

Using the `ref` callback just to set a property on the class is a common pattern for accessing DOM elements. The preferred way is to set the property in the `ref` callback like in the above example. There is even a shorter way to write it: `ref={input => this.textInput = input}`. 

常见的方式是使用`ref`回调函数将要访问的DOM元素设置到类属性上，推荐的方式是使用上例中的形式在`ref`回调中直接设置属性值，更简短的写法是：`ref={input => this.textInput = input}`。

### 引用类组件（Adding a Ref to a Class Component）

When the `ref` attribute is used on a custom component declared as a class, the `ref` callback receives the mounted instance of the component as its argument. For example, if we wanted to wrap the `CustomTextInput` above to simulate it being clicked immediately after mounting:

当在类声明的自定义组件上使用`ref`属性时， `ref`回调函数接收已挂载组件实例作为参数。比如，将上例中的`CustomTextInput`封装为挂载后立刻点击的效果：

```javascript
class AutoFocusTextInput extends React.Component {
  componentDidMount() {
    this.textInput.focus();
  }

  render() {
    return (
      <CustomTextInput
        ref={(input) => { this.textInput = input; }} />
    );
  }
}
```

Note that this only works if `CustomTextInput` is declared as a class:

注意只有当`CustomTextInput`用类形式来声明的时候才能正常工作：

```js
class CustomTextInput extends React.Component {
  // ...
}
```

### 引用和函数形式组件（Refs and Functional Components）

**You may not use the `ref` attribute on functional components** because they don't have instances:

**不能将`ref`属性应用在函数形式组件上**，原因是无法创建正确的组件实例：

```javascript
function MyFunctionalComponent() {
  return <input />;
}

class Parent extends React.Component {
  render() {
    // This will *not* work!
    return (
      <MyFunctionalComponent
        ref={(input) => { this.textInput = input; }} />
    );
  }
}
```

You should convert the component to a class if you need a ref to it, just like you do when you need lifecycle methods or state.

如果需要引用这个组件必须将其改为类形式，跟需要生命周期方法或状态时一样。

You can, however, **use the `ref` attribute inside a functional component** as long as you refer to a DOM element or a class component:

当然，**可以在函数形式组件内部正常使用`ref`属性**引用一个DOM元素或类组件：

```javascript
function CustomTextInput(props) {
  // textInput must be declared here so the ref callback can refer to it
  let textInput = null;

  function handleClick() {
    textInput.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={(input) => { textInput = input; }} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );  
}
```

### 将DOM引用暴露在父组件中（Exposing DOM Refs to Parent Components）

In rare cases, you might want to have access to a child's DOM node from a parent component. This is generally not recommended because it breaks component encapsulation, but it can occasionally be useful for triggering focus or measuring the size or position of a child DOM node.

在个别情况下，需要在父组件中访问子组件的DOM节点。通常不建议这样使用，因为这会破坏组件的封装，但在触发焦点、获取子DOM节点的尺寸和位置。

While you could [add a ref to to the child component](#adding-a-ref-to-a-class-component), this is not an ideal solution, as you would only get a component instance rather than a DOM node. Additionally, this wouldn't work with functional components.

虽然可以[引用一个子组件](#adding-a-ref-to-a-class-component)，但这并不是一个完美的解决方案，只能引用组件实例但引用不到DOM节点，而且对函数形式组件无效。

Instead, in such cases we recommend exposing a special prop on the child. The child would take a function prop with an arbitrary name (e.g. `inputRef`) and attach it to the DOM node as a `ref` attribute. This lets the parent pass its ref callback to the child's DOM node through the component in the middle.

这些问题的解决方案是，建议在子组件上暴露一个特殊的语义化的函数属性（比如：`inputRef`），并将其作为DOM节点中`ref`属性的值。这样父组件可以间接通过引用回调获得子组件的DOM节点。

This works both for classes and for functional components.

这种方式既适用于类形式组件，也适用于函数形式。

```javascript
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

In the example above, `Parent` passes its ref callback as an `inputRef` prop to the `CustomTextInput`, and the `CustomTextInput` passes the same function as a special `ref` attribute to the `<input>`. As a result, `this.inputElement` in `Parent` will be set to the DOM node corresponding to the `<input>` element in the `CustomTextInput`.

在上面的例子中，`Parent`组件将引用回调函数作为`inputRef`属性传入到`CustomTextInput`子组件中，`CustomTextInput`将该回调函数赋值给`<input>`元素中的相应`ref`属性。最终，`Parent`组件的`this.inputElement`属性将被设置为`CustomTextInput`中的`<input>`元素。

Note that the name of the `inputRef` prop in the above example has no special meaning, as it is a regular component prop. However, using the `ref` attribute on the `<input>` itself is important, as it tells React to attach a ref to its DOM node.

注意，上例中的`inputRef`属性并没有特殊的含义，只是一个普通的组件属性而已。当然，`<input>`元素中的`ref`属性是关键，告诉React将引用关联到它的DOM节点上。

This works even though `CustomTextInput` is a functional component. Unlike the special `ref` attribute which can [only be specified for DOM elements and for class components](#refs-and-functional-components), there are no restrictions on regular component props like `inputRef`.

这种形式也可以工作在函数形式定义的`CustomTextInput`组件上，不像`ref`属性[只能应用在DOM元素和类形式组件](#refs-and-functional-components)上，但组件上`inputRef`之类的普通属性并不存在使用限制。

Another benefit of this pattern is that it works several components deep. For example, imagine `Parent` didn't need that DOM node, but a component that rendered `Parent` (let's call it `Grandparent`) needed access to it. Then we could let the `Grandparent` specify the `inputRef` prop to the `Parent`, and let `Parent` "forward" it to the `CustomTextInput`:

这种形式的另外一个好处是可以引用多层嵌套的组件。比如，假设`Parent`组件不需要引用DOM节点，但渲染其的组件（称之为`Grandparent`组件）需要引用该DOM节点。那么可以在`Grandparent`组件中指定`Parent`的`inputRef`属性，`Parent`再将其传递到`CustomTextInput`中：

```javascript
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

function Parent(props) {
  return (
    <div>
      My input: <CustomTextInput inputRef={props.inputRef} />
    </div>
  );
}


class Grandparent extends React.Component {
  render() {
    return (
      <Parent
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

Here, the ref callback is first specified by `Grandparent`. It is passed to the `Parent` as a regular prop called `inputRef`, and the `Parent` passes it to the `CustomTextInput` as a prop too. Finally, the `CustomTextInput` reads the `inputRef` prop and attaches the passed function as a `ref` attribute to the `<input>`. As a result, `this.inputElement` in `Grandparent` will be set to the DOM node corresponding to the `<input>` element in the `CustomTextInput`.

这样，ref回调函数首先被`Grandparent`指定，传递给`Parent`的`inputRef`属性，`Parent`再通过属性将其传递给`CustomTextInput`。最终，`CustomTextInput`读取`inputRef`属性并将其付给`<input>`的`ref`属性。最终，`Grandparent`中的`this.inputElement`被设置为`CustomTextInput`组件中`<input>`对应的DOM节点。

All things considered, we advise against exposing DOM nodes whenever possible, but this can be a useful escape hatch. Note that this approach requires you to add some code to the child component. If you have absolutely no control over the child component implementation, your last option is to use [`findDOMNode()`](https://facebook.github.io/react/docs/react-dom.html#finddomnode), but it is discouraged.

虽然顾虑了所有的问题，但还是建议尽量不要暴露DOM节点，只是将其作为最后的实现手段。毕竟这需要在子组件中编码一些特定代码。如果真的需要控制子组件的实现，还有一个可用的办法是[`findDOMNode()`](https://facebook.github.io/react/docs/react-dom.html#finddomnode)，但这个方法也不鼓励使用。

### 遗留API：字符串引用（Legacy API: String Refs）

If you worked with React before, you might be familiar with an older API where the `ref` attribute is a string, like `"textInput"`, and the DOM node is accessed as `this.refs.textInput`. We advise against it because string refs have [some issues](https://github.com/facebook/react/pull/8333#issuecomment-271648615), are considered legacy, and **are likely to be removed in one of the future releases**. If you're currently using `this.refs.textInput` to access refs, we recommend the callback pattern instead.

如果之前你就在使用React，有可能看到过`ref`属性另外一种作为字符串使用的方式，赋值`"textInput"`之后，可以通过`this.refs.textInput`访问。但不建议使用这种方式，[存在一些问题](https://github.com/facebook/react/pull/8333#issuecomment-271648615)，在**未来的某个版本会被删除**。如果你正在使用这种方式，建议使用回调的方式替换。

### 警告（Caveats）

If the `ref` callback is defined as an inline function, it will get called twice during updates, first with `null` and then again with the DOM element. This is because a new instance of the function is created with each render, so React needs to clear the old ref and set up the new one. You can avoid this by defining the `ref` callback as a bound method on the class, but note that it shouldn't matter in most cases.

如果`ref`回调函数被定义为行内函数，将要被调用两次，第一次调用传递`null`，随后的调用传递DOM元素。这是因为每次渲染的时候一个新的实例被创建，所以React需要清理旧的引用并且设置新的节点。可以在类定义中通过绑定函数为`ref`回调赋值避免这个问题，但大多数情况下这不是问题。
