---
layout: post
title: React Native 18 - 指南：动画（Animations）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/animations.html)

Animations are very important to create a great user experience. Stationary objects must overcome inertia as they start moving. Objects in motion have momentum and rarely come to a stop immediately. Animations allow you to convey physically believable motion in your interface.

动画对于创建优秀的用户体验来说非常重要。动画应该遵循基本的物理定律，物体的运动不会突然开始，在惯性的作用下也不会立即停下来。

React Native provides two complementary animation systems: [`Animated`](#animated-api) for granular and interactive control of specific values, and [`LayoutAnimation`](#layoutanimation-api) for animated global layout transactions.

React Native提供了两套相互补充的动画系统：
基于值处理组件交互动画的[`Animated`](#animated-api)和
处理整体布局过渡的[`LayoutAnimation`](#layoutanimation)。


## `Animated` API

The [`Animated`](/tech/2018/03/13/react-native-37-api-animated.html) API is designed to make it very easy to concisely express a wide variety of interesting animation and interaction patterns in a very performant way. `Animated` focuses on declarative relationships between inputs and outputs, with configurable transforms in between, and simple `start`/`stop` methods to control time-based animation execution.

[`Animated`](/tech/2018/03/13/react-native-37-api-animated.html) API 使用一种简洁、高效的方式来创建丰富的动画和良好的交互模式。`Animated` 声明输入和输出之间的关系，并设置变换的过程，最后通过简单的`start/stop`方法来控制时序动画的执行。


`Animated` exports four animatable component types: `View`, `Text`, `Image`, and `ScrollView`, but you can also create your own using `Animated.createAnimatedComponent()`.

`Animated`内置四种动画组件：`View`，`Text`，`Image` 和 `ScrollView`，也可以使用 `Animated.createAnimatedComponent()` 来创建需要的组件。

For example, a container view that fades in when it is mounted may look like this:

如下例所示，组件加载时的渐入效果编码如下：

```javascript
import React from 'react';
import { Animated, Text, View } from 'react-native';

class FadeInView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
  }

  componentDidMount() {
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 10000,              // Make it take a while
      }
    ).start();                        // Starts the animation
  }

  render() {
    let { fadeAnim } = this.state;

    return (
      <Animated.View                 // Special animatable View
        style={{"{{"}}
          ...this.props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

// You can then use your `FadeInView` in place of a `View` in your components:
export default class App extends React.Component {
  render() {
    return (
      <View style={{"{{"}}flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <FadeInView style={{"{{"}}width: 250, height: 50, backgroundColor: 'powderblue'}}>
          <Text style={{"{{"}}fontSize: 28, textAlign: 'center', margin: 10}}>Fading in</Text>
        </FadeInView>
      </View>
    )
  }
}
```

Let's break down what's happening here. In the `FadeInView` constructor, a new `Animated.Value` called `fadeAnim` is initialized as part of `state`. The opacity property on the `View` is mapped to this animated value. Behind the scenes, the numeric value is extracted and used to set opacity.

分析一下上面示例的原理，在`FadeInView`的构造函数中，实例化`Animated.Value`对象`fadeAnim`，作为`state`的一部分。并在`View`组件中中将透明属性映射到这个值，其值被提取出来用于透明度。

When the component mounts, the opacity is set to 0. Then, an easing animation is started on the `fadeAnim` animated value, which will update all of its dependent mappings (in this case, just the opacity) on each frame as the value animates to the final value of 1.

当组件加载后，透明度设置为0。随后渐变动画用于`fadeAnim`，并在每帧渲染中更新相关的映射依赖（在上面的例子中是透明度），直到最终值为1为止。

This is done in an optimized way that is faster than calling `setState` and re-rendering.  
Because the entire configuration is declarative, we will be able to implement further optimizations that serialize the configuration and runs the animation on a high-priority thread.

通过调用`setState`和重绘的方式来完成，全部代码通过声明的方式来完成，后续可以通过更改配置将其运行在更高优先级的线程上。

### 动画配置（Configuring animations）

Animations are heavily configurable. Custom and predefined easing functions, delays, durations, decay factors, spring constants, and more can all be tweaked depending on the type of animation.

动画提供了强大的可配置性，可以自定义，或者使用预定义的缓动函数、延迟、持续时间、衰减因子、弹性常量等，根据动画的类型进行调整。

`Animated` provides several animation types, the most commonly used one being [`Animated.timing()`](/tech/2018/03/13/react-native-37-api-animated.html#timing). It supports animating a value over time using one of various predefined easing functions, or you can use your own. Easing functions are typically used in animation to convey gradual acceleration and deceleration of objects.

`Animated`提供了多种动画类型，最常见的是[`Animated.timing()`](/tech/2018/03/13/react-native-37-api-animated.html#timing)。它支持多种基于时序的预定义缓动函数，可以自定义实现。缓动函数用来实现对象的加速和减速。

By default, `timing` will use a easeInOut curve that conveys gradual acceleration to full speed and concludes by gradually decelerating to a stop. You can specify a different easing function by passing a `easing` parameter. Custom `duration` or even a `delay` before the animation starts is also supported.

默认情况下，`timing`使用渐进渐出的动画效果——逐渐加速到全速进入，逐渐减速到停止动画。为`easing`付不同的参数，可以执行不同的缓动函数，也可以为动画设置 `duration` 和 `delay`。

For example, if we want to create a 2-second long animation of an object that slightly backs up before moving to its final position:

如下例所示，创建一个2秒时间，用Back效果结束的动画：

```javascript
Animated.timing(this.state.xPosition, {
  toValue: 100,
  easing: Easing.back(),
  duration: 2000,
}).start();
```

Take a look at the [Configuring animations](/tech/2018/03/13/react-native-37-api-animated.html#configuring-animations) section of the `Animated` API reference to learn more about all the config parameters supported by the built-in animations.

详见`Animated`中的[动画配置](/tech/2018/03/13/react-native-37-api-animated.html#configuring-animations)，了解更多的动画配置。

### 动画组合（Composing animations）

Animations can be combined and played in sequence or in parallel. Sequential animations can play immediately after the previous animation has finished, or they can start after a specified delay. The `Animated` API provides several methods, such as `sequence()` and `delay()`, each of which simply take an array of animations to execute and automatically calls `start()`/`stop()` as needed.

多个动画可以组合起来，以串行或者并行的方式执行。串行动画是一个接着一个自动执行，中间可以设置一些延迟。`Animated` API提供了 `sequence()` 和 `delay()` 等方法，可以将他们组合成数组，调用`start()`/`stop()`来自动执行。

For example, the following animation coasts to a stop, then it springs back while twirling in parallel:

如下例所示，下面的动画惯性停止，随后以Back和旋转并行的方式返回：

```javascript
Animated.sequence([
  // decay, then spring to start and twirl
  Animated.decay(position, {
    // coast to a stop
    velocity: {x: gestureState.vx, y: gestureState.vy}, // velocity from gesture release
    deceleration: 0.997,
  }),
  Animated.parallel([
    // after decay, in parallel:
    Animated.spring(position, {
      toValue: {x: 0, y: 0}, // return to start
    }),
    Animated.timing(twirl, {
      // and twirl
      toValue: 360,
    }),
  ]),
]).start(); // start the sequence group
```

If one animation is stopped or interrupted, then all other animations in the group are also stopped. `Animated.parallel` has a `stopTogether` option that can be set to `false` to disable this.

一组中的一个动画停止或中止之后，同组的其他动画也会停止。`Animated.parallel`有一个`stopTogether`选项，将其设置为`false`，可以禁用这种效果。

You can find a full list of composition methods in the [Composing animations](/tech/2018/03/13/react-native-37-api-animated.html#composing-animations) section of the `Animated` API reference.

详见`Animated`中的[动画组合](/tech/2018/03/13/react-native-37-api-animated.html#composing-animations)，了解更多的动画组合。

### 动画合并（Combining animated values）

You can [combine two animated values](/tech/2018/03/13/react-native-37-api-animated.html#combining-animated-values) via addition, multiplication, division, or modulo to make a new animated value.

可以通过加、乘、除、模[合并两个动画值](/tech/2018/03/13/react-native-37-api-animated.html#combining-animated-values)，来创建一个新的动画值。

There are some cases where an animated value needs to invert another animated value for calculation. An example is inverting a scale (2x --> 0.5x):

某些情况下，需要两个动画值是反比例关系，如下例所示的反转缩放（2x 到 0.5x）：

```javascript
const a = new Animated.Value(1);
const b = Animated.divide(1, a);

Animated.spring(a, {
  toValue: 2,
}).start();
```

### 插值（Interpolation）

Each property can be run through an interpolation first. An interpolation maps input ranges to output ranges, typically using a linear interpolation but also supports easing functions. By default, it will extrapolate the curve beyond the ranges given, but you can also have it clamp the output value.

每个值都可以通过插值的方式进行计算。插值计算在输入和输出之间建立映射，一般使用线性映射，也支持缓动函数。默认情况下，根据设置自动推断曲线，也可以显示的设置中间值。

A simple mapping to convert a 0-1 range to a 0-100 range would be:

简单的从0-1映射到0-100示例如下：

```javascript
value.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 100],
});
```

For example, you may want to think about your `Animated.Value` as going from 0 to 1, but animate the position from 150px to 0px and the opacity from 0 to 1. This can easily be done by modifying `style` from the example above like so:

或者，`Animated.Value`从0到1变化，但位置需要从150px移动到0px，同时透明度需要从0变化到1.将上面的例子中`style`简单的修改为下例即可：

```javascript
  style={{"{{"}}
    opacity: this.state.fadeAnim, // Binds directly
    transform: [{
      translateY: this.state.fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [150, 0]  // 0 : 150, 0.5 : 75, 1 : 0
      }),
    }],
  }}
```

[`interpolate()`](/tech/2018/03/13/react-native-37-api-animated.html#interpolate) supports multiple range segments as well, which is handy for defining dead zones and other handy tricks. For example, to get an negation relationship at -300 that goes to 0 at -100, then back up to 1 at 0, and then back down to zero at 100 followed by a dead-zone that remains at 0 for everything beyond that, you could do:

[`interpolate()`](/tech/2018/03/13/react-native-37-api-animated.html#interpolate)支持多个范围段，便于定义死区或其他需求。比如，从-300到-100映射为300到0，随后从-100到0映射为0到1，从0到100映射为1到0，之后都映射为0：

```javascript
value.interpolate({
  inputRange: [-300, -100, 0, 100, 101],
  outputRange: [300, 0, 1, 0, 0],
});
```

Which would map like so:

映射的结果如下所示：

```
Input | Output
------|-------
  -400|    450
  -300|    300
  -200|    150
  -100|      0
   -50|    0.5
     0|      1
    50|    0.5
   100|      0
   101|      0
   200|      0
```

`interpolate()` also supports mapping to strings, allowing you to animate colors as well as values with units. For example, if you wanted to animate a rotation you could do:

`interpolate()`支持从值映射到字符串（值+单位），让颜色动起来。旋转动画如下所示：

```javascript
value.interpolate({
  inputRange: [0, 360],
  outputRange: ['0deg', '360deg'],
});
```

`interpolate()` also supports arbitrary easing functions, many of which are already implemented in the [`Easing`](https://facebook.github.io/react-native/docs/easing.html) module. `interpolate()` also has configurable behavior for extrapolating the `outputRange`. You can set the extrapolation by setting the `extrapolate`, `extrapolateLeft`, or `extrapolateRight` options. The default value is `extend` but you can use `clamp` to prevent the output value from exceeding `outputRange`.

`interpolate()`支持任意的缓动函数，[`Easing`](https://facebook.github.io/react-native/docs/easing.html)模块实现了很多方式。另外`interpolate()`支持一些其他的`outputRange`推断配置。可以通过设置`extrapolate`、`extrapolateLeft`或`extrapolateRight`选项。默认值是`extend`，可以使用`clamp`来强制输出值在`outputRange`范围之内.

### 动态值跟踪（Tracking dynamic values）

Animated values can also track other values. Just set the `toValue` of an animation to another animated value instead of a plain number. For example, a "Chat Heads" animation like the one used by Messenger on Android could be implemented with a `spring()` pinned on another animated value, or with `timing()` and a `duration` of 0 for rigid tracking. They can also be composed with interpolations:

动画值可以用来追踪另一个值。设置动画的`toValue`值为另一个动画即可，比如，Android的Messenger中的“Chat Heads”动画可以使用`spring()`来跟定另一个动画即可，可以使用`timing()`和0值得`duration`来强制跟进，也可以使用插值动画：

```javascript
Animated.spring(follower, {toValue: leader}).start();
Animated.timing(opacity, {
  toValue: pan.x.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0],
  }),
}).start();
```

The `leader` and `follower` animated values would be implemented using `Animated.ValueXY()`. `ValueXY` is a handy way to deal with 2D interactions, such as panning or dragging. It is a simple wrapper that basically contains two `Animated.Value` instances and some helper functions that call through to them, making `ValueXY` a drop-in replacement for `Value` in many cases. It allows us to track both x and y values in the example above.

上例中的`leader`和`follower`动画值基于`Animated.ValueXY()`来实现。`ValueXY`是通常被用来处理2维动画，比如平移和拖拽。其封装了两个基本的`Animated.Value`值实例和一些常见的帮助方法，在大多数情况下，可以使用`ValueXY`来简单的替代`Value`。在上面的例子中，用来同时跟踪x和y两个值。

### 手势跟踪（Tracking gestures）

Gestures, like panning or scrolling, and other events can map directly to animated values using [`Animated.event`](/tech/2018/03/13/react-native-37-api-animated.html#event). This is done with a structured map syntax so that values can be extracted from complex event objects. The first level is an array to allow mapping across multiple args, and that array contains nested objects.

手势，包含平移、滚动或其他事件，使用[`Animated.event`](/tech/2018/03/13/react-native-37-api-animated.html#event)可以直接映射到动画值。通过结构化映射，将事件对象用一种类似解构的方式将其映射到动画值。将多个参数对象映射到一个数组中的嵌套对象。

For example, when working with horizontal scrolling gestures, you would do the following in order to map `event.nativeEvent.contentOffset.x` to `scrollX` (an `Animated.Value`):

比如，通过下面的方式，将水平滚动手势事件`event.nativeEvent.contentOffset.x`映射到`scrollX`（一个`Animated.Value`对象：

```javascript
 onScroll={Animated.event(
   // scrollX = e.nativeEvent.contentOffset.x
   [{ nativeEvent: {
        contentOffset: {
          x: scrollX
        }
      }
    }]
 )}
```

When using `PanResponder`, you could use the following code to extract the x and y positions from `gestureState.dx` and `gestureState.dy`. We use a `null` in the first position of the array, as we are only interested in the second argument passed to the `PanResponder` handler, which is the `gestureState`.

如果需要在`PanResponder`中提取`gestureState.dx`和`gestureState.dy`，可以使用`null`来忽略第一个参数，来仅关注`PanResponder`处理函数中的第二个参数`gestureState`。

```javascript
onPanResponderMove={Animated.event(
  [null, // ignore the native event
  // extract dx and dy from gestureState
  // like 'pan.x = gestureState.dx, pan.y = gestureState.dy'
  {dx: pan.x, dy: pan.y}
])}
```

### 响应当前的动画值（Responding to the current animation value）

You may notice that there is no obvious way to read the current value while animating. This is because the value may only be known in the native runtime due to optimizations. If you need to run JavaScript in response to the current value, there are two approaches:

你应该注意到，目前为止还没有读取动画运行时当前值的方法，这是由于优化的原因，这个值仅仅只有原生知道。如果需要在JavaScript响应当前值，有下面两个方法：

* `spring.stopAnimation(callback)` will stop the animation and invoke `callback` with the final value. This is useful when making gesture transitions.
* `spring.addListener(callback)` will invoke `callback` asynchronously while the animation is running, providing a recent value. This is useful for triggering state changes, for example snapping a bobble to a new option as the user drags it closer, because these larger state changes are less sensitive to a few frames of lag compared to continuous gestures like panning which need to run at 60 fps.

* `spring.stopAnimation(callback)`会在动画停止调用`callback`时，传入当前位置。当创建手势过度时，这可以用得上。
* `spring.addListener(callback)`会在动画执行时异步回调`callback`，传入一个近似值。可以用在状态的更新上，比如当用户拖进时，打开新的选项，其中的延迟在这种情况下是可以接受的——60FPS下基本无感。

`Animated` is designed to be fully serializable so that animations can be run in a high performance way, independent of the normal JavaScript event loop. This does influence the API, so keep that in mind when it seems a little trickier to do something compared to a fully synchronous system. Check out `Animated.Value.addListener` as a way to work around some of these limitations, but use it sparingly since it might have performance implications in the future.

`Animated`被设计为完全序列化的动画，以高性能的运行，独立于JavaScript事件循环。这不会影响到API，需要注意的是，这跟完全同步的系统存在差异。使用`Animated.Value.addListener`可以用来突破这个限制，但需要谨慎使用，未来可能产生负面的影响。

### 使用本地驱动（Using the native driver）

The `Animated` API is designed to be serializable. By using the [native driver](http://facebook.github.io/react-native/blog/2017/02/14/using-native-driver-for-animated.html), we send everything about the animation to native before starting the animation, allowing native code to perform the animation on the UI thread without having to go through the bridge on every frame. Once the animation has started, the JS thread can be blocked without affecting the animation.

`Animated`设置为序列动画，使用[native driver](http://facebook.github.io/react-native/blog/2017/02/14/using-native-driver-for-animated.html)，可以在动画开始之前将其发送到本地，允许本地程序在UI线程高效的完成动画，而不用每帧都通过Bridge通信。动画开始之后，JS线程的堵塞不会影响动画的执行。

Using the native driver for normal animations is quite simple. Just add `useNativeDriver: true` to the animation config when starting it.

使用本地驱动是一个非常简单的过程，只需要在动画配置中简单的添加`useNativeDriver: true`即可。

```javascript
Animated.timing(this.state.animatedValue, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true, // <-- Add this
}).start();
```

Animated values are only compatible with one driver so if you use native driver when starting an animation on a value, make sure every animation on that value also uses the native driver.

动画值仅兼容同一种驱动，所以启用本地驱动后，需要确保当前动画值中的所有动画都启用了本地驱动。

The native driver also works with `Animated.event`. This is specially useful for animations that follow the scroll position as without the native driver, the animation will always run a frame behind the gesture due to the async nature of React Native.

本地驱动也可以用于`Animated.event`。在没有本地驱动的位置滚动相关的动画中非常有用，由于React Native的异步机制，总是会有一帧动画紧跟手势。

```javascript
<Animated.ScrollView // <-- Use the Animated ScrollView wrapper
  scrollEventThrottle={1} // <-- Use 1 here to make sure no events are ever missed
  onScroll={Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {y: this.state.animatedValue},
        },
      },
    ],
    {useNativeDriver: true} // <-- Add this
  )}>
  {content}
</Animated.ScrollView>
```

You can see the native driver in action by running the [RNTester app](https://github.com/facebook/react-native/blob/master/RNTester/), then loading the Native Animated Example. You can also take a look at the [source code](https://github.com/facebook/react-native/blob/master/RNTester/js/NativeAnimationsExample.js) to learn how these examples were produced.

运行[RNTester app](https://github.com/facebook/react-native/blob/master/RNTester/)打开Native Animated 示例查看本地驱动的用法。也可以查看[源代码](https://github.com/facebook/react-native/blob/master/RNTester/js/NativeAnimationsExample.js)获取等多的信息。

#### 提醒（Caveats）

Not everything you can do with `Animated` is currently supported by the native driver. The main limitation is that you can only animate non-layout properties: things like `transform` and `opacity` will work, but flexbox and position properties will not. When using `Animated.event`, it will only work with direct events and not bubbling events. This means it does not work with `PanResponder` but does work with things like `ScrollView#onScroll`.

目前，并不是`Animated`中的所有属性都可以用本地驱动。主要限制时，仅适用于非布局属性：支持`transform`和`opacity`，但不支持flexbox和position。当使用`Animated.event`时，仅适用于直接的事件绑定，当不适用于冒泡事件。也就是说可以在`ScrollView#onScroll`上使用，但不能使用在`PanResponder`上。

When an animation is running, it can prevent `VirtualizedList` components from rendering more rows. If you need to run a long or looping animation while the user is scrolling through a list, you can use `isInteraction: false` in your animation's config to prevent this issue.

当动画运行的时候，会阻止`VirtualizedList`组件中的行渲染。如果需要在列表滚动时，运行一个长动画，需要在动画配置中使用`isInteraction: false`来防止这个问题。

### 切记（Bear in mind）

While using transform styles such as `rotateY`, `rotateX`, and others ensure the transform style `perspective` is in place. At this time some animations may not render on Android without it. Example below.

使用`rotateY`，`rotateX`之类的转换样式时，需要确保`perspective`的设置。否则可能出现在Android上无法渲染动画的情况，如下例所示：

```javascript
<Animated.View
  style={{"{{"}}
    transform: [
      {scale: this.state.scale},
      {rotateY: this.state.rotateY},
      {perspective: 1000}, // without this line this Animation will not render on Android while working fine on iOS
    ],
  }}
/>
```

### 其他示例（Additional examples）

The RNTester app has various examples of `Animated` in use:

RNTester应用中有许多`Animated`示例：

* [AnimatedGratuitousApp](https://github.com/facebook/react-native/tree/master/RNTester/js/AnimatedGratuitousApp)
* [NativeAnimationsExample](https://github.com/facebook/react-native/blob/master/RNTester/js/NativeAnimationsExample.js)

## `LayoutAnimation` API

`LayoutAnimation` allows you to globally configure `create` and `update` animations that will be used for all views in the next render/layout cycle. This is useful for doing flexbox layout updates without bothering to measure or calculate specific properties in order to animate them directly, and is especially useful when layout changes may affect ancestors, for example a "see more" expansion that also increases the size of the parent and pushes down the row below which would otherwise require explicit coordination between the components in order to animate them all in sync.

`LayoutAnimation`可以配置全局的`create`和`update`动画，适用于所有视图的render/layout循环中。这在flexbox布局中可以直接启动动画，而不用测量元素的尺寸。例如常见的“查看更多”，可以增加父元素的尺寸，并将下面的刚往下推动，而不用精确的计算组件的尺寸。

Note that although `LayoutAnimation` is very powerful and can be quite useful, it provides much less control than `Animated` and other animation libraries, so you may need to use another approach if you can't get `LayoutAnimation` to do what you want.

虽然`LayoutAnimation`非常强大，用起来也非常方便，但其不如`Animated`和其他动画库功能强大，如果需要可以选用其他库。

Note that in order to get this to work on **Android** you need to set the following flags via `UIManager`:

注意，在**Android**中需要设置下面的`UIManager`来保证动画的正常执行。

```javascript
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
```

```SnackPlayer
import React from 'react';
import {
  NativeModules,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class App extends React.Component {
  state = {
    w: 100,
    h: 100,
  };

  _onPress = () => {
    // Animate the update
    LayoutAnimation.spring();
    this.setState({w: this.state.w + 15, h: this.state.h + 15})
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.box, {width: this.state.w, height: this.state.h}]} />
        <TouchableOpacity onPress={this._onPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Press me!</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: 'red',
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
```

This example uses a preset value, you can customize the animations as you need, see [LayoutAnimation.js](https://github.com/facebook/react-native/blob/master/Libraries/LayoutAnimation/LayoutAnimation.js) for more information.

上面的例子中使用的是固定值，也可以根据需要设置，查看[LayoutAnimation.js](https://github.com/facebook/react-native/blob/master/Libraries/LayoutAnimation/LayoutAnimation.js)获取更多信息。

## 其他提醒（Additional notes）

### `requestAnimationFrame`

`requestAnimationFrame` is a polyfill from the browser that you might be familiar with. It accepts a function as its only argument and calls that function before the next repaint. It is an essential building block for animations that underlies all of the JavaScript-based animation APIs. In general, you shouldn't need to call this yourself - the animation APIs will manage frame updates for you.

`requestAnimationFrame`和浏览器中的类似。接收一个函数作为参数，在下一次渲染时会进行调用。这个方法是所有基于JavaScript动画的基础。通常情况下，不用直接调用——动画API会管理帧的更新。

### `setNativeProps`

As mentioned [in the Direct Manipulation section](https://facebook.github.io/react-native/docs/direct-manipulation.html), `setNativeProps` allows us to modify properties of native-backed components (components that are actually backed by native views, unlike composite components) directly, without having to `setState` and re-render the component hierarchy.

跟[Direct Manipulation文中](https://facebook.github.io/react-native/docs/direct-manipulation.html)中说的一样，可以使用`setNativeProps`直接修改原生组件（有原生视图直接实现，跟复合视图不同），而不需要通过`setState`来间接重绘。

We could use this in the Rebound example to update the scale - this might be helpful if the component that we are updating is deeply nested and hasn't been optimized with `shouldComponentUpdate`.

可以在Rebound中更新缩放——这对于多层嵌套的组件非常有用，而不用使用`shouldComponentUpdate`来优化。

If you find your animations with dropping frames (performing below 60 frames per second), look into using `setNativeProps` or `shouldComponentUpdate` to optimize them. Or you could run the animations on the UI thread rather than the JavaScript thread [with the useNativeDriver option](http://facebook.github.io/react-native/blog/2017/02/14/using-native-driver-for-animated.html). You may also want to defer any computationally intensive work until after animations are complete, using the [InteractionManager](https://facebook.github.io/react-native/docs/interactionmanager.html). You can monitor the frame rate by using the In-App Developer Menu "FPS Monitor" tool.

如果动画掉帧，可以使用`setNativeProps`或`shouldComponentUpdate`优化，或者[通过useNativeDriver option](http://facebook.github.io/react-native/blog/2017/02/14/using-native-driver-for-animated.html)启用UI线程。也可以使用[InteractionManager](https://facebook.github.io/react-native/docs/interactionmanager.html)将大量的计算推迟到动画完成后。通过App内置的开发者菜单中的“FPS Monitor”工具来监测性能。
