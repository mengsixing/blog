# 前端性能优化

我们先来看一下页面渲染流程图，每个阶段的用时在 `performance.timing` 里都有记录。
![页面渲染流程图](/blog/huizong.png)

## 网络层面优化

- 浏览器缓存。
- DNS 优化。
- TCP 连接（3 次握手，4 次挥手）。
- 请求/响应。

### CDN 概念

- 根据 DNS 找到离你最近的服务器。
- 数据同步策略：热门资源立即同步，不热门数据谁用谁同步。

## 代码层面优化

代码层面可以使用一些优化手段。

```html
<!-- DNS 预解析 -->
<link rel="dns-prefetch" href="//cdfangyuan.cn" />
<!-- 预加载，指明哪些资源是在页面加载完成后即刻需要的，并提前获取-->
<link rel="preload" href="http://example.com" />
<!-- 预渲染，提前加载下一页的数据 -->
<link rel="prerender" href="http://example.com" />
```

### PC 端

- 压缩静态资源文件 体积包的大小 合并减少请求数量。
- 同一个域名下 3 个 js。
- 整个网页首屏加载的 js 5 个。
- gzip 之后每个文件大小不超过 31.2KB~ 最大 100。
- etag 99 年。

### 移动端

- manifest 离线应用 刷新一次～。
- 5M 的 localstrage，不能超过 2.5M 同步 容量小 读取快 一半放核心文件 js 激活 js。
- 基于一步的方案 容量大 读取慢。
- 异步的组件 css js html 图片～。
- localstrage 扩容计划。 iframe + postmessage。
- websql indexeddb -> orm。
- 区分机型 ua。
- 默认使用 1x 图 网速好则用 2x 图。

### 传统页面和单页

- 传统页面，先加载页面骨架，然后 ajax 请求数据，容易白屏。
- 传统单页，利用 ajax 拉去数据，通过 hash 或者 history，管理路由，速度快，seo 不友好。
- 最佳实践，pushstate + ajax，首页直出，其他页面内跳转用 ajax 单页，刷新就直出页面，需要后端配合，pjax。

## 浏览器缓存图

![浏览器缓存图](/blog/browser-caching.jpg)
