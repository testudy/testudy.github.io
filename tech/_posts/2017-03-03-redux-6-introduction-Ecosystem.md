---
layout: post
title: Redux 6 - 入门：生态系统（Ecosystem）
tags: 原创 技术 翻译 Redux
---

[原文](https://github.com/reactjs/redux/blob/master/docs/introduction/Ecosystem.md)

Redux is a tiny library, but its contracts and APIs are carefully chosen to spawn an ecosystem of tools and extensions.

Redux应该算做一个微型库，但在其严格的约束和严谨的API基础之上衍生出一套完整的工具和扩展的系统。

For an extensive list of everything related to Redux, we recommend [Awesome Redux](https://github.com/xgrommx/awesome-redux). It contains examples, boilerplates, middleware, utility libraries, and more. [React/Redux Links](https://github.com/markerikson/react-redux-links) contains tutorials and other useful resources for anyone learning React or Redux, and [Redux Ecosystem Links](https://github.com/markerikson/redux-ecosystem-links) lists many Redux-related libraries and addons.

如果要查找Redux相关的信息清单，推荐去[Awesome Redux](https://github.com/xgrommx/awesome-redux)站点。这个站点包含了示例、脚手架、中间件、工具库等等。[React/Redux Links](https://github.com/markerikson/react-redux-links)站点里面有一套相关教程，也包含其他有用的React和Redux相关资源。[Redux Ecosystem Links](https://github.com/markerikson/redux-ecosystem-links)站点搜集了Redux相关库和插件清单。

On this page we will only feature a few of them that the Redux maintainers have vetted personally. Don't let this discourage you from trying the rest of them! The ecosystem is growing too fast, and we have a limited time to look at everything. Consider these the “staff picks”, and don't hesitate to submit a PR if you've built something wonderful with Redux.

在当前页面中，仅仅列举出Redux系统中由Redux作者审核过的一小部分。这不是你拒绝尝试除此之外项目的理由，也不用顾虑这份”员工精选“，相反当你创建出漂亮的Redux项目时请毫不迟疑的提交一个PR来扩展维护这个页面。Redux系统发展太快，而我的时间有限不能看全所有相关内容。

## 学习Redux（Learning Redux）

### 录屏视频（Screencasts）

* **[Getting Started with Redux](https://egghead.io/series/getting-started-with-redux)** — Learn the basics of Redux directly from its creator (30 free videos)
* **[Learn Redux](https://learnredux.com)** — Build a simple photo app that will simplify the core ideas behind Redux, React Router and React.js

* **[Redux入门](https://egghead.io/series/getting-started-with-redux)** — 直接跟随Redux作者进行基础学习（包含30个免费视频）
* **[Redux学习](https://learnredux.com)** — 构建一个简单的照片App，快速学习Redux、React Router和React.js的核心思想。

### 示例应用（Example Apps）

* [Official Examples](Examples.md) — A few official examples covering different Redux techniques
* [SoundRedux](https://github.com/andrewngu/sound-redux) — A SoundCloud client built with Redux
* [grafgiti](https://github.com/mohebifar/grafgiti) — Create graffiti on your GitHub contributions wall
* [React-lego](https://github.com/peter-mouland/react-lego) — How to plug into React, one block at a time.

* [官方示例](Examples.md) — 涵盖Redux技术不同方面的官方示例
* [SoundRedux](https://github.com/andrewngu/sound-redux) — 基于Redux构建的SoundCloud客户端
* [涂鸦](https://github.com/mohebifar/grafgiti) — 在你的Github贡献墙上创建涂鸦
* [React乐高](https://github.com/peter-mouland/react-lego) — 如何一个一个模块搭建React。

### 教程和文章（Tutorials and Articles）

* [Redux教程（Redux Tutorial）](https://github.com/happypoulp/redux-tutorial)
* [Egghead Redux课程笔记（Redux Egghead Course Notes）](https://github.com/tayiorbeii/egghead.io_redux_course_notes)
* [在React Native中集成数据（Integrating Data with React Native）](http://makeitopen.com/tutorials/building-the-f8-app/data/)
* [还在用Flux？！一起来用Redux吧。（What the Flux?! Let's Redux.）](https://blog.andyet.com/2015/08/06/what-the-flux-lets-redux)
* [React进阶：Redux（Leveling Up with React: Redux）](https://css-tricks.com/learning-react-redux/)
* [卡通版Redux介绍（A cartoon intro to Redux）](https://code-cartoons.com/a-cartoon-intro-to-redux-3afb775501a6)
* [理解Redux（Understanding Redux）](http://www.youhavetolearncomputers.com/blog/2015/9/15/a-conceptual-overview-of-redux-or-how-i-fell-in-love-with-a-javascript-state-container)
* [手把手创建Redux同构应用（Handcrafting an Isomorphic Redux Application (With Love)）](https://medium.com/@bananaoomarang/handcrafting-an-isomorphic-redux-application-with-love-40ada4468af4)
* [全栈Redux教程（Full-Stack Redux Tutorial）](http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html)
* [React、Redux和Immutable入门（Getting Started with React, Redux, and Immutable）](http://www.theodo.fr/blog/2016/03/getting-started-with-react-redux-and-immutable-a-test-driven-tutorial-part-2/)
* [使用JWT授权加固你的React/Redux应用（Secure Your React and Redux App with JWT Authentication）](https://auth0.com/blog/2016/01/04/secure-your-react-and-redux-app-with-jwt-authentication/)
* [理解Redux中间件（Understanding Redux Middleware）](https://medium.com/@meagle/understanding-87566abcfb7a)
* [Angular 2 - Redux简介（Angular 2 — Introduction to Redux）](https://medium.com/google-developer-experts/angular-2-introduction-to-redux-1cf18af27e6e)
* [Apollo客户端：GraphQL和React、Redux（Apollo Client: GraphQL with React and Redux）](https://medium.com/apollo-stack/apollo-client-graphql-with-react-and-redux-49b35d0f2641)
* [使用redux-saga简化不断增长的React Native代码（Using redux-saga To Simplify Your Growing React Native Codebase）](https://shift.infinite.red/using-redux-saga-to-simplify-your-growing-react-native-codebase-2b8036f650de)
* [使用Redux Saga构建照片墙（Build an Image Gallery Using Redux Saga）](http://joelhooks.com/blog/2016/03/20/build-an-image-gallery-using-redux-saga)
* [使用VK API（Working with VK API (in Russian)）](https://www.gitbook.com/book/maxfarseer/redux-course-ru/details)

### 演讲（Talks）

* [Live React: Hot Reloading and Time Travel](http://youtube.com/watch?v=xsSnOQynTHs) — See how constraints enforced by Redux make hot reloading with time travel easy
* [Cleaning the Tar: Using React within the Firefox Developer Tools](https://www.youtube.com/watch?v=qUlRpybs7_c) — Learn how to gradually migrate existing MVC applications to Redux
* [Redux: Simplifying Application State](https://www.youtube.com/watch?v=okdC5gcD-dM) — An intro to Redux architecture

* [实时React：热加载和时间旅行](http://youtube.com/watch?v=xsSnOQynTHs) — 看看在Redux的强约束之下热加载和时间旅行会变得多么容易
* [清理Tar：在Firefox开发者工具中使用React](https://www.youtube.com/watch?v=qUlRpybs7_c) — 学习如何将现存的MVC应用逐步迁移到Redux
* [Redux：简化App状态管理](https://www.youtube.com/watch?v=okdC5gcD-dM) — Redux架构简介

## Redux使用（Using Redux）

### 绑定（Bindings）

* [react-redux](https://github.com/gaearon/react-redux) — React
* [ng-redux](https://github.com/wbuchwalter/ng-redux) — Angular
* [ng2-redux](https://github.com/wbuchwalter/ng2-redux) — Angular 2
* [backbone-redux](https://github.com/redbooth/backbone-redux) — Backbone
* [redux-falcor](https://github.com/ekosz/redux-falcor) — Falcor
* [deku-redux](https://github.com/troch/deku-redux) — Deku
* [polymer-redux](https://github.com/tur-nr/polymer-redux) - Polymer
* [ember-redux](https://github.com/toranb/ember-redux) - Ember.js

### 中间件（Middleware）

* [redux-thunk](http://github.com/gaearon/redux-thunk) — 编写异步Action最简单的方式（The easiest way to write async action creators）
* [redux-promise](https://github.com/acdlite/redux-promise) — 符合FSA规范的Promise中间件（[FSA](https://github.com/acdlite/flux-standard-action)-compliant promise middleware）
* [redux-axios-middleware](https://github.com/svrcekmichal/redux-axios-middleware) — 使用axios HTTP客户端获取数据的Redux中间件（Redux middleware for fetching data with axios HTTP client）
* [redux-observable](https://github.com/redux-observable/redux-observable/) — RxJS中间件（RxJS middleware for action side effects using "Epics"）
* [redux-logger](https://github.com/fcomb/redux-logger) — 记录Redux中每一个Action和State日志（Log every Redux action and the next state）
* [redux-immutable-state-invariant](https://github.com/leoasis/redux-immutable-state-invariant) — 在开发过程中预警状态突变（Warns about state mutations in development）
* [redux-unhandled-action](https://github.com/socialtables/redux-unhandled-action) — 在开发过程中预警不产生状态变化的Action（Warns about actions that produced no state changes in development）
* [redux-analytics](https://github.com/markdalgleish/redux-analytics) — Redux统计中间件（Analytics middleware for Redux）
* [redux-gen](https://github.com/weo-edu/redux-gen) — Redux生成器中间件（Generator middleware for Redux）
* [redux-saga](https://github.com/yelouafi/redux-saga) — Redux应用中一个可替代的副作用模型（An alternative side effect model for Redux apps）
* [redux-action-tree](https://github.com/cerebral/redux-action-tree) — Redux中组合位Cerebral形式的信号（Composable Cerebral-style signals for Redux）
* [apollo-client](https://github.com/apollostack/apollo-client) — 在Redux中使用的为GraphQL和UI框架使用的缓存客户端（A simple caching client for any GraphQL server and UI framework built on top of Redux）

### 路由（Routing）

* [react-router-redux](https://github.com/reactjs/react-router-redux) — 同步绑定React Router和Redux（Ruthlessly simple bindings to keep React Router and Redux in sync）
* [redial](https://github.com/markdalgleish/redial) — 使React和Redux合作顺畅的同意数据获取和路由生命周期管理（Universal data fetching and route lifecycle management for React that works great with Redux）

### 组件（Components）

* [redux-form](https://github.com/erikras/redux-form) — 在Redux中保持React表单状态（Keep React form state in Redux）
* [react-redux-form](https://github.com/davidkpiano/react-redux-form) — 在使用Redux的React中简化表单创建（Create forms easily in React with Redux）

### 功能增强（Enhancers）

* [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) — 自定义批处理Store订阅者（Customize batching and debouncing calls to the store subscribers）
* [redux-history-transitions](https://github.com/johanneslumpe/redux-history-transitions) — 基于Action的历史记录过渡（History transitions based on arbitrary actions）
* [redux-optimist](https://github.com/ForbesLindesay/redux-optimist) — 乐观的Action应用，允许延后提交或者撤销（Optimistically apply actions that can be later committed or reverted）
* [redux-optimistic-ui](https://github.com/mattkrick/redux-optimistic-ui) — Reducer增强，用于不可知状态的乐观更新（A reducer enhancer to enable type-agnostic optimistic updates）
* [redux-undo](https://github.com/omnidan/redux-undo) — 无副作用的Undo/Redo Action历史（Effortless undo/redo and action history for your reducers）
* [redux-ignore](https://github.com/omnidan/redux-ignore) — 忽略数据和过滤方法的Redux Action调用（Ignore redux actions by array or filter function）
* [redux-recycle](https://github.com/omnidan/redux-recycle) — 重置确定Action的Redux状态（Reset the redux state on certain actions）
* [redux-batched-actions](https://github.com/tshelburne/redux-batched-actions) — 使用单个订阅者通知派发若干个Action（Dispatch several actions with a single subscriber notification）
* [redux-search](https://github.com/treasure-data/redux-search) — 在Webwork中自动索引资源，并且进行不阻塞的搜索（Automatically index resources in a web worker and search them without blocking）
* [redux-electron-store](https://github.com/samiskin/redux-electron-store) — 跨Electron进程同步Redux Store（Store enhancers that synchronize Redux stores across Electron processes）
* [redux-loop](https://github.com/raisemarketplace/redux-loop) — 序列化Reducer的返回结果（Sequence effects purely and naturally by returning them from your reducers）
* [redux-side-effects](https://github.com/salsita/redux-side-effects) — Side-Effects生成工具（Utilize Generators for declarative yielding of side effects from your pure reducers）

### 工具（Utilities）

* [reselect](https://github.com/faassen/reselect) — 灵感源自NuclearJS的数据选择器（Efficient derived data selectors inspired by NuclearJS）
* [normalizr](https://github.com/paularmstrong/normalizr) — 规范化API嵌套数据响应（Normalize nested API responses for easier consumption by the reducers）
* [redux-actions](https://github.com/acdlite/redux-actions) — Reducer和Action脚手架（Reduces the boilerplate in writing reducers and action creators）
* [redux-act](https://github.com/pauldijou/redux-act) — 规范化使用Reducer和Action的约束库（An opinionated library for making reducers and action creators）
* [redux-transducers](https://github.com/acdlite/redux-transducers) — Redux转换器工具（Transducer utilities for Redux）
* [redux-immutable](https://github.com/gajus/redux-immutable) — 用于Immutable.js的`combineReducers`等效方法（Used to create an equivalent function of Redux `combineReducers` that works with [Immutable.js](https://facebook.github.io/immutable-js/) state.）
* [redux-tcomb](https://github.com/gcanti/redux-tcomb) — Redux状态和行为不可变和类型检查工具（Immutable and type-checked state and actions for Redux）
* [redux-mock-store](https://github.com/arnaudbenard/redux-mock-store) — App测试时的Store Mock工具（Mock redux store for testing your app）
* [redux-actions-assertions](https://github.com/dmitry-zaets/redux-actions-assertions) — Redux Action测试断言工具（Assertions for Redux actions testing）
* [redux-bootstrap](https://github.com/remojansen/redux-bootstrap) — 封装的Redux应用启动方法（Bootstrapping function for Redux applications）

### 开发工具（DevTools）

* [Redux DevTools](http://github.com/gaearon/redux-devtools) — Action日志工具，用来记录时间旅行、热加载和错误处理（An action logger with time travel UI, hot reloading and error handling for the reducers, [first demoed at React Europe](https://www.youtube.com/watch?v=xsSnOQynTHs)）
* [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) — Redux Devtools的Chrome扩展，并提供了额外的功能（A Chrome extension wrapping Redux DevTools and providing additional functionality）

### 开发监视工具（DevTools Monitors）

* [Log Monitor](https://github.com/gaearon/redux-devtools-log-monitor) — Redux DevTools默认的树形视图查看工具（The default monitor for Redux DevTools with a tree view）
* [Dock Monitor](https://github.com/gaearon/redux-devtools-dock-monitor) — 一个可调整大小、可移动的Redux DevTools监视Dock（A resizable and movable dock for Redux DevTools monitors）
* [Slider Monitor](https://github.com/calesce/redux-slider-monitor) — 自定义Action监视（A custom monitor for Redux DevTools to replay recorded Redux actions）
* [Inspector](https://github.com/alexkuz/redux-devtools-inspector) — 检查器（A custom monitor for Redux DevTools that lets you filter actions, inspect diffs, and pin deep paths in the state to observe their changes）
* [Diff Monitor](https://github.com/whetstone/redux-devtools-diff-monitor) — Action之后State Diff监视（A monitor for Redux Devtools that diffs the Redux store mutations between actions）
* [Filterable Log Monitor](https://github.com/bvaughn/redux-devtools-filterable-log-monitor/) — 可过滤树形视图（Filterable tree view monitor for Redux DevTools）
* [Chart Monitor](https://github.com/romseguy/redux-devtools-chart-monitor) — Redux DevTools的图形化监视器（A chart monitor for Redux DevTools）
* [Filter Actions](https://github.com/zalmoxisus/redux-devtools-filter-actions) — 可过滤Action监视器（Redux DevTools composable monitor with the ability to filter actions）


### 社区规范（Community Conventions）

* [Flux Standard Action](https://github.com/acdlite/flux-standard-action) — 人类友好的Flux Action对象标准（A human-friendly standard for Flux action objects）
* [Canonical Reducer Composition](https://github.com/gajus/canonical-reducer-composition) — Reducer嵌套组件标准（An opinionated standard for nested reducer composition）
* [Ducks: Redux Reducer Bundles](https://github.com/erikras/ducks-modular-redux) — Reducer集合、Action类型和Action规范建议（A proposal for bundling reducers, action types and actions）

### 翻译（Translations）

* [中文文档](http://camsong.github.io/redux-in-chinese/) — Chinese
* [繁體中文文件](https://github.com/chentsulin/redux) — Traditional Chinese
* [Redux in Russian](https://github.com/rajdee/redux-in-russian) — Russian
* [Redux en Español](http://es.redux.js.org/) - Spanish

## 更多（More）

[Awesome Redux](https://github.com/xgrommx/awesome-redux) is an extensive list of Redux-related repositories.  
[React-Redux Links](https://github.com/markerikson/react-redux-links) is a curated list of high-quality articles, tutorials, and related content for React, Redux, ES6, and more.  
[Redux Ecosystem Links](https://github.com/markerikson/redux-ecosystem-links) is a categorized collection of Redux-related libraries, addons, and utilities.

[Awesome Redux](https://github.com/xgrommx/awesome-redux)是一个Redux相关资源库清单。  
[React-Redux Links](https://github.com/markerikson/react-redux-links)是一个包含React、Redux、ES6等高质量文章、教程等相关内容的精选列表。  
[Redux Ecosystem Links](https://github.com/markerikson/redux-ecosystem-links) Redux相关库、插件和工具的分类列表。
