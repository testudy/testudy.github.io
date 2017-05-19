---
layout: post
title: 基于target伪类实现选项卡
tags: 技术 原创
---

## W3C中关于:target伪类的描述
> URIs with fragment identifiers link to a certain element within the document, known as the target element. For instance, here is a URI pointing to an anchor named section_2 in an HTML document:
>
> ```
> http://example.com/html/top.html#section_2
> ```
>
> A target element can be represented by the :target pseudo-class. If the document's URI has no fragment identifier, then the document has no target element.

在片段标识符指向部分文档的情况下，读者可能会对到底应该阅读文档的哪一部分感到疑惑。通过对不同的目标元素的样式进行修饰, 读者的相关疑惑会减少或者消除。

> 伪类选择器 :target 代表一个特殊的元素，它的id是URI的片段标识符。   
> 带有片段标识符的URI链接到文档中某一个元素 ，被称为是目标元素。

## 参考
1. [css-sel3](http://caniuse.com/#feat=css-sel3)
2. [target-pseudo](https://www.w3.org/TR/css3-selectors/#target-pseudo)
3. [:target](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:target)
4. [在选择器中使用 :target 伪类](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Using_the_:target_selector)
5. [CSS3 target伪类简介](https://www.qianduan.net/css3-target-pseudo-class-introduction/)
