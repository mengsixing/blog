# JS 面试题

## 1、请简述 JavaScript 中的 this

- 在调用函数时使用 new 关键字，函数内的 this 是一个全新的对象。
- 如果 apply、call 或 bind 方法用于调用、创建一个函数，函数内的 this 就是作为参数传入这些方法的对象。
- 当函数作为对象里的方法被调用时，函数内的 this 是调用该函数的对象。比如当 obj.method()被调用时，函数内的 this 将绑定到 obj 对象。
- 如果调用函数不符合上述规则，那么 this 的值指向全局对象（global object）。浏览器环境下 this 的值指向 window 对象，但是在严格模式下('use strict')，this 的值为 undefined。
- 如果符合上述多个规则，则较高的规则（1 号最高，4 号最低）将决定 this 的值。
- 如果该函数是 ES2015 中的箭头函数，将忽略上面的所有规则，this 被设置为它被创建时的上下文。

## 2、offsetWidth，clientWidth，scrollWidth 的区别

clientWidth：元素的 width + padding

offsetWidth：元素的 width + padding + border

scrollWidth：

- 内部元素小于外部元素，scrollWidth = clientWidth
- 内部元素大于外部元素，scrollWidth = 内部元素 offsetWidth + 外部 padding

[测试 offsetWidth，clientWidth，scrollWidth](https://codepen.io/yhlben/pen/WgowLz)

## 3、节流函数怎么写

定义：触发函数事件后，短时间间隔内无法连续调用，只有上一次函数执行后，过了规定的时间间隔，才能进行下一次的函数调用。

注意事项：

- 第一次立即执行
- 停止触发的时候还能再执行一次

```js
function throttle(callback, timeout) {
  var first = true;
  var throttleId;
  return function(...rest) {
    if (first) {
      callback.apply(this, rest);
      throttleId = null;
      first = false;
    } else if (!throttleId) {
      throttleId = setTimeout(() => {
        callback.apply(this, rest);
        throttleId = null;
      }, timeout);
    }
  };
}
```

## 4、防抖函数

定义：多次触发事件后，事件处理函数只执行一次，并且是在触发操作结束时执行。

注意点：

- this 指向
- event 对象
- 立刻执行

```js
function debounce(callback, timeout, immediate) {
  var id;
  return function() {
    clearInterval(id);
    if (immediate) {
      callback.apply(this, arguments);
      // 立即执行后，还原成间隔时间执行
      immediate = false;
    } else {
      id = setTimeout(() => {
        callback.apply(this, arguments);
      }, timeout);
    }
  };
}
```

## 5、arguments 是数组吗

arguments 是数组吗？怎么实现用它调用数组方法？类数组和数组的区别是什么？arguments 有 length 属性吗？ 为什么要遍历类数组取值组成数组，还有更简单的方法吗？

1、arguments 不是数组，但有 length 属性。

2、可以转换成数组，因为他有 Symbol(Symbol.iterator) 方法。

```js
[...arguments];
Array.prototype.slice.call(arguments);
Array.from(arguments);
```

3、类数组是一个对象，typeof 判断出来就不一致。
类数组无法使用数组方法。

## 6、手写一个 bind 函数

- 绑定 this
- bind 后可以被 new 函数调用
- 容错处理

```js
Function.prototype.bind2 = function(ctx, ...rest) {
  if (typeof this !== 'function') {
    throw new Error('只能由 function 调用');
  }
  const func = this;
  var result = function(...params) {
    return func.apply(
      // 如果是 new 对象出的，this绑定的应该绑定为构造函数
      this instanceof result ? this : ctx,
      rest.concat(params)
    );
  };
  var fNOP = function() {};
  fNOP.prototype = func.prototype;
  result.prototype = new fNOP();
  return result;
};
```

## 7、promise、setTimeout、async/await 的执行顺序。

setTimeout 是宏任务。
promise 和 async/await 是微任务。

执行顺序：宏任务-》微任务-》宏任务

## 8、用过 NodeJS 的 EventEmitter 模块吗，它是怎么实现功能的，步骤是什么？

类似于 [观察者模式](https://yhlben.github.io/blog/js-observer.html)

## 9、fetch 和 ajax 的比较

Ajax 的本质是使用 XMLHttpRequest 对象来请求数据。（源生调用相当繁琐，得处理兼容性问题）。

fetch 采用了 Promise 的异步处理机制,更加简单.在默认情况下 fetch 不会接受或者发送 cookies

## 10、js 中的`__proto__`和 prototype

- 任何对象都有一个 `__proto__` 属性。

- 任何方法都有一个 `prototype` 属性。

`__proto__`指向 new 出来的构造函数的原型`prototype`。

`prototype` 是一个对象，当函数被定义的时候默认被创建的，它的作用很像 java 中的静态属性/方法。其中的对象可以给所有实例使用。

需要注意的是：

`prototype` 也是一个对象 ，所以其中也有一个`__proto__`属性，指向对象的原型 `Object.protytype`。

`Object` 本身是构造函数，继承了 Function.prototype。`Object.__proto__ === Function.prototype`

`Function` 本身就是函数，继承了 Object.prototype。`Function.__proto__ === Function.prototype`

举一个例子：

```js
function A() {}

var a = new A();

console.log(a.__proto__ === A.prototype);

console.log(A.prototype.__proto__ === Object.prototype);

console.log(Object.prototype.__proto__ === null);

console.log(a.__proto__.__proto__.__proto__ === null);
```

任何一个对象都有一个**proto**属性，指向构造函数的原型 prototype，而 prototype 也是一个对象，所以就形成了一个链，到最后 Object.protytype 截止。

- 1 函数对象有 `__proto__` 和 prototype 属性
- 2 非函数对象只有 `__proto__` 属性
- 3 prototype 中有 `__proto__` 属性。且是 Object 构造函数创建的
- 4 函数对象 `__proto__` 指向它的创建者及 Function 构造函数
- 5 Function 构造函数 `__proto__` 指向它自己
- 6 Object 对象的 prototype 中的 `__proto__` 是 null

## 11、为什么 [] == false, !![] == true ？

先来看看[] ==false 的比较顺序。

- 1、[] == false
- 2、[] == 0
- 3、"" == 0
- 4、0 == 0

所以为 true。

在看一下 !![] == true

- 1、!![] == true

- 2、!false == true

- 3、true == true

所以为 true。

答案来源于 ecma 规范：

![ecma 条件判断](interview-abstractCompare.png)

## 12、Js new 过程中发生了什么

1，创建一个以这个函数为原型的空对象.

2，将函数的 `prototype` 赋值给对象的 `__proto__` 属性。

3，将对象作为函数的 `this` 传进去。如果有 return 出来东西是对象的话就直接返回 return 的内容，没有的话就返回创建的这个对象。

```js
function newFunc(faster, ...rest) {
  var result = {};
  result.__proto = faster.prototype;
  var result2 = faster.apply(result, rest);
  if (
    (typeof result2 === 'object' || typeof result2 === 'function') &&
    result2 !== null
  ) {
    return result2;
  }
  return result;
}
```

## 13、setTimeout 和 setInterval 方法有执行顺序吗

setTimeout 等待 xx 毫秒后，把方法推入异步队列。

setInterval 每隔 xx 毫秒，把方法推入异步队列。

setInterval 如果间隙比较小，而方法比较耗时时，会导致间隔不连续。

例如： 每隔 100ms 执行 fn，如果 fn 执行时间是 150ms，那么第二次执行，会在 150ms 处执行（异步事件会等待同步事件执行完后才执行）。

> 可以使用 setTimeout 自调用，在确方法执行完后，再推入异步队列。

## 14、手写一个 call 函数

```js
Function.prototype.myCall = function(context, ...rest) {
  // context是需要绑定的作用域
  var context = context || window;
  context.fn = this;
  var result = context.fn(rest);
  delete context.fn;
  return result;
};
```

## 15、写一个对象深拷贝

1、使用 JSON.parse(JSON.stringify(obj))。`不能拷贝值为 null，undefined，函数数据`。

2、使用 MessageChannel + postMessage，通过消息队列传递数据，实现深拷贝。`不能拷贝函数`。

3、手写函数判断

- 深拷贝
- 函数拷贝
- 处理循环依赖

```js
function deepClone(obj, cacheObj = new WeakMap()) {
  function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }
  function isArray(obj) {
    return Array.isArray(obj);
  }

  let result;
  // 拷贝简单类型
  if (!isObject(obj) && !isArray(obj)) {
    return obj;
  }

  if(isObject(obj)){
    result = {...obj};
  }

  if(isArray(obj)) {
    result = [...obj];
  }
  
  // 判断是否缓存过该对象
  if (cacheObj.has(obj)) {
    return cacheObj.get(obj[key]);
  }
  cacheObj.set(obj, result);
  for (var key in obj) {
    if (isObject(obj[key])) {
      result[key] = deepClone(obj[key], cacheObj);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}
```

## 16、分析这一段代码的返回结果

```js
var a = 0
var b = async () => {
  a = a + await 10
  console.log('b中的a：', a);
}
b()
a++
console.log('外部a：', a)
```

- 首先函数 b 先执行，在执行到 await 10 之前变量 a 还是 0，因为 await 内部实现了 generator ，generator 会保留堆栈中东西，所以这时候 a = 0 被保存了下来
- 因为 await 是异步操作，后来的表达式不返回 Promise 的话，就会包装成 Promise.reslove(返回值)，然后会去执行函数外的同步代码
- 同步代码执行完毕后开始执行异步代码，将保存下来的值拿出来使用，这时候 a = 0 + 10

上述解释中提到了 await 内部实现了 generator，其实 await 就是 generator 加上 Promise 的语法糖，且内部实现了自动执行 generator。如果你熟悉 co 的话，其实自己就可以实现这样的语法糖。

## 17、js 代码在 V8 中的优化

js 代码如果要运行起来，必须要一个编译器来编译（V8），以下是 V8 中编译代码的过程：

- 将 js 代码编译成抽象语法树（AST）。
- Ignition 将AST转化为 ByteCode。
- TuboFan 将ByteCode转化为 MachineCode（可选）。

我们都知道，机器码运行时的效率是最快的，所以如果能让更多的 js 代码转换成机器码，就能大幅度提高 js 运行效率。但受 js 动态类型的影响，V8 并不敢直接编译成机器语言，而是编译成 ByteCode，如果是一静态不变的内容，则可以直接编译成机器代码。

- 为了减少编译时间，可以压缩合并 js 代码，减少嵌套函数。
- 为了让 V8 优化代码，可以在定义函数时，保持入参一致，使用typescript。
