---
layout: post
title: React 8 - 条件渲染（Conditional Rendering）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/conditional-rendering.html)

In React, you can create distinct components that encapsulate behavior you need. Then, you can render only some of them, depending on the state of your application.

在React中根据业务需求可以封装若干不同的组件，根据应用状态按需渲染相应的组件。

Conditional rendering in React works the same way conditions work in JavaScript. Use JavaScript operators like [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) or the [conditional operator](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) to create elements representing the current state, and let React update the UI to match them.

React中的条件渲染和JavaScript中的条件判断相同，使用JavaScript中的[`if`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/if...else)或[条件运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)等方法对不同的状态进行判断，以渲染不同的UI。

Consider these two components:

以下面两个组件为例：

```js
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}
```

We'll create a `Greeting` component that displays either of these components depending on whether a user is logged in:

程序根据用户是否登录渲染上述两个`Greeting`组件之一：

```javascript
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Try changing to isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

[打开CodePen试一试](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

This example renders a different greeting depending on the value of `isLoggedIn` prop.

上述示例根据不同的`isLoggedIn`值渲染出不同的问候语。

### 元素变量（Element Variables）

You can use variables to store elements. This can help you conditionally render a part of the component while the rest of the output doesn't change.

可以把变量存储在变量中，以便于若干同类组件在条件渲染时只渲染其一的代码组织。

Consider these two new components representing Logout and Login buttons:

以下面两个新创建的登录、登出组件为例：

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```

In the example below, we will create a [stateful component](/tech/2016/12/15/react-6-state-and-lifecycle.html#adding-local-state-to-a-class) called `LoginControl`.

下例中会创建一个[状态化组件](/tech/2016/12/15/react-6-state-and-lifecycle.html#adding-local-state-to-a-class)`LoginControl`。

It will render either `<LoginButton />` or `<LogoutButton />` depending on its current state. It will also render a `<Greeting />` from the previous example:

这个组件将根据当前状态的变化渲染`<LoginButton />`或`<LogoutButton />`组件，同时和前例中一样渲染`<Greeting />`组件。

```javascript
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;

    let button = null;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

[打开CodePen试一试](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

While declaring a variable and using an `if` statement is a fine way to conditionally render a component, sometimes you might want to use a shorter syntax. There are a few ways to inline conditions in JSX, explained below.

条件渲染时在`if`语句为变量赋值是一个良好的实践，也可以使用一些较短的语法形式。下面举例说明在JSX中的行内条件判断。

### 用逻辑与操作符代替If（Inline If with Logical && Operator）

You may [embed any expressions in JSX](/tech/2016/12/14/react-3-introducing-jsx.html#embedding-expressions-in-jsx) by wrapping them in curly braces. This includes the JavaScript logical `&&` operator. It can be handy for conditionally including an element:

可以在JSX中[内嵌任何表达式](/tech/2016/12/14/react-3-introducing-jsx.html#embedding-expressions-in-jsx)，只需用一对大括号包裹即可。所以可以使用JavaScript中的逻辑与`&&`操作符方便的进行条件判断以包含一个元素。

```js
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

[打开CodePen试一试](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

It works because in JavaScript, `true && expression` always evaluates to `expression`, and `false && expression` always evaluates to `false`.

这是JavaScript中短路与的特性，`true && expression`表达式的计算结果总是`expression`，`false && expression` 表达式的计算结果必然是`false`。

Therefore, if the condition is `true`, the element right after `&&` will appear in the output. If it is `false`, React will ignore and skip it.

因此，如果表达式的结果是`true`，`&&`右侧的元素会出现在输出结果中。如果表达式的结果是`false`，React会将其忽略。

### 用条件运算符代替If-Else（Inline If-Else with Conditional Operator）

Another method for conditionally rendering elements inline is to use the JavaScript conditional operator [`condition ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).

将条件渲染元素转换成行内方式的另一种方式是使用[`condition ? true : false`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)。

In the example below, we use it to conditionally render a small block of text.

下面的例子中，使用条件运算符实现了一个小文本块的条件渲染。

```javascript
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```

It can also be used for larger expressions although it is less obvious what's going on:

也可以将其在更大的条件表达式中使用，但这会让代码看起来比较晦涩：

```js
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.handleLogoutClick} />
      ) : (
        <LoginButton onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

Just like in JavaScript, it is up to you to choose an appropriate style based on what you and your team consider more readable. Also remember that whenever conditions become too complex, it might be a good time to [extract a component](/tech/2016/12/14/react-5-components-and-props.html#extracting-components).

和在JavaScript一样，选择哪种代码形式取决于你和你的团队对代码可读性的考虑。另外，当条件表达式开始变得复杂起来之时，就意味着需要[拆分组件](/tech/2016/12/14/react-5-components-and-props.html#extracting-components)了。

### 阻止组件渲染（Preventing Component from Rendering）

In rare cases you might want a component to hide itself even though it was rendered by another component. To do this return `null` instead of its render output.

在某些情况下可能会出现隐藏组件自身的需求，即使这个组件是由其他组件渲染的，只需要将渲染方法返回`null`即可实现该需求。

In the example below, the `<WarningBanner />` is rendered depending on the value of the prop called `warn`. If the value of the prop is `false`, then the component does not render:

如下例所示，`<WarningBanner />`组件的渲染依赖于`warn`属性的值。如果该值是`false`，则该组件不需要渲染：

```javascript
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true}
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(prevState => ({
      showWarning: !prevState.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

[打开CodePen试一试](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)
