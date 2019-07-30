# 《狼书-更了不起的 nodejs》

最近读了狼叔的新书，《狼书-更了不起的 nodejs》感觉挺基础的，最难的地方在于 nodejs 运行过程一章，在这记录一下。

- Nodejs 应用场景
- 单线程会死吗
- 编译三步走
- Nodejs 是如何执行的
- Buffer
- Streams
- Nodejs 异步写法与流程控制

## Nodejs 应用场景

- 反向代理
  - nodejs 可以像 nginx 一样，作为反向代理。
- 爬虫
  - npm 库里有大量爬虫相关的模块，node-crawler 等，配合 jsdom，对前端非常友好。
- 命令行工具
  - 所有辅助开发、运维、提高效率的工具，都可以用 nodejs 来开发
- 微服务和 rpc
  - nodejs 里有各种 rpc，比如 dnode、seneca，也有跨语言支持的 gRPC。
- 微信公众号开发
  - 相关 sdk，框架非常多，是快速开发的利器。
- 前端流行的 ssr 和 pwa
  - ssr 是服务器端渲染，react 和 vue 都可以用 nodejs 实现 ssr。
  - pwa 的很多模块也是用 nodejs 实现的。

## 单线程会死吗

单线程非常脆弱，随便一点异常都会使其“挂掉”，不幸的是 Node.js 就是单线程的，所以经常被人诟病“太脆弱，动不动就崩溃”。但是，真的是这样的吗？

单线程会死是一个伪命题，大部分时候是用法不当造成的。通常可以通过如下方案解决：

- uncaughtException
  - 全局异常捕获，可以 catch 到所有导致系统崩溃的问题。
- pm2
  - 进程因异常退出是很常见的事，当遇到崩溃退出的时候，重启就可以了。
  - pm2 还支持多核部署，即在 cpu 每个核上都运行一个服务，如遇到退出，则会重启。
- 部署多台服务器集群，将概率降到最小。

## 编译三步走

书中从 nodejs 源码编译开始，讲解了 node 运行过程，这里先介绍一下常规的编译三步走。

- ./configure
- make
- make install

1、./configure 是用来检测你的安装平台的目标特征的。比如它会检测你是不是有 CC 或 GCC，并不是需要 CC 或 GCC，它是个 shell 脚本。

2、make 是用来编译的，它从 Makefile 中读取指令，然后编译。

3、make install 是用来安装的，它也从 Makefile 中读取指令，安装到指定的位置。

### configure 命令

configure 命令一般用来生成 Makefile，为下一步的编译做准备，你可以通过在 configure 后加上参数来对安装进行控制，比如代码:`./configure –prefix=/usr` 意思是将该软件安装在 /usr 下面，执行文件就会安装在 /usr/bin（而不是默认的 /usr/local/bin)，资源文件就会安装在 /usr/share（而不是默认的/usr/local/share）。

同时一些软件的配置文件你可以通过指定 –sys-config= 参数进行设定。有一些软件还可以加上 –with、–enable、–without、–disable 等等参数对编译加以控制，你可以通过 ./configure –help 查看详细的说明帮助。

### make

make 表示编译，大多数的源代码包都经过这一步进行编译。如果 在 make 过程中出现 error ，你就要记下错误代码（注意不仅仅是最后一行），然后你可以向开发者提交 bugreport，或者你的系统少了一些依赖库等，这些需要自己仔细研究错误代码。

:::tip 常见错误

make \*\*\* 没有指明目标并且找不到 makefile，停止。

问题很明显，没有 Makefile，原来是要先 ./configure 一下，再 make。
:::

### make install

这条命令来进行安装，这一步一般需要你有 root 权限（因为要向系统写入文件）。

## Nodejs 是如何执行的

nodejs 在运行时，会执行以下几行命令：

- PlatformInit();
- argv = uv_setup_args(argc,grgv);
- Init(&argc,const_cast(argv),&exec_argc,&exec_argv)
- V8::Initialize()
- Start(uv_default_loop(),argc,argv,exec_argc,exec_argv)

### PlatformInit

用于对文件进行描述，以及注册两个信号处理函数。

```js
RegisterSignalHander(SIGINT, SignalExit, true);
RegisterSignalHander(SIGTERM, SignalExit, true);
```

### uv_setup_args

uv_setup_args 是定义在 libuv 中的方法，用于进行 process.title 的设置和读取。

### Init

- 初始化 Uptime 值
- 对 node 命令行接收的参数和 V8 的 flag 参数进行映射处理。
- 将 node_is_initialized 标记为 true。

### V8::Initialize

所有的 nodejs 源码（js 文件）都会先由 V8 引擎来解释并运行。

### Start 方法

主要针对于 libuv 进行操作

- 准备工作
- 执行 loadEnvironment(&env)
- 开启 eventloop，无线循环
- 收尾，内存回收，断开 debug 连接。

### 构造 process 对象

在 loadEnvironment 阶段，会构建 process 对象。

process 对象的用法：

- 统计信息，cpu，内存等。
  - process.cpuUsage();
