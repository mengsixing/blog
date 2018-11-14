# NodeJs 使用总结

Node 的特点主要有异步 IO，单线程。

## 异步 IO 的好处

- 前端通过异步 IO 可以消除阻塞。
- 请求耗时少，假如有两个请求 A 和 B，那么异步 IO 用时为：Max（A+B）。同步则为 A+B，请求越多差距越大。
- IO 是昂贵的，分布式 IO 是更昂贵的。
- Nodejs 适用于 IO 密集型，而不适用于 CPU 密集型。
- 并不是所有都用异步任务好，遵循一个公式： s= (Ws+Wp)/(Ws+Wp/p) Ws 表示同步任务，Wp 表示异步任务，p 表示处理器的数量。

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

- 新生代内存主要通过 Scavenge 算法，分为 From 和 To。
- 老生代内存主要通过 Mark-Sweep 和 Mark-compact，标记清除和移动清除。

## 常见的内存泄漏

- 无线增长的数组。
- 无限制设置对象额属性和值。
- 任何模块的私有变量都是永驻的。
- 大循环，无 GC 机会。
- 队列消费不及时。
- 慎用全局变量。

## Node 调试

- node --inspect app.js
- chrome://inspect/#devices
- 没经过压力测试的 Node 代码基本只完成 10%。
- 准确计算 QPS 未雨绸缪。
- 合理利用压力测试工具。

## Node 项目上线

- 前端工程化，静态资源上传到 CDN。
- 单测、压测，性能分析工具找 Bug。
- 编写 nginx-conf 实现负载均衡和反向代理。
- 开启 pm2 守护进程，小流量灰度上线。

## Node 项目运行流程

1、用户请求 Node 服务器

2、经过 Nginx 服务器，反向代理，负载均衡到多个 pm2 运行的机器上。

3、pm2 守护进程，保证 Node 进程永远都活着,0 秒的重载。

4、varnish、squid，实现 http 缓存。

5、Java 后台服务器，读写分离，操作数据库，读写数据。

6、Database。
