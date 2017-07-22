---
layout: post
title: React Native 11 - 入门：使用列表视图（Using List Views）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/using-a-listview.html)

React Native provides a suite of components for presenting lists of data. Generally, you'll want to use either [FlatList](https://facebook.github.io/react-native/docs/flatlist.html) or [SectionList](https://facebook.github.io/react-native/docs/sectionlist.html).

React Native为数据展示提供了一套对应的组件，常用的组件是[FlatList](https://facebook.github.io/react-native/docs/flatlist.html)和[SectionList](https://facebook.github.io/react-native/docs/sectionlist.html)。

The `FlatList` component displays a scrolling list of changing, but similarly structured, data. `FlatList` works well for long lists of data, where the number of items might change over time. Unlike the more generic [`ScrollView`](https://facebook.github.io/react-native/docs/using-a-scrollview.html), the `FlatList` only renders elements that are currently showing on the screen, not all the elements at once.

`FlatList`组件显示一个需要滚动的并且不断变化的列表数据，其中每条数据结构和展示相似。`FlatList`适用于不断增加的大列表数据。跟[`ScrollView`](https://facebook.github.io/react-native/docs/using-a-scrollview.html)的差异是，`FlatList`只会渲染当前屏幕中的元素，而不是一次渲染出所有的元素。

The `FlatList` component requires two props: `data` and `renderItem`. `data` is the source of information for the list. `renderItem` takes one item from the source and returns a formatted component to render.

`FlatList`组件需要设置两个特性：`data`和`renderItem`。`data`是列表数据源，`renderItem`根据数据渲染出对应的子组件。

This example creates a simple `FlatList` of hardcoded data. Each item in the `data` props is rendered as a `Text` component. The `FlatListBasics` component then renders the `FlatList` and all `Text` components.

下面的例子通过硬编码的数据展示了一个简单的`FlatList`。`data`特性中的每一个数据项被渲染成一个`Text`组件。`FlatListBasics`的渲染结果是`FlatList`和所有的`Text`组件。

```
import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, Text, View } from 'react-native';

export default class FlatListBasics extends Component {
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={[
            {key: 'Devin'},
            {key: 'Jackson'},
            {key: 'James'},
            {key: 'Joel'},
            {key: 'John'},
            {key: 'Jillian'},
            {key: 'Jimmy'},
            {key: 'Julie'},
          ]}
          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => FlatListBasics);
```

If you want to render a set of data broken into logical sections, maybe with section headers, similar to `UITableView`s on iOS, then a [SectionList](https://facebook.github.io/react-native/docs/sectionlist.html) is the way to go.

如果需要将数据集合渲染到不同的拥有单独标题的逻辑分组中，就像iOS中的`UITableView`那样，可以使用[SectionList](https://facebook.github.io/react-native/docs/sectionlist.html)来实现。

```
import React, { Component } from 'react';
import { AppRegistry, SectionList, StyleSheet, Text, View } from 'react-native';

export default class SectionListBasics extends Component {
  render() {
    return (
      <View style={styles.container}>
        <SectionList
          sections={[
            {title: 'D', data: ['Devin']},
            {title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie']},
          ]}
          renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => SectionListBasics);
```

One of the most common uses for a list view is displaying data that you fetch from a server. To do that, you will need to [learn about networking in React Native](https://facebook.github.io/react-native/docs/network.html).

所有常见的列表视图中显示的数据通常是从服务器端获取的，接下来继续[学习在React Native中处理网络请求](https://facebook.github.io/react-native/docs/network.html)。
