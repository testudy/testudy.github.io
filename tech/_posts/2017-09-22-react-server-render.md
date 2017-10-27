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

> 状态（数据，Props、State）+ 组件（模板） = 视图

随着应用程序的复杂度增加，将状态和组件分离是常见的做法，比如MVC和Flux的设计模式。将在浏览器端运行的JS代码复用——同构到服务端之后，原来的应用程序架构依然适用，客户端的状态处理和服务器端同构。

```javascript
npm install --save redux
npm install --save react-redux
npm install --save redux-thunk
```

Redux中典型的状态更新属于同步模式，引入`redux-thunk`之后，异步的Action被包装为promise。


### 10. 引入React Router

```javascript
npm install --save react-router
```

React Router提供了StaticRouter（在React Router内部保持应用程序的location状态，适用于不需要更新浏览器地址栏的测试环境，或者无法更改浏览器端地址栏的服务端环境）；
BrowserRouter和HashRouter等适用于浏览器环境的工具；
以及matchPath方法来进行路径的匹配计算。

原则上讲，引入路由后，路由中的URI代表整个页面上所有的资源，所以页面上所有的数据（状态）都可以根据URI中的信息直接或间接获取到。有两部分状态需要处理，一部分是路由的状态，一部分是应用的状态数据。获取到数据后，将其填入模板，即可完成模板的渲染。


#### 分析React中的典型状态和渲染

在典型的客户端React应用程序中，最终页面的渲染完成要经过以下5个主要过程：
1. 在组件（Component）中的`componentWillMount`方法中执行容器（Container）组件中的异步获取数据方法；
2. 随后执行render方法，此时虽然尚未获得数据，当渲染出第一版页面；
3. 数据从服务器端返回，组件props更新；
4. 重新调用render方法，呈现最终页面；
5. 随着用户的交互（比如输入新的条件，重新执行步骤1、3、4；跳转新的URL地址，重新执行步骤1、2、3、4）。这个步骤在浏览器端独立发起，和步骤4中的最终页面是两个阶段的状态。

> ##### 注意：
> 客户端必须发起请求，后续的操作和页面请求都需要单独发送请求，服务器预置的数据不包含这一部分。

服务器端渲染的目的是完成步骤4中的最终页面。而服务器端渲染使用的`renderToString()`方法本质上是一个同步函数，如果将上述代码直接用在服务器端，得到的是步骤2中的第一版页面（未填充数据）。此时需要想办法将步骤1中在`componentWillMount`方法中执行的获取数据方法前置到`renderToString()`方法执行前。

获取数据的方法一般在容器组件中定义，作为props传递到组件中调用。如果能将props中调用的方法在之前获取到就可以解决这个问题。初步想到的方法如下，典型的代码如下所示：

```javascript
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Detail from '../component/Detail';
import {
    fetchDetail,
} from '../action';

function getInitData(dispatch, params) {
    const title = params.title;
    return () => dispatch(fetchDetail(title));
}

function mapStateToProps(state, ownProps) {
    const title = decodeURIComponent(ownProps.match.params.title);
    const entity = state.data.entities.find(item => item.title === title) || {}; 
    
    return Object.assign({
        isLoading: state.data.isDetailFetching,
    }, entity);
}

function mapDispatchToProps(dispatch, ownProps) {
    const title = ownProps.match.params.title;
    return {
        fetch: getInitData(dispatch, ownProps.match.params),
    };  
}

const DetailContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Detail));
DetailContainer.getInitData = getInitData;

export default DetailContainer;
```

约定每个容器组件中的getInitData方法用来获取组件中所使用的初始化数据。将原来`mapDispatchToProps`中的初始化逻辑独立出来。并将这个函数通过容器组件的静态方法暴露出来，以便于在能获取到容器组件的地方，就能使用该初始化方法。至此，将原来在组件中使用的方法暴露在了路由组件中。

接下来需要思考的问题是，路由的匹配。React Router提供了`matchPath`方法来匹配路径，路径在客户端指地址栏中的URL，在服务端所指的就是`req.url`，即请求发送到服务器的URL。

可以将React Router进行如下改进，以方便将路由的配置暴露出来：

