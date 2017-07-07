---
layout: post
title: React 30 - DOM元素（DOM Elements）
tags: 原创 技术 翻译 React
---

[原文](https://facebook.github.io/react/docs/dom-elements.html)

React implements a browser-independent DOM system for performance and cross-browser compatibility. We took the opportunity to clean up a few rough edges in browser DOM implementations.

React实现了一套独立于浏览器的DOM系统，以实现高性能和跨浏览器，同时解决了一些浏览器中粗糙的实现。

In React, all DOM properties and attributes (including event handlers) should be camelCased. For example, the HTML attribute `tabindex` corresponds to the attribute `tabIndex` in React. The exception is `aria-*` and `data-*` attributes, which should be lowercased. For example, you can keep `aria-label` as `aria-label`.

在React中，所有的DOM特性和属性（包括事件处理器）都应该是驼峰大小写的格式。比如，HTML特性`tabindex`对应的React特性是`tabIndex`。但`aria-*`和`data-*`特性是例外，他们将保持小写。比如，保持`aria-label`为`aria-label`。

## 特性中的差异（Differences In Attributes）

There are a number of attributes that work differently between React and HTML:

在React和HTML直接，有很多不同的特性：

### checked

The `checked` attribute is supported by `<input>` components of type `checkbox` or `radio`. You can use it to set whether the component is checked. This is useful for building controlled components. `defaultChecked` is the uncontrolled equivalent, which sets whether the component is checked when it is first mounted.

`checked`特性应用在`checkbox`或者`radio`类型的`<input>`组件中，用来控制组件是否被选中。在构建控制组件时非常有用。`defaultChecked`是非控制组件中的等效特性，用来设置组件的初始化值。

### className

To specify a CSS class, use the `className` attribute. This applies to all regular DOM and SVG elements like `<div>`, `<a>`, and others.

指定一个CSS类，需要使用`className`特性。这适用于所有的DOM和SVG元素，比如`<div>`，`<a>`等等。

If you use React with Web Components (which is uncommon), use the `class` attribute instead.

如果在React中使用Web组件（这种情况不常见），请使用`class`特性代替。

### dangerouslySetInnerHTML

`dangerouslySetInnerHTML` is React's replacement for using `innerHTML` in the browser DOM. In general, setting HTML from code is risky because it's easy to inadvertently expose your users to a [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attack. So, you can set HTML directly from React, but you have to type out `dangerouslySetInnerHTML` and pass an object with a `__html` key, to remind yourself that it's dangerous. For example:

`dangerouslySetInnerHTML`是React中替代浏览器DOM中`innerHTML`的方法。通常情况下，在代码中设置HTML是非常危险的，无意中就会把用户暴露在[跨站脚本（XSS）](https://en.wikipedia.org/wiki/Cross-site_scripting)攻击中。所以，在React中直接设置HTML，必须敲`dangerouslySetInnerHTML`并且传入一个包含`__html`属性的对象，以提醒这是个危险操作。如下例所示：

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor

Since `for` is a reserved word in JavaScript, React elements use `htmlFor` instead.

由于`for`是JavaScript的保留字，React使用`htmlFor`替代。

### onChange

The `onChange` event behaves as you would expect it to: whenever a form field is changed, this event is fired. We intentionally do not use the existing browser behavior because `onChange` is a misnomer for its behavior and React relies on this event to handle user input in real time.

`onChange`事件的行为和你期望的相同：当表单发生变化的时候，事件会被触发。这个事件的实现故意跟现在浏览器中的实现不一样，React中的`onChange`会实时响应用户的输入。

### selected

The `selected` attribute is supported by `<option>` components. You can use it to set whether the component is selected. This is useful for building controlled components.

`selected`特性应用于`<option>`组件，用来设置组件是否被选中，这在创建控制组件时非常有用。

### style

The `style` attribute accepts a JavaScript object with camelCased properties rather than a CSS string. This is consistent with the DOM `style` JavaScript property, is more efficient, and prevents XSS security holes. For example:

`style`属性接收一个包含驼峰大小写属性的JavaScript对象，而不是一个CSS字符串。和DOM的`style`JavaScript属性保持一致，高效，并避免了XSS安全漏洞。如下例所示：

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

Note that styles are not autoprefixed. To support older browsers, you need to supply corresponding style properties:

样式不会自动添加前缀，为了支持老版本的浏览器，需要手工添加相应的样式属性：

```js
const divStyle = {
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```

Style keys are camelCased in order to be consistent with accessing the properties on DOM nodes from JS (e.g. `node.style.backgroundImage`). Vendor prefixes [other than `ms`](http://www.andismith.com/blog/2012/02/modernizr-prefixed/) should begin with a capital letter. This is why `WebkitTransition` has an uppercase "W".

将Style对象的key用驼峰大小写是为了和JS访问DOM节点中的属性时保持一致（比如，`node.style.backgroundImage`）。厂商前缀[除`ms`之外](http://www.andismith.com/blog/2012/02/modernizr-prefixed/)都应该首字母大写。这也是上例中`WebkitTransition`中大写“W”的原因。

### suppressContentEditableWarning

Normally, there is a warning when an element with children is also marked as `contentEditable`, because it won't work. This attribute suppresses that warning. Don't use this unless you are building a library like [Draft.js](https://facebook.github.io/draft-js/) that manages `contentEditable` manually.

通常情况下，如果在某个包含子元素的元素中添加`contentEditable`特性时，会出现警告提示，原因是这样不会工作。上述特性可以关掉此警告。但通常情况下不要使用这个特性，除非是创建一个类似[Draft.js](https://facebook.github.io/draft-js/)的库来手工管理`contentEditable`。

### value

The `value` attribute is supported by `<input>` and `<textarea>` components. You can use it to set the value of the component. This is useful for building controlled components. `defaultValue` is the uncontrolled equivalent, which sets the value of the component when it is first mounted.

`value`特性应用在`<input>`和`<textarea>`组件中，用来控制组件的值。在构建控制组件时非常有用。`defaultChecked`是非控制组件中的等效特性，用来设置组件的初始化值。

## 支持的HTML特性清单（All Supported HTML Attributes）

React supports all `data-*` and `aria-*` attributes as well as these attributes:

React支持所有的`data-*`和`aria-*`特性，以及下列属性：

```
accept acceptCharset accessKey action allowFullScreen allowTransparency alt
async autoComplete autoFocus autoPlay capture cellPadding cellSpacing challenge
charSet checked cite classID className colSpan cols content contentEditable
contextMenu controls controlsList coords crossOrigin data dateTime default defer
dir disabled download draggable encType form formAction formEncType formMethod
formNoValidate formTarget frameBorder headers height hidden high href hrefLang
htmlFor httpEquiv icon id inputMode integrity is keyParams keyType kind label
lang list loop low manifest marginHeight marginWidth max maxLength media
mediaGroup method min minLength multiple muted name noValidate nonce open
optimum pattern placeholder poster preload profile radioGroup readOnly rel
required reversed role rowSpan rows sandbox scope scoped scrolling seamless
selected shape size sizes span spellCheck src srcDoc srcLang srcSet start step
style summary tabIndex target title type useMap value width wmode wrap
```

These RDFa attributes are supported (several RDFa attributes overlap with standard HTML attributes and thus are excluded from this list):

React也支持RDFa特性（有几个RDFa特性跟上面的HTML标准特性重合，下表中将其删除）：

```
about datatype inlist prefix property resource typeof vocab
```

In addition, the following non-standard attributes are supported:

- `autoCapitalize autoCorrect` for Mobile Safari.
- `color` for `<link rel="mask-icon" />` in Safari.
- `itemProp itemScope itemType itemRef itemID` for [HTML5 microdata](http://schema.org/docs/gs.html).
- `security` for older versions of Internet Explorer.
- `unselectable` for Internet Explorer.
- `results autoSave` for WebKit/Blink input fields of type `search`.

另外，也支持下列非标准特性：

- Mobile Safari中的`autoCapitalize autoCorrect`。
- Safari中`<link rel="mask-icon" />`的`color`。
- [HTML5 microdata](http://schema.org/docs/gs.html)中的`itemProp itemScope itemType itemRef itemID`。
- 老版本IE中的`security`。
- IE中的`unselectable`。
- WebKit/Blink的`search`表单中的`results autoSave`。

## 支持的SVG特性清单（All Supported SVG Attributes）

React supports these SVG attributes:

React支持下列SVG特性：

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan

```
