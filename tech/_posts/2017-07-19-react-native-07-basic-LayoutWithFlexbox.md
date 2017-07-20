---
layout: post
title: React Native 7 - 入门：弹性盒布局（Layout with Flexbox）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/flexbox.html)

A component can specify the layout of its children using the flexbox algorithm. Flexbox is designed to provide a consistent layout on different screen sizes.

父组件可以通过Flexbox算法指定子元素的布局。Flexbox算法的目的是为不同尺寸的屏幕提供统一的布局。

You will normally use a combination of `flexDirection`, `alignItems`, and `justifyContent` to achieve the right layout.

完成布局，通常要将`flexDirection`，`alignItems`和`justifyContent`属性组合使用。

> Flexbox works the same way in React Native as it does in CSS on the web, with a few exceptions. The defaults are different, with `flexDirection` defaulting to `column` instead of `row`, and the `flex` parameter only supporting a single number.
>
> 在React Native中Flexbox的和CSS在浏览器中的工作机制基本一致，也有一些细节存在差异，比如`flexDirection`在React Native中的默认值是`column`，而在CSS中的默认值是`row`，并且`flex`只能接受单个数字值。

#### 伸缩方向（Flex Direction）

Adding `flexDirection` to a component's `style` determines the **primary axis** of its layout. Should the children be organized horizontally (`row`) or vertically (`column`)? The default is `column`.

在组件的`style`中添加`flexDirection`属性，以控制布局的**主轴**，来决定子元素是应该在水平方向（`row`）还是垂直方向（`column`）组织？默认值是`column`。

```
import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';

export default class FlexDirectionBasics extends Component {
  render() {
    return (
      // Try setting `flexDirection` to `column`.
      <View style={{'{{'}}flex: 1, flexDirection: 'row'}}>
        <View style={{'{{'}}width: 50, height: 50, backgroundColor: 'powderblue'}} />
        <View style={{'{{'}}width: 50, height: 50, backgroundColor: 'skyblue'}} />
        <View style={{'{{'}}width: 50, height: 50, backgroundColor: 'steelblue'}} />
      </View>
    );
  }
};

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => FlexDirectionBasics);
```

#### 内容对齐（Justify Content）

Adding `justifyContent` to a component's style determines the **distribution** of children along the **primary axis**. Should children be distributed at the start, the center, the end, or spaced evenly? Available options are `flex-start`, `center`, `flex-end`, `space-around`, and `space-between`.

在组件的`style`中添加`justifyContent`属性，以控制子元素在**主轴**方向上**分布**，来决定子元素是应该在头部，中部，尾部还是平均分布？可用的选项是`flex-start`，`center`，`flex-end`，`space-around`和`space-between`。

```
import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';

export default class JustifyContentBasics extends Component {
  render() {
    return (
      // Try setting `justifyContent` to `center`.
      // Try setting `flexDirection` to `row`.
      <View style={{'{{'}}
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <View style={{'{{'}}width: 50, height: 50, backgroundColor: 'powderblue'}} />
        <View style={{'{{'}}width: 50, height: 50, backgroundColor: 'skyblue'}} />
        <View style={{'{{'}}width: 50, height: 50, backgroundColor: 'steelblue'}} />
      </View>
    );
  }
};

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => JustifyContentBasics);
```

#### 元素对齐（Align Items）

Adding `alignItems` to a component's style determines the **alignment** of children along the **secondary axis** (if the primary axis is `row`, then the secondary is `column`, and vice versa). Should children be aligned at the start, the center, the end, or stretched to fill? Available options are `flex-start`, `center`, `flex-end`, and `stretch`.

在组件的`style`中添加`alignItems`属性，以控制子组件在**副轴**（如果主轴是`row`，则副轴是`column`，反之亦然）上的**对齐**方式，来决定子组件是应该头部、中部、尾部对其或拉伸填充？可用的选项是`flex-start`、`center`、`flex-end`和`stretch`。

> For `stretch` to have an effect, children must not have a fixed dimension along the secondary axis. In the following example, setting `alignItems: stretch` does nothing until the `width: 50` is removed from the children.
>
> 当使用`strecth`的时候有一个副作用，子组件不能在副轴方向上设置固定尺寸，比如下面的例子，只有将`width: 50`去掉之后`alignItems: stretch`的设置才会生效。

```
import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';

export default class AlignItemsBasics extends Component {
  render() {
    return (
      // Try setting `alignItems` to 'flex-start'
      // Try setting `justifyContent` to `flex-end`.
      // Try setting `flexDirection` to `row`.
      <View style={{'{{'}}
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{'{{'}}width: 50, height: 50, backgroundColor: 'powderblue'}} />
        <View style={{'{{'}}width: 50, height: 50, backgroundColor: 'skyblue'}} />
        <View style={{'{{'}}width: 50, height: 50, backgroundColor: 'steelblue'}} />
      </View>
    );
  }
};

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => AlignItemsBasics);
```

#### 更进一步（Going Deeper）

We've covered the basics, but there are many other styles you may need for layouts. The full list of props that control layout is documented [here](https://facebook.github.io/react-native/docs/layout-props.html).

上面简单的介绍了相关的基础概念，如果遇到更复杂的布局样式，可以参考[这里](https://facebook.github.io/react-native/docs/layout-props.html)查看详细的布局控制文档。

We're getting close to being able to build a real application. One thing we are still missing is a way to take user input, so let's move on to [learn how to handle text input with the TextInput component](https://facebook.github.io/react-native/docs/handling-text-input.html).

目前为止，所学习的知识已经接近创建一个完整的真实应用程序，但还没有学习的一个细节是处理用户的输入，让我们继续[学习如何处理TextInput组件中的文本输入](https://facebook.github.io/react-native/docs/handling-text-input.html)。
