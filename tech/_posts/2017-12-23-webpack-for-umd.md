---
layout: post
title: WebPack中UMD输出的配置细节
tags: 技术 原创
---

上周在做一个公用代码，计划导出为umd的格式，以同时支持`import`、`require`和`<script>`直接引用。

为了方便后续的演示，假设要处理的源代码如下：
```javascript
export default {
    name: 'hello umd',
};
```

webpack是一个简单好用的工具，简单配置了一下，便开始编译。初始的核心配置如下：
```javascript
const config = {
    entry: './src/index.js',

    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: "friendly",
        libraryTarget: "umd"
    }
};
```

只需要在output选项中指定输出的目标是“umd”格式，同时为`<script>`的引用格式指定一个全局访问的变量名（上面的配置中是`friendly`）。

执行打包命令之后，代码会被umd的代码生命封装，如下所示：

```javascript
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["friendly"] = factory();
	else
		root["friendly"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
	// 模块代码
});
```

上面的代码中，第一个if兼容commonjs2，第二个if兼容amd，第三个兼容commonjs，第四个是普通的导出到全局变量window。

代码如此简单，代码也不存在什么问题，但上面的配置是存在问题的。如果不存在问题，也就没有本文了。将导出生成的使用的时候，出现了问题，`<script>`引用之后，在浏览器中的输出（删除了不必要的代码）如下：

```javascript
console.log(friendly);

{
	__esModule: true
	default: {
    	name: "hello umd"
    }
}
```

多了一层default，同事使用的时候就必须用`friendly.default`的写法，好丑陋，不能这样做。便想办法去掉。

逐个测试webpack文档中相关的属性，终于找到一个属性是：
```javascript
libraryExport: "default"
```

加上这行配置，测试一下，通了。在浏览器中的输出结果为：

```javascript
console.log(friendly);
{ name: "hello umd" }
```

原因是，在上述源码的工厂函数中导出增加了`["default"]`属性读取。

测试了一下基于babel的import语法引用也正常，原因跟webpack的封装中对`default`的处理相关。

## Todo
测试加上这行代码后，AMD、CommonJS、import等的变化。目前上面的结论仅在`script`的普通引用和基于babel+webpack的import引用中测试通过。



## 参考
1. [输出(Output)](https://doc.webpack-china.org/configuration/output/)