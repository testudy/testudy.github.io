---
layout: post
title: React 16 - 深入JSX（JSX In Depth）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/jsx-in-depth.html)

Fundamentally, JSX just provides syntactic sugar for the `React.createElement(component, props, ...children)` function. The JSX code:

本质上，JSX只是`React.createElement(component, props, ...children)`方法的语法糖而已。

```js
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

compiles into:

上述代码会编译为如下形式：

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```

You can also use the self-closing form of the tag if there are no children. So:

没有子元素的标签可以直接使用自封闭形式，如下所示：

```js
<div className="sidebar" />
```

compiles into:

代码会相应的编译为：

```js
React.createElement(
  'div',
  {className: 'sidebar'},
  null
)
```

If you want to test out how some specific JSX is converted into JavaScript, you can try out [the online Babel compiler](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-0&code=function%20hello()%20%7B%0A%20%20return%20%3Cdiv%3EHello%20world!%3C%2Fdiv%3E%3B%0A%7D).

可以在[Babel编译器](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-0&code=function%20hello()%20%7B%0A%20%20return%20%3Cdiv%3EHello%20world!%3C%2Fdiv%3E%3B%0A%7D)中测试，JSX最终转换为的JavaScript代码。

## React元素类型使用说明（Specifying The React Element Type）

The first part of a JSX tag determines the type of the React element.

JSX标签的第一部分指定了React元素的类型。

Capitalized types indicate that the JSX tag is referring to a React component. These tags get compiled into a direct reference to the named variable, so if you use the JSX `<Foo />` expression, `Foo` must be in scope.

JSX中大写字母开头的类型是相应的React组件的名字，这个标签会直接关联到一个命名变量，所以当在JSX中使用`<Foo />`表达式的时候，`Foo`变量必须在作用域中。

### React变量必须在作用域中（React Must Be in Scope）

Since JSX compiles into calls to `React.createElement`, the `React` library must also always be in scope from your JSX code.

JSX编译为`React.createElement`调用之后，`React`库必须总是能从JSX相关的代码中引用到。

For example, both of the imports are necessary in this code, even though `React` and `CustomButton` are not directly referenced from JavaScript:

如下例所示，虽然`React`和`CustomButton`未直接关联，但代码中的两个import都是必须的：

```js
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

If you don't use a JavaScript bundler and loaded React from a `<script>` tag, it is already in scope as the `React` global.

如果不使用打包器，而是直接通过`<script>`标签的方式直接引用React，会存在一个全局的`React`变量。

### 在JSX类型中使用点语法（Using Dot Notation for JSX Type）

You can also refer to a React component using dot-notation from within JSX. This is convenient if you have a single module that exports many React components. For example, if `MyComponents.DatePicker` is a component, you can use it directly from JSX with:

在JSX中可以直接使用点语法引用React的组件。当存在导出多个组件的单个模块时，点语法会比较方便。比如，可以在JSX中用下面的方式直接引用`MyComponents.DatePicker`：

```js
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### 用户自定义组件必须首字母大写（User-Defined Components Must Be Capitalized）

When an element type starts with a lowercase letter, it refers to a built-in component like `<div>` or `<span>` and results in a string `'div'` or `'span'` passed to `React.createElement`. Types that start with a capital letter like `<Foo />` compile to `React.createElement(Foo)` and correspond to a component defined or imported in your JavaScript file.

如果元素类型是以小写字母开头的，`React.createElement`方法中会传入`'div'`和`'span'`之类的字符串跟内置的`<div>`和`<span>`等对应的组件关联起来。
如果元素类型是以大写字母开头的，比如`<Foo />`，会编译为`React.createElement(Foo)`，跟JavaScript文件中相关的变量关联起来。

We recommend naming components with a capital letter. If you do have a component that starts with a lowercase letter, assign it to a capitalized variable before using it in JSX.

建议组件的命名以大写字母开头。如果要使用一个小写字母开头的组件，建议在JSX中使用之前将其赋值给一个大写字母开头的变量。

For example, this code will not run as expected:

下例中，代码执行会发生异常：

```js
import React from 'react';

// Wrong! This is a component and should have been capitalized:
function hello(props) {
  // Correct! This use of <div> is legitimate because div is a valid HTML tag:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Wrong! React thinks <hello /> is an HTML tag because it's not capitalized:
  return <hello toWhat="World" />;
}
```

To fix this, we will rename `hello` to `Hello` and use `<Hello />` when referring to it:

修改方法是，将`hello`修改为`Hello`，并将引用中修改为`<Hello />`：

```js
import React from 'react';

// Correct! This is a component and should be capitalized:
function Hello(props) {
  // Correct! This use of <div> is legitimate because div is a valid HTML tag:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Correct! React knows <Hello /> is a component because it's capitalized.
  return <Hello toWhat="World" />;
}
```

