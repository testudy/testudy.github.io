---
layout: post
title: React 18 - PropTypes的类型检查（Typechecking With PropTypes）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/typechecking-with-proptypes.html)

> 提醒（Note）：
>
> `React.PropTypes` is deprecated as of React v15.5. Please use [the `prop-types` library instead](https://www.npmjs.com/package/prop-types).
>
> `React.PropTypes`在React v15.5中已经被废弃。请使用[`prop-types`库](https://www.npmjs.com/package/prop-types)替代。

As your app grows, you can catch a lot of bugs with typechecking. For some applications, you can use JavaScript extensions like [Flow](https://flowtype.org/) or [TypeScript](https://www.typescriptlang.org/) to typecheck your whole application. But even if you don't use those, React has some built-in typechecking abilities. To run typechecking on the props for a component, you can assign the special `propTypes` property:

随着应用规模的不断增长，会出现越来越多由于数据类型错误导致的Bug。在一些应用中，可以引入[Flow](https://flowtype.org/)或[TypeScript](https://www.typescriptlang.org/)来检查应用中的所有数据类型。但如果你没有使用相关工具，React提供了内置的类型检查能力。要检查一个组件的属性值类型，只需要赋值特殊的`propTypes`属性即可：

```javascript
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

`PropTypes` exports a range of validators that can be used to make sure the data you receive is valid. In this example, we're using `PropTypes.string`. When an invalid value is provided for a prop, a warning will be shown in the JavaScript console. For performance reasons, `propTypes` is only checked in development mode.

`PropTypes`包含一组用来确保应用中接收的数据格式正确的验证器。在上例中，使用了`PropTypes.string`验证器。当属性接收到一个错误的值时，会在JavaScript命令行中出现对应的警告信息。为了保证应用正式版本的性能，`propTypes`仅仅应用在开发模式中。

### PropTypes

Here is an example documenting the different validators provided:

下例中列举了PropTypes所提供全部验证器的文档：

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  optionalNode: PropTypes.node,

  // A React element.
  optionalElement: PropTypes.element,

  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
  optionalMessage: PropTypes.instanceOf(Message),

  // You can ensure that your prop is limited to specific values by treating
  // it as an enum.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // An object that could be one of many types
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // An array of a certain type
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // An object with property values of a certain type
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // An object taking on a particular shape
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // You can chain any of the above with `isRequired` to make sure a warning
  // is shown if the prop isn't provided.
  requiredFunc: PropTypes.func.isRequired,

  // A value of any data type
  requiredAny: PropTypes.any.isRequired,

  // You can also specify a custom validator. It should return an Error
  // object if the validation fails. Don't `console.warn` or throw, as this
  // won't work inside `oneOfType`.
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // You can also supply a custom validator to `arrayOf` and `objectOf`.
  // It should return an Error object if the validation fails. The validator
  // will be called for each key in the array or object. The first two
  // arguments of the validator are the array or object itself, and the
  // current item's key.
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

### 要求单一子元素（Requiring Single Child）

With `PropTypes.element` you can specify that only a single child can be passed to a component as children.

可以使用`PropTypes.element`验证器来确保单一子元素传给组件的children属性：

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // This must be exactly one element or it will warn.
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

### 默认属性值（Default Prop Values）

You can define default values for your `props` by assigning to the special `defaultProps` property:

可以给特殊的`defaultProps`属性赋值，来为组件的`props`属性提供默认值：

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// Specifies the default values for props:
Greeting.defaultProps = {
  name: 'Stranger'
};

// Renders "Hello, Stranger":
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

The `defaultProps` will be used to ensure that `this.props.name` will have a value if it was not specified by the parent component. The `propTypes` typechecking happens after `defaultProps` are resolved, so typechecking will also apply to the `defaultProps`.

在上例中，`defaultProps`用来确保`this.props.name`不会为空，即使其父组件并没有传递。`propTypes`定义的类型检查在`defaultProps`之后调用，所以类型检查也对`defaultProps`生效。
