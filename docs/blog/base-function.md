# 轻松实战函数式编程

最近和一些同学讨论了函数式编程，很多同学总觉得听起来很高大上，但用起来却无从下手。于是我抽时间捋了捋，将平时工作中用到的函数式编程案例和思想整理了出来，相信阅读本文后，大家都能快速上手函数式编程。

函数式编程目前使用范围非常广，常用的框架，语言几乎都能看到它的身影。

- 前端框架：react、vue 的 hooks 用法。
- 打包工具：webpack 的 webpack-chain 用法。
- 工具库：underscore、lodash、ramda。
- 部署方式：serverless。
- 后端：java、c# 中的 lamda 表达式。

本文将通过以下 3 个部分来深入函数式编程。

- 编程范式
- 函数式编程
- 函数式编程常见案例

## 编程范式

**编程范式** 指的是一种编程风格，它描述了程序员对程序执行的看法。在编程的世界中，同一个问题，可以站在多个角度去分析解决，这些不同的解决方案就对应了不同的编程风格。

常见的编程范式有：

- 命令式编程
  - 面向过程编程
    - C
  - 面向对象编程
    - C++、C#、Java
- 声明式编程
  - 函数式编程
    - Haskell

### 命令式编程

**命令式编程** 是使用最广的一种编程风格，它是站在计算机的角度去思考问题，主要思想是 **关注计算机执行的步骤，即一步一步告诉计算机先做什么再做什么**。

由于存在很多需要控制的步骤，所以命令式编程普遍存在以下特点：

- 控制语句
  - 循环语句：while、for
  - 条件分支语句：if else、switch
  - 无条件分支语句：return、break、continue
- 变量
  - 赋值语句

根据这些特点，我们来分析一个命令式编程案例：

```js
// 需求：筛选出数组中为奇数的子集合

const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// 步骤1：定义执行结果变量
let reult = [];
// 步骤2：控制程序循环调用
for (let i = 0; i < array.length; i++) {
  // 步骤3：判断筛选条件
  if (array[i] % 2 !== 0) {
    // 步骤4：加入执行结果
    reult.push(array[i]);
  }
}
// 步骤5：得到最终的结果 result
```

以上代码通过 5 个步骤，实现了数组的筛选，这并没有什么问题，但细心的同学可能会感到疑惑：这样写的代码量太长了，而且并不语义化，只有阅读完每一行的代码，才知道具体执行的是什么逻辑。

没错，这就是命令式编程的典型特点，除此之外，还有以下几点：

- 命令式编程的每一个步骤都可以由程序员定义，这样可以更精细化、更严谨地控制代码，从而提高程序的性能。
- 命令式编程的每一个步骤都可以记录中间结果，方便调试代码。
- 命令式编程需要大量的流程控制语句，在处理多线程状态同步问题时，容易造成逻辑混乱，通常需要加锁来解决。

### 声明式编程

**声明式编程** 同样是一种编程风格，它通过定义具体的规则，以便系统底层可以自动实现具体功能。主要思想是 **告诉计算机应该做什么，但不指定具体要怎么做**。

由于需要定义规则来表达含义，所以声明式编程普遍存在以下特点：

- 代码更加语义化，便于理解。
- 代码量更少。
- 不需要流程控制代码，如：for、while、if 等。

接下来，我们将上文中的数组筛选，用声明式的方式重构一下：

```javascript
// 筛选出数组中为奇数的子集合
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const reult = array.filter((item) => item % 2 !== 0);
```

可以看到，声明式编程没有冗余的操作步骤，代码量非常少，并且非常语义化，当我们读到 filter 的时候，自然而然就知道是在做筛选。

我们再看一个案例：

```sql
# 使用 sql 语句，查询 id 为 25 的学生
select * from students where id=25
```

在上述代码中，我们只是告诉计算机，我想查找 id 为 25 的同学，计算机就能给我们返回对应的数据了，至于是怎么查找出来的，我们并不需要关心，只要结果是正确的即可。

除了上述例子之外，还有很多声明式编程的案例：

- html 用来声明了网页的内容。
- css 用来声明网页中元素的外观。
- 正则表达式，声明匹配的规则。

有了以上几个案例，我们来总结一下声明式编程的优缺点：

