---
layout: post
title: Lerna，多包存储库管理工具简介
tags: 技术 工具
---
1. 


## 现代项目组织的思考

现代项目组织管理代码的方式主要分为两种：
	• Multirepo
	• Monorepo

顾名思义，Multirepo 就是将应用按照模块分别在不同的仓库中进行管理；而 Monorepo 就是将应用中所有的模块一股脑全部放在同一个项目中，这样一来，所有应用不需要单独发包、测试，所有代码都在一个项目中管理，一同部署上线，共享构建以及配置脚本等核心流程，同时在开发阶段能够更早地复现 bug，暴露问题。

这就是项目代码在组织上的不同哲学：一种倡导分而治之，一种倡导集中管理。究竟是把鸡蛋全部放在同一个篮子里，还是倡导多元化，这就要根据团队的风格以及面临的实际场景进行选型。

Babel 和 React 都是典型的 Monorepo，其 issues 和 pull requests 都集中到唯一的项目中，CHANGELOG 可以简单地从一份 commits 列表梳理出来。

将大型代码库拆分为独立的独立版本包对于代码共享非常有用。 然而，在许多存储库中进行更改是麻烦和难以跟踪的事情。为了解决这些（和许多其他）问题，一些项目将它们的代码库组织成多包存储库。 像 Babel、React、Angular、Ember、Meteor、Jest 等等。

Lerna 是一个优化使用 git 和 npm 管理多包存储库的工作流工具，用于管理具有多个包的 JavaScript 项目。

Lerna 中的两个主要命令是 lerna bootstrap 和 lerna publish。 bootstrap 将把 repo 中的依赖关系链接在一起。 publish 将有助于发布软件包更新。

	1. lerna publish了，用于发布更新，运行该命令会执行如下的步骤：
		a. 运行lerna updated来决定哪一个包需要被publish
		b. 如果有必要，将会更新lerna.json中的version
		c. 将所有更新过的的包中的package.json的version字段更新
		d. 将所有更新过的包中的依赖更新
		e. 为新版本创建一个git commit或tag
		f. 将包publish到npm上
		g. 同时，该命令也有许多的参数，例如--skip-git 将不会创建git commit或tag，--skip-npm将不会把包publish到npm上。
	2. lerna updated/lerna diff 对包是否发生过变更
	3. lerna ls，显示packages下的各个package的version
	4. lerna clean 清理node_modules
	5. lerna run 运行npm script，可以指定具体的package

## lerna最佳实践
为了能够使lerna发挥最大的作用，根据这段时间使用lerna 的经验，总结出一个最佳实践。下面是一些特性。
	1. 采用Independent模式
	2. 根据Git提交信息，自动生成changelog
	3. eslint规则检查
	4. prettier自动格式化代码
	5. 提交代码，代码检查hook
	6. 遵循semver版本规范


## 参考
	1. [开启现代库的基建学习 —— 从项目演进看前端工程化发展](https://www.jianshu.com/p/62ef2ad52765)
	2. [Lerna](https://lerna.js.org/)
	3. [使用lerna管理大型前端项目](https://www.jianshu.com/p/2f9c05b119c9)
	4. [多包存储库管理工具Lerna](https://www.oschina.net/p/lerna)
	5. [用Lerna管理多包JS项目](https://zhuanlan.zhihu.com/p/33858131)
	6. [lerna: 最佳实践](https://blog.csdn.net/qq_28387069/article/details/88388909)
	7. [lerna的基础使用](https://www.jianshu.com/p/8b7e6025354b)
	8. [印记中文](https://docschina.org/)
