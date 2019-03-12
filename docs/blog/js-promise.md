# 手写一个 Promise

前段时间刷到了一个面试题，手写一个 Promise，发现要实现一个符合规范的 Promise 还真不简单，所以单独抽离出来总结一下。

## Promise/A+ 规范解读

要实现一个 Promise，首先应该遵守一下 Promise/A+ 规范规范，由于规范涉及面很广，这里就不详细介绍了，只介绍一下最核心的部分。

### Promise 的状态

Promise 的状态只有 3 中：等待态（pending）、完成态（fulfilled）或拒绝态（rejected）。

Promise 中的状态只能按以下方式改变：**一旦状态发生改变，就定死了，再也不能改变了**。

- pending -> fulfilled
- pending -> rejected

### Promise 的 then 方法

then 方法需要传递 2 个函数，分别为 Fulfilled 状态和 Rejected 状态的回调函数。

```js
promise.then(onFulfilled, onRejected)
```

- 如果 onFulfilled 和 onRejected 不是函数，则会被忽略。
  - 如果 onFulfilled 是一个函数，则当 Promise 状态转变成 Fulfilled 时，会被触发，并能获取 Resolve 中传递的值。
  - 如果 onRejected 是一个函数，则当 Promise 状态转变成 Rejected 时，会被触发，并能获取 Reject 中传递的值。
- then 方法可以被多次调用，按照调用顺序执行代码。
- then 方法同样返回一个 Promise 对象。

### Promise 的解析过程

当 Promise 的 resolve 方法调用时，会传入一个值，Promise 会根据值类型的不同，进行不同的处理。

- 如果 resolve 的参数是 Promise 本身，则会报循环 Promise 错误。
- **如果 resolve 的参数是一个 新 Promise**，则会等待新 Promise 的状态改变后，返回新 Promise 的值。
  - 如果新 Promise 的状态不是 Fulfilled 或者 Resolve，调用新 Promise 的 then 方法，直到状态改变为止。
- **如果 resolve 的参数是一个对象或者函数**，会检查是否含有 then 方法，如果有，则会被当成一个新 Promise 处理（通过上一步的方式处理）。
- 其他情况，则会直接返回 resolve 中的值。

## MyPromise 最终代码

```js
const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';
function MyPromise(fn) {
    // 初始化状态
    const self = this;
    self.state = PENDING;
    self.value = undefined;
    self.resolvedCallbacks = [];
    self.rejectedCallbacks = [];
    // 执行promise 函数，传入resolve
    try {
        fn(resolve, reject);
    } catch (reason) {
        reject(reason);
    }
    // 根据传递的resolve值，更新状态
    function resolve(val) {
        if (val instanceof MyPromise) {
        val.then(resolve, reject);
        }
        setTimeout(() => {
        if (self.state === PENDING) {
            self.value = val;
            self.state = RESOLVED;
            self.resolvedCallbacks.map(fn => fn(val));
        }
        }, 0);
    }
    function reject(val) {
        setTimeout(() => {
        if (self.state === PENDING) {
            self.value = val;
            self.state = REJECTED;
            self.rejectedCallbacks.map(fn => fn(val));
        }
        }, 0);
    }
}

MyPromise.prototype.then = function(onResolved, onRejected) {
// 处理then穿透
onResolved = typeof onResolved === 'function' ? onResolved : v => v;
onRejected =
    typeof onRejected === 'function'
    ? onRejected
    : v => {
        throw new Error(v);
        };

var self = this;
var promise2;
if (self.state === RESOLVED) {
    promise2 = new MyPromise(function(resolve, reject) {
    setTimeout(() => {
        var x = onResolved(self.value);
        resolvePromise(promise2, x, resolve, reject);
    }, 0);
    });
}
if (self.state === REJECTED) {
    promise2 = new MyPromise(function(resolve, reject) {
    setTimeout(() => {
        var x = onRejected(self.value);
        resolvePromise(promise2, x, resolve, reject);
    }, 0);
    });
}
if (self.state === PENDING) {
    promise2 = new MyPromise(function(resolve, reject) {
    self.resolvedCallbacks.push(function() {
        var x = onResolved(self.value);
        resolvePromise(promise2, x, resolve, reject);
    });
    self.rejectedCallbacks.push(function() {
        var x = onRejected(self.value);
        resolvePromise(promise2, x, resolve, reject);
    });
    });
}
return promise2;
};

//   这个函数主要是用于判断Promise的状态，根据resolve 传递的值来做不同判断。
function resolvePromise(promise2, x, resolve, reject) {
    var isCalled = false;
    if (promise2 === x) {
        throw new TypeError('循环引用');
    }
    // 如果resolve 返回的任然是一个新Promise，就会调用then，返回新promise的状态
    if (x instanceof MyPromise) {
        if (x.state === PENDING) {
        x.then(function(y) {
            resolvePromise(promise2, y, resolve, reject);
        }, reject);
        } else {
        x.then(resolve, reject);
        }
    }
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        // 如果resolve的是一个函数或者对象，会检查是否有then属性，如果有，则会被当成一个类promise对象进行操作
        // 具体操作，调用then方法，并递归调用resolvePromise函数检查状态。
        var then = x.then;
        if (then) {
        try {
            then.call(
            x,
            function(y) {
                resolvePromise(promise2, y, resolve, reject);
            },
            function(r) {
                return reject(r);
            }
            );
        } catch (reason) {
            reject(reason);
        }
        } else {
        resolve(x);
        }
    } else {
        resolve(x);
    }
}

MyPromise.prototype.catch = function(onRejected) {
return this.then(null, onRejected);
};
```

## 参考资料

[Promise/A+规范（中文）](https://segmentfault.com/a/1190000002452115)