### 运行时选择类型（Choosing the Type at Runtime）

You cannot use a general expression as the React element type. If you do want to use a general expression to indicate the type of the element, just assign it to a capitalized variable first. This often comes up when you want to render a different component based on a prop:

不能在JSX中直接使用一个普通的表达式来作为元素类型。如果有这样的需求，将其赋值给一个大写字母开头的变量，在JSX中使用这个变量即可。当需要根据不同的属性，渲染不同的组件时，会用到这种写法：

```js
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Wrong! JSX type can't be an expression.
  return <components[props.storyType] story={props.story} />;
}
```

To fix this, we will assign the type to a capitalized variable first:

为了修改这个错误，需要首先将其赋值给一个大写字母开头的变量：

```js
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Correct! JSX type can be a capitalized variable.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## JSX中的属性（Props in JSX）

There are several different ways to specify props in JSX.

在JSX中属性赋值有以下几种方式。

### JavaScript表达式赋值（JavaScript Expressions as Props）

You can pass any JavaScript expression as a prop, by surrounding it with `{}`. For example, in this JSX:

可以将任何JavaScript表达式作为属性值，只需要将其用`{}`包裹起来即可。在JSX中用法如下：

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

For `MyComponent`, the value of `props.foo` will be `10` because the expression `1 + 2 + 3 + 4` gets evaluated.

在`MyComponent`中`props.foo`的值是`10`，由表达式`1 + 2 + 3 + 4`计算得到。

`if` statements and `for` loops are not expressions in JavaScript, so they can't be used in JSX directly. Instead, you can put these in the surrounding code. For example:

JavaScript表达式中不能直接使用`if`判断和`for`循环，一种替代的方法是如下例所示包裹起来：

```js
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}
```

You can learn more about [conditional rendering](https://facebook.github.io/react/docs/conditional-rendering.html) and [loops](https://facebook.github.io/react/docs/lists-and-keys.html) in the corresponding sections.

在[条件渲染](https://facebook.github.io/react/docs/conditional-rendering.html)和[循环](https://facebook.github.io/react/docs/lists-and-keys.html)章节中介绍了一些其他的渲染方式。

### 字符串字面量（String Literals）

You can pass a string literal as a prop. These two JSX expressions are equivalent:

可以将一个文本字符串作为属性值，下面两种JSX的写法是等效的：

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

When you pass a string literal, its value is HTML-unescaped. So these two JSX expressions are equivalent:

传递的字符串值不会经过HTML转义，下面两种JSX的写法是等效的：

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

This behavior is usually not relevant. It's only mentioned here for completeness.

这两种写法通常不会存在差异。这里将其完整的列出。

### 属性值默认为“true”（Props Default to "True"）

If you pass no value for a prop, it defaults to `true`. These two JSX expressions are equivalent:

如果属性没有赋任何值，则其为默认值`true`。下面两种JSX的写法是等效的：

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

In general, we don't recommend using this because it can be confused with the [ES6 object shorthand](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) `{foo}` which is short for `{foo: foo}` rather than `{foo: true}`. This behavior is just there so that it matches the behavior of HTML.

通常情况下，不建议使用第二种写法，因为这种写法非常[ES6中对象简短属性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#属性定义)混淆。比如`{foo}`是`{foo: foo}`的缩写而不是`{foo: true}`的缩写。上述的省略写法跟HTML中的属性赋值是保持一致的。

### 属性展开（Spread Attributes）

If you already have `props` as an object, and you want to pass it in JSX, you can use `...` as a "spread" operator to pass the whole props object. These two components are equivalent:

如果需要在JSX中把一个对象中的所有属性进行传递，可以使用`...`展开运算符。下面两种JSX的写法是等效的：

```js
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

Spread attributes can be useful when you are building generic containers. However, they can also make your code messy by making it easy to pass a lot of irrelevant props to components that don't care about them. We recommend that you use this syntax sparingly.

属性展开通常在构建容器组件的时候非常有用。但这也会导致将大量不相关的属性直接传递给子组件使其略显凌乱。建议尽量不要使用此语法。

## JSX中的子元素（Children in JSX）

In JSX expressions that contain both an opening tag and a closing tag, the content between those tags is passed as a special prop: `props.children`. There are several different ways to pass children:

在JSX表达式的开始标签和结束标签中的所有内容都会被传递给一个特殊的属性：`props.children`。children可以接收一下几种不同的值。

### 字符串字面量（String Literals）

You can put a string between the opening and closing tags and `props.children` will just be that string. This is useful for many of the built-in HTML elements. For example:

在开始标签和结束标签之间可以放一些字符串，`props.children`属性会将其接收。在内置的HTML元素中这种方式很有用。如下所示：

```js
<MyComponent>Hello world!</MyComponent>
```

