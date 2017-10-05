---
layout: post
title: React Native 29 - 指南：升级到React Native新版本（Upgrading to new React Native versions）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/upgrading.html)

Upgrading to new versions of React Native will give you access to more APIs, views, developer tools and other goodies. Upgrading requires a small amount of effort, but we try to make it easy for you. The instructions are a bit different depending on whether you used `create-react-native-app` or `react-native init` to create your project.

将React Native升级到新版本可以获取更多的API、视图组件、开发者工具和其他的新特性。升级需要做一定的工作，但我们会努力使其变得更简单。取决于`create-react-native-app`或`react-native init`，这份介绍会存在些许的差异。

## Create React Native App项目（Create React Native App projects）

Upgrading your Create React Native App project to a new version of React Native requires updating the `react-native`, `react`, and `expo` package versions in your `package.json` file. Please refer to [this document](https://github.com/react-community/create-react-native-app/blob/master/VERSIONS.md) to find out what versions are supported. You will also need to set the correct `sdkVersion` in your `app.json` file.

将Create React Native App项目升级到React Native的新版本，需要升级`package.json`文件中的`react-native`、`react`和`expo`三个软件包。参考[这份文档](https://github.com/react-community/create-react-native-app/blob/master/VERSIONS.md)确定支持的版本，并在`app.json`文件中设置正确的`sdkVersion`。

See the [CRNA user guide](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md#updating-to-new-releases) for up-to-date information about upgrading your project.

参考[CRNA用户指南](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md#updating-to-new-releases)中关于升级部分的信息，来升级项目。

## Projects built with native code

### Projects with Native Code Only

This section only applies to projects made with `react-native init` or to those made with Create React Native App which have since ejected. For more information about ejecting, please see the [guide](https://github.com/react-community/create-react-native-app/blob/master/EJECTING.md) on the Create React Native App repository.

这一小节仅适用于由`react-native init`创建的项目，或者由Create React Native App创建但已经独立（ejected）的项目。关于独立（ejected）的信息，请参考Create React Native App库中的[指南](https://github.com/react-community/create-react-native-app/blob/master/EJECTING.md)说明。

Because React Native projects built with native code are essentially made up of an Android project, an iOS project, and a JavaScript project, upgrading can be rather tricky. Here's what you need to do to upgrade from an older version of React Native.

因为React Native项目的构建本质上由Android项目、iOS项目和JavaScript项目3个项目构成，所以升级起来会复杂一些。下面是从旧版本升级时需要进行的工作。

### 基于Git升级（Upgrade based on Git）

The module `react-native-git-upgrade` provides a one-step operation to upgrade the source files with a minimum of conflicts. Under the hood, it consists in 2 phases:

* First, it computes a Git patch between both old and new template files,
* Then, the patch is applied on the user's sources.

`react-native-git-upgrade`模块提供了一步到位的操作方法，把需要更新的源码全部更新。这里面包含了一下两个步骤：

* 首先，在新旧两个版本的模板文件中计算出Git的补丁文件；
* 然后，把补丁文件应用到用户的源码中。

> **IMPORTANT:** You don't have to install the new version of the `react-native` package, it will be installed automatically.
>
> **重要：**，不必手动安装`react-native`的新版本，它将会被自动安装。

#### 1. 安装Git（Install Git）

While your project does not have to be handled by the Git versioning system -- you can use Mercurial, SVN, or nothing -- you will still need to [install Git](https://git-scm.com/downloads) on your system in order to use `react-native-git-upgrade`. Git will also need to be available in the `PATH`.

无论您的项目源码是否使用Git管理（比如使用的是Mercurial、SVN或者不使用任何代码版本管理系统），您需要在系统中[安装Git](https://git-scm.com/downloads)，才能使用`react-native-git-upgrade`。同时需要在`PATH`中设置Git以保证全局可用。

#### 2. 安装`react-native-git-upgrade`模块（Install the `react-native-git-upgrade` module）

The `react-native-git-upgrade` module provides a CLI and must be installed globally:

`react-native-git-upgrade`模块提供了CLI，必须全局安装：

```sh
$ npm install -g react-native-git-upgrade
```

#### 3. 执行命令（Run the command）

Run the following command to start the process of upgrading to the latest version:

执行下面的命令，启动升级到最新版本的过程：

```sh
$ react-native-git-upgrade
```

> You may specify a React Native version by passing an argument: `react-native-git-upgrade X.Y`
>
> 可以通过传参来指定升级目标的React Native版本：`react-native-git-upgrade X.Y`

The templates are upgraded in a optimized way. You still may encounter conflicts but only where the Git 3-way merge have failed, depending on the version and how you modified your sources.

更新模板的方式已经经过优化，但根据要更新的版本和本地的代码修改的状态，还是可能遇到冲突的情况（合并基于Git的3-Way合并算法）。

#### 4. 解决冲突（Resolve the conflicts）

Conflicted files include delimiters which make very clear where the changes come from. For example:

发生冲突的文件包含分隔符，清晰的标明了哪里发生了冲突，冲突来源于哪儿。如下所示：

```
13B07F951A680F5B00A75B9A /* Release */ = {
  isa = XCBuildConfiguration;
  buildSettings = {
    ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
<<<<<<< ours
    CODE_SIGN_IDENTITY = "iPhone Developer";
    FRAMEWORK_SEARCH_PATHS = (
      "$(inherited)",
      "$(PROJECT_DIR)/HockeySDK.embeddedframework",
      "$(PROJECT_DIR)/HockeySDK-iOS/HockeySDK.embeddedframework",
    );
=======
    CURRENT_PROJECT_VERSION = 1;
>>>>>>> theirs
    HEADER_SEARCH_PATHS = (
      "$(inherited)",
      /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include,
      "$(SRCROOT)/../node_modules/react-native/React/**",
      "$(SRCROOT)/../node_modules/react-native-code-push/ios/CodePush/**",
    );
```

You can think of "ours" as "your team" and "theirs" as "the React Native dev team".

“ours”标识您自己的团队代码，“theirs”标识“React Native开发团队”。

### 备用方法（Alternative）

Use this only in case the above didn't work.

建议上述方法不起作用的时候再使用下面的方法。

#### 1. 升级`react-native`依赖（Upgrade the `react-native` dependency）

Note the latest version of the `react-native` npm package [from here](https://www.npmjs.com/package/react-native) (or use `npm info react-native` to check).

可以[在这里](https://www.npmjs.com/package/react-native)查询`react-native`的最新版本（也可以使用`npm info react-native`检查）。

Now install that version of `react-native` in your project with `npm install --save`:

接下来使用`npm install --save`命令，在您的项目中安装上述查询到的`react-native`版本：

```sh
$ npm install --save react-native@X.Y
# where X.Y is the semantic version you are upgrading to
npm WARN peerDependencies The peer dependency react@~R included from react-native...
```

If you saw a warning about the peerDependency, also upgrade `react` by running:

如果您看到了上面的警告信息，请执行下面的命令升级`react`：

```sh
$ npm install --save react@R
# where R is the new version of react from the peerDependency warning you saw
```

#### 2. 升级项目模板（Upgrade your project templates）

The new npm package may contain updates to the files that are normally generated when you
run `react-native init`, like the iOS and the Android sub-projects.

执行新版本的NPM软件包的`react-native init`命令之后，在iOS和Android子项目中可能包含一些文件的更新。

You may consult [rn-diff](https://github.com/ncuillery/rn-diff) to see if there were changes in the project template files.
In case there weren't any, simply rebuild the project and continue developing. In case of minor changes, you may update your project manually and rebuild.

可以查询[rn-diff](https://github.com/ncuillery/rn-diff)项目确定更新的模板文件。如果没有更新的文件，简单的重新编译继续开发即可。当主版本发生较大的变化时，手工更新项目并重新编译即可。

If there were major changes, run this in a terminal to get these:

如果存在主版本的修改，执行下面的命令即可：

```sh
$ react-native upgrade
```

This will check your files against the latest template and perform the following:

* If there is a new file in the template, it is simply created.
* If a file in the template is identical to your file, it is skipped.
* If a file is different in your project than the template, you will be prompted; you have options to keep your file or overwrite it with the template version.

这将会根据最新的模板检查您的文件，并执行下面的步骤：

* 如果模板中存在新文件，则直接创建；
* 如果文件没有发生变化，则直接跳过；
* 如果和项目中的文件存在差异，则提示使用新文件替换，还是保留旧版本的文件？

## 手工更新（Manual Upgrades）

Some upgrades require manual steps, e.g. 0.13 to 0.14, or 0.28 to 0.29. Be sure to check the [release notes](https://github.com/facebook/react-native/releases) when upgrading so that you can identify any manual changes your particular project may require.

某些升级需要手工执行，比如0.13到0.14，或者0.28到0.29，首先在执行更新钱仔细阅读[发版说明](https://github.com/facebook/react-native/releases)，以便于确认需要更新变动的范围。
