---
layout: post
title: 在Git上提交代码的安全步骤
tags: 技术 经验 规范
---

直接merge代码后，您可能遇到过：
1. 代码合并后少了一个右大括号`}`，导致代码上线后500错误；
2. 代码合并后少了一个html结束标签`</div>`，导致页面完全混乱，debug了2个小时；
3. ……

好像直接merge代码并不足够安全，为什么呢？执行`git log --graph`试试？

## 完美接力——代码提交的“安全直线”

1. [vue-next](https://github.com/vuejs/vue-next) 3.0项目，贡献者132人，commit graph如下：

![vue-next commit graph](/tech/media/vue-next-commit-graph.png)

2. [electron](https://github.com/electron/electron)项目，贡献者948人，commit graph如下：
![electron commit graph](/tech/media/electron-commit-graph.png)

为什么这些优秀的开源项目的提交线都是一条完美的直线呢？跟我们的代码中可能不太一样呢？如果一样，那么恭喜您，您的代码库很优秀。


## 万马奔腾——隐藏危险的“多路并行”

我们代码库的提交线可能如下图：

![some-project-before commit graph](/tech/media/some-project-before-commit-graph.png)

用一个形象的比喻，伙伴们在提交代码这件事儿上，齐头并进、争先恐后、万马奔腾……好一番热闹景象。热闹背后可能有一些不安全因素，举一个最常见的案例：

1. 签出特性分支1`feat-great-wall-20200601`进行开发，开始修建长城；
2. 提交特性分支1`feat-great-wall-20200601`进行测试，开始测试长城；
3. 上线特性分支2`feat-aircraft-carrier`，在测试期间上线航空母舰；
4. 特性分支1`feat-great-wall-20200601`测试完成，合并到`master`并上线，结果：航母沉没，长城入海……
5. 回滚吧？回滚到哪儿呢？
我们都知道，git merge的基本工作原理是三路合并，如上图中两个分叉一定有一个共同的前置节点，对着上图中红圈的标识处，即可复现上案例。


## 简单执行——在Git（GitLab）上提交代码的安全步骤

![some-project-after commit graph](/tech/media/some-project-after-commit-graph.png)

## 备注

代码的管理是一门艺术，不能一概而论，上面的步骤（方法）适用于5-10人规模的小团队共同基于一个代码仓库开发，并行1-3个需求的开发。如果超过这个范围，rebase的工作量和难度会几何曲线增加，需要用更合适的操作方法。
