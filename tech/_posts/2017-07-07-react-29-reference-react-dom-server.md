---
layout: post
title: React 29 - ReactDOMServer
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/react-dom-server.html)

If you load React from a `<script>` tag, these top-level APIs are available on the `ReactDOMServer` global. If you use ES6 with npm, you can write `import ReactDOMServer from 'react-dom/server'`. If you use ES5 with npm, you can write `var ReactDOMServer = require('react-dom/server')`.

如果是通过`<script>`标签加载React，可以通过全局的`ReactDOMServer`对象直接使用本文中的底层API。如果使用的是NPM和ES6，可以写成`import ReactDOMServer from 'react-dom/server'`。如果使用的是NPM和ES5，可以写成`var ReactDOM = require('react-dom/server')`。

## 概述（Overview）

The `ReactDOMServer` object allows you to render your components on the server.

可以使用`ReactDOMServer`对象在服务器端渲染组件。

 - [`renderToString()`](#rendertostring)
 - [`renderToStaticMarkup()`](#rendertostaticmarkup)

* * *

## 参考（Reference）

### `renderToString()`

```javascript
ReactDOMServer.renderToString(element)
```

Render a React element to its initial HTML. This should only be used on the server. React will return an HTML string. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

将React元素渲染成初始化的HTML，这种方式仅可使用在服务器端，以返回对应的HTML字符串。可以使用这种方法在服务器端生成HTML并返回到浏览器中以加快首屏渲染，同时可以让搜索引擎抓取页面以实现SEO。

If you call [`ReactDOM.render()`](https://facebook.github.io/react/docs/react-dom.html#render) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

如果在[`ReactDOM.render()`](https://facebook.github.io/react/docs/react-dom.html#render)中调用已经在服务器端渲染好的节点，React会保留这些节点，仅仅处理事件绑定，以获得一个高性能的首次加载体验。

* * *

### `renderToStaticMarkup()`

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar to [`renderToString`](#rendertostring), except this doesn't create extra DOM attributes such as `data-reactid`, that React uses internally. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save lots of bytes.

跟[`renderToString`](#rendertostring)相似，但不会生成React内部使用的`data-reactid`之类的额外DOM属性。在静态页面上生成器中这非常有用，可以省略额外的属性以节省大量字节。
