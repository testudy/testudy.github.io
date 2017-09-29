---
layout: post
title: React Native 23 - 指南：手势响应系统（Gesture Responder System）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/gesture-responder-system.html)

The gesture responder system manages the lifecycle of gestures in your app. A touch can go through several phases as the app determines what the user's intention is. For example, the app needs to determine if the touch is scrolling, sliding on a widget, or tapping. This can even change during the duration of a touch. There can also be multiple simultaneous touches.

手势响应系统用来管理应用程序中手势的生命周期。应用程序通过各阶段的不同触摸来确定用户行为——滑动、滚动、点击等。在触摸期间可以持续变化，也可以连续触发不同的操作。

The touch responder system is needed to allow components to negotiate these touch interactions without any additional knowledge about their parent or child components. This system is implemented in `ResponderEventPlugin.js`, which contains further details and documentation.

组件之间通过手势响应系统来协商交互操作，而不需要知道父组件或子组件的信息。该系统由`ResponderEventPlugin.js`实现，可以在这个文件中查看详细实现和文档。

### 最佳实践（Best Practices）

To make your app feel great, every action should have the following attributes:

- Feedback/highlighting- show the user what is handling their touch, and what will happen when they release the gesture
- Cancel-ability- when making an action, the user should be able to abort it mid-touch by dragging their finger away

These features make users more comfortable while using an app, because it allows people to experiment and interact without fear of making mistakes.

优秀的应用程序中每个操作都满足一下特点：

- 反馈/高亮——当用户操作的时候给予反馈，但用户操作完成的时候给予指示；
- 可取消——当执行一个操作的时候，将手指中途划出即可取消操作。

这样可以让用户使用应用程序的时候更舒服，因为用户不用担心自己将要犯错——试着来，不行就取消。

### 触摸高亮和可触摸操作（TouchableHighlight and Touchable*）

The responder system can be complicated to use. So we have provided an abstract `Touchable` implementation for things that should be "tappable". This uses the responder system and allows you to easily configure tap interactions declaratively. Use `TouchableHighlight` anywhere where you would use a button or link on web.

直接使用手势响应系统比较复杂，React Native抽象了`Touchable`以方便为组件添加“可交互”能力。可以在任何地方，像使用Web中的按钮和链接一样使用`TouchableHighlight`。。


## 响应生命周期（Responder Lifecycle）

A view can become the touch responder by implementing the correct negotiation methods. There are two methods to ask the view if it wants to become responder:

 - `View.props.onStartShouldSetResponder: (evt) => true,` - Does this view want to become responder on the start of a touch?
 - `View.props.onMoveShouldSetResponder: (evt) => true,` - Called for every touch move on the View when it is not the responder: does this view want to "claim" touch responsiveness?

在视图中实现下面的两个方法就可以处理触摸事件——获得响应器：

 - `View.props.onStartShouldSetResponder: (evt) => true,`——当视图上发生触摸的时候，自身是否需要获取响应器？
 - `View.props.onMoveShouldSetResponder: (evt) => true,`——当视图不是响应器的时候，每次移动都调用该方法询问：该视图是否“需要”获取响应器？

If the View returns true and attempts to become the responder, one of the following will happen:

 - `View.props.onResponderGrant: (evt) => {}` - The View is now responding for touch events. This is the time to highlight and show the user what is happening
 - `View.props.onResponderReject: (evt) => {}` - Something else is the responder right now and will not release it

如果视图需要变成一个响应器，下列两个事件之一会被触发：

 - `View.props.onResponderGrant: (evt) => {}`——当前视图成功获取了响应器，可以开始处理触摸事件。在这个方法中可以回馈用户响应，并且向用户展示发生的情况。
 - `View.props.onResponderReject: (evt) => {}`——当前视图获取响应器失败，当前响应器的拥有者没有释放。

