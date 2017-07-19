---
layout: post
title: React Native 6 - 入门：高度和宽度（Height and Width）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/height-and-width.html)

A component's height and width determine its size on the screen.

组件在屏幕上的尺寸由其宽和高决定。

#### 固定尺寸（Fixed Dimensions）

The simplest way to set the dimensions of a component is by adding a fixed `width` and `height` to style. All dimensions in React Native are unitless, and represent density-independent pixels.

设置组件尺寸最简单的方法是在样式中添加`width`和`height`属性。React Native的所有尺寸都不用添加单位，表示设备无关像素。

```
import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';

export default class FixedDimensionsBasics extends Component {
  render() {
    return (
      <View>
        <View style={{'{{'}} width: 50, height: 50, backgroundColor: 'powderblue'}} />
        <View style={{'{{'}} width: 100, height: 100, backgroundColor: 'skyblue'}} />
        <View style={{'{{'}} width: 150, height: 150, backgroundColor: 'steelblue'}} />
      </View>
    );
  }
}

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => FixedDimensionsBasics);
```

Setting dimensions this way is common for components that should always render at exactly the same size, regardless of screen dimensions.

用这种方式设置的组件尺寸在所有手机屏幕上总是会渲染相同的尺寸，跟手机屏幕的尺寸无关。

#### 弹性尺寸（Flex Dimensions）

Use `flex` in a component's style to have the component expand and shrink dynamically based on available space. Normally you will use `flex: 1`, which tells a component to fill all available space, shared evenly amongst each other component with the same parent. The larger the `flex` given, the higher the ratio of space a component will take compared to its siblings.

在组件的样式中添加`flex`属性可以让组件自己可用空间来动态伸缩。通常使用`flex: 1`来指示组件填充所有的可用空间，兄弟组件会共享父组件的整个空间。组件按`flex`值的比例分配空间，越大占的空间越大。

> A component can only expand to fill available space if its parent has dimensions greater than 0. If a parent does not have either a fixed `width` and `height` or `flex`, the parent will have dimensions of 0 and the `flex` children will not be visible.
>
> 只有当父组件的尺寸大于0，有可用空间的时候，子组件才会进行填充。如果父组件既没有`width`和`height`，也没有`flex`的时候，父组件的尺寸将会是0，则`flex`的子元素也无法显示。

```
import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';

export default class FlexDimensionsBasics extends Component {
  render() {
    return (
      // Try removing the `flex: 1` on the parent View.
      // The parent will not have dimensions, so the children can't expand.
      // What if you add `height: 300` instead of `flex: 1`?
      <View style={{'{{'}} flex: 1}}>
        <View style={{'{{'}} flex: 1, backgroundColor: 'powderblue'}} />
        <View style={{'{{'}} flex: 2, backgroundColor: 'skyblue'}} />
        <View style={{'{{'}} flex: 3, backgroundColor: 'steelblue'}} />
      </View>
    );
  }
}

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => FlexDimensionsBasics);
```

After you can control a component's size, the next step is to [learn how to lay it out on the screen](https://facebook.github.io/react-native/docs/flexbox.html).

能控制一个组件的尺寸之后，下一步就是[学习如何在屏幕上布局](https://facebook.github.io/react-native/docs/flexbox.html)。
