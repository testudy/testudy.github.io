# Math.random()函数在手机浏览器中的缓存问题

> 前些时间做一个小功能，在页面中随机显示两个template中的一个，自然用到了JavaScript中的Math.random这个方法。却无意中发现，两者是不平均的。仔细分析，原因出在网页的回退中。

## 初步结论
同一台手机中的不同浏览器之间会存在差异；
iOS和Android之间存在较大差异；
Android不同系统版本间的同款浏览器表现存在差异。

情况很复杂，比较合适的解决办法是，使用document.write方法初步生成dom，DOMReady之后绑定onpageshow监听，导航发生变化的时候对template进行更新。

### 测试代码如下：
A/B页面
``` html
<script>
(function () {
    'use strict';

    function random(name) {
        var result = '';
        if (name) {
            result = name + '<br />';
        }
        result += Math.random() + '<br />' +
            Date.now() + '<br />';

        return result;
    }

    document.write(random());

    window.onpageshow = function () {
        console.log('show');
        document.querySelector('#show').innerHTML = random('pageshow');
    };
    window.onpagehide = function () {
        document.querySelector('#hide').innerHTML = random('pagehide');
    };

    window.onload = function () {
        console.log('load');
        document.querySelector('#load').innerHTML = random('load');
    };
    window.onunload = function () {
        document.querySelector('#unload').innerHTML = random('unload');
    };
    window.onpopstate = function () {
        document.querySelector('#pop').innerHTML = random('pop');
    };
}());
</script>
<div id="load"></div>
<div id="unload"></div>
<a href="/B页面">B页面</a>
<div id="show"></div>
<div id="hide"></div>
<div id="pop"></div>
```

### 测试步骤
1. A页面超链接进入B页面，返回（1）查看A页面的各项内容是否更新；
2. 前进到B页面，查看B页面上的各项元素是否更新；
3. 点击B页面的超链接，查看B页面上的各项元素是否更新；
4. 返回（2）查看A页面的各项内容更新情况；
5. 按Home键后再次唤醒打开浏览器；
6. 再次导航历史记录（返回或前进）。

### 测试结果
1. Mac OS 10.11.4 Safari 9.

| | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
| --- | :-------: | :----: | :------------: | :-------: | :----: | :--------: |
| write | N | N | Y | N | - | - |
| load | N | N | Y | N | - | - |
| unload | - | - | - | - | - | - |
| pageshow | Y | Y | Y | Y | - | - |
| pagehide | Y | Y | - | Y | - | - |
| popstate | Y | Y | - | Y | - | - |

2. Mac OS 10.11.4 Chrome 50

|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | Y | Y | Y | Y | - | - |
| load | Y | Y | Y | Y | - | - |
| unload | - | - | - | - | - | - |
| pageshow | Y | Y | Y | Y | - | - |
| pagehide | - | - | - | - | - | - |
| popstate | - | - | - | - | - | - |

#### 3. Mac OS 10.11.4 Firefox 45.0.2

|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | Y | Y | Y | Y | - | - |
| load | Y | Y | Y | Y | - | - |
| unload | - | - | - | - | - | - |
| pageshow | Y | Y | Y | Y | - | - |
| pagehide | - | - | - | - | - | - |
| popstate | - | - | - | - | - | - |

4. iOS 9.3.1 Safari
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | N | N | Y | N | N | Y |
| load | N | N | Y | N | N | Y |
| unload | - | - | - | - | - | - |
| pageshow | Y | Y | Y | Y | N | Y |
| pagehide | Y | Y | - | Y | N | - |
| popstate | Y | Y | - | Y | N | - |

5. iOS 9.3.1 Chrome 49
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | N | N | Y | N | N | Y |
| load | N | N | Y | N | N | Y |
| unload | - | - | - | - | - | - |
| pageshow | Y | Y | Y | Y | N | Y |
| pagehide | Y | Y | - | Y | N | - |
| popstate | Y | Y | - | Y | N | - |

6. iOS 9.3.1 Opera Coast 5.2
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | N | N | Y | N | N | N |
| load | N | N | Y | N | N | N |
| unload | - | - | - | - | - | - |
| pageshow | Y | Y | Y | Y | N | Y |
| pagehide | Y | Y | - | Y | N | Y |
| popstate | Y | Y | - | Y | N | Y |

7. iOS 9.3.1 UC 10.9.11.769
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | N | N | Y | N | N | N |
| load | N | N | Y | N | N | N |
| unload | - | - | - | - | - | - |
| pageshow | Y | Y | Y | Y | N | Y |
| pagehide | Y | Y | - | Y | N | Y |
| popstate | Y | Y | - | Y | N | Y |

