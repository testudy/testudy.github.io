---
layout: post
title: React服务器端渲染
tags: 技术 原创
---
React服务端渲染，在React官方文档中只有[ReactDOMServer](https://facebook.github.io/react/docs/react-dom-server.html)一篇，简单的介绍了`renderToString()`和`renderToStaticMarkup()`两个方法，但也说明了React服务端渲染的本质——将编译后的React组件当做模板函数执行，并输出文本字符串完成HTML文档生成。

核心的实现围绕`renderToString()`方法的成功调用，步骤如下：

### 1. 调用`renderToString()`方法

```javascript
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const App = require('./app/App.js').default;
const html = ReactDOMServer.renderToString(React.createElement(App, data));
```

### 2. 在Node服务器中运行
React也是JavaScript，HTTP请求生成HTML文档最简单的办法是将其在Node中运行，直接使用成熟的[Express](http://expressjs.com/)来完成。

```javascript
npm i express --save

const express = require('express');
const app = express();
app.get('/', function (req, res) {
    // 下面代码可以将渲染的结果直接输出，但不符合正式使用要求
    res.send(html);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
```

### 3. 让Node服务器支持JSX
Node服务器目前不支持JSX（尚不是标准语法），React组件中的JSX需要经过处理才能运行，主要有两种方法：

    1. 编译预处理；
    2. 实时处理，使用require的hook，require的调用时先编译处理为标准JavaScript再执行。

方法1繁琐一些，直接使用方法2来完成。编译转化库跟浏览器端保持一致，使用`babel-register`。再presets中配置`es2015`和`react-app`来支持`import&export`和`JSX`。

```javascript
npm i --save babel-register
npm i --save babel-preset-es2015

require("babel-register")({
    presets: ["es2015", "react-app"],

    // Optional ignore regex - if any filenames **do** match this regex then they
    // aren't compiled.
    ignore: /(.css|.less)$/,

    // Optional only regex - if any filenames **don't** match this regex then they
    // aren't compiled
    only: /src/,

    // Setting this will remove the currently hooked extensions of .es6, `.es`, `.jsx`
    // and .js so you'll have to add them back if you want them to be used again.
    extensions: ['.js'],

    // Setting this to false will disable the cache.
    cache: true
});

NODE_ENV=development node index.js
```

现在已经可以引用App组件了，但会存在错误。

### 4. 忽略组件中的CSS和图片等非JS资源引用
为了便于维护，一般将组件相关的CSS就近引用，但这部分代码对Node来说是无效代码，将其在上述的预处理过程中忽略。

> #### 注意
> 此时，忽略后的图片引用如`import logo from './logo.svg';`时，`logo`的值为`{}`。需要继续优化服务器端静态资源的处理（限制静态资源的使用方式也是个好办法，或者写个对应CDN的钩子）

```javascript
npm i --save ignore-styles

require('ignore-styles');
```
至此，已经有了正确的html输出。但格式不符合使用要求，继续调整。

### 5. 引入模板，规范化HTML的使用
express支持很多中模板，选择偏好的`Hogan`。

```javascript
npm i --save consolidate
npm i --save hogan.js

const engines = require('consolidate');
app.set('views', './views')
app.engine('html', engines.hogan);

res.render('index.html', { html: html, data: JSON.stringify(data) });
```

### 6. 完成index.html视图
为了方便开发，将开发服务器合并到express。需要开发过程中完成`index.html`的实时更新（主要是JS和CSS文件），并将相关的数据输出即可，服务器输出代码如下。

```html
<script>
    window.__INITIAL_STATE__ = {{"{{"}}& data }};
</script>

<div id="root">
    {{"{{"}}& html }}
</div>
```
此时，代码修改完成后，刷新浏览器即可。

### 7. 配置静态资源
直接使用express的static中间件（开发环境，线上部署使用对应的CDN）

```javascript
app.use(express.static('build'));
```

### 8. 服务器端支持fetch
代码在服务器端渲染的时候，Node环境需要作为HTTP Client访问服务接口。为了保持和客户端代码的同构，使用同样的fetch方法。

服务器端使用fetch和客户端存在一些差异，详见[LIMITS.md](https://github.com/bitinn/node-fetch/blob/master/LIMITS.md)。

> 需要注意的是，服务器端fetch完成之后才能继续render，fetch是异步操作，render是同步操作。

```javascript
npm i --save node-fetch

// polyfills
global.fetch = require('node-fetch');
```

### 9. 引入Redux

客户端的状态处理和服务器端同构。

```javascript
npm install --save redux
npm install --save react-redux
npm install --save redux-thunk
```

## Todo
1. 热更新；
2. 代码分割；
3. 服务器部署（包括服务器HTTP Client相关的DNS解析）。

## 源码
[react-server-render](https://github.com/testudy/react-server-render)

## 参考
1. [ReactDOMServer](https://facebook.github.io/react/docs/react-dom-server.html)
2. [React Without JSX](https://facebook.github.io/react/docs/react-without-jsx.html)
4. [React Top-Level API .createElement](https://facebook.github.io/react/docs/react-api.html#createelement)
3. [Babel register](http://babeljs.io/docs/usage/babel-register/)
5. [ignore-styles](https://github.com/bkonkle/ignore-styles)
6. [Express](http://expressjs.com/)
7. [Hello world example](http://expressjs.com/en/starter/hello-world.html)
8. [app.engine](http://expressjs.com/en/4x/api.html#app.engine)
9. [consolidate.js](https://github.com/tj/consolidate.js)
10. [Hogan.js](http://twitter.github.io/hogan.js/)
11. [MUSTACHE MANUAL](http://mustache.github.io/mustache.5.html)
12. [Mustache.js 使用简介](http://gzool.com/js/2014/09/09/js-mustachejs-usage/)
13. [node-fetch](https://github.com/bitinn/node-fetch);
14. [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch);
