---
layout: post
title: React Native 17 - 指南：图片（Images）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/images.html)

## 静态图片资源（Static Image Resources）

React Native provides a unified way of managing images and other media assets in your iOS and Android apps. To add a static image to your app, place it somewhere in your source code tree and reference it like this:

React Native在iOS和Android应用程序中，提供了一种统一的方式来管理图片和其他媒体资源。添加一个静态图片到应用程序中，只需要在任何需要的地方如下引用即可：

```javascript
<Image source={require('./my-icon.png')} />
```

The image name is resolved the same way JS modules are resolved. In the example above, the packager will look for `my-icon.png` in the same folder as the component that requires it. Also, if you have `my-icon.ios.png` and `my-icon.android.png`, the packager will pick the correct file for the platform.

图片名的解析和JS模块的解析一致。比如，在上面的例子中，打包器将在当前组件的目录下寻找`my-icon.png`图片。另外，如果存在`my-icon.ios.png`和`my-icon.android.png`，打包器会选择iOS和Android平台对应的图片。

You can also use the `@2x` and `@3x` suffixes to provide images for different screen densities. If you have the following file structure:

可以在图片名称中添加`@2x`和`@3x`后缀来匹配不同的屏幕像素密度。以下面的文件结构为例：

```
.
├── button.js
└── img
    ├── check@2x.png
    └── check@3x.png
```

...and `button.js` code contains:

`button.js`中的使用如下：

```javascript
<Image source={require('./img/check.png')} />
```

...the packager will bundle and serve the image corresponding to device's screen density. For example, `check@2x.png`, will be used on an iPhone 7, while`check@3x.png` will be used on an iPhone 7 Plus or a Nexus 5. If there is no image matching the screen density, the closest best option will be selected.

打包器会打包所有的图片根据屏幕的像素密度来提供匹配的图片。比如，在iPhone 7中会使用`check@2x.png`，在iPhone 7 Plus或Nexus 5中则会使用`check@3x.png`。如果没有匹配的图片，会选择最接近的图片来使用。

On Windows, you might need to restart the packager if you add new images to your project.

在Windows电脑中，在项目中添加新图片之后有可能需要重启打包器。

Here are some benefits that you get:

