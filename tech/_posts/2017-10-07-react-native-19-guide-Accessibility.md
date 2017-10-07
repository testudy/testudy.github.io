---
layout: post
title: React Native 19 - 指南：辅助功能（Accessibility）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/accessibility.html)

## Native App Accessibility (iOS and Android)
Both iOS and Android provide APIs for making apps accessible to people with disabilities. In addition, both platforms provide bundled assistive technologies, like the screen readers VoiceOver (iOS) and TalkBack (Android) for the visually impaired. Similarly, in React Native we have included APIs designed to provide developers with support for making apps more accessible. Take note, iOS and Android differ slightly in their approaches, and thus the React Native implementations may vary by platform.

无论iOS还是Android，都为残障人士使用应用程序提供了辅助功能的API。另外，在两个平台中都捆绑了辅助功能，比如针对色弱人士的屏幕阅读器iOS中有VoiceOver、Android中有TalkBack。
同样，在React Native中也为开发者提供了类似的API来提高应用程序的可访问性。需要注意的是，iOS和Android两者本身存在的差异性，导致React Native在两个平台上的实现也存在差别。

In addition to this documentation, you might find [this blog post](https://code.facebook.com/posts/435862739941212/making-react-native-apps-accessible/) about React Native accessibility to be useful.

除了这篇文档之外，可以参考这篇优秀[博客](https://code.facebook.com/posts/435862739941212/making-react-native-apps-accessible/)，也介绍了React Native应用程序相关的辅助功能。

## 提高应用程序的可访问性（Making Apps Accessible）

### 辅助功能特性（Accessibility properties）

#### accessible (iOS, Android)

When `true`, indicates that the view is an accessibility element. When a view is an accessibility element, it groups its children into a single selectable component. By default, all touchable elements are accessible.

设置为`true`，则表示此视图是一个辅助功能元素，其所有的子元素都被组合为同一个可选择组件。默认情况下，所有的可触摸元素都是可访问元素。

On Android, ‘accessible={true}’ property for a react-native View will be translated into native ‘focusable={true}’.

在Android上，React Native中的View特性“accessible={true}”，会被转化为原生的“focusable=true”。

```javascript
<View accessible={true}>
  <Text>text one</Text>
  <Text>text two</Text>
</View>
```

In the above example, we can't get accessibility focus separately on 'text one' and 'text two'. Instead we get focus on a parent view with 'accessible' property.

在上面的例子中，无法分别获取“text one”和“text two”辅助功能焦点，而是由其设置“accessible”特性的父视图获取焦点。

#### accessibilityLabel (iOS, Android)

When a view is marked as accessible, it is a good practice to set an accessibilityLabel on the view, so that people who use VoiceOver know what element they have selected. VoiceOver will read this string when a user selects the associated element.

当视图被标记为辅助功能的时候，一个良好的实践是设置对应的accessibilityLabel特性，以帮助使用VoiceOver的用户知道自己所选择的元素，VoiceOver会把该特性设置的字符串读给用户。

To use, set the `accessibilityLabel` property to a custom string on your View:

在View中，可以将字符串赋值给`accessibilityLabel`特性：

```javascript
<TouchableOpacity accessible={true} accessibilityLabel={'Tap me!'} onPress={this._onPress}>
  <View style={styles.button}>
    <Text style={styles.buttonText}>Press me!</Text>
  </View>
</TouchableOpacity>
```

In the above example, the `accessibilityLabel` on the TouchableOpacity element would default to "Press me!". The label is constructed by concatenating all Text node children separated by spaces.

在上面的例子中，TouchableOpacity元素上的`accessibilityLabel`默认被设置为“Press me!”——用空格把所有的Text节点值拼接起来。

#### accessibilityTraits (iOS)

Accessibility traits tell a person using VoiceOver what kind of element they have selected. Is this element a label? A button? A header? These questions are answered by `accessibilityTraits`.

辅助功能使用VoiceOver告诉用户所选择的是什么类型的元素，是标签？是按钮？还是头部？这些问题会根据`accessibilityTraits`回答。

To use, set the `accessibilityTraits` property to one of (or an array of) accessibility trait strings:

* **none** Used when the element has no traits.
* **button** Used when the element should be treated as a button.
* **link** Used when the element should be treated as a link.
* **header** Used when an element acts as a header for a content section (e.g. the title of a navigation bar).
* **search** Used when the text field element should also be treated as a search field.
* **image** Used when the element should be treated as an image. Can be combined with button or link, for example.
* **selected**  Used when the element is selected. For example, a selected row in a table or a selected button within a segmented control.
* **plays** Used when the element plays its own sound when activated.
* **key** Used when the element acts as a keyboard key.
* **text** Used when the element should be treated as static text that cannot change.
* **summary** Used when an element can be used to provide a quick summary of current conditions in the app when the app first launches.  For example, when Weather first launches, the element with today's weather conditions is marked with this trait.
* **disabled** Used when the control is not enabled and does not respond to user input.
* **frequentUpdates** Used when the element frequently updates its label or value, but too often to send notifications. Allows an accessibility client to poll for changes. A stopwatch would be an example.
* **startsMedia** Used when activating an element starts a media session (e.g. playing a movie, recording audio) that should not be interrupted by output from an assistive technology, like VoiceOver.
* **adjustable** Used when an element can be "adjusted" (e.g. a slider).
* **allowsDirectInteraction** Used when an element allows direct touch interaction for VoiceOver users (for example, a view representing a piano keyboard).
* **pageTurn** Informs VoiceOver that it should scroll to the next page when it finishes reading the contents of the element.

`accessibilityTraits`特性的取值是下列字符串之一或由下列字符串组成的数组：

* **none** 用于元素无特征的时候。
* **button** 用于元素应该被当做按钮的时候。
* **link** 用于元素应该被当做链接的时候。
* **header** 用于元素应该被当做内容的头部的时候（比如，导航栏中的标题）。
* **search** 用于文本表单应该被当做搜索表单的时候。
* **image** 用于元素应该被当做图片的时候。比如可以与按钮或链接组合使用。
* **selected**  用于元素可以被选择的时候。比如，表格中的可选择行，或者分段控件中的可选择按钮。
* **plays** 用于元素被激活时会播放自身声音的时候。
* **key** 用于元素当做键盘键使用的时候。
* **text** 用于元素应该被当做不可更改的静态文本的时候。
* **summary** 用于当应用程序首次启动，并满足某个条件的时候，元素被用来提供新手指南。比如，当Weather首次启动的时候，今天标签下的元素需要标记这个特征。
* **disabled** 用于元素不可使用，也不会响应用户输入的时候。
* **frequentUpdates** 用于元素标签或值频繁更新，且需要知晓的时候。允许辅助功能客户端轮询这些更改。秒表是一个经典的例子。
* **startsMedia** 用于激活元素会开始一段媒体会话的时候（比如开始播放一段影片，开始记录音频），这时候不应该被VoiceOver之类的辅助功能的输出打断。
* **adjustable** 用于元素可以被“调整”的时候（比如滑块）。
* **allowsDirectInteraction** 用于元素允许VoiceOver用户直接触摸交互的时候（比如表示钢琴键盘的视图）。
* **pageTurn** 通知VoiceOver读完当前元素中的内容后，应该滚动到下一页。

#### accessibilityViewIsModal (iOS)

A Boolean value indicating whether VoiceOver should ignore the elements within views that are siblings of the receiver.

布尔值，标记VoiceOver是否应该忽略当前视图的兄弟元素。

For example, in a window that contains sibling views `A` and `B`, setting `accessibilityViewIsModal` to `true` on view `B` causes VoiceOver to ignore the elements in the view `A`.
On the other hand, if view `B` contains a child view `C` and you set `accessibilityViewIsModal` to `true` on view `C`, VoiceOver does not ignore the elements in view `A`.

比如，一个窗口中包含`A`和`B`两个兄弟视图，将视图`B`的`accessibilityViewIsModal`设置为`true`，则VoiceOver会忽略掉视图`A`。另一方面，如果视图`B`包含子视图`C`，并且视图`C`的`accessibilityViewIsModal`设置为`true`，则VoiceOver不会忽略视图`A`。

#### onAccessibilityTap (iOS)

Use this property to assign a custom function to be called when someone activates an accessible element by double tapping on it while it's selected.

这个特性绑定一个自定义函数，当某个元素被选中的时候，用来响应双击事件。

#### onMagicTap (iOS)

Assign this property to a custom function which will be called when someone performs the "magic tap" gesture, which is a double-tap with two fingers. A magic tap function should perform the most relevant action a user could take on a component. In the Phone app on iPhone, a magic tap answers a phone call, or ends the current one. If the selected element does not have an `onMagicTap` function, the system will traverse up the view hierarchy until it finds a view that does.

这个特性绑定一个自定义函数，用来响应“Magix Tap”手势——两根手指双击。Magic Tap功能应该设置为当前组件最重要的功能。比如在iPhone的电话应用程序中，Magic Tap用来打电话或挂断电话。如果当前选中的视图没有处理“onMagicTap”方法，系统会自动回溯直到上层中有这个事件处理函数的视图。

#### accessibilityComponentType (Android)

In some cases, we also want to alert the end user of the type of selected component (i.e., that it is a “button”). If we were using native buttons, this would work automatically. Since we are using javascript, we need to provide a bit more context for TalkBack. To do so, you must specify the ‘accessibilityComponentType’ property for any UI component. For instances, we support ‘button’, ‘radiobutton_checked’ and ‘radiobutton_unchecked’ and so on.

在某些情况下，需要告诉用户使用所选择组件的类型（比如，这是一个“按钮”）。如果使用原生组件，这个工作会自动执行良好。但使用JavaScript的时候，就需要为TalkBack提供一些上下文信息。为此，需要为任何UI组件指定`accessibilityComponentType'特性，React Native支持“button”、“radiobutton_checked”和“radiobutton_unchecked”等等。

```javascript
<TouchableWithoutFeedback accessibilityComponentType=”button”
  onPress={this._onPress}>
  <View style={styles.button}>
    <Text style={styles.buttonText}>Press me!</Text>
  </View>
</TouchableWithoutFeedback>
```

In the above example, the TouchableWithoutFeedback is being announced by TalkBack as a native Button.

在上面的例子中，TouchableWithoutFeedback会被TalkBack当做一个原生按钮。

#### accessibilityLiveRegion (Android)

When components dynamically change, we want TalkBack to alert the end user. This is made possible by the ‘accessibilityLiveRegion’ property. It can be set to ‘none’, ‘polite’ and ‘assertive’:

* **none** Accessibility services should not announce changes to this view.
* **polite** Accessibility services should announce changes to this view.
* **assertive** Accessibility services should interrupt ongoing speech to immediately announce changes to this view.

当组件动态变化的时候，如果需要TalkBack告诉用户，可以通过设置`accessibilityLiveRegion`特性来实现，接受`none`，`polite`和`assertive`：

* **none**，辅助功能不播报此视图的变化；
* **polite**，辅助功能播报此视图的变化；
* **assertive**，辅助功能终端进行中的播报，立即播报此视图的变化；

```javascript
<TouchableWithoutFeedback onPress={this._addOne}>
  <View style={styles.embedded}>
    <Text>Click me</Text>
  </View>
</TouchableWithoutFeedback>
<Text accessibilityLiveRegion="polite">
  Clicked {this.state.count} times
</Text>
```

In the above example method _addOne changes the state.count variable. As soon as an end user clicks the TouchableWithoutFeedback, TalkBack reads text in the Text view because of its 'accessibilityLiveRegion=”polite”' property.

上面的例子中，`_addOne`方法会更改`state.count`变量。由于设置了`accessibilityLiveRegion="polite"`特性，当用户点击TouchableWithoutFeedback按钮后，TalkBack会阅读Text视图中的文本。

#### importantForAccessibility (Android)

In the case of two overlapping UI components with the same parent, default accessibility focus can have unpredictable behavior. The ‘importantForAccessibility’ property will resolve this by controlling if a view fires accessibility events and if it is reported to accessibility services. It can be set to ‘auto’, ‘yes’, ‘no’ and ‘no-hide-descendants’ (the last value will force accessibility services to ignore the component and all of its children).

在同一个父组件的两个子组件UI重叠的情况下，默认情况下，辅助功能无法确认哪个组件应该获得焦点。`importantForAccessibility`特性通过控制可访问性事件的触发和上报=来解决这个问题。可接受的值包括`auto`，`yes`，`no`和`no-hide-descendants`（最后一个值强制辅助功能忽略当前和其所有子组件）。

```javascript
<View style={styles.container}>
  <View style={{"{{"}}position: 'absolute', left: 10, top: 10, right: 10, height: 100,
    backgroundColor: 'green'}} importantForAccessibility=”yes”>
    <Text> First layout </Text>
  </View>
  <View style={{"{{"}}position: 'absolute', left: 10, top: 10, right: 10, height: 100,
    backgroundColor: 'yellow'}} importantForAccessibility=”no-hide-descendants”>
    <Text> Second layout </Text>
  </View>
