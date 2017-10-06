---
layout: post
title: React Native 31 - 指南：测试对React Native本身的更改（Testing your Changes）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/testing.html)

This document is about testing your changes to React Native as a [contributor](https://facebook.github.io/react-native/docs/contributing.html). If you're interested in testing a React Native app, check out the [React Native Tutorial](http://facebook.github.io/jest/docs/tutorial-react-native.html) on the Jest website.

本文档是关于React Native[贡献者](https://facebook.github.io/react-native/docs/contributing.html)对其更改进行测试的说明。如果您需要对React Native的应用程序进行测试，请参考Jest网站上的[React Native教程](http://facebook.github.io/jest/docs/tutorial-react-native.html)。

The React Native repo has several tests you can run to verify you haven't caused a regression with your PR.  These tests are run with the [Travis](https://travis-ci.org/facebook/react-native/builds) and [Circle](https://circleci.com/gh/facebook/react-native) continuous integration systems, which will automatically annotate pull requests with the test results.

React Native库中有一些测试用例，可以用来对您的PR进行回归测试。测试用例部署在持续集成系统[Travis](https://travis-ci.org/facebook/react-native/builds)和[Circle](https://circleci.com/gh/facebook/react-native)上，会自动把测试结果注释到PR上。

Whenever you are fixing a bug or adding new functionality to React Native, you should add a test that covers it. Depending on the change you're making, there are different types of tests that may be appropriate.

当为React Native修改一个Bug，或者添加一项新的功能时，您应该添加一个对应的测试用例覆盖。下面有几种不同的测试方法，可以根据您的修改进行选择。

- [JavaScript](#javascript)
- [Android](#android)
- [iOS](#ios)
- [Apple TV](#apple-tv)
- [End-to-end tests](#end-to-end-tests)
- [Website](#website)

## JavaScript

### Jest

Jest tests are JavaScript-only tests run on the command line with node. You can run the existing React Native jest tests with:

Jest测试运行在命令行中的Node环境上，仅仅针对JavaScript。可以执行下面的命令进行React Native测试：

```sh
$ cd react-native
$ npm test
```

It's a good idea to add a Jest test when you are working on a change that only modifies JavaScript code.

当修改JavaScript代码之后，最好添加一个对应的Jest测试用例。

The tests themselves live in the `__tests__` directories of the files they test.  See [`TouchableHighlight-test.js`](https://github.com/facebook/react-native/blob/master/Libraries/Components/Touchable/__tests__/TouchableHighlight-test.js) for a basic example.

测试用例放在`__tests__`目录中，查看[`TouchableHighlight-test.js`](https://github.com/facebook/react-native/blob/master/Libraries/Components/Touchable/__tests__/TouchableHighlight-test.js)了解详细。

### Flow

You should also make sure your code passes [Flow](https://flowtype.org/) tests. These can be run using:

同时更改的代码需要通过[Flow](https://flowtype.org/)测试。可以通过下面的命令启动测试：

```sh
$ cd react-native
$ npm run flow
```

## Android

### Unit Tests

The Android unit tests do not run in an emulator. They just use a normal Java installation. The default macOS Java install is insufficient, you may need to install [Java 8 (JDK8)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html). You can type `javac -version` in a terminal to see what version you have:

Android的单元测试运行在普通的Java环境中，而不是模拟器。macOS中默认安装的有可能无法满足要求，至少需要安装[Java 8 (JDK8)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)。可以在终端中输入`javac -version`来查看电脑上的版本：

```sh
$ javac -version
javac 1.8.0_111
```

The version string `1.8.x_xxx` corresponds to JDK 8.

`1.8.x_xxx`表示JDK 8。

You also need to install the [Buck build tool](https://buckbuild.com/setup/install.html).

同时需要安装[Buck构建工具](https://buckbuild.com/setup/install.html)。

To run the Android unit tests:

运行Android单元测试：

```sh
$ cd react-native
$ ./scripts/run-android-local-unit-tests.sh
```

It's a good idea to add an Android unit test whenever you are working on code that can be tested by Java code alone. The Android unit tests live under [`ReactAndroid/src/tests`](https://github.com/facebook/react-native/tree/master/ReactAndroid/src/test/java/com/facebook/react), so you can browse through that directory for good examples of tests.

当修改可以测试的Java代码之后，最好添加一个对应的Android单元测试用例。Android的单元测试用例放置在[`ReactAndroid/src/tests`](https://github.com/facebook/react-native/tree/master/ReactAndroid/src/test/java/com/facebook/react)目录中，测试用例的编写可以参考目录中的其他测试用例。

### Integration Tests

To run the integration tests, you need to install the Android NDK. See [Prerequisites](https://facebook.github.io/react-native/docs/android-building-from-source.html#prerequisites).

运行集成测试的前提是，安装Android NDK。详见[前提条件](https://facebook.github.io/react-native/docs/android-building-from-source.html#prerequisites)。

You also need to install the [Buck build tool](https://buckbuild.com/setup/install.html).

也需要安装[Buck构建工具](https://buckbuild.com/setup/install.html)。

We recommend running the Android integration tests in an emulator, although you can also use a real Android device. It's a good idea to keep the emulator running with a visible window. That way if your tests stall, you can look at the emulator to debug.

建议在模拟器中运行Android的集成测试，当然也可以使用Android真机。在测试的时候最好能保持模拟器可见，这样当测试失败的时候，可以根据模拟器的状态进行调试。

Some devices and some emulator configurations may not work with the tests. We do maintain an emulator configuration that works, as the standard for testing. To run this emulator config:

某些设备和模拟器的配置可能无法运行这些测试，为了方便工作，我们维护了一份模拟器的配置，可以作为标准的测试环境。启动模拟器的命令如下：

```sh
$ cd react-native
$ ./scripts/run-android-emulator.sh
```

Once you have an emulator running, to run the integration tests:

如果有正在运行中的模拟器，如下执行集成测试：

```sh
$ cd react-native
$ ./scripts/run-android-local-integration-tests.sh
```

The integration tests should only take a few minutes to run on a modern developer machine.

在现在的开发电脑上，集成测试需要运行几分钟时间。

It's a good idea to add an Android integration test whenever you are working on code that needs both JavaScript and Java to be tested in conjunction. The Android integration tests live under [`ReactAndroid/src/androidTest`](https://github.com/facebook/react-native/tree/master/ReactAndroid/src/androidTest/java/com/facebook/react/tests), so you can browse through that directory for good examples of tests.

当更改JavaScript代码或Java代码的时候，最好添加一个对应的Android集成测试用例。Android的集成测试用例放置在[`ReactAndroid/src/androidTest`](https://github.com/facebook/react-native/tree/master/ReactAndroid/src/androidTest/java/com/facebook/react/tests)目录中，测试用例的编写可以参考目录中的其他测试用例。

## iOS

### Integration Tests

React Native provides facilities to make it easier to test integrated components that require both native and JS components to communicate across the bridge.  The two main components are `RCTTestRunner` and `RCTTestModule`.  `RCTTestRunner` sets up the ReactNative environment and provides facilities to run the tests as `XCTestCase`s in Xcode (`runTest:module` is the simplest method).  `RCTTestModule` is exported to JS as `NativeModules.TestModule`.  

React Native为集成组件测试提供了基础方法，原生和JS组件通过桥来通信。这两个主要组件是`RCTTestRunner`和`RCTTestModule`。`RCTTestRunner`设置React Native的环境，并提供了把测试用例作为`XCTestCase`在Xcode中运行的功能（`runTest:module`是最简单的例子）。`RCTTestModule`将JS导出为`NativeModules.TestModule`。

The tests themselves are written in JS, and must call `TestModule.markTestCompleted()` when they are done, otherwise the test will timeout and fail.  Test failures are primarily indicated by throwing a JS exception.  It is also possible to test error conditions with `runTest:module:initialProps:expectErrorRegex:` or `runTest:module:initialProps:expectErrorBlock:` which will expect an error to be thrown and verify the error matches the provided criteria.  

测试用例本身使用JS编写的，并且当测试完成的时候必须调用`TestModule.markTestCompleted()`方法，否则将超时或失败，抛出JS的异常。也可以用`runTest:module:initialProps:expectErrorRegex:`或`runTest:module:initialProps:expectErrorBlock:`来测试错误条件。

See the following for example usage and integration points:

集成的切入点和使用方法可以参考下面的例子：

- [`IntegrationTestHarnessTest.js`](https://github.com/facebook/react-native/blob/master/IntegrationTests/IntegrationTestHarnessTest.js)
- [`RNTesterIntegrationTests.m`](https://github.com/facebook/react-native/blob/master/RNTester/RNTesterIntegrationTests/RNTesterIntegrationTests.m)
- [`IntegrationTestsApp.js`](https://github.com/facebook/react-native/blob/master/IntegrationTests/IntegrationTestsApp.js)

You can run integration tests locally with cmd+U in the IntegrationTest and RNTester apps in Xcode, or by running the following in the command line on macOS:

可以在Xcode中打开RNTester使用cmd+U组合键来启动集成测试，或者在macOS中执行下面的命令：

```sh
$ cd react-native
$ ./scripts/objc-test-ios.sh
```

> Your Xcode install will come with a variety of Simulators running the latest OS. You may need to manually create a new Simulator to match what the `XCODE_DESTINATION` param in the test script.
>
> Xcode中存在最新版本OS的各种模拟器，您需要创建一个与测试脚本中`XCODE_DESTINATION`参数匹配的模拟器。

### Screenshot/Snapshot Tests

A common type of integration test is the snapshot test.  These tests render a component, and verify snapshots of the screen against reference images using `TestModule.verifySnapshot()`, using the [`FBSnapshotTestCase`](https://github.com/facebook/ios-snapshot-test-case) library behind the scenes.  Reference images are recorded by setting `recordMode = YES` on the `RCTTestRunner`, then running the tests.  Snapshots will differ slightly between 32 and 64 bit, and various OS versions, so it's recommended that you enforce tests are run with the correct configuration.  It's also highly recommended that all network data be mocked out, along with other potentially troublesome dependencies.  See [`SimpleSnapshotTest`](https://github.com/facebook/react-native/blob/master/IntegrationTests/SimpleSnapshotTest.js) for a basic example.

集成测试的常见类型是快照测试，渲染一个被测试的组件，使用`TestModule.verifySnapshot()`将快照和参照图片进行对比，内部使用了[`FBSnapshotTestCase`](https://github.com/facebook/ios-snapshot-test-case)库。在`RCTTestRunner`中设置`recordMode = YES`后，可以记录参考图片。在32位系统和64位系统之间，以及不同版本的操作系统之间，快照会存在差异，所以建议在正确的配置中运行测试用例。同时强烈建议Mock所有的网络数据和其他的依赖关系。参考[`SimpleSnapshotTest`](https://github.com/facebook/react-native/blob/master/IntegrationTests/SimpleSnapshotTest.js)编写测试用例。

If you make a change that affects a snapshot test in a PR, such as adding a new example case to one of the examples that is snapshotted, you'll need to re-record the snapshot reference image.  To do this, simply change to `_runner.recordMode = YES;` in [RNTester/RNTesterSnapshotTests.m](https://github.com/facebook/react-native/blob/master/RNTester/RNTesterIntegrationTests/RNTesterSnapshotTests.m#L42), re-run the failing tests, then flip record back to `NO` and submit/update your PR and wait to see if the Travis build passes.

如果PR影响了屏幕快照，需要添加一个新的快照，需要重新记录快照参考图片。只需要修改[RNTester/RNTesterSnapshotTests.m](https://github.com/facebook/react-native/blob/master/RNTester/RNTesterIntegrationTests/RNTesterSnapshotTests.m#L42)文件中对应的代码为`_runner.recordMode = YES;`，重新测试用例（会执行失败，因为这一步是为了生成参考图片），然后将代码还原后提交，等待Travis的测试结果。

## Apple TV

The same tests discussed above for iOS will also run on tvOS.  In the RNTester Xcode project, select the RNTester-tvOS target, and you can follow the same steps above to run the tests in Xcode.

上面iOS中的测试用例同样可以运行在tvOS中，在RNTester Xcode项目中，选择运行目标为TNTester-tvOS，重新执行上面的步骤即可。

You can run Apple TV unit and integration tests locally by running the following in the command line on macOS:

用下面的命令可以在macOS中运行Apple TV的单元测试和集成测试：

```sh
$ cd react-native
$ ./scripts/objc-test-tvos.sh (make sure the line `TEST="test"` is uncommented)
```

## End-to-end tests

Finally, make sure end-to-end tests run successfully by executing the following script:

最终，确保端到端测试用下面的脚本执行成功：

```sh
$ cd react-native
$ ./scripts/test-manual-e2e.sh
```

## Website

The React Native website is hosted on GitHub pages and is automatically generated from Markdown sources as well as comments in the JavaScript source files. It's always a good idea to check that the website is generated properly whenever you edit the docs.

React Native的站点托管在GitHub上，会自动根据Markdown文档生成网页，并从JavaScript文件中提取注释。编辑文档后，建议提交代码前用下面的命令检查website生成正常。

```sh
$ cd website
$ npm install
$ npm start
```

Then open http://localhost:8079/react-native/index.html in your browser.

在浏览器中输入http://localhost:8079/react-native/index.html打开网页。