1. Same system on iOS and Android.
2. Images live in the same folder as your JavaScript code. Components are self-contained.
3. No global namespace, i.e. you don't have to worry about name collisions.
4. Only the images that are actually used will be packaged into your app.
5. Adding and changing images doesn't require app recompilation, just refresh the simulator as you normally do.
6. The packager knows the image dimensions, no need to duplicate it in the code.
7. Images can be distributed via [npm](https://www.npmjs.com/) packages.

这种处理方式所带来的优势如下：

1. iOS和Android上相同的处理方式；
2. 图片和JavaScript代码在同一个文件夹，组件是子包含的；
3. 不需要全局命名空间，也就是说，不用太困扰命名冲突问题；
4. 只有在代码中实际引用的图片会被打包到应用程序中；
5. 增加和修改图片不用重新编译，只需要跟平常一样刷新模拟器即可；
6. 打包器会检测出图片的尺寸，不需要在代码中重复编写；
7. 图片可以在[npm](https://www.npmjs.com/)随组件代码一起分发。

In order for this to work, the image name in `require` has to be known statically.

基于上面的工作流程，`require`中使用的图片名必须是直接显式写入的。

```javascript
// GOOD
<Image source={require('./my-icon.png')} />

// BAD
var icon = this.props.active ? 'my-icon-active' : 'my-icon-inactive';
<Image source={require('./' + icon + '.png')} />

// GOOD
var icon = this.props.active ? require('./my-icon-active.png') : require('./my-icon-inactive.png');
<Image source={icon} />
```

Note that image sources required this way include size (width, height) info for the Image. If you need to scale the image dynamically (i.e. via flex), you may need to manually set `{ width: undefined, height: undefined }` on the style attribute.

需要注意的是，这种方式引用的图片资源会包含尺寸（宽，高）信息。如果需要图片动态的缩放（比如用flex控制），需要在style特性中写明`{width: undefined, height: undefined}`。

## 非图片静态资源（Static Non-Image Resources）

The `require` syntax described above can be used to statically include audio, video or document files in your project as well. Most common file types are supported including `.mp3`, `.wav`, `.mp4`, `.mov`, `.html` and `.pdf`. See [packager defaults](https://github.com/facebook/metro-bundler/blob/master/packages/metro-bundler/src/defaults.js#L13-L18) for the full list.

上面在图片中使用的`require`语法，对于音频，视频或文档等项目中的文件，包括`.mp3`，`.wav`，`.mp4`，`.mov`，`.html`和`.pdf`也适用。支持清单查看[打包器默认设置](https://github.com/facebook/metro-bundler/blob/master/packages/metro-bundler/src/defaults.js#L13-L18)。

You can add support for other types by creating a packager config file (see the [packager config file](https://github.com/facebook/react-native/blob/master/local-cli/util/Config.js#L34-L39) for the full list of configuration options).

可以在打包器的配置文件中添加其他类型的文件支持（清单查看[打包器配置文件](https://github.com/facebook/react-native/blob/master/local-cli/util/Config.js#L34-L39)的配置项）。

A caveat is that videos must use absolute positioning instead of `flexGrow`, since size info is not currently passed for non-image assets. This limitation doesn't occur for videos that are linked directly into Xcode or the Assets folder for Android.

需要提醒的是，视频不能使用`flexGrow`，必须用绝对定位代替，对于非图片静态资源来说，打包器不能正确的获取其尺寸。但对于直接链接到Xcode或Android Assets文件夹下的视频没有这个限制。

## 混合应用中图片资源的使用（Images From Hybrid App's Resources）

If you are building a hybrid app (some UIs in React Native, some UIs in platform code) you can still use images that are already bundled into the app.

对于混合应用（React Native创建部分UI，原生代码创建部分UI）来说，可以直接使用打包在应用程序中的图片。

For images included via Xcode asset catalogs or in the Android drawable folder, use the image name without the extension:

对于Xcode资源目录或Android图标目录下的图片来说，如下直接使用图片名称即可引用：

```javascript
<Image source={{'{{'}}uri: 'app_icon'}} style={{'{{'}}width: 40, height: 40}} />
```

For images in the Android assets folder, use the `asset:/` scheme:

对于Android资源目录下的图片来说，则需要如下添加`asset:/`协议：

```javascript
<Image source={{'{{'}}uri: 'asset:/app_icon.png'}} style={{'{{'}}width: 40, height: 40}} />
```

These approaches provide no safety checks. It's up to you to guarantee that those images are available in the application. Also you have to specify image dimensions manually.

这种使用方式并不保证安全，需要保证所引用的图片在应用程序中可用，同时要手动指定图片的尺寸。

## 网络图片（Network Images）

Many of the images you will display in your app will not be available at compile time, or you will want to load some dynamically to keep the binary size down. Unlike with static resources, *you will need to manually specify the dimensions of your image*. It's highly recommended that you use https as well in order to satisfy [App Transport Security](https://facebook.github.io/react-native/docs/running-on-device.html#app-transport-security) requirements on iOS.

应用程序中使用的大多数图片在编译阶段无法确认，或者需要通过动态的加载图片以减小二进制包的尺寸。跟静态的资源不同的是，**需要编码指名图片的尺寸**。强烈建议使用HTTPS以满足iOS中[App Transport Security](https://facebook.github.io/react-native/docs/running-on-device.html#app-transport-security)的要求。

```javascript
// GOOD
<Image source={{'{{'}}uri: 'https://facebook.github.io/react/img/logo_og.png'}}
       style={{'{{'}}width: 400, height: 400}} />

// BAD
<Image source={{'{{'}}uri: 'https://facebook.github.io/react/img/logo_og.png'}} />
```

### 请求网络图片（Network Requests for Images）

If you would like to set such things as the HTTP-Verb, Headers or a Body along with the image request, you may do this by defining these properties on the source object:

如果需要在图片请求中进行一些设置，比如HTTP谓语动词，首部或正文，可以source特性中定义如下特性：

```javascript
<Image source={{'{{'}}
    uri: 'https://facebook.github.io/react/img/logo_og.png',
    method: 'POST',
    headers: {
      Pragma: 'no-cache'
    },
    body: 'Your Body goes here'
  }}
  style={{'{{'}}width: 400, height: 400}} />
```

## Uri格式图片（Uri Data Images）

Sometimes, you might be getting encoded image data from a REST API call. You can use the `'data:'` uri scheme to use these images. Same as for network resources, *you will need to manually specify the dimensions of your image*.

某些时候，可能从REST API请求中获得一些编码后的图片数据，可以使用`'data:'`这个URI协议来处理。跟网络资源一样，**需要编码指定图片的尺寸**。

> This is recommended for very small and dynamic images only, like icons in a list from a DB.
>
> 建议之用这种方式处理较小并且动态的图片，比如一组在DB中存放的图标。

```javascript
// include at least width and height!
<Image style={{'{{'}}width: 51, height: 51, resizeMode: Image.resizeMode.contain}} source={{'{{'}}uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg=='}}/>
```

### 缓存控制（仅适用于iOS）（Cache Control (iOS Only)）

In some cases you might only want to display an image if it is already in the local cache, i.e. a low resolution placeholder until a higher resolution is available. In other cases you do not care if the image is outdated and are willing to display an outdated image to save bandwidth. The `cache` source property gives you control over how the network layer interacts with the cache.

* `default`: Use the native platforms default strategy.
* `reload`: The data for the URL will be loaded from the originating source.
No existing cache data should be used to satisfy a URL load request.
* `force-cache`: The existing cached data will be used to satisfy the request,
regardless of its age or expiration date. If there is no existing data in the cache
corresponding the request, the data is loaded from the originating source.
* `only-if-cached`: The existing cache data will be used to satisfy a request, regardless of
its age or expiration date. If there is no existing data in the cache corresponding
to a URL load request, no attempt is made to load the data from the originating source,
and the load is considered to have failed.

在某些情况下，可能只需要显示一张已经存在本地缓存中的图片，比如在图片下载完成之前先显示一张低分辨率的占位图。或者图片的过期也不影响业务以节省带宽。source特性的`cache`属性用来控制网络层对缓存的使用策略。

* `default`：使用本机的默认策略；
* `reload`：从源数据重新加载数据，忽略本地缓存；
* `force-cache`：优先使用本地缓存（忽略是否过期）。如果不存在本地缓存，则从源数据加载；
* `only-if-cached`：仅使用本地缓存（忽略是否过期）。如果不存在本地缓存，也不会从源数据加载，URL请求失败。

```javascript
<Image source={{'{{'}}uri: 'https://facebook.github.io/react/img/logo_og.png', cache: 'only-if-cached'}}
       style={{'{{'}}width: 400, height: 400}} />
```

## 本地文件系统中的图片（Local Filesystem Images）

See [CameraRoll](https://facebook.github.io/react-native/docs/cameraroll.html) for an example of
using local resources that are outside of `Images.xcassets`.

查看[相机胶卷](https://facebook.github.io/react-native/docs/cameraroll.html)中使用`Images.xcassets`之外本地资源的示例。

### 相机胶卷照片使用最佳实践（Best Camera Roll Image）

iOS saves multiple sizes for the same image in your Camera Roll, it is very important to pick the one that's as close as possible for performance reasons. You wouldn't want to use the full quality 3264x2448 image as source when displaying a 200x200 thumbnail. If there's an exact match, React Native will pick it, otherwise it's going to use the first one that's at least 50% bigger in order to avoid blur when resizing from a close size. All of this is done by default so you don't have to worry about writing the tedious (and error prone) code to do it yourself.

iOS在相机胶卷中为每一张照片保存了多个尺寸，从性能的角度讲，选择一张尺寸最接近的照片是非常重要的，比如用3264x2448来填充200x200的缩略图是非常不合适的。如果存在尺寸匹配的图片，React Native会优先选择该图片；否则将选择一张至少大于所使用尺寸50%的图片以避免缩放时模糊。所有这些都是默认处理的，不需要编写复杂的代码来实现。

## 为什么不自动获取所有的资源尺寸？（Why Not Automatically Size Everything?）

*In the browser* if you don't give a size to an image, the browser is going to render a 0x0 element, download the image, and then render the image based with the correct size. The big issue with this behavior is that your UI is going to jump all around as images load, this makes for a very bad user experience.

*In React Native* this behavior is intentionally not implemented. It is more work for the developer to know the dimensions (or aspect ratio) of the remote image in advance, but we believe that it leads to a better user experience. Static images loaded from the app bundle via the `require('./my-icon.png')` syntax *can be automatically sized* because their dimensions are available immediately at the time of mounting.

*在浏览器中*，如果不赋予图片尺寸，浏览器会首先渲染一张0x0像素的元素，图片下载完成后，基于图片的正确尺寸重新渲染。这种情况下最大的问题是，图片下载完成后UI会产生跳动，用户体验不太好。

*在React Native中*，这种处理没有现实。需要开发者基于远端图片的尺寸（或比例）来处理，以获得更好的 用户体验。通过`require('./my-icon.png')`从应用程序包中加载的静态图片*自动获取尺寸*的原因是，图片加载后可以立刻获取其尺寸。

For example, the result of `require('./my-icon.png')` might be:

比如，`require('./my-icon.png')`的结果如下：

```javascript
{"__packager_asset":true,"uri":"my-icon.png","width":591,"height":573}
```

## Source是一个对象（Source as an object）

In React Native, one interesting decision is that the `src` attribute is named `source` and doesn't take a string but an object with a `uri` attribute.

在React Native中，`src`特性故意被命名为`source`，而且接收一个包含`uri`属性的对象。

```javascript
<Image source={{'{{'}}uri: 'something.jpg'}} />
```

On the infrastructure side, the reason is that it allows us to attach metadata to this object. For example if you are using `require('./my-icon.png')`, then we add information about its actual location and size (don't rely on this fact, it might change in the future!). This is also future proofing, for example we may want to support sprites at some point, instead of outputting `{uri: ...}`, we can output `{uri: ..., crop: {left: 10, top: 50, width: 20, height: 40}}` and transparently support spriting on all the existing call sites.

从架构设计的角度讲，讲source特性设计为对象是为了允许接收更多的元数据。比如在代码中是`require('./my-icon.png')`，随后打包过程中会添加实际地址和尺寸等信息（千万不要依赖于这些事实，未来很可能会发生变化！）。也方便后续增加更多的特性，比如精灵图，会把`{uri: ...}`扩展为`{uri: ..., crop: {left: 10, top: 50, width: 20, height: 40}}`，并将现在的图片直接透明转换。

On the user side, this lets you annotate the object with useful attributes such as the dimension of the image in order to compute the size it's going to be displayed in. Feel free to use it as your data structure to store more information about your image.

在用户端，可以在对象中添加图片尺寸等有用的属性，以便于计算显示的尺寸。更灵活的用其来存储图片的信息。

## 通过潜逃来实现背景图（Background Image via Nesting）

A common feature request from developers familiar with the web is `background-image`. To handle this use case, simply create a normal `<Image>` component and add whatever children to it you would like to layer on top of it.

在web开发中有一个常见的特性是`background-image`。为了处理这种使用情况，简单的创建一个`<Image>`组件，并把需要显示在其之上的组件作为子元素即可。

```javascript
return (
  <Image source={...}>
    <Text>Inside</Text>
  </Image>
);
```

## iOS圆角样式（iOS Border Radius Styles）

Please note that the following corner specific, border radius style properties are currently ignored by iOS's image component:

需要注意的是，目前在iOS的图片组件中会忽略下列特定角的边框半径：

* `borderTopLeftRadius`
* `borderTopRightRadius`
* `borderBottomLeftRadius`
* `borderBottomRightRadius`

## 异步解码（Off-thread Decoding）

Image decoding can take more than a frame-worth of time. This is one of the major sources of frame drops on the web because decoding is done in the main thread. In React Native, image decoding is done in a different thread. In practice, you already need to handle the case when the image is not downloaded yet, so displaying the placeholder for a few more frames while it is decoding does not require any code change.

图片解码消耗昂贵，会超过一帧的时间。这也是Web浏览器中丢帧的主要原因——图片的解码在主线程中完成。在React Native中，图片解码不在主线程。最佳实践是，当图片未下载完成前，使用占位图以提高渲染的帧数。
