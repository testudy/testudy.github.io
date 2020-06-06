---
layout: post
title: 在Git上提交代码的安全步骤
tags: 技术 经验 规范
---

还在直接merge代码吗？执行`git log --graph`试试？

## 完美接力——代码提交的“安全直线”

1. [vue-next](https://github.com/vuejs/vue-next) 3.0项目，贡献者132人，commit graph如下图

![vue-next commit graph](/tech/media/vue-next-commit-graph.png)

2. [electron](
![electron commit graph](/tech/media/electron-commit-graph.png)


## 万马奔腾——隐藏危险的“多路并行”

![some-project-before commit graph](/tech/media/some-project-before-commit-graph.png)


## 简单执行——在Git（GitLab）上提交代码的安全步骤

![some-project-after commit graph](/tech/media/some-project-after-commit-graph.png)

## 备注

代码的管理是一门艺术，不能一概而论，上面的步骤（方法）适用于5-10人规模的小团队共同基于一个代码仓库开发，并行1-3个需求的开发。如果超过这个范围，rebase的工作量和难度会几何曲线增加，需要用更合适的操作方法。
