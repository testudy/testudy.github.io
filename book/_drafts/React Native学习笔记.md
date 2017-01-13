# React Native笔记

Tags: 技术

---

![不破不立](media/without-destroying-the-old-one-cannot-build-the-new.jpg)

iOS中的`Bundle React Native code and image` Build 所使用的`../node_modules/react-native/packager/react-native-xcode.sh`脚本中，依赖React-Native的本地安装，如果将npm的全局安装配置更改到了非系统环境变量的路径中（打开`Show environment variables in build log`选项即可看到），需要在`../node_modules/react-native/packager/react-native-xcode.sh`脚本的正文开始处添加` PATH=~/.npm-global/bin:$PATH`代码。


## 兼容性问题、疑问和细节
（测试平台：iPhone 6S iOS 9.1，L50u Android 4.4.2，React-Native 0.14.1）

1. 在`TouchableHighlight`中单独使用`borderRadius`时，在iOS中无法现实圆角，在Android中可以显示圆角，`Image`子元素在父元素`borderRadius`属性的边界之外原样显示；配合`overflow: 'hidden'`使用时，iOS中现实4个圆角，Android中和不使用`overflow: 'hidden'`时表现一致。 
 
2. `TouchableHighlight`点击时，视觉会在子元素之上覆盖半透明黑色蒙层，如果子元素没有背景色，直接显示为黑色；在Android中某个元素第一次点击时，TouchUp时会黑色蒙层会透出设置的`borderRadius`区域现实黑色直角，第二次点击之后，TouchDown和TouchUp时都会出现黑色直角。

