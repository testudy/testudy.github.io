---
layout: post
title: React Native 20 - 指南：定时器（Timers）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/timers.html)

Timers are an important part of an application and React Native implements the [browser timers](https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Timers).

计时器是应用程序的重要组成部分，React Native实现了[浏览器的定时器](https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Timers)。

## 定时器（Timers）

- setTimeout, clearTimeout
- setInterval, clearInterval
- setImmediate, clearImmediate
- requestAnimationFrame, cancelAnimationFrame

`requestAnimationFrame(fn)` is not the same as `setTimeout(fn, 0)` - the former will fire after all the frame has flushed, whereas the latter will fire as quickly as possible (over 1000x per second on a iPhone 5S).

`requestAnimationFrame(fn)`不等价于`setTimeout(fn, 0)`——前者在刷新所有帧后调用，而后者会尽可能快的调用（在iPhone 5S上每秒钟调用1000次以上）。

`setImmediate` is executed at the end of the current JavaScript execution block, right before sending the batched response back to native. Note that if you call `setImmediate` within a `setImmediate` callback, it will be executed right away, it won't yield back to native in between.

`setImmediate`在当前JavaScript执行块执行完成之后立即执行，并将执行结果批量发送给本地代码。需要注意的是如果在`setImmediate`内部调用`setImmediate`方法，会立即执行，而不会等本地代码响应之后二次发送。

The `Promise` implementation uses `setImmediate` as its asynchronicity primitive.

`Promise`的内部实现基于`setImmediate`方法。


## 交互管理器（InteractionManager）

One reason why well-built native apps feel so smooth is by avoiding expensive operations during interactions and animations. In React Native, we currently have a limitation that there is only a single JS execution thread, but you can use `InteractionManager` to make sure long-running work is scheduled to start after any interactions/animations have completed.

优秀的应用程序之所以体验顺畅，很重要的一个原因就是避免了用户操作时和动画过程中进行昂贵的计算。在React Native中，有一个很大的限制是，只有一个JS执行线程，但是可以借助`InteractionManager`方法以将需要长时间运行的计算安排在交互和动画完成之后执行。

Applications can schedule tasks to run after interactions with the following:

如下所示，应用程序会将任务执行安排在交互动画之后：

```javascript
InteractionManager.runAfterInteractions(() => {
   // ...long-running synchronous task...
});
```

Compare this to other scheduling alternatives:

- requestAnimationFrame(): for code that animates a view over time.
- setImmediate/setTimeout/setInterval(): run code later, note this may delay animations.
- runAfterInteractions(): run code later, without delaying active animations.

对比其他的任务调度方式：

- requestAnimationFrame()：伴随动画执行；
- setImmediate/setTimeout/setInterval()：延后执行，注意可能延迟动画；
- runAfterInteractions()：延后执行，不会延迟执行中的动画。

The touch handling system considers one or more active touches to be an 'interaction' and will delay `runAfterInteractions()` callbacks until all touches have ended or been cancelled.

触摸处理系统会把一个或多个触摸操作视为“交互”，并将`runAfterInteractions()`的回调延迟到所有的触摸结束或者被取消后调用。

InteractionManager also allows applications to register animations by creating an interaction 'handle' on animation start, and clearing it upon completion:

交互管理器允许应用程序通过创建一个交互`处理`来注册一个动画，并在处理完成时将其清除。

```javascript
var handle = InteractionManager.createInteractionHandle();
// run animation... (`runAfterInteractions` tasks are queued)
// later, on animation completion:
InteractionManager.clearInteractionHandle(handle);
// queued tasks run if all handles were cleared
```


## TimerMixin

We found out that the primary cause of fatals in apps created with React Native was due to timers firing after a component was unmounted. To solve this recurring issue, we introduced `TimerMixin`. If you include `TimerMixin`, then you can replace your calls to `setTimeout(fn, 500)` with `this.setTimeout(fn, 500)` (just prepend `this.`) and everything will be properly cleaned up for you when the component unmounts.

造成React Native应用程序致命错误的一个主要原因是，组件卸载之后定时器被调用。为了解决这个问题，下面介绍一下`TimerMixin`。引入`TimerMixin`之后，可以使用`this.setTimeout(fn, 500)`来代替`setTimeout(fn, 500)`，只需要在调用前添加`this.`即可，所有的定时器会在组件卸载时清除。

This library does not ship with React Native - in order to use it on your project, you will need to install it with `npm i react-timer-mixin --save` from your project directory.

React Native中不包含这个库——如果需要在项目中使用，需要将其安装在项目目录中`npm i react-timer-mixin --save`。

```javascript
import TimerMixin from 'react-timer-mixin';

var Component = createReactClass({
  mixins: [TimerMixin],
  componentDidMount: function() {
    this.setTimeout(
      () => { console.log('I do not leak!'); },
      500
    );
  }
});
```

This will eliminate a lot of hard work tracking down bugs, such as crashes caused by timeouts firing after a component has been unmounted.

这将清理掉很多难以追踪的bug，比如组件卸载之后定时器调用引起的应用程序崩溃。

Keep in mind that if you use ES6 classes for your React components [there is no built-in API for mixins](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#mixins). To use `TimerMixin` with ES6 classes, we recommend [react-mixin](https://github.com/brigand/react-mixin).

注意，使用ES6类语法创建的React组件，[不存在内置的Mixin API](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#mixins)，建议引入[react-mixin](https://github.com/brigand/react-mixin)在ES6的类语法使用`TimerMixin`。
