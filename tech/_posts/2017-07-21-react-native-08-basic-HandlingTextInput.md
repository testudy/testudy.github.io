---
layout: post
title: React Native 8 - 入门：处理文本输入（Handling Text Input）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/handling-text-input.html)

[`TextInput`](https://facebook.github.io/react-native/docs/textinput.html#content) is a basic component that allows the user to enter text. It has an `onChangeText` prop that takes
a function to be called every time the text changed, and an `onSubmitEditing` prop that takes a function to be called when the text is submitted.

[`TextInput`](https://facebook.github.io/react-native/docs/textinput.html#content)是一个用来处理用户输入的基础控件，当文本每次变化的时候会调用`onChangeText`特性上绑定的处理函数，当文本提交的时候会调用`onSubmitEditing`特性上绑定的处理函数。

For example, let's say that as the user types, you're translating their words  into a different language. In this new language, every single word is written the same way: 🍕. So the sentence "Hello there Bob" would be translated
as "🍕🍕🍕".

如下例所示，假设程序将用户的输入翻译为一门新的语言。在这门新语言中，每一个单词都会被写作相同的：🍕。句子“Hello there Bob”将被翻译为“🍕🍕🍕”。

```
import React, { Component } from 'react';
import { AppRegistry, Text, TextInput, View } from 'react-native';

export default class PizzaTranslator extends Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  render() {
    return (
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to translate!"
          onChangeText={(text) => this.setState({text})}
        />
        <Text style={{padding: 10, fontSize: 42}}>
          {this.state.text.split(' ').map((word) => word && '🍕').join(' ')}
        </Text>
      </View>
    );
  }
}

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => PizzaTranslator);
```

In this example, we store `text` in the state, because it changes over time.

在这个示例中，由于`text`会随着时间变化，所以把他存储在状态中。

There are a lot more things you might want to do with a text input. For example, you could validate the text inside while the user types. For more detailed examples, see the [React docs on controlled components](https://facebook.github.io/react/docs/forms.html), or the [reference docs for TextInput](https://facebook.github.io/react-native/docs/textinput.html).

文本输入时还可以做其他很多事，比如即时验证用户的输入。更多的示例可以查阅[React的控制组件文档](https://facebook.github.io/react/docs/forms.html)，或者查看[TextInput参考](https://facebook.github.io/react-native/docs/textinput.html)。

Text input is probably the simplest example of a component whose state naturally changes over time. Next, let's look at another type of component like this one that controls layout, and [learn about the ScrollView](https://facebook.github.io/react-native/docs/using-a-scrollview.html).

上例是实时响应状态变化最简单的例子。下一步，继续学习一个其他类型的控制组件布局的组件——[ScrollView](https://facebook.github.io/react-native/docs/using-a-scrollview.html)。
