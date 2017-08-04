---
layout: post
title: React Native 10 - 入门：使用滚动视图（Using a ScrollView）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/using-a-scrollview.html)

The [ScrollView](https://facebook.github.io/react-native/docs/scrollview.html) is a generic scrolling container that can host multiple components and views. The scrollable items need not be homogenous, and you can scroll both vertically and horizontally (by setting the `horizontal` property).

[ScrollView](https://facebook.github.io/react-native/docs/scrollview.html)是常用的滚动容器，可以用来容纳多个组件和视图。滚动的元素可以是不同类型的，也可以实现在垂直和水平方向（需要设置`horizontal`特性）的滚动。

This example creates a vertical `ScrollView` with both images and text mixed together.

下例创建了一个包含图片和文本混合在一起的`ScrollView`。

```
import React, { Component } from 'react';
import { AppRegistry, ScrollView, Image, Text } from 'react-native';

export default class IScrolledDownAndWhatHappenedNextShockedMe extends Component {
  render() {
      return (
        <ScrollView>
          <Text style={{'{{'}}fontSize:96}}>Scroll me plz</Text>
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Text style={{'{{'}}fontSize:96}}>If you like</Text>
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Text style={{'{{'}}fontSize:96}}>Scrolling down</Text>
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Text style={{'{{'}}fontSize:96}}>What's the best</Text>
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Text style={{'{{'}}fontSize:96}}>Framework around?</Text>
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Image source={require('./img/favicon.png')} />
          <Text style={{'{{'}}fontSize:80}}>React Native</Text>
        </ScrollView>
    );
  }
}

// skip these lines if using Create React Native App
AppRegistry.registerComponent(
  'AwesomeProject',
  () => IScrolledDownAndWhatHappenedNextShockedMe);
```

ScrollViews can be configured to allow paging through views using swiping gestures by using the `pagingEnabled` props. Swiping horizontally between views can also be implemented on Android using the [ViewPagerAndroid](https://facebook.github.io/react-native/docs/viewpagerandroid.html) component.

ScrollViews设置`pagingEnabled`特性后，可以实现轮播图的效果。在Android中两个视图间的切换也可以使用[ViewPagerAndroid](https://facebook.github.io/react-native/docs/viewpagerandroid.html)组件来实现。

A ScrollView with a single item can be used to allow the user to zoom content. Set up the `maximumZoomScale` and `minimumZoomScale` props and your user will be able to use pinch and expand gestures to zoom in and out.

当ScrollView组件中只包含一个元素的时候，可以让用户来进行缩放内容操作。设置`maximumZoomScale`和`minimumZoomScale`特性来控制可以被放大和缩小的范围。

The ScrollView works best to present a small amount of things of a limited size. All the elements and views of a `ScrollView` are rendered, even if they are not currently shown on the screen. If you have a long list of more items that can fit on the screen, you should use a `FlatList` instead. So let's [learn about list views](https://facebook.github.io/react-native/docs/using-a-listview.html) next.

当内容数量比较少的时候，ScrollView工作会非常好。`ScrollView`中的所有元素和视图都会被渲染，计时某些元素并没有显示在当前屏幕中。如果要显示的列表非常长，建议使用`FlatLsit`来进行替代。所以接下来继续[学习列表视图](https://facebook.github.io/react-native/docs/using-a-listview.html)。
