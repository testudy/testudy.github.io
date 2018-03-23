---
layout: post
title: React Native 38 - API：像素比例（PixelRatio）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/pixelratio.html)

PixelRatio class gives access to the device pixel density.

PixelRatio 类提供了一个访问设备像素密度的方法。

## 获取正确的图片尺寸（Fetching a correctly sized image）

You should get a higher resolution image if you are on a high pixel density device. A good rule of thumb is to multiply the size of the image you display by the pixel ratio.

在项目密度高的设备上，使用高分辨率的图片更合适。一个好的方法是，将图片的尺寸乘上设备的像素比。

```
var image = getImage({
  width: PixelRatio.getPixelSizeForLayoutSize(200),
  height: PixelRatio.getPixelSizeForLayoutSize(100),
});
<Image source={image} style={{width: 200, height: 100}} />
```

## 像素对齐（Pixel grid snapping）

In iOS, you can specify positions and dimensions for elements with arbitrary precision, for example 29.674825. But, ultimately the physical display only have a fixed number of pixels, for example 640×960 for iPhone 4 or 750×1334 for iPhone 6. iOS tries to be as faithful as possible to the user value by spreading one original pixel into multiple ones to trick the eye. The downside of this technique is that it makes the resulting element look blurry.

在iOS设备中，可以指定为位置或尺寸指定任意大小的值，比如29.674825。但是，任何设备的物理像素都是固定的，比如iPhone 4是640×960，iPhone 6是750×1334。iOS将一个物理像素拆分，以让用户的眼睛看到的更接近于指定的大小，但这会让元素看起来比较模糊。

In practice, we found out that developers do not want this feature and they have to work around it by doing manual rounding in order to avoid having blurry elements. In React Native, we are rounding all the pixels automatically.

实际上，开发人员往往并不需要这个功能，大多数情况下会手动将其四舍五入取整以避免元素模糊。在React Native中会自动将所有的像素四舍五入为整数。

We have to be careful when to do this rounding. You never want to work with rounded and unrounded values at the same time as you're going to accumulate rounding errors. Having even one rounding error is deadly because a one pixel border may vanish or be twice as big.

开发人员必须小心翼翼，以避免四舍五入对计算值的影响，这有可能会导致1像素边不可见了，也可能导致1像素边显示成了2像素。

In React Native, everything in JavaScript and within the layout engine works with arbitrary precision numbers. It's only when we set the position and dimensions of the native element on the main thread that we round. Also, rounding is done relative to the root rather than the parent, again to avoid accumulating rounding errors.

在React Native中，JavaScript和布局引擎都可以使用任意精度的数字。只有在主线程上设置本地元素的位置或尺寸时才会进行四舍五入。同时，四舍五入是相对于根元素而非父元素，以避免多次四舍五入的误差积累。

### Methods

* [`get`](pixelratio.md#get)
* [`getFontScale`](pixelratio.md#getfontscale)
* [`getPixelSizeForLayoutSize`](pixelratio.md#getpixelsizeforlayoutsize)
* [`roundToNearestPixel`](pixelratio.md#roundtonearestpixel)
* [`startDetecting`](pixelratio.md#startdetecting)

---

## Reference

### Methods

#### `get()`

```javascript
static get()
```

Returns the device pixel density. Some examples:

获取设备的像素密度，比如：

* PixelRatio.get() === 1
  * mdpi Android devices (160 dpi)
* PixelRatio.get() === 1.5
  * hdpi Android devices (240 dpi)
* PixelRatio.get() === 2
  * iPhone 4, 4S
  * iPhone 5, 5c, 5s
  * iPhone 6
  * xhdpi Android devices (320 dpi)
* PixelRatio.get() === 3
  * iPhone 6 plus
  * xxhdpi Android devices (480 dpi)
* PixelRatio.get() === 3.5
  * Nexus 6


#### `getFontScale()`

```javascript
static getFontScale()
```

Returns the scaling factor for font sizes. This is the ratio that is used to calculate the absolute font size, so any elements that heavily depend on that should use this to do calculations.

返回字体的缩放比例。用来计算字体的真实大小，与其相关的任何元素都应该用这个方法来计算大小。

If a font scale is not set, this returns the device pixel ratio.

如果字体缩放没有设置，其返回设备像素比。

Currently this is only implemented on Android and reflects the user preference set in Settings > Display > Font size, on iOS it will always return the default pixel ratio. @platform android

目前，这个方法只在Android实现了，并且只有当 设置->显示->字体大小 时才会生效。在iOS上返回默认的像素比例。仅适用于Android平台。


#### `getPixelSizeForLayoutSize()`

```javascript
static getPixelSizeForLayoutSize(layoutSize)
```

Converts a layout size (dp) to pixel size (px).

将设备独立像素转换为物理像素。

Guaranteed to return an integer number.

并确保返回一个整数值。


#### `roundToNearestPixel()`

```javascript
static roundToNearestPixel(layoutSize)
```

Rounds a layout size (dp) to the nearest layout size that corresponds to an integer number of pixels. For example, on a device with a PixelRatio of 3, `PixelRatio.roundToNearestPixel(8.4) = 8.33`, which corresponds to exactly (8.33 \* 3) = 25 pixels.

返回最接近对齐物理像素的设备独立像素值，比如一个设备的设备像素比为3，那么`PixelRatio.roundToNearestPixel(8.4) = 8.33`，因为(8.33 \* 3) = 25像素。


#### `startDetecting()`

```javascript
static startDetecting()
```

// No-op for iOS, but used on the web. Should not be documented.
