---
layout: post
title: Proxy和Reflect简述
tags: 技术 元编程 JavaScript
---

## 读一本好书是一件开心的事儿

周爱民老师的[《JavaScript语言精髓与编程实践（第3版）》](https://book.douban.com/subject/35085910/)已经可以购买。

19年在QCon上听周爱民老师说在写第三版，便一直在期待，终于等到出版，第一时间购买——好书不能等。

12年有幸读到[第二版](https://book.douban.com/subject/10542576/)，在参加工作的早期让自己突然有了豁然开朗的感觉。

08年，周爱民老师已经写了这本书的[第一版](https://book.douban.com/subject/3012828/)，那时候我还在上大学。周爱民老师于技术的匠艺匠心是我辈技术人员的楷模——于我自己努力学习，不懈实践。


最近在细读Vue 3.0的源码，其中的数据响应已经基于Proxy实现。便把相关和Proxy和Reflect一起整理和梳理一下，细化知识结构。

常见的编程范式有结构化、面向对象、函数式、动态化和并行计算，JavaScript是一门神奇的语言，可以基于这5种范式来进行编程。Proxy和Reflect是动态化编程的基础之一。


## 反射对象

Reflect的常用方法和作用如下
| 常用方法 | 替代方法 | 作用 |
|:-----:|:-----:|:-----:|
|apply(target, ...)|target.apply()|调用函数|


