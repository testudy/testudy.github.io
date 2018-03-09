---
layout: post
title: React Native 34 - 组件：虚拟列表（VirtualizedList）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/virtualizedlist.html)

Base implementation for the more convenient [`<FlatList>`](/tech/2018/02/19/react-native-35-components-flatlist.html) and [`<SectionList>`](https://facebook.github.io/react-native/docs/sectionlist.html) components, which are also better documented. In general, this should only really be used if you need more flexibility than `FlatList` provides, e.g. for use with immutable data instead of plain arrays.

VirtualizedList是[`<FlatList>`](/tech/2018/02/19/react-native-35-components-flatlist.html)和[`<SectionList>`](https://facebook.github.io/react-native/docs/sectionlist.html)组件的基础实现，后两者拥有良好的文档。通常情况下，当需要在比`FlatList`组件更灵活的特性时，比如使用不可变数据类型代替普通数组时，可以使用VirtualizedList。

Virtualization massively improves memory consumption and performance of large lists by maintaining a finite render window of active items and replacing all items outside of the render window with appropriately sized blank space. The window adapts to scrolling behavior, and items are rendered incrementally with low-pri (after any running interactions) if they are far from the visible area, or with hi-pri otherwise to minimize the potential of seeing blank space.

虚拟列表通过维护渲染窗口中尽可能少的激活项目，并使用空白填充屏幕之外的区域，极大的改善了内存的消耗，提高了大型列表的性能。在窗口中滑动列表时，列表项的渲染优先级与距离可视区域的距离成正比，以最大程度的减少可见空白区域的概率。

Some caveats:

* Internal state is not preserved when content scrolls out of the render window. Make sure all your data is captured in the item data or external stores like Flux, Redux, or Relay.
* This is a `PureComponent` which means that it will not re-render if `props` remain shallow- equal. Make sure that everything your `renderItem` function depends on is passed as a prop (e.g. `extraData`) that is not `===` after updates, otherwise your UI may not update on changes. This includes the `data` prop and parent component state.
* In order to constrain memory and enable smooth scrolling, content is rendered asynchronously offscreen. This means it's possible to scroll faster than the fill rate ands momentarily see blank content. This is a tradeoff that can be adjusted to suit the needs of each application, and we are working on improving it behind the scenes.
* By default, the list looks for a `key` prop on each item and uses that for the React key. Alternatively, you can provide a custom `keyExtractor` prop.

注意事项：

* 内容滚动出渲染窗口外之后，内部状态不会保留。需要确保数据被元素数据项中，或者使用Flux，Redux或Relay之类的外部存储来保持状态。
* 这是一个`PureComponent`组件，就是说浅相当不会导致重新渲染。确保`renderItem`方法中依赖的所有数据完全通过prop传递（比如`extraData`），确保传递的数据前后不全等，否则UI可能不会更新。既包含`data`属性，也包含父组件状态。
* 为了控制内存的使用，同事保证滑动的流畅性，内容在屏幕外使用异步渲染的方式。就是说，如果滑动速度快过内容的填充速度，就会看到空白区域。可以根据不同的应用程序进行适当的调整，我们也在努力调整这种性能。
* 默认使用数据项中的`key`属性作为React Key，也可以自定义`keyExtractor`来替代。

### Props

* [`ScrollView` props...](/tech/2018/02/18/react-native-33-components-scrollview.html#props)
* [`renderItem`](#renderitem)
* [`data`](#data)
* [`getItem`](#getitem)
* [`getItemCount`](#getitemcount)
* [`debug`](#debug)
* [`extraData`](#extradata)
* [`getItemLayout`](#getitemlayout)
* [`initialScrollIndex`](#initialscrollindex)
* [`inverted`](#inverted)
* [`CellRendererComponent`](#cellrenderercomponent)
* [`ListEmptyComponent`](#listemptycomponent)
* [`ListFooterComponent`](#listfootercomponent)
* [`ListHeaderComponent`](#listheadercomponent)
* [`onEndReached`](#onendreached)
* [`onLayout`](#onlayout)
* [`onRefresh`](#onrefresh)
* [`onScrollToIndexFailed`](#onscrolltoindexfailed)
* [`onViewableItemsChanged`](#onviewableitemschanged)
* [`refreshing`](#refreshing)
* [`removeClippedSubviews`](#removeclippedsubviews)
* [`renderScrollComponent`](#renderscrollcomponent)
* [`viewabilityConfig`](#viewabilityconfig)
* [`viewabilityConfigCallbackPairs`](#viewabilityconfigcallbackpairs)
* [`horizontal`](#horizontal)
* [`initialNumToRender`](#initialnumtorender)
* [`keyExtractor`](#keyextractor)
* [`maxToRenderPerBatch`](#maxtorenderperbatch)
* [`onEndReachedThreshold`](#onendreachedthreshold)
* [`updateCellsBatchingPeriod`](#updatecellsbatchingperiod)
* [`windowSize`](#windowsize)
* [`disableVirtualization`](#disablevirtualization)
* [`progressViewOffset`](#progressviewoffset)

### Methods

* [`scrollToEnd`](#scrolltoend)
* [`scrollToIndex`](#scrolltoindex)
* [`scrollToItem`](#scrolltoitem)
* [`scrollToOffset`](#scrolltooffset)
* [`recordInteraction`](#recordinteraction)
* [`flashScrollIndicators`](#flashscrollindicators)

---

## Reference

### Props

#### `renderItem`

```javascript
(info: any) => ?React.Element<any>
```

Takes an item from `data` and renders it into the list

根据`data`中的数据项来渲染列表项。

| Type     | Required |
| -------- | -------- |
| function | Yes      |


#### `data`

The default accessor functions assume this is an array of objects with shape `{key: string}` but you can override `getItem`, `getItemCount`, and `keyExtractor` to handle any type of index-based data.

假设由`{key: string}`结构对象组成的数组，作为默认的访问方法。可以通过覆盖`getItem`，`getItemCount`和`keyExtractor`方法，来自定义处理基于索引的数据。

| Type | Required |
| ---- | -------- |
| any  | Yes      |


#### `getItem`

```javascript
(data: any, index: number) => object;
```

A generic accessor for extracting an item from any sort of data blob.

从自定义数据类型中获取数据项目的通用访问方法。

| Type     | Required |
| -------- | -------- |
| function | Yes      |


#### `getItemCount`

```javascript
(data: any) => number;
```

Determines how many items are in the data blob.

确定数据类型中的元素数量。

| Type     | Required |
| -------- | -------- |
| function | Yes      |


#### `debug`

`debug` will turn on extra logging and visual overlays to aid with debugging both usage and implementation, but with a significant perf hit.

`debug`属性用来打开额外的日志和可视化浮层，用于调试使用和实现细节，但会造成严重的性能影响。

| Type    | Required |
| ------- | -------- |
| boolean | No       |


#### `extraData`

A marker property for telling the list to re-render (since it implements `PureComponent`). If any of your `renderItem`, Header, Footer, etc. functions depend on anything outside of the `data` prop, stick it here and treat it immutably.


标记列表需要重绘的属性（原因是FlatList是一个`PureComponent`）。如果`renderItem`，Header，Footer和其他元素，功能依赖于`data`属性之外的数据，将这些数据用`extraData`传入，并确保其实不可变数据类型。


| Type | Required |
| ---- | -------- |
| any  | No       |


#### `getItemLayout`

```javascript
(
    data: any,
    index: number,
  ) => {length: number, offset: number, index: number}
```

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `initialScrollIndex`

Instead of starting at the top with the first item, start at `initialScrollIndex`. This disables the "scroll to top" optimization that keeps the first `initialNumToRender` items always rendered and immediately renders the items starting at this initial index. Requires `getItemLayout` to be implemented.

设置初始化渲染开始的索引，这样会禁用掉直接滚动到顶部操作优化，第一批渲染的元素从`initialScrollIndex`开始，保证初始化渲染的性能。这个方法要求`getItemLayout`必须实现。

| Type   | Required |
| ------ | -------- |
| number | No       |


#### `inverted`

Reverses the direction of scroll. Uses scale transforms of -1.

反转滚动的方向。（等价于）使用缩放转化的值为`-1`。

| Type    | Required |
| ------- | -------- |
| boolean | No       |


#### `CellRendererComponent`

Each cell is rendered using this element. Can be a React Component Class,or a render function. Defaults to using [`View`](https://facebook.github.io/react-native/docs/view.html).

用来渲染每个单元格的元素，接收一个React组件类，或者一个渲染方法。默认值为[`View`](https://facebook.github.io/react-native/docs/view.html)。

| Type                | Required |
| ------------------- | -------- |
| component, function | No       |


#### `ListEmptyComponent`

Rendered when the list is empty. Can be a React Component Class, a render function, or a rendered element.

当列表为空时显示。可以是一个Component类，或者是一个渲染方法，或者是一个渲染完成的元素。

| Type                         | Required |
| ---------------------------- | -------- |
| component, function, element | No       |


#### `ListFooterComponent`

Rendered at the bottom of all the items. Can be a React Component Class, a render function, or a rendered element.

在整个列表的底部渲染。可以是一个Component类，或者是一个渲染方法，或者是一个渲染完成的元素。

| Type                         | Required |
| ---------------------------- | -------- |
| component, function, element | No       |


#### `ListHeaderComponent`

Rendered at the top of all the items. Can be a React Component Class, a render function, or a rendered element.

在整个列表的头部渲染。可以是一个Component类，或者是一个渲染方法，或者是一个渲染完成的元素。

| Type                         | Required |
| ---------------------------- | -------- |
| component, function, element | No       |


#### `onLayout`

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `onRefresh`

```javascript
() => void
```

If provided, a standard `RefreshControl` will be added for "Pull to Refresh" functionality. Make sure to also set the `refreshing` prop correctly.

如果设置了这个方法，当下拉刷新操作时，会添加一个标准的RefreshControl控件。确保在刷新过程中设置正确的`refreshing`属性。

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `onScrollToIndexFailed`

```javascript
(info: {
    index: number,
    highestMeasuredFrameIndex: number,
    averageItemLength: number,
  }) => void
```

Used to handle failures when scrolling to an index that has not been measured yet. Recommended action is to either compute your own offset and `scrollTo` it, or scroll as far as possible and then try again after more items have been rendered.

用来处理滚动到尚未测量尺寸的索引时触发的错误。建议准确计算偏移并使用`scrollTo`方法，或者尽可能的滑到尽可能远的地方，随后尝试渲染更多的元素后再次滑动。

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `onViewableItemsChanged`

```javascript
(info: {
    viewableItems: array,
    changed: array,
  }) => void
```

Called when the viewability of rows changes, as defined by the `viewabilityConfig` prop.

当`viewabilityConfig`属性定义的可见行发生变化时触发。

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `refreshing`

Set this true while waiting for new data from a refresh.

设置是否显示标准的刷新指示器，指示等待新的数据返回。

| Type    | Required |
| ------- | -------- |
| boolean | No       |


#### `removeClippedSubviews`

This may improve scroll performance for large lists.

在长列表中提高滚动性能。

> Note: May have bugs (missing content) in some circumstances - use at your own risk.

> 备注：可能在某些情况下存在bug，注意使用时的问题。

| Type    | Required |
| ------- | -------- |
| boolean | No       |


#### `renderScrollComponent`

```javascript
(props: object) => element;
```

Render a custom scroll component, e.g. with a differently styled `RefreshControl`.

渲染一个自定义的滚动组件，比如，使用不同样式的`RefreshControl`。

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `viewabilityConfig`

See `ViewabilityHelper.js` for flow type and further documentation.

详见[`ViewabilityHelper.js`](https://github.com/facebook/react-native/blob/26684cf3adf4094eb6c405d345a75bf8c7c0bf88/Libraries/Lists/ViewabilityHelper.js#L31) 中的flow类型定义，未来会补充文档。

| Type              | Required |
| ----------------- | -------- |
| ViewabilityConfig | No       |


#### `viewabilityConfigCallbackPairs`

List of `ViewabilityConfig`/`onViewableItemsChanged` pairs. A specific `onViewableItemsChanged` will be called when its corresponding `ViewabilityConfig`'s conditions are met. See `ViewabilityHelper.js` for flow type and further documentation.

`ViewabilityConfig`/`onViewableItemsChanged`属性对列表，特定的`ViewabilityConfig`配置条件触发时，会调用对应的`onViewableItemsChanged`方法。
详见[`ViewabilityHelper.js`](https://github.com/facebook/react-native/blob/26684cf3adf4094eb6c405d345a75bf8c7c0bf88/Libraries/Lists/ViewabilityHelper.js#L31) 中的flow类型定义，未来会补充文档。

| Type                                   | Required |
| -------------------------------------- | -------- |
| array of ViewabilityConfigCallbackPair | No       |


#### `horizontal`

| Type    | Required |
| ------- | -------- |
| boolean | No       |


#### `initialNumToRender`

How many items to render in the initial batch. This should be enough to fill the screen but not much more. Note these items will never be unmounted as part of the windowed rendering in order to improve perceived performance of scroll-to-top actions.

在初始化中渲染多少元素项。这些元素应该足以填充屏幕。注意这些项目不会作为视口外卸载优化的一部分，以保证直接滚动到顶部操作的性能。

| Type   | Required |
| ------ | -------- |
| number | No       |


#### `keyExtractor`

```javascript
(item: object, index: number) => string;
```

Used to extract a unique key for a given item at the specified index. Key is used for caching and as the react key to track item re-ordering. The default extractor checks `item.key`, then falls back to using the index, like React does.

用来提取元素的唯一索引，作为React key来缓存和跟踪元素的顺序调整。默认使用`item.key`，如果不存在，则降级使用索引。

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `maxToRenderPerBatch`

The maximum number of items to render in each incremental render batch. The more rendered at once, the better the fill rate, but responsiveness my suffer because rendering content may interfere with responding to button taps or other interactions.

每批增量渲染中，可以同时渲染的最大列表数目。一次渲染的条数越多，填充效果（填充率）越好，但有可能造成一定的堵塞，对按钮点击或其他交互造成影响。

| Type   | Required |
| ------ | -------- |
| number | No       |


#### `onEndReached`

```javascript
(info: {distanceFromEnd: number}) => void
```

Called once when the scroll position gets within `onEndReachedThreshold` of the rendered content.

当滚动到`onEndReachedThreshold`内的位置时，调用一次。

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `onEndReachedThreshold`

How far from the end (in units of visible length of the list) the bottom edge of the list must be from the end of the content to trigger the `onEndReached` callback. Thus a value of 0.5 will trigger `onEndReached` when the end of the content is within half the visible length of the list.

距离滚动列表底部多远时触发`onEndReached`事件（单位是滚动列表的可视长度）。如果设置为0.5，则表示距离列表底部还有一半的列表长度时，触发`onEndReached`事件。

| Type   | Required |
| ------ | -------- |
| number | No       |


#### `updateCellsBatchingPeriod`

Amount of time between low-pri item render batches, e.g. for rendering items quite a ways off screen. Similar fill rate/responsiveness tradeoff as `maxToRenderPerBatch`.

（？？）与调整`maxToRenderPerBatch`值来平衡填充率/响应时间的作用相似。。

| Type   | Required |
| ------ | -------- |
| number | No       |


#### `windowSize`

Determines the maximum number of items rendered outside of the visible area, in units of visible lengths. So if your list fills the screen, then `windowSize={21}` (the default) will render the visible screen area plus up to 10 screens above and 10 below the viewport. Reducing this number will reduce memory consumption and may improve performance, but will increase the chance that fast scrolling may reveal momentary blank areas of unrendered content.

设置在可见区域外渲染元素的最大数量，单位是列表的可见区域高度（或长度）。所以，如果某个列表填充了当前屏幕，那么`windowSize={21}`（默认值）就是说，在屏幕之上和之下各渲染10个视口高度的区域。减小这个数字可以降低内存的消耗提高性能，但有可能会提高看到空白区域的几率。

| Type   | Required |
| ------ | -------- |
| number | No       |


#### `disableVirtualization`

**DEPRECATED.** Virtualization provides significant performance and memory optimizations, but fully unmounts react instances that are outside of the render window. You should only need to disable this for debugging purposes.

**反对使用**。虚拟化列表关注高性能和内存优化，但会完全卸载渲染窗口之外元素行的React实例。应该只在调试的时候使用该选项。

| Type | Required |
| ---- | -------- |
|      | No       |


#### `progressViewOffset`

Set this when offset is needed for the loading indicator to show correctly.

当加载指示器显示时，有可能需要设置该属性，以让其正确的显示。

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | Android  |

### Methods

#### `scrollToEnd()`

```javascript
scrollToEnd(([params]: object));
```


#### `scrollToIndex()`

```javascript
scrollToIndex((params: object));
```


#### `scrollToItem()`

```javascript
scrollToItem((params: object));
```


#### `scrollToOffset()`

```javascript
scrollToOffset((params: object));
```

Scroll to a specific content pixel offset in the list.

将列表滚动到指定的像素位置。

Param `offset` expects the offset to scroll to. In case of `horizontal` is true, the offset is the x-value, in any other case the offset is the y-value.

参数`offset`用来指定滚动偏移量。`horizontal`时，其为X值，其他情况下是Y值。

Param `animated` (`true` by default) defines whether the list should do an animation while scrolling.

参数`animated`（默认为`true`）用来决定是否在滑动过程中添加动画效果。 


#### `recordInteraction()`

```javascript
recordInteraction();
```


#### `flashScrollIndicators()`

```javascript
flashScrollIndicators();
```
