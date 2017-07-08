---
layout: post
title: React Native 1 - 快速起步（Quick Start）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/getting-started.html)


This page will help you install and build your first React Native app. If you already have React Native installed, you can skip ahead to the [Tutorial](https://facebook.github.io/react-native/docs/tutorial.html).

本文的内容是安装并创建第一个React Native应用。如果已经安装了React Native，可以直接跳到[课程](https://facebook.github.io/react-native/docs/tutorial.html)进行学习。

[Create React Native App](https://github.com/react-community/create-react-native-app) is the easiest way to start building a new React Native application. It allows you to start a project without installing or configuring any tools to build native code - no Xcode or Android Studio installation required (see [Caveats](#caveats)).

[Create React Native App](https://github.com/react-community/create-react-native-app)是创建React Native应用最简单的方式，而且不需要安装和配置编译本地代码的工具——Xcode或Android Studio（更多可查看[注意事项](#caveats)）。

Assuming that you have [Node](https://nodejs.org/en/download/) installed, you can use npm to install the `create-react-native-app` command line utility:

安装`create-react-native-app`命令行工具的前提是安装[Node](https://nodejs.org/en/download/)，之后执行：

```
npm install -g create-react-native-app
```

Then run the following commands to create a new React Native project called "AwesomeProject":

之后执行下面的命令来创建一个叫做“AwesomeProject”的新React Native项目：

```
create-react-native-app AwesomeProject

cd AwesomeProject
npm start
```

This will start a development server for you, and print a QR code in your terminal.

现在会启动一个开发服务器，并在终端打印一个二维码。

## 运行React Native应用程序（Running your React Native application）

Install the [Expo](https://expo.io) client app on your iOS or Android phone and connect to the same wireless network as your computer. Using the Expo app, scan the QR code from your terminal to open your project.

在iOS或Android上安装[Expo](https://expo.io)客户端应用程序，并将手机连接到和开发机相同的无线网络中。使用Expo应用程序，扫描终端中的二维码启动项目。

### 修改应用程序（Modifying your app）

Now that you have successfully run the app, let's modify it. Open `App.js` in your text editor of choice and edit some lines. The application should reload automatically once you save your changes.

现在已经将应用程序成功运行，接着可以对其进行修改。在文本编辑器中打开`App.js`并编辑其中的几行，保存更改后应用程序会自动刷新。

### 起步成功！（That's it!）

Congratulations! You've successfully run and modified your first React Native app.

恭喜！已经成功的运行并且修改了第一个React Native应用程序。

<center><img src="/tech/media/react-native-congratulations.png" width="150" /></center>

## 接下来怎么办？（Now what?）

- Create React Native App also has a [user guide](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md) you can reference if you have questions specific to the tool.

- If you can't get this to work, see the [Troubleshooting](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md#troubleshooting) section in the README for Create React Native App.

- 如果遇到Create React Native App的特定使用问题，可以查阅其[用户指南](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md)。

- 如果上面运行出错，可以查阅Create React Native App的README中的[疑难问题](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md#troubleshooting)章节。

If you're curious to learn more about React Native, continue on
to the [Tutorial](https://facebook.github.io/react-native/docs/tutorial.html).

如果期待学习更多React Native，请继续学习后面的[教程](https://facebook.github.io/react-native/docs/tutorial.html)。

### 在模拟器或虚拟设备上运行应用程序（Running your app on a simulator or virtual device）

Create React Native App makes it really easy to run your React Native app on a physical device without setting up a development environment. If you want to run your app on the iOS Simulator or an Android Virtual Device, please refer to the instructions for building projects with native code to learn how to install Xcode and set up your Android development environment.

使用Create React Native App，不用配置开发环境就可以在实体设备上运行React Native应用程序。如果需要在iOS模拟器或者Android虚拟设备上运行应用程序，请参考在本地代码中创建项目章节中的介绍，学习在电脑上安装Xcode或者设置Android开发环境。

Once you've set these up, you can launch your app on an Android Virtual Device by running `npm run android`, or on the iOS Simulator by running `npm run ios` (macOS only).

设置成功之后，可以执行`npm run android`以在Android虚拟设备上运行应用程序，执行`npm run ios`（仅可在macOS上）以在iOS模拟器上运行。

### 注意事项（Caveats）

Because you don't build any native code when using Create React Native App to create a project, it's not possible to include custom native modules beyond the React Native APIs and components that are available in the Expo client app.

由于使用Create React Native App创建的应用程序没有执行任何本地代码，所以不能使用自定义的本地模块，只能使用Expo客户端支持的React Native API和组件。

If you know that you'll eventually need to include your own native code, Create React Native App is still a good way to get started. In that case you'll just need to "[eject](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md#ejecting-from-create-react-native-app)" eventually to create your own native builds. If you do eject, the "Building Projects with Native Code" instructions will be required to continue working on your project.

即使最终会将项目包含在本地代码中，Create React Native App依然是一个非常好的起步方式。这种情况下，只需要[eject](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md#ejecting-from-create-react-native-app)"来创建本地构建。如果执行了eject操作，需要使用“在本地代码中构建项目”的介绍继续工作。

Create React Native App configures your project to use the most recent React Native version that is supported by the Expo client app. The Expo client app usually gains support for a given React Native version about a week after the React Native version is released as stable. You can check [this document](https://github.com/react-community/create-react-native-app/blob/master/VERSIONS.md) to find out what versions are supported.

Create React Native App配置的应用程序，会使用Expo客户端支持的最新版本的React Native。Expo客户端通常在React Native最新版本发布一周左右提供支持，可以查看[这份文档](https://github.com/react-community/create-react-native-app/blob/master/VERSIONS.md)来确定支持的版本。

If you're integrating React Native into an existing project, you'll want to skip Create React Native App and go directly to setting up the native build environment. Select "Building Projects with Native Code" above for instructions on configuring a native build environment for React Native.

如果需要将React Native集成到现存的项目中，跳过本文直接设置本地构建环境。可以参考“在本地代码中构建项目”来设置React Native的开发环境。
