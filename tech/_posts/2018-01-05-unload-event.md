---
layout: post
title: 浏览器页面卸载事件监听
tags: 技术 原创
---

最近需要做一个数据上报的JS库，遇到的最后一个细节问题是，页面关闭/卸载时如何进行数据上报的问题。

可用的事件主要是beforeunload，pagehide，或unload3个事件。简单测试后，不同的事件是常规的方法，数据上报特别容易丢失，为了防止丢失，常用的方法有两个：1是用同步请求（常见的同步请求是XMLHttpRequest对象），2是模拟一个延迟函数。

但关闭页面的方法很多，如下表所示：

1. 超链接点击（anchor）；
2. 触发超链接的点击事件（anchor.click）
3. 打开自定义协议（custom:）
4. 执行`document.write`；
5. 表单提交（form.onsubmit）；
6. 脚本提交表单（form.submit）；
7. 打开JavaScript伪协议（javascript:）；
8. `location.href`跳转；
9. `location.reload`重载；
10. `location.replace`跳转；
11. `mailto:`打开邮件客户端；
12. 刷新页面（reload）；
13. `window.close`关闭页面；
14. `window.open`打开新窗口；
15. `window.open_self`在当前窗口打开新窗口。

这么多种情况都有可能触发页面卸载，和上面的数据上报方法进行组合，在种类繁多的手机版本+浏览器版本中测试，手工记录肯定是不行的，反复记录特别容易出错。为了简化记录，方便统计数据，设计实验流程如下。

## 实验设计

### 1. 设计需要的数据

如下代码段中，需要将事件类型，是否同步请求，是否延迟等待，客户端类型，触发类型，再加一个事件戳就可以了。

```
    <script>
    (function () {
        window.action = '';
        window.isAsync = true;
        window.isWait = false;
 
        function wait(ms) {
            var now = new Date().getTime();
            while(new Date() - ms <= now) {}
        }
 
        function sendXhr(type) {
            var xhr = new XMLHttpRequest();
 
            var data = {
                type: type,
                isAsync: window.isAsync,
                isWait: window.isWait,
                userAgent: navigator.userAgent,
                action: window.action || 'reload',
                timestramp: (new Date()).getTime(),
            };
 
            xhr.open('POST', '/report/' + type, window.isAsync);
            xhr.setRequestHeader('Content-Type', 'text/plain');
            xhr.send(JSON.stringify(data));
 
            if (window.isWait) {
                wait(1000);
            }
        }
 
        window.onbeforeunload = function () {
            sendXhr('beforeunload');
        };
 
        window.onpagehide = function () {
            sendXhr('pagehide');
        };
 
        window.onunload = function () {
            sendXhr('unload');
        };
    }());

    </script>
```

### 2. 设计需要上报数据的页面，如下index.html所示，统计：

```html
    <a onclick="window.action=window.action || 'anchor';" href="/sub" id="A">点击一个链接到新页面</a><br />
    <button onclick="window.action='anchor.click';document.getElementById('A').click()">调用 anchor.click 方法</button><br />
    <button onclick="window.action='document.write';document.write('A')">调用 document.write 方法</button><br />
    <button onclick="window.action='window.open';window.open('/sub')">调用 window.open 方法</button><br />
    <button onclick="window.action='window.close';window.close()">调用 window.close 方法</button><br />
    <button onclick="window.action='window.open_self';window.open('/sub','_self')">调用 window.open方法，窗口名称设置值为 _self</button><br />
    <button onclick="window.action='location.replace';location.replace('/sub')">调用 location.replace 方法</button><br />
    <button onclick="window.action='location.reload';location.reload()">调用 location.reload 方法</button><br />
    <button onclick="window.action='location.href';location.href='/sub'">指定一个 location.href 属性的新值</button><br />
    <form action="/sub" id="B" onsubmit="window.action='form.onsubmit';">
        <input type="submit" value="提交具有 action 属性的一个表单">
    </form>
    <button onclick="window.action='form.submit';document.getElementById('B').submit()">调用 form.submit 方法</button><br />
    <a onclick="window.action='javascript:';" href="javascript:void(0)">调用 javascipt: 伪协议</a><br />
    <a onclick="window.action='mailto:';" href="mailto:">调用 mailto: 伪协议</a><br />
    <a onclick="window.action='custom:';" href="custom:">调用自定义伪协议</a>
```

