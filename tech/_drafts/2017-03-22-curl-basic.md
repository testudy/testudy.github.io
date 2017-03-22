---
layout: post
title: cURL基础使用
tags: 技术 原创
---

[cURL](https://curl.haxx.se/)是个常用的命令，但一直以来没有用过这个命令。今天正好有个要多次用不同UA请求服务器的需求，往常类似的需求会简单在Chrome中修改UA后发出请求来实现，但今天要请求的次数比较多，便从头学习一下cURL命令的初步使用，以补充自己这块短板，方便以后通过脚本化编程提高效率。

从[cURL维基百科](https://zh.wikipedia.org/wiki/CURL)上抄cURL的介绍如下：

> cURL是一个利用URL语法在命令行下工作的文件传输工具，1997年首次发行。它支持文件上传和下载，所以是综合传输工具，但按传统，习惯称cURL为下载工具。cURL还包含了用于程序开发的libcurl。  
> cURL支持的通信协议有FTP、FTPS、HTTP、HTTPS、TFTP、SFTP、Gopher、SCP、Telnet、DICT、FILE、LDAP、LDAPS、IMAP、POP3、SMTP和RTSP。  
> libcurl支持的平台有Solaris、NetBSD、FreeBSD、OpenBSD、Darwin、HP-UX、IRIX、AIX、Tru64、Linux、UnixWare、HURD、Windows、Symbian、Amiga、OS/2、BeOS、Mac OS X、Ultrix、QNX、BlackBerry Tablet OS、OpenVMS、RISC OS、Novell NetWare、DOS等。

突然意识到，cURL的用途如此之广，学会、逐步掌握这个工具对以后的工作会很有帮助。这里只把自己常用和将要常用的HTTP方面的功能记录如下，方便以后查阅。

今天初步的学习目标是：
> 掌握自定义首部，实现`user-agent`和`referer`的自定义。

## 参考
1. [cURL官网](https://curl.haxx.se/)
2. [Man Page](https://curl.haxx.se/docs/manpage.html)
3. [cURL的维基百科](https://zh.wikipedia.org/wiki/CURL)
