---
layout: post
title: React Router 1 - 指南：服务器端渲染（Server Rendering）
tags: 原创 技术 翻译 React-Router
---

[原文](https://reacttraining.com/react-router/web/guides/server-rendering)

Rendering on the server is a bit different since it's all stateless. The basic idea is that we wrap the app in a stateless [`<StaticRouter>`][StaticRouter] instead of a [`<BrowserRouter>`][BrowserRouter]. We pass in the requested url from the server so the routes can match and a `context` prop we'll discuss next.

服务器端渲染是一种无状态的渲染。基本的思路是，将[`<BrowserRouter>`][BrowserRouter]替换为无状态的[`<StaticRouter>`][StaticRouter]。将服务器上接收到的URL传递给路由用来匹配，同时支持传入`context`特性。

```js
// client
<BrowserRouter>
  <App/>
</BrowserRouter>

// server (not the complete story)
<StaticRouter
  location={req.url}
  context={context}
>
  <App/>
</StaticRouter>
```

When you render a [`<Redirect>`][Redirect] on the client, the browser history changes state and we get the new screen. In a static server environment we can't change the app state. Instead, we use the `context` prop to find out what the result of rendering was. If we find a `context.url`, then we know the app redirected. This allows us to send a proper redirect from the server.

当在浏览器上渲染一个[`<Redirect>`][Redirect]时，浏览器历史记录会改变状态，同时将屏幕更新。在静态的服务器环境中，无法直接更改应用程序的状态。在这种情况下，可以在`context`特性中标记要渲染的结果。如果出现了`context.url`，就说明应用程序需要重定向。从服务器端发送一个恰当的重定向链接即可。

```js
const context = {}
const markup = ReactDOMServer.renderToString(
  <StaticRouter
    location={req.url}
    context={context}
  >
    <App/>
  </StaticRouter>
)

if (context.url) {
  // Somewhere a `<Redirect>` was rendered
  redirect(301, context.url)
} else {
  // we're good, send the response
}
```

## 添加应用程序特定的上下文信息（Adding app specific context information）

The router only ever adds `context.url`. But you may want some redirects to be 301 and others 302. Or maybe you'd like to send a 404 response if some specific branch of UI is rendered, or a 401 if they aren't authorized. The context prop is yours, so you can mutate it. Here's a way to distinguish between 301 and 302 redirects:

路由仅仅操作`context.url`属性。但有可能需要某些重定向使用301，其他重定向使用302。也存在某些特定的逻辑需要返回404响应，或者未授权401。`context`特性由你控制，下面是一种区分301和302跳转的方法：

```js
const RedirectWithStatus = ({ from, to, status }) => (
  <Route render={({ staticContext }) => {
    // there is no `staticContext` on the client, so
    // we need to guard against that here
    if (staticContext)
      staticContext.status = status
    return <Redirect from={from} to={to}/>
  }}/>
)

// somewhere in your app
const App = () => (
  <Switch>
    {/* some other routes */}
    <RedirectWithStatus
      status={301}
      from="/users"
      to="/profiles"
    />
    <RedirectWithStatus
      status={302}
      from="/courses"
      to="/dashboard"
    />
  </Switch>
)

// on the server
const context = {}

const markup = ReactDOMServer.renderToString(
  <StaticRouter context={context}>
    <App/>
  </StaticRouter>
)

if (context.url) {
  // can use the `context.status` that
  // we added in RedirectWithStatus
  redirect(context.status, context.url)
}
```

## 404，401和其他状态（404, 401, or any other status）

We can do the same thing as above. Create a component that adds some context and render it anywhere in the app to get a different status code.

跟上面的方法一样，创建一个组件，添加一些上下文，使用不同的状态码将其渲染在应用程序的任何位置。

```js
const Status = ({ code, children }) => (
  <Route render={({ staticContext }) => {
    if (staticContext)
      staticContext.status = code
    return children
  }}/>
)
```

Now you can render a `Status` anywhere in the app that you want to add the code to `staticContext`.

现在可以将状态码添加到`staticContext`中，并将`Status`渲染在应用程序的任何位置。

```js
const NotFound = () => (
  <Status code={404}>
    <div>
      <h1>Sorry, can’t find that.</h1>
    </div>
  </Status>
)

// somewhere else
<Switch>
  <Route path="/about" component={About}/>
  <Route path="/dashboard" component={Dashboard}/>
  <Route component={NotFound}/>
</Switch>
```

## 整合在一起（Putting it all together）

This isn't a real app, but it shows all of the general pieces you'll
need to put it all together.

下面的代码不是一个实际的应用程序，但是包含了需要整合的全部细节。

```js
import { createServer } from 'http'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'

createServer((req, res) => {
  const context = {}

  const html = ReactDOMServer.renderToString(
    <StaticRouter
      location={req.url}
      context={context}
    >
      <App/>
    </StaticRouter>
  )

  if (context.url) {
    res.writeHead(301, {
      Location: context.url
    })
    res.end()
  } else {
    res.write(`
      <!doctype html>
      <div id="app">${html}</div>
    `)
    res.end()
  }
}).listen(3000)
```

And then the client:

同时，浏览器客户端的代码如下：

```js
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

ReactDOM.render((
  <BrowserRouter>
    <App/>
  </BrowserRouter>
), document.getElementById('app'))
```

## 数据加载（Data Loading）

There are so many different approaches to this, and there's no clear best practice yet, so we seek to be composable with any approach, and not prescribe or lean toward one or the other. We're confident the router can fit inside the constraints of your application.

解决这个问题有很多方法，目前为止并没有明确的最佳实践，所以我们支持任何方法，并不明确的倾向某个方法，并确信React Router可以适用于任何的应用程序。

The primary constraint is that you want to load data before you render. React Router exports the `matchPath` static function that it uses internally to match locations to routes. You can use this function on the server to help determine what your data dependencies will be before rendering.

最主要的限制是，必须在渲染之前将数据加载完成。React Router暴露了`matchPath`静态方法用来匹配请求路径。可以使用这个方法在服务器端渲染之前确定数据的依赖。

The gist of this approach relies on a static route config used to both render your routes and match against before rendering to determine data dependencies.

这种方法主要依赖于一个静态的路由配置，用来渲染路由，并在渲染之前确定数据以来。



```js
const routes = [
  { path: '/',
    component: Root,
    loadData: () => getSomeData(),
  },
  // etc.
]
```

Then use this config to render your routes in the app:

接下来使用这个配置在应用程序中渲染路由：

```js
import { routes } from './routes'

const App = () => (
  <Switch>
    {routes.map(route => (
      <Route {...route}/>
    ))}
  </Switch>
)
```

Then on the server you'd have something like:

在服务器端，需要做如下的处理：

```js
import { matchPath } from 'react-router-dom'

// inside a request
const promises = []
// use `some` to imitate `<Switch>` behavior of selecting only
// the first to match
routes.some(route => {
  // use `matchPath` here
  const match = matchPath(req.path, route)
  if (match)
    promises.push(route.loadData(match))
  return match
})

Promise.all(promises).then(data => {
  // do something w/ the data so the client
  // can access it then render the app
})
```

And finally, the client will need to pick up the data. Again, we aren't in the business of prescribing a data loading pattern for your app, but these are the touch points you'll need to implement.

最终，客户端需要同时获取这份数据。再次声明，这并不是你的应用程序必须使用的数据加载模式，但这些细节都是实现时需要处理的。

You might be interested in our [React Router Config][RRC] package to assist with data loading and server rendering with static route configs.

你可能对[React Router Config][RRC]项目感兴趣，可以用来协助加载数据和服务器端渲染需要的路由配置。


  [StaticRouter]:https://reacttraining.com/react-router/web/api/StaticRouter
  [BrowserRouter]:https://reacttraining.com/react-router/web/api/BrowserRouter
  [Redirect]:https://reacttraining.com/react-router/web/api/Redirect
  [RRC]:https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config


