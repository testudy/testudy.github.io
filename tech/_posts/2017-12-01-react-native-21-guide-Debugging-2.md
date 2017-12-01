---
layout: post
title: React Native 21 - 指南：调试2（Debugging 2——Debugging in Ejected Apps）
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/debugging.html#debugging-in-ejected-apps)


> ### 仅限于嵌入到原生代码中的项目（Projects with Native Code Only）
> 
> The remainder of this guide only applies to projects made with <code>react-native init</code>
> or to those made with Create React Native App which have since ejected. For
> more information about ejecting, please see
> the <a href="https://github.com/react-community/create-react-native-app/blob/master/EJECTING.md" target="_blank">guide</a> on
> the Create React Native App repository.
>
> 本指南仅适用于`react-native init`创建的项目，或者执行过eject操作，由Create React Native App创建的项目，详见[指南](https://github.com/react-community/create-react-native-app/blob/master/EJECTING.md)。


## 访问控制台日志（Accessing console logs）

You can display the console logs for an iOS or Android app by using the following commands in a terminal while the app is running:

当App运行时，可以使用下面iOS或Android对应的命令来显示日志：

```
$ react-native log-ios
$ react-native log-android
```

You may also access these through `Debug → Open System Log...` in the iOS Simulator or by running `adb logcat *:S ReactNative:V ReactNativeJS:V` in a terminal while an Android app is running on a device or emulator.

也可以通过在iOS 模拟器中打开`Debug → Open System Log...`，或在终端中执行`adb logcat *:S ReactNative:V ReactNativeJS:V`来查看Android设备或模拟器上App运行的日志。

> If you're using Create React Native App, console logs already appear in the same terminal output as the packager.
>
> 如果是用Create React Native App创建的项目，日志会直接打印在打包器服务运行的终端中。

## 在Chrome开发者工具中调试设备（Debugging on a device with Chrome Developer Tools）

> If you're using Create React Native App, this is configured for you already.
>
> 如果是用Create React Native App创建的项目，下面的配置已经完成了。

On iOS devices, open the file [`RCTWebSocketExecutor.m`](https://github.com/facebook/react-native/blob/master/Libraries/WebSocket/RCTWebSocketExecutor.m) and change "localhost" to the IP address of your computer, then select "Debug JS Remotely" from the Developer Menu.

在iOS设备中，打开[`RCTWebSocketExecutor.m`](https://github.com/facebook/react-native/blob/master/Libraries/WebSocket/RCTWebSocketExecutor.m)，将“localhost”修改为本地的IP地址，然后在开发者菜单中选择“Debug JS Remotely”。

On Android 5.0+ devices connected via USB, you can use the [`adb` command line tool](http://developer.android.com/tools/help/adb.html) to setup port forwarding from the device to your computer:

在Android 5.0以上的设备中，连接USB后可以使用[`adb` command line tool](http://developer.android.com/tools/help/adb.html)来设置设备和电脑端口的映射。

`adb reverse tcp:8081 tcp:8081`

Alternatively, select "Dev Settings" from the Developer Menu, then update the "Debug server host for device" setting to match the IP address of your computer.

或者，在开发者菜单中打开“开发配置”，将“Debug server host for device”设置为电脑IP地址。

> If you run into any issues, it may be possible that one of your Chrome extensions is interacting in unexpected ways with the debugger. Try disabling all of your extensions and re-enabling them one-by-one until you find the problematic extension.
>
> 但还是有可能会出现其他的问题，这有可能是Chrome插件造成的。可以尝试禁用所有的插件后，再逐个启用来确定是哪个插件造成的影响。

### 在Android上使用[Stetho](http://facebook.github.io/stetho/)调试（Debugging with [Stetho](http://facebook.github.io/stetho/) on Android）

1. In ```android/app/build.gradle```, add these lines in the `dependencies` section:

   在```android/app/build.gradle```中，添加下列依赖：

   ```gradle
   compile 'com.facebook.stetho:stetho:1.3.1'
   compile 'com.facebook.stetho:stetho-okhttp3:1.3.1'
   ```

2. In ```android/app/src/main/java/com/{yourAppName}/MainApplication.java```, add the following imports:

   在```android/app/src/main/java/com/{yourAppName}/MainApplication.java```中，添加下列引用：

   ```java
   import com.facebook.react.modules.network.ReactCookieJarContainer;
   import com.facebook.stetho.Stetho;
   import okhttp3.OkHttpClient;
   import com.facebook.react.modules.network.OkHttpClientProvider;
   import com.facebook.stetho.okhttp3.StethoInterceptor;
   import java.util.concurrent.TimeUnit;
   ```

3. In ```android/app/src/main/java/com/{yourAppName}/MainApplication.java``` add the function:

   在```android/app/src/main/java/com/{yourAppName}/MainApplication.java```中，添加下列方法：

   ```java
   public void onCreate() {
         super.onCreate();
         Stetho.initializeWithDefaults(this);
         OkHttpClient client = new OkHttpClient.Builder()
         .connectTimeout(0, TimeUnit.MILLISECONDS)
         .readTimeout(0, TimeUnit.MILLISECONDS)
         .writeTimeout(0, TimeUnit.MILLISECONDS)
         .cookieJar(new ReactCookieJarContainer())
         .addNetworkInterceptor(new StethoInterceptor())
         .build();
         OkHttpClientProvider.replaceOkHttpClient(client);
   }
   ```

4. Run  ```react-native run-android ```

   执行```react-native run-android ```

5. In a new Chrome tab, open: ```chrome://inspect```, then click on 'Inspect device' (the one followed by "Powered by Stetho").

   在Chrome中打开一个新的选项卡，输入```chrome://inspect```，然后点击“Inspect device”（后面跟着“Powered by Stetho”）。

## 调试本地代码（Debugging native code）

When working with native code, such as when writing native modules, you can launch the app from Android Studio or Xcode and take advantage of the native debugging features (setting up breakpoints, etc.) as you would in case of building a standard native app.

使用本地代码时，比如编写本地模块，从Android Studio或Xcode中运行App，直接使用本地代码的标准调试方式（比如设置断点等）即可。
