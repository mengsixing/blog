# 2019 面试经验总结

2019 年 9 月 1 日，北京面试记录。

- 百度
- 快手
- 爱奇艺
- 阿里
- 滴滴
- 字节跳动
- 好未来
- 贝壳

## 百度

1、请分析以下代码执行结果

```js
["1", "3", "10"].map(parseInt);
```

2、请分析以下代码执行结果

```js
var number = 10;
function fn() {
  console.log(this.number);
}
var obj = {
  number: 2,
  show: function(fn) {
    this.number = 3;
    fn();
    arguments[0]();
  }
};
obj.show(fn);
```

3、请写出 inner 的实际高度。

```html
<style>
  .outer {
    width: 200px;
    height: 100px;
  }
  .inner {
    width: 60px;
    height: 60px;
    padding-top: 20%;
  }
</style>
<div class="outer"><div class="inner"></div></div>
```

4、手写一个深拷贝函数。

5、HTTP 状态码 301 302 304 403。

6、手写发布订阅模式 EventEmitter。

7、手写一个多表查询的 sql 语句。

当时用的是 left join 实现。

8、react 高阶函数的写法，通常有哪几种。

第一种是通过工厂模式直接 wrapper，第二种是通过组件反向继承的方式。

```jsx
// 反向继承方式写法如下
class A extends B{
  render() {
    return (
      <div>component1 start</div>
        super.render()
      <div>component1 end</div>
    )
  }
}
```

9、delete 数组的 item，数组的 length 是否会 -1。

不会。

10、mongoDB 中的 BSON 是什么？

B 代表二进制。

11、关系型数据库和 nosql 查询效率谁高？

关系型是 B+ tree 查询效率相对较高。

12、使用 node app.js 开启服务，如何让它在后台运行。

开启守护进程，在命令后加上 & 符号，表示开启守护进程来执行。

```js
node app.js &
```

13、尽可能写出更多的数组副作用方法。

- splice、push、pop、shift、unshift。
- sort、fill、reverse。

百度三面：

1、实现一个周岁函数，例如 `fn('2018-8-8')` 输出 1，只要是过了生日就 +1。

2、不断优化刚才实现的函数，用尽一切办法，多问一问还有吗？跳出自己的固定思维圈。

## 阿里

1、vue 双向数据绑定原理，依赖收集是在什么时候收集的？

是在 created 生命周期之前，render 生成虚拟 dom 的时候。

2、react hooks 原理是什么？

hooks 是用闭包实现的，因为纯函数不能记住状态，只能通过闭包来实现。

3、useState 中的状态是怎么存储的？

通过单向链表，fiber tree 就是一个单向链表的树形结构。

