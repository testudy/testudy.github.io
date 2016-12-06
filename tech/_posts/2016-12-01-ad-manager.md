---
layout: post
title: 弱特征广告展示初步实现（未完成）
tags: 技术 原创
---

[弱特征广告展示思路](/tech/2016/11/29/ad.html)初步实现基本思路：

1. 简单性，以前直接写在页面中的HTML结构广告要能低成本的改造；
2. 用基本的HTML结构和Style标签作为数据结构，方便后续广告系统的开发和使用，实现基本的可视方案；
3. 通过函数参数简化数据传输；
4. 下载链接的配置参考[AppLink](/tech/2016/11/25/applink.html)。


## HTML部分
{% highlight html %}
<script type="am-template" id="am-header">
<style>
.am-header {
}
.am-header .am-header-logo {
}
.am-header .am-header-title {
}
.am-header .am-join {
}
</style>
<div class="am-header">
    <div class="am-header-logo">
        <div class="am-header-title">Title</div>
        <p>Slogan</p>
    </div>
    <a class="am-join" href="#">立即打开</a>
    <a class="am-join" 
        href="download-link"                         // 服务器端设置的根据UA判断的自动跳转链接，包含下面4中情况
        data-href-android="android-download-link"    // Android包下载地址
        data-href-ios="itunes-link"                  // itunes地址
        data-href-qq-android="myapp-link"            // 应用宝推广地址
        data-href-qq-ios="myapp-link"                // 应用宝推广地址
        data-deeplink="deep-link"                    // 跳转App地址
    >立即打开</a>
</div>
</script>
<script>
one.am(document.querySelector('#am-header').innerHTML);
</script>
{% endhighlight %}

## CSS部分
{% highlight css %}
iframe {
    width: 100%;
    border: none;
}
{% endhighlight %}

## JS部分
{% highlight javascript %}
{% endhighlight %}
