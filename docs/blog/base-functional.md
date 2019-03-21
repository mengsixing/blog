# 函数式编程

函数式编程起源很早，最近随着 React 的热度逐渐被更多人关注，这一章我们来介绍一下。

## 函数式编程起源

- 函数式编程的起源，是一门叫做范畴论（Category Theory）的数学分支。
- 彼此之间存在某种关系的概念、事物、对象等等，都构成"范畴"。随便什么东西，只要能找出它们之间的关系，就能定义一个"范畴"。
- 箭头表示范畴成员之间的关系，正式的名称叫做"态射"（morphism）。范畴论认为，同一个范畴的所有成员，就是不同状态的"变形"（transformation）。通过"态射"，一个成员可以变形成另一个成员。

## 函数式编程概念

- 函数式编程，其实相对于计算机的历史而言是一个非常古老的概念，甚至早于第一台计算机的诞生。
- 函数式编程不是用函数来编程，也不是传统的面向对象编程。主旨在于将复杂的函数复合成简单的函数。运算过程尽量写成一系列嵌套调用。
- JavaScript 是披着 C 外衣的 Lisp。
- 真正火热是随着 React 的高阶函数而逐步升温。

### 纯函数

- 对于相同的输入，永远得到相同的输出，而且没有任何可观察的副作用，也不依赖外部环境的状态。
- Array.clice 是纯函数，因为它没有副作用，对于固定的输入，输出总是固定的。

### 柯里化

传递给函数一部分参数来调用它，让它返回一个函数区处理剩下的参数。

```js
var checkage=>min=>(age=>age>min)
var checkage20=checkage(20)
checkage20(100)
```

### 函数组合

解决类似的函数嵌套问题 `f(h(j(k())))` 。定义一个组合函数来讲多个函数调用组合成一个。

```js
var compose=(f,g)=>(x=>f(g(x)));
```

### 声明式与命令式代码

- 命令式代码：通过编写一条又一条的指令，去让计算机执行一些动作，这其中一半都会涉及到很多繁杂的细节。
- 声明式代码：通过写表达式的方法来表明我们想干什么，问不是通过一步步的指示。

### 惰性函数

惰性函数式 “比较懒的函数”，只执行一次就不执行了，是因为缓存了上一次的结果，直接拿来用。

### 高阶函数

将函数当参数，把传入的函数做一个封装，然后返回这个封装函数，达到更高程度的抽象。

### 闭包

虽然外部 a 执行完毕，栈上的帧被释放，但是堆上的作用域并不能被释放，因此 x 依旧可以被外部函数访问，这样就形成的闭包。

```js
function a(x) {
  return function(y) {
    return x + y;
  };
}
var a1 = a(1);
a1(3); //4
```

## 函子

- 函数不仅可以用于同一个范畴中值得转换，还可以用于将一个范畴转换成另一个范畴。这就涉及到了函子(Functor)。
- 函子是函数式编程里面最重要的数据类型，也是基本的运算单位和功能单位。
- 函子是一种范畴，也就是说，是一个容器，它包含了值和变形关系。比较特殊的是，它的变形关系可以一次作用于每一个值，将当前容器变形成另一个容器。

```js
class Functor {
  constructor(val) {
    this.val = val;
  }

  map(f) {
    return Functor.of(f(this.val));
  }
}

Functor.of = function(value) {
  return new this(value);
};
```

### Maybe 函子

函子接受各种函数，处理容器内部的值。这里就有一个问题，容器内部的值可能是一个空值（比如 null），而外部函数未必有处理空值的机制，如果传入空值，很可能就会出错。

Maybe 函子就是为了解决这一类问题而设计的。简单说，它的 map 方法里面设置了空值检查。

```javascript
class Maybe extends Functor {
  constructor(value) {
    super();
    this.val = value;
  }
  isnothing() {
    return !!!this.val;
  }

  map(f) {
    if (this.isnothing()) {
      return Maybe.of(null);
    } else {
      return Maybe.of(f(this.val));
    }
  }
}
```

### Either 函子

条件运算 if...else 是最常见的运算之一，函数式编程里面，使用 Either 函子表达。

Either 函子内部有两个值：左值（Left）和右值（Right）。右值是正常情况下使用的值，左值是右值不存在时使用的默认值。

```javascript
class Either extends Functor {
  constructor(value) {
    super();
    this.val = value;
  }
  isnothing() {
    return !!!this.val;
  }
  map(left, right) {
    if (this.isnothing()) {
      return Either.of(left(null));
    } else {
      return Either.of(right(this.val));
    }
  }
}
```

### AP 函子

