---
layout: post
title: 劫持
tags: 技术 原创
---

## [DNS劫持](http://baike.baidu.com/view/3163602.htm)

广告劫持是运营商或恶意团体将用户正常页面指向到广告页面或在正常页面中插入第三方广告的劫持行为

> DNS的全称是Domain Name Server，一种程序，它保存了一张域名(domain name)和与之相对应的IP地址 (IP address)的表，以解析消息的域名。o

[腾讯云，DNS劫持检测](http://www.qcloud.com/wiki/DNS劫持检测)

### DNS劫持修复建议
Local DNS劫持类型可大致分为运营商缓存、运营商广告、恶意劫持等类型，当出现运营商缓存和运营商广告等方式的劫持时，请您联系运营商进行处理；当出现恶意劫持时，请联系域名服务商或者运营商进行处理

[DNS劫持恶意代码检查](http://zhanzhang.anquan.org/topic/dns_hijacking/#srch)

## [HTTP劫持](http://bbs.kafan.cn/thread-1825061-1-1.html)
HTTP劫持是在使用者与其目的网络服务所建立的专用数据通道中，监视特定数据信息，提示当满足设定的条件时，就会在正常的数据流中插入精心设计的网络数据报文，目的是让用户端程序解释“错误”的数据，并以弹出新窗口的形式在使用者界面展示宣传性广告或者直接显示某网站的内容。

## 向劫持说不
那么我们怎么防范劫持呢？ 
很遗憾，还真没办法预防。
唯一可行的预防方法就是尽量使用HTTPS协议访问。
目前，我们知道其劫持原理后知道只能通过检测TTL的变化或HTML元素检查来判定，但这都不是一般用户可以解决的。
不过，根据目前的情况，我们可以考虑在边界设备针对TTL为252且为TCP协议的包做DROP处理，切记不能REJECT。
（以普通居民用户的网络来说，TTL为252的TCP响应几乎不可能存在，所以特异性还是比较突出的）
但治标不如治本，还是去投诉吧！

## 其他解决方案
[防治运营商HTTP劫持的终极技术手段](http://www.williamlong.info/archives/4181.html)
[【HTTP劫持和DNS劫持】腾讯的实际业务分析](http://www.cnblogs.com/kenkofox/p/4919668.html)
