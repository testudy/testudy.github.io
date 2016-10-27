---
layout: post
title: 对标准JSON序列化字符串进行null替换的尝试
tags: 技术 原创
---

考虑了序列化数据的嵌套

## 未考虑序列化数据的嵌套
{% highlight javascript %}
var inner1Obj = {inner1key: null};
var inner1JSON = JSON.stringify(inner1Obj);
var inner2Obj = {data: inner1JSON, inner2key: null};
var inner2JSON = JSON.stringify(inner2Obj);
var outerObj = {data: inner2JSON, outerKey: null};
var outerJSON = JSON.stringify(outerObj);

outerJSON = outerJSON.replace(/:null/g, ':""');
console.log(outerJSON);
var obj = JSON.parse(outerJSON);
console.log(obj);
var obj2 = JSON.parse(obj.data);
console.log(obj2);
var obj3 = JSON.parse(obj2.data);
console.log(obj3);
{% endhighlight %}

## 解决办法
用正则表达式替换null，补全双撇号的转义。（未做充分测试，有可能存在问题）。
{% highlight javascript %}
outerJSON = outerJSON.replace(/(\\*)":null/g, '$1":$1"$1"');
{% endhighlight %}
