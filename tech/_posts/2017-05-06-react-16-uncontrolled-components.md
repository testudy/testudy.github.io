---
layout: post
title: React 16 - 非受控组件（Uncontrolled Components）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/uncontrolled-components.html)

In most cases, we recommend using [controlled components](https://facebook.github.io/react/docs/forms.html) to implement forms. In a controlled component, form data is handled by a React component. The alternative is uncontrolled components, where form data is handled by the DOM itself.

大多数情况下，我们建议使用[受控组件](https://facebook.github.io/react/docs/forms.html)来实现表单，数据可以直接被React组件处理。如果需要使用DOM本身处理表单数据，可以使用非受控组件。

To write an uncontrolled component, instead of writing an event handler for every state update, you can [use a ref](https://facebook.github.io/react/docs/refs-and-the-dom.html) to get form values from the DOM.

在非受控组件中，不用在为每一个状态更新设置事件处理器，直接[使用引用](https://facebook.github.io/react/docs/refs-and-the-dom.html)从DOM中获取表单值即可。

For example, this code accepts a single name in an uncontrolled component:

如下所示，在非受控组件中获取一个简单的Name表单值：

```javascript
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={(input) => this.input = input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

[打开CodePen试一试](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

Since an uncontrolled component keeps the source of truth in the DOM, it is sometimes easier to integrate React and non-React code when using uncontrolled components. It can also be slightly less code if you want to be quick and dirty. Otherwise, you should usually use controlled components.

由于非受控组件直接操作DOM，非React代码可以非常简单的和React代码集成在一起。同时这样编码比较少，比较快，但有点不干净。当然，大多数情况下还是需要使用受控组件。

If it's still not clear which type of component you should use for a particular situation, you might find [this article on controlled versus uncontrolled inputs](http://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) to be helpful.

如果你对如何选择受控组件和非受控组件存在疑惑，可以参考[这篇对比受控组件和非受控组件中输入问题的文章](http://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)获取帮助。

### 默认值（Default Values）

In the React rendering lifecycle, the `value` attribute on form elements will override the value in the DOM. With an uncontrolled component, you often want React to specify the initial value, but leave subsequent updates uncontrolled. To handle this case, you can specify a `defaultValue` attribute instead of `value`.

在React渲染生命周期中，表单元素的`value`属性会被重写。在非受控组件中，只需要使用React设置默认值，不能控制随后的表单更新操作。为了解决这个问题，使用特殊的`defautlValue`代替`value`即可。

```javascript
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={(input) => this.input = input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

Likewise, `<input type="checkbox">` and `<input type="radio">` support `defaultChecked`, and `<select>` and `<textarea>` supports `defaultValue`.

另外，在`<input type="checkbox">`和`<input type="radio">`元素使用`defaultChecked`，`<select>`和`<textarea>`同样使用`defaultValue`。 
