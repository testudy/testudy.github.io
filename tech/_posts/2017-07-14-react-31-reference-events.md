---
layout: post
title: React 31 - 合成事件（SyntheticEvent）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/events.html)

This reference guide documents the `SyntheticEvent` wrapper that forms part of React's Event System. See the [Handling Events](https://facebook.github.io/react/docs/handling-events.html) guide to learn more.

本篇`SyntheticEvent`参考指南是React事件系统的一部分。查看[事件处理](https://facebook.github.io/react/docs/handling-events.html)学习更多事件处理的细节。

## 概述（Overview）

Your event handlers will be passed instances of `SyntheticEvent`, a cross-browser wrapper around the browser's native event. It has the same interface as the browser's native event, including `stopPropagation()` and `preventDefault()`, except the events work identically across all browsers.

事件处理函数接收的`SyntheticEvent`对象实例参数，是对浏览器原生事件的跨浏览器封装，其接口和浏览器原生事件一致，也有`stopPropagation()`和`preventDefault()`方法，但磨平了浏览器之间的差异。

If you find that you need the underlying browser event for some reason, simply use the `nativeEvent` attribute to get it. Every `SyntheticEvent` object has the following attributes:

如果在某些情况下需要使用底层的浏览器原生事件，通过`nativeEvent`属性读取即可。每一个`SyntheticEvent`对象实例包含下列属性：

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
DOMEventTarget target
number timeStamp
string type
```

> 提醒（Note）：
>
> As of v0.14, returning `false` from an event handler will no longer stop event propagation. Instead, `e.stopPropagation()` or `e.preventDefault()` should be triggered manually, as appropriate.
>
> 从v0.14开始，事件处理函数返回`false`不再会阻止事件传播，而是需要显式的调用`e.stopPropagation()`或`e.preventDefault()`函数。

### 事件池（Event Pooling）

The `SyntheticEvent` is pooled. This means that the `SyntheticEvent` object will be reused and all properties will be nullified after the event callback has been invoked.
This is for performance reasons.
As such, you cannot access the event in an asynchronous way.

为了获得更好的性能，`SyntheticEvent`基于事件池复用实例，在回调事件调用后`SyntheticEvent`对象会被清空。也因为这个原因，不能以异步的方式访问事件对象。

```javascript
function onClick(event) {
  console.log(event); // => nullified object.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // Won't work. this.state.clickEvent will only contain null values.
  this.setState({clickEvent: event});

  // You can still export event properties.
  this.setState({eventType: event.type});
}
```

> 提醒（Note）：
>
> If you want to access the event properties in an asynchronous way, you should call `event.persist()` on the event, which will remove the synthetic event from the pool and allow references to the event to be retained by user code.
>
> 如果有异步访问事件对象的需求，需要调用事件对象的`event.persist()`方法，以将该事件对象对事件池中移除，使得可以在其他逻辑代码中访问。

## 支持的事件（Supported Events）

React normalizes events so that they have consistent properties across different browsers.

React将事件规范化，实现跨浏览器的属性调用。

The event handlers below are triggered by an event in the bubbling phase. To register an event handler for the capture phase, append `Capture` to the event name; for example, instead of using `onClick`, you would use `onClickCapture` to handle the click event in the capture phase.

下列事件在事件冒泡阶段触发，如果需要在事件捕获阶段注册事件，在下列事件名后面添加`Capture`后缀即可。比如，使用`onClickCapture`代替`onClick`，可以在事件捕获阶段处理事件。

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
- [Mouse Events](#mouse-events)
- [Selection Events](#selection-events)
- [Touch Events](#touch-events)
- [UI Events](#ui-events)
- [Wheel Events](#wheel-events)
- [Media Events](#media-events)
- [Image Events](#image-events)
- [Animation Events](#animation-events)
- [Transition Events](#transition-events)
- [Other Events](#other-events)

* * *

## 参考（Reference）

### Clipboard Events

Event names:

```
onCopy onCut onPaste
```

Properties:

```javascript
DOMDataTransfer clipboardData
```

* * *

### Composition Events

Event names:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

Properties:

```javascript
string data

```

* * *

### Keyboard Events

Event names:

```
onKeyDown onKeyPress onKeyUp
```

Properties:

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

* * *

### Focus Events

Event names:

```
onFocus onBlur
```

These focus events work on all elements in the React DOM, not just form elements.

Focus事件作用在所有的React管理的DOM元素上，而不仅仅是表单元素。

Properties:

```javascript
DOMEventTarget relatedTarget
```

* * *

### Form Events

Event names:

```
onChange onInput onSubmit
```

For more information about the onChange event, see [Forms](https://facebook.github.io/react/docs/forms.html).

更多关于onChange事件的信息，请查看[Forms](https://facebook.github.io/react/docs/forms.html)。

* * *

### Mouse Events

Event names:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

The `onMouseEnter` and `onMouseLeave` events propagate from the element being left to the one being entered instead of ordinary bubbling and do not have a capture phase.

`onMouseEnter`和`onMouseLeave`事件是从一个元素移动到另一个元素，不进行事件的冒泡，也不进行事件捕获。

Properties:

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### Selection Events

Event names:

```
onSelect
```

* * *

### Touch Events

Event names:

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

Properties:

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### UI Events

Event names:

```
onScroll
```

Properties:

```javascript
number detail
DOMAbstractView view
```

* * *

### Wheel Events

Event names:

```
onWheel
```

Properties:

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### Media Events

Event names:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Image Events

Event names:

```
onLoad onError
```

* * *

### Animation Events

Event names:

```
onAnimationStart onAnimationEnd onAnimationIteration
```

Properties:

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### Transition Events

Event names:

```
onTransitionEnd
```

Properties:

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### Other Events

Event names:

```
onToggle
```
