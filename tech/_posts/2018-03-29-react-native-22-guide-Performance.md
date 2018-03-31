---
layout: post
title: React Native 22 - 指南：性能（Performance）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/performance.html)

A compelling reason for using React Native instead of WebView-based tools is to achieve 60 frames per second and a native look and feel to your apps. Where possible, we would like for React Native to do the right thing and help you to focus on your app instead of performance optimization, but there are areas where we're not quite there yet, and others where React Native (similar to writing native code directly) cannot possibly determine the best way to optimize for you and so manual intervention will be necessary. We try our best to deliver buttery-smooth UI performance by default, but sometimes that just isn't possible.

用React Native代替WebView的基本原因是60帧的动画，以及本地风格的视图和体验。React Native会尽可能在内部选择合理的方式，来保证基本的性能优化，实现流畅的UI交互，使开发人员集中在业务开发中，但有些盲区（比如使用本地代码实现的功能）目前还无法自动优化，需要手动调优。

This guide is intended to teach you some basics to help you to [troubleshoot performance issues](#profiling), as well as discuss [common sources of problems and their suggested solutions](#common-sources-of-performance-problems).

本文会教授一些基本的知识，来帮助你[分析基本的性能问题](#profiling)，讨论[常见性能问题的原因和相应的解决方法](#common-sources-of-performance-problems)。

## What you need to know about frames

Your grandparents' generation called movies ["moving pictures"](https://www.youtube.com/watch?v=F1i40rnpOsA) for a reason: realistic motion in video is an illusion created by quickly changing static images at a consistent speed. We refer to each of these images as frames. The number of frames that is displayed each second has a direct impact on how smooth and ultimately life-like a video (or user interface) seems to be. iOS devices display 60 frames per second, which gives you and the UI system about 16.67ms to do all of the work needed to generate the static image (frame) that the user will see on the screen for that interval. If you are unable to do the work necessary to generate that frame within the allotted 16.67ms, then you will "drop a frame" and the UI will appear unresponsive.

祖父母的年代，称电影为[“动画"](https://www.youtube.com/watch?v=F1i40rnpOsA)，基本原因是：电影中的动画是一组静态图片快速连续移动给人的错觉，每一幅画面成为帧，每秒显示的帧数决定了电影的流畅程度和最终效果。iOS设备的帧数是60，UI系统在每个间隔的16.67毫秒内，要完成静态画面（帧）的生成；如果没有完成，就会“掉帧”造成延迟。

Now to confuse the matter a little bit, open up the developer menu in your app and toggle `Show Perf Monitor`. You will notice that there are two different frame rates.

打开开发者菜单中的`Show Perf Monitor`，会出现两个不同的帧率，容易造成混淆。

![](/tech/media/PerfUtil.png)

### JS帧率（JS frame rate (JavaScript thread)）

For most React Native applications, your business logic will run on the JavaScript thread. This is where your React application lives, API calls are made, touch events are processed, etc... Updates to native-backed views are batched and sent over to the native side at the end of each iteration of the event loop, before the frame deadline (if all goes well). If the JavaScript thread is unresponsive for a frame, it will be considered a dropped frame. For example, if you were to call `this.setState` on the root component of a complex application and it resulted in re-rendering computationally expensive component subtrees, it's conceivable that this might take 200ms and result in 12 frames being dropped. Any animations controlled by JavaScript would appear to freeze during that time. If anything takes longer than 100ms, the user will feel it.

大多数React Native应用程序中，业务逻辑运行在JavaScript线程中。处理React程序运行、API请求、触摸事件等...每次事件循环结束时，在原生端进行视图的批量更新。如果JavaScript没有响应帧更新，就会丢帧。比如，在一个复杂应用程序的根组件上执行`this.setState`，会导致子树大量的计算开销，有可能花费200ms左右，导致12帧的丢帧。此时，由JavaScript控制的任何动画均会被冻结。任何花费超过100ms的操作，用户都会有明显的察觉。

This often happens during `Navigator` transitions: when you push a new route, the JavaScript thread needs to render all of the components necessary for the scene in order to send over the proper commands to the native side to create the backing views. It's common for the work being done here to take a few frames and cause [jank](http://jankfree.org/) because the transition is controlled by the JavaScript thread. Sometimes components will do additional work on `componentDidMount`, which might result in a second stutter in the transition.

在`Navigator`切换过程中经常发生这种情况：当压入一个新路由，JavaScript线程需要渲染这时候出现的所有组件，以正确的将命令发送到原生端来创建视图。由于这是JavaScript线程控制的，通常会花费几帧的时间，导致[jank](http://jankfree.org/)。组件有时候会在`componentDidMount`中执行额外的工作，可能在转化过程中导致二次延迟。

Another example is responding to touches: if you are doing work across multiple frames on the JavaScript thread, you might notice a delay in responding to `TouchableOpacity`, for example. This is because the JavaScript thread is busy and cannot process the raw touch events sent over from the main thread. As a result, `TouchableOpacity` cannot react to the touch events and command the native view to adjust its opacity.

另一个常见的例子是触摸响应：如果在JavaScript线程执行的时间超过了多帧，会冻结`TouchableOpacity`的响应。这是应为JavaScript线程繁忙，不能处理来自主线程的触摸事件。导致`TouchableOpacity`不能及时的处理触摸事件，原生视图也就不能相应的改变透明度。

### UI帧率（UI frame rate (main thread)）

Many people have noticed that performance of `NavigatorIOS` is better out of the box than `Navigator`. The reason for this is that the animations for the transitions are done entirely on the main thread, and so they are not interrupted by frame drops on the JavaScript thread.

很多人注意到`NavigatorIOS`的性能远远超过`Navigator`，原因就是其动画在主线程上完成，不会被JavaScript线程中的丢帧中断。

Similarly, you can happily scroll up and down through a `ScrollView` when the JavaScript thread is locked up because the `ScrollView` lives on the main thread. The scroll events are dispatched to the JS thread, but their receipt is not necessary for the scroll to occur.

同样，`ScrollView`驻留在主线程，即使JavaScript线程锁定，也可以顺畅的滑动。滚动事件派发给JS线程，但是其处理不会对滚动造成影响。

## 常见性能问题的原因（Common sources of performance problems）

### 运行在开发模式（Running in development mode (`dev=true`)）

JavaScript thread performance suffers greatly when running in dev mode. This is unavoidable: a lot more work needs to be done at runtime to provide you with good warnings and error messages, such as validating propTypes and various other assertions. Always make sure to test performance in [release builds](https://facebook.github.io/react-native/docs/running-on-device.html#building-your-app-for-production).

在开发模式下，JavaScript线程会受到非常大的影响。这是不可避免的：需要进行更多的工作，以提供更多的警告和错误信息，比如propTypes验证和其他断言。所有的性能测试应该确保在[发布模式](https://facebook.github.io/react-native/docs/running-on-device.html#building-your-app-for-production)下进行。

### 使用`console.log`语句（Using `console.log` statements）

When running a bundled app, these statements can cause a big bottleneck in the JavaScript thread. This includes calls from debugging libraries such as [redux-logger](https://github.com/evgenyrodionov/redux-logger), so make sure to remove them before bundling. You can also use this [babel plugin](https://babeljs.io/docs/plugins/transform-remove-console/) that removes all the `console.*` calls. You need to install it first with `npm i babel-plugin-transform-remove-console --save`, and then edit the `.babelrc` file under your project directory like this:

当运行一个打包后的应用程序时，这些语句会造成JavaScript线程的瓶颈。同样[redux-logger](https://github.com/evgenyrodionov/redux-logger)之类的调试库也会造成类似的问题，在打包之前需要确保将其移除。可以使用一个[babel插件](https://babeljs.io/docs/plugins/transform-remove-console/)来移除所有的`console.*`调用。首先安装`npm i babel-plugin-transform-remove-console --save`，然后编辑项目中的`.babelrc`文件：

```javascripton
{
  "env": {
    "production": {
      "plugins": ["transform-remove-console"]
    }
  }
}
```

This will automatically remove all `console.*` calls in the release (production) versions of your project.

这样就会在发布（生产）版本中，移除所有的`console.*`调用。

### 初始化渲染`ListView`太慢或者在大列表中滚动性能太差（`ListView` initial rendering is too slow or scroll performance is bad for large lists）

Use the new [`FlatList`](/tech/2018/02/19/react-native-35-components-flatlist.html) or [`SectionList`](https://facebook.github.io/react-native/docs/sectionlist.html) component instead. Besides simplifying the API, the new list components also have significant performance enhancements, the main one being nearly constant memory usage for any number of rows.

使用新的[`FlatList`](/tech/2018/02/19/react-native-35-components-flatlist.html)或者[`SectionList`](https://facebook.github.io/react-native/docs/sectionlist.html)组件来替代`ListView`。这些新组件提供了更好的API，以及更好的性能，在大列表中内存的占用基本上维持在同一个水平上。

If your [`FlatList`](/tech/2018/02/19/react-native-35-components-flatlist.html) is rendering slow, be sure that you've implemented [`getItemLayout`](/tech/2018/02/19/react-native-35-components-flatlist.html#getitemlayout) to optimize rendering speed by skipping measurement of the rendered items.

如果[`FlatList`](/tech/2018/02/19/react-native-35-components-flatlist.html)渲染较慢，确保实现了[`getItemLayout`](/tech/2018/02/19/react-native-35-components-flatlist.html#getitemlayout)方法，以跳过渲染元素的测量，来优化渲染速度。

### 当渲染一个几乎没有任何变化的视图时JS帧率断崖式下降（JS FPS plunges when re-rendering a view that hardly changes）

If you are using a ListView, you must provide a `rowHasChanged` function that can reduce a lot of work by quickly determining whether or not a row needs to be re-rendered. If you are using immutable data structures, this would be as simple as a reference equality check.

如果在使用ListView，必须提供`rowHasChanged`方法，方便在重绘过程中快速的判断某个元素是否需要重绘。如果使用的是不可变数据结构，只需要进行简单的相等性检查即可。

Similarly, you can implement `shouldComponentUpdate` and indicate the exact conditions under which you would like the component to re-render. If you write pure components (where the return value of the render function is entirely dependent on props and state), you can leverage PureComponent to do this for you. Once again, immutable data structures are useful to keep this fast -- if you have to do a deep comparison of a large list of objects, it may be that re-rendering your entire component would be quicker, and it would certainly require less code.

同理，可以实现`shouldComponentUpdate`方法来指示组件是否需要重绘。可以使用纯组件（渲染方法的返回值全部依赖于Props和State），配合不可变数据类型——如果需要深度比较数据，这样显然需要更少的代码，对比速度也会更快。

### 由于同时在JavaScript线程上执行了大量的工作导致JS线程丢帧（Dropping JS thread FPS because of doing a lot of work on the JavaScript thread at the same time）

"Slow Navigator transitions" is the most common manifestation of this, but there are other times this can happen. Using InteractionManager can be a good approach, but if the user experience cost is too high to delay work during an animation, then you might want to consider LayoutAnimation.

“慢速的导航动画”是这个问题最常见的情况，也会在其他情况下发生。使用InteractionManager是一个比较好的选择，但会造成比较严重的用户体验成本，延迟到动画之后在可以执行，这时候需要考虑使用LayoutAnimation。

The Animated API currently calculates each keyframe on-demand on the JavaScript thread unless you [set `useNativeDriver: true`](https://facebook.github.io/react-native/blog/2017/02/14/using-native-driver-for-animated.html#how-do-i-use-this-in-my-app), while LayoutAnimation leverages Core Animation and is unaffected by JS thread and main thread frame drops.

Animated API依赖于JavaScript线程中每一帧的计算，除非[设置`useNativeDriver: true`](https://facebook.github.io/react-native/blog/2017/02/14/using-native-driver-for-animated.html#how-do-i-use-this-in-my-app)，使用LayoutAnimation依赖于Core Animation，不会受到JS线程和主线程丢帧的影响。

One case where I have used this is for animating in a modal (sliding down from top and fading in a translucent overlay) while initializing and perhaps receiving responses for several network requests, rendering the contents of the modal, and updating the view where the modal was opened from. See the Animations guide for more information about how to use LayoutAnimation.

之前有一个在模态窗口中的案例（从顶部滑下来，并渐显到一个透明浮层中），其中包含几个网络请求，接收到网络请求后会渲染模态窗口中的内容，并且更新视图。查看Animation指南，获取更多的关于LayoutAnimation的信息。

Caveats:

* LayoutAnimation only works for fire-and-forget animations ("static" animations) -- if it must be interruptible, you will need to use `Animated`.

提醒：

* LayoutAnimation仅仅适用于燃尽动画（“静态”动画）——如果动画需要中断，则必须使用`Animated`。

### 在屏幕上移动（滚动，平移，旋转）一个视图时UI线程丢帧（Moving a view on the screen (scrolling, translating, rotating) drops UI thread FPS）

This is especially true when you have text with a transparent background positioned on top of an image, or any other situation where alpha compositing would be required to re-draw the view on each frame. You will find that enabling `shouldRasterizeIOS` or `renderToHardwareTextureAndroid` can help with this significantly.

当透明图片上放置了文本时，这种问题尤其严重，涉及到半透明通道的合成时，会重绘每一帧视图。启用`shouldRasterizeIOS`或`renderToHardwareTextureAndroid`可以显著的改善这个问题。

Be careful not to overuse this or your memory usage could go through the roof. Profile your performance and memory usage when using these props. If you don't plan to move a view anymore, turn this property off.

需要注意，这有可能会导致内存占用过多。使用这个属性时，会占用较多的内存，影响一定的性能。如果不在使用动画，关闭这个属性即可。

### 改变图片的大小时UI线程丢帧（Animating the size of an image drops UI thread FPS）

On iOS, each time you adjust the width or height of an Image component it is re-cropped and scaled from the original image. This can be very expensive, especially for large images. Instead, use the `transform: [{scale}]` style property to animate the size. An example of when you might do this is when you tap an image and zoom it in to full screen.

在iOS中，每次调整Image组件的尺寸，都会对原图进行重新切割。这种消耗非常昂贵，大图片的时候尤甚。可以使用`transform: [{scales}]`的样式属性来完成尺寸调整。比如，有可能需要将突破缩放到全屏。

### My TouchableX view isn't very responsive

Sometimes, if we do an action in the same frame that we are adjusting the opacity or highlight of a component that is responding to a touch, we won't see that effect until after the `onPress` function has returned. If `onPress` does a `setState` that results in a lot of work and a few frames dropped, this may occur. A solution to this is to wrap any action inside of your `onPress` handler in `requestAnimationFrame`:

默写情况下，需要在触摸实践中调整一个组件的透明度或高亮，在`onPress`方法返回不会看到任何效果。如果`onPress`中需要执行一个`setState`方法，导致进行大量的计算并丢帧，解决这个问题的方法是在`onPress`方法中使用`requestAnimationFrame`方法。

```javascript
handleOnPress() {
  // Always use TimerMixin with requestAnimationFrame, setTimeout and
  // setInterval
  this.requestAnimationFrame(() => {
    this.doExpensiveAction();
  });
}
```

### 慢速导航转换（Slow navigator transitions）

As mentioned above, `Navigator` animations are controlled by the JavaScript thread. Imagine the "push from right" scene transition: each frame, the new scene is moved from the right to left, starting offscreen (let's say at an x-offset of 320) and ultimately settling when the scene sits at an x-offset of

0. Each frame during this transition, the JavaScript thread needs to send a new x-offset to the main thread. If the JavaScript thread is locked up, it cannot do this and so no update occurs on that frame and the animation stutters.

如上所述，`Navigator`动画是由JavaScript线程控制的。假设一下“从右推进”切换场景：从右向左滑动的每一帧动画，从屏幕外（可以认为X轴方向偏移320）移动到X轴方向偏移0的位置。在这个偏移过程中的每一帧，需要JavaScript线程向主线程发送一个新的X轴位置。如果JavaScript线程被锁定了，那么会导致动画磕磕绊绊。

One solution to this is to allow for JavaScript-based animations to be offloaded to the main thread. If we were to do the same thing as in the above example with this approach, we might calculate a list of all x-offsets for the new scene when we are starting the transition and send them to the main thread to execute in an optimized way. Now that the JavaScript thread is freed of this responsibility, it's not a big deal if it drops a few frames while rendering the scene -- you probably won't even notice because you will be too distracted by the pretty transition.

一个解决办法是，将基于JavaScript的动画完全交给主线程来执行。用这样的方式重新实现上面的例子，可以将偏移列表完整的计算出来，一起发送给主线程来执行。现在JavaScript主线程不需要参与这个过程，即使有几帧动画丢弃了，也不会造成大的影响——漂亮的过度已经将其掩盖了。

Solving this is one of the main goals behind the new [React Navigation](/tech/2017/08/11/react-native-16-guide-Navigation.html) library. The views in React Navigation use native components and the [`Animated`](https://facebook.github.io/react-native/docs/animated.html) library to deliver 60 FPS animations that are run on the native thread.

解决这个问题，是新版本[React Navigation](/tech/2017/08/11/react-native-16-guide-Navigation.html)库的主要目标。React Navigation使用本地组件和[`Animated`](https://facebook.github.io/react-native/docs/animated.html)库，在原生线程上实现60FPS的动画。

## Profiling

Use the built-in profiler to get detailed information about work done in the JavaScript thread and main thread side-by-side. Access it by selecting Perf Monitor from the Debug menu.

For iOS, Instruments is an invaluable tool, and on Android you should learn to use [`systrace`](#profiling-android-ui-performance-with-systrace).

But first, [**make sure that Development Mode is OFF!**](#running-in-development-mode-dev-true) You should see `__DEV__ === false, development-level warning are OFF, performance optimizations are ON` in your application logs.

Another way to profile JavaScript is to use the Chrome profiler while debugging. This won't give you accurate results as the code is running in Chrome but will give you a general idea of where bottlenecks might be. Run the profiler under Chrome's `Performance` tab. A flame graph will appear under `User Timing`. To view more details in tabular format, click at the `Bottom Up` tab below and then select `DedicatedWorker Thread` at the top left menu.

### Profiling Android UI Performance with `systrace`

Android supports 10k+ different phones and is generalized to support software rendering: the framework architecture and need to generalize across many hardware targets unfortunately means you get less for free relative to iOS. But sometimes, there are things you can improve -- and many times it's not native code's fault at all!

The first step for debugging this jank is to answer the fundamental question of where your time is being spent during each 16ms frame. For that, we'll be using a standard Android profiling tool called `systrace`.

`systrace` is a standard Android marker-based profiling tool (and is installed when you install the Android platform-tools package). Profiled code blocks are surrounded by start/end markers which are then visualized in a colorful chart format. Both the Android SDK and React Native framework provide standard markers that you can visualize.

#### 1. Collecting a trace

First, connect a device that exhibits the stuttering you want to investigate to your computer via USB and get it to the point right before the navigation/animation you want to profile. Run `systrace` as follows:

```
$ <path_to_android_sdk>/platform-tools/systrace/systrace.py --time=10 -o trace.html sched gfx view -a <your_package_name>
```

A quick breakdown of this command:

* `time` is the length of time the trace will be collected in seconds
* `sched`, `gfx`, and `view` are the android SDK tags (collections of markers) we care about: `sched` gives you information about what's running on each core of your phone, `gfx` gives you graphics info such as frame boundaries, and `view` gives you information about measure, layout, and draw passes
* `-a <your_package_name>` enables app-specific markers, specifically the ones built into the React Native framework. `your_package_name` can be found in the `AndroidManifest.xml` of your app and looks like `com.example.app`

Once the trace starts collecting, perform the animation or interaction you care about. At the end of the trace, systrace will give you a link to the trace which you can open in your browser.

#### 2. Reading the trace

After opening the trace in your browser (preferably Chrome), you should see something like this:

![Example](/react-native/docs/assets/SystraceExample.png)

> **HINT**: Use the WASD keys to strafe and zoom

If your trace .html file isn't opening correctly, check your browser console for the following:

![ObjectObserveError](/react-native/docs/assets/ObjectObserveError.png)

Since `Object.observe` was deprecated in recent browsers, you may have to open the file from the Google Chrome Tracing tool. You can do so by:

* Opening tab in chrome chrome://tracing
* Selecting load
* Selecting the html file generated from the previous command.

> **Enable VSync highlighting**
>
> Check this checkbox at the top right of the screen to highlight the 16ms frame boundaries:
>
> ![Enable VSync Highlighting](/react-native/docs/assets/SystraceHighlightVSync.png)
>
> You should see zebra stripes as in the screenshot above. If you don't, try profiling on a different device: Samsung has been known to have issues displaying vsyncs while the Nexus series is generally pretty reliable.

#### 3. Find your process

Scroll until you see (part of) the name of your package. In this case, I was profiling `com.facebook.adsmanager`, which shows up as `book.adsmanager` because of silly thread name limits in the kernel.

On the left side, you'll see a set of threads which correspond to the timeline rows on the right. There are a few threads we care about for our purposes: the UI thread (which has your package name or the name UI Thread), `mqt_js`, and `mqt_native_modules`. If you're running on Android 5+, we also care about the Render Thread.

* **UI Thread.** This is where standard android measure/layout/draw happens. The thread name on the right will be your package name (in my case book.adsmanager) or UI Thread. The events that you see on this thread should look something like this and have to do with `Choreographer`, `traversals`, and `DispatchUI`:

  ![UI Thread Example](/react-native/docs/assets/SystraceUIThreadExample.png)

* **JS Thread.** This is where JavaScript is executed. The thread name will be either `mqt_js` or `<...>` depending on how cooperative the kernel on your device is being. To identify it if it doesn't have a name, look for things like `JSCall`, `Bridge.executeJSCall`, etc:

  ![JS Thread Example](/react-native/docs/assets/SystraceJSThreadExample.png)

* **Native Modules Thread.** This is where native module calls (e.g. the `UIManager`) are executed. The thread name will be either `mqt_native_modules` or `<...>`. To identify it in the latter case, look for things like `NativeCall`, `callJavaModuleMethod`, and `onBatchComplete`:

  ![Native Modules Thread Example](/react-native/docs/assets/SystraceNativeModulesThreadExample.png)

* **Bonus: Render Thread.** If you're using Android L (5.0) and up, you will also have a render thread in your application. This thread generates the actual OpenGL commands used to draw your UI. The thread name will be either `RenderThread` or `<...>`. To identify it in the latter case, look for things like `DrawFrame` and `queueBuffer`:

  ![Render Thread Example](/react-native/docs/assets/SystraceRenderThreadExample.png)

#### Identifying a culprit

A smooth animation should look something like the following:

![Smooth Animation](/react-native/docs/assets/SystraceWellBehaved.png)

Each change in color is a frame -- remember that in order to display a frame, all our UI work needs to be done by the end of that 16ms period. Notice that no thread is working close to the frame boundary. An application rendering like this is rendering at 60 FPS.

If you noticed chop, however, you might see something like this:

![Choppy Animation from JS](/react-native/docs/assets/SystraceBadJS.png)

Notice that the JS thread is executing basically all the time, and across frame boundaries! This app is not rendering at 60 FPS. In this case, **the problem lies in JS**.

You might also see something like this:

![Choppy Animation from UI](/react-native/docs/assets/SystraceBadUI.png)

In this case, the UI and render threads are the ones that have work crossing frame boundaries. The UI that we're trying to render on each frame is requiring too much work to be done. In this case, **the problem lies in the native views being rendered**.

At this point, you'll have some very helpful information to inform your next steps.

#### Resolving JavaScript issues

If you identified a JS problem, look for clues in the specific JS that you're executing. In the scenario above, we see `RCTEventEmitter` being called multiple times per frame. Here's a zoom-in of the JS thread from the trace above:

![Too much JS](/react-native/docs/assets/SystraceBadJS2.png)

This doesn't seem right. Why is it being called so often? Are they actually different events? The answers to these questions will probably depend on your product code. And many times, you'll want to look into [shouldComponentUpdate](https://facebook.github.io/react/component-specs.md#updating-shouldcomponentupdate).

#### Resolving native UI Issues

If you identified a native UI problem, there are usually two scenarios:

1. the UI you're trying to draw each frame involves too much work on the GPU, or
2. You're constructing new UI during the animation/interaction (e.g. loading in new content during a scroll).

##### Too much GPU work

In the first scenario, you'll see a trace that has the UI thread and/or Render Thread looking like this:

![Overloaded GPU](/react-native/docs/assets/SystraceBadUI.png)

Notice the long amount of time spent in `DrawFrame` that crosses frame boundaries. This is time spent waiting for the GPU to drain its command buffer from the previous frame.

To mitigate this, you should:

* investigate using `renderToHardwareTextureAndroid` for complex, static content that is being animated/transformed (e.g. the `Navigator` slide/alpha animations)
* make sure that you are **not** using `needsOffscreenAlphaCompositing`, which is disabled by default, as it greatly increases the per-frame load on the GPU in most cases.

If these don't help and you want to dig deeper into what the GPU is actually doing, you can check out [Tracer for OpenGL ES](http://developer.android.com/tools/help/gltracer.html).

##### Creating new views on the UI thread

In the second scenario, you'll see something more like this:

![Creating Views](/react-native/docs/assets/SystraceBadCreateUI.png)

Notice that first the JS thread thinks for a bit, then you see some work done on the native modules thread, followed by an expensive traversal on the UI thread.

There isn't an easy way to mitigate this unless you're able to postpone creating new UI until after the interaction, or you are able to simplify the UI you're creating. The react native team is working on an infrastructure level solution for this that will allow new UI to be created and configured off the main thread, allowing the interaction to continue smoothly.

## Unbundling + inline requires

If you have a large app you may want to consider unbundling and using inline requires. This is useful for apps that have a large number of screens which may not ever be opened during a typical usage of the app. Generally it is useful to apps that have large amounts of code that are not needed for a while after startup. For instance the app includes complicated profile screens or lesser used features, but most sessions only involve visiting the main screen of the app for updates. We can optimize the loading of the bundle by using the unbundle feature of the packager and requiring those features and screens inline (when they are actually used).

### Loading JavaScript

Before react-native can execute JS code, that code must be loaded into memory and parsed. With a standard bundle if you load a 50mb bundle, all 50mb must be loaded and parsed before any of it can be executed. The optimization behind unbundling is that you can load only the portion of the 50mb that you actually need at startup, and progressively load more of the bundle as those sections are needed.

### Inline Requires

Inline requires delay the requiring of a module or file until that file is actually needed. A basic example would look like this:

#### VeryExpensive.js

```
import React, { Component } from 'react';
import { Text } from 'react-native';
// ... import some very expensive modules

// You may want to log at the file level to verify when this is happening
console.log('VeryExpensive component loaded');

export default class VeryExpensive extends Component {
  // lots and lots of code
  render() {
    return <Text>Very Expensive Component</Text>;
  }
}
```

#### Optimized.js

```
import React, { Component } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

let VeryExpensive = null;

export default class Optimized extends Component {
  state = { needsExpensive: false };

  didPress = () => {
    if (VeryExpensive == null) {
      VeryExpensive = require('./VeryExpensive').default;
    }

    this.setState(() => ({
      needsExpensive: true,
    }));
  };

  render() {
    return (
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity onPress={this.didPress}>
          <Text>Load</Text>
        </TouchableOpacity>
        {this.state.needsExpensive ? <VeryExpensive /> : null}
      </View>
    );
  }
}
```

Even without unbundling inline requires can lead to startup time improvements, because the code within VeryExpensive.js will only execute once it is required for the first time.

### Enable Unbundling

On iOS unbundling will create a single indexed file that react native will load one module at a time. On Android, by default it will create a set of files for each module. You can force Android to create a single file, like iOS, but using multiple files can be more performant and requires less memory.

Enable unbundling in Xcode by editing the build phase "Bundle React Native code and images". Before `../node_modules/react-native/packager/react-native-xcode.sh` add `export BUNDLE_COMMAND="unbundle"`:

```
export BUNDLE_COMMAND="unbundle"
export NODE_BINARY=node
../node_modules/react-native/packager/react-native-xcode.sh
```

On Android enable unbundling by editing your android/app/build.gradle file. Before the line `apply from: "../../node_modules/react-native/react.gradle"` add or amend the `project.ext.react` block:

```
project.ext.react = [
  bundleCommand: "unbundle",
]
```

Use the following lines on Android if you want to use a single indexed file:

```
project.ext.react = [
  bundleCommand: "unbundle",
  extraPackagerArgs: ["--indexed-unbundle"]
]
```

### Configure Preloading and Inline Requires

Now that we have unbundled our code, there is overhead for calling require. require now needs to send a message over the bridge when it encounters a module it has not loaded yet. This will impact startup the most, because that is where the largest number of require calls are likely to take place while the app loads the initial module. Luckily we can configure a portion of the modules to be preloaded. In order to do this, you will need to implement some form of inline require.

### Adding a packager config file

Create a folder in your project called packager, and create a single file named config.js. Add the following:

```
const config = {
  getTransformOptions: () => {
    return {
      transform: { inlineRequires: true },
    };
  },
};

module.exports = config;
```

In Xcode, in the build phase, include `export BUNDLE_CONFIG="packager/config.js"`.

```
export BUNDLE_COMMAND="unbundle"
export BUNDLE_CONFIG="packager/config.js"
export NODE_BINARY=node
../node_modules/react-native/packager/react-native-xcode.sh
```

Edit your android/app/build.gradle file to include `bundleConfig: "packager/config.js",`.

```
project.ext.react = [
  bundleCommand: "unbundle",
  bundleConfig: "packager/config.js"
]
```

Finally, you can update "start" under "scripts" on your package.json to use the config:

`"start": "node node_modules/react-native/local-cli/cli.js start --config ../../../../packager/config.js",`

Start your package server with `npm start`. Note that when the dev packager is automatically launched via xcode and `react-native run-android`, etc, it does not use `npm start`, so it won't use the config.

### Investigating the Loaded Modules

In your root file (index.(ios|android).js) you can add the following after the initial imports:

```
const modules = require.getModules();
const moduleIds = Object.keys(modules);
const loadedModuleNames = moduleIds
  .filter(moduleId => modules[moduleId].isInitialized)
  .map(moduleId => modules[moduleId].verboseName);
const waitingModuleNames = moduleIds
  .filter(moduleId => !modules[moduleId].isInitialized)
  .map(moduleId => modules[moduleId].verboseName);

// make sure that the modules you expect to be waiting are actually waiting
console.log(
  'loaded:',
  loadedModuleNames.length,
  'waiting:',
  waitingModuleNames.length
);

// grab this text blob, and put it in a file named packager/moduleNames.js
console.log(`module.exports = ${JSON.stringify(loadedModuleNames.sort())};`);
```

When you run your app, you can look in the console and see how many modules have been loaded, and how many are waiting. You may want to read the moduleNames and see if there are any surprises. Note that inline requires are invoked the first time the imports are referenced. You may need to investigate and refactor to ensure only the modules you want are loaded on startup. Note that you can change the Systrace object on require to help debug problematic requires.

```
require.Systrace.beginEvent = (message) => {
  if(message.includes(problematicModule)) {
    throw new Error();
  }
}
```

Every app is different, but it may make sense to only load the modules you need for the very first screen. When you are satisified, put the output of the loadedModuleNames into a file named packager/moduleNames.js.

### Transforming to Module Paths

The loaded module names get us part of the way there, but we actually need absolute module paths, so the next script will set that up. Add `packager/generateModulePaths.js` to your project with the following:

```
// @flow
/* eslint-disable no-console */
const execSync = require('child_process').execSync;
const fs = require('fs');
const moduleNames = require('./moduleNames');

const pjson = require('../package.json');
const localPrefix = `${pjson.name}/`;

const modulePaths = moduleNames.map(moduleName => {
  if (moduleName.startsWith(localPrefix)) {
    return `./${moduleName.substring(localPrefix.length)}`;
  }
  if (moduleName.endsWith('.js')) {
    return `./node_modules/${moduleName}`;
  }
  try {
    const result = execSync(
      `grep "@providesModule ${moduleName}" $(find . -name ${moduleName}\\\\.js) -l`
    )
      .toString()
      .trim()
      .split('\n')[0];
    if (result != null) {
      return result;
    }
  } catch (e) {
    return null;
  }
  return null;
});

const paths = modulePaths
  .filter(path => path != null)
  .map(path => `'${path}'`)
  .join(',\n');

const fileData = `module.exports = [${paths}];`;

fs.writeFile('./packager/modulePaths.js', fileData, err => {
  if (err) {
    console.log(err);
  }

  console.log('Done');
});
```

You can run via `node packager/modulePaths.js`.

This script attempts to map from the module names to module paths. Its not foolproof though, for instance, it ignores platform specific files (\*ios.js, and \*.android.js). However based on initial testing, it handles 95% of cases. When it runs, after some time it should complete and output a file named `packager/modulePaths.js`. It should contain paths to module files that are relative to your projects root. You can commit modulePaths.js to your repo so it is transportable.

### Updating the config.js

Returning to packager/config.js we should update it to use our newly generated modulePaths.js file.

```
const modulePaths = require('./modulePaths');
const resolve = require('path').resolve;
const fs = require('fs');

const config = {
  getTransformOptions: () => {
    const moduleMap = {};
    modulePaths.forEach(path => {
      if (fs.existsSync(path)) {
        moduleMap[resolve(path)] = true;
      }
    });
    return {
      preloadedModules: moduleMap,
      transform: { inlineRequires: { blacklist: moduleMap } },
    };
  },
};

module.exports = config;
```

The preloadedModules entry in the config indicates which modules should be marked as preloaded by the unbundler. When the bundle is loaded, those modules are immediately loaded, before any requires have even executed. The blacklist entry indicates that those modules should not be required inline. Because they are preloaded, there is no performance benefit from using an inline require. In fact the javascript spends extra time resolving the inline require every time the imports are referenced.

### Test and Measure Improvements

You should now be ready to build your app using unbundling and inline requires. Make sure you measure the before and after startup times.
