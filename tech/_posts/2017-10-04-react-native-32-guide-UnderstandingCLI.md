---
layout: post
title: React Native 32 - 指南：定时器（Understanding the CLI）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/understanding-cli.html)

Though you may have installed the `react-native-cli` via npm as a separate module, it is a shell for accessing the CLI embedded
in the React Native of each project. Your commands and their effects are dependent on the version of the module of `react-native`
in context of the project. This guide will give a brief overview of the CLI in the module.

有可能您已经在电脑上通过npm独立安装了`react-native-cli`模块，但它本质上是React Native项目中内嵌的CLI工具的一个壳，项目中不同的`react-native`版本可能导致不同的执行结果。这篇文章只是简单的介绍一下这个CLI。

# 本地CLI（The local CLI）

React Native has a [`local-cli`](https://github.com/facebook/react-native/tree/master/local-cli) folder with a file named
[`cliEntry.js`](https://github.com/facebook/react-native/blob/master/local-cli/cliEntry.js).  Here, the commands are read
from `commands.js` and added as possible CLI commands.  _E.G._ the `react-native link` command, exists in the
[`react-native/local-cli/link`](https://github.com/facebook/react-native/blob/master/local-cli/link/) folder, and is
required in `commands.js`, which will register it as a documented command to be exposed to the CLI.

React Native的[`local-cli`](https://github.com/facebook/react-native/tree/master/local-cli)文件夹中有一个[`cliEntry.js`](https://github.com/facebook/react-native/blob/master/local-cli/cliEntry.js)，从`commands.js`中读取并将所有的命令添加到CLI中。以`react-native link`命令为例，存在[`react-native/local-cli/link`](https://github.com/facebook/react-native/blob/master/local-cli/link/)文件夹中，`commands.js`将其引用，随后作为一个文档完善的命令被暴露在CLI中。

# 命令定义（Command definitions）

At the end of each command entry is an export.  The export is an object with a function to perform, description of the command, and the command name.  The object structure for the `link` command looks like so:

在每条命令入口文件的结尾是一个导出对象，包含要调用的函数、命令的描述和命令名字。`link`命令的对象结构如下所示：

```js
module.exports = {
  func: link,
  description: 'links all native dependencies',
  name: 'link [packageName]',
};
```

### 参数（Parameters）

The command name identifies the parameters that a command would expect.  When the command parameter is surrounded by greater-than, less-than symbols `< >`, this indicates that the parameter is expected.  When a parameter is surrounded by brackets `[ ]`, this indicates that the parameter is optional.

命令标记了需要的参数。当参数被一对大于号和小于号`< >`包裹起来时，说明这个参数是必填参数；当参数被一对中括号`[ ]`包裹起来时，说明这个参数是选填参数。