### 3. 服务器端简单的写一个数据上报API，模拟真实的数据上报，同时做数据的采集

```javascript
router.post('/report/*', (ctx, next) => {
    ctx.body = 'OK';
    const reports = JSON.parse(fs.readFileSync('./data/report.json', {
        encoding: 'utf8',
    }));
    const report = JSON.parse(ctx.request.body);
    console.log(report);

    const hasReport = reports.find(item => {
        if (item.isAsync === report.isAsync &&
                item.isWait === report.isWait &&
                item.action === report.action &&
                item.type === report.type &&
                item.userAgent === report.userAgent) {
            return true;
        }
        return false;
    });
    if (!hasReport) {
        reports.push(report);
        fs.writeFileSync('./data/report.json', JSON.stringify(reports), {
            encoding: 'utf8',
        });
    }
});
```

### 4. 处理数据

大量的数据，格式化处理，输出报表是更合适的方法。简单写个输出页面，将实验结果按“事件类型+是否同步请求+是否延迟等待”分组，分别输出各种浏览器的数据信息。

将UA手工处理后，如下所示。

## 实验数据

### beforeunload + async + nowait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| Chrome 63 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |

### beforeunload + sync + nowait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| Chrome 63 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |
| Safari 11.0.2 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |

### pagehide + sync + nowait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| Chrome 63 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| Safari 11.0.2 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |

### unload + sync + nowait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| Chrome 63 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| Safari 11.0.2 | N | N | N | N | N | N | N | N | Y | Y | Y | Y | N | N | N |

### beforeunload + async + wait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| Chrome 63 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |
| Safari 11.0.2 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | Y | Y | Y |

### pagehide + async + wait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| Chrome 63 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| Safari 11.0.2 | N | N | N | N | N | N | N | N | N | N | N | N | Y | N | N |

### unload + async + wait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| Chrome 63 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| Safari 11.0.2 | N | N | N | N | N | N | N | N | N | N | N | N | Y | N | N |

## 实验结果

从上面的表格结果中，可以简单的看出，产生的7组数据中，以`beforeunload + sync + nowait`、`pagehide + sync + nowait`、`pagehide + async + wait`在个浏览器中兼容性好，数据全面。

但wait形式依赖于固定值的延迟，页面会造成无谓的延长等待，所以放弃wait的形式。

最终结果，使用sync后，可以使用`beforeunload`或`pagehide`事件，均能达到较好的效果。数据上报完成后，即卸载页面，避免无谓的等待数据上报。但这种方式还是会造成一定的延迟，依赖于服务器性能和网络状态。

### 细节

这种方式是同步执行，无法abort请求，可以设置timeout时间，以避免长时间的等待。


## Todo

1. 做更多的机型测试。


## 实验源码
[github](https://github.com/testudy/browser-unload-event)


## 参考
1. [WebKit Page Cache II – The unload Event](https://webkit.org/blog/516/webkit-page-cache-ii-the-unload-event/)
2. [unload](https://developer.mozilla.org/zh-CN/docs/Web/Events/unload)
3. [各个浏览器中对于beforeunload事件和unload事件的对比](https://sinaad.github.io/xfe/2016/06/29/beforeunlod-vs-unload/)
4. [SD9026: 各浏览器对 onunload 事件的支持与触发条件实现有差异](http://www.w3help.org/zh-cn/causes/SD9026)
5. [BX2047: 各浏览器对 onbeforeunload 事件的支持与触发条件实现有差异](http://www.w3help.org/zh-cn/causes/BX2047)