```javascript
const config = [
    { exact: true, path: '/', component: Home },
    { exact: true, path: '/:title', component: Detail },
];

const routes = (
    <Switch>
        {
            config.map((item, index) => (<Route key={index} {...item} />))
        }
        <Redirect from='*' to='/'/>
    </Switch>
);

export {
    config,
    routes as default,
};
```

从逻辑上讲，路由解析后被渲染组件中的`componentWillMount`方法中获取到的数据和提前解析路由，并主动使用相同的方法获取到的数据一致。

服务器端需要处理如下：

```javascript
app.get('/*', function (req, res) {
    // 简单解决node-fetch host问题
    app.locals.host = req.headers.host;

    // store必须是fresh的，以避免前后请求间的干扰
    const store = configureStore();
    const context = {};

    // inside a request
    const promises = []
    // use `some` to imitate `<Switch>` behavior of selecting only
    // the first to match
    routerConfig.some(route => {
        // use `matchPath` here
        const match = matchPath(req.url, route);
        console.log('match', match);
        if (match) {
            promises.push(route.component.getInitData(store.dispatch, match.params)());
        }
        return match;
    });

    Promise.all(promises).then(data => {
        // do something w/ the data so the client
        // can access it then render the app
        const props = store.getState();
        console.log('store.getState()', props);
        const html = ReactDOMServer.renderToString(React.createElement(Root, {
            store: store,
            isClient: false,
            location: req.url,
            context: context,
        }));
        console.log('html', html);
        res.render('index.html', { html: html, props: JSON.stringify(props) });
    });
});
```

将匹配到的路径中容器组件获取到，并使用其返回的thunk组装到`Promise.all`中，随后处理服务器端渲染。

> ##### 注意：
> 将`componentWillMount`方法中异步获取数据的方法迁移到`componentDidMount`方法中更合适。原因有两个：
> 1. 避免服务器端请求重复发送。如果处理不当，容易给服务器造成双倍的压力。`componentWillMount`会在服务器端执行，如果里面有数据请求相关的操作，会造成再次请求数据。将其放置在`componentDidMount`中，但在首次加载完成页面后，有可能会再次发送请求，需要在请求加载时做合适的判断）。
> 2. 从时机上讲，虽然前者在后者之前执行，但后者的执行时机并没有太大差异。却可以明确的表明：异步数据的获取在客户端执行。
> `componentWillMount`适合执行同步的状态更新。

### 11. `ReactDOM.hydrate`方法的使用

该方法是React 16版本中添加的新方法，专门用来配合服务器端渲染在客户端调用，以达到更好的性能。

```javascript
ReactDOM.hydrate(<Root
    store={store}
    isClient
/>, document.getElementById('root'));
```

> #### 提醒
> React 16中还提供了粉笔等价于`renderToString`和`renderToStaticMarkup`方法的`renderToNodeStream`和`renderToStaticNodeStream`方法。


## Todo

1. 热更新；
2. 代码分割；
3. 服务器部署（包括服务器HTTP Client相关的DNS解析）。

## 源码
[react-server-render](https://github.com/testudy/react-server-render)

## 参考
1. [ReactDOM](https://reactjs.org/docs/react-dom.html)
2. [ReactDOMServer](https://reactjs.org/docs/react-dom-server.html)
3. [React Without JSX](https://facebook.github.io/react/docs/react-without-jsx.html)
4. [React Top-Level API .createElement](https://facebook.github.io/react/docs/react-api.html#createelement)
5. [Redux Server Rendering](http://redux.js.org/docs/recipes/ServerRendering.html)
6. [React Router Server Rendering](https://reacttraining.com/react-router/web/guides/server-rendering)
7. [Babel register](http://babeljs.io/docs/usage/babel-register/)
8. [ignore-styles](https://github.com/bkonkle/ignore-styles)
9. [Express](http://expressjs.com/)
10. [consolidate.js](https://github.com/tj/consolidate.js)
11. [Hogan.js](http://twitter.github.io/hogan.js/)
12. [MUSTACHE MANUAL](http://mustache.github.io/mustache.5.html)
13. [Mustache.js 使用简介](http://gzool.com/js/2014/09/09/js-mustachejs-usage/)
14. [node-fetch](https://github.com/bitinn/node-fetch);
15. [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch);