8. iOS 9.3.1 百度 3.3
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | N | N | Y | N | N | N |
| load | N | N | Y | N | N | N |
| unload | - | - | - | - | - | - |
| pageshow | N | N | Y | N | N | N |
| pagehide | - | - | - | - | - | - |
| popstate | - | - | - | - | - | - |

9. iOS 9.3.1 QQ 6.6.0
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | N | N | Y | N | N | N |
| load | N | N | Y | N | N | N |
| unload | - | - | - | - | - | - |
| pageshow | N | N | Y | N | N | N |
| pagehide | - | - | - | - | - | - |
| popstate | - | - | - | - | - | - |

10. Android 5.1.1(smartisan os 2.6.0) 系统浏览器
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | Y | Y | Y | Y | N | Y |
| load | Y | Y | Y | Y | N | Y |
| unload | - | - | - | - | - | - |
| pageshow | Y | Y | Y | Y | N | Y |
| pagehide | - | - | - | - | - | - |
| popstate | - | - | - | - | - | - |

11. Android 5.1.1(smartisan os 2.6.0) Chrome 49
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | Y | Y | Y | Y | N | Y |
| load | Y | Y | Y | Y | N | Y |
| unload | - | - | - | - | - | - |
| pageshow | Y | Y | Y | Y | N | Y |
| pagehide | - | - | - | - | - | - |
| popstate | - | - | - | - | - | - |

12. Android 5.1.1(smartisan os 2.6.0) UC 10.9.8
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | N | N | Y | N | N | N |
| load | N | N | Y | N | N | N |
| unload | - | - | - | - | - | - |
| pageshow | Y | Y | Y | Y | N | Y |
| pagehide | Y | Y | - | Y | N | Y |
| popstate | Y | Y | - | Y | N | Y |

13. Android 5.1.1(smartisan os 2.6.0) QQ 6.6.0
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | N | N | Y | N | N | N |
| load | N | N | Y | N | N | N |
| unload | - | - | - | - | - | - |
| pageshow | N | N | Y | N | N | N |
| pagehide | - | - | - | - | - | - |
| popstate | - | - | - | - | - | - |

14. Android 5.1.1(smartisan os 2.6.0) Baidu 7.0（X表示可能变，可能不变）
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | N | N | Y | N | N | X |
| load | N | N | Y | N | N | X |
| unload | - | - | - | - | - | - |
| pageshow | N | N | Y | N | N | X |
| pagehide | - | - | - | - | - | - |
| popstate | - | - | - | - | - | - |

15. Android 4.4.2 系统浏览器
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | Y | Y | Y | Y | N | Y |
| load | Y | Y | Y | Y | N | Y |
| unload | - | - | - | - | - | - |
| pageshow | Y | Y | Y | Y | N | Y |
| pagehide | - | - | - | - | - | - |
| popstate | Y | Y | Y | Y | N | Y |

16. Android 4.4.2 Chrome 48
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | Y | Y | Y | Y | N | Y |
| load | Y | Y | Y | Y | N | Y |
| unload | - | - | - | - | - | - |
| pageshow | Y | Y | Y | Y | N | Y |
| pagehide | - | - | - | - | - | - |
| popstate | - | - | - | - | - | - |

17. Android 4.4.2 UC 10.9.8
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | N | N | Y | N | N | N |
| load | N | N | Y | N | N | N |
| unload | - | - | - | - | - | - |
| pageshow | Y | Y | Y | Y | N | Y |
| pagehide | Y | Y | - | Y | N | Y |
| popstate | Y | Y | Y | Y | N | Y |

18. Android 4.4.2 QQ 6.6.0
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | N | N | Y | N | N | N |
| load | N | N | Y | N | N | N |
| unload | - | - | - | - | - | - |
| pageshow | N | N | Y | N | N | N |
| pagehide | - | - | - | - | - | - |
| popstate | - | - | - | - | - | - |

19. Android 4.4.2 手机百度 5.0
|   | 返回(1) | 前进 | 点击(或刷新) | 返回(2) | 唤醒 | 再次导航 |
|---|:-------:|:----:|:------------:|:-------:|:----:|:--------:|
| write | Y | Y | Y | Y | N | Y |
| load | Y | Y | Y | Y | N | Y |
| unload | - | - | - | - | - | - |
| pageshow | Y | Y | Y | Y | N | Y |
| pagehide | - | - | - | - | - | - |
| popstate | Y | Y | Y | Y | N | Y |