[React Hooks 原理](https://github.com/brickspert/blog/issues/26)

## 快手

1、请写出以下代码执行结果。

```js
var x = 1,
  y = 0,
  z = 0;
function add(x) {
  return (x = x + 1);
}
y = add(x);
function add(x) {
  return (x = x + 3);
}
z = add(x);
// x:1 y:4 z:4
```

2、请写出以下代码执行结果。

```js
var num = 1;
var myObject = {
  num: 2,
  add: function() {
    this.num = 3;
    (function() {
      console.log(this.num);
      this.num = 4;
    })();
    console.log(this.num);
  },
  sub: function() {
    console.log(this.num);
  }
};
myObject.add();
console.log(myObject.num);
console.log(num);
var sub = myObject.sub;
sub();
```

3、ts 如何获取一个函数的类型，以及获取一个函数参数的类型。

4、ts 泛型约束的多种方法。

5、parseInt 的第二个参数是什么？

第二个参数表示将字符串当做几进制进行解析。

6、实现一个多列等高布局，多种方式。

- 使用 padding 和负 margin
- 使用 flex
- 使用 table-cell
- 使用 grid 布局

7、函数提升，如果加了一个括号，还会提升吗？

不提升。

8、setTimeout 的第三个参数，可以传递函数的初始参数。

9、bind 函数的第二个参数，可以传递函数的初始参数。

10、使用 ts 时，如果不在 a 后面加类型，怎么创建一个 number[] 的数组？

```js
const a = new Array<number>();
```

11、react 源码看过吗，`<Component1 />` 最后编译出来是个什么东西，是个什么类型？

ReactElement 类型。

## 爱奇艺

1、浏览器渲染 js，html，css 的顺序。

2、react dom diff 算法，list 比较首先比较的是什么？

首先比较同层级元素，从左到右。

3、为什么 react 要做成异步的呢？

- 因为 state 更新会导致组件重新渲染，在渲染后，才能把新的 props 传递到子组件上，所以即使 state 做成同步，props 也做不成，为了保证 state 和 props 的一致性。
- 为了性能优化，state 会根据不同的优先级进行更新。
- 为了让 react 更加灵活，如实现异步过渡，例如页面在切换的时候，如果延时很小，就在后台自动渲染了，渲染好之后再进行跳转；如果延时相对较长，可以加一个 loading。

4、对象的 {……} 解构，是 rest 吗？

是。

5、自己实现一个 Symbol Interator 。

```js
// 给一个对象设置Symbol Interator
var obj = {
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
    yield 3;
  }
};
```

6、options 头是在什么时候会进行发送。

- 检测服务器所支持的请求方法
- CORS 中的预检请求

7、sessionStorage 在两个 tab 窗口能共享吗？

不能，和后端的 session 类似，每一个窗口对应一个会话层。

8、localStorage 存放的只能是 string 类型。

插入时需要将对象转换为字符串，读取时需要做 JSON.parse 转换。

9、写一个 0-100 的正则表达式。

```js
/^(\d|[1-9]\d|100)$/;
```

10、linux 中怎么查看内存和磁盘。

- top 命令，查看内存。
- free 命令，查看内存。
- ps aux 列出当前内存中正在运行的程序。
- df 命令，查看磁盘。

11、meta 标签用过吗，都用来做些什么？

- seo 优化
- viewreport 设置手机端适配
- 设置 charset 字符编码
- 模拟 http 标头字段

```html
<meta name="keywords" content="电商,物流" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta charset="utf-8" />
<!-- 模拟 html 缓存头部 -->
<meta http-equiv="expires" content="Sunday 22 July 2016 16:30 GMT" />
```

## 滴滴

1、快速排序和二分排序选一个手写。

手写了一个快排。

2、手写一个 eventEmitter。

3、手写两个数组的交集。

- 两层 for 循环。
- 将两数组排序后，使用双指针去判断。

4、webpack 运行流程，seal 方法之后都有什么？什么时候生成 chunk ？

5、ts 中 `ThisType <T>` 是什么？

[ThisTypeT](https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypet)

6、手写一个 es5 继承。

[寄生组合继承](https://yhlben.github.io/blog/js-inherit.html#es5-%E4%B8%AD%E7%9A%84%E7%BB%A7%E6%89%BF)

7、react hooks 主要用来做什么？

- 在组件之间复用状态逻辑很难
  - 你可以使用 Hook 从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。Hook 使你在无需修改组件结构的情况下复用状态逻辑。 这使得在组件间或社区内共享 Hook 变得更便捷。
- 复杂组件变得难以理解
  - 组件中的每个生命周期常常包含一些不相关的逻辑。 Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）。
- 难以理解的 class
  - class 组件学习成本相对较高，需要理解 this 在 js 中的工作方式，在绑定事件时需要注意。

[hooks 介绍](https://zh-hans.reactjs.org/docs/hooks-intro.html)

8、https 有什么缺点？

- https 协议会使页面的加载时间延长近 50%。增加 10% ~ 20% 的耗电。
- https 协议的安全是有范围的，在黑客攻击、拒绝服务攻击、服务器劫持等方面几乎起不到什么作用。
- ssl 证书的信用链体系并不安全。特别是在某些国家可以控制 ca 根证书的情况下，中间人攻击一样可行。
- 需要购买费用。
- https 连接服务器端资源占用高较高多，相同负载下会增加带宽和服务器投入成本。

三面问题：

1、你工作中做过的最牛的项目是什么？

按实际项目实话实说，可按原因，过程，结果三个维度进行介绍。

2、深挖项目中的技术栈，追问项目中的难点，需要给出具体的解决方案。

根据实际情况说明即可，尽量多表达你自己对该项目的思考。

3、针对项目中的优缺点进行分析，并让你给出相应的优化方案。

主要考察对项目的思考。

4、还有其他最牛的项目吗？

一般一个项目不够，尽量多准备几个。

## 字节跳动

1、请分析以下代码执行结果

```js
async function a() {
  var result = Promise.resolve();
  result.abort = function() {
    console.log("xxx");
  };
  return result;
}
var p = a();
p.abort();
```

2、手写一个节流函数

[手写节流函数](https://yhlben.github.io/interview/js.html#_3%E3%80%81%E5%86%99%E4%B8%80%E4%B8%AA%E8%8A%82%E6%B5%81%E5%87%BD%E6%95%B0)

3、什么是装箱和拆箱

装箱和拆箱操作，能够在值类型和引用类型中架起一做桥梁。换言之,可以轻松的实现值类型与引用类型的互相转换。
装箱是将值类型转换为引用类型，拆箱是将引用类型转换为值类型。

4、什么是委托

粗略来说，一个类想执行一个方法，但它本身没有这个方法，这个方法在另一个类中，于是它“委托”那个类来帮它执行。

```java
using System;
using System.Collections.Generic;
using System.Text;
namespace Delegate
{
    //定义委托，它定义了可以代表的方法的类型
    public delegate void GreetingDelegate(string name);
    class Program
    {
        private static void EnglishGreeting(string name)
        {
            Console.WriteLine("Morning, " + name);
        }
        private static void ChineseGreeting(string name)
        {
            Console.WriteLine("早上好, " + name);
        }
        //注意此方法，它接受一个 GreetingDelegate 类型的参数，该参数是返回值为空，参数为 string 类型的方法
        private static void GreetPeople(string name, GreetingDelegate MakeGreeting)
        {
            MakeGreeting(name);
        }
        static void Main(string[] args)
        {
            GreetPeople("yhlben", EnglishGreeting);
            GreetPeople("yhlben", ChineseGreeting);
            Console.ReadKey();
        }
    }
}
```

5、手写一个 reduce 方法。

```js
Array.prototype.reduce = function(reducer, initVal) {
  for (let i = 0; i < this.length; i++) {
    initVal = reducer(initVal, this[i], i, this);
  }
  return initVal;
};
```

6、手写一个模板字符串替换方法

```js
function template(html, obj) {
  return html.replace(/\{\{(.*?)\}\}/g, function(match, key) {
    return obj[key.trim()];
  });
}
template("{{name}}很厉name害，才{{ age }}岁", { name: "jawil", age: "15" });
```

7、看过 antd 源码吗，如何实现一个 Model，Message 组件？

只能猜想到 React Portals，未层看过源码，有待提升。

8、如果要设计一套微前端架构，说说你的具体思路？如何实现主页面事件注册机制？如何解决多个 iframe 同时通信？

需要有落地实战项目，不然很难答好，消息加锁等。

## 好未来

1、同步，异步，阻塞，非阻塞，分别解释一下。

以烧水的案例来理解。

- 同步：使用普通水壶烧水。
- 异步：使用响水壶烧水。
- 阻塞：在烧水时不能做别的。
- 非阻塞：在烧水时可以去做别的事，通过轮询(epoll)查看水是否烧开。

2、cdn 是如何匹配最近的节点的？

通过动态 dns 解析。

3、promise 实现一个 sleep。

```js
async function test() {
  console.log("Hello");
  await sleep(1000);
  console.log("world!");
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
test();
```

## 贝壳

1、实现一个 css 布局，每一列的第一个和最后一个元素，在最左最右侧，其他的元素均匀分布。

案例：第一行 4 个元素，第二列 2 个元素。

2、请分析以下代码执行结果

```js
function test(a) {
  console.log(a);
  function a() {}
}
test(2);
```

3、请分析以下代码执行结果

```js
console.log("start");
const interval = setInterval(() => {
  console.log("setInterval");
});
setTimeout(() => {
  console.log("setTimeout 1");
  Promise.resolve()
    .then(() => {
      console.log("promise 3");
    })
    .then(() => {
      console.log("promise 4");
    })
    .then(() => {
      setTimeout(() => {
        console.log("setTimeout 2");
        Promise.resolve()
          .then(() => {
            console.log("promise 5");
          })
          .then(() => {
            console.log("promise 6");
          })
          .then(() => {
            clearInterval(interval);
          });
      });
    });
}, 0);
Promise.resolve()
  .then(() => {
    console.log("promise 1");
  })
  .then(() => {
    console.log("promise 2");
  });
```

## 总结

技术面试一般分为三面。

一面：考察基础，必须过硬，如：js、css、html、tcp/ip 协议栈、浏览器渲染等。

二面：结合实际项目考察技术深度，如：react、vue、koa、ts、webpack 等。

三面：结合实际项目考察项目思考，如：react 的优缺点、前端方向的思考、以及解决问题的思考方式等。
