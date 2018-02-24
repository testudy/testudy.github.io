---
layout: post
title: 日历规范简介
tags: 技术 原创
---

iCalendar是由IETF规范标准，第一个版本是在1998年推出的RFC 2445。自那时以来，已成为最主要的标准日历数据交换网络和设备（电脑，手机等）。

该规范定义了如何iCalendar是用来进行调度操作（例如，一个单位可以邀请与会者参加会议并收到他们的回复）。

1. icalbody由一系列日历属性和一个以上的日历组件组成。
2. 日历属性被应用于整个日历。
3. 日历组件则是由若干日历属性描述成的一个日历语义。

比如，日历组件可以指定一个事件、一个待办事项列表、一个旅行事项、时区信息、繁忙/空闲时间信息，或者一个警报。在许多协议实现（比如Google Calendar）中不允许出现空行。

## 数据模型

该icalendar数据格式都有一个明确的数据模型。”icalendar”的对象包括一套“icalendar部件”，其中每个都包含一套“icalendar属性”和其他可能的子组件。一个icalendar属性由一个名字，一组可选参数（指定为“键值”对）和一个值。

icalendar组件包括：
1. “vevent”代表一个事件
2. “vtodo”这是一个任务或任务
3. “vjournal”这是一个日记条目
4. “vfreebusy”代表期间免费或繁忙时间信息
5. “vtimezone”这是一个时区定义（时区偏移和夏令时规则）
6. “valarm”是目前唯一定义的组件，用于设置报警或提醒的事件或任务。

属性包括：

1. “dtstart”这是一个开始时间为一个组成部分
2. “dtend”这是一个结束时间为一个组成部分
3. “摘要”这是一个标题或摘要的一个组成部分
4. “rrule”，可以指定规则重复活动或任务（例如，每一天，每一周的星期二，等。）
5. “组织者”代表日历用户谁是组织一个活动或分配任务
6. “与会者”代表日历用户参加的事件或指派的任务

Google日历导出ics文件示例：

```
BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:xxxxxx@xxx.com
X-WR-TIMEZONE:Asia/Shanghai
BEGIN:VEVENT
DTSTART:20180113T010000Z
DTEND:20180114T100000Z
DTSTAMP:20180202T035541Z
UID:20180113T032621Z-iCal4j@xxxx:0:0:0:xxxx:xxxx:xxxx:xxxx
CREATED:20180115T074900Z
DESCRIPTION:主题：All Around AI（助力人工智能落地）时间：2018年1月13日-14日（周六、周日）地点：北京国际会议中心人工
 智能科学家吴恩达曾经说过这样的话，一百年前，电可以为很多企业、很多行业带来巨大的交通通讯和农业网络，今天人工智能也会为很多企业带来一样大的改变。是的，
 人工智能已经不是只有在科幻小说和电影中才会出现的东西。它正在渗透到各行各业，并且离我们越来越近。企业要关注人工智能，但又不能为了AI而AI，那具体到A
 I在业务中的落地，目前都有哪些方向和落地方案了？由极客邦科技和InfoQ中国主办的全球人工智能技术大会（AICon）将会重点关注人工智能的落地实践，与
 企业一起探寻AI的边界......
LAST-MODIFIED:20180115T074900Z
LOCATION:北京朝阳区国际会议中心
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:AICon 全球人工智能与机器学习技术大会 2018
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR
```

除了这个数据模型和预先定义的属性，规范定义如何所有这些一起用来确定语义日历对象和调度。语义基本上是一套规则，说明所有的组件和属性一起使用，以确保所有icalendar产品能实现良好的互操作性。例如，一个规则要求所有活动必须有一个且只有一个“dtstart”属性。最重要的一部分，该icalendar规范是语义模型，它代表的日历。使用文本或是二次编码。


CalDav是根据RFC 4791 [ 6 ]定义的一种日历访问协议。

## 参考
0. [icalendar.org](https://icalendar.org/)
1. [iCalendar](https://zh.wikipedia.org/wiki/ICalendar)
2. [hCalendar](http://microformats.org/wiki/hCalendar)
3. [hcalendar-examples](http://microformats.org/wiki/hcalendar-examples)
4. [value-class-pattern](http://microformats.org/wiki/value-class-pattern)
5. [h-event](http://microformats.org/wiki/h-event)
6. [网络日历介绍](http://article.yeeyan.org/view/160841/327230)
7. [iCalendar 编程基础：了解和使用 iCal4j](https://www.ibm.com/developerworks/cn/java/j-lo-ical4j/)
8. [发布 Internet 日历简介](https://support.office.com/zh-cn/article/发布-internet-日历简介-a25e68d6-695a-41c6-a701-103d44ba151d)
9. [iCal4j](http://ical4j.github.io/)
10. [日历提供程序](https://developer.android.google.cn/guide/topics/providers/calendar-provider.html?hl=zh-cn)
11. [总结：简单的vCal/iCalendar/.ics格式说明](http://blog.heysh.xyz/2012/06/25/总结简单的vcalicalendar-ics格式说明/)
12. [calconnect](https://www.calconnect.org/)
13. [iCalendar Recurrence Rule 规范翻译](https://www.jianshu.com/p/8f8572292c58)
14. [jsical - Javascript parser for rfc5545](https://mozilla-comm.github.io/ical.js/)

## RFC规范
1. [rfc5545: Internet Calendaring and Scheduling Core Object Specification (iCalendar)](https://tools.ietf.org/html/rfc5545)
2. [废弃 rfc2445: Internet Calendaring and Scheduling Core Object Specification (iCalendar)](https://tools.ietf.org/html/rfc2445)
3. [rfc5546: iCalendar Transport-Independent Interoperability Protocol (iTIP)](https://tools.ietf.org/html/rfc5546)
4. [rfc6868: Parameter Value Encoding in iCalendar and vCard](https://tools.ietf.org/html/rfc6868)
5. [废弃 rfc2446: iCalendar Transport-Independent Interoperability Protocol
6. (iTIP) Scheduling Events, BusyTime, To-dos and Journal Entries](https://tools.ietf.org/html/rfc2446)
7. [rfc6638: Scheduling Extensions to CalDAV](https://tools.ietf.org/html/rfc6638)
8. [rfc7529: Non-Gregorian Recurrence Rules in the Internet Calendaring and Scheduling Core Object Specification (iCalendar)](https://tools.ietf.org/html/rfc7529)
9. [rfc7953: Calendar Availability](https://tools.ietf.org/html/rfc7953)
10. [New Properties for iCalendar](https://tools.ietf.org/html/rfc7986)
11. [rfc4791: Calendaring Extensions to WebDAV (CalDAV)](https://tools.ietf.org/html/rfc4791)
12. [rfc7265: jCal: The JSON Format for iCalendar](https://tools.ietf.org/html/rfc7265)
