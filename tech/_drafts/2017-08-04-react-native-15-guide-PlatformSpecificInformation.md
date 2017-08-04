---
layout: post
title: React Native 15 - 指南：特定平台代码（Platform Specific Code）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/platform-specific-code.html)

When building a cross-platform app, you'll want to re-use as much code as possible. Scenarios may arise where it makes sense for the code to be different, for example you may want to implement separate visual components for iOS and Android.

当创建一个跨平台的应用程序时，期望复用尽可能多的代码。但在某些业务场景中，需要使用不同的代码，比如在iOS和Android中实现不同外观的组件。

React Native provides two ways to easily organize your code and separate it by platform:

* Using the [`Platform` module](docs/platform-specific-code.html#platform-module).
* Using [platform-specific file extensions](docs/platform-specific-code.html#platform-specific-extensions).

React Native提供了两种区分平台的方式来简化代码的组织：

* 使用[`Platform`模块](#platform-module)。
* 使用[特定平台文件扩展名](#platform-specific-extensions)。

Certain components may have properties that work on one platform only. All of these props are annotated with `@platform` and have a small badge next to them on the website.

组件中的某个属性可能只能工作在特定的平台上，这些属性在本网站中会用`@platform`标记，并且用一个小图标指示。


## 平台模块（Platform module）

React Native provides a module that detects the platform in which the app is running. You can use the detection logic to implement platform-specific code. Use this option when only small parts of a component are platform-specific.

React Native中提供了一个在应用程序运行过程中检测平台的模块，用来实现特定平台相关的代码逻辑。当模块中跨平台差异较小的时候可以使用这种方式。

```javascript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  height: (Platform.OS === 'ios') ? 200 : 100,
});
```

`Platform.OS` will be `ios` when running on iOS and `android` when running on Android.

在iOS中运行时，`Platform.OS`的值是`ios`；在Android中运行时是`android`。

There is also a `Platform.select` method available, that given an object containing Platform.OS as keys, returns the value for the platform you are currently running on.

另外一个可用的方法是`Platform.select`，接收一个Platform.OS值组成的对象，并返回当前运行平台对应的值。

```javascript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'red',
      },
      android: {
        backgroundColor: 'blue',
      },
    }),
  },
});
```

This will result in a container having `flex: 1` on both platforms, a red background color on iOS, and a blue background color on Android.

执行结果在所有的平台中都包含`flex: 1`，但在iOS中背景颜色是红色，在Android中背景颜色是蓝色。

Since it accepts `any` value, you can also use it to return platform specific component, like below:

这个方法接收的对象参数中可以接受`any`类型的值，所以也可以像下面这样将其用来返回特定平台相关的组件：

```javascript
const Component = Platform.select({
  ios: () => require('ComponentIOS'),
  android: () => require('ComponentAndroid'),
})();

<Component />;
```

### 检测Android版本（Detecting the Android version）

On Android, the `Platform` module can also be used to detect the version of the Android Platform in which the app is running:

在Android中，`Plateform`模块可以用来检测应用程序运行的Android平台的版本：

```javascript
import { Platform } from 'react-native';

if (Platform.Version === 25) {
  console.log('Running on Nougat!');
}
```

### 检测iOS版本（Detecting the iOS version）

On iOS, the `Version` is a result of `-[UIDevice systemVersion]`, which is a string with the current version of the operating system. An example of the system version is "10.3". For example, to detect the major version number on iOS:

在iOS中，`Version`的结果是`-[UIDevice systemVersion]`，是一个当前操作系统版本的字符串，比如“10.3”。如下所示用来获取当前iOS的主版本号：

```javascript
import { Platform } from 'react-native';

const majorVersionIOS = parseInt(Platform.Version, 10);
if (majorVersionIOS <= 9) {
  console.log('Work around a change in behavior'); 
}
```

## 特定平台文件扩展名（Platform-specific extensions）

When your platform-specific code is more complex, you should consider splitting the code out into separate files. React Native will detect when a file has a `.ios.` or `.android.` extension and load the relevant platform file when required from other components.

当特定平台相关的代码比较复杂时，可以将代码拆分在不同的文件中。React Native可以在组件中根据平台来选择对应的`.ios.`或`.android.`扩展名的文件。

For example, say you have the following files in your project:

假如在项目中存在下列两个文件：

```sh
BigButton.ios.js
BigButton.android.js
```

You can then require the component as follows:

可以在组件中使用如下引用操作：

```javascript
const BigButton = require('./BigButton');
```

React Native will automatically pick up the right file based on the running platform.

React Native将基于当前运行的平台自动的选择正确的文件。
