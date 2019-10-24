# 个人博客

[![Build Status](https://www.travis-ci.org/lmjben/blog.svg?branch=master)](https://www.travis-ci.org/lmjben/blog)
[![CodeFactor](https://www.codefactor.io/repository/github/lmjben/blog/badge)](https://www.codefactor.io/repository/github/lmjben/blog) [![Greenkeeper badge](https://badges.greenkeeper.io/lmjben/blog.svg)](https://greenkeeper.io/)

记录工作中遇到的问题，平时看书的总结，面试题，以及一些个人思考。

访问地址：[lmjben.github.io](https://lmjben.github.io/)

## 使用

博客采用 vuepress 作为主框架，lint-md 作为语法检查工具。

```sh
# clone with Git Bash
git clone https://github.com/lmjben/blog.git

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

## 目录整理

### | 文章分类

- [我的前端知识清单](https://lmjben.github.io/blog/frontend.html)
- [我的 2019 总结（上）](https://lmjben.github.io/blog/2019-6.html)
- [我的 2018 总结](https://lmjben.github.io/blog/2018.html)

#### | DevOps

- [Kubernetes 使用总结](https://lmjben.github.io/blog/devops-kubernetes.html)
- [Docker 使用总结](https://lmjben.github.io/blog/devops-docker.html)
- [Git 常用使用方式](https://lmjben.github.io/blog/devops-git.html)
- [Package.json 依赖管理](https://lmjben.github.io/blog/devops-dependencies.html)
- [合理选择图片格式](https://lmjben.github.io/blog/devops-image.html)
- [前端性能优化](https://lmjben.github.io/blog/devops-performance.html)
- [Commitlint 使用总结](https://lmjben.github.io/blog/devops-commitlint.html)
- [前端测试](https://lmjben.github.io/blog/devops-test.html)
- [Webpack 系列（三）整体流程分析](https://lmjben.github.io/blog/devops-webpack-entry.html)
- [Webpack 系列（二）手写模块打包代码](https://lmjben.github.io/blog/devops-webpack-flow.html)
- [Webpack 系列（一）使用总结](https://lmjben.github.io/blog/devops-webpack.html)
- [实战：手搭一个 React，Typescript，Koa，GraphQL 环境](https://lmjben.github.io/blog/devops-webpack-cdfang-spider.html)

#### | Framework

- [Node.js 使用总结](https://lmjben.github.io/blog/library-node.html)
- [React 使用总结](https://lmjben.github.io/blog/library-react.html)
- [React 核心知识](https://lmjben.github.io/blog/libary-react-core.html)
- [React 服务器端渲染](https://lmjben.github.io/blog/library-react-ssr.html)
- [使用 React Hooks 节省 90% 的代码](https://lmjben.github.io/blog/library-react-hooks.html)
- [Vue 使用总结](https://lmjben.github.io/blog/library-vue.html)
- [小程序使用总结](https://lmjben.github.io/blog/library-miniProgram.html)
- [Redux 使用总结](https://lmjben.github.io/blog/library-redux.html)
- [RxJS 使用总结](https://lmjben.github.io/blog/library-rxjs.html)
- [Koa 源代码阅读](https://lmjben.github.io/blog/libary-koa.html)

#### | CSS

- [CSS 使用总结](https://lmjben.github.io/blog/css.html)
- [CSS NEXT 语法](https://lmjben.github.io/blog/css-next.html)
- [CSS 有趣的特性](https://lmjben.github.io/blog/css-useful.html)
- [CSS 设备像素比](https://lmjben.github.io/blog/css-devicePixelRatio.html)
- [CSS Houdini 画一片星空](https://lmjben.github.io/blog/css-houdini-star.html)

#### | 网络协议

- [HTTP 协议总结](https://lmjben.github.io/blog/osi-http.html)
- [HTTPS 协议总结](https://lmjben.github.io/blog/osi-https.html)
- [Web 安全](https://lmjben.github.io/blog/osi-web-security.html)
- [Web 登录鉴权](https://lmjben.github.io/blog/osi-web-login.html)
- [流量劫持](https://lmjben.github.io/blog/osi-hijack.html)

#### | 运维

- [Docker 微服务 Demo](https://lmjben.github.io/blog/operation-docker-micro-service.html)
- [Linux 快捷键](https://lmjben.github.io/blog/operation-linux.html)
- [Linux 免密登录配置](https://lmjben.github.io/blog/operation-linux-login.html)
- [Nginx 负载均衡 Demo](https://lmjben.github.io/blog/operation-nginx-load-balancing.html)

#### | JS 基础

- [JS 理解 Promise](https://lmjben.github.io/blog/js-promise.html)
- [JS 理解 This](https://lmjben.github.io/blog/js-this.html)
- [JS Bridge 总结](https://lmjben.github.io/blog/js-jsBridge.html)
- [JS 模块化](https://lmjben.github.io/blog/js-module.html)
- [JS 实现继承](https://lmjben.github.io/blog/js-inherit.html)
- [JS 事件](https://lmjben.github.io/blog/js-event.html)
- [JS 表单基础知识](https://lmjben.github.io/blog/js-form.html)
- [JS PostMessage & 拖放 API](https://lmjben.github.io/blog/js-html5-program.html)
- [JS 函数尾递归优化](https://lmjben.github.io/blog/js-recursion.html)
- [JS 对象属性的遍历](https://lmjben.github.io/blog/js-object-ergodic.html)

#### | 编程基础

- [函数式编程](https://lmjben.github.io/blog/base-functional.html)
- [数据结构与算法](https://lmjben.github.io/blog/base-structure.html)
- [查找算法](https://lmjben.github.io/blog/base-structure-base-select.html)
- [基本排序算法](https://lmjben.github.io/blog/base-structure-base-sort.html)
- [高级排序算法](https://lmjben.github.io/blog/base-structure-senior-sort.html)
- [高级算法](https://lmjben.github.io/blog/base-structure-high-algorithm.html)
- [设计模式](https://lmjben.github.io/blog/base-design-pattern.html)

#### | 其他

- [常用工具整理](https://lmjben.github.io/blog/other-tools.html)
- [VSCode 常用快捷键](https://lmjben.github.io/blog/other-vscode.html)
