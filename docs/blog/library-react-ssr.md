# React 服务器端渲染

最近在学习 React 的服务端渲染，于是使用 Express+React 写了一个 Demo，用于对比和客户端渲染的差异。[github 地址](https://github.com/lmjben/react-ssr-demo)

先看一下效果吧：

1、访问 [服务器端渲染 Online Demo](https://yinhengli.com:8084/)

2、我们可以看到，首屏数据很快的就显示出来了，可是页面的进度条却还在加载中（因为客户端 js 很大）。

3、当进度条加载完成后，页面才能进行交互操作（切换路由，登录等）。

4、查看网页源代码，页面内容都在页面中。

::: tip 提示
效果不明显的话，可以打开控制台，在 Network 栏 Disable cache，然后刷新。
:::

通过这次简单的访问，我们就能看出服务器端渲染的 2 大特点，`首屏直出`，`SEO 友好`。

- 服务器端渲染解决的问题
- 服务器端渲染流程
- 服务器端渲染实战
- 你可能不需要服务器端渲染

## 服务器端渲染解决的问题

1、访问 [客户端渲染 Online Demo](https://yinhengli.com:8086/)

2、我们可以看到，首屏至少等待了 6 秒才渲染出来，这对于一般的用户，是难以容忍的。

3、不过一旦渲染完成，页面就立即可交互了（切换路由，登录等）。

4、查看网页源代码，页面只有一个空 div 容器，而没有实际内容。

通过这次访问，我们就能看出客户端渲染的特点，**首屏加载时间长**，**SEO 不友好**，但**可见即可操作**。

其实我们在访问客户端渲染的页面时，请求到的只是一个 html 空壳，里面引入了一个 js 文件，所有的内容都是通过 js 进行插入，类似于这样：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>ssr</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="bundle.js"></script>
  </body>
</html>
```

正是因为页面是由 js 渲染出来的，所以会带来如下几个问题：

1、页面要等待 js 加载并执行完成了才能展示，**在这期间页面展现的是白屏**。

2、爬虫不能识别 js 内容，所以抓取不到任何数据，**不利于 SEO 优化**。

为了解决这 2 个问题，我们可以使用服务器端渲染。

## 服务器端渲染流程

之前说道，客户端渲染的页面，请求到的是一个 html 空壳，然后通过 js 去渲染页面。那如果请求到的直接是一个渲染好的页面，是不是就可以解决这 2 个问题了呢？

没错，服务器端渲染就是这个原理。

### 简化流程

1、服务器端使用 renderToString 直接渲染出包含页面信息的**静态 html**。

2、客户端根据渲染出的静态 html 进行**二次渲染**，做一些绑定事件等操作。

:::tip 提示

- 服务器端没有 DOM，Window 等概念，所以只能渲染出字符串，不能进行事件绑定，样式渲染等。
- 只有第一次访问页面时才使用服务器端渲染，之后会被客户端渲染接管。

:::

## 服务器端渲染实战

接下来我们一起来搭建一套 React 服务器端渲染项目。

### 编写路由

这里使用 react-router 对前后端代码进行同构。

1、客户端

使用 react-router-dom 下的 `BrowserRouter` 进行前端路由控制。

2、服务器端

使用 react-router-dom 下的 `StaticRouter` 进行静态路由控制，具体操作如下：

- 使用 react-router-config 下的 matchRoutes 匹配后端路由，使用 renderRoutes 渲染匹配到的路由。
- 使用 react-router-dom/server 下的 renderToString 方法，渲染出 html 字符串，并返回给前端。

::: tip 提示
使用 StaticRouter 中通过 context 可以和前端页面通信，传参。
:::

### 状态管理

在 React 中，我们常常使用 redux 来存储数据，管理状态。

1、客户端

使用 redux 进行状态管理，使用 react-redux 提供的 Provider 为组件注入 store。

2、服务器端

和客户端一样，但每一次接收到请求需产生一个新的 store，避免多个用户操作同一个 store。

### 数据请求

1、客户端

使用 axios 在 componentDidMount 中请求数据。

2、服务器端

同样使用 axios 去请求数据，但是服务器端不会触发 componentDidMount 生命周期。我们可以在后端匹配到路由的时候，进行数据请求，并把数据存入 redux 中的 store，然后渲染出包含数据的 html 页面，为了避免客户端二次请求，服务器端向 window 中注入 REDUX_STORE 数据，客户端直接使用此数据作为客户端 redux 的初始数据，以免发生数据抖动。

具体操作如下：

- 在 routes 对象上挂载一个自定义方法 loadData。
- 在服务器端 matchRoutes 后，如果有 loadData，则进行请求数据，并把请求到的数据写入 store 中。
- 服务器端等待请求完成后，再进行 renderToString 渲染。

:::tip 提示
项目中使用 easy-mock 注入 cookie 来模拟登录，由于 easy-mock 写入 cookie 采用了安全机制：使用了 _secure_ 和 _HttpOnly_，所以需使用 https 模拟来访问。
:::

### 样式处理

1、客户端

使用 css-loader，style-loader 打包编写好的 css 代码并插入到页面中。

2、服务器端

由于 style-loader 会插入到页面，而服务器端并没有 document 等概念，所以这里使用 isomorphic-style-loader 打包 css 代码。

- 引入 isomorphic-style-loader 后，客户端就可以通过 styles.\_getCss 方法获取到 css 代码。
- 通过 staticRouter 中的 context 把 css 代码传入到后端。
- 后端拼接好 css 代码，然后插入到 html 中，最后返回给前端。

### SEO 优化

SEO 主要是针对搜索引擎进行优化，为了提高网站在搜索引擎中的自然排名，但搜索引擎只能爬取落地页内容（查看源代码时能够看到的内容），而不能爬取 js 内容，我们可以在服务器端做优化。

常规的 SEO 主要是优化：**文字**，**链接**，**多媒体**。

- 内部链接尽量保持相关性
- 外部链接尽可能多
- 多媒体尽量丰富

由于网页上的文字，链接，图片等信息都是产品设计好的，技术层面不能实现优化。我们需要做的就是优化页面的 title，description 等，让爬虫爬到页面后能够展示的更加友好。

这里借助于 react-helmet 库，在服务期端进行 title，meta 等信息注入。

## 你可能不需要服务器端渲染

现在，我们成功地通过服务器端渲染解决了**首次加载白屏时间**和 **SEO 优化**。但也带来了一些问题：

- 服务器端压力增大。
- 引入了 node 中间层，可维护性增大。

以上两个问题归根结底还是钱的问题。服务器压力大，可以通过买更多的服务器来解决。可维护性增大，可以招募更多人来维护。但是对于小型团队来说，增加服务器，招募更多维护人员，都会额外增加的支出，所以在选择服务器端渲染时，要权衡好利弊。

### 解决 SEO 的另一种方法

如果只是想优化 SEO，不妨使用预渲染来实现，推荐使用 prerender 库来实现。

prerender 库的原理：_先请求客户端渲染的页面，把客户端渲染完成之后的结果，拿给爬虫看_，这样爬虫获取到的页面就是已经渲染好的页面。prerender 库在使用时会开启一个服务，通过传递 url 来解析客户端渲染页面，这就需要我们对服务器端架构进行调整。

> 判断 nginx 判断访问类型
>
> > 用户访问 ：直接走客户端渲染
> >
> > 爬虫访问 ：走预渲染

## 总结

通过这个服务器端渲染实战，让我加深了对服务器端的理解，如有错误，麻烦多多指正，谢谢大家！

如果觉得有用得话给个 ⭐ 吧。[react-ssr-demo](https://github.com/lmjben/react-ssr-demo)
