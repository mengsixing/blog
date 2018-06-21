# 函数式编程

## 函数式编程起源
 * 函数式编程的起源，是一门叫做范畴论（Category Theory）的数学分支。
 * 彼此之间存在某种关系的概念、事物、对象等等，都构成"范畴"。随便什么东西，只要能找出它们之间的关系，就能定义一个"范畴"。
 * 箭头表示范畴成员之间的关系，正式的名称叫做"态射"（morphism）。范畴论认为，同一个范畴的所有成员，就是不同状态的"变形"（transformation）。通过"态射"，一个成员可以变形成另一个成员。

## 函数式编程基础
* 函数式编程（Functional Programming）其实相对于计算机的历史而言是一个非常古老的概念，甚至早于第一台计算机的诞生。函数式编程的基础模型来源于 λ 演算，而 λ 演算并非设计于在计算机上执行，它是由 Alonzo Church 和 Stephen Cole Kleene 在 20 世纪三十年代引入的一套用于研究函数定义、函数应用和递归的形式系统。
* 函数式编程不是用函数来编程，也不是传统的面向对象编程。主旨在于将复杂的函数复合成简单的函数。运算过程尽量携程一系列嵌套调用。
* JavaScript是披着C外衣的Lisp。
* 真正火热是随着React的高阶函数而逐步升温。

## 纯函数
* 对于相同的输入，永远得到相同的输出，而且没有任何可观察的副作用，也不依赖外部环境的状态。
* Array.clice 是纯函数，因为它没有副作用，对于固定的输入，输出总是固定的。

## 函数的柯里化
* 传递给函数一部分参数来调用它，让它返回一个函数区处理剩下的参数。

``` js
var checkage=>min=>(age=>age>min)
var checkage20=checkage(20)
checkage20(100)
```

## 函数组合
* 解决类似的函数嵌套问题f(h(j(k()))) 。
* var compose=(f,g)=>(x=>f(g(x)));

## Point Free
* 把一些对象自带的方法转化成纯函数，不要命名转瞬即逝的中间变量。

## 声明式于命令式代码
* 命令式代码：我们通过编写一条又一条的指令，去让计算机执行一些动作，这其中一半都会涉及到很多繁杂的细节。
* 声明式代码：我们通过写表达式的方法来表明我们想干什么，问不是通过一步步的指示。

## 惰性函数
* 惰性函数式 “比较懒的函数”，只执行一次就不执行了。

<hr />

## 高阶函数
* 函数当参数，把传入的函数做一个封装，然后返回这个封装函数，达到更高程度的抽象。

## 尾调用优化
* 函数内部的最后一个动作式函数的调用。该调用的返回值，直接返回给函数。
* 函数调用自身，称为递归。如果尾调用自身，就称为尾递归。
* 递归需要保存大量的调用记录，很容易发生栈溢出错误，如果使用尾递归优化，将递归变为循环，那么只需要保存一个调用记录，这样就不会发生栈溢出错误了。

## 闭包
* 虽然外部a执行完毕，栈上的帧被释放，但是堆上的作用域并不能被释放，因此x依旧可以被外部函数访问，这样就形成的闭包。

``` js
function a(x){
	return function(y){
		return x+y;
	}
}
var a1=a(1);
a1(3); //4
```
                                                                                                                                           
## 函子
* 函数不仅可以用于同一个范畴中值得转换，还可以用于将一个范畴转换成另一个范畴。这就涉及到了函子(Functor)。
* 函子是函数式编程里面最重要的数据类型，也是基本的运算单位和功能单位。
* 函子是一种范畴，也就是说，是一个容器，它包含了值和变形关系。比较特殊的是，它的变形关系可以一次作用于每一个值，将当前容器变形成另一个容器。

``` js
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
}

```

## Maybe函子

``` javascript
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

## Either函子 右值是正常情况下使用的值
``` javascript
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

## AP函子
``` javascript
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

## Monad函子
``` javascript
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

## IO函子
``` javascript
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
    })
}
readOne().flatMap()()
```

## 常用的函数式编程的库
* RxJS
* CycleJS
* LoadshJS
* UnderscoreJS
* RamdaJS

## 小结
* 1、面向过程编程：想到哪写到哪。
* 2、面向对象编程：共有的属性和方法封装到一个类里（封装 继承 多态）。
* 3、面向切面编程：统计一个函数的执行时间。
* 4、函数式编程：   提纯无关业务的村函数，函数套函数产生神奇的效果。
* 5、函数式编程不是用函数来编程，函数套函数让函数更强大。
* 6、javascript 函数称为一等公民。
* 7、对于函数式编程来讲，同样的输入一定会有同样的输出，永远不依赖外部的状态。
* 8、纯函数可以记忆（同样的输入一定会有同样的输出），不跟外界有任何关系，抽象代码方便单元测试。
* 9、函数式编程新建一个独立的 js ，通过代码的提纯，新建共有的 common.js ->libs 工具库。
* 10、函数柯里化：函数接受一堆参数，返回一个新函数，继续接受参数，能够处理业务逻辑。
* 11、函数柯里化：他可以记住参数，相当于是对参数的一种缓存。
* 12、函数组合是为了解决柯里化函数所最后生成的洋葱式的代码。
* 13、组合函数相当于把一页页的洋葱贴起来。
* 14、一目了然和系统提供的api保持一致，还有不要生成转瞬即逝的代码。
* 15、声明式的代码越来越受欢迎，只要提供一条条的指令，程序接知道怎么做而不是一步一步的告诉。
* 16、惰性函数就是比较懒的函数，下一次就不想再求值了。
* 17、高阶函数：函数传给函数，让函数具有更复杂的能力和功能。
* 18、尾递归的性能要高于传统纯函数递归的性能。
* 19、函数式编程其实就是函数的种种核心技巧的拼接，但是函数是变成会充盈着大量的闭包，闭包是js中常见的核心知识。
* 20、常用的函数式编程的库：RxJS，CycleJS，LoadshJS，UnderscoreJS，RamdaJS。
* 21、抽象业务逻辑，系统里有很多可以复用，组合起来有更强大的功能的时候，抽库，增加代码健壮性，方便单元测试。
* 22、函数式编程的唯一影响因素就是输入和输出。
* 23、解决多线程死锁问题，每一个函数式编程里面，根本不设计到外部的那个被几个线程争执的变量。
* 24、范畴代表一个容器，容器内部有两种因素组成，一个 value ，一个变形关系。
* 25、变形关系也是函数，这个变形关系只能作用于单独的该容器下的一个元素，但是范畴和范畴之间可以相互转化，用到的也是变形函数，但是这个变形函数非常特殊，因为它能作用于当前容器的每一个元素，他有一个特殊的名字——函子，这些函子本身都是数学方法，后来被依次利用到函数式编程中。
* 26、本来一个函数不可以调用自身的函数，函子可以，容器只留出一个接口 map ，可以运行容器内的函数。
* 27、一个容器一旦接受了变形关系，接受一个函子，接受一个函数，就可以变成一个新的容器。
* 28、加一层容错机制 Maybe ，处理不纯的函数 IO 。

                                                                                         
