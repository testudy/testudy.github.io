---
layout: post
title: 插入浏览器历史记录条目
tags: 技术 原创
---

> 这个技术对用户会有打扰，须遵循`不作恶`的底线慎重使用。
> 
> 1. [新浪博客参考效果](http://blog.sina.cn/dpool/blog/s/blog_4e64da9b0100dqoy.html?md=gd)；
> 2. 当前页面返回会先返回到首页，再返回入口页面也是这个效果。

## 基础API
`history`对象是BOM提供了的对浏览器历史记录的访问能力。常用的方法如下：
{% highlight javascript %}
// 后退
history.back();

// 前进
history.forward();

// 移动到指定的历史记录点
// 相对于当前页面位置的数值
history.go(n);

// 历史记录栈长度
history.length;

// 创建的新历史记录条目
history.pushState(state, title, url);

// 修改当前历史记录条目
history.replaceState(state, title, url);

// 读取当前状态
history.state;

// popstate事件只有在由pushState和replaceState方法创建的历史记录条目中前进和后退时才会触发，
// window.onpopstate是popstate事件在window对象上的事件句柄。
window.onpopstate = funcRef;
{% endhighlight %}

HTML5引进了history.pushState()方法和history.replaceState()方法，允许逐条添加和修改历史记录条目，同时改变referrer的值。可以协同window.onpopstate事件一起工作。


## 基本思路
1. 将要插入历史记录的页面1 replaceState当前页面2；
2. 将当前页面2 pushState为新的历史记录；
3. 执行完步骤1和步骤2之后，当前的历史记录条目中添加了页面1；
4. 在页面2中监听popstate事件，监听后退到页面1时，reload页面，更新为页面1的内容；
5. 在页面1中监听popstate事件，监听前进道页面2时，reload页面，更新为页面2的内容。


## 示意代码
{% highlight javascript %}

// 将要插入的页面路径转化为state对象
function getStates(hrefs) {
    var states = [];

    states.push({
        action: 'popstate-for-href',
        index: hrefs.length,
        title: document.title,
        href: location.href
    });

    for (var i = hrefs.length - 1; i >= 0; i -= 1) {
        states.unshift({
            action: 'popstate-for-href',
            index: i,
            title: '',
            href: hrefs[i]
        });
    }

    return states;
}

// 插入历史记录
function insertStates(states) {
    var state;
    for (var i = 0, len = states.length; i < len; i += 1) {
        state = states[i];
        if (i === 0) {
            history.replaceState(state, state.title, state.href);
        } else {
            history.pushState(state, state.title, state.href);
        }
    }
}

// 在页面1和页面2中均绑定popstate事件
window.addEventListener('popstate', popstate, false);
function popstate(event) {
    var state = event.state;
    if (state.action === 'popstate-for-href') {
        location.replace(location.href);
    }
}

{% endhighlight %}


## 参考资料：
1. [操纵浏览器的历史记录](https://developer.mozilla.org/zh-CN/docs/DOM/Manipulating_the_browser_history)
2. [window.onpopstate](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onpopstate)


<script src="/assets/js/modify-history.js"></script>
