# 专业术语

## bigpipe 是什么

答：bigpipe 常用于服务器端渲染，当后端在渲染一个非常耗时的页面时，可以一边渲染，一边输出 html 给前端，此时前端也会根据接收到的 html 片段同步进行渲染。

原理：http1.1 中引入了一个 http 首部，Transfer-Encoding:chunked。这个首部标识了实体采用 chunked 编码传输，chunked 编码可以将实体分割成多个 PageLet 的小块进行传输，并且 chunked 编码的每一块内容都会自标识长度。

## FP FCP FMP

FP：初次渲染

初次有内容的渲染 FCP

初次有意义的渲染 FMP

## 客户端渲染，预渲染，服务器端渲染，同构

客户端渲染：直接加载一个空壳，然后通过 js 去加载页面，常见的有 react，vue。

- fp 快
- fcp 慢
- fmp 慢

预渲染：在客户端渲染的基础上，通过审查元素，抓取到静态 HTML，交给客户端。

- fp 中
- fcp 快
- fmp 中

服务器端渲染：传统模式的渲染，服务器端将渲染好的 HTML 发给客户端。

- fp 慢
- fcp 慢
- fmp 快

服务器端同构：浏览器刷新时请求服务器端渲染，在页面跳转时，由客户端渲染接管。

## 什么是 Long task LCP CLS TTFB FID

Long task 允许 Web 页面的开发者检测是否存在持续一段时间独占 UI 线程并阻塞其他关键任务执行（如对用户输入进行响应）的“长任务”，当一个任务执行时间超过 50ms 时，开发者为长任务注册的函数将会被自动调用。

LCP (Largest Contentful Paint) 是一个以用户为中心的性能指标，可以测试用户感知到的页面加载速度，因为当页面主要内容可能加载完成的时候，它记录下了这个时间点。一个快速的 LCP，可以让用户感受到这个页面的可用性。

CLS(Cumulative Layout Shift)  指的是页面在渲染时的稳定性，主要测量布局偏移的分数，当一个可见元素在两帧之间，改变了它的起始位置，这些元素被当成不稳定元素。

FID(First Input Delay)FID 衡量的是从用户第一次与页面进行交互（即当他们单击链接，点击按钮或使用自定义的 JavaScript 驱动的控件）到浏览器实际上能够开始处理事件处理程序的时间。

TTFB（time-to-first-byte）服务器端返回第一个字节数据的时间。

使用 [web-vitals](https://github.com/GoogleChrome/web-vitals) 库可以帮助我们轻松获取 FCP、LCP、CLS

## WebRTC 是什么

WebRTC（Web Real-Time Communication）web 实时通信技术。简单地说就是在 web 浏览器里面引入实时通信，包括音视频通话等。

[WebRTC 介绍及简单应用](https://www.cnblogs.com/vipzhou/p/7994927.html)
