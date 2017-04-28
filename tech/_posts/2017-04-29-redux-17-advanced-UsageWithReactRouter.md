---
layout: post
title: Redux 17 - 进阶：和React Router一起使用（Usage with React Router）
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/docs/advanced/UsageWithReactRouter.md)

So you want to do routing with your Redux app. You can use it with [React Router](https://github.com/reactjs/react-router). Redux will be the source of truth for your data and React Router will be the source of truth for your URL. In most of the cases, **it is fine** to have them separate unless you need to time travel and rewind actions that triggers the change URL.

如果需要为Redux应用添加路由功能，可以使用[React Router](https://github.com/reactjs/react-router)来实现。Redux来处理数据，React Router来处理URL。在大多数情况下，如果不涉及到时间旅行或Action改变URL，保持两者的独立性比较合适。

## 安装React Router（Installing React Router）
`react-router` is available on npm . This guides assumes you are using `react-router@^2.7.0`.

可以使用npm安装`react-router`。本文演示`react-router-dom@^4.1.1`（译者按：原文是2.7.0）的使用。

`npm install --save react-router-dom`

## 服务器URL配置（Configuring the Fallback URL）

Before integrating React Router, we need to configure our development server. Indeed, our development server may be unaware of the declared routes in React Router configuration. For example, if you access `/todos` and refresh, your development server needs to be instructed to serve `index.html` because it is a single-page app. Here's how to enable this with popular development servers.

集成React Router之前，首先需要配置开发服务器URL的解析，因为服务器并不知道React Router的路由配置。比如，访问`/todos`或其他URL时，因为这是一个单页应用，服务器需要返回`index.html`。下面一些是常见开发服务器的配置示例。

>### 备注Create React App（Note on Create React App）
>
> If you are using Create React App, you won't need to configure a fallback URL, it is automatically done.
>
> 如果使用的是Create React App，创建项目时已经自动完成了开发服务器的配置，不需要再做这个配置。

### Express中的配置（Configuring Express）
If you are serving your `index.html` from Express:

在Express中返回`index.html`：

``` js
  app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
  })
```

### WebpackDevServer中的配置（Configuring WebpackDevServer）
If you are serving your `index.html` from WebpackDevServer:
You can add to your webpack.config.dev.js:

在WebpackDevServer中返回`index.html`，需要在webpack.config.dev.js配置：

```js
  devServer: {
    historyApiFallback: true,
  }
```

## Connecting React Router with Redux App

Along this chapter, we will be using the [Todos](https://github.com/reactjs/redux/tree/master/examples/todos) example. We recommend you to clone it while reading this chapter.

在本文中，使用[Todos](https://github.com/reactjs/redux/tree/master/examples/todos)示例进行代码的演示，建议后续阅读之前首先将其克隆到本地。

First we will need to import `<Router />` and `<Route />` from React Router. Here's how to do it:

首先按如下所示将`<Router />`和`<Route />`从React Router中引入：

```js
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
```

In a React app, usually you would wrap `<Route />` in `<Router />` so that when the URL changes, `<Router />` will match a branch of its routes, and render their configured components. `<Route />` is used to declaratively map routes to your application's component hierarchy. You would declare in `path` the path used in the URL and in `component` the single component to be rendered when the route matches the URL.

在React应用中，通常会把`<Route />`嵌套在`<Router />`中，当URL变化的时候，`<Router />`会把URL与`<Route />`匹配，并渲染相应的组件。`<Route />`定义了路由和应用组件的映射关系，`path`属性用来定义URL，`component`属性用来定义对应需要渲染的组件。

```js
const Root = () => (
  <Router>
    <Route path="/" component={App} />
  </Router>  
);
```

However, in our Redux App we will still need `<Provider />`. `<Provider />` is the higher-order component provided by React Redux that lets you bind Redux to React (see [Usage with React](https://github.com/reactjs/redux/blob/master/docs/basics/UsageWithReact.md)).

在Redux应用中始终需要`<Provider />`，这是绑定Redux和React的高阶组件（详见[和React一起使用](https://github.com/reactjs/redux/blob/master/docs/basics/UsageWithReact.md)）。

We will then import the `<Provider />` from React Redux:

将`<Provider />`从React Redux中引入：

```js
import { Provider } from 'react-redux';
```

We will wrap `<Router />` in `<Provider />` so that route handlers can get [access to the `store`](http://redux.js.org/docs/basics/UsageWithReact.html#passing-the-store).

用`<Provider />`把`<Router />`封装起来，以在路由处理中[访问`store`](http://redux.js.org/docs/basics/UsageWithReact.html#passing-the-store)。

```js
const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </Provider>
);
```

Now the `<App />` component will be rendered if the URL matches '/'. Additionally, we will add the optional `(:filter)` parameter to `/`, because we will need it further on when we try to read the parameter `(:filter)` from the URL.

现在`<App />`组件会跟'/'路径匹配渲染。同时再添加一个路由，以为后面的过滤做准备。（译者按：原文中不适用于React Router Dom 4.1.1版本，此处做更改）

```js
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom'
const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/:filter" component={App} />
      </Switch>
    </Router>
  </Provider>
);
```

You will probably want to remove the hash from the URL (e.g: `http://localhost:3000/#/?_k=4sbb0i`). For doing this, you will need to also import `browserHistory` from React Router:

```js
import { Router, Route, browserHistory } from 'react-router';
```

and pass it to the `<Router />` in order to remove the hash from the URL:

```js
    <Router history={browserHistory}>
      <Route path="/(:filter)" component={App} />
    </Router>
```

Unless you are targeting old browsers like IE9, you can always use `browserHistory`.

如果不需要兼容IE9这样的古老浏览器，可以放心的使用`BrowserRouter`。（译者按：上面这两段未翻译的代码不适用于React Router Dom 4.1.1版本，故不翻译，并做修改）。

#### `components/Root.js`
``` js
import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom'
import App from './App'

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/:filter" component={App} />
      </Switch>
    </Router>
  </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
```

We will also need to refactor `index.js` to render the `<Root />` component to the DOM.

接下来重构index.js中的代码，将`<Root />`渲染到DOM中：

#### `index.js`
```js
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import Root from './components/Root'
import reducer from './reducers'

const store = createStore(reducer)

render(
  <Root store={store} />,
  document.getElementById('root')
)
```

## 使用React Router导航（Navigating with React Router）

React Router comes with a [`<Link />`](https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#link) component that lets you navigate around your application. In our example, we can wrap `<Link />` with a new container component `<FilterLink />` so as to dynamically change the URL. The `activeStyle={}` property lets us apply a style on the active state.

React Router提供了一个[`<Link />`](https://reacttraining.com/react-router/web/api/Link)组件来帮助应用的导航，同时提供了`activeStyle={}`属性应用激活状态的样式。在我们的示例中，将原来的Link组件进行修改。（译者按：此处跟原文不一致）。


#### `components/Link.js`
```js
import React, { PropTypes } from 'react'
import { Link as RouterLink } from 'react-router-dom'

const Link = ({ active, filter, children }) => {
  if (active) {
    return <span>{children}</span>
  }

  return (
    <RouterLink to={`/${filter}`}>
      {children}
    </RouterLink>
  )
}

Link.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
}

export default Link
```

Now if you click on `<FilterLink />` you will see that your URL will change between `'/SHOW_COMPLETED'`, `'/SHOW_ACTIVE'`, and `'/'`. Even if you are going back with your browser, it will use your browser's history and effectively go to your previous URL.

现在点击`<Link />`组件，URL将在`'/SHOW_COMPLETED'`，`'/SHOW_ACTIVE'`和`'/SHOW_ALL'`三者之间变化。浏览器的历史回退、前进，URL也会响应的变化。（译者按：此处跟原文不一致）。

## 从URL中读取信息（Reading From the URL）

Currently, the todo list is not filtered even after the URL changed. This is because we are filtering from `<VisibleTodoList />`'s `mapStateToProps()` is still bound to the `state` and not to the URL. `mapStateToProps` has an optional second argument `ownProps` that is an object with every props passed to `<VisibleTodoList />`

现在TodoList还不能随着URL的变化过滤，原因是`<VisibleTodoList />`的`mapStateToProps()`方法还绑定在`state`上，没有从URL中读取信息。`mapStateToProps`函数还存在第二个参数`ownProps`，代表传递到`<VisibleTodoList />`的每一个props对象。

#### `containers/VisibleTodoList.js`

```js
import { withRouter } from 'react-router-dom'
const mapStateToProps = (state, ownProps) => ({
  todos: getVisibleTodos(state.todos, ownProps.match.params.filter || 'SHOW_ALL')
})
const VisibleTodoList = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList))
```

Right now we are not passing anything to `<App />` so `ownProps` is an empty object. To filter our todos according to the URL, we want to pass the URL params to `<VisibleTodoList />`.

现在没有任何参数从`<App />`中传递过来，所以`ownProps`还是一个空对象。为了实现Todos过滤，需要将URL的参数传递到`<VisibleTodoList />`中。

When previously we wrote:  `<Route path="/(:filter)" component={App} />`, it made available inside `App` a `params` property.

之前的代码：`<Route path="/:filter" component={App} />`，会把参数传递到`App`对象的`match.params`属性中。（译者注：此处有修改）。

`params` property is an object with every param specified in the url. *e.g: `params` will be equal to `{ filter: 'SHOW_COMPLETED' }` if we are navigating to `localhost:3000/SHOW_COMPLETED`. We can now read the URL from `<App />`.*

`params`属性是包含URL中每一个参数的对象。*例如：如果导航到`localhost:3000/SHOW_COMPLETED`，则对应的`params`对象为`{ filter: 'SHOW_COMPLETED' }`。现在可以在`<App />`中读取该属性。*

Note that we are using [ES6 destructuring](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) on the properties to pass in `params` to `<VisibleTodoList />`.

可以通过[ES6 destructuring](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)的语法在`<VisibleTodoList />`获取`params`参数对象。

> 译者注：
> React Router Dom 4.1.1中，需要使用withRouter高阶函数包装后的`VisibleTodoList`组件。

#### `containers/FilterLink.js`

```js
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Link from '../components/Link'

const mapStateToProps = (state, ownProps) => ({
  active: (ownProps.filter === 'SHOW_ALL' && ownProps.match.params.filter === undefined) ||
        ownProps.filter === ownProps.match.params.filter,
  filter: ownProps.filter,
})

const FilterLink = withRouter(connect(
  mapStateToProps,
)(Link))

export default FilterLink
```

## 下一步（Next Steps）

Now that you know how to do basic routing, you can learn more about [React Router API](https://github.com/reactjs/react-router/tree/v3/docs/)

现在已经学会了基本的路由使用，可以参考[React Router API](https://reacttraining.com/react-router/)学习更多。

>##### Note About Other Routing Libraries
>
>*Redux Router* is an experimental library, it lets you keep entirely the state of your URL inside your redux store. It has the same API with React Router API but has a smaller community support than react-router.
>
> *Redux Router*是一个实验库，将URL的状态保存在Redux Store中。API和React Router的API相似，但社区相对较小。
>
>*React Router Redux* creates a binding between your redux app and react-router and it keeps them in sync. Without this binding, you will not be able to rewind the actions with Time Travel. Unless you need this, React Router and Redux can operate completely apart.
>
> *React Router Redux*在Redux和React-Router之间建立了绑定，并维持两者同步。没有这个绑定，时间旅行就不会生效。如果不需要这个，React Router和Redux完全可以独立使用。
