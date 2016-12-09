---
layout: post
title: FE中常见的百分号编码
tags: 技术 原创
---

> 百分号编码在FE中常用语URI编码和From表单（包含Ajax）提交中，常用的相关函数存在一些和标准不完全一致的地方，在阅读RFC3986规范的同时，做简单笔记和测试如下。

## encodeURIComponent
encodeURIComponent()是对统一资源标识符（URI）的组成部分进行编码的方法。它使用一到四个转义序列来表示字符串中的每个字符的UTF-8编码（只有由两个Unicode代理区字符组成的字符才用四个转义字符编码）。

用encodeURIComponent方法对URI组件编码测试，这个方法对RFC3986标准不足够兼容，测试方法和结果如下：
{% highlight javascript %}
(() => {
    let genDelims = [':', '/', '?', '#', '[', ']', '@'];
    let subDelims = ['!', '$', '&', '\'', '(', ')', '*', '+', ',', ';', '='];

    console.log(genDelims.map(encodeURIComponent));
    console.log(subDelims.map(encodeURIComponent));
})();

// 运行结果
["%3A", "%2F", "%3F", "%23", "%5B", "%5D", "%40"]
["!", "%24", "%26", "'", "(", ")", "*", "%2B", "%2C", "%3B", "%3D"]
{% endhighlight %}

从上面的测试结果中可以看到，`["!", "'", "(", ")", "*"]`5个RFC3986中规定的字符没有被编码，修改方法如下：