</View>
```

In the above example, the yellow layout and its descendants are completely invisible to TalkBack and all other accessibility services. So we can easily use overlapping views with the same parent without confusing TalkBack.

在上面的例子中，红色布局的组件和其子组件对TalkBack完全不可见，所以TalkBack不会对这个同一个父组件下覆盖的两个子组件产生混淆。

### 检查屏幕阅读器是否可用（Checking if a Screen Reader is Enabled）

The `AccessibilityInfo` API allows you to determine whether or not a screen reader is currently active. See the [AccessibilityInfo documentation](https://facebook.github.io/react-native/docs/accessibilityinfo.html) for details.

`AccessibilityInfo` API可以用来检查当前情况下屏幕阅读器是否激活了。详见[AccessibilityInfo文档](https://facebook.github.io/react-native/docs/accessibilityinfo.html)。

### 发送辅助功能事件（Sending Accessibility Events (Android)）

Sometimes it is useful to trigger an accessibility event on a UI component (i.e. when a custom view appears on a screen or a custom radio button has been selected). Native UIManager module exposes a method ‘sendAccessibilityEvent’ for this purpose. It takes two arguments: view tag and a type of an event.

在某些情况下，在UI组件上需要触发辅助功能事件（比如，当自定义视图显示在屏幕上，或自定义单选按钮被选中的时候）。原生UIManager模块暴露了一个`sendAccessibilityEvent`方法来解决这个问题，需要接收两个参数：视图标签和事件类型。

```javascript
_onPress: function() {
  this.state.radioButton = this.state.radioButton === “radiobutton_checked” ?
  “radiobutton_unchecked” : “radiobutton_checked”;
  if (this.state.radioButton === “radiobutton_checked”) {
    RCTUIManager.sendAccessibilityEvent(
      ReactNative.findNodeHandle(this),
      RCTUIManager.AccessibilityEventTypes.typeViewClicked);
  }
}

<CustomRadioButton
  accessibleComponentType={this.state.radioButton}
  onPress={this._onPress}/>
```

In the above example we've created a custom radio button that now behaves like a native one. More specifically, TalkBack now correctly announces changes to the radio button selection.

在上面的例子中，自定义的单选按钮会像原生的一样，当按钮选中的时候，TalkBack会正确的播报。

## 测试VoiceOver支持（Testing VoiceOver Support (iOS)）

To enable VoiceOver, go to the Settings app on your iOS device. Tap General, then Accessibility. There you will find many tools that people use to make their devices more usable, such as bolder text, increased contrast, and VoiceOver.

在iOS的设置里面可以启用VoiceOver。General -> Accessibility下面可以找到很多让设备更好用的工具，比如粗体，增大对比度和VoiceOver。

To enable VoiceOver, tap on VoiceOver under "Vision" and toggle the switch that appears at the top.

在”Vision“分来钟启用VoiceOver。

At the very bottom of the Accessibility settings, there is an "Accessibility Shortcut". You can use this to toggle VoiceOver by triple clicking the Home button.

在Accessibility设置的底部，可以找到”Accessibility Shortcut“，可以将Home键设置为3次点击唤醒VoiceOver。
