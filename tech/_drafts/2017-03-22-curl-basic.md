---
layout: post
title: curl基础使用
tags: 技术 原创
---

[curl](https://curl.haxx.se/)（transfer a URL）是个常用的命令，但一直以来没有用过这个命令。今天正好有个要多次用不同UA请求服务器的需求，往常类似的需求会简单在Chrome中修改UA后发出请求来实现，但今天要请求的次数比较多，便从头学习一下curl命令的初步使用，以补充自己这块短板，方便以后通过脚本化编程提高效率。

## curl是什么？

curl的Man Page中的描述如下：

> curl is a tool to transfer data from or to a server, using one of the supported protocols (DICT, FILE, FTP, FTPS, GOPHER, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, POP3, POP3S, RTMP, RTSP, SCP, SFTP, SMB, SMBS, SMTP, SMTPS, TELNET and TFTP). The command is designed to work without user interaction.
>
> curl offers a busload of useful tricks like proxy support, user authentication, FTP upload, HTTP post, SSL connections, cookies, file transfer resume, Metalink, and more. As you will see below, the number of features will make your head spin!
>
> curl is powered by libcurl for all transfer-related features. See libcurl(3) for details.

从[curl维基百科](https://zh.wikipedia.org/wiki/CURL)上抄curl的介绍如下：

> curl是一个利用URL语法在命令行下工作的文件传输工具，1997年首次发行。它支持文件上传和下载，所以是综合传输工具，但按传统，习惯称curl为下载工具。curl还包含了用于程序开发的libcurl。
>
> curl支持的通信协议有FTP、FTPS、HTTP、HTTPS、TFTP、SFTP、Gopher、SCP、Telnet、DICT、FILE、LDAP、LDAPS、IMAP、POP3、SMTP和RTSP。
>
> libcurl支持的平台有Solaris、NetBSD、FreeBSD、OpenBSD、Darwin、HP-UX、IRIX、AIX、Tru64、Linux、UnixWare、HURD、Windows、Symbian、Amiga、OS/2、BeOS、Mac OS X、Ultrix、QNX、BlackBerry Tablet OS、OpenVMS、RISC OS、Novell NetWare、DOS等。

## 这里包含的内容

突然意识到，curl的用途如此之广，学会、逐步掌握这个工具对以后的工作会很有帮助。这里只把自己常用和将要常用的HTTP方面的功能记录如下，方便以后查阅。

Google中搜索到了阮一峰老师一篇关于[curl网站开发指南](http://www.ruanyifeng.com/blog/2011/09/curl.html)的文章，里面对常用的命令介绍很详细，基本上拿来即用。

我的学习习惯是建立知识框架，便从阮一峰老师这篇文章中的参考[Using curl to automate HTTP jobs](https://curl.haxx.se/docs/httpscripting.html)中通读，先学习curl的HTTP部分，下面的学习记录也是对这篇官方文档的记录。

今天需要掌握的学习目标是：

1. 掌握自定义首部，实现`user-agent`和`referer`的自定义。

## 学习记录

### 基础功能

curl作为一个HTTP客户端发出请求，请求部分包含一个请求方法（像GET，POST，HEAD等等）和一些请求首部，需要的时候也会包含一个请求正文。

HTTP服务器正常情况下会返回一行状态码，响应首部，通常情况下也会包含响应正文（实际的HTML文本或图片等）。

常用的基础参数和其意义如下：

```shell
# 查看详细信息，-v(--verbose)
curl -v testudy.cc

# 追踪数据接收，--trace --trace-ascii --trace-time
curl --trace ./index.txt --trace-time testudy.cc

# 存储响应报文，-o
curl -o index.html testudy.cc
```

### URL相关

```shell
# 指定DNS解析，--resolve
# 如下例：将testudy.cc解析到127.0.0.1（特别注意，由于4000不是默认端口号，需要特别指定）
curl --resolve testudy.cc:4000:127.0.0.1 http://testudy.cc:4000/tech/2017/03/22/curl-basic.html

## 指定用户名和密码 -u，或者uri协议
curl http://user:password@testudy.cc/
curl -u user:password http://testudy.cc/
```

### 请求方法

curl默认使用的`GET`请求方法

```shell
# 默认GET方法，显示中包含响应首部，-i
curl -i testudy.cc

# 仅显示响应首部，-I（大写i）或--head，此时是HEAD方法
curl --head testudy.cc
curl -I testudy.cc

# 使用--data选项，则此时是POST方法
curl --data "birthyear=1905&press=%20OK%20" http://www.hotmail.com/when/junk.cgi

# 使用--request（-X），将请求方法修改为PROPFIND
curl --request PROPFIND url.com
```

### Form表单

```shell
# GET提交
curl "http://www.hotmail.com/when/junk.cgi?birthyear=1905&press=%20OK%20"

# POST提交
curl --data "birthyear=1905&press=%20OK%20" http://www.hotmail.com/when/junk.cgi
curl --data-urlencode "birthyear=1905&press= OK " http://www.hotmail.com/when/junk.cgi
```

### HTTP上传

```shell
# PUT提交
curl --upload-file uploadfile http://www.example.com/receive.cgi
```

### HTTP首部设置

```shell
# Referer 
curl --referer http://www.example.come http://www.example.com

# User Agent
# 模拟Window 2000上的IE5 
curl --user-agent "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)" testudy.cc

# 使用--header可以添加一个自定义首部
curl --header "Destination: http://nowhere" http://example.com

# 设置一个空Host首部，以在请求中删除Host首部
curl --header "Host:" http://www.example.com
```

### 支持Location首部

```shell
# 支持302跳转，--location（-L）
# 下例跳转到www.jdwl.com
curl --location www.jd-ex.com
```

### Cookie设置
```shell
# 在request中添加cookie首部
curl --cookie "name=Daniel" http://www.example.com

# 输出响应中所有首部信息，Set-Cookie中即是Cookie信息
curl --dump-header headers_and_cookies http://www.example.com

# 请求中读入Cookie，--cookie (-b)，响应中写入Cookie， --cookie-jar (-c) 
# 注意cookies.txt和newcookies.txt文件要预先存在
curl --cookie cookies.txt --cookie-jar newcookies.txt  http://www.example.com
```

### HTTPS
```
# 直接请求HTTPS资源即可，curl客户端会完成加密和解密
curl https://www.example.com
```


## 参考
1. [curl官网](https://curl.haxx.se/)
2. [Man Page](https://curl.haxx.se/docs/manpage.html)
3. [Using curl to automate HTTP jobs](https://curl.haxx.se/docs/httpscripting.html)
4. [curl的维基百科](https://zh.wikipedia.org/wiki/CURL)
5. [curl网站开发指南](http://www.ruanyifeng.com/blog/2011/09/curl.html)
6. [curl自动化http操作](http://cizixs.com/2014/05/14/curl-automate-http)
