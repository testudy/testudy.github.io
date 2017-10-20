---
layout: post
title: 使用SVG简单处理图片
tags: 技术 原创
---

> 最近3周，做了几个照片打印的模版，将前端的工作进一步延伸到用户可以“把玩”的距离。
> 如标题中提到的简单一样，这几个模板都不复杂；二是用SVG处理照片打印模板更简单，同时SVG作为矢量文件可以高质量的转换到PDF。

虽然SVG也是符合xml规范的标签，但之前还是差不多10年前接触过，已经基本上忘干净了。便找到了文末参考中的一些资料，花了一天时间，将SVG详细查看了一遍——但现在又基本上忘干净了——赶紧参考代码和OneNode中的记录把用到的这部分细节记录如下，将两个简单、典型的案例分析如下。

主要阅读的资料是[SVG应用指南]和[SVG入门教程]，最意外的收获是无意中找到了周爱民老师的博客[Aimingoo](https://aimingoo.github.io/)，在最后关键的将SVG中转化为PDF的操作中使用的也是周爱民老师博客中提到的Cairo，周爱民老师博客的详细和严谨真的很有帮助。

## SVG语法简介
SVG跟HTML类似的嵌套标签，既有`rect`，`circle`、`line`等用来标记描述图形的标签，也有`text`、`tspan`等用来标记文本的标签。

SVG元素上内联的CSS属性与HTML元素上的CSS属性有所不同，但总体原则保持不变；也支持外联的CSS样式表，可以如下方式引入：

```svg
<?xml-stylesheet type="text/css" href="svg-stylesheet.css" ?>
```

以竖版照片模板为例，一个完整的SVG文件如下所示：

```svg
<?xml version="1.0" encoding="utf-8"?>
<svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    xml:space="preserve"
    viewBox="0 0 117 153"
    preserveAspectRatio="xMinYMin slice"
    x="0"
    y="0"
    style="enable-background:new 0 0 117 153;"
>
    <rect x="0" y="0" width="117" height="153" style="fill:#FFFFFF;" />
    <svg
        viewBox="0 0 585 765"
        preserveAspectRatio="xMinYMin slice"
        width="114"
        height="150"
        x="1.5"
        y="1.5"
    >
        <image
            xlink:href="http://pic09.babytreeimg.com/2017/0914/FnglV7T730tHagl3BkHReAoNcPcD"
            width="960"
            height="1280"
            transform="translate(-72, -272)"
            style="overflow: hidden;"
        />
    </svg>
</svg>
```

由于打印厂商要求每笔订单要输出为同一份PDF文件，所以横版照片也需要旋转成竖版，以方便PDF的生成。对应的竖版照片模板如下所示：

```svg
<?xml version="1.0" encoding="utf-8"?>
<svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    xml:space="preserve"
    viewBox="0 0 117 153"
    preserveAspectRatio="xMinYMin slice"
    x="0"
    y="0"
    style="enable-background:new 0 0 117 153;"
>
    <rect x="0" y="0" width="117" height="153" style="fill:#FFFFFF;" />
    <g
        transform="translate(115.5, 1.5) rotate(90 0, 0)"
    >
        <svg
            viewBox="0 0 150 114"
            preserveAspectRatio="xMinYMin slice"
            width="150"
            height="114"
            style="enable-background:new 0 0 150 114;"
        >
            <svg
                viewBox="0 0 993 662"
                preserveAspectRatio="xMinYMin slice"
                width="150"
                height="114"
                x="0"
                y="0"
            >
                <image
                    xlink:href="http://pic09.babytreeimg.com/2017/1017/FhdHO0o0-lA1tEfuZnIQF04MmNAy_webp_b.webp"
                    width="1280"
                    height="960"
                    transform="translate(-75, -298)"
                    style="overflow: hidden;"
                />
            </svg>
        </svg>
    </g>
</svg>
```

### 照片模板中使用到的标签和关键属性用法简介

#### `svg`标签

1. `viewBox="0 0 117 153"`，定义当前svg内部的元素定位所使用的坐标系，4个值分别对应最小x坐标，最小y坐标，宽度和高度。
2. `preserveAspectRatio="xMinYMin slice"`，定义内部元素的绘制起点和超出显示范围的处理策略。在当前的照片模板中直接裁掉，即超出隐藏即可。
3. `width="114"`和`height="150"`，定义当前元素的宽度，尺寸参考最近祖先元素的viewBox属性定义。
4. `x="1.5"`和`y="1.5"`，SVG内的所有元素都可以看作绝对定位，相对于最近祖先元素中viewBox属性定义。

`svg`标签可以嵌套使用，可以使用viewBox的定义和嵌套使用，使用相对的方式便捷处理。

#### `rect`标签

绘制长方形，详细参考文档。

#### `image`标签

绘制图片，详细参考文档。

#### `g`标签

将元素分组，其后可以直接使用`transform="translate(115.5, 1.5) rotate(90 0, 0)"`将其定位。

## 最终模板

```svg
<?xml version="1.0" encoding="utf-8"?>
<svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    xml:space="preserve"
    viewBox="0 0 117 153"
    preserveAspectRatio="xMinYMin slice"
    width="117"
    height="153"
    x="0"
    y="0"
    style="enable-background:new 0 0 117 153;"
>
    <rect x="0" y="0" width="117" height="153" style="fill:#FFFFFF;" />
    <svg
        viewBox="0 0 {{ $imageViewBoxWidth }} {{ $imageViewBoxHeight }}"
        preserveAspectRatio="xMinYMin slice"
        width="114"
        height="150"
        x="1.5"
        y="1.5"
    >
        <image
            xlink:href="{{ $photo_url }}"
            width="{{ $imageWidth }}"
            height="{{ $imageHeight }}"
            transform="translate(-{{ $offsetLeft }}, -{{ $offsetTop }})"
            style="overflow: hidden;"
        />
    </svg>
</svg>
```

```svg
<?xml version="1.0" encoding="utf-8"?>
<svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    xml:space="preserve"
    viewBox="0 0 117 153"
    preserveAspectRatio="xMinYMin slice"
    x="0"
    y="0"
    style="enable-background:new 0 0 117 153;"
>
    <rect x="0" y="0" width="117" height="153" style="fill:#FFFFFF;" />
    <g
        transform="translate(115.5, 1.5) rotate(90 0, 0)"
    >
        <svg
            viewBox="0 0 150 114"
            preserveAspectRatio="xMinYMin slice"
            width="150"
            height="114"
            style="enable-background:new 0 0 150 114;"
        >
            <svg
                viewBox="0 0 {{ $imageViewBoxWidth }} {{ $imageViewBoxHeight }}"
                preserveAspectRatio="xMinYMin slice"
                width="150"
                height="114"
                x="0"
                y="0"
            >
                <image
                    xlink:href="{{ $photo_url }}"
                    width="{{ $imageWidth }}"
                    height="{{ $imageHeight }}"
                    transform="translate(-{{ $offsetLeft }}, -{{ $offsetTop }})"
                    style="overflow: hidden;"
                />
            </svg>
        </svg>
    </g>
</svg>
```


## 生成PDF

SVG也是一种图片，图片的转换最常使用的工具是imagemagick，使用下面的代码即可将SVG转化为对应的300DPI的JPG图片，但这本质上是将矢量的SVG转化了栅格化的JPG（即使生成PDF，也是JPG再转为PDF）。而且转换的图片质量跟AI的导出相比过于低，尤其转换台历之类的矢量文字时，效果总是期待更好。

而且发现imagemagick对SVG的支持有限，不支持超出隐藏之类的CSS语法。

```sh
magick -density 300 -quality 100 -colorspace RGB -compress none january.svg january.jpg
```

通过cloudconvert转化的svg却是矢量效果，猜测PDF可以封装支持SVG。用Chrome打印出PDF发现确实是矢量输出，便用Chrome的Headless模式将其打印出来：

```sh
chrome --headless --disable-gpu --print-to-pdf file:///Users/******/Desktop/svg/january.svg
```

但Chrome没有在服务器上安装成功，便继续搜索查找解决办法，这时便打开了周爱民老师的博客，虽然标题是在电子书中使用SVG，抱着崇拜的心态仔细读了一遍，却得到了imagemagick出现上述的原因的原因，也获得了Cairo的提示。

另一个角度，晚上跟一个老大哥同事聊天得知打印使用的是PostScript，沿着这个思路搜索了一下到了一些解决方案。

最终是使用Cairo的Python封装完美实现的。

## 参考
1. [SVG应用指南](https://svgontheweb.com/zh/)
2. [SVG入门教程](https://brucewar.gitbooks.io/svg-tutorial/)
3. [SVG Element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element)
4. [SVG Attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute)
5. [SVG Content Type](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Content_type)
6. [imagemagick](https://www.imagemagick.org/script/index.php)
7. [imagemagick中文站](http://www.imagemagick.com.cn/)
8. [cloudconvert](https://cloudconvert.com/svg-to-pdf)
9. [convertio](https://convertio.co/zh/svg-pdf/)
10. [Aimingoo](https://aimingoo.github.io/)
11. [在电子书中使用SVG](https://aimingoo.github.io/1-1728.html)
12. [详解ImageMagick中SVG的支持](https://aimingoo.github.io/1-1727.html)
13. [Inkscape](https://inkscape.org/zh/)
14. [Cairo](https://www.cairographics.org/)
15. [在 PDF ( 使用JS将SVG导出到 PDF ) 中，嵌入 SVG](https://ask.helplib.com/1076821)
16. [SVG into PDF](http://www.kevlindev.com/utilities/index.htm)
17. [Getting Started with Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome)
18. [睿](http://z-rui.github.io/)
19. [X3D](https://zh.wikipedia.org/wiki/X3D)
