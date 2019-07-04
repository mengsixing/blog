# Webpack 系列（三）整体流程分析

这一章让我们从 entry 开始，阅读 webpack 源码吧。

- webpack 构建流程分析
- webpack 核心概念

## Webpack 构建流程分析

webpack 构建流程如下：

- 开始运行 Webpack。
  - 读取与合并参数，加载 plugin。
  - 实例化 Compiler。
    - 调用 compiler.run 创建 Compilation，代表一次资源的构建。
    - Compilation 对象也提供了很多关键步骤的钩子函数，并生成一次 Chunk。
    - Compilation.buildModule 主要执行 loader，编译掉不认识的代码。
- 使用 Parser 分析项目依赖。
  - 从 Chunk 开始解析依赖，使用 Module 和 Dependency 管理代码模块相互关系。
- 使用 Template 生成结果代码。
  - 基于 Chunk 的数据拼接字符串，生成最终代码。

:::tip 提示
1、整个流程相当于一个流水线，线上布置了有很多触发钩子，当执行到某个钩子时，会执行对应的插件。

2、Compiler / Compilation 都继承自 Tabable，可以直接触发对应的事件钩子。
:::

### 开始运行 webpack

第一步，执行 webpack 函数，在 webpack 函数中初始化 compiler 对象，初始化自定义插件。

```js
const webpack = (options, callback) => {
  let compiler;
  if (typeof options === 'object') {
    options = new WebpackOptionsDefaulter().process(options);
    // 创建编译对象
    compiler = new Compiler(options.context);
    compiler.options = options;
    // NodeEnvironmentPlugin：将Node.js格式的文件系统应用于compiler。
    new NodeEnvironmentPlugin().apply(compiler);
    if (options.plugins && Array.isArray(options.plugins)) {
      for (const plugin of options.plugins) {
        // 执行自定义插件
        plugin.apply(compiler);
      }
    }
    // 触发environment钩子函数：在准备环境之前运行插件。
    compiler.hooks.environment.call();
    // 触发afterEnvironment钩子函数：执行插件环境设置完成。
    compiler.hooks.afterEnvironment.call();
    // 处理配置中的target参数，例如 web，node，根据不同配置，配置默认的plugin。
    compiler.options = new WebpackOptionsApply().process(options, compiler);
  }

  if (callback) {
    // 开始编译
    compiler.run(callback);
  }
  // 返回compiler
  return compiler;
};
```

compiler.run 执行后，就会根据生命周期，执行对应的事件钩子函数。

第二步，触发 WebpackOptionsApply 中间件。

- 在 compilation 阶段会记录好依赖的工厂类。
- 在 make 阶段的时候会创建一个 SingleEntryPlugin 实例。
- 调用 compilation.addEntry 方法。
- addEntry 会调用 \_addModuleChain 方法，最终经过几次调用后会进入到 NormalModule.js 中的 build 方法。

```js
// WebpackOptionsApply -> EntryOptionPlugin ->SingleEntryPlugin
class SingleEntryPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(
      'SingleEntryPlugin',
      (compilation, { normalModuleFactory }) => {
        compilation.dependencyFactories.set(
          SingleEntryDependency,
          normalModuleFactory
        );
      }
    );
    compiler.hooks.make.tapAsync(
      'SingleEntryPlugin',
      (compilation, callback) => {
        const { entry, name, context } = this;
        const dep = SingleEntryPlugin.createDependency(entry, name);
        compilation.addEntry(context, dep, name, callback);
      }
    );
  }
  static createDependency(entry, name) {
    const dep = new SingleEntryDependency(entry);
    dep.loc = { name };
    return dep;
  }
}
```

第三步，调用 NormalModule 中的 build 方法。

- build 方法会先执行 doBuild，**将原始代码经过 loader 进行转义**。
- 经过 doBuild 之后，我们的任何模块都被转成了标准的 JS 模块，那么下面我们就可以编译 JS 了。

```js
doBuild(options, compilation, resolver, fs, callback) {
  const loaderContext = this.createLoaderContext(
    resolver,
    options,
    compilation,
    fs
  );
  // 执行loaders
  runLoaders(
    {
        resource: this.resource,
        loaders: this.loaders,
        context: loaderContext,
        readResource: fs.readFile.bind(fs)
    },
    (err, result) => {
      if (result) {
          this.buildInfo.cacheable = result.cacheable;
          this.buildInfo.fileDependencies = new Set(result.fileDependencies);
          this.buildInfo.contextDependencies = new Set(
              result.contextDependencies
          );
      }
      // result 是一个数组，数组的第一项就是编译后的代码
      const resourceBuffer = result.resourceBuffer;
      const source = result.result[0];
      const sourceMap = result.result.length >= 1 ? result.result[1] : null;
      const extraInfo = result.result.length >= 2 ? result.result[2] : null;
      // this._source 是一个 对象，有name和value两个字段，name就是我们的文件路径，value就是 编译后的JS代码
      this._source = this.createSource(
          this.binary ? asBuffer(source) : asString(source),
          resourceBuffer,
          sourceMap
      );
      return callback();
    }
  );
}
```

