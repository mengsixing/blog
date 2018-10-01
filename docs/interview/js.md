# JS面试题

## 请简述 JavaScript 中的 this

- 在调用函数时使用 new 关键字，函数内的 this 是一个全新的对象。
- 如果 apply、call 或 bind 方法用于调用、创建一个函数，函数内的 this 就是作为参数传入这些方法的对象。
- 当函数作为对象里的方法被调用时，函数内的 this 是调用该函数的对象。比如当 obj.method()被调用时，函数内的 this 将绑定到 obj 对象。
- 如果调用函数不符合上述规则，那么 this 的值指向全局对象（global object）。浏览器环境下 this 的值指向 window 对象，但是在严格模式下('use strict')，this 的值为 undefined。
- 如果符合上述多个规则，则较高的规则（1 号最高，4 号最低）将决定 this 的值。
- 如果该函数是 ES2015 中的箭头函数，将忽略上面的所有规则，this 被设置为它被创建时的上下文。

## offsetWidth，clientWidth，scrollWidth 的区别？

clientWidth：元素的 width + padding

offsetWidth：元素的 width + padding + border

scrollWidth：

- 内部元素小于外部元素，scrollWidth = clientWidth
- 内部元素大于外部元素，scrollWidth = 内部元素 offsetWidth + 外部 padding

[测试 offsetWidth，clientWidth，scrollWidth](https://codepen.io/yhlben/pen/WgowLz)

## 节流函数怎么写？

定义：触发函数事件后，短时间间隔内无法连续调用，只有上一次函数执行后，过了规定的时间间隔，才能进行下一次的函数调用。

```js
function throttle(callback, timeout) {
  var last = 0;
  return function(...rest) {
    var now = new Date();
    if (now - last > timeout) {
      callback.apply(this, rest);
      callback.throttleId = null;
      last = now;
    }
  };
}
```

## 防抖函数？

定义：多次触发事件后，事件处理函数只执行一次，并且是在触发操作结束时执行。

```js
function debounce(callback, timeout) {
  var id;
  return function() {
    clearInterval(id);
    id = setTimeout(() => {
      this.callback.apply(this, arguments);
    }, timeout);
  };
}
```

## arguments 是数组吗？怎么实现用它调用数组方法？类数组和数组的区别是什么？arguments 有 length 属性吗？ 为什么要遍历类数组取值组成数组，还有更简单的方法吗？

1、arguments 不是数组，但有 length 属性。

2、可以转换成数组，因为他有 Symbol(Symbol.iterator) 方法。

```js
[...arguments];
Array.prototype.slice.call(arguments);
Array.from(arguments);
```

3、类数组是一个对象，typeof 判断出来就不一致。
类数组无法使用数组方法。

## 手写一个 bind 函数。

```js
Function.prototype.bind = function(ctx) {
  var that = this;
  var NoFunc = function() {};
  var result = function(...rest) {
    console.warn("instade of :", this instanceof that);
    that.apply(this instanceof that ? this : that, rest);
  };
  NoFunc.prototype = that.prototype;
  result.prototype = new NoFunc();
  return result;
};
```

## promise、setTimeout、async/await 的执行顺序。

setTimeout 是宏任务。
promise 和 async/await 是微任务。

执行顺序：宏任务-》微任务-》宏任务

## 用过 NodeJS 的 EventEmitter 模块吗，它是怎么实现功能的，步骤是什么？

类似于 [观察者模式](https://yhlben.github.io/blog/js-observer.html)

## fetch 和 ajax 的比较

Ajax 的本质是使用 XMLHttpRequest 对象来请求数据。（源生调用相当繁琐，得处理兼容性问题）。

fetch 采用了 Promise 的异步处理机制,更加简单.在默认情况下 fetch 不会接受或者发送 cookies


## js 中的`__proto__`和 prototype

任何对象都有一个 `__proto__` 属性

任何方法都有一个`prototype`属性，`prototype`也是一个对象 ，所以其中也有一个`__proto__`

prototype 它的作用很像 java 中的静态属性/方法。其中的对象可以给所有实例使用。

`__proto__`指向 new 出来的构造函数。

- 1 函数对象有`__proto__`和 prototype 属性
- 2 非函数对象只有`__proto__`属性
- 3 prototype 中有`__proto__`属性。且是 Object 构造函数创建的
- 4 函数对象`__proto__`指向它的创建者及 Function 构造函数
- 5 Function 构造函数`__proto__`指向它自己
- 6 Object 对象的 prototype 中的`__proto__`是 null
