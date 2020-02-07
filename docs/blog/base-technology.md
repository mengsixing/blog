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

## WebRTC 是什么

WebRTC（Web Real-Time Communication）web 实时通信技术。简单地说就是在 web 浏览器里面引入实时通信，包括音视频通话等。

[WebRTC 介绍及简单应用](https://www.cnblogs.com/vipzhou/p/7994927.html)
