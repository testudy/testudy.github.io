---
layout: post
title: React 11 - 状态提升（Lifting State Up）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/lifting-state-up.html)

Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor. Let's see how this works in action.

通常情况下，同一个数据的变化会引起几个不同组件的响应。建议将这几个组件共同依赖的状态提升到它们最近的祖先组件中。接下来看看如何实际操作。

In this section, we will create a temperature calculator that calculates whether the water would boil at a given temperature.

在这一节中，会创建一个温度计算器，用来计算一个给定的温度能否让水沸腾。

We will start with a component called `BoilingVerdict`. It accepts the `celsius` temperature as a prop, and prints whether it is enough to boil the water:

首先从创建一个`BoilingVerdict`组件开始，其接收一个`celsius`属性来表示温度，并输出该温度能否让水沸腾：

```js
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}
```

Next, we will create a component called `Calculator`. It renders an `<input>` that lets you enter the temperature, and keeps its value in `this.state.value`.

接下来创建一个`Calculator`组件，其用来渲染一个`<input>`以供输入温度，并将起保存在`this.state.value`中。

Additionally, it renders the `BoilingVerdict` for the current input value.

同时，它会根据当前输入的温度来渲染`BoilingVerdict`。

```js
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {value: ''};
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  render() {
    const value = this.state.value;
    return (
      <fieldset>
        <legend>Enter temperature in Celsius:</legend>
        <input
          value={value}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(value)} />
      </fieldset>
    );
  }
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/Gjxgrj?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/Gjxgrj?editors=0010)

## 添加第二个输入（Adding a Second Input）

Our new requirement is that, in addition to a Celsius input, we provide a Fahrenheit input, and they are kept in sync.

添加一个新需求，摄氏温度输入之外再提供一个华氏温度输入，并且两者保持自动同步。

We can start by extracting a `TemperatureInput` component from `Calculator`. We will add a new `scale` prop to it that can either be `"c"` or `"f"`:

首先从`Calculator`中提炼出`TemperatureInput`组件。为其添加新一个`scale`属性（“c“或者“f”）：

```js
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {value: ''};
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  render() {
    const value = this.state.value;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={value}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

We can now change the `Calculator` to render two separate temperature inputs:

然后修改`Calculator`组件以渲染两个独立的温度输入：

```js
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/NRrzOL?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/NRrzOL?editors=0010)

We have two inputs now, but when you enter the temperature in one of them, the other doesn't update. This contradicts our requirement: we want to keep them in sync.

现在两个输入的需求已经完成，但当在其中一个输入温度时，另一个输入不能更新。这不符合需求：期望两者能自动同步。

We also can't display the `BoilingVerdict` from `Calculator`. The `Calculator` doesn't know the current temperature because it is hidden inside the `TemperatureInput`.

而且无法在`Calculator`中显示`BoilingVerdict`。`Calculator`无法获知当前温度因其被隐藏在了`TemperatureInput`中。

## 状态提升（Lifting State Up）

First, we will write two functions to convert from Celsius to Fahrenheit and back:

首先，写两个函数用来在摄氏温度和华氏温度之间互转：

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

These two functions convert numbers. We will write another function that takes a string `value` and a converter function as arguments and returns a string. We will use it to calculate the value of one input based on the other input.

这两个函数用来转化数字。接下来再写一个函数用来接收一个字符串`value`和一个转化器函数作为参数，并返回一个字符串。这个函数用来在两个输入之间进行相互转换。

It returns an empty string on an invalid `value`, and it keeps the output rounded to the third decimal place:

当`value`参数无效时其返回空字符串，正常的输出结果保留3位小数。

```js
function tryConvert(value, convert) {
  const input = parseFloat(value);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

For example, `tryConvert('abc', toCelsius)` returns an empty string, and `tryConvert('10.22', toFahrenheit)` returns `'50.396'`.

比如，`tryConvert('abs',  toCelsius)`将返回空字符串，`tryConvert('10.22', toFahrenheit)`会返回`'50.396'`。

Next, we will remove the state from `TemperatureInput`.

接下来，从`TemperatureInput`中移除相关状态。

Instead, it will receive both `value` and the `onChange` handler by props:

将`value`和`onChange`都使用接收的相应属性替代：

```js
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    const value = this.props.value;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={value}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

If several components need access to the same state, it is a sign that the state should be lifted up to their closest common ancestor instead. In our case, this is the `Calculator`. We will store the current `value` and `scale` in its state.

如果不同组件需要访问相同的状态，这是将该状态提升到最近共用祖先的标记。在当前案例中，这个祖先是`Calculator`。现在将`value`和`scale`作为其状态。

We could have stored the value of both inputs but it turns out to be unnecessary. It is enough to store the value of the most recently changed input, and the scale that it represents. We can then infer the value of the other input based on the current `value` and `scale` alone.

可以将所有输入的值分别存放在不同状态中，但事实证明这不是完全必须的。只需将最近变化的输入值和其相应的输入类型存放即可。随后可以根据当前`value`和`scale`将另一个输入计算出来。

The inputs stay in sync because their values are computed from the same state:

此时输入会保持同步，因为他们的值由同一个状态进行计算：

```js
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {value: '', scale: 'c'};
  }

  handleCelsiusChange(value) {
    this.setState({scale: 'c', value});
  }

  handleFahrenheitChange(value) {
    this.setState({scale: 'f', value});
  }

  render() {
    const scale = this.state.scale;
    const value = this.state.value;
    const celsius = scale === 'f' ? tryConvert(value, toCelsius) : value;
    const fahrenheit = scale === 'c' ? tryConvert(value, toFahrenheit) : value;

    return (
      <div>
        <TemperatureInput
          scale="c"
          value={celsius}
          onChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          value={fahrenheit}
          onChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/ozdyNg?editors=0010)

[打开CodePen试一试](http://codepen.io/gaearon/pen/ozdyNg?editors=0010)

Now, no matter which input you edit, `this.state.value` and `this.state.scale` in the `Calculator` get updated. One of the inputs gets the value as is, so any user input is preserved, and the other input value is always recalculated based on it.

## 学习小结（Lessons Learned）

There should be a single "source of truth" for any data that changes in a React application. Usually, the state is first added to the component that needs it for rendering. Then, if other components also need it, you can lift it up to their closest common ancestor. Instead of trying to sync the state between different components, you should rely on the [top-down data flow](/tech/2016/12/15/react-6-state-and-lifecycle.html#the-data-flows-down).

React应用中任何可变的数据都应该循序“单一数据源”原则。通常情况下，某个状态的第一次出现是为了组件的渲染。然后，当其他组件中也出现该状态的使用之时，需要将其提升到最近的共用祖先，以替代在不同的组件中同步该状态，前提是需要理解[自上而下的数据流](/tech/2016/12/15/react-6-state-and-lifecycle.html#the-data-flows-down)。

Lifting state involves writing more "boilerplate" code than two-way binding approaches, but as a benefit, it takes less work to find and isolate bugs. Since any state "lives" in some component and that component alone can change it, the surface area for bugs is greatly reduced. Additionally, you can implement any custom logic to reject or transform user input.

状态提升相对于双向绑定方法需要写更多的“模板”代码，但带来一个潜在的好处是，更有利于寻找和定位bug。由于状态“存活”于若干的组件中并可以分别对其独立修改，实际上bug的范围已经被大大缩小。同时，可以实现任意的逻辑去拒绝或转化用户输入。

If something can be derived from either props or state, it probably shouldn't be in the state. For example, instead of storing both `celsiusValue` and `fahrenheitValue`, we store just the last edited `value` and its `scale`. The value of the other input can always be calculated from them in the `render()` method. This lets us clear or apply rounding to the other field without losing any precision in the user input.

如果某个功能用属性或者状态都可以实现，尽量不要选择使用状态。比如，不需要存储`celsiusValue`和`fahrenheitValue`两个变量，只需要存储最后修改过的`value`和其对应的`scale`即可。另外一个值使用时，只需要在`render()`方法中计算出来就好。这允许我们对其进行清除和四舍五入到其他字段同时不会损失用户输入的精度。

When you see something wrong in the UI, you can use [React Developer Tools](https://github.com/facebook/react-devtools) to inspect the props and move up the tree until you find the component responsible for updating the state. This lets you trace the bugs to their source:

当UI渲染存在错误的时候，可以借助[React Developer Tools](https://github.com/facebook/react-devtools)来对属性进行检查，可以方便的在树中上下移动直到找到跟状态相关的相应组件为止。方便在源码中跟踪bug：

<img src="/tech/media/react-devtools-state.gif" alt="Monitoring State in React DevTools" width="100%">
