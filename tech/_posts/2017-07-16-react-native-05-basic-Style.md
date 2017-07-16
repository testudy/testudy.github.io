---
layout: post
title: React Native 5 - 入门：样式（Style）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/style.html)

With React Native, you don't use a special language or syntax for  defining styles. You just style your application using JavaScript. All of the core components accept a prop named `style`. The style names and [values](https://facebook.github.io/react-native/docs/colors.html) usually match how CSS works on the web, except names are written using camel casing, e.g `backgroundColor` rather than `background-color`.

在React Native中，并不需要学习一种特殊的语法来定义样式，直接使用JavaScript即可。所有的核心组件都接受一个`style`特性。用来定义样式的属性名和[属性值](https://facebook.github.io/react-native/docs/colors.html)跟Web开发中常见的CSS基本一致，但属性名需要用驼峰命名法，比如`backgroundColor`用来代替`background-color`。

The `style` prop can be a plain old JavaScript object. That's the simplest and what we usually use for example code. You can also pass an array of styles - the last style in the array has precedence, so you can use this to inherit styles.

`style`特性可以是一个传统的简单JavaScript对象，这是最简单的设置样式的方式，也是示例代码中的常用方式。也可以将一个样式定义的数组传递给组件——后面的样式对象比前一个高，类似继承的效果。

As a component grows in complexity, it is often cleaner to use `StyleSheet.create` to define several styles in one place. Here's an example:

当组件逐渐复杂的时候，通常用`StyleSheet.create`将所有样式定义在一处，以让代码更清晰。如下例所示：

```
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';

export default class LotsOfStyles extends Component {
  render() {
    return (
      <View>
        <Text style={styles.red}>just red</Text>
        <Text style={styles.bigblue}>just bigblue</Text>
        <Text style={[styles.bigblue, styles.red]}>bigblue, then red</Text>
        <Text style={[styles.red, styles.bigblue]}>red, then bigblue</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bigblue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
});

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => LotsOfStyles);
```

One common pattern is to make your component accept a `style` prop which in
turn is used to style subcomponents. You can use this to make styles "cascade" the way they do in CSS.

 一个常见的模式是，将组件接收的`style`特性也应用在子组件中，用来模拟CSS中的“层叠”效果。

There are a lot more ways to customize text style. Check out the [Text component reference](https://facebook.github.io/react-native/docs/text.html) for a complete list.

可以将文本定义为各种不同的样式，查看[文本组件参考](https://facebook.github.io/react-native/docs/text.html)支持的完整列表。.

Now you can make your text beautiful. The next step in becoming a style master is to [learn how to control component size](https://facebook.github.io/react-native/docs/height-and-width.html).

目前为止，已经可以将文本变得更漂亮。下一步是继续向样式进阶，[学习控制组件的尺寸](https://facebook.github.io/react-native/docs/height-and-width.html)。
