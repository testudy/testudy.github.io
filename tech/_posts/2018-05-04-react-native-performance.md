---
layout: post
title: React Native的性能对比测试
tags: 技术 原创
---

## 缘起
前些日子用React Native做一个项目的开发，用JS做了一些较复杂的计算工作，却发现计算性能突然就出现了，想起了之前看React Native文档时其中提醒：React Native在iOS中没有启用JIT。[《JavaScript Environment》](https://facebook.github.io/react-native/docs/javascript-environment.html)中原文如下：

> In most cases, React Native will use JavaScriptCore, the JavaScript engine that powers Safari. Note that on iOS, JavaScriptCore does not use JIT due to the absence of writable executable memory in iOS apps.

JIT是重要的性能优化环节，尤其对重复执行的函数，做下面的测试释疑。将React Native中代码的执行和系统浏览器中的执行进行对比，测试经典的JS执行环境和React Native中的性能有多少差别。测试过程记录如下。

测试环境使用手边的两台手机，从测试的角度两台手机不具备完整的样本性，结果仅供参考而已。

## 测试环境

1. iPhone 6S 11.3.1 + Safari
2. iPhone 6S 11.3.1 + WebView
3. iPhone 6S 11.3.1 + Expo 27.0.1 + React Native 0.55
4. OnePlus 5T 8.1.0 + Chrome 66.0
5. OnePlus 5T 8.1.0 + WebView（同Chrome内核）
6. OnePlus 5T 8.1.0 + Expo 27.0.1 + React Native 0.55

## 测试方法
使用jsencrypt，对一段简单的文本进行encrypt和decrypt 200次，并计时。

备注：这个测试只是一个简单的测试，并不对所有的处理场景通用，仅做定性分析而已。

## 测试记录

| 环境 | 时长1（秒） | 时长2（秒） | 时长3（秒） | 时长4（秒） | 时长5（秒） |
|------:|:------|:------|:------|:------|:------|
| iPhone + Safari | 1136 | 1147 | 1362 | 1126 | 1124 |
| iPhone + WebView | 1137 | 1224 | 1079 | 1090 | 1127 |
| iPhone + Expo | 46524 | 46322 | 46649 | 46284 | 46227 |
| Android + Chrome | 3495 | 3478 | 3789 | 3935 | 3898 |
| Android + WebView | 3911 | 3482 | 3375 | 3373 | 3385 |
| Android + Expo | 52675 | 52722 | 52720 | 53696 | 52086 |

## 测试结论
同样的代码，React Native中的执行比浏览器中要慢15倍以上，在iOS中尤其明显，差距到40倍以上，这种性能的差异对React Nativez中JavaScript编码的性能提出了极高的要求。

## 解决办法
1. 最简单使用的解决办法：React Native当做一个纯粹的View层来使用，计算交给服务器端——获取数据，不进行二次处理，直接把数据展示出来；
2. 拼算法功底吧；
3. 选择合适的使用场景。

## 测试代码如下
```javascript
// 浏览器环境测试代码
(function () {
    'use strict';

    const publicKey = `-----PUBLIC KEY-----`;

    const privateKey = `-----BEGIN RSA PRIVATE KEY-----`;

    const decrypt = new JSEncrypt();
    decrypt.setPublicKey(publicKey);

    const encrypt = new JSEncrypt();
    encrypt.setPrivateKey(privateKey);

    const text = '关关雎鸠，在河之洲。窈窕淑女，君子好逑。';
    const start = Date.now();

    for (let i = 0; i < 200; i += 1) {
        const enc = decrypt.encrypt(text);
        const dec = encrypt.decrypt(enc);
    }

    const end = Date.now();
    document.querySelector('#result').innerHTML = end - start;
}());
```

## 参考
1. [jsencrypt](http://travistidwell.com/jsencrypt/);
2. [测试代码](https://github.com/testudy/react-native-perf-test)
