---
layout: post
title: 浏览器页面卸载事件监听
tags: 技术 原创
---

最近需要做一个数据上报的JS库，遇到的最后一个细节问题是，页面关闭/卸载时如何进行数据上报的问题。此时进行数据上报，主要有3种方法可以解决：

1. 给数据上报留足时间（同步上报或下面的wait方法）；
2. 用超出页面生命周期和作用域的方法（`navigator.sendBeacon`方法或者理论上可行的service worker）；
3. 将数据持久化，下次接着上报。

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

### beforeunload+async+nowait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| Mac 10.13.2；Chrome/63.0.3239.132 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111；微信6.5.23.1160 | Y | Y | Y | N | Y | Y | N | Y | N | Y | Y | Y | N | Y | Y |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |
| 一加5T；Android 7.1.1；Chrome/57.0.2987.108；UCBrowser/11.8.2.962 | Y | Y | N | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| Sony Z2；Android 4.4.2；系统浏览器 | N | N | N | N | Y | Y | N | Y | N | Y | N | N | N | N | N |
| 华为 Nova；Android 6.0；系统浏览器 | Y | Y | N | N | Y | Y | N | Y | Y | Y | N | Y | Y | N | N |

### beforeunload+sync+nowait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| Mac 10.13.2；Chrome/63.0.3239.132 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |
| Mac 10.13.2；Safari/604.4.7 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111；微信6.5.23.1160 | Y | N | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | Y | Y |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |
| 一加5T；Android 7.1.1；Chrome/57.0.2987.108；UCBrowser/11.8.2.962 | Y | Y | N | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |
| Sony Z2；Android 4.4.2；系统浏览器 | Y | N | Y | N | Y | Y | N | Y | Y | Y | Y | Y | Y | N | N |
| 华为 Nova；Android 6.0；系统浏览器 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | Y | N | Y |

### beforeunload+async+wait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| Mac 10.13.2；Chrome/63.0.3239.132 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |
| Mac 10.13.2；Safari/604.4.7 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | Y | Y | Y |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111；微信6.5.23.1160 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | Y | Y |
| 一加5T；Android 7.1.1；Chrome/57.0.2987.108；UCBrowser/11.8.2.962 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| Sony Z2；Android 4.4.2；系统浏览器 | Y | N | Y | N | Y | Y | N | Y | Y | Y | N | Y | Y | N | Y |
| 华为 Nova；Android 6.0；系统浏览器 | Y | Y | N | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |

### pagehide+async+nowait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111；微信6.5.23.1160 | N | N | N | N | N | N | N | Y | N | Y | N | Y | N | N | N |
| 一加5T；Android 7.1.1；Chrome/57.0.2987.108；UCBrowser/11.8.2.962 | Y | Y | N | N | Y | Y | N | Y | N | N | N | N | N | N | Y |


### pagehide+sync+nowait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| Mac 10.13.2；Chrome/63.0.3239.132 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| Mac 10.13.2；Safari/604.4.7 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |
| iPhone 6s 11.2.1；微信/6.6.1 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | Y | Y |
| iPhone 6s 11.2.1；Safari | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111；微信6.5.23.1160 | Y | N | N | N | Y | Y | N | Y | Y | Y | N | Y | N | Y | Y |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111 | Y | Y | N | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| 一加5T；Android 7.1.1；Chrome/57.0.2987.108；UCBrowser/11.8.2.962 | Y | Y | N | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |
| Sony Z2；Android 4.4.2；系统浏览器 | Y | N | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | N |
| iPhone 5s 8.4.1；Safari | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| 华为 Nova；Android 6.0；系统浏览器 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |

### pagehide+async+wait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| Mac 10.13.2；Chrome/63.0.3239.132 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| Mac 10.13.2；Safari/604.4.7 | N | N | N | N | N | N | N | N | N | N | N | N | Y | N | N |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111；微信6.5.23.1160 | Y | Y | Y | N | Y | Y | N | Y | N | Y | N | Y | N | Y | Y |
| 一加5T；Android 7.1.1；Chrome/57.0.2987.108；UCBrowser/11.8.2.962 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |

### unload+async+nowait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111；微信6.5.23.1160 | Y | Y | N | N | Y | N | N | N | N | Y | N | N | N | Y | N |

### unload+sync+nowait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| Mac 10.13.2；Chrome/63.0.3239.132 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| Mac 10.13.2；Safari/604.4.7 | N | N | N | N | N | N | N | N | Y | Y | Y | Y | N | N | N |
| iPhone 6s 11.2.1；微信/6.6.1 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | Y | Y |
| iPhone 6s 11.2.1；Safari | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111；微信6.5.23.1160 | Y | N | N | N | Y | Y | N | Y | Y | Y | N | Y | N | Y | Y |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111 | Y | Y | N | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| 一加5T；Android 7.1.1；Chrome/57.0.2987.108；UCBrowser/11.8.2.962 | N | N | N | N | N | N | N | N | Y | Y | Y | Y | N | N | N |
| Sony Z2；Android 4.4.2；系统浏览器 | Y | N | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | N |
| iPhone 5s 8.4.1；Safari | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| 华为 Nova；Android 6.0；系统浏览器 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | Y | Y | N | N | Y |

