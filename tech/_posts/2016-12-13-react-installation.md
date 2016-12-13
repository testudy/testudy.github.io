---
layout: post
title: React使用方法（Installation）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/installation.html)

React is flexible and can be used in a variety of projects. You can create new apps with it, but you can also gradually introduce it into an existing codebase without doing a rewrite.

React是一个弹性化的技术方案，便于应用在不同类型的项目中。你可以从零开始创建一个新的项目，也可以将React循序渐进集成到一个已经上线的项目中。

## 浅尝React（Trying Out React）

If you're just interested in playing around with React, you can use CodePen. Try starting from [this Hello World example code](http://codepen.io/gaearon/pen/rrpgNB?editors=0010). You don't need to install anything; you can just modify the code and see if it works.

在CodePen中打开[this Hello World example code](http://codepen.io/gaearon/pen/rrpgNB?editors=0010)可以直接修改代码，实时查看运行结果，快速尝试React。

If you prefer to use your own text editor, you can also <a href="https://facebook.github.io/react/downloads/single-file-example.html" download="hello.html">download this HTML file</a>, edit it, and open it from the local filesystem in your browser. It does a slow runtime code transformation, so don't use it in production.

如果你习惯了用自己的编辑器，可以<a href="https://facebook.github.io/react/downloads/single-file-example.html" download="hello.html">下载这个文件</a>，直接修改后在浏览器中运行即可。注意：这个文件中包含一个运行时的代码编译，会影响代码的运行效率，不要直接用在线上生产环境中。

## 创建单页面应用（Creating a Single Page Application）

[Create React App](http://github.com/facebookincubator/create-react-app) is the best way to starting building a new React single page application. It sets up your development environment so that you can use the latest JavaScript features, provides a nice developer experience, and optimizes your app for production.

最好的方式是使用[Create React App工具](http://github.com/facebookincubator/create-react-app) 快捷的创建一个React单页面应用。这个工具会帮你设置好开发环境，方便你使用最新的JavaScript特性，提供一个良好的开发体验，并提供生产环境发布的优化工作。

```bash
npm install -g create-react-app
create-react-app hello-world
cd hello-world
npm start
```

Create React App doesn't handle backend logic or databases; it just creates a frontend build pipeline, so you can use it with any backend you want. It uses [webpack](https://webpack.js.org/), [Babel](http://babeljs.io/) and [ESLint](http://eslint.org/) under the hood, but configures them for you.

创建的React应用不涉及到后端逻辑和数据库，仅仅包含了前端编译流程，可以和任何后端搭配使用。默认集成了[webpack](https://webpack.js.org/)，[Babel](http://babeljs.io/)和[ESLint](http://eslint.org/)。

## 添加React到已存项目中（Adding React to an Existing Application）

You don't need to rewrite your app to start using React.

没有必要用React完全重新已存在的项目，将React无痛引入即可开始。

We recommend adding React to a small part of your application, such an individual widget, so you can see if it works well for your use case.

建议从应用的一个小部分开始，比如一个独立的功能组件，看看是否合适你的适用场景。

While React [can be used](/react/docs/react-without-es6.html) without a build pipeline, we recommend setting it up so you can be more productive. A modern build pipeline typically consists of:

虽然React可以不编译直接使用，但建议引入编译系统以提高生产效率。一个现代化的编译系统通常包含以下几部分：

* A **package manager**, such as [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/). It lets you take advantage of a vast ecosystem of third-party packages, and easily install or update them.

* 一个**包管理器**，比如[Yarn](https://yarnpkg.com/)或[npm](https://www.npmjs.com/)。以充分发挥丰富的第三方资源包的优势，便于安装和升级。

* A **bundler**, such as [webpack](https://webpack.github.io/) or [Browserify](http://browserify.org/). It lets you write modular code and bundle it together into small packages to optimize load time.

* 一个**打包器**，比如[webpack](https://webpack.github.io/)或[Browserify](http://browserify.org/)。便于代码组织模块化和优化打包管理。

* A **compiler** such as [Babel](http://babeljs.io/). It lets you write modern JavaScript code that still works in older browsers.

* 一个**编译器**，比如[Babel](http://babeljs.io/)。便于将最新的JavaSript特性使用到项目中，同时兼顾老版本浏览器的运行。

### 安装React（Installing React）

We recommend using [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) for managing front-end dependencies. If you're new to package managers, the [Yarn documentation](https://yarnpkg.com/en/docs/getting-started) is a good place to get started.

建议使用[Yarn](https://yarnpkg.com/)或[npm](https://www.npmjs.com/)等包管理器管理前端资源依赖。如果你没有使用过包管理器，可以参考[Yarn documentation](https://yarnpkg.com/en/docs/getting-started)快速入门。

To install React with Yarn, run:

使用Yarn安装React，执行:

```bash
yarn add react react-dom
```

To install React with npm, run:

使用npm安装React，执行：

```bash
npm install --save react react-dom
```

Both Yarn and npm download packages from the [npm registry](http://npmjs.com/).

可以从[npm registry](http://npmjs.com/)找到Yarn或npm。

### 启用ES6和JSX（Enabling ES6 and JSX）

We recommend using React with [Babel](http://babeljs.io/) to let you use ES6 and JSX in your JavaScript code. ES6 is a set of modern JavaScript features that make development easier, and JSX is an extension to the JavaScript language that works nicely with React.

建议React和[Babel](http://babeljs.io/)一起使用，以便于在代码中启用ES6和JSX的语法特性。ES6是一组便于JavaScript代码模块化的语言特性，JSX是React的好基友——为方便React开发而开发的JavaScript语言扩展。

The [Babel setup instructions](https://babeljs.io/docs/setup/) explain how to configure Babel in many different build environments. Make sure you install [`babel-preset-react`](http://babeljs.io/docs/plugins/preset-react/#basic-setup-with-the-cli-) and [`babel-preset-es2015`](http://babeljs.io/docs/plugins/preset-es2015/#basic-setup-with-the-cli-) and enable them in your [`.babelrc` configuration](http://babeljs.io/docs/usage/babelrc/), and you're good to go.

[Babel配置](https://babeljs.io/docs/setup/)中演示了不同环境下的开发配置。确保你安装了[`babel-preset-react`](http://babeljs.io/docs/plugins/preset-react/#basic-setup-with-the-cli-)和[`babel-preset-es2015`](http://babeljs.io/docs/plugins/preset-es2015/#basic-setup-with-the-cli-)，并在[`.babelrc` configuration](http://babeljs.io/docs/usage/babelrc/)打开启用配置，做好准备工作。

### 使用ES6和JSX创建Hello World（Hello World with ES6 and JSX）

We recommend using a bundler like [webpack](https://webpack.github.io/) or [Browserify](http://browserify.org/) so you can write modular code and bundle it together into small packages to optimize load time.

再次建议你使用[webpack](https://webpack.github.io/)或[Browserify](http://browserify.org/)等打包器，以组织模块化代码，并打包以优化程序加载时间。

The smallest React example looks like this:

简单的React示例如下：

```js
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

This code renders into a DOM element with the id of `root` so you need `<div id="root"></div>` somewhere in your HTML file.

在你的HTML文件中预置`root`元素——将`<div id="root"></div>`放置在任意位置，上述代码将在`root`元素中渲染DOM元素。

Similarly, you can render a React component inside a DOM element somewhere inside your existing app written with any other JavaScript UI library.

同理，你也可以将React组件渲染在任何DOM元素中，包含用其他JavaScript UI库渲染的元素。

### 区别开发和生产环境版本（Development and Production Versions）

By default, React includes many helpful warnings. These warnings are very useful in development. However, they make React larger and slower so you should make sure to use the production version when you deploy the app.

默认情况下，React内置了很多便于开发的警告信息。但这些警告信息会增大包的大小，并影响APP的运行速度，所以发布时必须使用生产环境版本。

#### Create React App

If you use [Create React App](https://github.com/facebookincubator/create-react-app), `npm run build` will create an optimized build of your app in the `build` folder.

执行`npm run build`命令将在`build`文件夹中创建一个优化后的生产环境版本。

#### Webpack

Include both `DefinePlugin` and `UglifyJsPlugin` into your production Webpack configuration as described in [this guide](https://webpack.js.org/guides/production-build/).

在Webpack生产环境配置中引入`DefinePlugin`和`UglifyJsPlugin`插件，参考[生产环境版本创建](https://webpack.js.org/guides/production-build/)。

#### Browserify

Run Browserify with `NODE_ENV` environment variable set to `production` and use [UglifyJS](https://github.com/mishoo/UglifyJS) as the last build step so that development-only code gets stripped out.

执行Browserify前将`NODE_ENV`环境变量设置为`production`，同时使用[UglifyJS](https://github.com/mishoo/UglifyJS)清理开发环境代码.

### 使用CDN（Using a CDN）

If you don't want to use npm to manage client packages, the `react` and `react-dom` npm packages also provide single-file distributions in `dist` folders, which are hosted on a CDN:

如果你不愿意用npm管理客户端包资源，`react`和`react-dom`同时在`dist`文件夹下提供了单文件的发布版本，托管在CDN上：

```html
<script src="https://unpkg.com/react@15/dist/react.js"></script>
<script src="https://unpkg.com/react-dom@15/dist/react-dom.js"></script>
```

The versions above are only meant for development, and are not suitable for production. Minified and optimized production versions of React are available at:

上述版本是开发版本，对生产环境不适用，压缩和优化后的生产版本如下：

```html
<script src="https://unpkg.com/react@15/dist/react.min.js"></script>
<script src="https://unpkg.com/react-dom@15/dist/react-dom.min.js"></script>
```

To load a specific version of `react` and `react-dom`, replace `15` with the version number.

将`15`修改为要加载的指定版本即可。

If you use Bower, React is available via the `react` package.

如果你使用Bower，可以直接通过安装`react`以获取React。