- 事件循环机制，process.nextTick。
  - nodejs 为事件循环位置了一个队列，nextTick 入队列，\_tickCallback 出队列。
- uncaughtException 事件。
  - 全局异常捕获。
- 其他
  - 进程管理，exit，kill。
  - i/o 相关，stdout，stderr，stdin。
  - 路径处理，cwd，chdir 等。

#### 绑定内部 c++模块

process.moduleLoadList 可以查看当前进程已经加载的模块。

- Binding 模块，通过 process.binding 绑定的内部 c++模块。
- NativeModule 模块，内部 js 模块。

大家常见的.js 文件最后都是通过 process.binding('contextify')进行编译的。

- var ContextifyScript = process.binding('contextify').ContextifyScript
- var script = new ContextifyScript(code, option);
- script.runInThisContext();
  - 内部会调用 EvalMachine 方法，将 js 代码转换成机器码。

### 事件循环机制

Libuv 实现了 Node.js 中的 Eventloop ，主要有以下几个阶段：

```js
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

- timers：执行 `setTimeout` 和 `setInterval` 中到期的 callback。
- pending callbacks：上一轮循环中有少数的 I/O callback 会被延迟到这一轮的这一阶段执行。
- idle, prepare：仅内部使用。
- poll：最为重要的阶段，执行 I/O callback，在适当的条件下会阻塞在这个阶段。
- check：执行 `setImmediate` 的 callback。
- close callbacks：执行 close 事件的 callback，例如 socket.on("close",func)。

**除此之外，Node.js 提供了 process.nextTick 方法，在以上的任意阶段开始执行的时候都会触发。**

#### microtask 和 macrotask

在 js 的事件循环机制中，还有两个概念，microtask 微任务 和 macrotask 宏任务。当前调用栈执行完毕时，会分两种情况进行处理。首先处理 microtask 队列里的事件，然后再从 macrotask 队列中取出一个事件并执行。在同义词事件循环中，microtask 永远在 macrotask 之前执行。

- microtask
  - process.nextTick
  - promise
- macrotask
  - setTimeout
  - setInterval
  - setImmediate
  - I/O

接下来通过一道题来测试一下你对 microtask 和 macrotask 的掌握程度。

```js
console.log('start');
const interval = setInterval(() => {
  console.log('setInterval');
});

setTimeout(() => {
  console.log('setTimeout 1');
  Promise.resolve()
    .then(() => {
      console.log('promise 3');
    })
    .then(() => {
      console.log('promise 4');
    })
    .then(() => {
      setTimeout(() => {
        console.log('setTimeout 2');
        Promise.resolve()
          .then(() => {
            console.log('promise 5');
          })
          .then(() => {
            console.log('promise 6');
          })
          .then(() => {
            clearInterval(interval);
          });
      });
    });
}, 0);

Promise.resolve()
  .then(() => {
    console.log('promise 1');
  })
  .then(() => {
    console.log('promise 2');
  });
```

## Buffer

为什么要用 buffer？

虽然 js 能够很好的处理 unicode 编码的字符串，但对于二进制或非 unicode 编码的数据，处理起来就显得无能为力了。所以 Nodejs 在 sdk 里内置了 buffer 类，可以像其他程序语言一样，处理各种类型的数据。

buffer 代表一个缓冲区，用于存储二进制数据，俗称字节流，是 i/o 传输时常用的处理方式。**相比于字符串，buffer 可以免去编码和解码的过程，节省 cpu 成本**，因此在使用 nodejs 进行服务端开发时，http、tcp、udp、io、数据库、处理图片、表文件商户餐等操作，都会用到 buffer。另外 buffer 其实也是 stream 的基础。

buffer 的应用场景：

- 在使用 net 或 http 模块接受网络数据时，可用 buffer 作为数据结构进行传输，即 data 事件的参数。
- 用于大文件的读取和写入，以前 fs 读取的内容是 string，后来都改用 buffer，在大文件读取上，性能和内存有明显优势。
- 用于字符转码、进制转换。
- 用作数据结构，处理二进制数据，也可以处理字符编码。

```js
let bugger = Buffer.from('Hello world!');
console.log(buffer);

