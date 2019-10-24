# 深入 Koa 原理

通过[上一篇文章](library-koa.html)，我们已经了解到 Koa 是个非常精简的框架，实现起来难度并不大，这一章我们就一起来手写一个 koa 吧！

- 编写 application 文件
- 编写 request 和 response 文件
- 编写 context 文件

## 编写 application 文件

Application 文件是 koa 的核心，所有逻辑都会经过该文件调度。

### 开启 Web 服务器

首先，koa 作为一个 web 服务器框架，开启一个 web 服务器是最基本的方法。

- 封装 listen 方法开启服务器（底层调用 http.createServer）。
- 在 http.createServer 回调函数中调用 callback 方法，执行中间件。
- 中间件执行不报错，会调用 respond 方法，对返回及结果进行操作。
- 中间件执行报错，会调用 onerror 方法，输出错误信息到客户端。

```js
const http = require('http');
const Emitter = require('events');

// koa 继承至 events，这样就可以在实例上使用 on 方法监听事件。
class DiyKoa extends Emitter {
  constructor() {
    super();
    this.middlewares = [];
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
  // compose(){}
  // responseBody
  // onerror
  callback() {
    const fnMiddleware = this.compose(this.middlewares);
    return (req, res) => {
      const ctx = this.createContext(req, res);
      const respond = this.responseBody(ctx);
      const onerror = this.onerror(ctx);
      return fnMiddleware(ctx)
        .then(respond)
        .catch(onerror);
    };
  }
  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }
}

module.exports = DiyKoa;
```

### 创建 context 代理请求和响应

为了更方便用户的操作，koa 将请求和响应两个对象进行了代理，通过创建 context 对象，掌管整个请求和响应。

```js
class DiyKoa extends Emitter {
  // 具体代理操作见下文
  createContext(req, res) {
    const ctx = this.context;
    ctx.request = this.request;
    ctx.response = this.response;
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }
}
```

### 封装中间件执行逻辑

上一章 koa 中间件介绍时，我们知道，中间件执行的顺序类似于洋葱模型，即：先按正序执行中间件 next 前半部分的代码，然后按倒序执行中间件 next 后半部分的代码。

笔者没有使用官方版本编写 compose 函数，而是通过函数组合的方式实现了该洋葱模型。

- 初始化 next 方法。
- 遍历所有中间件。
  - 将遍历到的中间件封装到新 next 方法中，并覆盖掉老 next 方法。
  - 封装之后，下一个中间件的 next 方法中就包含上一个中间件的代码。
- 执行 next 方法。

```js
class DiyKoa extends Emitter {
  compose(middlewares) {
    return async ctx => {
      let next = async () => {
        await Promise.resolve();
      };
      function createNext(middleware, oldNext) {
        return async () => {
          await middleware(ctx, oldNext);
        };
      }
      for (let i = middlewares.length - 1; i >= 0; i--) {
        const currentMiddleware = middlewares[i];
        next = createNext(currentMiddleware, next);
      }
      await next();
    };
  }
}
```

### 中间件执行完成后的操作

中间件执行完成后会执行以下方法。

- responseBody 向客户端输出数据之前，进行数据的处理。
- onerror 如果中间件出错，则做出对应操作。

```js
class DiyKoa extends Emitter {
  responseBody(ctx) {
    return () => {
      const context = ctx.body;
      if (typeof context === 'object') {
        ctx.res.end(JSON.stringify(context));
      } else {
        ctx.res.end(context);
      }
    };
  }
  onerror(ctx) {
    return err => {
      if (err.code === 'ENOENT') {
        ctx.status = 404;
      } else {
        ctx.status = 500;
      }
      let msg = err.message;
      ctx.res.end(msg);
      this.emit('error', err);
    };
  }
}
```

## 编写 request 和 response 文件

Request 和 Response 文件是对请求和响应的一层浅封装，提供一套更加方便的请求响应处理方法。

### 编写 request 文件

```js
var url = require('url');

// 封装源生 request 操作
// 例如：增加quert方法，快速定位参数。headers 方法快速扩区headers字段
module.exports = {
  get query() {
    return url.parse(this.req.url, true).query;
  },
  get url() {
    return this.req.url;
  }
};
```

### 编写 response 文件

```js
// 封装源生 response 操作
// 例如：body 方法，统一返回数据到客户端。socket 方法，快速获取 res 中的 socket 对象。
module.exports = {
  get body() {
    return this._body;
  },
  set body(data) {
    this._body = data;
  },
  get status() {
    return this.res.statusCode;
  },
  set status(code) {
    if (typeof code !== 'number') {
      throw new Error('statusCode 只能是数字');
    }
    this.res.statusCode = code;
  }
};
```

## 编写 context 文件

在 context 文件中代理 request 和 response。

- 使用`__defineSetter__`方法代理 set 请求。
- 使用`__defineGetter__`方法代理 get 请求。

```js
let proto = {};

function delegateSet(property, name) {
  proto.__defineSetter__(name, function(val) {
    this[property][name] = val;
  });
}

function delegateGet(property, name) {
  proto.__defineGetter__(name, function() {
    return this[property][name];
  });
}

// 定义需要代理的属性
let requestSet = [];
let requestGet = ['query', 'url'];

let responseSet = ['body', 'status'];
let responseGet = responseSet;

requestSet.forEach(item => {
  delegateSet('request', item);
});
requestGet.forEach(item => {
  delegateGet('request', item);
});

responseSet.forEach(item => {
  delegateSet('response', item);
});
responseGet.forEach(item => {
  delegateGet('response', item);
});

module.exports = proto;
```

## 总结

本文从头到尾实现了一个简单的 koa 框架原型，最后总结了一张图，供大家参考。

![koa 流程图](library-koa-diy-flow.png)

## 相关链接

- [diy-koa 代码仓库](https://github.com/lmjben/diy-koa)
