---
layout: post
title: React Native 4 - 入门：状态（State）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/state.html)

There are two types of data that control a component: `props` and `state`. `props` are set by the parent and they are fixed throughout the lifetime of a component. For data that is going to change, we have to use `state`.

控制组件有两种数据类型：`props`和`state`。`props`由父组件设置，在组件的整个生命周期内是固定的（编者按：这个固定是相对的，在组件的生命周期内接收父组件传递的新值）。当数据需要变化的时候，必须使用`state`。

In general, you should initialize `state` in the constructor, and then call `setState` when you want to change it.

通常情况下，需要在构造函数中初始化`state`，当需要对其改变的时候调用`setState`方法。

For example, let's say we want to make text that blinks all the time. The text itself gets set once when the blinking component gets created, so the text itself is a `prop`. The "whether the text is currently on or off" changes over time, so that should be kept in `state`.

如下例所示，假设需要创建持续闪烁的文本。文本自身在创建的时候需要被设置一次，所以可以把文本作为一个`prop`。而需要定义一个随时间变化的`state`，用来“决定当前文本是否显示”。

```
import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';

class Blink extends Component {
  constructor(props) {
    super(props);
    this.state = {showText: true};

    // Toggle the state every second
    setInterval(() => {
      this.setState(previousState => {
        return { showText: !previousState.showText };
      });
    }, 1000);
  }

  render() {
    let display = this.state.showText ? this.props.text : ' ';
    return (
      <Text>{display}</Text>
    );
  }
}

export default class BlinkApp extends Component {
  render() {
    return (
      <View>
        <Blink text='I love to blink' />
        <Blink text='Yes blinking is so great' />
        <Blink text='Why did they ever take this out of HTML' />
        <Blink text='Look at me look at me look at me' />
      </View>
    );
  }
}

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => BlinkApp);
```

In a real application, you probably won't be setting state with a timer. You might set state when you have new data arrive from the server, or from user input. You can also use a state container like [Redux](http://redux.js.org/index.html) to control your data flow. In that case you would use Redux to modify your state rather than calling `setState` directly.

在真实的需求中，可能不会在定时器中设置一个状态。状态用来表示从服务器获取的新数据，或者用户的输入。也可以使用[Redux](http://redux.js.org/index.html)之类的状态容器来控制数据流，用Redux来修改状态代替直接调用`setState`。

When setState is called, BlinkApp will re-render its Component. By calling setState within the Timer, the component will re-render every time the Timer ticks.

当调用`setState`后，BlinkApp会重新渲染组件。在定时器中调用`setState`，组件会跟随调用重新渲染。

State works the same way as it does in React, so for more details on handling state, you can look at the [React.Component API](https://facebook.github.io/react/docs/component-api.html).
At this point, you might be annoyed that most of our examples so far use boring default black text. To make things more beautiful, you will have to [learn about Style](https://facebook.github.io/react-native/docs/style.html).

React Native中状态的工作原理跟React中一样，可以参考[React.Component API](https://facebook.github.io/react/docs/component-api.html)来学习更多状态处理的细节。

目前为止，创建的所有示例都是用默认的黑色来表示。为了让应用程序更漂亮，需要继续[学习样式](https://facebook.github.io/react-native/docs/style.html)。