If the view is responding, the following handlers can be called:

 - `View.props.onResponderMove: (evt) => {}` - The user is moving their finger
 - `View.props.onResponderRelease: (evt) => {}` - Fired at the end of the touch, ie "touchUp"
 - `View.props.onResponderTerminationRequest: (evt) => true` - Something else wants to become responder. Should this view release the responder? Returning true allows release
 - `View.props.onResponderTerminate: (evt) => {}` - The responder has been taken from the View. Might be taken by other views after a call to `onResponderTerminationRequest`, or might be taken by the OS without asking (happens with control center/ notification center on iOS)

当视图在响应状态的时候，下列事件处理器会被调用：

 - `View.props.onResponderMove: (evt) => {}`——手指移动操作；
 - `View.props.onResponderRelease: (evt) => {}`——停止触摸，即“touchUp”；
 - `View.props.onResponderTerminationRequest: (evt) => true`——其他组件请求获取响应器。当前组件如果可以释放响应器，可以返回真值；
 - `View.props.onResponderTerminate: (evt) => {}`——响应器已经从视图释放。可能是其他视图请求`onResponderTerminationRequest`，也可能是OS没有询问直接获取（比如iOS中的控制中心/消息中心）。

`evt` is a synthetic touch event with the following form:

 - `nativeEvent`
     + `changedTouches` - Array of all touch events that have changed since the last event
     + `identifier` - The ID of the touch
     + `locationX` - The X position of the touch, relative to the element
     + `locationY` - The Y position of the touch, relative to the element
     + `pageX` - The X position of the touch, relative to the root element
     + `pageY` - The Y position of the touch, relative to the root element
     + `target` - The node id of the element receiving the touch event
     + `timestamp` - A time identifier for the touch, useful for velocity calculation
     + `touches` - Array of all current touches on the screen

`evt`是一个合成的触摸事件，形式如下：

 - `nativeEvent`
     + `changedTouches`——从上次事件相应到现在发生变化的触摸事件；
     + `identifier`——触摸ID；
     + `locationX`——相对于触摸元素的X坐标；
     + `locationY`——相对于触摸元素的Y坐标；
     + `pageX`——相对于根元素的X坐标；
     + `pageY`——相对于根元素的Y坐标；
     + `target`——获得当前触摸事件的元素节点；
     + `timestamp`——触摸的事件标记，用于速度计算等；
     + `touches`——当前屏幕上的触摸点。

### 捕获事件处理（Capture ShouldSet Handlers）

`onStartShouldSetResponder` and `onMoveShouldSetResponder` are called with a bubbling pattern, where the deepest node is called first. That means that the deepest component will become responder when multiple Views return true for `*ShouldSetResponder` handlers. This is desirable in most cases, because it makes sure all controls and buttons are usable.

`onStartShouldSetResponder`和`onMoveShouldSetResponder`的调用使用事件冒泡模式，即最深的节点首先调用。也就是说当多个视图都要求获取响应器时，会由最深的组件获得。这在大多数情况下是可行的，也使得所有的控件和按钮都是可用的。

However, sometimes a parent will want to make sure that it becomes responder. This can be handled by using the capture phase. Before the responder system bubbles up from the deepest component, it will do a capture phase, firing `on*ShouldSetResponderCapture`. So if a parent View wants to prevent the child from becoming responder on a touch start, it should have a `onStartShouldSetResponderCapture` handler which returns true.

但是，在某些情况下，父组件需要获取响应器。这时候可以使用事件捕获模式。在最深的组件开始冒泡之前，经历了事件捕获阶段，会触发`on*ShouldSetResponderCapture`。如果父组件需要在触摸事件中需要获取响应器，只需要在`onStartShouldSetResponderCapture`返回真值即可。

 - `View.props.onStartShouldSetResponderCapture: (evt) => true,`
 - `View.props.onMoveShouldSetResponderCapture: (evt) => true,`

### PanResponder

For higher-level gesture interpretation, check out [PanResponder](https://facebook.github.io/react-native/docs/panresponder.html).

高级手势相应，请参考[PanResponder](https://facebook.github.io/react-native/docs/panresponder.html)。
