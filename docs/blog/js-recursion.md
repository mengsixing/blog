# JS 函数尾递归优化

尾递归之所以需要优化，原因是调用栈太多，造成溢出，那么只要减少调用栈，就不会溢出。怎么做可以减少调用栈呢？就是采用“循环”换掉“递归”。

## 一个普通的递归函数

```js
function sum(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1);
  } else {
    return x;
  }
}
sum(1, 1000000);
// Uncaught RangeError: Maximum call stack size exceeded
```

函数调用会在内存形成一个调用记录，称调用帧，保存调用位置和内部变量等信息。

每一次循环调用函数，外层函数就会记录内层函数的调用帧，所有调用帧形成了一个调用栈，如果调用帧太多，就会发生栈溢出。

## 蹦床函数

sum 这里只是返回一个函数，并不会执行，这样就避免了递归执行函数，消除调用栈过大的问题。

```js
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}

function sum(x, y) {
  if (y > 0) {
    // 返回一个新的函数
    return sum.bind(null, x + 1, y - 1);
  } else {
    return x;
  }
}

trampoline(sum(1, 1000000));

// 1000001
```

## 尾递归优化

```js
function tco(f) {
  var value;
  var active = false;
  var accumulated = [];
  return function accumulator(...rest) {
    accumulated.push(rest);
    if (!active) {
      active = true;
      while (accumulated.length) {
        value = f.apply(this, accumulated.shift());
      }
      active = false;
      console.log(value);
      return value;
    }
  };
}

var sum = tco(function(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1);
  } else {
    return x;
  }
});

sum(1, 1000000);
```

上面代码中，tco 函数是尾递归优化的实现，他的奥秘就在于状态变量 active。默认情况下，这个变量是不被激活的。一旦进入尾递归优化的过程，这个变量就被激活了。每一轮递归 sum 返回的都是 undefined，所以就避免了递归执行，而 accumulated 数组存放每一轮 sum 执行的参数，总是有值的，这就保证了 accumulator 函数内部的 while 循环总会执行，巧妙地将“递归”改成了“循环”，而后一轮的参数会取代前一轮的参数，保证调用栈只有一层。

## 参考链接

[尾调用优化](http://es6.ruanyifeng.com/#docs/function#%E5%B0%BE%E8%B0%83%E7%94%A8%E4%BC%98%E5%8C%96)
