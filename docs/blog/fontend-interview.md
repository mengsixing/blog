# 面试题

## 1、DOCTYPE 有什么用？

文档模式：混杂模式和标准模式，主要影响 css 内容的呈现，在某些情况下也会影响 js 的执行。不同浏览器的怪异模式差别非常大。

在 HTML 4.01 中，<!DOCTYPE> 声明引用 DTD，因为 HTML 4.01 基于 SGML。DTD 规定了标记语言的规则，这样浏览器才能正确地呈现内容。

HTML5 不基于 SGML，所以不需要引用 DTD。

## 请简述 JavaScript 中的 this

- 在调用函数时使用 new 关键字，函数内的 this 是一个全新的对象。
- 如果 apply、call 或 bind 方法用于调用、创建一个函数，函数内的 this 就是作为参数传入这些方法的对象。
- 当函数作为对象里的方法被调用时，函数内的 this 是调用该函数的对象。比如当 obj.method()被调用时，函数内的 this 将绑定到 obj 对象。
- 如果调用函数不符合上述规则，那么 this 的值指向全局对象（global object）。浏览器环境下 this 的值指向 window 对象，但是在严格模式下('use strict')，this 的值为 undefined。
- 如果符合上述多个规则，则较高的规则（1 号最高，4 号最低）将决定 this 的值。
- 如果该函数是 ES2015 中的箭头函数，将忽略上面的所有规则，this 被设置为它被创建时的上下文。

## 什么是可替换元素，什么是非替换元素，他们的差异是什么，并举例说明。

不可替换元素：其内容直接表现给浏览器。

例如：div 中的内容可以直接显示。

```html
<div>content</div>
```

替换元素：没有实际的内容，需根据元素的标签和属性，来决定元素的具体显示内容。

例如浏览器会根据 img 标签的 src 属性的值来读取图片信息并显示出来，这些元素往往没有实际的内容，即是一个空元素。

```html
<img src="xxx" alt="xxx" />
```

## offsetWidth，clientWidth，scrollWidth 的区别？

clientWidth：元素的 width + padding

offsetWidth：元素的 width + padding + border

scrollWidth：

- 内部元素小于外部元素，scrollWidth = clientWidth
- 内部元素大于外部元素，scrollWidth = 内部元素 offsetWidth + 外部 padding