### unload+async+wait

|  | anchor | anchor.click | custom: | document.write | form.onsubmit | form.submit | javascript: | location.href | location.reload | location.replace | mailto: | reload | window.close | window.open | window.open_self |
| Mac 10.13.2；Chrome/63.0.3239.132 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| Mac 10.13.2；Safari/604.4.7 | N | N | N | N | N | N | N | N | N | N | N | N | Y | N | N |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111 | Y | Y | Y | N | Y | Y | N | Y | Y | Y | N | Y | N | N | Y |
| 一加5T；Android 7.1.1；Chrome 63.0.3239.111；微信6.5.23.1160 | Y | Y | Y | N | Y | Y | N | Y | N | Y | N | Y | N | Y | Y |
| 一加5T；Android 7.1.1；Chrome/57.0.2987.108；UCBrowser/11.8.2.962 | N | N | Y | N | N | N | N | N | Y | Y | N | Y | N | N | N |

## 实验结果

从上面的表格结果中，可以简单的看出，产生的9组数据中，~~以`beforeunload + sync + nowait`、`pagehide + sync + nowait`、`pagehide + async + wait`在各个浏览器中兼容性好，数据全面。~~并没有完全兼容所有浏览器的方法，在iOS中，只有同步的方法能上报成功数据，用`pagehide+sync+nowait`这组表现最好；在其他机型和浏览器中，`beforeunload+sync+nowait`这组表现略好一些。

但wait形式依赖于固定值的延迟，页面会造成无谓的延长等待，所以放弃wait的形式。

最终结果，使用sync后，~~在`beforeunload`或`pagehide`两者均能达到较好的效果的前提下选择前者，语义化更好~~，在iOS中使用后者，其他情况下使用前者。数据上报完成后，即卸载页面，避免无谓的等待数据上报。但这种方式还是会造成一定的延迟，依赖于服务器性能和网络状态。

原则上，服务器正常的情况下可用。期待下个Safari大版本中`navigator.sendBeacon`方法的[普及](https://caniuse.com/#feat=beacon)，TP版本中显示已经支持了。

目前业务中日志上报的服务器性能不错，50ms内可以完成，用同步XHR的方法作为sendBeacon的降级方案减少实现的复杂。

### 细节

这种方式是同步执行，无法abort请求，~~可以设置timeout时间，以避免长时间的等待~~。

> 同步请求中不支持设置timeout，~~默认时间是好像是10S~~（测试后Chrome中可以超出10S，链接不断就行）。
>
> Web Worker中会随着销毁文档的卸载而销毁，不可用。

## Todo

1. 做更多的机型测试。
2. Service Worker理论上可以解决同步数据上报的问题 (待测试）。



## 实验源码
[github](https://github.com/testudy/browser-unload-event)


## 参考
1. [WebKit Page Cache II – The unload Event](https://webkit.org/blog/516/webkit-page-cache-ii-the-unload-event/)
2. [unload](https://developer.mozilla.org/zh-CN/docs/Web/Events/unload)
3. [各个浏览器中对于beforeunload事件和unload事件的对比](https://sinaad.github.io/xfe/2016/06/29/beforeunlod-vs-unload/)
4. [SD9026: 各浏览器对 onunload 事件的支持与触发条件实现有差异](http://www.w3help.org/zh-cn/causes/SD9026)
5. [BX2047: 各浏览器对 onbeforeunload 事件的支持与触发条件实现有差异](http://www.w3help.org/zh-cn/causes/BX2047)
6. [XMLHttpRequest.timeout](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/timeout)
7. [jquery 的 ajax 同步调用方式的超时是如何指定的？](https://www.v2ex.com/t/135338)
8. [你真的会使用XMLHttpRequest吗？](https://segmentfault.com/a/1190000004322487)
9. [XMLHttpRequest](https://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html)
10. [HTML 5.3](https://w3c.github.io/html/webappapis.html#document-environment)
11. [同步和异步请求](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests)
12. [Cross-document messaging](https://caniuse.com/#feat=x-doc-messaging)
13. [踩坑之统计请求发送与页面跳转冲突](http://blog.csdn.net/allenliu6/article/details/77341538)
14. [页面跳转时，统计数据丢失问题探讨](http://www.barretlee.com/blog/2016/02/20/navigator-beacon-api/)
15. [web worker详解](http://xgfe.github.io/2017/05/03/LexHuang/web-worker/)
16. [Web workers Standard](https://html.spec.whatwg.org/multipage/workers.html)
