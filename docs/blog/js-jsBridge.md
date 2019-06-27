# JS Bridge 总结

构建 Native 和非 Native 间消息通信的通道，而且是 `双向通信的通道`。

![jsBridge示意图](/blog/js-jsBridge-core.png)

## Js -> Native

JavaScript 调用 Native 的方式，主要有两种：注入 API 和 拦截 URL SCHEME。

### 注入 API

注入 API 方式的主要原理是，通过 WebView 提供的接口，向 JavaScript 的 Context（window）中注入对象或者方法，让 JavaScript 调用时，直接执行相应的 Native 代码逻辑，达到 JavaScript 调用 Native 的目的。

使用 Native 方式注入后，直接调用：

```js
window.postBridgeMessage(message);
```

### 拦截 URL SCHEME

拦截 URL SCHEME 的主要流程是：Web 端通过某种方式（例如 iframe.src）发送 URL Scheme 请求，之后 Native 拦截到请求并根据 URL SCHEME（包括所带的参数）进行相关操作。

![jsBridge示意图](/blog/js-jsBridge-detail.png)

优缺点：

- 兼容性好。

- 使用 iframe.src 发送 URL SCHEME 会有 url 长度的隐患。

## Native -> Js

Native 调用 JavaScript，其实就是执行拼接 JavaScript 字符串，从外部调用 JavaScript 中的方法，因此 JavaScript 的方法必须在全局的 window 上。

## 简单实现

```js
(function () {
    var id = 0,
        callbacks = {};

    window.JSBridge = {
        // 调用 Native
        invoke: function(bridgeName, callback, data) {
            // 判断环境，获取不同的 nativeBridge
            var thisId = id ++; // 获取唯一 id
            callbacks[thisId] = callback; // 存储 Callback
            nativeBridge.postMessage({
                bridgeName: bridgeName,
                data: data || {},
                callbackId: thisId // 传到 Native 端
            });
        },
        receiveMessage: function(msg) {
            var bridgeName = msg.bridgeName,
                data = msg.data || {},
                callbackId = msg.callbackId; // Native 将 callbackId 原封不动传回
            // 具体逻辑
            // bridgeName 和 callbackId 不会同时存在
            if (callbackId) {
                if (callbacks[callbackId]) { // 找到相应句柄
                    callbacks[callbackId](msg.data); // 执行调用
                }
            } elseif (bridgeName) {

            }
        }
    };
})();
```

### 参考链接

[jsBridge 原理](https://juejin.im/post/5abca877f265da238155b6bc)