- 声明式编程不需要编写复杂的操作步骤，可以大大减少开发者的工作量。
- 声明式编程的具体操作都是底层统一管理，可以降低重复工作。
- 声明式编程底层实现的逻辑并不可控，不适合做更精细化的优化。

## 函数式编程

**函数式编程** 属于声明式编程中的一种，它的主要思想是 **将计算机运算看作为函数的计算**，也就是把程序问题抽象成数学问题去解决。

函数式编程中，我们可以充分利用数学公式来解决问题。也就是说，任何问题都可以通过函数（加减乘除）和数学定律（交换律、结合律等），一步一步计算，最终得到答案。

函数式编程中，所有的变量都是唯一的值，就像是数学中的代数 x、y，它们要么还未解出来，要么已经被解出为固定值，所以对于：`x=x+1` 这样的自增是不合法的，因为修改了代数值，不符合数学逻辑。

除此之外，严格意义上的函数式编程也不包括循环、条件判断等控制语句，如果需要条件判断，可以使用三元运算符代替。

文章开头我们提到了 webpack-chain，我们一起来看一下：

```javascript
// 使用 webpack-chain 来编写 webpack 配置。
const Config = require('webpack-chain');
const config = new Config();
config.
    .entry('index')
        .add('src/index.js')
        .end()
    .output
         .path('dist')
         filename('my-first-webpack.bundle.js');
config.module
    .rule('compile')
        .test(/\.js$/)
        .use('babel')
        .loader('babel-loader')
module.exports = config;
```

可以看到，webpack-chain 可以通过链式的函数 api 来创建和修改 webpack 配置，从而更方便地创建和修改 webpack 配置。试想一下，如果一份 webpack 配置需要用于多个项目，但每个项目又有一些细微的不同配置，这个应该怎么处理呢？

如果使用 webpack-chain 去修改配置，一个函数 api 就搞定了，而使用命令式的编程，则需要去逐步遍历整个 webpack 配置文件，找出需要修改的点，才能进行修改，这无疑就大大减少了我们的工作量。

### 函数式编程的特点

根据维基百科权威定义，函数式编程有以下几个特点：

- 函数是一等公民
  - 函数可以和变量一样，可以赋值给其他变量，也可以作为参数，传入一个函数，或者作为别的函数返回值。
- 只用表达式，不用语句：
  - 表达式是一段单纯的运算过程，总是有返回值。
  - 语句是执行某种操作，没有返回值。
  - 也就是说，函数式编程中的每一步都是单纯的运算，而且都有返回值。
- 无副作用
  - 不会产生除运算以外的其他结果。
  - 同一个输入永远得到同一个数据。
- 不可变性
  - 不修改变量，返回一个新的值。
- 引用透明
  - 函数的运行不依赖于外部变量，只依赖于输入的参数。

以上的特点都是函数式编程的核心，基于这些特点，又衍生出了许多应用场景：

- 纯函数：同样的输入得到同样的输出，无副作用。
- 函数组合：将多个依次调用的函数，组合成一个大函数，简化操作步骤。
- 高阶函数：可以加工函数的函数，接收一个或多个函数作为输入、输出一个函数。
- 闭包：函数作用域嵌套，实现的不同作用域变量共享。
- 柯里化：将一个多参数函数转化为多个嵌套的单参数函数。
- 偏函数：缓存一部分参数，然后让另一些参数在使用时传入。
- 惰性求值：预先定义多个操作，但不立即求值，在需要使用值时才去求值，可以避免不必要的求值，提升性能。
- 递归：控制函数循环调用的一种方式。
- 尾递归：避免多层级函数嵌套导致的内存溢出的优化。
- 链式调用：让代码更加优雅。

这些应用场景都大量存在于我们的日常工作中，接下来我们通过几个案例来实战一下。

## 函数式编程常见案例

基于函数式编程的应用场景，我们来实现几个具体的案例。

- 函数组合
- 柯里化
- 偏函数
- 高阶函数
- 尾递归
- 链式调用

1、函数组合，组合多个函数步骤。

```js
function compose(f, g) {
  return function () {
    return f.call(this, g.apply(this, arguments));
  };
}

function toLocaleUpperCase(str) {
  return str.toLocaleUpperCase();
}

function toSigh(str) {
  return str + "!";
}
// 将多个函数按照先后执行顺序组合成一个函数，简化多个调用步骤。
const composedFn = compose(toSigh, toLocaleUpperCase);
console.log("函数组合：", composedFn("msx"));
// 函数组合：MSX!
```

