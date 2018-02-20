---
layout: post
title: React Native 31 - 组件：滚动视图（ScrollView）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/scrollview.html)

Component that wraps platform ScrollView while providing integration with touch locking "responder" system.

ScrollView是一个跨平台滚动视图的封装，同时集成了“responder”系统。

Keep in mind that ScrollViews must have a bounded height in order to work, since they contain unbounded-height children into a bounded container (via a scroll interaction). In order to bound the height of a ScrollView, either set the height of the view directly (discouraged) or make sure all parent views have bounded height. Forgetting to transfer `{flex: 1}` down the view stack can lead to errors here, which the element inspector makes easy to debug.

需要注意的是，由于内部的子元素高度是不确定的，作为外部容器的ScrollView必须有一个确定的高度以正常工作。有两种方式为其设置高度，一是直接设置视图的高度（不建议），二是确保其父元素有确定的高度——如果不小心忽略了`{flex: 1}`属性的设置，会马上看到报错信息，此时进行元素检查也很容易。

Doesn't yet support other contained responders from blocking this scroll view from becoming the responder.

目前尚不支持，内部的Responder阻止其成为Responder。

`<ScrollView>` vs [`<FlatList>`](/tech/2018/02/19/react-native-35-components-flatlist.html) - which one to use?

`<ScrollView>`对比[`<FlatList>`](/tech/2018/02/19/react-native-35-components-flatlist.html)，两者的使用场景有什么不同？

`ScrollView` simply renders all its react child components at once. That makes it very easy to understand and use.

`ScrollView`直接渲染所有的子组件，使用直观、容易理解。

On the other hand, this has a performance downside. Imagine you have a very long list of items you want to display, maybe several screens worth of content. Creating JS components and native views for everything all at once, much of which may not even be shown, will contribute to slow rendering and increased memory usage.

另一方面，这存在一定的性能问题。假设需要显示一个好几屏的长列表，那么所有的JS组件和本地视图需要一次创建完成，而很多内容有可能根本没有显示的机会，却降低了渲染性能，并增加了内存占用。

This is where `FlatList` comes into play. `FlatList` renders items lazily, just when they are about to appear, and removes items that scroll way off screen to save memory and processing time.

这种情况下，使用`FlatList`更合适，`FlatList`惰性渲染，只渲染在屏幕中显示的部分，并销毁划过屏幕的部分，以节省内存和处理时间。

`FlatList` is also handy if you want to render separators between your items, multiple columns, infinite scroll loading, or any number of other features it supports out of the box.

`FlatList`同时适用于在元素之间渲染分隔符、多列元素、无限滚动加载，和其他所支持的功能。

### Props

