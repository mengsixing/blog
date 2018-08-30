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

待调试。

## 请解释 XSS 与 CSRF 分别是什么？两者有什么联系，如何防御？

[参考链接](fontend-security.html)

## 关乎 Javascript Bridge。

1、解释一下什么是 Javascript Bridge。
2、Javascript Bridge 的实现原理。
3、你所了解的 Javascript Bridge 通讯中的优化方案。

Javascript Bridge 是 js 于其他语言通信的一个中间层。

## TCP/UDP 是什么？

TCP 和 UDP 都是传输层上的协议。
TCP 链接经过 3 次握手，保证连接是可靠的，UDP 类似于广播不可靠。

## 请用算法实现，从给定的无序、不重复的数组 A 中，去除 N 个数使其相加和为 M。并给出算法的时间，空间复杂度。

待完成。
