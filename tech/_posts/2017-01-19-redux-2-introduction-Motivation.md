---
layout: post
title: Redux 2 - 入门：动机（Motivation）
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/docs/introduction/Motivation.md)

As the requirements for JavaScript single-page applications have become increasingly complicated, **our code must manage more state than ever before**. This state can include server responses and cached data, as well as locally created data that has not yet been persisted to the server. UI state is also increasing in complexity, as we need to manage active routes, selected tabs, spinners, pagination controls, and so on.

随着JavaScript的单页应用的要求变得越来越复杂，**我们的代码必须比以往管理更多的状态**。其中既包含服务器响应和缓存数据，也包括由本地创建尚未持久化到服务器端的数据。同时UI状态也越发复杂，我们必须管理路由激活，选项卡选择，进度条，分页控件，等等。

Managing this ever-changing state is hard. If a model can update another model, then a view can update a model, which updates another model, and this, in turn, might cause another view to update. At some point, you no longer understand what happens in your app as you have **lost control over the when, why, and how of its state.** When a system is opaque and non-deterministic, it's hard to reproduce bugs or add new features.

管理不断变化的状态非常困难。如果一个模型可以更新另一个模型，一个视图也可以更新一个模型，这个模型又更新了另一个模型，反过来这又导致了其他视图的更新。在某些情况下，你难于理解程序发生了什么，**不知道它的状态在什么时候，什么原因又如何发生了变化**。当系统变得不足够透明并充满不确定性时，重现和解决Bug将变得非常困难，也难于添加新的需求。

As if this wasn't bad enough, consider the **new requirements becoming common in front-end product development**. As developers, we are expected to handle optimistic updates, server-side rendering, fetching data before performing route transitions, and so on. We find ourselves trying to manage a complexity that we have never had to deal with before, and we inevitably ask the question: [is it time to give up?](http://www.quirksmode.org/blog/archives/2015/07/stop_pushing_th.html) The answer is _no_.

似乎这还不是全部问题，鉴于**在前端产品开发中不断加入的新需求**，作为开发者，我们期望实现高性能更新，服务器端渲染，在路由跳转之前获得数据，等等其他任务。我们突然发现自己要处理的工作已经变得前所未有的复杂，此时不可避免的会有一个想法：[是否到了放弃的时候？](http://www.quirksmode.org/blog/archives/2015/07/stop_pushing_th.html)，答案当然是*NO*。

This complexity is difficult to handle as **we're mixing two concepts** that are very hard for the human mind to reason about: **mutation and asynchronicity.** I call them [Mentos and Coke](https://en.wikipedia.org/wiki/Diet_Coke_and_Mentos_eruption). Both can be great in separation, but together they create a mess. Libraries like [React](http://facebook.github.io/react) attempt to solve this problem in the view layer by removing both asynchrony and direct DOM manipulation. However, managing the state of your data is left up to you. This is where Redux enters.

这种复杂性很难处理，因为它**混合的两个概念**对人类来说都非常难于理解：**变化和异步**。我将它们称为[可乐加曼妥思喷发现象](https://zh.wikipedia.org/wiki/可樂加曼陀珠噴發現象)。两个问题分开时都可以漂亮的解决，但一起出现后就变成了一团乱麻。[React](http://facebook.github.io/react)之类的库中同时删除了异步和DOM的直接操作来解决视图层中的这个问题。但管理状态数据则取决于你自己，这也是Redux出现的原因。

Following in the steps of [Flux](http://facebook.github.io/flux), [CQRS](http://martinfowler.com/bliki/CQRS.html), and [Event Sourcing](http://martinfowler.com/eaaDev/EventSourcing.html), **Redux attempts to make state mutations predictable** by imposing certain restrictions on how and when updates can happen. These restrictions are reflected in the [three principles](ThreePrinciples.md) of Redux.

逐步跟随[Flux](http://facebook.github.io/flux)，[CQRS](http://martinfowler.com/bliki/CQRS.html)和[Event Sourcing](http://martinfowler.com/eaaDev/EventSourcing.html)改进的基础上，通过严格限制更新发生的时机和方式，使得**Redux中可以预测状态的变化**，这种限制集中体现在Redux的[三原则](https://github.com/reactjs/redux/blob/master/docs/introduction/ThreePrinciples.md)中。