This is valid JSX, and `props.children` in `MyComponent` will simply be the string `"Hello world!"`. HTML is unescaped, so you can generally write JSX just like you would write HTML in this way:

这是一个有效的JSX，`MyComponent`中`props.children`的属性值是`"Hello world!"`。在JSX中，字符串内的HTML标记需要转义，这和在HTML中一致：

```html
<div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX removes whitespace at the beginning and ending of a line. It also removes blank lines. New lines adjacent to tags are removed; new lines that occur in the middle of string literals are condensed into a single space. So these all render to the same thing:

JSX会把行头尾的空白、空行移除。标签之间的空行会被移除；字符串字面量之间的多个空行会被压缩为一个空格。下面的几种写法渲染结果是一致的：

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### JSX子元素（JSX Children）

You can provide more JSX elements as the children. This is useful for displaying nested components:

JSX元素中可以嵌套多个JSX元素，这非常有利于编写嵌套的组件：

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

You can mix together different types of children, so you can use string literals together with JSX children. This is another way in which JSX is like HTML, so that this is both valid JSX and valid HTML:

字符串字面量跟JSX子元素可以组合在一起，也可以将其他不同类型的子元素组合在一起。这也是JSX和HTML相似的另一个方面，下面的代码是有效的JSX代码，也是有效的HTML代码：

```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

A React component can't return multiple React elements, but a single JSX expression can have multiple children, so if you want a component to render multiple things you can wrap it in a `div` like this.

一个React组件不能返回多个React元素，但一个JSX元素可以嵌套多个子元素，所以如果需要渲染多个子元素，可以像上面那样用一个`div`将其包裹起来。

### JavaScript表达式作为子元素（JavaScript Expressions as Children）

You can pass any JavaScript expression as children, by enclosing it within `{}`. For example, these expressions are equivalent:

可以将任何的JavaScript表达式作为子元素，只需要将其用`{}`包裹起来即可。如下例所示，这两种写法是等效的：

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

This is often useful for rendering a list of JSX expressions of arbitrary length. For example, this renders an HTML list:

这种情况也适用于渲染任意长度的JSX表示的列表。如下例所示，会渲染一个HTML列表：

```js
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

JavaScript expressions can be mixed with other types of children. This is often useful in lieu of string templates:

JavaScript表达式可以跟其他类型的子元素一起使用。这可以简单的来表示一个字符串模板：

```js
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### 函数作为子元素（Functions as Children）

Normally, JavaScript expressions inserted in JSX will evaluate to a string, a React element, or a list of those things. However, `props.children` works just like any other prop in that it can pass any sort of data, not just the sorts that React knows how to render. For example, if you have a custom component, you could have it take a callback as `props.children`:

通常情况下，JavaScript表达式会将计算结果字符串，React元素，或者一系列其他资源直接插入到JSX中。但也可以将一个函数直接传递给`props.children`中，以处理传递给元素属性的不同数据类型：

```js
// Calls the children callback numTimes to produce a repeated component
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

Children passed to a custom component can be anything, as long as that component transforms them into something React can understand before rendering. This usage is not common, but it works if you want to stretch what JSX is capable of.

可以将任何类型传递给自定义组件，组件将其转化为可被React理解的元素。上例中这种用法不常见，但可以扩展JSX的使用能力。

### 会忽略掉布尔值、Null和Undefined（Booleans, Null, and Undefined Are Ignored）

`false`, `null`, `undefined`, and `true` are valid children. They simply don't render. These JSX expressions will all render to the same thing:

`false`，`null`，`undefined`和`true`是有效的子元素，但他们不会被渲染。下面的JSX表达式渲染结果一致：

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

This can be useful to conditionally render React elements. This JSX only renders a `<Header />` if `showHeader` is `true`:

对于条件渲染来说，这非常有用。如下例所示，只有当`showHeader`是`true`的时候才会渲染`<Header />`：

```js
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

One caveat is that some ["falsy" values](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), such as the `0` number, are still rendered by React. For example, this code will not behave as you might expect because `0` will be printed when `props.messages` is an empty array:

有一个需要注意的关于[假值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)细节是数字`0`，它始终会被React渲染。如下例，代码不会像预期那样运行，当`props.message`是空数组时会渲染`0`个数组元素：

```js
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

To fix this, make sure that the expression before `&&` is always boolean:

可以用下面的方法修改上述代码，使`&&`的左值总是一个表达式：

```js
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

Conversely, if you want a value like `false`, `true`, `null`, or `undefined` to appear in the output, you have to [convert it to a string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) first:

Conversely, if you want a value like `false`, `true`, `null`, or `undefined` to appear in the output, you have to [convert it to a string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) first:

另外，如果你需要将`false`，`true`，`null`或`undefined`显示出来，需要首先将其[转换为一个字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String#将其他值转换成字符串)：

```js
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```