2、柯里化，将一个多参数函数转化为多个嵌套的单参数函数。

```js
// 柯里化
function curry(targetfn) {
  var numOfArgs = targetfn.length;
  return function fn(...rest) {
    if (rest.length < numOfArgs) {
      return fn.bind(null, ...rest);
    } else {
      return targetfn.apply(null, rest);
    }
  };
}
// 加法函数
function add(a, b, c, d) {
  return a + b + c + d;
}
// 将一个多参数函数转化为多个嵌套的单参数函数
console.log("柯里化：", curry(add)(1)(2)(3)(4));
// 柯里化：10
```

3、偏函数，缓存一部分参数，然后让另一些参数在使用时传入。

```js
// 偏函数
function isTypeX(type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  };
}

// 缓存一部分参数，然后让另一些参数在使用时传入。
const isObject = isTypeX("Object");
const isNumber = isTypeX("Number");

console.log("偏函数测试：", isObject({ a: 1 }, 123)); // true
console.log("偏函数测试：", isNumber(1)); // true
```

4、惰性求值，预先定义多个操作，但不立即求值，在需要使用值时才去求值，可以避免不必要的求值，提升性能。

```c#
// 这里使用 C# 中的 LINQ 来演示
// 假设数据库中有这样一段数据 db.Gems [4,15,20,7,3,13,2,20];

var q =
    db.Gems
    .Select(c => c < 10)
  	.Take(3)
  	// 只要不调用 ToList 就不会求值
  	// 在具体求值的时候，会将预先定义的方法进行优化整合，以产生一个最优的解决方案，才会去求值。
    .ToList();
```

上述代码中，传统的求值会遍历 2 次，第一次遍历整个数组（8 项），筛选出小于 10 的项，输出 `[4,7,3,2]`，第二次遍历这个数组（4 项），输出 `[4,7,3]`。

如果使用惰性求值，则会将预先定义的所有操作放在一起进行判断，所以只需要遍历 1 次就可以了。在遍历的同时判断 `是否小于 10` 和 `小于 10 的个数是否为 3`，当遍历到第 5 项时，就能输出 `[4,7,3]`。

相比传统求值遍历的 8+4=12 项，使用惰性求值则只需遍历 5 项，程序的运行效率也就自然而然地得到了提升。

5、高阶函数，可以加工函数的函数（接收一个或多个函数作为输入、输出一个函数）。

```jsx
// React 组件中，将一个组件，封装为带默认背景色的新组件。
// styled-components 就是这个原理
function withBackgroundRedColor (wrapedComponent) {
  return class extends Component {
    render () {
      return (<div style={backgroundColor: 'red} >
                 <wrapedComponent {...this.props} />
             </div>)
    }
  }
}
```

6、递归和尾递归。

```js
// 普通递归，控制函数循环调用的一种方式。
function fibonacci(n) {
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log("没有使用尾递归，导致栈溢出", fibonacci(100));

// 尾递归，避免多层级函数嵌套导致的内存溢出的优化。
function fibonacci2(n, result, preValue) {
  if (n == 0) {
    return result;
  }
  return fibonacci2(n - 1, preValue, result + preValue);
}
// result = 0, preValue = 1
console.log("使用了尾递归，不会栈溢出", fibonacci2(100, 0, 1));
```

6、链式调用

```javascript
// lodash 中，一个方法调用完成之后，可以继续链式调用其他的方法。
var users = [
  { user: "barney", age: 36 },
  { user: "fred", age: 40 },
  { user: "pebbles", age: 1 },
];
var youngest = _.chain(users)
  .sortBy("age")
  .map(function (o) {
    return o.user + " is " + o.age;
  })
  .head()
  .value();
// => 'pebbles is 1'
```

## 思考与总结

本文从编程范式开始，分析了函数式编程的定位，进一步引申出函数式编程的概念，然后基于一些工作中的案例，实战了函数式编程的应用场景，希望大家都能轻松地认识函数式编程。

最后，如果你对此有任何想法，欢迎留言评论！

![](https://cdn.yinhengli.com/qianduanrizhi_guanzhu.png)
