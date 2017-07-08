---
layout: post
title: React Native 2 - 基础学习（Learn the Basics）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/tutorial.html)

React Native is like React, but it uses native components instead of web components as building blocks. So to understand the basic structure of a React Native app, you need to understand some of the basic React concepts, like JSX, components, `state`, and `props`. If you already know React, you still need to learn some React-Native-specific stuff, like the native components. This
tutorial is aimed at all audiences, whether you have React experience or not.

React Native跟React很像，只是使用原生组件替代Web组件作为构件模块。为了理解React Native应用程序的基本结构，需要理解基本的React概念，比如JSX，组件，`state`和`props`。如果已经了解React，还是需要学习一些React Native特有的概念，比如本地组件。这个教程面向所有的读者——无论是否有React的使用经验。

Let's do this thing.

接下来开始学习。

## Hello World

In accordance with the ancient traditions of our people, we must first build an app that does nothing except say "Hello world". Here it is:

按照传统习惯，首先构建一个输出“Hello world”——其他什么都不做的应用程序，代码所示：

```javascript
import React, { Component } from 'react';
import { AppRegistry, Text } from 'react-native';

export default class HelloWorldApp extends Component {
  render() {
    return (
      <Text>Hello world!</Text>
    );
  }
}

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => HelloWorldApp);
```

If you are feeling curious, you can play around with sample code directly in the web simulators. You can also paste it into your `App.js`, `index.ios.js`, or `index.android.js` file to create a real app on your local machine.

如果有兴趣，可以直接在[Web模拟器](http://dabbott.github.io/react-native-web-player/)中直接测试示例代码。也可以将代码直接拷贝到`App.js`，`index.ios.js`或`index.android.js`文件中，在本地机器上查看执行效果。

## 上面的代码是什么意思？（What's going on here?）

Some of the things in here might not look like JavaScript to you. Don't panic. _This is the future_.

上面的代码中，有可能看着跟自己习惯的JavaScript不太像，但不要着急，*这是未来的JavaScript*。

First of all, ES2015 (also known as ES6) is a set of improvements to JavaScript that is now part of the official standard, but not yet supported by all browsers, so often it isn't used yet in web development. React Native ships with ES2015 support, so you can use this stuff without worrying about compatibility. `import`, `from`, `class`, `extends`, and the `() =>` syntax in the example above are all ES2015 features. If you aren't familiar with ES2015, you can probably pick it up just by reading through sample code like this tutorial has. If you want, [this page](https://babeljs.io/learn-es2015/) has a good overview of ES2015 features.

首先要说明的是，ES2015（也称ES6）是JavaScript的官方标准，跟之前的版本有较大的改进，在浏览器中不完全支持，所以有可能在Web开发中用的不多。React Native完全支持ES2015，不用考虑兼容性问题，直接使用即可。上例中的`import`，`from`，`class`，`extends`和`() =>`语法都是ES2015的新特性。如果对ES2015不太熟悉，可以尝试多读几遍上面的示例代码来学习。如果需要，可以[在这个页面](https://babeljs.io/learn-es2015/)查看ES2015的特性预览。

The other unusual thing in this code example is `<Text>Hello world!</Text>`. This is JSX - a syntax for embedding XML within JavaScript. Many frameworks use a special templating language which lets you embed code inside markup language. In React, this is reversed. JSX lets you write your markup language inside code. It looks like HTML on the web, except instead of web things like `<div>` or `<span>`, you use React components. In this case, `<Text>`
is a built-in component that just displays some text.

另一个不太一样的地方是`<Text>Hello world!</Text>`，这是JSX——JavaScript中的内嵌XML语法。大多数框架使用一种特殊的模板语法来嵌入标签代码。在React中，可以直接使用标签代码，跟HTML中的`<div>`和`<span>`很像。在上面的例子中，使用内置的`<Text>`组件展示了一些文本。

## 组件（Components）

So this code is defining `HelloWorldApp`, a new `Component`. When you're building a React Native app, you'll be making new components a lot. Anything you see on the screen is some sort of component. A component can be pretty simple - the only thing that's required is a `render` function which returns some JSX to render.

上面的代码定义了一个`HelloWorldApp``组件`。当创建React Native应用的时候，会编写大量的组件。屏幕上看到的一切内容，都可以看做某种类型的组件。组件可以特别简单——只需要包含一个`render`方法来渲染JSX即可。

### 注册到本地代码中（Projects With Native Code Only）

In the particular example above, `HelloWorldApp` is registered with the `AppRegistry`. The `AppRegistry` just tells React Native which component is the root one for the whole application. It's included in these examples so you can paste the whole thing into your `index.ios.js` or `index.android.js` file and get it running. If you have a project from Create React Native App, this is handled for you and it's not necessary to call `AppRegistry` in your code.

在上面的示例中，`HelloWorldApp`被`AppRegistry`注册。`AppRegistry`只是告诉React Native整个应用程序的根组件是谁。可以将上面的整段代码拷贝到`index.ios.js`或`index.android.js`文件中运行。如果是使用Create React Native App创建的应用程序，代码中不需要调用`AppRegistry`。


## 本节的应用程序仅此而已（This app doesn't do very much）

Good point. To make components do more interesting things, you need to [learn about Props](https://facebook.github.io/react-native/docs/props.html).

如果要编写更复杂的组件，需要[学习Props](https://facebook.github.io/react-native/docs/props.html)。
