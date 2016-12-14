---
layout: post
title: React：JSX简介（Introducing JSX）
tags: 原创 技术 翻译 React
---

Consider this variable declaration:

注意看下面这行变量声明：

```js
const element = <h1>Hello, world!</h1>;
```

This funny tag syntax is neither a string nor HTML.

这行代码中出现的标签既不是一个字符串，也不是HTML。

It is called JSX, and it is a syntax extension to JavaScript. We recommend using it with React to describe what the UI should look like. JSX may remind you of a template language, but it comes with the full power of JavaScript.

这种标记是JSX，JavaScript的一种语法扩展。建议在React使用这种语法编写UI代码，以让其更直观。JSX看着像一种模板语言，但可以使用JavaScript的全部特性。

JSX produces React "elements". We will explore rendering them to the DOM in the [next section](/react/docs/rendering-elements.html). Below, you can find the basics of JSX necessary to get you started.

JSX会转译为React的元素。[下一节](./rendering-elements.html)会介绍如何将JSX渲染到DOM中。这一节中首先介绍一下JSX的基本用法。

### 内嵌JavaScript表达式（Embedding Expressions in JSX）

You can embed any [JavaScript expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) in JSX by wrapping it in curly braces.

在JSX中可以内嵌任何有效的[JavaScript表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Expressions_and_Operators#表达式(Expressions))，只需要将该表达式用一对大括号包裹即可。

For example, `2 + 2`, `user.name`, and `formatName(user)` are all valid expressions:

比如：`2 + 2`，`user.name`和`formatName(user)`等都是有效的表达式：

```js
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/PGEjdG?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/PGEjdG?editors=0010)

We split JSX over multiple lines for readability. While it isn't mandatory, when doing this, we also recommend wrapping it in parentheses to avoid the pitfalls of [automatic semicolon insertion](http://stackoverflow.com/q/2846283).

可以将JSX换行缩进以提高代码的可读性，此时需要注意的是：为了避免[分号自动插入](http://stackoverflow.com/q/2846283)的bug，推荐将其用一对小括号全部包裹。

### JSX也是一种表达式（JSX is an Expression Too）

After compilation, JSX expressions become regular JavaScript objects.

JSX编译之后，会转译为一个正常的JavaScript对象。

This means that you can use JSX inside of `if` statements and `for` loops, assign it to variables, accept it as arguments, and return it from functions:

这意味着，可以把JSX用在`if`判断和`for`循环中，也可以将其赋值给一个变量，当做参数传递，或者作为一个函数的返回值：

```js
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### JSX属性用法（Specifying Attributes with JSX）

You may use quotes to specify string literals as attributes:

可以在一对引号中直接将字符串字面量作为属性值：

```js
const element = <div tabIndex="0"></div>;
```

You may also use curly braces to embed a JavaScript expression in an attribute:

也可以在一对大括号中直接使用JavaScript表达式作为属性值：

```js
const element = <img src={user.avatarUrl}></img>;
```

### JSX子元素用法（Specifying Children with JSX）

If a tag is empty, you may close it immediately with `/>`, like XML:

如果标签中不包含其他元素，像XML一样添加`/>`自结束即可：

```js
const element = <img src={user.avatarUrl} />;
```

JSX tags may contain children:

也可以在JSX标签中嵌套子元素：

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

>**Caveat:**
>
>Since JSX is closer to JavaScript than HTML, React DOM uses `camelCase` property naming convention instead of HTML attribute names.
>
>For example, `class` becomes [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) in JSX, and `tabindex` becomes [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex).

> **警告：**
>
> 相比HTML，JSX更接近JavaScript，React DOM属性使用`camelCase`命名法代替HTML属性命名法。
>
> 比如，在JSX中`class`需要写作[`className`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/className)，`tabindex`需要写作[`tabIndex`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/tabIndex)。

### JSX默认阻止注入攻击（JSX Prevents Injection Attacks）

It is safe to embed user input in JSX:

在JSX可以安全的嵌入渲染用户输入的内容：

```js
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;
```

By default, React DOM [escapes](http://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) any values embedded in JSX before rendering them. Thus it ensures that you can never inject anything that's not explicitly written in your application. Everything is converted to a string before being rendered. This helps prevent [XSS (cross-site-scripting)](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.

在渲染前React DOM默认对嵌入JSX中的值进行[编码](http://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html)，以确保应用中不会被注入任何不安全代码。任何值在渲染之前都会被转换为字符串，以避免[XSS (cross-site-scripting)](https://zh.wikipedia.org/wiki/跨網站指令碼)攻击。

### JSX转化的对象（JSX Represents Objects）

Babel compiles JSX down to `React.createElement()` calls.

Babel将JSX编译为`React.createElement()`调用。

These two examples are identical:

下面两个例子所表示的含义是等价的：

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

`React.createElement()` performs a few checks to help you write bug-free code but essentially it creates an object like this:

`React.createElement()`会做适当的检查来帮助开发者写0bug的代码，最终会生成类似下面表示的对象：

```js
// Note: this structure is simplified
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world'
  }
};
```

These objects are called "React elements". You can think of them as descriptions of what you want to see on the screen. React reads these objects and uses them to construct the DOM and keep it up to date.

这样的对象就是“React元素”。详细描述了这些元素最终在屏幕上如何展示，React通过这些对象构造DOM，并持续对其更新。

We will explore rendering React elements to the DOM in the next section.

下一节将刨析讲解React元素的渲染。

>**Tip:**
>
>We recommend searching for a "Babel" syntax scheme for your editor of choice so that both ES6 and JSX code is properly highlighted.

> **提示：**
>
> 建议将“Babel”语法规范协议添加到你所使用的编辑器中，以使ES6和JSX代码着色高亮。
