# Node.js 使用总结

Node.js 使用了很久，在此做一个总结。根据 Node.js 官网的定义：**Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效**。

官网的定义言简意赅，但不容易理解，我们在用白话解释一下：Node.js 不是一门语言也不是框架，它只是基于 Google V8 引擎的 JavaScript 运行时环境，同时结合 Libuv 扩展了 JavaScript 功能，使之支持 io、fs 等只有语言才有的特性，使得 JavaScript 能够同时具有 DOM 操作(浏览器)和 I/O、文件读写、操作数据库(服务器端)等能力，是目前最简单的全栈式语言。

Node.js 可用于多个领域的开发，例如：

- 客户端应用程序（nw.js/electron）
- 后端（webapi，网站等）
- 工具（gulp，webpack 等构架工具）
- 物联网，硬件（ruff）

本文主要通过以下几点来梳理一下 Node.js。

- Node.js 基础
- Node.js 异步编程
- Node.js 内存管理与优化
- Node.js 测试与部署

## Node.js 基础

 我们首先看一下 Node.js 早期的架构图。Node.js 是基于 Chrome V8 引擎构建的，由事件循环（Event Loop）分发 I/O 任务，最终工作线程（Work Thread）将任务丢到线程池（Thread Pool）里去执行，而事件循环只要等待执行结果就可以了。

![Node.js 基础](https://static.cnodejs.org/Fh2MIT1r4YStGl9ZEEzt7N4lEbqX)

我们来解释一下。

- **Node.js Bindings 层** 将 Chrome V8 等暴露的 C/C++ 接口转成 JavaScript Api，并且结合这些 Api 编写了 Node.js 标准库，所有这些 Api 统称为 Node.js SDK。
- **V8 层** 是 Google 发布的开源 JavaScript 引擎，主要是将 JS 代码编译成原生机器码。
- **Thread Pool 层**：专门用来执行任务，执行完成后，将结果返回给 EventLoop 层。
- **EventLoop 层**：事件循环层，我们的代码在执行时，首先由 Event Loop 来接受处理，而真正执行操作的是具体的线程池（Thread Pool）里的 I/O 任务。之所以说 Node.js 是单线程，就是因为在接受任务的时候是单线程的，它无需进程/线程切换上下文的成本，非常高效，但它在执行具体任务的时候是多线程的。

::: tip 提示
Event Loop 事件循环，Thread Pool 线程池都是由 libuv 提供，libuv 是整个 Node.js 运行和核心。
:::

## 异步编程

异步编程是 Node.js 的一大特色，掌握好 Node.js 的异步编程是每个 Node.js 开发者必备的技能。

### 异步 IO 的好处

- 前端通过异步 IO 可以消除阻塞。
- 请求耗时少，假如有两个请求 A 和 B，那么异步 IO 用时为：Max（A+B）。同步则为 A+B，请求越多差距越大。
- IO 是昂贵的，分布式 IO 是更昂贵的。
- Node.js 适用于 IO 密集型，而不适用于 CPU 密集型。
- 并不是所有都用异步任务好，遵循一个公式： s= (Ws+Wp)/(Ws+Wp/p) Ws 表示同步任务，Wp 表示异步任务，p 表示处理器的数量。

### Node.js 对异步 IO 的实现

我们来看一下 Node.js 异步 IO 实现图：

![异步IO](/blog/node-async.png)

- 应用程序先将 JS 代码经 V8 转换为机器码。
- 通过 Node.js Bindings 层，向操作系统 Libuv 的事件队列中添加一个任务。
- Libuv 将事件推送到线程池中执行。
- 线程池执行完事件，返回数据给 Libuv。
- Libuv 将返回结果通过 Node.js Bindings 返回给 V8。
- V8 再将结果返回给应用程序。

::: tip 小知识

- libuv 在 linux 下基于 custom threadpool 实现。
- libuv 在 windows 下基于 iocp 实现。
:::

### 常用的实现异步 IO 的方式

- step，q，async 等异步控制库。
- 使用 Promise 处理异步。
- 使用 EventEmitter，实现“发布/订阅”模式处理异步。
- Node.js 暂不支持协程，可使用 Generator 代替。
- 终极解决方案：async、await。

## Node.js 内存管理与优化

Node.js 是单线程的，所以必须保证这个线程持续稳定，最容易导致 Node.js 应用程序挂掉的因素是内存泄漏。常见的内存泄漏：

- 无限增长的数组。
- 无限制设置对象额属性和值。
- 任何模块的私有变量都是永驻的。
- 大循环，无 GC 机会。
- 队列消费不及时。
- 慎用全局变量。

Node.js 采用 V8 的 分代式垃圾回收策略，分为新生代和老生代内存。

- 新生代内存主要通过 Scavenge 算法，分为 From 和 To。
- 老生代内存主要通过 Mark-Sweep 和 Mark-compact，标记清除和移动清除。

## Node.js 调试与部署

由于 Node.js 单线层的原因，所以 Node.js 的调试和部署特别重要，因为一旦出错，整个应用程序就挂了。

### Node.js 调试

- node --inspect app.js
  - 打开浏览器进行调试：chrome://inspect/#devices
- 使用 vscode 自带的调试。

### Node.js 部署

Node.js 端一般不会直接当成项目后端来使用，而是当成一个 BFF 层来使用。具体要怎么架构呢？

我们从用户的角度来做一个 Node.js 项目架构。

![node后端](node-backend.png)

- 用户请求 Node.js 服务器。
- 经过 LVS 传输层负载均衡。
- 经过 Nginx 服务器，反向代理，负载均衡到多个 PM2 运行的机器上。
  - PM2 守护进程，保证 Node.js 进程永远都活着, Node.js 挂掉后自动 0 秒的重载。
- 配置 Varnish、Squid，实现服务器 HTTP 缓存。
- Node.js 作为 Web 服务器层，会将请求转发给 Java 服务器。
  - 配置心跳检测 Heartbeats，检测 Java 端是否挂掉。
- Java 服务器根据请求，进行相应的处理，可能会对数据库进行读写操作。
- 读取或写入 Database。
  - 只读数据库
  - 只写数据库
- Java 服务器将数据库访问结果返回给 Node.js 层。
- Node.js 层将结果返回给用户。

#### Node.js Web 端应用程序部署流程

- 单元测试。
- 压力测试，性能分析工具找 Bug。
  - 提前发现内存泄漏问题。
  - 根据压力测试，准确计算 QPS ，推算出服务器性能。
- 静态资源上传到 CDN。
- 配置 Nginx 实现负载均衡和反向代理。
- 开启 PM2 守护进程，小流量灰度上线。

一般前端开发做到了这一步就可以了，剩下的工作交给运维和后端去完成，例如：配置 Web 服务器缓存 Varnish，心跳检测等。
