---
layout: post
title: React Native 12 - 入门：网络请求（Networking）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/network.html)

Many mobile apps need to load resources from a remote URL. You may want to make a POST request to a REST API, or you may simply need to fetch a chunk of static content from another server.

大多数的手机应用程序需要从远程URL加载资源，比如向REST API发送一个POST请求，或者简单的从服务器获取静态资源。

## 使用Fetch（Using Fetch）

React Native provides the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for your networking needs. Fetch will seem familiar if you have used `XMLHttpRequest` or other networking APIs before. You may refer to MDN's guide on [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) for additional information.

React Native为网络请求提供了[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)。Fetch和你之前使用过的`XMLHttpRequest`或其他网络请求API相似，可以参考MDN的[使用Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)指南获得更详细的信息。

#### 创建请求（Making requests）

In order to fetch content from an arbitrary URL, just pass the URL to fetch:

为了从指定的URL获取内容，只需要将其作为参数传入fetch函数即可：

```js
fetch('https://mywebsite.com/mydata.json')
```

Fetch also takes an optional second argument that allows you to customize the HTTP request. You may want to specify additional headers, or make a POST request:

Fetch提供了可选的第二个参数，来定制HTTP请求，可以如下指定附加的首部，或者创建一个POST请求：

```js
fetch('https://mywebsite.com/endpoint/', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'yourOtherValue',
  })
})
```

Take a look at the [Fetch Request docs](https://developer.mozilla.org/en-US/docs/Web/API/Request) for a full list of properties.

可以从[Fetch Request文档](https://developer.mozilla.org/en-US/docs/Web/API/Request)查看可用的属性列表。

#### 处理响应内容（Handling the response）

The above examples show how you can make a request. In many cases, you will want to do something with the response.

上面的例子中演示了如何发起一个请求。在大多数情况下，需要对响应内容进行处理。

Networking is an inherently asynchronous operation. Fetch methods will return a  [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that makes it straightforward to write code that works in an asynchronous manner:

网络请求本质上是一个异步操作。Fetch方法会返回一个[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)对象，简化异步代码的编写：

  ```js
  function getMoviesFromApiAsync() {
    return fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.movies;
      })
      .catch((error) => {
        console.error(error);
      });
  }
  ```

You can also use the proposed ES2017 `async`/`await` syntax in a React Native app:

也可以在React Native中使用ES2017中的`async/await`语法：

  ```js
  async function getMoviesFromApi() {
    try {
      let response = await fetch('https://facebook.github.io/react-native/movies.json');
      let responseJson = await response.json();
      return responseJson.movies;
    } catch(error) {
      console.error(error);
    }
  }
  ```

Don't forget to catch any errors that may be thrown by `fetch`, otherwise they will be dropped silently.

注意处理`fetch`抛出的错误，否则这些错误将会被静默抛弃。

```
import React, { Component } from 'react';
import { ActivityIndicator, ListView, Text, View } from 'react-native';

export default class Movies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    return fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.movies),
        }, function() {
          // do something with new state
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <Text>{rowData.title}, {rowData.releaseYear}</Text>}
        />
      </View>
    );
  }
}
```

> By default, iOS will block any request that's not encrypted using SSL. If you need to fetch from a cleartext URL (one that begins with `http`) you will first need to add an App Transport Security exception. If you know ahead of time what domains you will need access to, it is more secure to add exceptions just for those domains; if the domains are not known until runtime you can [disable ATS completely](https://facebook.github.io/react-native/docs/integration-with-existing-apps.html#app-transport-security). Note however that from January 2017, [Apple's App Store review will require reasonable justification for disabling ATS](https://forums.developer.apple.com/thread/48979). See [Apple's documentation](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW33) for more information.
>
> 默认情况下，iOS会组织非SSL加密的请求。如果从明文的URL获取信息（以`http`开头），需要首先添加App Transport Security异常。如果能确定要访问的域名的清单，只需要将这些域名添加到例外访问即可；如果不能确认访问的域名清单，可以[完全禁用ATS](https://facebook.github.io/react-native/docs/integration-with-existing-apps.html#app-transport-security)。需要注意的是从2017年1月份开始[Apple的App Store审核要求提供禁用ATS的明确理由](https://forums.developer.apple.com/thread/48979)。查看[Apple的文档](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW33)获取详细信息。


### 使用其他网络请求库（Using Other Networking Libraries）

The [XMLHttpRequest API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) is built in to React Native. This means that you can use third party libraries such as [frisbee](https://github.com/niftylettuce/frisbee) or [axios](https://github.com/mzabriskie/axios) that depend on it, or you can use the XMLHttpRequest API directly if you prefer.

React Native内部实现了[XMLHttpRequest API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)，所以可以直接使用[frisbee](https://github.com/niftylettuce/frisbee)和[axios](https://github.com/mzabriskie/axios)之类的第三方网络请求库，或者直接使用XMLHttpRequest API。

```js
var request = new XMLHttpRequest();
request.onreadystatechange = (e) => {
  if (request.readyState !== 4) {
    return;
  }

  if (request.status === 200) {
    console.log('success', request.responseText);
  } else {
    console.warn('error');
  }
};

request.open('GET', 'https://mywebsite.com/endpoint/');
request.send();
```

> The security model for XMLHttpRequest is different than on web as there is no concept of [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) in native apps.
>
> React Native中XMLHttpRequest的安全模型和Web浏览器不同，在原生应用中不存在[CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing)的概念。

## WebSocket支持（WebSocket Support）

React Native also supports [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket), a protocol which provides full-duplex communication channels over a single TCP connection.

React Native同时提供了[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)的支持，一种基于单个TCP链接上的全双工通信协议。

```js
var ws = new WebSocket('ws://host.com/path');

ws.onopen = () => {
  // connection opened
  ws.send('something'); // send a message
};

ws.onmessage = (e) => {
  // a message was received
  console.log(e.data);
};

ws.onerror = (e) => {
  // an error occurred
  console.log(e.message);
};

ws.onclose = (e) => {
  // connection closed
  console.log(e.code, e.reason);
};
```

## 击掌吧！（High Five!）

If you've gotten here by reading linearly through the tutorial, then you are a pretty impressive human being. Congratulations. Next, you might want to check out [all the cool stuff the community does with React Native](https://facebook.github.io/react-native/docs/more-resources.html).

至此，基础教程就要结束了，已经完成了初步的学习。恭喜恭喜！下一步，可以查看[React Native社区相关的所有优秀项目](https://facebook.github.io/react-native/docs/more-resources.html)计划进一步的学习。
