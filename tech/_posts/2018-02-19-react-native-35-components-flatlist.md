---
layout: post
title: React Native 35 - 组件：扁平列表（FlatList）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/flatlist.html)

A performant interface for rendering simple, flat lists, supporting the most handy features:

FlatList是一个用于渲染简单、扁平列表的高性能界面组件，支持大多数开箱即用的特性：

* Fully cross-platform.
* Optional horizontal mode.
* Configurable viewability callbacks.
* Header support.
* Footer support.
* Separator support.
* Pull to Refresh.
* Scroll loading.
* ScrollToIndex support.

* 完全跨平台。
* 可选的水平模式。
* 配置可视性回调。
* 头部支持。
* 尾部支持。
* 分割支持。
* 下拉刷新。
* 上拉加载。
* 支持ScrollToIndex。

If you need section support, use [`<SectionList>`](https://facebook.github.io/react-native/docs/sectionlist.html).

如果需要分节支持，请使用[`<SectionList>`](https://facebook.github.io/react-native/docs/sectionlist.html)。

Minimal Example:

最简单的示例如下：

```jsx
<FlatList
  data={[{key: 'a'}, {key: 'b'}]}
  renderItem={({item}) => <Text>{item.key}</Text>}
/>
```

More complex, multi-select example demonstrating `PureComponent` usage for perf optimization and avoiding bugs.

* By binding the `onPressItem` handler, the props will remain `===` and `PureComponent` will prevent wasteful re-renders unless the actual `id`, `selected`, or `title` props change, even if the components rendered in `MyListItem` did not have such optimizations.
* By passing `extraData={this.state}` to `FlatList` we make sure `FlatList` itself will re-render when the `state.selected` changes. Without setting this prop, `FlatList` would not know it needs to re-render any items because it is also a `PureComponent` and the prop comparison will not show any changes.
* `keyExtractor` tells the list to use the `id`s for the react keys instead of the default `key` property.

更复杂一些的多选示例，使用`PureComponent`来进行性能优化，避免Bug。

* 在`onPressItem`事件处理器中，使用`===`和`PureComponent`避免重绘，除非`id`、`selected`或`title`属性发生变化，即使`MyListItem`中使用的组件没有进行这样的性能优化处理，也不会受到影响。
* 通过在`FlatList`中设置`extraData={this.state}`，确保`FlatList`自身响应`state.selected`的变化。如果不设置这个属性，由于`FlatList`是一个`PureComponent`组件，不能确定需要对哪个元素进行重绘，也不会显示任何变化。 
* `keyExtractor`指示列表使用`id`属性来作为React的key，替代默认的`key`属性。

```javascript
class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? "red" : "black";
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View>
          <Text style={{"{{"}} color: textColor }}>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class MultiSelectList extends React.PureComponent {
  state = {selected: (new Map(): Map<string, boolean>)};

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  _renderItem = ({item}) => (
    <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      title={item.title}
    />
  );

  render() {
    return (
      <FlatList
        data={this.props.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}
```

This is a convenience wrapper around [`<VirtualizedList>`](https://facebook.github.io/react-native/docs/virtualizedlist.html), and thus inherits its props (as well as those of [`<ScrollView>`](/tech/2018/02/18/react-native-33-components-scrollview.html)) that aren't explicitly listed here, along with the following caveats:

* Internal state is not preserved when content scrolls out of the render window. Make sure all your data is captured in the item data or external stores like Flux, Redux, or Relay.
* This is a `PureComponent` which means that it will not re-render if `props` remain shallow- equal. Make sure that everything your `renderItem` function depends on is passed as a prop (e.g. `extraData`) that is not `===` after updates, otherwise your UI may not update on changes. This includes the `data` prop and parent component state.
* In order to constrain memory and enable smooth scrolling, content is rendered asynchronously offscreen. This means it's possible to scroll faster than the fill rate ands momentarily see blank content. This is a tradeoff that can be adjusted to suit the needs of each application, and we are working on improving it behind the scenes.
* By default, the list looks for a `key` prop on each item and uses that for the React key. Alternatively, you can provide a custom `keyExtractor` prop.

FlatList是[`<VirtualizedList>`](https://facebook.github.io/react-native/docs/virtualizedlist.html)的一个便捷包装，继承了其所有的属性（包括[`<ScrollView>`](/tech/2018/02/18/react-native-33-components-scrollview.html)的属性），有个别属性没有明确的列在当前文档中，其实现基于下列假设：

* 滚动出渲染视窗之外内容的内部状态不会保存，需要确保捕获所有的数据，或在外部存储Flux，Redux或Relay中存储。
* 这是一个`PureComponent`组件，就是说`props`的浅相等不会重绘。同时确保`renderItem`中的数据依赖于传入的Prop（例如`extraData`），`===`判断不相等后进行更新，否则UI不会进行更新，包含`data` Prop和父组件的State。
* 为了限制内存的使用，同时为了保证滑动的流畅性，屏幕外的内容异步渲染。就是说，当滑动速度很快的时候，会填充帧率，可能瞬间看到空白内容。这是一种这种的考虑，会在后续的React Native版本中不断优化背后的渲染机制。
* 默认情况下，列表会使用每一数据项的`key`属性来作为React Key。或者，可以使用自定义的`keyExtractor` Prop。

Also inherits [ScrollView Props](/tech/2018/02/18/react-native-33-components-scrollview.html#props), unless it is nested in another FlatList of same orientation.

同时继承了[ScrollView属性](/tech/2018/02/18/react-native-33-components-scrollview.html#props)，除非嵌套在另外一个相同方向的FlatList内部。

### Props

* [`ScrollView` props...](/tech/2018/02/18/react-native-33-components-scrollview.html#props)
* [`VirtualizedList` props...](https://facebook.github.io/react-native/docs/virtualizedlist.html#props)
* [`renderItem`](#renderitem)
* [`data`](#data)
* [`ItemSeparatorComponent`](#itemseparatorcomponent)
* [`ListEmptyComponent`](#listemptycomponent)
* [`ListFooterComponent`](#listfootercomponent)
* [`ListHeaderComponent`](#listheadercomponent)
* [`columnWrapperStyle`](#columnwrapperstyle)
* [`extraData`](#extradata)
* [`getItemLayout`](#getitemlayout)
* [`horizontal`](#horizontal)
* [`initialNumToRender`](#initialnumtorender)
* [`initialScrollIndex`](#initialscrollindex)
* [`inverted`](#inverted)
* [`keyExtractor`](#keyextractor)
* [`numColumns`](#numcolumns)
* [`onEndReached`](#onendreached)
* [`onEndReachedThreshold`](#onendreachedthreshold)
* [`onRefresh`](#onrefresh)
* [`onViewableItemsChanged`](#onviewableitemschanged)
* [`progressViewOffset`](#progressviewoffset)
* [`legacyImplementation`](#legacyimplementation)
* [`refreshing`](#refreshing)
* [`removeClippedSubviews`](#removeclippedsubviews)
* [`viewabilityConfig`](#viewabilityconfig)
* [`viewabilityConfigCallbackPairs`](#viewabilityconfigcallbackpairs)

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
renderItem({ item: Object, index: number, separators: { highlight: Function, unhighlight: Function, updateProps: Function(select: string, newProps: Object) } }) => ?React.Element
```

Takes an item from `data` and renders it into the list.

从`data`中逐个提取数据项，并将其渲染到列表中。

Provides additional metadata like `index` if you need it, as well as a more generic `separators.updateProps` function which let you set whatever props you want to change the rendering of either the leading separator or trailing separator in case the more common `highlight` and `unhighlight` (which set the `highlighted: boolean` prop) are insufficient for your use case.

同时传入数据项的索引`index`和用来操作分割线的对象`separators`。`separators`包含通用的`highlight`和`unhighlight`方法（用来设置上下相邻的两个分割线的`highlighted: boolean` Prop），也包含更通用的`separators.updateProps`方法，可以单独操作上相邻（leading）和下相邻（trailing）的分割线

> 译者按：
>
> `separators.updateProps`调用方式为`updateProps('leading', props)`或`updateProps('trailing', props)`，props和`highlighted`一起混入到`ItemSeparatorComponent`的Props中，`leading`混入到上分割线，`trailing`混入到下分割线。
>
> 参考[FlatList.js](https://github.com/facebook/react-native/blob/da3424c929220304ff01032a9bf473fb251375f1/Libraries/Lists/FlatList.js#L29)，[VirtualizedList-test.js](https://github.com/facebook/react-native/blob/26684cf3adf4094eb6c405d345a75bf8c7c0bf88/Libraries/Lists/__tests__/VirtualizedList-test.js#L133)。

| Type     | Required |
| -------- | -------- |
| function | Yes      |

Example usage:

用法示例：

```javascript
<FlatList
  ItemSeparatorComponent={Platform.OS !== 'android' && ({highlighted}) => (
    <View style={[style.separator, highlighted && {marginLeft: 0}]} />
  )}
  data={[{title: 'Title Text', key: 'item1'}]}
  renderItem={({item, separators}) => (
    <TouchableHighlight
      onPress={() => this._onPress(item)}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={{"{{"}}backgroundColor: 'white'}}>
        <Text>{item.title}</Text>
      </View>
    </TouchableHighlight>
  )}
/>
```


#### `data`

For simplicity, data is just a plain array. If you want to use something else, like an immutable list, use the underlying [`VirtualizedList`](https://facebook.github.io/react-native/docs/virtualizedlist.html) directly.

简单起见，`data`只是一个普通数组。如果期待其他的数据格式，比如不可变列表，需要直接使用底层的[`VirtualizedList`](https://facebook.github.io/react-native/docs/virtualizedlist.html)替代。

| Type  | Required |
| ----- | -------- |
| array | Yes      |


#### `ItemSeparatorComponent`

Rendered in between each item, but not at the top or bottom. By default, `highlighted` and `leadingItem` props are provided. `renderItem` provides `separators.highlight`/`unhighlight` which will update the `highlighted` prop, but you can also add custom props with `separators.updateProps`.

在数据项之间渲染分割线。默认props中包含`highlighted`和`leadingItem`两个数据项。`renderItem`中提供的`separators.highlight`/`unhighlight`两个方法用来更新`highlighted`属性，也可以使用`separators.updateProps`添加自定义属性。

| Type      | Required |
| --------- | -------- |
| component | No       |


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


#### `columnWrapperStyle`

Optional custom style for multi-item rows generated when `numColumns > 1`.

多列视图（`numColumns > 1`）时，为每行设置样式。

| Type         | Required |
| ------------ | -------- |
| style object | No       |


#### `extraData`

A marker property for telling the list to re-render (since it implements `PureComponent`). If any of your `renderItem`, Header, Footer, etc. functions depend on anything outside of the `data` prop, stick it here and treat it immutably.

标记列表需要重绘的属性（原因是FlatList是一个`PureComponent`）。如果`renderItem`，Header，Footer和其他元素，功能依赖于`data`属性之外的数据，将这些数据用`extraData`传入，并确保其实不可变数据类型。

| Type | Required |
| ---- | -------- |
| any  | No       |


#### `getItemLayout`

```javascript
(data, index) => {length: number, offset: number, index: number}
```

`getItemLayout` is an optional optimization that let us skip measurement of dynamic content if you know the height of items a priori. `getItemLayout` is the most efficient, and is easy to use if you have fixed height items, for example:

`getItemLayout`是一个附加的优化选项，来让程序跳过动态的计算元素的高度。对于固定尺寸的列表，`getItemLayout`效率非常高，如下所示：

```javascript
  getItemLayout={(data, index) => (
    {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
  )}
```

Adding `getItemLayout` can be a great performance boost for lists of several hundred items. Remember to include separator length (height or width) in your offset calculation if you specify `ItemSeparatorComponent`.

为数以百计的长列表添加`getItemLayout`会极大的提升渲染性能。需要注意在返回的`offset`中包含`ItemSeparatorComponent`的长度（高度或宽度）。

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `horizontal`

If true, renders items next to each other horizontally instead of stacked vertically.

是否渲染为横向列表，来替代默认的纵向列表。

| Type    | Required |
| ------- | -------- |
| boolean | No       |


#### `initialNumToRender`

How many items to render in the initial batch. This should be enough to fill the screen but not much more. Note these items will never be unmounted as part of the windowed rendering in order to improve perceived performance of scroll-to-top actions.

在初始化中渲染多少元素项。这些元素应该足以填充屏幕。注意这些项目不会作为视口外卸载优化的一部分，以保证直接滚动到顶部操作的性能。

| Type   | Required |
| ------ | -------- |
| number | No       |


#### `initialScrollIndex`

Instead of starting at the top with the first item, start at `initialScrollIndex`. This disables the "scroll to top" optimization that keeps the first `initialNumToRender` items always rendered and immediately renders the items starting at this initial index. Requires `getItemLayout` to be implemented.

设置初始化渲染开始的索引，这样会禁用掉直接滚动到顶部操作优化，第一批渲染的元素从`initialScrollIndex`开始，保证初始化渲染的性能。这个方法要求`getItemLayout`必须实现。

| Type   | Required |
| ------ | -------- |
| number | No       |


#### `inverted`

Reverses the direction of scroll. Uses scale transforms of `-1`.

反转滚动的方向。（等价于）使用缩放转化的值为`-1`。

| Type    | Required |
| ------- | -------- |
| boolean | No       |


#### `keyExtractor`

```javascript
(item: object, index: number) => string;
```

Used to extract a unique key for a given item at the specified index. Key is used for caching and as the react key to track item re-ordering. The default extractor checks `item.key`, then falls back to using the index, like React does.

用来提取元素的唯一索引，作为React key来缓存和跟踪元素的顺序调整。默认使用`item.key`，如果不存在，则降级使用索引。

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `numColumns`

Multiple columns can only be rendered with `horizontal={false}` and will zig-zag like a `flexWrap` layout. Items should all be the same height - masonry layouts are not supported.

多列视图仅适用于`horizontal={false}`的情况，生成类似`flexWrap`的布局（译者按：从实验效果看，可以认为是`flexWrap`布局，未从源码中确认）。每一行中的所有元素高度相同。

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


#### `onRefresh`

```javascript
() => void
```

If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the `refreshing` prop correctly.

如果设置了这个方法，当下拉刷新操作时，会添加一个标准的RefreshControl控件。确保在刷新过程中设置正确的`refreshing`属性。

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

| Type     | Required |
| -------- | -------- |
| function | No       |


#### `progressViewOffset`

Set this when offset is needed for the loading indicator to show correctly.

设置进度指示器的进度。

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | Android  |


#### `legacyImplementation`

May not have full feature parity and is meant for debugging and performance comparison.

| Type    | Required |
| ------- | -------- |
| boolean | No       |


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
>
> 备注：可能在某些情况下存在bug，注意使用时的问题。

| Type    | Required |
| ------- | -------- |
| boolean | No       |


#### `viewabilityConfig`

See `ViewabilityHelper.js` for flow type and further documentation.

详见[`ViewabilityHelper.js`](https://github.com/facebook/react-native/blob/26684cf3adf4094eb6c405d345a75bf8c7c0bf88/Libraries/Lists/ViewabilityHelper.js#L31)。

| Type              | Required |
| ----------------- | -------- |
| ViewabilityConfig | No       |


#### `viewabilityConfigCallbackPairs`

List of `ViewabilityConfig`/`onViewableItemsChanged` pairs. A specific `onViewableItemsChanged` will be called when its corresponding `ViewabilityConfig`'s conditions are met. See `ViewabilityHelper.js` for flow type and further documentation.

| Type                                   | Required |
| -------------------------------------- | -------- |
| array of ViewabilityConfigCallbackPair | No       |

## Methods

#### `scrollToEnd()`

```javascript
scrollToEnd([params]);
```

Scrolls to the end of the content. May be janky without `getItemLayout` prop.

滚动到内容底部。如果不设置`getItemLayout`，情况可能不太美妙。

**Parameters:**

| Name   | Type   | Required | Description |
| ------ | ------ | -------- | ----------- |
| params | object | No       | See below.  |

Valid `params` keys are:

* 'animated' (boolean) - Whether the list should do an animation while scrolling. Defaults to `true`.

有效的`params`参数：

* 'animated' (boolean) - 是否带动画的滚动。默认值为`true`。


#### `scrollToIndex()`

```javascript
scrollToIndex(params);
```

Scrolls to the item at the specified index such that it is positioned in the viewable area such that `viewPosition` 0 places it at the top, 1 at the bottom, and 0.5 centered in the middle.

滚动到指定索引的元素项。`viewPosition`的值0表示元素顶部，1表示底部，0.5表示中间。

> Note: Cannot scroll to locations outside the render window without specifying the `getItemLayout` prop.

**Parameters:**

| Name   | Type   | Required | Description |
| ------ | ------ | -------- | ----------- |
| params | object | Yes      | See below.  |

Valid `params` keys are:

* 'animated' (boolean) - Whether the list should do an animation while scrolling. Defaults to `true`.
* 'index' (number) - The index to scroll to. Required.
* 'viewOffset' (number) - A fixed number of pixels to offset the final target position. Required.
* 'viewPosition' (number) - A value of `0` places the item specified by index at the top, `1` at the bottom, and `0.5` centered in the middle.

有效的参数`params`如下：

* 'animated' (boolean) - 是否用动画的方式滚动，默认值为`true`。
* 'index' (number) - 滚动的目标索引值。必须。
* 'viewOffset' (number) - 相对最终目标的位移。必填（译者按：测试后非必填）。
* 'viewPosition' (number) - 0表示滚动到目标元素顶部，1表示底部，0.5表示中间。

#### `scrollToItem()`

```javascript
scrollToItem(params);
```

Requires linear scan through data - use `scrollToIndex` instead if possible.

会执行一个线性查找，尽可能使用`scrollToIndex`代替。

> Note: Cannot scroll to locations outside the render window without specifying the `getItemLayout` prop.
>
> 注意：如果不指定`getItemLayout`，不能滚动到视口之外的元素上。

**Parameters:**

| Name   | Type   | Required | Description |
| ------ | ------ | -------- | ----------- |
| params | object | Yes      | See below.  |

Valid `params` keys are:

* 'animated' (boolean) - Whether the list should do an animation while scrolling. Defaults to `true`.
* 'item' (object) - The item to scroll to. Required.
* 'viewPosition' (number)

有效的参数`params`如下：

* 'animated' (boolean) - 是否用动画的方式滚动，默认值为`true`。
* 'item' (object) - 滚动的目标值。必须。
* 'viewPosition' (number) - 0表示滚动到目标元素顶部，1表示底部，0.5表示中间。


#### `scrollToOffset()`

```javascript
scrollToOffset(params);
```

Scroll to a specific content pixel offset in the list.

滚动到给定的偏移位置。

**Parameters:**

| Name   | Type   | Required | Description |
| ------ | ------ | -------- | ----------- |
| params | object | Yes      | See below.  |

Valid `params` keys are:

* 'offset' (number) - The offset to scroll to. In case of `horizontal` being true, the offset is the x-value, in any other case the offset is the y-value. Required.
* 'animated' (boolean) - Whether the list should do an animation while scrolling. Defaults to `true`.

有效的参数`params`如下：

* 'offset' (number) - 滚动的位移。`horizontal`代表x值，其他事y值。
* 'animated' (boolean) - 是否用动画的方式滚动，默认值为`true`。

#### `recordInteraction()`

```javascript
recordInteraction();
```

Tells the list an interaction has occurred, which should trigger viewability calculations, e.g. if `waitForInteractions` is true and the user has not scrolled. This is typically called by taps on items or by navigation actions.


#### `flashScrollIndicators()`

```javascript
flashScrollIndicators();
```

Displays the scroll indicators momentarily.

闪现一下滚动条指示器。
