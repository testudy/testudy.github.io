---
layout: post
title: 基于React的WebApp程序开发编码规范（试用版）
tags: 原创 技术 规范 React
---

使用WebApp的方式开发，主要解决两个问题：

1. 用户端体验的问题；  

    > 虽然有很多方法（比如Pjax）可以将网页的性能全面提高，但随着程序对页面控制要求的不断提高，最终呈现的结果是WebApp。

2. 前端和后端工程师并行开发解耦的问题。

无规矩不成方圆，基于React的WebApp开发会给前端同事带来更多、更复杂的工作量，涉及到大家的协同开发，就需要引入一定的规范，以指导大家的交付具备基本的一致性，进而提升代码的质量。

最好的团队产出是团队成员彼此之间的产出无差异，为了最终达到这个目标，适当的引入工具，以强制规范的执行。

> ## 规范和工具的关系
> 规范是本，工具是末。不能因为引入工具而引入大家开发的复杂性，工具只是为了将重复的工作自动化，提高生产效率（效率包含时间和质量两部分，规范的执行也是一种质量）而已。

基于React的WebApp开发，为了减少规范执行的复杂性，在初期主要引入以下规范：

1. [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript/blob/master/README.md)；
2. [Airbnb JavaScript Style Guide（翻译）](https://github.com/jigsawye/javascript)；
3. [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/blob/master/react/README.md)；
4. [Airbnb React/JSX Style Guide（翻译）](https://github.com/JasonBoy/javascript/blob/master/react/README.md)；
5. [Airbnb CSS-in-JavaScript Style Guide](https://github.com/airbnb/javascript/blob/master/css-in-javascript/README.md)；
6. [Airbnb CSS / Sass Styleguide](https://github.com/airbnb/css)；
7. [Airbnb CSS / Sass Styleguide（翻译）](https://github.com/Zhangjd/css-style-guide)；

分别用来规范JS（包含JSX）、CSS（包含Less）的问题。

> Airbnb的规范足够通用，翻译也足够优秀，暂时直接引用。后续再进一步翻译和整理。  
> 建议以英文为主，中文翻译为辅（总难免翻译和原文不同步的问题）。

## 基于Airbnb规范的ESLint配置调整
```json
"eslintConfig": {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "globals": {
    "window": false,
    "document": false
  },
  "rules": {
    "indent": ["error", 4],
    "react/jsx-indent": [2, 4],
    "react/jsx-indent-props": [2, 4]
  }
},
```

## 脚手架
在[create-react-app](https://github.com/facebookincubator/create-react-app/)简单调整的初始版本[react-startup脚手架](https://github.com/testudy/react-startup)，调整细节：

1. 添加less的支持；
2. 修改本地代理的bug。

## 后续
更详细的文件目录、组件开发等问题的规范，在初期来不及了，后续详细约束。

## 业界编码规范参考
1. [Google Style Guides](https://github.com/google/styleguide)；
2. [Facebook's Pfff](https://github.com/facebook/pfff/wiki/Main)；
3. [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)；
4. [Airbnb CSS / Sass Styleguide](https://github.com/airbnb/css)；
5. [Microsoft](https://www.amazon.com/Microsoft-Manual-Style-4th-Corporation/dp/0735648719/)；
6. [Webkit Code Style Guidelines](https://webkit.org/code-style-guidelines/)；
