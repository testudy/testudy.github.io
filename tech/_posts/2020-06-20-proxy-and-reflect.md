---
layout: post
title: Reflect和Proxy简述
tags: 技术 元编程 JavaScript
---

## 读一本好书是一件开心的事儿

喜讯，周爱民老师的[《JavaScript语言精髓与编程实践（第3版）》](https://book.douban.com/subject/35085910/)已经可以购买。

19年在QCon上听周爱民老师说在写第三版，便一直在期待，终于等到出版，第一时间购买——好书早“享受”。

12年有幸读到[第二版](https://book.douban.com/subject/10542576/)，在参加工作的早期让自己突然有了豁然开朗的感觉。

08年，周爱民老师已经写了这本书的[第一版](https://book.douban.com/subject/3012828/)，那时候我还在上大学。周爱民老师于技术的匠艺匠心是我辈技术人员的楷模——于我自己努力学习，不懈实践。


最近在细读Vue 3.0的源码，其中的数据响应已经基于Proxy实现。便把相关和Proxy和Reflect一起整理和梳理一下，细化知识结构。

常见的编程范式有结构化、面向对象、函数式、动态化和并行计算，JavaScript是一门神奇的语言，可以基于这5种范式来进行编程。Reflect和Proxy是动态化编程的基础之一。Reflect对象用于“调用”对象的行为，Proxy类从另一个角度来实现反射，用于改变对象的行为。


## 反射对象

通过反射（Reflection）机制，可以访问、检测和修改对象的内容状态和行为。Reflect的常用方法和作用如下：

| 常用方法 | 替代方法 | 作用 |
|--------|---------|-----|
|apply(target, ...)|target.apply()|调用函数|
|constructor(target, args, ...)|new target(...args)|创建实例|
|getPrototypeOf(target)|Object.getPrototypeOf(target)|原型读取|
|setPrototypeOf(target, ...)|Object.setPrototypeOf(target, ...)|原型设置|
|get(target, prop, ...)|target[prop]|属性值读取|
|set(target, prop, ...)|target[prop] = xxx|属性值设置|
|has(target, prop)|prop in target|属性值检查|
|deleteProperty(target, prop)|delete target[prop]|属性表项删除|
|defineProperty(target, ...)|Object.defineProperty()|属性表项增加|
|getOwnPropertyDescriptor(...)|Object.getOwnPropertyDescriptor()|属性表项列举|
|ownKeys(target)|可shim实现|属性表项列举|
|isExtensible(target)|Object.isExtensible(target)|属性表管理|
|preventExtensions(target)|Object.preventExtensions(target)|属性表管理|

## 代理对象
Proxy可以代理目标对象的全部行为，和Reflect的常用方法一一对应，每一个可以被反射的Reflect.xxx方法，在Proxy中都有对应的handler。

如下例所示的`obj`对象代理，代理机制并不改变原始对象自己的操作，代理对象只能响应“在代理对象上发生的”行为，未定义handler的行为会被直接投射到目标对象。

```javascript
class People {
    constructor(age) {
        this.age = age;
    }
}

var xiaoxiao = Reflect.construct(People, [10])
var proxyxiao = new Proxy(xiaoxiao, {
    get(target, key) {
        console.info('access key name: ', key);
        return target[key] * 2;
    }
});

console.log(xiaoxiao.age); // 10
console.log(proxyxiao.age); // 20

xiaoxiao.age = 30;
console.log(xiaoxiao.age); // 30
console.log(proxyxiao.age); // 60

xiaoxiao.age = 50;
console.log(xiaoxiao.age); // 50
console.log(proxyxiao.age); // 100
```

