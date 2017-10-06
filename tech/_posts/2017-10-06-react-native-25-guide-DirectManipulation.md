---
layout: post
title: React Native 25 - 指南：直接操作（Direct Manipulation）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/direct-manipulation.html)

It is sometimes necessary to make changes directly to a component
without using state/props to trigger a re-render of the entire subtree.
When using React in the browser for example, you sometimes need to
directly modify a DOM node, and the same is true for views in mobile
apps. `setNativeProps` is the React Native equivalent to setting
properties directly on a DOM node.

在某些情况下，需要直接操作组件使其改变，而不是通过设置State/Props来触发整个子树的重新渲染。就像在浏览器中使用React时，有时候会直接操作DOM元素，在手机上的应用程序中有些视图也需要同样的操作。React Native中的`setNativeProps`等价于直接操作DOM元素。

> Use setNativeProps when frequent re-rendering creates a performance bottleneck
>
> 当频繁重新渲染导致性能瓶颈的时候，可以使用setNativeProps来进行优化。
>
> Direct manipulation will not be a tool that you reach for
> frequently; you will typically only be using it for creating
> continuous animations to avoid the overhead of rendering the component
> hierarchy and reconciling many views. `setNativeProps` is imperative
> and stores state in the native layer (DOM, UIView, etc.) and not
> within your React components, which makes your code more difficult to
> reason about. Before you use it, try to solve your problem with `setState`
> and [shouldComponentUpdate](http://facebook.github.io/react/docs/advanced-performance.html#shouldcomponentupdate-in-action).
>
> 直接操作不建议频繁使用；只有为了避免，连续的动画效果导致深层次渲染和多视图的差异比较，带来的性能问题时才需要使用。`setNativeProps`操作的状态直接存储在原生层（DOM，UIView等等），而不是存在React组件中，这会让代码变得稍微难以理解。在使用它之前，请优先使用`setState`和[shouldComponentUpdate](http://facebook.github.io/react/docs/advanced-performance.html#shouldcomponentupdate-in-action)来解决问题。

## TouchableOpacity与setNativeProps（setNativeProps with TouchableOpacity）

[TouchableOpacity](https://github.com/facebook/react-native/blob/master/Libraries/Components/Touchable/TouchableOpacity.js)
uses `setNativeProps` internally to update the opacity of its child
component:

[TouchableOpacity](https://github.com/facebook/react-native/blob/master/Libraries/Components/Touchable/TouchableOpacity.js)内部使用`setNativeProps`来更新子组件的透明度：

```javascript
setOpacityTo(value) {
  // Redacted: animation related code
  this.refs[CHILD_REF].setNativeProps({
    opacity: value
  });
},
```

This allows us to write the following code and know that the child will
have its opacity updated in response to taps, without the child having
any knowledge of that fact or requiring any changes to its implementation:

使得编写下面的代码变得很简单，当点击是子元素的透明度会发生变化，但子元素不用关心这个事儿，也不用为其特殊编码：

```javascript
<TouchableOpacity onPress={this._handlePress}>
  <View style={styles.button}>
    <Text>Press me!</Text>
  </View>
</TouchableOpacity>
```

Let's imagine that `setNativeProps` was not available. One way that we
might implement it with that constraint is to store the opacity value
in the state, then update that value whenever `onPress` is fired:

假如`setNativeProps`不可用，可以尝试用下面的方法来实现上面的需求，把透明度存储在当前组件的状态中，当`onPress`触发的时候更新其值：

```javascript
constructor(props) {
  super(props);
  this.state = { myButtonOpacity: 1, };
}

render() {
  return (
    <TouchableOpacity onPress={() => this.setState({myButtonOpacity: 0.5})}
                      onPressOut={() => this.setState({myButtonOpacity: 1})}>
      <View style={[styles.button, {opacity: this.state.myButtonOpacity}]}>
        <Text>Press me!</Text>
      </View>
    </TouchableOpacity>
  )
}
```

This is computationally intensive compared to the original example -
React needs to re-render the component hierarchy each time the opacity
changes, even though other properties of the view and its children
haven't changed. Usually this overhead isn't a concern but when
performing continuous animations and responding to gestures, judiciously
optimizing your components can improve your animations' fidelity.

这种计算属于计算密集型操作——每次透明度发生变化的时候，React都需要重新渲染组件，即使其他的特性没有发生变化也会重新渲染。在这个例子中不用担心这个问题，但是当连续的动画展示或者手势操作时，选择合适的方法可以提高动画的流畅度。

If you look at the implementation of `setNativeProps` in
[NativeMethodsMixin.js](https://github.com/facebook/react/blob/master/src/renderers/native/NativeMethodsMixin.js)
you will notice that it is a wrapper around `RCTUIManager.updateView` -
this is the exact same function call that results from re-rendering -
see [receiveComponent in
ReactNativeBaseComponent.js](https://github.com/facebook/react/blob/master/src/renderers/native/ReactNativeBaseComponent.js).

如果您查看过[NativeMethodsMixin.js](https://github.com/facebook/react/blob/master/src/renderers/native/NativeMethodsMixin.js)中的`setNativeProps`实现，应该注意到其只是`RCTUIMananger.updateView`的一层封装——和[ReactNativeBaseComponent.js中receiveComponent（按：V16中的方法名发生了变化，笔者尚未找到对应的方法名，本链接是V15版本的）](https://github.com/facebook/react/blob/v15.6.1/src/renderers/native/ReactNativeBaseComponent.js)重新渲染方法的调用完全一致。

## 复合组件与setNativeProps（Composite components and setNativeProps）

Composite components are not backed by a native view, so you cannot call
`setNativeProps` on them. Consider this example:

复合组件不是由本机直接支持的，不能在其本身调用`setNativeProps`。看一下下面的例子：

```javascript
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

class MyButton extends React.Component {
  render() {
    return (
      <View>
        <Text>{this.props.label}</Text>
      </View>
    )
  }
}

export default class App extends React.Component {
  render() {
    return (
      <TouchableOpacity>
        <MyButton label="Press me!" />
      </TouchableOpacity>
    )
  }
}
```

If you run this you will immediately see this error: `Touchable child
must either be native or forward setNativeProps to a native component`.
This occurs because `MyButton` isn't directly backed by a native view
whose opacity should be set. You can think about it like this: if you
define a component with `createReactClass` you would not expect to be
able to set a style prop on it and have that work - you would need to
pass the style prop down to a child, unless you are wrapping a native
component. Similarly, we are going to forward `setNativeProps` to a
native-backed child component.

上面的代码执行后会马上得到一个错误：`Touchable child must either be native or forward setNativeProps to a native component`。原因是`MyButton`组件不是有原生视图实现的，其不支持透明度的设置。可以这样想：如果用`createReactClass`创建一个组件，你并不会额外添加设置样式的特性，如果需要支持，就需要将样式特性传递给子组件，或者包装一个原生组件。同样的，将`setNativeProps`转发给一个原生的子组件。

#### 转发setNativeProps到子组件（Forward setNativeProps to a child）

All we need to do is provide a `setNativeProps` method on our component
that calls `setNativeProps` on the appropriate child with the given
arguments.

我们需要做的只是在组件中实现一个`setNativeProps`方法，并在其中用传入的参数调用合适的子组件的`setNativeProps`方法即可。

```javascript
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

class MyButton extends React.Component {
  setNativeProps = (nativeProps) => {
    this._root.setNativeProps(nativeProps);
  }

  render() {
    return (
      <View ref={component => this._root = component} {...this.props}>
        <Text>{this.props.label}</Text>
      </View>
    )
  }
}

export default class App extends React.Component {
  render() {
    return (
      <TouchableOpacity>
        <MyButton label="Press me!" />
      </TouchableOpacity>
    )
  }
}
```

You can now use `MyButton` inside of `TouchableOpacity`! A sidenote for
clarity: we used the [ref callback](https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute) syntax here, rather than the traditional string-based ref.

现在可以在`TouchableOpacity`中使用`MyButton`组件了！需要说明的一个细节是：这里使用了[引用回调](https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute)语法，相比传统基于字符串的引用更清晰。

You may have noticed that we passed all of the props down to the child
view using `{...this.props}`. The reason for this is that
`TouchableOpacity` is actually a composite component, and so in addition
to depending on `setNativeProps` on its child, it also requires that the
child perform touch handling. To do this, it passes on [various
props](https://facebook.github.io/react-native/docs/view.html#onmoveshouldsetresponder)
that call back to the `TouchableOpacity` component.
`TouchableHighlight`, in contrast, is backed by a native view and only
requires that we implement `setNativeProps`.

您应该注意到了我们使用`{...this.props}`将所有的特性向下传递给了子视图。原因是`TouchableOpacity`实际上是一个复合组件，不止依赖子组件的`setNativeProps`，也依赖子组件来处理触摸等事件，并回调`TouchableOpacity`组件的
[多种特性](https://facebook.github.io/react-native/docs/view.html#onmoveshouldsetresponder)。`TouchableHighlight`组件却是一个原生视图，在其内部使用的组件只需要实现`setNativeProps`即可。

## 用setNativeProps来清理TextInput值（setNativeProps to clear TextInput value）

Another very common use case of `setNativeProps` is to clear the value
of a TextInput. The `controlled` prop of TextInput can sometimes drop
characters when the `bufferDelay` is low and the user types very
quickly. Some developers prefer to skip this prop entirely and instead
use `setNativeProps` to directly manipulate the TextInput value when
necessary. For example, the following code demonstrates clearing the
input when you tap a button:

`setNativeProps`另一个常见的使用场景是清除TextInput的文本值。当`bufferDelay`较低并且用户输入较快时，如果在TextInput中使用`controlled`特性，则有可能会发生丢字的现象。这时候可以使用`setNativeProps`来直接操作TextInput值。如下例所示，当按一个按钮的时候会清除文本：

```javascript
import React from 'react';
import { TextInput, Text, TouchableOpacity, View } from 'react-native';

export default class App extends React.Component {
  clearText = () => {
    this._textInput.setNativeProps({text: ''});
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <TextInput
          ref={component => this._textInput = component}
          style={{height: 50, flex: 1, marginHorizontal: 20, borderWidth: 1, borderColor: '#ccc'}}
        />
        <TouchableOpacity onPress={this.clearText}>
          <Text>Clear text</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
```

## 避免和render方法冲突（Avoiding conflicts with the render function）

If you update a property that is also managed by the render function,
you might end up with some unpredictable and confusing bugs because
anytime the component re-renders and that property changes, whatever
value was previously set from `setNativeProps` will be completely
ignored and overridden.

如果您更新的特性同时由render方法管理，有可能最终会出现一些不可预测的Bug，因为无论何时，对应的特性发生变化并且组件重新渲染的时候，之前从`setNativeProps`设置的值将会被完全忽略或覆盖。

## setNativeProps & shouldComponentUpdate

By [intelligently applying
`shouldComponentUpdate`](https://facebook.github.io/react/docs/advanced-performance.html#avoiding-reconciling-the-dom)
you can avoid the unnecessary overhead involved in reconciling unchanged
component subtrees, to the point where it may be performant enough to
use `setState` instead of `setNativeProps`.

通过[巧妙的使用`shouldComponentUpdate`](https://facebook.github.io/react/docs/advanced-performance.html#avoiding-reconciling-the-dom)可以避免不必要的组件树的更改，这时候需要使用`setState`替代`setNativeProps`。

## 其他的原生方法（Other native methods）

The methods described here are available on most of the default components provided by React Native. Note, however, that they are *not* available on composite components that aren't directly backed by a native view. This will generally include most components that you define in your own app.

下面的方法在大多数React Native提供的原生组件中可用。需要注意的是，对于不是由React Native提供的复合组件，这些方法都*不*可使用，而大多数在应用程序中使用的都是复合组件。

### measure(callback)

Determines the location on screen, width, and height of the given view and returns the values via an async callback. If successful, the callback will be called with the following arguments:

确定指定的视图在屏幕上的位置，以及宽、高。如果获取成功，下列值会通过异步回调的形式返回：

* x
* y
* width
* height
* pageX
* pageY

Note that these measurements are not available until after the rendering has been completed in native. If you need the measurements as soon as possible, consider using the [`onLayout` prop](https://facebook.github.io/react-native/docs/view.html#onlayout) instead.

需要注意的是，该测量方法需要本地视图渲染完成之后才能使用。如果需要尽可能及时的测量视图尺寸，建议使用视图的[`onLayout` prop](https://facebook.github.io/react-native/docs/view.html#onlayout)特性替代。

### measureInWindow(callback)

Determines the location of the given view in the window and returns the values via an async callback. If the React root view is embedded in another native view, this will give you the absolute coordinates. If successful, the callback will be called with the following arguments:

确定指定的视图在窗口上的位置信息，结果会通过异步回调的形式返回。如果React根视图嵌套在其他的本地视图中，则会返回绝对坐标。如果获取成功，会返回下列参数：

* x
* y
* width
* height

### measureLayout(relativeToNativeNode, onSuccess, onFail)

Like `measure()`, but measures the view relative an ancestor, specified as `relativeToNativeNode`. This means that the returned x, y are relative to the origin x, y of the ancestor view.

跟`measure()`方法相似，但是返回值的坐标相对于指定的祖先节点，可以指定为`relativeToNativeNode`。就是说，返回的x、y是相对于祖先元素的位置。

As always, to obtain a native node handle for a component, you can use `ReactNative.findNodeHandle(component)`.

跟其他情况一样，也是使用`ReactNative.findNodeHandle(component)`获取组件的本地节点句柄。

### focus()

Requests focus for the given input or view. The exact behavior triggered will depend on the platform and type of view.

请求获取表单或视图的焦点，最终的行为取决于平台和视图类型。

### blur()

Removes focus from an input or view. This is the opposite of `focus()`.

从表单或视图上移除焦点，跟`focus()`的作用相反。