### 使用 Parser 分析项目依赖

第四步，调用 parser.parse 方法，将代码转换成 ast。

```js
build(options, compilation, resolver, fs, callback) {
  return this.doBuild(options, compilation, resolver, fs, err => {
    // 编译成ast
    const result = this.parser.parse(
      this._ast || this._source.source(),
      {
          current: this,
          module: this,
          compilation: compilation,
          options: options
      },
      (err, result) => {
          if (err) {
              handleParseError(err);
          } else {
              handleParseResult(result);
          }
      }
    );
  });
}

static parse(code, options) {
  let ast;
  let error;
  let threw = false;
  try {
      // 编译成ast
      ast = acorn.parse(code, parserOptions);
  } catch (e) {
      error = e;
      threw = true;
  }
  return ast;
}
```

第五步，解析完 ast 后，就会对每个模块所依赖的对象进行收集。

如果我们有 import a from 'a.js' 这样的语句，那么经过 babel-loader 之后会变成 var a = require('./a.js') ，而对这一句的处理就在 walkStatements 中，这里经过了几次跳转，最终会发现进入了 walkVariableDeclarators 方法，这里我们这是声明了一个 a 变量。这个方法的主要内容如下：

```js
// import a from 'a.js'
walkVariableDeclaration(statement) {
  for (const declarator of statement.declarations) {
    switch (declarator.type) {
      case "VariableDeclarator": {
        // 这里就是我们的变量名 a
        this.walkPattern(declarator.id);
        // 这里就是我们的表达式 `require('./a.js')`
        if (declarator.init) this.walkExpression(declarator.init);
        break;
      }
    }
  }
}
```

这里的`require('./a.js')` 是一个函数调用，在这里就会创建一个依赖，记录下对 a.js 模块的依赖关系，最终这些依赖会被放到 module.dependencies 中。

### 使用 Template 生成结果代码

第六步，在收集完所有依赖之后，会调用 compilation.seal 方法。

- 遍历所有的 chunk 和 chunk 所依赖的文件。
- 将这些文件通过调用 MainTemplate 中的 render 生成最终代码。

```js
// 将结果包裹到一个IIFE中
renderBootstrap(hash, chunk, moduleTemplate, dependencyTemplates) {
  const buf = [];
  buf.push(
    this.hooks.bootstrap.call(
      "",
      chunk,
      hash,
      moduleTemplate,
      dependencyTemplates
    )
  );
  buf.push(this.hooks.localVars.call("", chunk, hash));
  buf.push("");
  buf.push("// The require function");
  buf.push(`function ${this.requireFn}(moduleId) {`);
  buf.push(Template.indent(this.hooks.require.call("", chunk, hash)));
  buf.push("}");
  buf.push("");
  buf.push(
    Template.asString(this.hooks.requireExtensions.call("", chunk, hash))
  );
  buf.push("");
  buf.push(Template.asString(this.hooks.beforeStartup.call("", chunk, hash)));
  buf.push(Template.asString(this.hooks.startup.call("", chunk, hash)));
  return buf;
}
```

## Webpack 核心概念

**Compiler**。webpack 的运行入口，compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，
包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用，可以使用它来访问 webpack 的主环境。

**Compilation**。代表了一次资源的构建，当运行 webpack 开发环境时，每当检测到一个文件的变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变换的文件、以及被跟踪依赖的状态信息。compilation 也提供了很多关键步骤的回调，以供插件在自定义处理时选择使用。

**Module**。用于表示代码模块的基础类，关于代码模块的所有信息都会存在 module 实例中，例如 dependencies（记录代码模块的依赖） 等。

创建一个 module 对象，主要操作：

- 搜集所有依赖的 module
- 执行对应的 loader

**Chunk**。一个 Chunk 是由一个或多个 Module 生成。一般根据入口文件生成 Chunk，然后把入口文件所依赖文件的 Module 集合加入到 Chunk 中。简单理解： Chunk 是打包后的代码块，如果没有使用代码拆分，那么打包后的 bundle 和 chunk 就是一样的。

生成 Chunk 的两种方式：

- 入口文件模块
- 动态引入的模块

**Parser**。基于 acorn 来分析 ast 语法树，解析出代码模块的依赖。

**Dependency**。保存代码模块对应的依赖使用的对象，module 实例的 build 方法在执行完对应的 loader 时，会继续调用 parser 实例来解析自身依赖的模块，解析后的结果存放在 module.denpendencies 中，具体步骤如下：首先保存的是依赖的路径，后续会经由 compilation.processModuleDependencies 方法处理模块的依赖。

**Template**。生成最终代码要使用到的代码模块，相当于是根据 modules 创建一个自执行函数来执行所有 modules。

## 相关链接

- [Webpack 系列（一）使用总结](devops-webpack.html)
- [Webpack 系列（二）手写模块打包代码](devops-webpack-flow.html)
- [Webpack 处理流程分析](https://github.com/lihongxun945/diving-into-webpack/blob/master/6-process-pipe-line.md)
