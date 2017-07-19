---
layout: post
title: React Native 3 - 入门：特性（Props）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/props.html)

Most components can be customized when they are created, with different parameters. These creation parameters are called `props`.

大多数组件在创建的时候，可以传入不同的参数对其进行定制。这些创建参数被称为`props`。

For example, one basic React Native component is the `Image`. When you
create an image, you can use a prop named `source` to control what image it shows.

以React Native的基础组件`Image`为例，当创建图片的时候，可以通过传入不同的`source`参数来控制要展示的图片。

```javascript
import React, { Component } from 'react';
import { AppRegistry, Image } from 'react-native';

export default class Bananas extends Component {
  render() {
    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };
    return (
      <Image source={pic} style={{'{{'}}width: 193, height: 110}}/>
    );
  }
}

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => Bananas);
```

Notice that `{pic}` is surrounded by braces, to embed the variable `pic` into JSX. You can put any JavaScript expression inside braces in JSX.

注意需要用大括号将`{pic}`包裹起来，以将`pic`变量嵌入JSX中。可以用大括号将任何JavaScript表达式包裹起来嵌入到JSX中。

Your own components can also use `props`. This lets you make a single component
that is used in many different places in your app, with slightly different
properties in each place. Just refer to `this.props` in your `render` function. Here's an example:

也可以在自定义的组件中使用`props`，使得创建的组件可以使用在应用程序不同的地方，只需要设置略微不同的特性参数即可。
在`render`方法中可以直接引用`this.props`，如下例所示：

``` javascript
import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';

class Greeting extends Component {
  render() {
    return (
      <Text>Hello {this.props.name}!</Text>
    );
  }
}

export default class LotsOfGreetings extends Component {
  render() {
    return (
      <View style={{'{{'}}alignItems: 'center'}}>
        <Greeting name='Rexxar' />
        <Greeting name='Jaina' />
        <Greeting name='Valeera' />
      </View>
    );
  }
}

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => LotsOfGreetings);
```

Using `name` as a prop lets us customize the `Greeting` component, so we can reuse that component for each of our greetings. This example also uses the `Greeting` component in JSX, just like the built-in components. The power to do this is what makes React so cool - if you find yourself wishing that you had a different set of UI primitives to work with, you just invent new ones.

通过`name`特性，定制不同的`Greeting`组件，并复用在每一个打招呼的场景中。
如上例所示，在JSX中自定义的`Greeting`组件和内置组件使用一直，这也是React如此Cool的原因之一——另外如果需要为不同的工作定制一套全新的UI，那么就创建一套新的组件。

The other new thing going on here is the [`View`](https://facebook.github.io/react-native/docs/view.html) component. A [`View`](https://facebook.github.io/react-native/docs/view.html) is useful
as a container for other components, to help control style and layout.

这里第一次使用到了[`View`](https://facebook.github.io/react-native/docs/view.html)组件。将[`View`](https://facebook.github.io/react-native/docs/view.html)作为其他组件的容器元素，辅助样式和布局。

With `props` and the basic [`Text`](https://facebook.github.io/react-native/docs/text.html), [`Image`](https://facebook.github.io/react-native/docs/image.html), and [`View`](https://facebook.github.io/react-native/docs/view.html) components, you can
build a wide variety of static screens. To learn how to make your app change over time, you need to [learn about State](https://facebook.github.io/react-native/docs/state.html).

使用`props`和基本的[`Text`](https://facebook.github.io/react-native/docs/text.html)、[`Image`](https://facebook.github.io/react-native/docs/image.html)以及[`View`](https://facebook.github.io/react-native/docs/view.html)组件，就可以创建各种不同的静态视图。
如果要让应用程序可以实时变化，请继续学习[状态](https://facebook.github.io/react-native/docs/state.html)。
