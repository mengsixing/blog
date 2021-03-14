# JS Bridge 总结

JS Bridge 是构建 Native 和非 Native 间 `双向通信的通道`，本文主要介绍 JS Bridge 的通信策略。

- Js -> Native
- Native -> Js

![jsBridge示意图](/blog/js-jsBridge-core.png)

## Js -> Native

JavaScript 调用 Native 的方式，主要有两种：注入 API 和 拦截 URL SCHEME。

### 注入 API

注入 API 方式的主要原理是，通过 WebView 提供的接口，向 JavaScript 的 Context（window）中注入对象或者方法，让 JavaScript 调用时，直接执行相应的 Native 代码逻辑，达到 JavaScript 调用 Native 的目的。

使用 Native 方式注入后，直接调用：

```js
window.nativeAPI.xxx(message);
```

### 拦截 URL SCHEME

拦截 URL SCHEME 的主要流程是：Web 端通过某种方式（例如 iframe.src）发送 URL Scheme 请求，之后 Native 拦截到请求并根据 URL SCHEME（包括所带的参数）进行相关操作。

![jsBridge示意图](/blog/js-jsBridge-detail.png)

优缺点：

- 兼容性好。
- 使用 iframe.src 发送 URL SCHEME 会有 url 长度的隐患。

## Native -> Js

Native 调用 JS 比较简单，只要 H5 端将 JS 方法暴露在 Window 上给 Native 调用即可。

## 简单实现

```js
(function () {
    var id = 0;
    var callbacks = {};

    window.JSBridge = {
        // 调用 Native
        invoke: function(bridgeName, callback, data) {
            // 判断环境，获取不同的 nativeBridge
            var thisId = id ++; // 获取唯一 id
            callbacks[thisId] = callback; // 存储 Callback
            nativeAPI.postMessage({
                bridgeName: bridgeName,
                data: data || {},
                callbackId: thisId // 传到 Native 端
            });
        },
        receiveMessage: function(msg) {
            var bridgeName = msg.bridgeName,
                data = msg.data || {},
                callbackId = msg.callbackId; // Native 将 callbackId 原封不动传回

            if (callbackId) {
                if (callbacks[callbackId]) { // 找到相应句柄
                    callbacks[callbackId](msg.data); // 执行调用
                }
            }
        }
    };
})();
```

### 参考链接

- [jsBridge 原理](https://juejin.im/post/5abca877f265da238155b6bc)
- [](https://www.zoo.team/article/jsbridge)
