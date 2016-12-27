---
layout: post
title: React 9 - 列表及其主键（Lists and Keys）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/lists-and-keys.html)

First, let's review how you transform lists in JavaScript.

在本章开始之前，让我们首先回顾一下在JavaScript中的数组转换。

Given the code below, we use the [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function to take an array of `numbers` and double their values. We assign the new array returned by `map()` to the variable `doubled` and log it:

如下面的代码所示，使用数组的[`map()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)方法将`numbers`数组转换为其两倍值组成的新数组。将该结果赋值给`doubled`并且输出日志：

```javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

This code logs `[2, 4, 6, 8, 10]` to the console.

上述代码在控制台中输出日志`[2, 4, 6, 8, 10]`。

In React, transforming arrays into lists of [elements](/tech/2016/12/14/react-4-rendering-elements.html) is nearly identical.

在React中，将数组转换为[元素](/tech/2016/12/14/react-4-rendering-elements.html)列表的方式和上述方法基本相同。

### 多组件渲染（Rendering Multiple Components）

You can build collections of elements and [include them in JSX](/tech/2016/12/14/react-3-introducing-jsx.html#embedding-expressions-in-jsx) using curly braces `{}`.

可以创建元素集合，并用一对大括号`{}`[在JSX中直接将其引用](/tech/2016/12/14/react-3-introducing-jsx.html#embedding-expressions-in-jsx)即可。

Below, we loop through the `numbers` array using the Javascript [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function. We return an `<li>` element for each item. Finally, we assign the resulting array of elements to `listItems`:

下面的例子中，用JavaScript的[`map()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)方法将`numbers`数组循环处理，将其中每个数字转换为`<li>`元素，并将其构成的结果数组赋值给`listItems`：

```javascript
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

We include the entire `listItems` array inside a `<ul>` element, and [render it to the DOM](/tech/2016/12/14/react-4-rendering-elements.html#rendering-an-element-into-the-dom):

将整个`listItems`数组包裹在`<ul>`元素中，并将其[渲染到DOM](/tech/2016/12/14/react-4-rendering-elements.html#rendering-an-element-into-the-dom)中：

```javascript
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

[打开CodePen试一试](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

This code displays a bullet list of numbers between 1 and 5.

代码渲染出1到5构成的项目列表。

### 基础列表组件（Basic List Component）

Usually you would render lists inside a [component](/tech/2016/12/14/react-5-components-and-props.html).

通常情况下列表的渲染会包含在一个[组件](/tech/2016/12/14/react-5-components-and-props.html)中。

We can refactor the previous example into a component that accepts an array of `numbers` and outputs an unordered list of elements.

将前一个例子重构到一个组件中，接收一个`numbers`数组参数输入，并输出一个无序列表。

```javascript
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

When you run this code, you'll be given a warning that a key should be provided for list items. A "key" is a special string attribute you need to include when creating lists of elements. We'll discuss why it's important in the next section.

当运行上述代码的时候，将会收到一个警告，应该为列表元素提供一个键（编者按：CodeOpen中没有报警告，是因为其示例中使用的是min版本的React，换成非min版本的就可以看到）。“key”元素中一个特殊指定的字符串属性，是创建元素列表时必须包含的一部分。下一小结中将讨论它的重要性。

Let's assign a `key` to our list items inside `numbers.map()` and fix the missing key issue.

为列表元素赋值一个`key`以修复忽略键引起的警告问题。

```javascript
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

[打开CodePen试一试](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## 键（Keys）

Keys help React identify which items have changed, are added, or are removed. Keys should be given to the elements inside the array to give the elements a stable identity:

键是React识别某一个条目更改、添加或删除的标识。数组中的每一个元素都应该有一个唯一不变的键作为标识：

```js
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

The best way to pick a key is to use a string that uniquely identifies a list item among its siblings. Most often you would use IDs from your data as keys:

最好选择一个字符串来作为键，唯一标识列表中的各兄弟项。通常情况下可以把数据的ID作为键来使用。

```js
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

When you don't have stable IDs for rendered items, you may use the item index as a key as a last resort:

当要渲染的列表项中不存在稳定的ID时，可以把数据项的索引值作为键的最后选择。

```js
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```

We don't recommend using indexes for keys if the items can reorder, as that would be slow. You may read an [in-depth explanation about why keys are necessary](/react/docs/reconciliation.html#recursing-on-children) if you're interested.

当列表项可以重新排序时不建议使用索引作为键，这会导致一定的性能问题。如果感兴趣，可以读一下[深度解释键的必要性](https://facebook.github.io/react/docs/reconciliation.html#recursing-on-children)以了解更多。

### 提取组件时键的使用（Extracting Components with Keys）

Keys only make sense in the context of the surrounding array.

键只在数组的上下文中存在意义。

For example, if you [extract](/tech/2016/12/14/react-5-components-and-props.html#extracting-components) a `ListItem` component, you should keep the key on the `<ListItem />` elements in the array rather than on the root `<li>` element in the `ListItem` itself.

比如，当[提取](/tech/2016/12/14/react-5-components-and-props.html#extracting-components)一个`ListItem`组件时，需要把键放置在数组处理的`<ListItem />`元素中，不能放在`ListItem`组件自身中的`<li>`根元素上。

**Example: Incorrect Key Usage**

**例子：键的错误使用方式**

```javascript
function ListItem(props) {
  const value = props.value;
  return (
    // Wrong! There is no need to specify the key here:
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Wrong! The key should have been specified here:
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

**Example: Correct Key Usage**

**例子：键的正确使用方式**

```javascript
function ListItem(props) {
  // Correct! There is no need to specify the key here:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Correct! Key should be specified inside the array.
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/rthor/pen/QKzJKG?editors=0010)

[打开CodePen试一试](https://codepen.io/rthor/pen/QKzJKG?editors=0010)

A good rule of thumb is that elements inside the `map()` call need keys.

一个好的经验法则是`map()`方法调用的元素中需要使用键。

### 键在兄弟项中必须唯一（Keys Must Only Be Unique Among Siblings）

Keys used within arrays should be unique among their siblings. However they don't need to be globally unique. We can use the same keys when we produce two different arrays:

键在数组的各兄弟项中必须唯一，但可以全局不唯一，在不同的数组中可以使用相同的键:

```js
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

[打开CodePen试一试](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

Keys serve as a hint to React but they don't get passed to your components. If you need the same value in your component, pass it explicitly as a prop with a different name:

键是React的一个内部映射，但其不会传递给组件的内部。如果组件需要使用相同的值，可以明确使用一个不同名字的属性传入。

```js
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

With the example above, the `Post` component can read `props.id`, but not `props.key`.

如上例所示，`Post`组件中可以读取`props.id`，但无法读取`props.key`。

### 在JSX中内嵌map()（Embedding map() in JSX）

In the examples above we declared a separate `listItems` variable and included it in JSX:

在上面的例子中单独定义了一个`listItems`变量，并在JSX中引用了该变量：

```js
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX allows [embedding any expressions](/tech/2016/12/14/react-3-introducing-jsx.html#embedding-expressions-in-jsx) in curly braces so we could inline the `map()` result:

JSX允许在大括号中[内嵌任何表达式](/tech/2016/12/14/react-3-introducing-jsx.html#embedding-expressions-in-jsx)，因此可以将上面的`map()`结果直接内嵌：

```js
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

[打开CodePen试一试](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

Sometimes this results in clearer code, but this style can also be abused. Like in JavaScript, it is up to you to decide whether it is worth extracting a variable for readability. Keep in mind that if the `map()` body is too nested, it might be a good time to [extract a component](/tech/2016/12/14/react-5-components-and-props.html).

这种形式有利于代码的简洁化，但也可能被滥用。就像在JavaScript中，由你决定是否有必要提取一个变量以提高程序的可读性。另外注意如果`map()`的方法体中嵌套层次过多，这可能是一个[提取组件](/tech/2016/12/14/react-5-components-and-props.html)的好时机。
