---
layout: post
title: React Native 9 - 入门：处理触摸（Handling Touches）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/handling-touches.html)

Users interact with mobile apps mainly through touch. They can use a combination of gestures, such as tapping on a button, scrolling a list, or zooming on a map. React Native provides components to handle all sorts of common gestures, as well as a comprehensive [gesture responder system](https://facebook.github.io/react-native/docs/gesture-responder-system.html) to allow for more advanced gesture recognition, but the one component you will most likely be interested in is the basic Button.

用户和手机应用程序的交互主要通过触摸，可用的手势包括轻拍按钮，滚动列表，或者缩放地图。React Native提供了一套组件来处理所有常见的手势，以及 一套[手势响应系统](https://facebook.github.io/react-native/docs/gesture-responder-system.html)来处理高级手势识别，基本按钮应该是使用最多的一个组件。

## 显示基本按钮（Displaying a basic button）

[Button](https://facebook.github.io/react-native/docs/button.html) provides a basic button component that is rendered nicely on all platforms. The minimal example to display a button looks like this:

[Button](https://facebook.github.io/react-native/docs/button.html)提供了一个可以在所有的平台上漂亮渲染的基本按钮组件。显示一个基本按钮最简单的代码如下所示：

```javascript
<Button
  onPress={() => { Alert.alert('You tapped the button!')}}
  title="Press Me"
/>
```

This will render a blue label on iOS, and a blue rounded rectangle with white text on Android. Pressing the button will call the "onPress" function, which in this case displays an alert popup. If you like, you can specify a "color" prop to change the color of your button.

上面代码会在iOS上渲染一个蓝色的标签，在Android上渲染一个白字蓝底的圆角矩形。按压按钮会调用“onPress”函数，并显示一个警告弹窗。如果需要，可以设置“color”特性来改变按钮的颜色。

![](/tech/media/HandlingTouches-Button.png)

Go ahead and play around with the `Button` component using the example below. You can select which platform your app is previewed in by clicking on the toggle in the bottom right, then click on "Tap to Play" to preview the app.

（编者按：这段文字是下面示例代码的Expo的演示说明，不做翻译）

```
import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View } from 'react-native';

export default class ButtonBasics extends Component {
  _onPressButton() {
    Alert.alert('You tapped the button!')
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._onPressButton}
            title="Press Me"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._onPressButton}
            title="Press Me"
            color="#841584"
          />
        </View>
        <View style={styles.alternativeLayoutButtonContainer}>
          <Button
            onPress={this._onPressButton}
            title="This looks great!"
          />
          <Button
            onPress={this._onPressButton}
            title="OK!"
            color="#841584"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => ButtonBasics);
```


## 可触摸（Touchables）

If the basic button doesn't look right for your app, you can build your own button using any of the "Touchable" components provided by React Native. The "Touchable" components provide the capability to capture tapping gestures, and can display feedback when a gesture is recognized. These components do not provide any default styling, however, so you will need to do a bit of work to get them looking nicely in your app.

如果基本按钮不能满足应用程序的需求，可以通过React Native提供的“可触摸”组件来构建定制的按钮。“可触摸”按钮提供了捕获轻拍手势的能力，并且当手势被捕获的时候可以显示回馈。这些组件不提供任何默认的样式，在应用程序中使用时需要做一些额外的UI工作。

Which "Touchable" component you use will depend on what kind of feedback you want to provide:

- Generally, you can use [**TouchableHighlight**](https://facebook.github.io/react-native/docs/touchablehighlight.html) anywhere you would use a button or link on web. The view's background will be darkened when the user presses down on the button.

- You may consider using [**TouchableNativeFeedback**](https://facebook.github.io/react-native/docs/touchablenativefeedback.html) on Android to display ink surface reaction ripples that respond to the user's touch.

- [**TouchableOpacity**](https://facebook.github.io/react-native/docs/touchableopacity.html) can be used to provide feedback by reducing the opacity of the button, allowing the background to be seen through while the user is pressing down.

- If you need to handle a tap gesture but you don't want any feedback to be displayed, use [**TouchableWithoutFeedback**](https://facebook.github.io/react-native/docs/touchablewithoutfeedback.html).

根据需要的反馈类型来选择对应的“可触摸”组件：

- 一般情况下，当需要使用一个按钮或超链接的时候，可以选择[**TouchableHighlight**](https://facebook.github.io/react-native/docs/touchablehighlight.html)，当用户按下的时候背景色会变暗。

- 在Android中也可以考虑[**TouchableNativeFeedback**](https://facebook.github.io/react-native/docs/touchablenativefeedback.html)组件，当用户触摸的时候会显示水波纹效果。

- [**TouchableOpacity**](https://facebook.github.io/react-native/docs/touchableopacity.html)提供的反馈效果是增大按钮的透明度，当用户按下的时候，可以显示出背景颜色。

- 当不需要反馈效果的时候，可以选择[**TouchableWithoutFeedback**](https://facebook.github.io/react-native/docs/touchablewithoutfeedback.html)组件。

In some cases, you may want to detect when a user presses and holds a view for a set amount of time. These long presses can be handled by passing a function to the `onLongPress` props of any of the "Touchable" components.

在某些情况下，可能需要检测用户的长按操作，可以通过“可触摸”组件的`onLongPress`特性来处理。

Let's see all of these in action:

接下来看看具体的使用：

```
import React, { Component } from 'react';
import { Alert, AppRegistry, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native';

export default class Touchables extends Component {
  _onPressButton() {
    Alert.alert('You tapped the button!')
  }

  _onLongPressButton() {
    Alert.alert('You long-pressed the button!')
  }


  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this._onPressButton} underlayColor="white">
          <View style={styles.button}>
            <Text style={styles.buttonText}>TouchableHighlight</Text>
          </View>
        </TouchableHighlight>
        <TouchableOpacity onPress={this._onPressButton}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>TouchableOpacity</Text>
          </View>
        </TouchableOpacity>
        <TouchableNativeFeedback
            onPress={this._onPressButton}
            background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>TouchableNativeFeedback</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableWithoutFeedback
            onPress={this._onPressButton}
            >
          <View style={styles.button}>
            <Text style={styles.buttonText}>TouchableWithoutFeedback</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableHighlight onPress={this._onPressButton} onLongPress={this._onLongPressButton} underlayColor="white">
          <View style={styles.button}>
            <Text style={styles.buttonText}>Touchable with Long Press</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center'
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#2196F3'
  },
  buttonText: {
    padding: 20,
    color: 'white'
  }
})

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => Touchables);
```

## 列表滚动，页面滑动，双指缩放（Scrolling lists, swiping pages, and pinch-to-zoom）

Another gesture commonly used in mobile apps is the swipe or pan. This gesture allows the user to scroll through a list of items, or swipe through pages of content. In order to handle these and other gestures, we'll learn [how to use a ScrollView](https://facebook.github.io/react-native/docs/using-a-scrollview.html) next.

在手机应用程序中常用的另外一个手势是滑动和平移，用来滚动一个列表，或者切换页面的内容。为了处理这些手势，下面继续学习[如何使用ScrollView](https://facebook.github.io/react-native/docs/using-a-scrollview.html)。
