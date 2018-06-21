# 前端性能优化

## 网络层面优化

* 浏览器缓存。
* DNS优化。
* TCP连接（3次握手，4次挥手）。
* 请求/响应。

## CDN概念

* 根据DNS找到离你最近的服务器。
* 数据同步策略：热门资源立即同步，不热门数据谁用谁同步。

## 代码层面优化

### pc端口

* 压缩静态资源文件 体积包的大小 合并减少请求数量。
* 同一个域名下3个 js。
* 整个网页首屏加载的 js 5个。
* gzip之后每个文件大小不超过31.2KB~ 最大100。
* etag 99年。

### 移动端
* manifest 离线应用 刷新一次～。
* 5M的localstrage，不能超过2.5M 同步 容量小 读取快 一半放核心文件js 激活js。
* 基于一步的方案 容量大 读取慢。
* 异步的组件 css js html 图片～。
* localstrage扩容计划。 iframe+postmessage。
* websql indexeddb -> orm。
* 区分机型 ua。
* 默认使用1x图 网速好则用2x图。

### 传统页面和单页

* 传统页面，先加载页面骨架，然后ajax请求数据，容易白屏。
* 传统单页，利用ajax拉去数据，通过hash或者history，管理路由，速度快，seo不友好。
* 最佳实践，pushstate+ajax，首页直出，其他页面内跳转用ajax单页，刷新就直出页面，需要后端配合，pjax。

### 压力测试 wrk

## 页面渲染流程图

![页面渲染流程图](/blog/huizong.png)

##浏览器缓存图

![浏览器缓存图](/blog/browser-caching.jpg)




