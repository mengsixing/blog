# 学习函数式编程 Monad

上一篇文章中，我们讨论了常用的函数式编程案例，一些同学反馈没有讲到底层概念，想了解一下什么是 Monad？基于这个问题，我们来探究一下。

在函数式编程中，Monad 是一种结构化程序的抽象，我们通过三个部分来理解一下。

- Monad 定义
- Monad 使用场景
- Monad 一句话解释

## Monad 定义

根据维基百科的定义，Monad 由以下三个部分组成：

- 一个类型构造函数（M），可以构建出一元类型 `M<T>`。
- 一个类型转换函数（return or unit），能够把一个原始值装进 M 中。
  - unit(x) : `T -> M T`
- 一个组合函数 bind，能够把 M 实例中的值取出来，放入一个函数中去执行，最终得到一个新的 M 实例。
  - `M<T>` 执行 `T-> M<U>` 生成 `M<U>`

除此之外，它还遵守一些规则：

- 单位元规则，通常由 unit 函数去实现。
- 结合律规则，通常由 bind 函数去实现。

> 单位元：是[集合](https://baike.baidu.com/item/集合/2908117)里的一种特别的元素，与该集合里的[二元运算](https://baike.baidu.com/item/二元运算)有关。当单位元和其他元素结合时，并不会改变那些元素。
>
> 乘法的单位元就是 1，任何数 x 1 = 任何数本身、1 x 任何数 = 任何数本身。
>
> 加法的单位元就是 0，任何数 + 0 = 任何数本身、0 + 任何数 = 任何数本身。

这些定义很抽象，我们用一段 js 代码来模拟一下。

```javascript
class Monad {
  value = "";
  // 构造函数
  constructor(value) {
    this.value = value;
  }
  // unit，把值装入 Monad 构造函数中
  unit(value) {
    this.value = value;
  }
  // bind，把值转换成一个新的 Monad
  bind(fn) {
    return fn(this.value);
  }
}

// 满足 x-> M(x) 格式的函数
function add1(x) {
  return new Monad(x + 1);
}
// 满足 x-> M(x) 格式的函数
function square(x) {
  return new Monad(x * x);
}

// 接下来，我们就能进行链式调用了
const a = new Monad(2)
					.bind(square)
					.bind(add1);
					//...

console.log(a.value === 5); // true
```

上述代码就是一个最基本的 Monad，它将程序的多个步骤抽离成线性的流，通过 bind 方法对数据流进行加工处理，最终得到我们想要的结果。

Ok，我们已经明白了 Monad 的内部结构，接下来，我们再看一下 Monad 的使用场景。

## Monad 使用场景

通过 Monad 的规则，衍生出了许多使用场景。

- 组装多个函数，实现链式操作。
  - 链式操作可以消除中间状态，实现 Pointfree 风格。
  - 链式操作也能避免多层函数嵌套问题 `fn1(fn2(fn3()))`。
  - 如果你用过 rxjs，就能体会到链式操作带来的快乐。
- 处理副作用。
  - 包裹异步 IO 等副作用函数，放在最后一步执行。

还记得 Jquery 时代的 ajax 操作吗？

```javascript
$.ajax({
  type: "get",
  url: "request1",
  success: function (response1) {
    $.ajax({
      type: "get",
      url: "request2",
      success: function (response2) {
        $.ajax({
          type: "get",
          url: "request3",
          success: function (response3) {
            console.log(response3); // 得到最终结果
          },
        });
      },
    });
  },
});
```

上述代码中，我们通过回调函数，串行执行了 3 个 ajax 操作，但同样也生成了 3 层代码嵌套，这样的代码不仅难以阅读，也不利于日后维护。

Promise 的出现，解决了上述问题。

```javascript
fetch("request1")
  .then((response1) => {
    return fetch("request2");
  })
  .then((response2) => {
    return fetch("request3");
  })
  .then((response3) => {
    console.log(response3); // 得到最终结果
  });
```

我们通过 Promise，将多个步骤封装到多个 then 方法中去执行，不仅消除了多层代码嵌套问题，而且也让代码划分更加自然，大大提高了代码的可维护性。

> 想一想，为什么 Promise 可以不断执行 then 方法？

其实，Promise 和 Monad 很类似，它满足了多条 Monad 规则。

1. Promise 本身就是一个构造函数。
2. Monad 中的 unit，在 Promise 中可以看为： `x => Promise.resolve(x)`
3. Monad 中的 bind，在 Promise 中可以看为：`Promise.prototype.then`

我们用代码来验证一下。

```javascript
// 首先定义 2 个异步处理函数。

// 延迟 1s 然后 加一
function delayAdd1(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x + 1);
    });
  }, 1000);
}

// 延迟 1s 然后 求平方
function delaySquare(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x * x);
    });
  }, 1000);
}
/****************************************************************************************/

// 单位元 e 规则，满足：e*a = a*e = a
const promiseA = Promise.resolve(2).then(delayAdd1);
const promiseB = delayAdd1(2);
// promiseA === promiseB，故 promise 满足左单位元。

const promiseC = Promise.resolve(2);
const promiseD = a.then(Promise.resolve);
// promiseC === promiseD，故 promise 满足右单位元。

// promise 既满足左单位元，又满足右单位元，故 Promise 满足单位元。
// ps：但一些特殊的情况不满足该定义，下文中会讲到

/****************************************************************************************/

// 结合律规则：（a * b）* c = a *（b * c）
const promiseE = Promise.resolve(2);
const promiseF = promiseE.then(delayAdd1).then(delaySquare);
const promiseG = promiseE.then(function (x) {
  return delayAdd1(x).then(g);
});

// promiseF === promiseG，故 Promise 是满足结合律。
// ps：但一些特殊的情况不满足该定义，下文中会讲到
```

看完上面的代码，不禁感觉很惊讶，Promise 和 Monad 也太像了吧，不仅可以实现链式操作，也满足单位元和结合律，难道 Promise 就是一个 Monad？

其实不然，Promise 并不完全满足 Monad：

- Promise.resolve 如果传入一个 Promise 对象，会等待传入的 Promise 执行，并将执行结果作为外层 Promise 的值。
- Promise.resolve 在处理 thenable 对象时，同样不会直接返回该对象，会将对象中的 then 方法当做一个 Promise 等待结果，并作为外层 Promise 的值。

如果是这两种情况，那就无法满足 Monad 规则。

```javascript
// Promise.resolve 传入一个 Promise 对象
const functionA = function (p) {
  // 这时 p === 1
  return p.then((n) => n * 2);
};
const promiseA = Promise.resolve(1);
Promise.resolve(promiseA).then(functionA);
// RejectedPromise TypeError: p.then is not a function
// 由于 Promise.resolve 对传入的 Promise 进行了处理，导致直接运行报错。违背了单位元和结合律。

// Promise.resolve 传入一个 thenable 对象
const functionB = function (p) {
  // 这时 p === 1
  alert(p);
  return p.then((n) => n * 2);
};
const obj = {
  then(r) {
    r(1);
  },
};
const promiseB = Promise.resolve(obj);
Promise.resolve(promiseB).then(functionB);
// RejectedPromise TypeError: p.then is not a function
// 由于 Promise.resolve 对传入的 thenable 进行了处理，导致直接运行报错。违背了单位元和结合律。
```

看到这里，相信大家对 Promise 也有了一层新的了解，正是借助了 Monad 一样的链式操作，才使 Promise 广泛应用在了前端异步代码中，你是否也和我一样，对 Monad 充满了好感？

### Monad 处理副作用

接下来，我们再看一个常见的问题：为什么 Monad 适合处理副作用？

> ps：这里说的副作用，指的是违反**纯函数**原则的操作，我们应该尽可能避免这些操作，或者把这些操作放在最后去执行。

例如：

```javascript
var fs = require("fs");

// 纯函数，传入 filename，返回 Monad 对象
var readFile = function (filename) {
  // 副作用函数：读取文件
  const readFileFn = () => {
    return fs.readFileSync(filename, "utf-8");
  };
  return new Monad(readFileFn);
};

// 纯函数，传入 x，返回 Monad 对象
var print = function (x) {
  // 副作用函数：打印日志
  const logFn = () => {
    console.log(x);
    return x;
  };
  return new Monad(logFn);
};

// 纯函数，传入 x，返回 Monad 对象
var tail = function (x) {
  // 副作用函数：返回最后一行的数据
  const tailFn = () => {
    return x[x.length - 1];
  };
  return new Monad(tailFn);
};

// 链式操作文件
const monad = readFile("./xxx.txt").bind(tail).bind(print);
// 执行到这里，整个操作都是纯的，因为副作用函数一直被包裹在 Monad 里，并没有执行
monad.value(); // 执行副作用函数
```

上面代码中，我们将副作用函数封装到 Monad 里，以保证纯函数的优良特性，巧妙地化解了副作用存在的安全隐患。

Ok，到这里为止，本文的主要内容就已经分享完了，但在学习 Monad 中的某一天，突然发现有人用一句话就解释清楚了 Monad，自叹不如，简直太厉害了，我们一起来看一下吧！

Warning：下文的内容偏数学理论，不感兴趣的同学跳过即可。

## 一句话解释 Monad

早在 10 多年前，Philip Wadler 就对 Monad 做了一句话的总结。

> 原文：_A monad is a monoid in the category of endofunctors_。
>
> 翻译：Monad 是一个 **自函子** **范畴** 上的 **幺半群**” 。

这里标注了 3 个重要的概念：自函子、范畴、幺半群，这些都是数学知识，我们分开理解一下。

- 什么是范畴？

任何事物都是对象，大量的对象结合起来就形成了集合，对象和对象之间存在一个或多个联系，任何一个联系就叫做态射。

一堆对象，以及对象之间的所有态射所构成的一种代数结构，便称之为 **范畴**。

- 什么是函子？

我们将范畴与范畴之间的映射称之为 **函子**。映射是一种特殊的态射，所以函子也是一种态射。

- 什么是自函子？

**自函子**就是一个将范畴映射到自身的函子。

- 什么是幺半群 Monoid？

**幺半群**是一个存在 [单位元](https://baike.baidu.com/item/单位元) 的[半群](https://baike.baidu.com/item/半群)。

- 什么是半群？

如果一个集合，满足结合律，那么就是一个**半群**。

- 什么是单位元？

**单位元**是集合里的一种特别的元素，与该集合里的二元运算有关。当单位元和其他元素结合时，并不会改变那些元素。

```text
如：
任何一个数 + 0 = 这个数本身。 那么 0 就是单位元（加法单位元）
任何一个数 * 1 = 这个数本身。那么 1 就是单位元（乘法单位元）
```

Ok，我们已经了解了所有应该掌握的专业术语，那就简单串解一下这段解释吧：

一个 **自函子** **范畴** 上的 **幺半群** ，可以理解为，在一个满足结合律和单位元规则的集合中，存在一个映射关系，这个映射关系可以把集合中的元素映射成当前集合自身的元素。

相信掌握了这些理论知识，肯定会对 Monad 有一个更加深入的理解。

## 总结

本文从 Monad 的维基百科开始，逐步介绍了 Monad 的内部结构以及实现原理，并通过 Promise 验证了 Monad 在实战中发挥的重大作用。

文中包含了许多数学定义、函数式编程的理论等知识，大多是参考网络资料和自我经验得出的，如果有错误的地方，还望大家多多指点 🙏

最后，如果你对此有任何想法，欢迎留言评论！

![](https://cdn.yinhengli.com/qianduanrizhi_guanzhu.png)

参考链接：

- [Promise 不是 Monad](https://buzzdecafe.github.io/2018/04/10/no-promises-are-not-monads)
- [深入解析 Monad](https://developer.ibm.com/zh/articles/j-understanding-functional-programming-5)
- [写给小白的 Monad 指北](https://zhuanlan.zhihu.com/p/65449477)
- [详解函数式编程之 Monad](https://zhuanlan.zhihu.com/p/260966706?utm_source=wechat_session)
- [什么是 Monad (Functional Programming)](https://www.jianshu.com/p/cf28f2e5a905)
- [详解函数式编程之 Monad](https://netcan.github.io/2020/09/30/%E8%AF%A6%E8%A7%A3%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BC%96%E7%A8%8B%E4%B9%8BMonad)
- [JavaScript ES6 函数式编程（三）：函子](https://www.cnblogs.com/chenwenhao/p/11742517.html)
- [Learn You a Haskell for Great Good!](http://learnyouahaskell.com/chapters)
- [Functors, Applicatives, And Monads In Pictures](https://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html)
