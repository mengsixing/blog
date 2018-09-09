# Node 浅析

Node 的特点主要有异步 IO，单线程。

## 异步 IO 的好处

- 前端通过异步 IO 可以消除阻塞。
- 请求耗时少，假如有两个请求 A 和 B，那么异步 IO 用时为：Max（A+B）。同步则为 A+B，请求越多差距越大。
- IO 是昂贵的，分布式 IO 是更昂贵的。
- Nodejs 适用于 IO 密集型，而不适用于 CPU 密集型。
- 并不是所有都用异步任务好，遵循一个公式： s= (Ws+Wp)/(Ws+Wp/p) ws 表示同步任务，Wp 表示异步任务，p 表示处理器的数量。

## Node 对异步 IO 的实现

![异步IO](/blog/node-async.png)

::: tip 提示
libuv 在 linux 下是 custom threadpool。

libuv 在 windows 下是 iocp。
:::

## 常用的实现异步 IO 的方式

- step，wind，bigpipe 等异步控制库。
- Async、Await。
- Promise/Defferred
- 协程，Node 暂不支持，可使用 Generator。

## Node 内存管理与优化

Node 采用 V8 的 分代式垃圾回收策略，分为新生代和老生代内存。

- 新生代内存主要通过 Scavenge 算法，分为 from 和 to。
- 老生代内存主要通过 Mark-Sweep 和 Mark-compact，标记清除和移动清除。

## 常见的内存泄漏

- 无线增长的数组。
- 无限制设置对象额属性和值。
- 任何模块的私有变量都是永驻的。
- 大循环，无 GC 机会。

## Node 项目上线

- 前端工程化，静态资源上传到 CDN。
- 单测、压测，性能分析工具找 bug。
- 编写 nginx-conf 实现负载均衡和反向代理。
- 开启 pm2 守护进程，小流量灰度上线。