* [View props...](https://facebook.github.io/react-native/docs/view.html#props)

- [`alwaysBounceVertical`](#alwaysbouncevertical)
- [`contentContainerStyle`](#contentcontainerstyle)
- [`keyboardDismissMode`](#keyboarddismissmode)
- [`keyboardShouldPersistTaps`](#keyboardshouldpersisttaps)
- [`onContentSizeChange`](#oncontentsizechange)
- [`onMomentumScrollBegin`](#onmomentumscrollbegin)
- [`onMomentumScrollEnd`](#onmomentumscrollend)
- [`onScroll`](#onscroll)
- [`onScrollBeginDrag`](#onscrollbegindrag)
- [`onScrollEndDrag`](#onscrollenddrag)
- [`pagingEnabled`](#pagingenabled)
- [`refreshControl`](#refreshcontrol)
- [`removeClippedSubviews`](#removeclippedsubviews)
- [`scrollEnabled`](#scrollenabled)
- [`showsHorizontalScrollIndicator`](#showshorizontalscrollindicator)
- [`showsVerticalScrollIndicator`](#showsverticalscrollindicator)
- [`stickyHeaderIndices`](#stickyheaderindices)
- [`endFillColor`](#endfillcolor)
- [`overScrollMode`](#overscrollmode)
- [`scrollPerfTag`](#scrollperftag)
- [`DEPRECATED_sendUpdatedChildFrames`](#deprecated-sendupdatedchildframes)
- [`alwaysBounceHorizontal`](#alwaysbouncehorizontal)
- [`horizontal`](#horizontal)
- [`automaticallyAdjustContentInsets`](#automaticallyadjustcontentinsets)
- [`bounces`](#bounces)
- [`bouncesZoom`](#bounceszoom)
- [`canCancelContentTouches`](#cancancelcontenttouches)
- [`centerContent`](#centercontent)
- [`contentInset`](#contentinset)
- [`contentInsetAdjustmentBehavior`](#contentinsetadjustmentbehavior)
- [`contentOffset`](#contentoffset)
- [`decelerationRate`](#decelerationrate)
- [`directionalLockEnabled`](#directionallockenabled)
- [`indicatorStyle`](#indicatorstyle)
- [`maximumZoomScale`](#maximumzoomscale)
- [`minimumZoomScale`](#minimumzoomscale)
- [`pinchGestureEnabled`](#pinchgestureenabled)
- [`scrollEventThrottle`](#scrolleventthrottle)
- [`scrollIndicatorInsets`](#scrollindicatorinsets)
- [`scrollsToTop`](#scrollstotop)
- [`snapToAlignment`](#snaptoalignment)
- [`snapToInterval`](#snaptointerval)
- [`zoomScale`](#zoomscale)

### Methods

* [`scrollTo`](#scrollto)
* [`scrollToEnd`](#scrolltoend)
* [`scrollWithoutAnimationTo`](#scrollwithoutanimationto)
* [`flashScrollIndicators`](#flashscrollindicators)

---

## Reference

### Props

#### `alwaysBounceVertical`

When true, the scroll view bounces vertically when it reaches the end even if the content is smaller than the scroll view itself. The default value is false when `horizontal={true}` and true otherwise.

设置为真值，则当滚动到边界的时候，垂直方向上会出现反弹效果（即使滚动的内容区域小于外部滚动容器）。默认值为`true`；当`horizontal={true}`的时候，默认值为`false`。

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |


#### `contentContainerStyle`

These styles will be applied to the scroll view content container which wraps all of the child views. Example:

设置包裹所有滚动子视图内容容器的样式。如下所示：

```
return (
  <ScrollView contentContainerStyle={styles.contentContainer}>
  </ScrollView>
);
...
const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20
  }
});
```

| Type                                 | Required |
| ------------------------------------ | -------- |
| StyleSheetPropType(View Style props) | No       |


#### `keyboardDismissMode`

Determines whether the keyboard gets dismissed in response to a drag.

设置键盘是否响应拖拽事件，即当拖拽列表的时候是否将键盘收起。

_跨平台（Cross platform）_

* `'none'` (the default), drags do not dismiss the keyboard.
* `'on-drag'`, the keyboard is dismissed when a drag begins.

* `'none'`（默认值），拖拽列表时键盘不收起；
* `'on-drag'`，当拖动开始时收起键盘。

_仅iOS生效（iOS Only）_

* `'interactive'`, the keyboard is dismissed interactively with the drag and moves in synchrony with the touch; dragging upwards cancels the dismissal. On android this is not supported and it will have the same behavior as 'none'.

* `'interactive'`，当和键盘交互时收起键盘，即（触点同时在列表和键盘上）一起拖动列表和键盘时；如果拖动过程中转向向上拖动则取消收起（键盘恢复到弹出状态）。Android不支持这个属性，效果同“none”。

| Type                                   | Required |
| -------------------------------------- | -------- |
| enum('none', 'on-drag', 'interactive') | No       |


#### `keyboardShouldPersistTaps`

Determines when the keyboard should stay visible after a tap.

设置键盘是否响应点击事件，即当点击键盘外区域时是否将键盘收起。

* `'never'` (the default), tapping outside of the focused text input when the keyboard is up dismisses the keyboard. When this happens, children won't receive the tap.
* `'always'`, the keyboard will not dismiss automatically, and the scroll view will not catch taps, but children of the scroll view can catch taps.
* `'handled'`, the keyboard will not dismiss automatically when the tap was handled by a children, (or captured by an ancestor).
* `false`, deprecated, use 'never' instead
* `true`, deprecated, use 'always' instead

* `'never'`（默认值），点击当前输入文本框外面的区域时收起键盘。这种情况下，子元素无法接收点击事件。
* `'always'`，设置键盘不自动收起，滚动列表不能触发点击事件，但是滚动列表的子元素可以触发点击事件。
* `'handled'`，设置当子元素处理当前点击事件（或祖先元素捕获此事件）的时候键盘不自动收起。
* `false`，废弃，使用`'never'`替代。
* `true`, 废弃，使用`'always'`替代。

| Type                                            | Required |
| ----------------------------------------------- | -------- |
| enum('always', 'never', 'handled', false, true) | No       |


#### `onContentSizeChange`

Called when scrollable content view of the ScrollView changes.

监听ScrollView的滚动内容区域的大小变化事件。

Handler function is passed the content width and content height as parameters: `(contentWidth, contentHeight)`

监听方法接收内容区域的宽度和高度两个参数：`(contentWidth, contentHeight)`。

It's implemented using onLayout handler attached to the content container which this ScrollView renders.

此监听事件的底层实现，依赖于ScrollView渲染上绑定的onLayout事件。

| Type     | Required |
| -------- | -------- |
| function | No       |

---

#### `onMomentumScrollBegin`

Called when the momentum scroll starts (scroll which occurs as the ScrollView glides to a stop).

监听ScrollView的惯性滑动开始事件（快速滚动时手指离开屏幕的瞬间触发，屏幕会继续滑动直到停止）。

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `onMomentumScrollEnd`

Called when the momentum scroll ends (scroll which occurs as the ScrollView glides to a stop).

监听ScrollView的惯性滑动停止事件（快速滚动时手指离开屏幕的瞬间触发，屏幕会继续滑动直到停止）。

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `onScroll`

Fires at most once per frame during scrolling. The frequency of the events can be controlled using the `scrollEventThrottle` prop.

监听ScrollView的滚动事件，每次渲染最多触发一次。事件触发的频率可以使用`scrollEventThrottle`属性控制（译者按：`scrollEventThrottle`只对iOS生效，默认值情况下，iOS中每次滚动只触发一次；Android总是多次渲染）。

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `onScrollBeginDrag`

Called when the user begins to drag the scroll view.

监听ScrollView滚动的拖动开始事件。

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `onScrollEndDrag`

Called when the user stops dragging the scroll view and it either stops or begins to glide.

监听ScrollView滚动的拖动结束事件。

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `pagingEnabled`

When true, the scroll view stops on multiples of the scroll view's size when scrolling. This can be used for horizontal pagination. The default value is false.

设置滑动距离是否为ScrollView尺寸的整数倍。可以用于水平方向的分页。默认值为`false`。

Note: Vertical pagination is not supported on Android.

提醒：Android中不支持垂直方向的分页。

| Type | Required |
| ---- | -------- |
| bool | No       |


#### `refreshControl`

A RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView. Only works for vertical ScrollViews (`horizontal` prop must be `false`).

设置刷新控件，用于ScrollView的上拉刷新方法。仅在垂直滚动ScrollView中生效（`horizontal`属性必须为`false`）。

See [RefreshControl](https://facebook.github.io/react-native/docs/refreshcontrol.html).

参考[RefreshControl](https://facebook.github.io/react-native/docs/refreshcontrol.html)。

| Type    | Required |
| ------- | -------- |
| element | No       |


#### `removeClippedSubviews`

Experimental: When true, offscreen child views (whose `overflow` value is `hidden`) are removed from their native backing superview when offscreen. This can improve scrolling performance on long lists. The default value is true.

实验属性：设置超出部分的子视图（`overflow`值为`hidden`）从原生视图中删除。有助于提高长列表的滚动性能，默认值为`true`。

| Type | Required |
| ---- | -------- |
| bool | No       |


#### `scrollEnabled`

When false, the view cannot be scrolled via touch interaction. The default value is true.

设置是否可以触摸操作滚动视图，默认值为`true`。

Note that the view can always be scrolled by calling `scrollTo`.

提醒：滚动视图总是可以使用`scrollTo`操作。

| Type | Required |
| ---- | -------- |
| bool | No       |


#### `showsHorizontalScrollIndicator`

When true, shows a horizontal scroll indicator. The default value is true.

设置是否显示水平滚动指示器，默认值为`true`。

| Type | Required |
| ---- | -------- |
| bool | No       |


#### `showsVerticalScrollIndicator`

When true, shows a vertical scroll indicator. The default value is true.

设置是否显示垂直滚动指示器，默认值为`true`。

| Type | Required |
| ---- | -------- |
| bool | No       |


#### `stickyHeaderIndices`

An array of child indices determining which children get docked to the top of the screen when scrolling. For example, passing `stickyHeaderIndices={[0]}` will cause the first child to be fixed to the top of the scroll view. This property is not supported in conjunction with `horizontal={true}`.

设置列表滚动时固定在顶部的元素索引值数组。比如，设置`stickyHeaderIndices={[0]}`会把第一个元素固定在滚动视图的顶部。不支持和`horizontal={true}`设置联合使用。

| Type            | Required |
| --------------- | -------- |
| array of number | No       |


#### `endFillColor`

Sometimes a scrollview takes up more space than its content fills. When this is the case, this prop will fill the rest of the scrollview with a color to avoid setting a background and creating unnecessary overdraw. This is an advanced optimization that is not needed in the general case.

某些情况下，滚动视图需要占用比内容更多的空间。这时候，设置该属性可以填充内容之外的滚动视图空间，而不用设置背景色导致不必须的绘制。这是一种高级的性能优化，通常情况下并不需要这么做。

| Type               | Required | Platform |
| ------------------ | -------- | -------- |
| [color](https://facebook.github.io/react-native/docs/colors.html) | No       | Android  |


#### `overScrollMode`

Used to override default value of overScroll mode.

覆盖过度滚动模式（译者按：Android系统中，滑动到底或顶之后的两端覆盖的阴影）。

Possible values:

* `'auto'` - Default value, allow a user to over-scroll this view only if the content is large enough to meaningfully scroll.
* `'always'` - Always allow a user to over-scroll this view.
* `'never'` - Never allow a user to over-scroll this view.

枚举值：

* `'auto'` - 默认值，只有当内容区域大于滚动视图区域的时候才允许用户过度滑动。
* `'always'` - 总是孕育用户过度滑动。
* `'never'` - 从来不允许用户过度滑动。

译者按：当设置refreshControl的时候，上滑不出现OverScroll。

| Type                            | Required | Platform |
| ------------------------------- | -------- | -------- |
| enum('auto', 'always', 'never') | No       | Android  |


#### `scrollPerfTag`

Tag used to log scroll performance on this scroll view. Will force momentum events to be turned on (see sendMomentumEvents). This doesn't do anything out of the box and you need to implement a custom native FpsListener for it to be useful.

滚动视图的滚动性能日志标签。会导致惯性事件强制打开（查看sendMomentumEvents）。单独设置这个属性不起作用，需要实现本地的FpsListener才能起作用。

| Type   | Required | Platform |
| ------ | -------- | -------- |
| string | No       | Android  |


#### `DEPRECATED_sendUpdatedChildFrames`

When true, ScrollView will emit updateChildFrames data in scroll events, otherwise will not compute or emit child frame data. This only exists to support legacy issues, `onLayout` should be used instead to retrieve frame data. The default value is false.

设置为真值，ScrollView会在滚动事件中发送updateChildFrames数据，否则不会计算、发送子元素帧数据。这个属性是为了支持历史遗留问题，应该使用`onLayout`来获取帧数据。该属性的默认值为`false`。

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |


#### `alwaysBounceHorizontal`

When true, the scroll view bounces horizontally when it reaches the end even if the content is smaller than the scroll view itself. The default value is true when `horizontal={true}` and false otherwise.

设置为真值，则当滚动到边界的时候，水平方向上会出现反弹效果。当horizontal={true}的时候，默认值为true；其他情况下默认值为false。

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |


#### `horizontal`

When true, the scroll view's children are arranged horizontally in a row instead of vertically in a column. The default value is false.

设置滚动视图的子元素是否按水平方向组织成一行，默认值为false。

| Type | Required |
| ---- | -------- |
| bool | No       |


#### `automaticallyAdjustContentInsets`

Controls whether iOS should automatically adjust the content inset for scroll views that are placed behind a navigation bar or tab bar/ toolbar. The default value is true.

设置在iOS中，是否自动调整滚动视图中内容的缩进，比如被导航栏或Tab Bar覆盖的内容。默认值为`true`。

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |


#### `bounces`

When true, the scroll view bounces when it reaches the end of the content if the content is larger then the scroll view along the axis of the scroll direction. When false, it disables all bouncing even if the `alwaysBounce*` props are true. The default value is true.

设置滚动视图是否在滚动到边界时，支持滚动方向上的滚性效果。如果此属性设置为`false`，即使`alwaysBounce*`属性是`true`，也会禁用所有的惯性效果。默认值为`true`。

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |


#### `bouncesZoom`

When true, gestures can drive zoom past min/max and the zoom will animate to the min/max value at gesture end, otherwise the zoom will not exceed the limits.

设置是否支持缩放的弹性效果，缩放到最大时可以继续放大，释放后动画过度到允许的最大值；反之亦然。否则，缩放时不能超过限制值。

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |


#### `canCancelContentTouches`

When false, once tracking starts, won't try to drag if the touch moves. The default value is true.

设置为`false`时，手指移动时不会尝试拖动视图（参考[delaysContentTouches和canCancelContentTouches](https://www.jianshu.com/p/2b171f6153ad)）。默认值为`true`。

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |


#### `centerContent`

When true, the scroll view automatically centers the content when the content is smaller than the scroll view bounds; when the content is larger than the scroll view, this property has no effect. The default value is false.

设置当内容区小于滚动视图时，其中的内容区是否自动居中；当内容区大于滚动视图时，该属性不起作用。默认值为`false`。

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |


#### `contentInset`

The amount by which the scroll view content is inset from the edges of the scroll view. Defaults to `{top: 0, left: 0, bottom: 0, right: 0}`.

滚动视图中内容区相对视图边缘的缩进量。默认值为`{top: 0, left: 0, bottom: 0, right: 0}`（译者按：支持负数值；仅在滚动方向上起作用）。

| Type                                                               | Required | Platform |
| ------------------------------------------------------------------ | -------- | -------- |
| object: {top: number, left: number, bottom: number, right: number} | No       | iOS      |


#### `contentInsetAdjustmentBehavior`

This property specifies how the safe area insets are used to modify the content area of the scroll view. The default value of this property is "never". Available on iOS 11 and later.

设置如何修改内容区域来适应安全区。默认值是“never”。在iOS11之后生效。

| Type                                                   | Required | Platform |
| ------------------------------------------------------ | -------- | -------- |
| enum('automatic', 'scrollableAxes', 'never', 'always') | No       | iOS      |


#### `contentOffset`

Used to manually set the starting scroll offset. The default value is `{x: 0, y: 0}`.

设置滚动视图的初始位置。默认值为`{x: 0, y: 0}`。（译者按，在水平滚动中，只有x生效）。

| Type          | Required | Platform |
| ------------- | -------- | -------- |
| PointPropType | No       | iOS      |


#### `decelerationRate`

A floating-point number that determines how quickly the scroll view decelerates after the user lifts their finger. You may also use string shortcuts `"normal"` and `"fast"` which match the underlying iOS settings for `UIScrollViewDecelerationRateNormal` and `UIScrollViewDecelerationRateFast` respectively.

设置手指离开后，视图滚动的减速度，其值是一个浮点数，也可以使用`"normal"`或`"fast"`来表示，对应iOS底层设置中的`UIScrollViewDecelerationRateNormal`和`UIScrollViewDecelerationRateFast`。

* `'normal'`: 0.998 (the default)
* `'fast'`: 0.99

| Type                            | Required | Platform |
| ------------------------------- | -------- | -------- |
| enum('fast', 'normal'), ,number | No       | iOS      |


#### `directionalLockEnabled`

When true, the ScrollView will try to lock to only vertical or horizontal scrolling while dragging. The default value is false.

设置ScrollView拖动时是否锁定方向。默认值为`false`。

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |


#### `indicatorStyle`

The style of the scroll indicators.

* `'default'` (the default), same as `black`.
* `'black'`, scroll indicator is black. This style is good against a light background.
* `'white'`, scroll indicator is white. This style is good against a dark background.

滚动指示器。

* `'default'` （默认值），跟`black`相同。
* `'black'`，黑色滚动指示器，适合于浅色背景。
* `'white'`, 白色滚动指示器，适合于深色背景。

| Type                              | Required | Platform |
| --------------------------------- | -------- | -------- |
| enum('default', 'black', 'white') | No       | iOS      |


#### `maximumZoomScale`

The maximum allowed zoom scale. The default value is 1.0.

允许的最大缩放值，默认值为1.0。

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | iOS      |


#### `minimumZoomScale`

The minimum allowed zoom scale. The default value is 1.0.

允许的最小缩放值，默认值为1.0。

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | iOS      |


#### `pinchGestureEnabled`

When true, ScrollView allows use of pinch gestures to zoom in and out. The default value is true.

设置ScrollView是否允许手势放大或缩小。默认值为`true`。

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |


#### `scrollEventThrottle`

This controls how often the scroll event will be fired while scrolling (as a time interval in ms). A lower number yields better accuracy for code that is tracking the scroll position, but can lead to scroll performance problems due to the volume of information being send over the bridge. You will not notice a difference between values set between 1-16 as the JS run loop is synced to the screen refresh rate. If you do not need precise scroll position tracking, set this value higher to limit the information being sent across the bridge. The default value is zero, which results in the scroll event being sent only once each time the view is scrolled.

设置滚动事件触发的时间间隔（单位是ms）。较小值可以更精确的跟踪滚动的位置，但这样会导致大量的消息通信占用通道。一个细节是，设置为1-16的效果等同于屏幕刷新率。如果不需要精确的跟踪位置，设置一个较大值来减少消息通信占用通道更合适。默认值为0，每次滚动时只触发一次事件（译者按：测试只在iOS中生效）。

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | iOS      |


#### `scrollIndicatorInsets`

The amount by which the scroll view indicators are inset from the edges of the scroll view. This should normally be set to the same value as the `contentInset`. Defaults to `{0, 0, 0, 0}`.

设置滚动视图中滚动指示器相对视图边缘的缩进量，通常情况下跟`contentInset`相同。默认值为`{top: 0, left: 0, bottom: 0, right: 0}`。

| Type                                                               | Required | Platform |
| ------------------------------------------------------------------ | -------- | -------- |
| object: {top: number, left: number, bottom: number, right: number} | No       | iOS      |


#### `scrollsToTop`

When true, the scroll view scrolls to top when the status bar is tapped. The default value is true.

设置，点击状态栏，滚动视图是否返回顶部。默认值为`true`。

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |


#### `snapToAlignment`

When `snapToInterval` is set, `snapToAlignment` will define the relationship of the snapping to the scroll view.

* `'start'` (the default) will align the snap at the left (horizontal) or top (vertical)
* `'center'` will align the snap in the center
* `'end'` will align the snap at the right (horizontal) or bottom (vertical)

当`snapToInterval`设置是，`snapToAlignment`设置Snap的细节：

* `'start'`（默认值），跟子元素的左侧对齐（水平方向），或顶部对齐（垂直方向）。
* `'center'`，跟子元素的中部对齐。
* `'end'`，跟子元素的右侧对齐（水平方向），或底部对齐（垂直方向）。

| Type                           | Required | Platform |
| ------------------------------ | -------- | -------- |
| enum('start', 'center', 'end') | No       | iOS      |


#### `snapToInterval`

When set, causes the scroll view to stop at multiples of the value of `snapToInterval`. This can be used for paginating through children that have lengths smaller than the scroll view. Typically used in combination with `snapToAlignment` and `decelerationRate="fast"`. Overrides less configurable `pagingEnabled` prop.

设置滚动视图滑动的距离是`snapToInterval`值得整数倍，适用于子元素的尺寸小于滚动视图的尺寸时。通常跟`snapToAlignment`、`decelerationRate="fast"`一起使用。会覆盖掉`pagingEnabled`属性。

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | iOS      |


#### `zoomScale`

The current scale of the scroll view content. The default value is 1.0.

滚动视图的当前缩放比例。默认值为1.0。

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | iOS      |

### Methods

#### `scrollTo()`

```javascript
scrollTo(([y]: number), object, ([x]: number), ([animated]: boolean));
```

Scrolls to a given x, y offset, either immediately or with a smooth animation.

滚动到给定的偏移位置，设置立即滚动还是平缓滚动。

Example:

`scrollTo({x: 0, y: 0, animated: true})`

Note: The weird function signature is due to the fact that, for historical reasons, the function also accepts separate arguments as an alternative to the options object. This is deprecated due to ambiguity (y before x), and SHOULD NOT BE USED.

提醒：该函数也接受三个参数分别传入（y在x之前），这种古怪的函数签名是由于历史原因，目前这种方法已经废弃，不建议继续使用。

---

#### `scrollToEnd()`

```javascript
scrollToEnd(([options]: object));
```

If this is a vertical ScrollView scrolls to the bottom. If this is a horizontal ScrollView scrolls to the right.

垂直滚动时，滚动到底部；水平滚动时，滚动到最右边。

Use `scrollToEnd({animated: true})` for smooth animated scrolling, `scrollToEnd({animated: false})` for immediate scrolling. If no options are passed, `animated` defaults to true.

使用`scrollToEnd({animated: true})`来平缓移动，`scrollToEnd({animated: false})`来瞬移。`animated`默认值为`true`。


#### `scrollWithoutAnimationTo()`

```javascript
scrollWithoutAnimationTo(y, x);
```

Deprecated, use `scrollTo` instead.

废弃，使用`scrollTo`替代。

---

#### `flashScrollIndicators()`

```javascript
flashScrollIndicators();
```

Displays the scroll indicators momentarily.

闪现一下滚动条指示器。
