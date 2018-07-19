# Node 小知识

- node 适用于 I/O 密集型，不适合于 CPU 密集型。
- 帮助实践轮询的 libuv 库 V8 不是一个线程。

- 并不是所有都用一部任务好，遵循一个公式： s= (Ws+Wp)/(Ws+Wp/p) ws 表示同步任务，Wp 表示异步任务，p 表示处理器的数量。

- libuv 在 linux 下是 custom threadpool。
- libuv 在 windows 下是 iocp。

- node 代码单线程，可以通过引入 cluster 模块，实现主从进程。

- node 垃圾回收机制：分代式回收机制（新生代，老生代）。

- 新生代采用 scavenge 算法 ： from to 交换。
- 老生代采用 标记清除（mark-swap），移动清除（mark-compact）。

- node 测试工具 node-inspector 。