AP 函子的意义在于，对于那些多参数的函数，就可以从多个容器之中取值，实现函子的链式操作。

```javascript
class Ap extends Functor {
  constructor(value) {
    super();
    this.val = value;
  }
  ap(F) {
    return Ap.of(this.val(F.val));
  }
}
```

### Monad 函子

Monad 函子的作用是，总是返回一个单层的函子。它有一个 flatMap 方法，与 map 方法作用相同，唯一的区别是如果生成了一个嵌套函子，它会取出后者内部的值，保证返回的永远是一个单层的容器，不会出现嵌套的情况。

```js
class Monad extends Functor {
  constructor(value) {
    super();
    this.val = value;
  }
  join() {
    return this.val;
  }
  map(f) {
    return Monad.of(f(this.val)).join();
  }
}
```

### IO 函子

Monad 函子的重要应用，就是实现 I/O （输入输出）操作。

```js
class IO extends Functor {
  constructor(value) {
    super();
    this.val = value;
  }
  flatMap() {
    return this.val;
  }
  map(f) {
    return IO.of(f(this.val));
  }
}
var a = IO.of(2);

function readOne() {
  return IO.of(function() {
    window.aaa = 100;
  });
}
readOne().flatMap()();
```

## 常用的函数式编程的库

- RxJS
- CycleJS
- LoadshJS
- UnderscoreJS
- RamdaJS

## 实际运用场景

- 易调试（无副作用，同样的输入一定是同样的输出）
- 单元测试

## 小结

- 1、面向过程编程：想到哪写到哪。
- 2、面向对象编程：共有的属性和方法封装到一个类里（封装 继承 多态）。
- 3、面向切面编程：统计一个函数的执行时间。
- 4、函数式编程： 提纯无关业务的纯函数，函数套函数产生神奇的效果。
- 5、函数式编程不是用函数来编程，函数套函数让函数更强大。
- 6、javascript 函数称为一等公民。
- 7、对于函数式编程来讲，同样的输入一定会有同样的输出，永远不依赖外部的状态。
- 8、纯函数可以记忆（同样的输入一定会有同样的输出），不跟外界有任何关系，抽象代码方便单元测试。
- 9、函数式编程新建一个独立的 js ，通过代码的提纯，新建共有的 common.js ->libs 工具库。
- 10、函数柯里化：函数接受一堆参数，返回一个新函数，继续接受参数，能够处理业务逻辑。
- 11、函数柯里化：他可以记住参数，相当于是对参数的一种缓存。
- 12、函数组合是为了解决柯里化函数所最后生成的洋葱式的代码。
- 13、组合函数相当于把一页页的洋葱贴起来。
- 14、吧一些对象自带的方法转化成纯函数，不要生成转瞬即逝的中间变量。
- 15、声明式的代码越来越受欢迎，只要提供一条条的指令，程序自己知道怎么做而不是一步一步的告诉。
- 16、惰性函数就是比较懒的函数，下一次就不想再求值了。
- 17、高阶函数：函数传给函数，让函数具有更复杂的能力和功能。
- 18、尾递归的性能要高于传统纯函数递归的性能。
- 19、函数式编程其实就是函数的种种核心技巧的拼接，但是函数是变成会充盈着大量的闭包，闭包是 js 中常见的核心知识。
- 20、常用的函数式编程的库：RxJS，CycleJS，LoadshJS，UnderscoreJS，RamdaJS。
- 21、抽象业务逻辑，系统里有很多可以复用，组合起来有更强大的功能的时候，抽库，增加代码健壮性，方便单元测试。
- 22、函数式编程的唯一影响因素就是输入和输出。
- 23、解决多线程死锁问题，每一个函数式编程里面，根本不设计到外部的那个被几个线程争执的变量。
- 24、范畴代表一个容器，容器内部有两种因素组成，一个 value ，一个变形关系。
- 25、变形关系也是函数，这个变形关系只能作用于单独的该容器下的一个元素，但是范畴和范畴之间可以相互转化，用到的也是变形函数，但是这个变形函数非常特殊，因为它能作用于当前容器的每一个元素，他有一个特殊的名字——函子，这些函子本身都是数学方法，后来被依次利用到函数式编程中。
- 26、本来一个函数不可以调用自身的函数，函子可以，容器只留出一个接口 map ，可以运行容器内的函数。
- 27、一个容器一旦接受了变形关系，接受一个函子，接受一个函数，就可以变成一个新的容器。
- 28、加一层容错机制 Maybe ，处理不纯的函数 IO 。

## 参考链接

[函数式编程入门教程](http://www.ruanyifeng.com/blog/2017/02/fp-tutorial.html)
