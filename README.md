# 个人博客

[![Build Status](https://www.travis-ci.org/mengsixing/blog.svg?branch=master)](https://www.travis-ci.org/mengsixing/blog)
[![CodeFactor](https://www.codefactor.io/repository/github/mengsixing/blog/badge)](https://www.codefactor.io/repository/github/mengsixing/blog) [![Greenkeeper badge](https://badges.greenkeeper.io/mengsixing/blog.svg)](https://greenkeeper.io/)

记录工作中遇到的问题，平时看书的总结，面试题，以及一些个人思考。

访问地址：[mengsixing.github.io](https://mengsixing.github.io/)

## 使用

博客采用 vuepress 作为主框架，lint-md 作为语法检查工具。

```sh
# clone with Git Bash
git clone https://github.com/mengsixing/blog.git

# change directory
cd blog

# install dependencies
npm i

# serve with hot reload at localhost:8080
npm run dev

# check grammatical errors and fix
npm run lint:fix

# build for production with minification
npm run build
```

本文中的内容已同步到微信公众号【前端日志】，欢迎大家订阅。

![前端日志](https://cdn.yinhengli.com/qianduanrizhi.png)

## 目录整理

### | 文章分类

- [我的前端知识清单](https://mengsixing.github.io/blog/frontend.html)

#### | DevOps

- [Kubernetes 使用总结](https://mengsixing.github.io/blog/devops-kubernetes.html)
- [Docker 使用总结](https://mengsixing.github.io/blog/devops-docker.html)
- [Git 常用使用方式](https://mengsixing.github.io/blog/devops-git.html)
- [Package.json 依赖管理](https://mengsixing.github.io/blog/devops-dependencies.html)
- [合理选择图片格式](https://mengsixing.github.io/blog/devops-image.html)
- [前端性能优化](https://mengsixing.github.io/blog/devops-performance.html)
- [Commitlint 使用总结](https://mengsixing.github.io/blog/devops-commitlint.html)
- [实现一个自己的 CLI](https://mengsixing.github.io/blog/devops-cli-diy.html)
- [前端测试](https://mengsixing.github.io/blog/devops-test.html)
- [Webpack 系列（三）整体流程分析](https://mengsixing.github.io/blog/devops-webpack-entry.html)
- [Webpack 系列（二）手写模块打包代码](https://mengsixing.github.io/blog/devops-webpack-flow.html)
- [Webpack 系列（一）使用总结](https://mengsixing.github.io/blog/devops-webpack.html)
- [实战：手搭一个 React，Typescript，Koa，GraphQL 环境](https://mengsixing.github.io/blog/devops-webpack-cdfang-spider.html)

#### | Framework

- [Node.js 使用总结](https://mengsixing.github.io/blog/library-node.html)
- [React 使用总结](https://mengsixing.github.io/blog/library-react.html)
- [React 核心知识](https://mengsixing.github.io/blog/libary-react-core.html)
- [React 源码解析（一）JSX 转换](https://mengsixing.github.io/blog/library-react-code-1.html)
- [React 源码解析（二）FiberRoot 构建](https://mengsixing.github.io/blog/library-react-code-2.html)
- [React 源码解析（三）Fiber 的调度过程](https://mengsixing.github.io/blog/library-react-code-3.html)
- [React 源码解析（四）深入理解 fiber 更新过程](https://mengsixing.github.io/blog/library-react-code-4.html)
- [React 服务器端渲染](https://mengsixing.github.io/blog/library-react-ssr.html)
- [使用 React Hooks 节省 90% 的代码](https://mengsixing.github.io/blog/library-react-hooks.html)
- [Vue 使用总结](https://mengsixing.github.io/blog/library-vue.html)
- [小程序使用总结](https://mengsixing.github.io/blog/library-miniProgram.html)
- [Redux 使用总结](https://mengsixing.github.io/blog/library-redux.html)
- [React Hooks 替代 React-Redux](https://mengsixing.github.io/blog/library-react-redux-code.html)
- [RxJS 使用总结](https://mengsixing.github.io/blog/library-rxjs.html)
- [Koa 源代码阅读](https://mengsixing.github.io/blog/libary-koa.html)
- [深入 Koa 原理](https://mengsixing.github.io/blog/library-koa-diy.html)

#### | CSS

- [CSS 使用总结](https://mengsixing.github.io/blog/css.html)
- [CSS 模块化](https://mengsixing.github.io/blog/css-modules.html)
- [CSS IFC 总结](https://mengsixing.github.io/blog/css-ifc.html)
- [CSS Flex 布局总结](https://mengsixing.github.io/blog/css-flex.html)
- [CSS NEXT 语法](https://mengsixing.github.io/blog/css-next.html)
- [CSS 有趣的特性](https://mengsixing.github.io/blog/css-useful.html)
- [CSS 设备像素比](https://mengsixing.github.io/blog/css-devicePixelRatio.html)
- [CSS Houdini 画一片星空](https://mengsixing.github.io/blog/css-houdini-star.html)

#### | 网络协议

- [HTTP 协议总结](https://mengsixing.github.io/blog/osi-http.html)
- [HTTPS 协议总结](https://mengsixing.github.io/blog/osi-https.html)
- [TCP 协议总结](https://mengsixing.github.io/blog/osi-tcp.html)
- [Web 安全](https://mengsixing.github.io/blog/osi-web-security.html)
- [Web 登录鉴权](https://mengsixing.github.io/blog/osi-web-login.html)
- [流量劫持](https://mengsixing.github.io/blog/osi-hijack.html)

#### | 运维

- [Docker 微服务 Demo](https://mengsixing.github.io/blog/operation-docker-micro-service.html)
- [Linux 快捷键](https://mengsixing.github.io/blog/operation-linux.html)
- [Linux 免密登录配置](https://mengsixing.github.io/blog/operation-linux-login.html)
- [Linux 替换文件内容命令](https://mengsixing.github.io/blog/operation-linux-file.html)
- [Nginx Location 匹配规则](https://mengsixing.github.io/blog/operation-nginx-match.html)
- [Nginx 负载均衡 Demo](https://mengsixing.github.io/blog/operation-nginx-load-balancing.html)

#### | JS 基础

- [JS 编译器，解释引擎](https://mengsixing.github.io/blog/js-principle.html)
- [JS 理解 Promise](https://mengsixing.github.io/blog/js-promise.html)
- [JS 理解 This](https://mengsixing.github.io/blog/js-this.html)
- [JS 运算符优先级](https://mengsixing.github.io/blog/js-operator-priority.html)
- [JS Bridge 总结](https://mengsixing.github.io/blog/js-jsBridge.html)
- [JS 模块化](https://mengsixing.github.io/blog/js-module.html)
- [JS 实现继承](https://mengsixing.github.io/blog/js-inherit.html)
- [JS 事件](https://mengsixing.github.io/blog/js-event.html)
- [JS 表单基础知识](https://mengsixing.github.io/blog/js-form.html)
- [JS PostMessage & 拖放 API](https://mengsixing.github.io/blog/js-html5-program.html)
- [JS 函数尾递归优化](https://mengsixing.github.io/blog/js-recursion.html)
- [JS 对象属性的遍历](https://mengsixing.github.io/blog/js-object-ergodic.html)

#### | 编程基础

- [Typescript 使用总结](https://mengsixing.github.io/blog/base-typescript.html)
- [GraphQL 使用总结](https://mengsixing.github.io/blog/base-graphql.html)
- [你需要知道的依赖注入](https://mengsixing.github.io/blog/base-ioc.html)
- [函数式编程](https://mengsixing.github.io/blog/base-functional.html)
- [Web Component 基础](https://mengsixing.github.io/blog/base-webcomponents.html)
- [数据结构与算法](https://mengsixing.github.io/blog/base-structure.html)
- [查找算法](https://mengsixing.github.io/blog/base-structure-base-select.html)
- [基本排序算法](https://mengsixing.github.io/blog/base-structure-base-sort.html)
- [高级算法](https://mengsixing.github.io/blog/base-structure-high-algorithm.html)
- [高级排序算法](https://mengsixing.github.io/blog/base-structure-senior-sort.html)
- [设计模式](https://mengsixing.github.io/blog/base-design-pattern.html)
- [计算机组成原理](https://mengsixing.github.io/blog/base-computer.html)
- [专业术语](https://mengsixing.github.io/blog/base-technology.html)

#### | 总结思考

- [我的 2020 总结（上）](https://mengsixing.github.io/blog/2020-6.html)
- [我的 2019 总结（下）](https://mengsixing.github.io/blog/2019-12.html)
- [我的 2019 总结（上）](https://mengsixing.github.io/blog/2019-6.html)
- [我的 2018 总结](https://mengsixing.github.io/blog/2018.html)

#### | 其他

- [常用工具整理](https://mengsixing.github.io/blog/other-tools.html)
- [VSCode 常用快捷键](https://mengsixing.github.io/blog/other-vscode.html)
