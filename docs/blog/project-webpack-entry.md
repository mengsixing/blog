# Webpack 整体流程分析

让我们从 entry 开始，阅读 webpack 源码吧。

## webpack 运行流程

想想当我们执行 npm run build 后，webpack 是怎样运行的？

```js
// package.json文件
"scripts": {
    "build": "webpack",
}
```

先来个粗略的流程：

1、先检查是否有安装 webpack-cli，如果没安装，则提示安装。

2、引入 webpack-cli 包，解析参数后，调用 new webpack()。

3、创建编译对象 new Compiler()，并生成插件实例。

4、WebpackOptionsApply 方法用来解析参数，根据参数，初始化默认的插件 Plugins。

5、解析入口文件 SingleEntryPlugin ，并调用 doBuild 方法执行 loader。

6、执行完 loader 之后，调用 acorn.parse 生成 AST 依赖树，搜集模块的依赖。

7、最后调用 compilation.seal 进入 render 阶段，根据之前收集的依赖，决定生成多少文件，每个文件的内容是什么。

## webpack 常见核心概念

1、`Compiler`。 webpack 的运行入口，compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，
包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用，可以使用它来访问 webpack 的主环境。

2、`Compilation`。 对象代表了一次资源的构建，当运行 webpack 开发环境中间件时，每当检测到一个文件的变化，就会创建一个新的 compilation，从而生成一组
新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变换的文件、以及被跟踪依赖的状态信息。compilation 也提供了很多关键步骤的
回调，以供插件在自定义处理时选择使用。

3、`Module`。用于表示代码模块的基础类，关于代码模块的所有信息都会存在 module 实例中，例如 dependencies `记录代码模块的依赖`等。

创建一个 module 对象，主要操作：

- 搜集所有依赖的 module
- 执行对应的 loader

4、`Chunk`。一个 Chunk 是由一个或多个 Module 生成。一般根据入口文件生成 Chunk，然后把入口文件所依赖文件的 Module 集合加入到 Chunk 中。

生成 Chunk 的两种方式：

- 入口文件模块
- 动态引入的模块

5、`Parser`。基于 acorn 来分析 ast 语法树，解析出代码模块的依赖。

6、`Dependency`，解析时用于保存代码模块对应的依赖使用的对象。module 实例的 build 方法，在执行完对应的 loader 时，处理完模块自身的转换后，继续调用 parser 实例来解析自身依赖的模块，解析后的结果存放在 module.denpendencies 中，首先保存的是依赖的路径，后续会经由 compilation.processModuleDependencies 方法，再来处理各个依赖模块，递归的去遍历整个依赖。

7、`Template`。生成最终代码要使用到的代码模块，相当于是根据 modules 创建一个自执行函数来执行所有 modules。

## 打包流程分析

- 1、启动配置，读取与合并参数加载 plugin 实例化 Compiler。
- 2、调用 compiler.cun 创建 Compilation，代表依次资源的构建。
- 3、Compilation 对象也提供了很多关键步骤的钩子函数，并生成一次 Chunk。
- 4、Compilation.buildModule 主要执行 loader，编译掉不认识的代码。
- 5、使用 Parser 从 Chunk 开始解析依赖，使用 Module 和 Dependency 管理代码模块相互关系。
- 6、使用 Template 基于 Chunk 的数据生成结果代码。

:::tip 提示
1、整个流程相当于一个流水线，线上布置了有很多触发钩子，当执行到某个钩子时，会执行对应的插件。

2、Compiler / Compilation 都继承自 Tabable
:::