//<Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 62 21>
```

可以看出，buffer 将字符串中的字符，转换成了对应的十六进制的 ASCII 码。

### buffer 不得不提的 8KB

buffer 著名的 8KB 载体，举个例子，node 把一幢大房子分成很多小房间，每个房间能容纳 8 个人，为了保证房间的充分使用，只有当一个房间塞满 8 个人后才会去开新的房间，但是当一次性有多个人来入住，node 会保证要把这些人放到一个房间中，比如当前房间 A 有 4 个人住，但是一下子来了 5 个人，所以 node 不得不新开一间房间 B，把这 5 个人安顿下来，此时又来了 4 个人，发现 5 个人的 B 房间也容纳不下了，只能再开一间房间 C 了，这样所有人都安顿下来了。但是之前的两间房 A 和 B 都各自浪费了 4 个和 3 个位置，而房间 C 就成为了当前的房间。

具体点说就是当我们实例化一个新的 Buffer 类，会根据实例化时的大小去申请内存空间，如果需要的空间小于 8KB，则会多一次判定，判定当前的 8KB 载体剩余容量是否够新的 buffer 实例，如果够用，则将新的 buffer 实例保存在当前的 8KB 载体中，并且更新剩余的空间。

## Streams

流（stream）是 Node.js 中处理流式数据的抽象接口。

Streams 不是 Node.js 独有的概念。它们是几十年前在 Unix 操作系统中引入的。

它们能够以一种有效的方式来处理文件的读、写，网络通信或任何类型的端到端信息交换。

例如，当你编写了一段程序用来读取文件时，传统的方法是将文件从头到尾读入内存，然后再进行处理。而使用流的话，你就可以逐块读取它，处理其内容而不将其全部保存在内存中。

```js
const fs = require('fs');
const rs = fs.createReadStream('test.md');
let data = '';
rs.on('data', function(chunk) {
  data += chunk;
});
rs.on('end', function() {
  console.log(data);
});
```

利用 createReadStream 创建一个读取数据的流，来读取 test.md 文件的内容，此时监听 data 事件，它是在当流将数据块传送给消费者后触发。并在对应的 eventHandler 中，拼接 chunk。在 end 事件中，打印到终端上。

之前说流，可以逐块读取文件内容，那么这个块，也就是 chunk 是什么？

一般情况下是 Buffer，修改 data 事件的 eventHandler 来验证下。

```js
rs.on('data', function(chunk) {
  console.log('chunk', Buffer.isBuffer(chunk)); // log true
  data += chunk;
});
```

流的工作方式可以具体的表述为，在内存中准备一段 Buffer，然后在 fs.read() 读取时逐步从磁盘中将字节复制到 Buffer 中。

### 为什么要使用 Stream

利用 Stream 来处理数据，主要是因为它的两个优点：

- 内存效率：处理数据之前，不需要占用大量内存。
- 时间效率：处理数据花费的时间更少，因为流是逐块来处理数据，而不是等到整个数据有效负载才启动。

首先内存效率，与 fs.readFile 这种会缓冲整个文件相比，流式传输充分地利用 Buffer （超过 8kb）不受 V8 内存控制的特点，利用堆外内存完成高效地传输。

时间效率，与 fs.FileSync 相比，有些优势，但是与异步的 fs.readFile 相比，优势不大。

## Nodejs 异步写法与流程控制

### 基于回调的方式

- nodejs 自带的 api

回调函数基于错误优先的返回方式，即回调函数中第一个参数是 err，代表报错信息。

### 基于 eventEmitter 的事件处理机制

使用观察者模式，代替回调函数，实现数据解耦。

```js
const EventEmitter = require('events');
const observer = new EventEmitter();

// 监听事件
observer.on('topic', function() {
  console.log('topic has changed');
});

// 触发事件
observer.emit('topic');
```

### 基于第三方异步流程库

- async.js 模块

```js
async.series([
  function(cb) {
    cb(null, 'one');
  },
  function(cb) {
    cb(null, 'two');
  }
]);
```

- thunk 函数封装。
- 使用 Thunkify 模块自动封装。

thunk 函数的作用是将多参数替换成单参数。

```js
function Thunk(fn) {
  return function(...args) {
    return function(callback) {
      return fn.call(this, ...args, callback);
    };
  };
}

// 手动封装
var readfileThunk = Thunk(fs.readFile);
// 自动封装
var readfileThunk = require('thunkify')(fs.readFile);
readfileThunk('./xxx.js')(callback);
```

### 基于 promise 异步处理

推荐两个社区比较有名的库：

- q
- bluebird

其中 bluebird 性能比较好，使用也很简洁，兼容源生 promise。

```js
Global.Promise = require('bluebird');

var xxx = new Promise();
```

### 基于 generator

generator 是一个生成器，会根据 yield 一步一步地生成数据。co 是 generator 的执行器，会自动执行完所有的 yield，他们可以配合使用，达到类似于同步的方式。

- co + generator

```js
co(function*() {
  var result = yield Promise.resolve(true);
  return result;
}).then(
  function(value) {
    console.log('value:', value);
  },
  function(err) {
    console.log('err:', err);
  }
);
```

### 终极解决办法

随着 es 规范的不断发展，async+await 成为了编写异步的最简单的方式。

- async + await

```js
async function render() {
  const result = await ctx.render('./xxx.html');
  ctx.body = result;
}
```

## 总结

总的来说，这本书讲的很基础，从宏观的角度介绍了 nodejs，对 node 运行流程这一章也有很深入的理解。由于 nodejs 的 api 都是基于回调式的，为了解决回调嵌套的问题，可以使用终极解决方案，async await。

## 参考链接

- [浅析 nodejs 的 buffer 类](https://cnodejs.org/topic/5189ff4f63e9f8a54207f60c)
- [深入浅出了解 Node.js Streams](https://www.zhangshengrong.com/p/YjNKn8oxaW/)