[测试 offsetWidth，clientWidth，scrollWidth](https://codepen.io/yhlben/pen/WgowLz)

## CSS 选择器的优先级是什么？

id 选择器权重： 0100

类选择器，属性选择器，伪类选择器权重： 0010

元素选择器，伪元素选择器权重 0001

统配选择器 \*

受多个 css 规则影响时，会计算一个元素上的选择器权重，权重大的选择器优先。

## <toutiao.com> 向 <mp.toutiao.com> 发请求跨域吗？<mp.toutiao.com> 的服务器能接收到请求吗？是怎样的请求？

跨域，因为域名不同。

服务器端可以接收到请求。

![跨域后端获取到的请求](front-interview-cross-domain.png)

跨域请求，后端拿不到 cookie，x-requested-with，新增 referer 字段。

返回的都是 200 OK。

## 请解释 XSS 与 CSRF 分别是什么？两者有什么联系，如何防御？

[参考链接](fontend-security.html)

## 关乎 Javascript Bridge。

1、解释一下什么是 Javascript Bridge。

2、Javascript Bridge 的实现原理。

3、你所了解的 Javascript Bridge 通讯中的优化方案。

JSBridge 是一座用 JavaScript 搭建起来的桥，一端是 web，一端是 native。我们搭建这座桥的目的也很简单，让 native 可以调用 web 的 js 代码，让 web 可以 “调用” 原生的代码。请注意这个我加了 引号的调用，它并不是直接调用，而是可以根据 web 和 native 约定好的规则来通知 native 要做什么，native 可以更具这个来执行相应的代码。

![jsbridge原理](front-interview-jsbridge.png)

## TCP/UDP 是什么？

### TCP：

优点：可靠 稳定

TCP 的可靠体现在 TCP 在传输数据之前，会有三次握手来建立连接，而且在数据传递时，有确认. 窗口. 重传. 拥塞控制机制，在数据传完之后，还会断开来连接用来节约系统资源。

缺点：慢，效率低，占用系统资源高。

在传递数据之前要先建立连接，这会消耗时间，而且在数据传递时，确认机制. 重传机制. 拥塞机制等都会消耗大量时间，而且要在每台设备上维护所有的传输连接。然而，每个连接都会占用系统的 CPU，内存等硬件资源。

### UDP：

优点：快。

UDP 没有 TCP 拥有的各种机制，是一种无状态的传输协议，所以传输数据非常快，没有 TCP 的这些机制，被攻击利用的机会就少一些，但是也无法避免被攻击。

缺点：不可靠，不稳定。

因为没有 TCP 的这些机制，UDP 在传输数据时，如果网络质量不好，就会很容易丢包，造成数据的缺失。

## 如何处理高流量，高并发？

1、减少请求数（合并 js，css，图片等）。

2、减少资源大小（压缩，删掉无用代码）。

3、静态资源放 CDN。

4、过滤请求，使用本地缓存（缓存策略），减少服务器压力。

5、使用压力测试，测试单个服务器的最大 QPS，从而计算出后端多台服务器集群的抗压能力。

6、前端错误日志（监听 window.onerror 等）。

7、后端错误日志记录（process.on('uncaughtException')等）。

8、nginx 负载均衡。

9、后端守护进程（pm2），心跳检测。

10、Varnish，Stupid 后端缓存。

11、数据库读写分离。

## 反爬虫方案？

1、通过 User-Agent 来控制访问（可以被伪造）。

2、通过 IP 限制来反爬虫。（如果一个固定的 ip 在短暂的时间内，快速大量的访问一个网站，那自然会引起注意，管理员可以通过一些手段把这个 ip 给封了）。

3、通过 JS 脚本来防止爬虫。（如验证码，滑动解锁等）。

4、通过 robots.txt 来限制爬虫。（君子协议）。

## 随意给定一个无序的、不重复的数组 data，任意抽取 n 个数，相加和为 sum，也可能无解，请写出该函数。

```js
```

## 节流函数怎么写？

定义：触发函数事件后，短时间间隔内无法连续调用，只有上一次函数执行后，过了规定的时间间隔，才能进行下一次的函数调用。

```js
function throttle(callback, timeout) {
  var last = 0;
  return function(...rest) {
    var now = new Date();
    if (now - last > timeout) {
      callback.apply(this, rest);
      callback.throttleId = null;
      last = now;
    }
  };
}
```

## 防抖函数？

定义：多次触发事件后，事件处理函数只执行一次，并且是在触发操作结束时执行。

```js
function debounce(callback, timeout) {
  var id;
  return function() {
    clearInterval(id);
    id = setTimeout(() => {
      this.callback.apply(this, arguments);
    }, timeout);
  };
}
```

## arguments 是数组吗？怎么实现用它调用数组方法？类数组和数组的区别是什么？arguments 有 length 属性吗？ 为什么要遍历类数组取值组成数组，还有更简单的方法吗？

1、arguments 不是数组，但有 length 属性。

2、可以转换成数组，因为他有 Symbol(Symbol.iterator) 方法。

```js
[...arguments];
Array.prototype.slice.call(arguments);
Array.from(arguments);
```

3、类数组是一个对象，typeof 判断出来就不一致。
类数组无法使用数组方法。

## 手写一个 bind 函数。

```js
Function.prototype.bind = function(ctx) {
  var that = this;
  var NoFunc = function() {};
  var result = function(...rest) {
    console.warn("instade of :", this instanceof that);
    that.apply(this instanceof that ? this : that, rest);
  };
  NoFunc.prototype = that.prototype;
  result.prototype = new NoFunc();
  return result;
};
```

## promise、setTimeout、async/await 的执行顺序。

setTimeout 是宏任务。
promise 和 async/await 是微任务。

执行顺序：宏任务-》微任务-》宏任务

## 一个 div，高度是宽度的 50%，让该 div 的宽度占据整个屏幕，然后能自适应，垂直居中，怎么实现？

```css
body {
  display: flex;
  align-items: center;
  height: 100vh;
}

.item {
  padding-bottom: 50%;
  width: 100%;
}
```

## 用过 NodeJS 的 EventEmitter 模块吗，它是怎么实现功能的，步骤是什么？

类似于 [观察者模式](https://yhlben.github.io/blog/js-observer.html)

## 什么是 BOM？

BOM（Browser Object Model）即浏览器对象模型。
BOM 提供了独立于内容 而与浏览器窗口进行交互的对象；
由于 BOM 主要用于管理窗口与窗口之间的通讯，因此其核心对象是 window；
BOM 由一系列相关的对象构成，并且每个对象都提供了很多方法与属性；
BOM 缺乏标准，JavaScript 语法的标准化组织是 ECMA，DOM 的标准化组织是 W3C。

常用对象：location，navigation，history，screen，frames。

![bom模型图](https://images2015.cnblogs.com/blog/997049/201608/997049-20160830235030324-1067760196.jpg)

## 行内标签

- 1.行属性标签它和其它标签处在同一行内
- 2.行属性标签无法设置宽度，高度 行高 距顶部距离 距底部距离
- 3.行属性标签的宽度是直接由内部的文字或者图片等内容撑开的
- 4.行属性标签内部不能嵌套行属性标签（a 链接内不能嵌套其他链接）

```html
<a>、<span>、<i>、<em>、<strong>、<label>、<q>、<var>、<cite>、<code>
```

## fetch 和 ajax 的比较

Ajax 的本质是使用 XMLHttpRequest 对象来请求数据。（源生调用相当繁琐，得处理兼容性问题）。

fetch 采用了 Promise 的异步处理机制,更加简单.在默认情况下 fetch 不会接受或者发送 cookies

## data-xxx 属性的作用是什么？

增加自定义属性的可读性，可维护性。
dom.dataset 可以直接访问 dataset。

## js 中的`__proto__`和 prototype

任何对象都有一个 `__proto__` 属性

任何方法都有一个`prototype`属性，`prototype`也是一个对象 ，所以其中也有一个`__proto__`

prototype 它的作用很像 java 中的静态属性/方法。其中的对象可以给所有实例使用。

`__proto__`指向 new 出来的构造函数。

- 1 函数对象有`__proto__`和 prototype 属性
- 2 非函数对象只有`__proto__`属性
- 3 prototype 中有`__proto__`属性。且是 Object 构造函数创建的
- 4 函数对象`__proto__`指向它的创建者及 Function 构造函数
- 5 Function 构造函数`__proto__`指向它自己
- 6 Object 对象的 prototype 中的`__proto__`是 null
