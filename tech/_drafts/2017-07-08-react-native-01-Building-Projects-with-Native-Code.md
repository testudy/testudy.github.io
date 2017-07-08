---
layout: post
title: React Native 1 - Building Projects with Native Code
tags: 原创 技术 翻译 React-Native
---

[原文](https://facebook.github.io/react-native/docs/getting-started.html)


<block class="native mac windows linux ios android" />

<p>Follow these instructions if you need to build native code in your project. For example, if you are integrating React Native into an existing application, or if you "ejected" from <a href="docs/getting-started.html" onclick="displayTab('guide', 'quickstart')">Create React Native App</a>, you'll need this section.</p>

The instructions are a bit different depending on your development operating system, and whether you want to start developing for iOS or Android. If you want to develop for both iOS and Android, that's fine - you just have to pick
one to start with, since the setup is a bit different.

<div class="toggler">
  <span>Development OS:</span>
  <a href="javascript:void(0);" class="button-mac" onclick="displayTab('os', 'mac')">macOS</a>
  <a href="javascript:void(0);" class="button-windows" onclick="displayTab('os', 'windows')">Windows</a>
  <a href="javascript:void(0);" class="button-linux" onclick="displayTab('os', 'linux')">Linux</a>
  <span>Target OS:</span>
  <a href="javascript:void(0);" class="button-ios" onclick="displayTab('platform', 'ios')">iOS</a>
  <a href="javascript:void(0);" class="button-android" onclick="displayTab('platform', 'android')">Android</a>
</div>

<block class="native linux windows ios" />

## Unsupported

<blockquote><p>A Mac is required to build projects with native code for iOS. You can follow the <a href="docs/getting-started.html" onclick="displayTab('guide', 'quickstart')">Quick Start</a> to learn how to build your app using Create React Native App instead.</p></blockquote>

<block class="native mac ios" />

## Installing dependencies

You will need Node, Watchman, the React Native command line interface, and Xcode.

While you can use any editor of your choice to develop your app, you will need to install Xcode in order to set up the necessary tooling to build your React Native app for iOS.

<block class="native mac android" />

## Installing dependencies

You will need Node, Watchman, the React Native command line interface, a JDK, and Android Studio.

<block class="native linux android" />

## Installing dependencies

You will need Node, the React Native command line interface, a JDK, and Android Studio.

<block class="native windows android" />

## Installing dependencies

You will need Node, the React Native command line interface, Python2, a JDK, and Android Studio.

<block class="native mac windows linux android" />

While you can use any editor of your choice to develop your app, you will need to install Android Studio in order to set up the necessary tooling to build your React Native app for Android.

<block class="native mac ios android" />

### Node, Watchman

We recommend installing Node and Watchman using [Homebrew](http://brew.sh/). Run the following commands in a Terminal after installing Homebrew:

```
brew install node
brew install watchman
```

If you have already installed Node on your system, make sure it is version 4 or newer.

[Watchman](https://facebook.github.io/watchman) is a tool by Facebook for watching changes in the filesystem. It is highly recommended you install it for better performance.

<block class="native linux android" />

### Node

Follow the [installation instructions for your Linux distribution](https://nodejs.org/en/download/package-manager/) to install Node 6 or newer.

<block class='native windows android' />

### Node, Python2, JDK

We recommend installing Node and Python2 via [Chocolatey](https://chocolatey.org), a popular package manager for Windows.

React Native also requires a recent version of the [Java SE Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), as well as Python 2. Both can be installed using Chocolatey.

Open an Administrator Command Prompt (right click Command Prompt and select "Run as Administrator"), then run the following command:

```powershell
choco install -y nodejs.install python2 jdk8
```

If you have already installed Node on your system, make sure it is version 4 or newer. If you already have a JDK on your system, make sure it is version 8 or newer.

> You can find additional installation options on [Node's Downloads page](https://nodejs.org/en/download/).

<block class="native mac ios android" />

### The React Native CLI

Node comes with npm, which lets you install the React Native command line interface.

Run the following command in a Terminal:

```
npm install -g react-native-cli
```

> If you get an error like `Cannot find module 'npmlog'`, try installing npm directly: `curl -0 -L https://npmjs.org/install.sh | sudo sh`.

<block class="native windows linux android" />

### The React Native CLI

Node comes with npm, which lets you install the React Native command line interface.

Run the following command in a Command Prompt or shell:

```powershell
npm install -g react-native-cli
```

> If you get an error like `Cannot find module 'npmlog'`, try installing npm directly: `curl -0 -L https://npmjs.org/install.sh | sudo sh`.

<block class="native mac ios" />

### Xcode

The easiest way to install Xcode is via the [Mac App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12). Installing Xcode will also install the iOS Simulator and all the necessary tools to build your iOS app.

If you have already installed Xcode on your system, make sure it is version 8 or higher.

#### Command Line Tools

You will also need to install the Xcode Command Line Tools. Open Xcode, then choose "Preferences..." from the Xcode menu. Go to the Locations panel and install the tools by selecting the most recent version in the Command Line Tools dropdown.

![Xcode Command Line Tools](img/XcodeCommandLineTools.png)

<block class="native mac linux android" />

### Java Development Kit

React Native requires a recent version of the Java SE Development Kit (JDK). [Download and install JDK 8 or newer](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) if needed.

<block class="native mac linux windows android" />

### Android development environment

Setting up your development environment can be somewhat tedious if you're new to Android development. If you're already familiar with Android development, there are a few things you may need to configure. In either case, please make sure to carefully follow the next few steps.

<block class="native mac windows linux android" />

#### 1. Install Android Studio

[Download and install Android Studio](https://developer.android.com/studio/index.html). Choose a "Custom" setup when prompted to select an installation type. Make sure the boxes next to all of the following are checked:

<block class="native mac windows android" />

- `Android SDK`
- `Android SDK Platform`
- `Performance (Intel ® HAXM)`
- `Android Virtual Device`

<block class="native linux android" />

- `Android SDK`
- `Android SDK Platform`
- `Android Virtual Device`

<block class="native mac windows linux android" />

Then, click "Next" to install all of these components.

> If the checkboxes are grayed out, you will have a chance to install these components later on.

Once setup has finalized and you're presented with the Welcome screen, proceed to the next step.

#### 2. Install the Android SDK

Android Studio installs the latest Android SDK by default. Building a React Native app with native code, however, requires the `Android 6.0 (Marshmallow)` SDK in particular. Additional Android SDKs can be installed through the SDK Manager in Android Studio.

The SDK Manager can be accessed from the "Welcome to Android Studio" screen. Click on "Configure", then select "SDK Manager".

<block class="native mac android" />

![Android Studio Welcome](img/AndroidStudioWelcomeMacOS.png)

<block class="native windows android" />

![Android Studio Welcome](img/AndroidStudioWelcomeWindows.png)

<block class="native mac windows linux android" />

> The SDK Manager can also be found within the Android Studio "Preferences" dialog, under **Appearance & Behavior** → **System Settings** → **Android SDK**.

Select the "SDK Platforms" tab from within the SDK Manager, then check the box next to "Show Package Details" in the bottom right corner. Look for and expand the `Android 6.0 (Marshmallow)` entry, then make sure the following items are all checked:

- `Google APIs`
- `Android SDK Platform 23`
- `Intel x86 Atom_64 System Image`
- `Google APIs Intel x86 Atom_64 System Image`

<block class="native mac android" />

![Android SDK Manager](img/AndroidSDKManagerMacOS.png)

<block class="native windows android" />

![Android SDK Manager](img/AndroidSDKManagerWindows.png)

<block class="native windows mac linux android" />

Next, select the "SDK Tools" tab and check the box next to "Show Package Details" here as well. Look for and expand the "Android SDK Build-Tools" entry, then make sure that `23.0.1` is selected.

<block class="native mac android" />

![Android SDK Manager - 23.0.1 Build Tools](img/AndroidSDKManagerSDKToolsMacOS.png)

<block class="native windows android" />

![Android SDK Manager - 23.0.1 Build Tools](img/AndroidSDKManagerSDKToolsWindows.png)

<block class="native windows mac linux android" />

Finally, click "Apply" to download and install the Android SDK and related build tools.

<block class="native mac android" />

![Android SDK Manager - Installs](img/AndroidSDKManagerInstallsMacOS.png)

<block class="native windows android" />

![Android SDK Manager - Installs](img/AndroidSDKManagerInstallsWindows.png)

<block class="native mac windows linux android" />

#### 3. Configure the ANDROID_HOME environment variable

The React Native tools require some environment variables to be set up in order to build apps with native code.

<block class="native mac linux android" />

Add the following lines to your `$HOME/.bash_profile` config file:

<block class="native mac android" />

```
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

<block class="native linux android" />

```
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

<block class="native mac linux android" />

> `.bash_profile` is specific to `bash`. If you're using another shell, you will need to edit the appropriate shell-specific config file.

Type `source $HOME/.bash_profile` to load the config into your current shell. Verify that ANDROID_HOME has been added to your path by running `echo $PATH`.

> Please make sure you use the correct Android SDK path. You can find the actual location of the SDK in the Android Studio "Preferences" dialog, under **Appearance & Behavior** → **System Settings** → **Android SDK**.

<block class="native windows android" />

Open the System pane under **System and Security** in the Control Panel, then click on **Change settings...**. Open the **Advanced** tab and click on **Environment Variables...**. Click on **New...** to create a new `ANDROID_HOME` user variable that points to the path to your Android SDK:

![ANDROID_HOME Environment Variable](img/AndroidEnvironmentVariableANDROID_HOME.png)

The SDK is installed, by default, at the following location:

```powershell
c:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
```

You can find the actual location of the SDK in the Android Studio "Preferences" dialog, under **Appearance & Behavior** → **System Settings** → **Android SDK**.

Open a new Command Prompt window to ensure the new environment variable is loaded before proceeding to the next step.

<block class="native linux android" />

### Watchman (optional)

Follow the [Watchman installation guide](https://facebook.github.io/watchman/docs/install.html#build-install) to compile and install Watchman from source.

> [Watchman](https://facebook.github.io/watchman/docs/install.html) is a tool by Facebook for watching
changes in the filesystem. It is highly recommended you install it for better performance, but it's alright to skip this if you find the process to be tedious.

<block class="native mac ios" />

## Creating a new application

Use the React Native command line interface to generate a new React Native project called "AwesomeProject":

```
react-native init AwesomeProject
```

This is not necessary if you are integrating React Native into an existing application, if you "ejected" from Create React Native App, or if you're adding iOS support to an existing React Native project (see [Platform Specific Code](docs/platform-specific-code.html)).

<block class="native mac windows linux android" />

## Creating a new application

Use the React Native command line interface to generate a new React Native project called "AwesomeProject":

```
react-native init AwesomeProject
```

This is not necessary if you are integrating React Native into an existing application, if you "ejected" from Create React Native App, or if you're adding Android support to an existing React Native project (see [Platform Specific Code](docs/platform-specific-code.html)).

<block class="native mac windows linux android" />

## Preparing the Android device

You will need an Android device to run your React Native Android app. This can be either a physical Android device, or more commonly, you can use an Android Virtual Device which allows you to emulate an Android device on your computer.

Either way, you will need to prepare the device to run Android apps for development.

### Using a physical device

If you have a physical Android device, you can use it for development in place of an AVD by plugging it in to your computer using a USB cable and following the instructions [here](docs/running-on-device.html).

### Using a virtual device

You can see the list of available Android Virtual Devices (AVDs) by opening the "AVD Manager" from within Android Studio. Look for an icon that looks like this:

![Android Studio AVD Manager](img/react-native-tools-avd.png)

If you have just installed Android Studio, you will likely need to [create a new AVD](https://developer.android.com/studio/run/managing-avds.html). Select "Create Virtual Device...", then pick any Phone from the list and click "Next".

<block class="native windows android" />

![Android Studio AVD Manager](img/CreateAVDWindows.png)

<block class="native mac android" />

![Android Studio AVD Manager](img/CreateAVDMacOS.png)

<block class="native mac windows linux android" />

Select the "x86 Images" tab, then look for the **Marshmallow** API Level 23, x86_64 ABI image with a Android 6.0 (Google APIs) target.

<block class="native linux android" />

> We recommend configuring [VM acceleration](https://developer.android.com/studio/run/emulator-acceleration.html#vm-linux) on your system to improve performance. Once you've followed those instructions, go back to the AVD Manager.

<block class="native windows android" />

![Install HAXM](img/CreateAVDx86Windows.png)

> If you don't have HAXM installed, click on "Install HAXM" or follow [these instructions](https://software.intel.com/en-us/android/articles/installation-instructions-for-intel-hardware-accelerated-execution-manager-windows) to set it up, then go back to the AVD Manager.

![AVD List](img/AVDManagerWindows.png)

<block class="native mac android" />

![Install HAXM](img/CreateAVDx86MacOS.png)

> If you don't have HAXM installed, follow [these instructions](https://software.intel.com/en-us/android/articles/installation-instructions-for-intel-hardware-accelerated-execution-manager-mac-os-x) to set it up, then go back to the AVD Manager.

![AVD List](img/AVDManagerMacOS.png)

<block class="native mac windows linux android" />

Click "Next" then "Finish" to create your AVD. At this point you should be able to click on the green triangle button next to your AVD to launch it, then proceed to the next step.

<block class="native mac ios" />

## Running your React Native application

Run `react-native run-ios` inside your React Native project folder:

```
cd AwesomeProject
react-native run-ios
```

You should see your new app running in the iOS Simulator shortly.

![AwesomeProject on iOS](img/iOSSuccess.png)

`react-native run-ios` is just one way to run your app. You can also run it directly from within Xcode or [Nuclide](https://nuclide.io/).

> If you can't get this to work, see the [Troubleshooting](docs/troubleshooting.html#content) page.

### Running on a device

The above command will automatically run your app on the iOS Simulator by default. If you want to run the app on an actual physical iOS device, please follow the instructions [here](docs/running-on-device.html).

<block class="native mac windows linux android" />

## Running your React Native application

Run `react-native run-android` inside your React Native project folder:

```
cd AwesomeProject
react-native run-android
```

If everything is set up correctly, you should see your new app running in your Android emulator shortly.

<block class="native mac android" />

![AwesomeProject on Android](img/AndroidSuccessMacOS.png)

<block class="native windows android" />

![AwesomeProject on Android](img/AndroidSuccessWindows.png)

<block class="native mac windows linux android" />

`react-native run-android` is just one way to run your app - you can also run it directly from within Android Studio or [Nuclide](https://nuclide.io/).

> If you can't get this to work, see the [Troubleshooting](docs/troubleshooting.html#content) page.

<block class="native mac ios android" />

### Modifying your app

Now that you have successfully run the app, let's modify it.

<block class="native mac ios" />

- Open `index.ios.js` in your text editor of choice and edit some lines.
- Hit `⌘R` in your iOS Simulator to reload the app and see your changes!

<block class="native mac android" />

- Open `index.android.js` in your text editor of choice and edit some lines.
- Press the `R` key twice or select `Reload` from the Developer Menu (`⌘M`) to see your changes!

<block class="native windows linux android" />

### Modifying your app

Now that you have successfully run the app, let's modify it.

- Open `index.android.js` in your text editor of choice and edit some lines.
- Press the `R` key twice or select `Reload` from the Developer Menu (`⌘M`) to see your changes!

<block class="native mac ios android" />

### That's it!

Congratulations! You've successfully run and modified your first React Native app.

<center><img src="img/react-native-congratulations.png" width="150"></img></center>

<block class="native windows linux android" />

### That's it!

Congratulations! You've successfully run and modified your first React Native app.

<center><img src="img/react-native-congratulations.png" width="150"></img></center>

<block class="native mac ios" />

## Now what?

- Turn on [Live Reload](docs/debugging.html#reloading-javascript) in the Developer Menu. Your app will now reload automatically whenever you save any changes!

- If you want to add this new React Native code to an existing application, check out the [Integration guide](docs/integration-with-existing-apps.html).

If you're curious to learn more about React Native, continue on
to the [Tutorial](docs/tutorial.html).

<block class="native windows linux mac android" />

## Now what?

- Turn on [Live Reload](docs/debugging.html#reloading-javascript) in the Developer Menu. Your app will now reload automatically whenever you save any changes!

- If you want to add this new React Native code to an existing application, check out the [Integration guide](docs/integration-with-existing-apps.html).

If you're curious to learn more about React Native, continue on
to the [Tutorial](docs/tutorial.html).
