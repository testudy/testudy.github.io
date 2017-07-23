---
layout: post
title: React Native 14 - 指南：组件和API（Components and APIs）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/components-and-apis.html)

React Native provides a number of built-in components. You will find a full list of components and APIs on the sidebar to the left. If you're not sure where to get started, take a look at the following categories:

React Native提供了大量的内置组件，可以在官网的左侧边栏查看完整的组件和API列表。如果不知从何下手，可以先看看下面的分类：

- [基础组件（Basic Components）](#basic-components)
- [用户交互组件（User Interface）](#user-interface)
- [列表视图组件（Lists Views）](#list-views)
- [iOS特定组件（iOS-specific）](#ios-components-and-apis)
- [Android特定组件（Android-specific）](#android-components-and-apis)
- [其他（Others）](#others)

You're not limited to the components and APIs bundled with React Native. React Native is a community of thousands of developers. If you're looking for a library that does something specific, search the npm registry for packages mentioning [react-native](https://www.npmjs.com/search?q=react-native&page=1&ranking=optimal), or check out [Awesome React Native](http://www.awesome-react-native.com/) for a curated list.

不需要局限于React Native的内置组件。React Native是由上千开发者组成的社区。可以在npm直接搜索[react-native](https://www.npmjs.com/search?q=react-native&page=1&ranking=optimal)你需要的库即可，也可以查阅[Awesome React Native](http://www.awesome-react-native.com/)网站的清单。

## 基础组件（Basic Components）

Most apps will end up using one of these basic components. You'll want to get yourself familiarized with all of these if you're new to React Native.

大多数应用程序都会用到这些基础组件，如果你是一个React Native的新手，首先需要熟悉这些基础组件。

1. [视图块（View）](https://facebook.github.io/react-native/docs/view.html)  
    The most fundamental component for building a UI.  
    构建UI最常见的组件。

2. [文本（Text）](https://facebook.github.io/react-native/docs/text.html)  
    A component for displaying text.  
    显示文本的组件。

3. [图片（Image）](https://facebook.github.io/react-native/docs/image.html)  
    A component for displaying images.  
    显示图片的组件。

4. [文本输入（TextInput）](https://facebook.github.io/react-native/docs/textinput.html)  
    A component for inputting text into the app via a keyboard.  
    应用程序中需要通过键盘输入的文本输入组件。

5. [滚动视图（ScrollView）](https://facebook.github.io/react-native/docs/scrollview.html)  
    Provides a scrolling container that can host multiple components and views.  
    为多组件和视图块提供一个可滚动容器。

6. [样式表（StyleSheet）](https://facebook.github.io/react-native/docs/stylesheet.html)  
    Provides an abstraction layer similar to CSS stylesheets  
    提供一个跟CSS样式表类似的抽象层。

## 用户交互组件（User Interface）

Render common user interface controls on any platform using the following components. For platform specific components, keep reading.

下列组件是跨平台通用的用户交互组件。之后会介绍特定平台相关的组件。

1. [按钮（Button）](https://facebook.github.io/react-native/docs/button.html)  
    A basic button component for handling touches that should render nicely on any platform.  
    用于跨平台处理触摸（点击）事件的基础按钮组件。
  
1. [选择器（Picker）](https://facebook.github.io/react-native/docs/picker.html)  
    Renders the native picker component on iOS and Android.  
    渲染iOS和Android平台特定的原生选择器组件。
  
1. [滑块（Slider）](https://facebook.github.io/react-native/docs/slider.html)  
    A component used to select a single value from a range of values.  
    用来从一组值中选择单个值的组件。
  
1. [开关（Switch）](https://facebook.github.io/react-native/docs/switch.html)  
    Renders a boolean input.  
    渲染一个Boolean输入框。

## List Views

Unlike the more generic `ScrollView`, the following list view components only render elements that are currently showing on the screen. This makes them a great choice for displaying long lists of data.

与通用的`ScrollView`不同，下列组件仅仅渲染当前屏幕上显示的元素，这对于长列表来说是最佳的选择。
  
1. [扁平列表（FlatList）](https://facebook.github.io/react-native/docs/flatlist.html)  
    A component for rendering performant scrollable lists.  
    高性能渲染可滑动列表的组件。
  
1. [节列表（SectionList）](https://facebook.github.io/react-native/docs/sectionlist.html)  
    Like <code>FlatList</code>, but for sectioned lists.  
    跟`FlatList`相似，但可以分节渲染。
  
## iOS特定组件和API（iOS Components and APIs）

Many of the following components provide wrappers for commonly used UIKit classes.

下列大多数组件是UIKit类的包装器。
  
1. [ActionSheetIOS](https://facebook.github.io/react-native/docs/actionsheetios.html)  
    API to display an iOS action sheet or share sheet.  
    在iOS中显示Action Sheet或Share Sheet的API。
  
1. [AdSupportIOS](https://facebook.github.io/react-native/docs/adsupportios.html)  
    API to access the "advertising identifier" on iOS.  
    在iOS中访问”广告标识“的API。
  
1. [AlertIOS](https://facebook.github.io/react-native/docs/alertios.html)  
    Create an iOS alert dialog with a message or create a prompt for user input.  
    在iOS中弹出警告框，或者用户输入弹窗。
  
1. [DatePickerIOS](https://facebook.github.io/react-native/docs/datepickerios.html)  
    Renders a date/time picker (selector) on iOS.  
    在iOS中渲染日期/事件选择器。
  
1. [ImagePickerIOS](https://facebook.github.io/react-native/docs/imagepickerios.html)  
    Renders a image picker on iOS.  
    在iOS中渲染图片选择器。
  
1. [NavigatorIOS](https://facebook.github.io/react-native/docs/navigatorios.html)  
    A wrapper around <code>UINavigationController</code>, enabling you to implement a navigation stack.  
    `UINavigationController`类的封装，用来实现导航栈。
  
1. [ProgressViewIOS](https://facebook.github.io/react-native/docs/progressviewios.html)  
    Renders a <code>UIProgressView</a></code> on iOS.  
    在iOS中渲染`UIProgressView`。
  
  
1. [PushNotificationIOS](https://facebook.github.io/react-native/docs/pushnotificationios.html)  
    Handle push notifications for your app, including permission handling and icon badge number.  
    处理应用程序的推送信息，以及相关的权限申请和Icon数字角标处理。
  
1. [SegmentedControlIOS](https://facebook.github.io/react-native/docs/segmentedcontrolios.html)  
    Renders a <code>UISegmentedControl</code> on iOS.  
    在iOS中渲染`UISegmentedControl`组件。
  
  
1. [TabBarIOS](https://facebook.github.io/react-native/docs/tabbarios.html)  
    Renders a <code>UITabViewController</code> on iOS. Use with <a href="https://facebook.github.io/react-native/docs/tabbarios-item.html">TabBarIOS.Item</a>.  
    在iOS中使用[TabBarIOS.Item](https://facebook.github.io/react-native/docs/tabbarios-item.html]渲染`UITabViewController`。
  

## Android特定组件和API（Android Components and APIs）

Many of the following components provide wrappers for commonly used Android classes.

下列大多数组件是Android中常用类的包装器。
  
1. [BackHandler](https://facebook.github.io/react-native/docs/backhandler.html)  
    Detect hardware button presses for back navigation.  
    监测物理返回键。
  
1. [DrawerLayoutAndroid](https://facebook.github.io/react-native/docs/drawerlayoutandroid.html)  
    Renders a <code>DrawerLayout</code> on Android.  
    在Android上渲染`DrawerLayout`。
  
1. [PermissionsAndroid](https://facebook.github.io/react-native/docs/permissionsandroid.html)  
    Provides access to the permissions model introduced in Android M.  
    提供Android M中引入的权限模型的访问。
  
1. [ProgressBarAndroid](https://facebook.github.io/react-native/docs/progressbarandroid.html)  
    Renders a <code>ProgressBar</code> on Android.  
    在Android中渲染`ProgressBar`。

1. [DatePickerAndroid](https://facebook.github.io/react-native/docs/datepickerandroid.html)  
    Opens the standard Android date picker dialog.  
    在Android中打开标准的日期选择器对话框。
  
1. [TimePickerAndroid](https://facebook.github.io/react-native/docs/timepickerandroid.html)  
    Opens the standard Android time picker dialog.  
    在Android中打开标准的时间选择器对话框。
    
1. [ToastAndroid](https://facebook.github.io/react-native/docs/toastandroid.html)  
    Create an Android Toast alert.  
    在Android中创建Toast提示框。
  
1. [ToolbarAndroid](https://facebook.github.io/react-native/docs/toolbarandroid.html)  
    Renders a <code>Toolbar</code> on Android.  
    在Android中渲染`Toolbar`。
  
1. [ViewPagerAndroid](https://facebook.github.io/react-native/docs/viewpagerandroid.html)  
    Container that allows to flip left and right between child views.  
    子视图可以左右滑动的容器组件。

## 其他（Others）

These components may come in handy for certain applications. For an exhaustive list of components and APIs, check out the sidebar to the left.

在某些应用中会用到下列组件，在官网的左侧边栏可以查看详细的组件和API列表。

1. [ActivityIndicator](https://facebook.github.io/react-native/docs/activityindicator.html)  
    Displays a circular loading indicator.  
    显示一个原型的加载指示器。
  
1. [Alert](https://facebook.github.io/react-native/docs/alert.html)  
    Launches an alert dialog with the specified title and message.  
    根据指定的标题和消息创建警告弹窗。
  
1. [Animated](https://facebook.github.io/react-native/docs/animated.html)  
    A library for creating fluid, powerful animations that are easy to build and maintain.  
    易于使用和维护，用来创建流畅、强大的动画效果的动画库。
  
1. [CameraRoll](https://facebook.github.io/react-native/docs/cameraroll.html)  
    Provides access to the local camera roll / gallery.  
    提供本地相册访问。
  
1. [Clipboard](https://facebook.github.io/react-native/docs/clipboard.html)  
    Provides an interface for setting and getting content from the clipboard on both iOS and Android.  
    提供在iOS和Android上通用的剪贴板读写接口。
  
1. [Dimensions](https://facebook.github.io/react-native/docs/dimensions.html)  
    Provides an interface for getting device dimensions.  
    提供设备尺寸的读取接口。
  
1. [KeyboardAvoidingView](https://facebook.github.io/react-native/docs/keyboardavoidingview.html)  
    Provides a view that moves out of the way of the virtual keyboard automatically.  
    提供自动关闭虚拟键盘的视图。
  
1. [Linking](https://facebook.github.io/react-native/docs/linking.html)  
    Provides a general interface to interact with both incoming and outgoing app links.  
    提供一个通用的接口，用来跟输入和输出的应用程序的链接进行交互。
  
1. [Modal](https://facebook.github.io/react-native/docs/modal.html)  
    Provides a simple way to present content above an enclosing view.  
    提供一种简单的方式用来实现模态窗口。
  
1. [PixelRatio](https://facebook.github.io/react-native/docs/pixelratio.html)  
    Provides access to the device pixel density.  
    提供设备独立像素比的访问接口。
  
1. [RefreshControl](https://facebook.github.io/react-native/docs/refreshcontrol.html)  
    This component is used inside a <code>ScrollView</code> to add pull to refresh functionality.  
    用来在ScrollView内部实现上拉刷新功能的组件。

1. [StatusBar](https://facebook.github.io/react-native/docs/statusbar.html)  
    Component to control the app status bar.  
    控制App状态栏的组件。
  
1. [WebView](https://facebook.github.io/react-native/docs/webview.html)  
    A component that renders web content in a native view.  
    用本地WebView视图渲染Web内容的组件。
