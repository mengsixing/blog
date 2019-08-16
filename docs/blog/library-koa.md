# Koa 源码阅读

最近看了一下 koa 的源码，发现源码逻辑非常清晰，这里做一个记录。

## Koa 的源码目录

koa 库源码核心很简单，就 4 个核心的 js 文件和 1 个控制 middleware 执行顺序的库 koa-compose。

```js
|- application.js
|- context.js
|- request.js
|- response.js
```

## request.js & response.js

这两个文件主要是对源生 node 返回对象的一些封装。

以 request.js 下的代码为例：

```js
var request = {
  get header() {
    return this.req.headers;
  },
  set header(val) {
    this.req.headers = val;
  }
};
```

封装后，就可以使用 this.request.header() 获取所有的 header 了。

## context.js

context.js 主要是封装当前上下文的方法和属性。

核心部分是使用了委托，将 response 和 request 都委托到了 context 上。

```js
delegate(proto, 'response')
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('set')
  .method('append')
  .method('flushHeaders')
  .access('status')
  .access('message');

delegate(proto, 'request')
  .method('acceptsLanguages')
  .method('acceptsEncodings')
  .method('acceptsCharsets')
  .method('accepts')
  .method('get')
  .method('is')
  .access('querystring')
  .access('idempotent')
  .access('socket')
  .access('search')
  .access('method');
```

通过委托以后，就可以通过 this.ctx.body 访问到 this.response.body。

## koa-compose 库

koa-compose 接收一个 middleware 的集合，并返回一个函数用来执行所有 middleware。

示例代码中的 middlewareArray 执行过程：

- 执行第一个中间件
  - 传入 context 和 next 方法。
  - next 方法会被绑定为执行下一个中间件的代码。
- 执行第二个中间件。
- 由于第二个中间件中并没有调用 next。
- 转到执行第一个中间件 next 之后的代码。

所以代码执行的顺序是洋葱式的代码。

```js
var middlewareArray = [
  function(context, next) {
    console.log(1);
    next();
    console.log(3);
  },
  function(context, next) {
    console.log(2);
  }
];
function compose(middleware) {
  return function(context, next) {
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      // 如果在一个 middleware 中调用了 2 次 next 方法，则会报错
      if (i <= index)
        return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}

var fn = compose(middlewareArray);
fn();
// 1
// 2
// 3
```

## application.js

application.js 主要是封装 use 方法和 listen 方法。

```js
import compose from 'koa-compose';
// 事件处理库，可使用app.on('xxx') 触发自定义事件
import Emitter from 'events';

class Application extends Emitter {
  listen(...args) {
    //   创建http服务器
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  callback() {
    // 调用 koa-compose 返回一个中间件执行函数。
    const fn = compose(this.middleware);
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
    return handleRequest;
  }

  handleRequest(ctx, fnMiddleware) {
    const handleResponse = () => respond(ctx);
    return fnMiddleware(ctx)
      .then(handleResponse)
      .catch(onerror);
  }

  createContext(req, res) {
    //   创建context
    const context = Object.create(this.context);
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  use(fn) {
    // 将中间件加入数组中
    this.middleware.push(fn);
    return this;
  }
}
```

- 在 craeteServer 结束后，会触发 callback。
- 在 cakllback 中调用 compose 将 middleware 传入进去。
- 当监听到请求的时候，就会按照顺序执行 middleware。

## 总结

Koa 是一个非常精简的框架，本身代码很少，所有功能都通过 middleware 来实现，很符合 Unix 哲学。