{% highlight javascript %}
(() => {
    function fixedEncodeURIComponent (component) {
        let map = {
            '!': '%21',
            '\'': '%27',
            '(': '%28',
            ')': '%29',
            '*': '%2A',
        };
        return encodeURIComponent(component).replace(/[!'()\*]/g, (delim) => map[delim]);
    }

    let genDelims = [':', '/', '?', '#', '[', ']', '@'];
    let subDelims = ['!', '$', '&', '\'', '(', ')', '*', '+', ',', ';', '='];

    console.log(genDelims.map(fixedEncodeURIComponent));
    console.log(subDelims.map(fixedEncodeURIComponent));
})();

// 运行结果
["%3A", "%2F", "%3F", "%23", "%5B", "%5D", "%40"]
["%21", "%24", "%26", "%27", "%28", "%29", "%2A", "%2B", "%2C", "%3B", "%3D"]
{% endhighlight %}


## encodeURI
encodeURI() 是对统一资源标识符（URI）进行编码的方法。当URL中的各个组件部分不存在URI保留字时，可使用此方法简单编码。

encodeURI编码测试
{% highlight javascript %}
(() => {
    let genDelims = [':', '/', '?', '#', '[', ']', '@'];
    let subDelims = ['!', '$', '&', '\'', '(', ')', '*', '+', ',', ';', '='];

    console.log(genDelims.map(encodeURI));
    console.log(subDelims.map(encodeURI));
})();

// 运行结果
[":", "/", "?", "#", "%5B", "%5D", "@"]
["!", "$", "&", "'", "(", ")", "*", "+", ",", ";", "="]
{% endhighlight %}

从上面的结果可以看出，`['[', ']']`两个字符被编码，方括号是被保留的(给IPv6)，因此对于那些没有被编码的URL部分(例如主机)，修正方法如下：
{% highlight javascript %}
(() => {
    function fixedEncodeURI (uri) {
    	return encodeURI(uri).replace(/%5B/g, '[').replace(/%5D/g, ']');
    }

    let genDelims = [':', '/', '?', '#', '[', ']', '@'];
    let subDelims = ['!', '$', '&', '\'', '(', ')', '*', '+', ',', ';', '='];

    console.log(genDelims.map(fixedEncodeURI));
    console.log(subDelims.map(fixedEncodeURI));
})();

// 运行结果
[":", "/", "?", "#", "[", "]", "@"]
["!", "$", "&", "'", "(", ")", "*", "+", ",", ";", "="]
{% endhighlight %}

## escape
`escape`方法在Mozilla的JavaScript 1.5（兼容ECMA-262，第3版）中被标记废用，在此不做讨论。

废弃的 escape() 方法生成新的由十六进制转义序列替换的字符串. 使用 encodeURI 或 encodeURIComponent 代替.

## application/x-www-form-urlencoded类型
当HTML表单中的数据被提交时，表单的域名与值被编码并通过HTTP的GET或者POST方法甚至更古远的email把请求发送给服务器。这里的编码方法采用了一个非常早期的通用的URI百分号编码方法，并且有很多小的修改如新行规范化以及把空格符的编码"%20"替换为"+" . 按这套方法编码的数据的MIME类型是application/x-www-form-urlencoded, 当前仍用于（虽然非常过时了）HTML与XForms规范中. 此外，CGI规范包括了web服务器如何解码这类数据、利用这类数据的内容。

如果发送的是HTTP GET请求, application/x-www-form-urlencoded数据包含在所请求URI的查询成分中. 如果发送的是HTTP POST请求或通过email, 数据被放置在消息体中，媒体类型的名字被包含在消息的Content-Type头内部。

即将`fixedEncodeURIComponent`的结果中`%20`替换为`+`即可，或使用jQuery中的`serialize`等相同功能的方法。

## PHP中的使用
PHP 要使用 rawurlencode() 函数以真正符合 RFC 3986 的“百分号URL编码”，只是由于历史原因，之前先有了一个 urlencode() 函数用于实现 HTTP POST 中的类似的编码规则，故而只好用这么一个奇怪的名字。两者的区别在于前者会把空格编码为%20，而后者则会编码为+号。

## 粗读[RFC3986](http://wiki.jabbercn.org/RFC3986)摘录

### 1 绪论

#### 1.1 URIs概述

统一

允许不同类型的资源标识符被用在相同的上下文中, 即使当访问那些资源使用的机制不同的时候. 它允许跨越资源标识符的不同类型的常用语法习惯拥有统一的语义解释. 

资源

术语 "resource" 被用于一般意义上的任何可以由URI标识的东西. 熟悉的例子包括一个电子文档, 一个图片, 一个包含一致的目的的信息源(例如, "洛杉矶今日天气"), 一个服务(例如, 一个 HTTP 到 短信 的网关), 以及一个其他资源的集合. 

标识符

一个标识符包含如何在身份识别的范围中从其他事物区分出被标识的事物的信息. 我们使用术语 "identify" 和 "identifying" （识别）来指代从其他资源区分出一个资源的行动, 不管那个行为是如何完成的(例如, 通过名称, 地址, 或上下文). 

#### 1.3 语法符号

本协议使用RFC2234的增强巴科斯范式(ABNF)符号, 包括由以下协议定义的核心ABNF语法规则: ALPHA (字母), CR (回车), DIGIT (小数位数), DQUOTE (双引号), HEXDIG (十六进制数字), LF (换行), 和 SP (空格). 

### 2 字符
一个URI由一个包含数字，字母，和一些图形符号的有限集合的字符组成. 

#### 2.1 百分号编码
一个百分号编码机制被用于在一个部件里展示一个八位字节码数据，当那个八位字节码相应的字符超出了允许的集合或被用作分隔符，或在部件之内的时候. 

{% highlight text %}
pct-encoded = "%" HEXDIG HEXDIG
{% endhighlight %}

大写的十六进制数字 'A' 到 'F' 分别等价于小写的数字 'a' 到 'f' . 如果两个URIs在百分号编码字节中使用的十六进制数字的大小写不同, 它们是等价的. 为了了一致性, URI制作造和正规化者应该对所有百分号编码使用大写十六进制数字.

#### 2.2 保留字符
包含部件和子部件的的URIs由 "保留" 集合中的字符来分隔. 如果用于一个URI的数据和一个保留的作为分隔符的字符发生冲突, 那么该冲突的数据必须在该URI被格式化之前进行百分号编码.

{% highlight text %}
reserved    = gen-delims / sub-delims

gen-delims  = ":" / "/" / "?" / "#" / "[" / "]" / "@"

sub-delims  = "!" / "$" / "&" / "'" / "(" / ")"
            / "*" / "+" / "," / ";" / "="
{% endhighlight %}

#### 2.3 非保留字符
被允许出现在一个URI中的字符但是没有被保留用途，被成为非保留(unreserved). 这包含大写和小写字母, 小数数字, 连字符, 句号, 下划线, 以及波浪号.

{% highlight text %}
unreserved  = ALPHA / DIGIT / "-" / "." / "_" / "~"
{% endhighlight %}

#### 2.4 何时编码或解码
在正常情况下, 只有在从部件部分生成URI的过程中一个URI内的字节才有机会被百分号编码. 

当一个URI被解参考的时候, 对scheme特有的解参考过程(如果有的话)重要的部件和子部件在那些部件中的百分号编码字节能被解码之前必须被解析和分离, 因为否则数据会和部件分隔符搞错. 

因为百分号("%")字符用作百分号编码字节的指针, 它必须被百分号编码成 "%25" 才能把那个字节用作一个URI的数据. 实现不能多次百分号编码或解码相同的字符串, 因为解码一个现有的已解码字符串可能导致把一个百分号数据字节错误地解释成一个百分号编码的开始, 反之亦然，百分号编码一个已做百分号编码的字符串.

#### 2.5 识别数据
当一个新的URI scheme定义一个展示包含来自统一字符集UCS的字符的原文数据的部件, 该数据应该首先根据UTF-8字符编码STD63被编码成字节; 然后只有那些在非保留集合中没有对应字符的字节应该被百分号编码.

### 3 语法部件
通用URI语法包括一系列分层的由 scheme, authority, path, query, 和 fragment 参考的部件.

{% highlight text %}
URI         = scheme ":" hier-part [ "?" query ] [ "#" fragment ]

hier-part   = "//" authority path-abempty
            / path-absolute
            / path-rootless
            / path-empty
{% endhighlight %}

部件的scheme和path部件是必需的, 尽管path可能是空的(无字符). 当authority是现成的, path必须要么是空的要么是以一个斜杠("/")开始的字符串. 当authority不是当前的, path不能以两个斜杠("//")开始. 这些约束导致5个用于path的不同ABNF规则(3.3), 它们中只有一个将匹配任何给定的URI参数.

以下是两个示例URIs以及它们的部件部分:
{% highlight text %}
  foo://example.com:8042/over/there?name=ferret#nose
  \_/   \______________/\_________/ \_________/ \__/
   |           |            |            |        |
scheme     authority       path        query   fragment
   |   _____________________|__
  / \ /                        \
  urn:example:animal:ferret:nose
{% endhighlight %}

#### 3.1 格式
每个URI以一个格式名称开始，它代表分配给带那个格式的标识符的一个协议. 

格式名称包含一系列以一个字母开始的并跟随任意字母，数字，加号("+"), 句号("."), 或连字符("-")的组合. 

{% highlight text %}
scheme      = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
{% endhighlight %}

#### 3.2 机构
一些URI schemes包含一个层次元素来描述一个命名的机构,这样由该URI的其他部分定义的命名空间的管理方式就被授予那个机构(它可以相应地进一步授予). 通用语法提供了一个常见方法来基于已注册的名称或服务器地址来区分一个机构, 以及可选的端口和用户信息.
机构部件的前面是一个双斜杠("//")并结束于下一个斜杠("/"), 问号("?"), 或井号("#")字符, 或随着该URI结束.

{% highlight text %}
authority   = [ userinfo "@" ] host [ ":" port ]
{% endhighlight %}

如果端口部件是空的，URI制作者和正规化者应该省略把端口和主机分隔开的 ":" 分隔符. 一些schemes不允许用户信息 和/或 端口子部件.

##### 3.2.1 用户信息
用户信息子部件可以包含一个用户名和, 可选的, 关于如何获得授权访问资源的格式特有的信息. 用户信息, 如果出现, 后面会跟随一个商标("@")以和主机分开.

{% highlight text %}
userinfo    = *( unreserved / pct-encoded / sub-delims / ":" )
{% endhighlight %}

在用户信息字段对格式 "user:password" 的使用已经被废弃了. 应用不应该在一个用户信息子部件中找到的第一个冒号(":")字符后面提出任何明码文本数据，除非在该冒号后面的数据是空字符串(表示没有密码). 

##### 3.2.2 主机
机构的主机子部件是由一个封装在方括号内的IP文字, 一个点分十进制格式的IPv4地址, 或一个注册名称来标识的.

{% highlight text %}
host        = IP-literal / IPv4address / reg-name
{% endhighlight %}

##### 3.2.3 端口
机构的端口子部件由一个可选的跟随在主机后面并且从单个的冒号 (":") 字符之后开始的十进制端口号来指定.

{% highlight text %}
port        = *DIGIT
{% endhighlight %}

一个格式可以定义一个缺省端口. 例如, "http" 格式定义了一个缺省端口 "80", 和它的保留TCP端口号码一致. 

#### 3.3 路径
路径由第一个问号("?")或数字符号("#")字符或该URI的结尾来终止.

{% highlight text %}
path          = path-abempty    ; begins with "/" or is empty
              / path-absolute   ; begins with "/" but not "//"
              / path-noscheme   ; begins with a non-colon segment
              / path-rootless   ; begins with a segment
              / path-empty      ; zero characters

path-abempty  = *( "/" segment )
path-absolute = "/" [ segment-nz *( "/" segment ) ]
path-noscheme = segment-nz-nc *( "/" segment )
path-rootless = segment-nz *( "/" segment )
path-empty    = 0<pchar>

segment       = *pchar
segment-nz    = 1*pchar
segment-nz-nc = 1*( unreserved / pct-encoded / sub-delims / "@" )
              ; non-zero-length segment without any colon ":"

pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
{% endhighlight %}

一个路径包含一系列由斜杠("/")字符分隔的路径片段. 对于一个URI来说总是会定义一个路径, 尽管定义的路径可能是空(零长度). 指示层次用的斜杠字符之在一个URI用作指示相对引用的时候是必需的.

#### 3.4 查询
查询部件由第一个问号("?")字符指示并由一个数字符号("#")字符或该URI的结尾终止.
{% highlight text %}
query       = *( pchar / "/" / "?" )
{% endhighlight %}

#### 3.5 片段
一个URI的片段标识符部件允许对一个主要资源引用的次要资源的非直接身份认证以及额外的识别信息. 被识别的次要资源可以是该主要资源的一部分或子集, 或一些由那些陈述所定义或描述的资源. 一个片段标识符部件是通过一个数字符号("#")字符的出现来指示的并由该URI的结尾来终止.

{% highlight text %}
fragment    = *( pchar / "/" / "?" )
{% endhighlight %}

### 4 用法

#### 4.1 URI引用

URI引用常常代表一个资源标识符的最常见的用法.

{% highlight text %}
      URI-reference = URI / relative-ref
{% endhighlight %}

一个URI引用要么是一个URI要么是一个相对引用. 如果该URI引用的前缀和跟随在它的冒号后面的格式的语法不匹配, 那么该URI引用是一个相对引用.

#### 4.2 相对引用
一个相对引用可以方便地用层次化语法(1.2.3) 表达和另一个层次化URI的命名空间相关的一个URI引用.

{% highlight text %}
relative-ref  = relative-part [ "?" query ] [ "#" fragment ]

relative-part = "//" authority path-abempty
              / path-absolute
              / path-noscheme
              / path-empty
{% endhighlight %}

由一个相对引用所指向的URI, 也被认为是目标URI, 通过应用第5章的引用解析算法来获得.
一个开始于两个斜杠字符的相对引用被称为一个网络路径引用; 这类引用很少被使用. 一个开始于单个斜杠字符的相对引用被称为一个绝对路径引用. 一个不以斜杠字符开始的相对引用被称为一个相对路径引用.

一个包含一个冒号字符的路径段落(例如, "this:that")不能被用作一个相对路径引用的第一个段落, 因为它会被误认为一个格式名称. 这样一个段落必须在它前面放一个点段落(例如, "./this:that")以制作一个相对路径引用.

#### 4.3 绝对URI
一些协议元素仅被一个不带片段标识符的URI的绝对格式允许. 例如, 定义一个符合不允许片段的绝对URI语法规则的基础URI用于晚些时候供相对引用调用.

{% highlight text %}
      absolute-URI  = scheme ":" hier-part [ "?" query ]
{% endhighlight %}

#### 4.4 同文引用
同文引用的最常用的例子是空的或只包含一个后面跟随着片段标识符的数字标记("#")分隔符的相对引用.

当一个同文引用为了一个获取动作而被解参考, 那个引用的目标被定义成在该引用的同一个实体(展示, 文档, 或消息)中; 所以, 一个解参考不应改导致一个新的获取动作.

#### 4.5 后缀引用

### 5 引用解析

#### 5.1 建立基础URI

##### 5.1.1 嵌入在内容里的基础URI

##### 5.1.2 来自封装实体的基础URI

##### 5.1.3 来自检索URI的基础URI

##### 5.1.4 缺省基础URI

#### 5.2 相对解析

##### 5.2.1 预解析基础URI

##### 5.2.2 转换引用

##### 5.2.3 合并路径

##### 5.2.4 移除点片段

#### 5.3 部件重写

#### 5.4 引用解析示例

##### 5.4.1 常规示例

##### 5.4.2 反常示例

### 6 正规化和比较

#### 6.1 等价

#### 6.2 比较阶梯

##### 6.2.1 简单字符串比较

##### 6.2.2 基于语法的常规化
实现可以使用基于本协议提供的定义的逻辑来降低错误否定的可能性. 这个过程的开销适度地高于每字符的字符串比较. 例如, 一个使用这个方法的应用可能合理地认为以下两个URIs是等价的:

{% highlight text %}
example://a/b/c/%7Bfoo%7D
eXAMPLE://a/./b/../b/%63/%7bfoo%7d
{% endhighlight %}

Web用户代理, 类似浏览器, 当决定是否一个缓存的应答可用的时候典型地应用这类URI常规化. 基于语法的常规化包括这类技术，如案例常规化, 百分号常规化, 以及移除点片段.

###### 6.2.2.1 大写常规化

###### 6.2.2.2 百分号编码常规化

###### 6.2.2.3 路径片段常规化

##### 6.2.3 基于格式的常规化
各个格式的URIs的语法和语义是不同的, 如每个格式的定义协议所述. 实现可以使用格式特有的规则, 以更高的处理成本, 来减少错误否定的可能性. 例如, 因为一个用于授权部件的 "http" 格式, 有一个缺省端口 "80", 并且定义了一个空路径等价于 "/", 以下四个URIs是等价的:

{% highlight text %}
http://example.com
http://example.com/
http://example.com:/
http://example.com:80/
{% endhighlight %}

##### 6.2.4 基于协议的常规化

### 7 安全事项

#### 7.1 可靠性和一致性

#### 7.2 恶意构造

#### 7.3 后端转码
百分号字节在解参考过程中必须在某些点被解码. 应用必须在解码这些字节之前把URI分离成它的部件和子部件, 否则被解码的字节可能被误解为分隔符. 在一个URI中的数据的安全性检查应该在字节被解码之后应用. 记住, 无论如何, "%00" 百分号(空) 可能要求特殊的处理并且如果应用不期望在一个部件里接收原数据则应该被拒绝.

#### 7.4 罕见的IP地址格式

#### 7.5 敏感信息

#### 7.6 语义攻击

### 8 IANA事项

### 9 致谢

### 10 参考

#### 10.1 规范引用

#### 10.2 参考文献

### 11 附录A. 为URI收集的ABNF

### 12 附录B. 以正则表达式解析一个URI引用

### 13 附录C. 在上下文中限定一个URI

### 14 附录D. 对RFC 2396的改变

#### 14.1 D.1. 添加

#### 14.2 D.2. 变更

### 15 索引

### 16 作者地址

### 17 完整版权声明

### 18 知识产权

### 19 鸣谢


## 参考资料
1. [统一资源标志符](https://zh.wikipedia.org/wiki/统一资源标志符)
1. [百分号编码](https://zh.wikipedia.org/wiki/百分号编码)
1. [rfc3986](https://tools.ietf.org/html/rfc3986)
1. [rfc3986中文](http://wiki.jabbercn.org/RFC3986)
1. [rfc5987](https://tools.ietf.org/html/rfc5987)
1. [encodeURIComponent()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
1. [encodeURI()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)
1. [escape](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/escape)
1. [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)
1. [正确处理下载文件时HTTP头的编码问题（Content-Disposition）](https://blog.robotshell.org/2012/deal-with-http-header-encoding-for-file-download/)
