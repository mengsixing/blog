# webpack 源码阅读-entry 篇

让我们从 entry 开始，阅读 webpack 源码吧。

## webpack 运行流程

想想当我们执行 npm run build 后，webpack 是怎样运行的？

```js
// package.json文件
"scripts": {
    "build": "webpack",
}
```

先给个粗略的答案：

1、先检查是否有安装 webpack-cli，如果没安装，则提示安装

2、引入 webpack-cli 包，解析参数后，调用 new webpack()。

3、创建编译对象 new Compiler()，并生成插件实例。

4、WebpackOptionsApply 方法用来解析参数，根据参数，初始化默认的插件 Plugins。

5、解析入口文件 SingleEntryPlugin ，并调用 doBuild 方法执行 loader。

6、执行完 loader 之后，调用 acorn.parse 生成 AST 依赖树。

7、最后调用 compilation.seal 进入 render 阶段，根据之前收集的依赖，决定生成多少文件，每个文件的内容是什么。

## EntryOptionPlugin 插件

把入口文件 entry chunk 加入到 compilation 中。

EntryOptionPlugin

```js
const itemToPlugin = (context, item, name) => {
  if (Array.isArray(item)) {
    return new MultiEntryPlugin(context, item, name);
  }
  return new SingleEntryPlugin(context, item, name);
};

module.exports = class EntryOptionPlugin {
  apply(compiler) {
    compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
      if (typeof entry === "string" || Array.isArray(entry)) {
        // 如果没有取名字，就默认为main
        itemToPlugin(context, entry, "main").apply(compiler);
      } else if (typeof entry === "object") {
        for (const name of Object.keys(entry)) {
          itemToPlugin(context, entry[name], name).apply(compiler);
        }
      } else if (typeof entry === "function") {
        new DynamicEntryPlugin(context, entry).apply(compiler);
      }
      return true;
    });
  }
};
```

### SingleEntryPlugin

```js
const SingleEntryDependency = require("./dependencies/SingleEntryDependency");

class SingleEntryPlugin {
  constructor(context, entry, name) {
    this.context = context;
    this.entry = entry;
    this.name = name;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(
      "SingleEntryPlugin",
      (compilation, { normalModuleFactory }) => {
        // compilation.dependencyFactories 是一个map类型，这里是挂载SingleEntryDependency
        compilation.dependencyFactories.set(
          SingleEntryDependency,
          normalModuleFactory
        );
      }
    );

    // 在编译阶段（make）钩子函数中，把entry挂载到 compilation 中
    compiler.hooks.make.tapAsync(
      "SingleEntryPlugin",
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

module.exports = SingleEntryPlugin;
```

### SingleEntryDependency

```js
const ModuleDependency = require("./ModuleDependency");

class SingleEntryDependency extends ModuleDependency {
  /**
   * @param {string} request request path for entry
   */
  constructor(request) {
    super(request);
  }

  get type() {
    return "single entry";
  }
}

module.exports = SingleEntryDependency;
```

### ModuleDependency

```js
const Dependency = require("../Dependency");

class ModuleDependency extends Dependency {
  /**
   * @param {string} request request path which needs resolving
   */
  constructor(request) {
    super();
    this.request = request;
    this.userRequest = request;
  }

  getResourceIdentifier() {
    return `module${this.request}`;
  }
}

module.exports = ModuleDependency;
```

### Dependency

```js
const util = require("util");
const compareLocations = require("./compareLocations");
const DependencyReference = require("./dependencies/DependencyReference");

class Dependency {
  constructor() {
    this.module = null;
    // TODO remove in webpack 5
    this.weak = false;
    this.optional = false;
    // 依赖的路径
    this.loc = undefined;
  }

  getResourceIdentifier() {
    return null;
  }

  // Returns the referenced module and export
  getReference() {
    if (!this.module) return null;
    return new DependencyReference(this.module, true, this.weak);
  }

  // Returns the exported names
  getExports() {
    return null;
  }

  getWarnings() {
    return null;
  }

  getErrors() {
    return null;
  }

  updateHash(hash) {
    hash.update((this.module && this.module.id) + "");
  }

  disconnect() {
    this.module = null;
  }
}

// TODO remove in webpack 5
Dependency.compare = util.deprecate(
  (a, b) => compareLocations(a.loc, b.loc),
  "Dependency.compare is deprecated and will be removed in the next major version"
);

module.exports = Dependency;
```

## webpack 整体流程分析

1、compiler webpack 的运行入口，compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性简历，并配置好所有可操作的设置，
包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将受到此 compiler 对象的引用，可以使用它来访问 webpakc 的主环境。

2、compilation 对象代表了一次资源的构建，当运行 webpack 开发环境中间件时，每当检测到一个文件的变化，就会创建一个新的 compilation，从而生成一组
新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变换的文件、以及被跟踪依赖的状态信息。compilation 也提供了很多关键步骤的
回调，以供插件在自定义处理时选择使用。

3、chunk，即用于表示 chunk 的类，对于构建时需要的 chunk 对象由 compilation 创建后保存管理。（webpack 中最核心的负责编译的 compiler 和负责创建 bundles 的 compilation 都是 tapable 的实例）

4、module 用于表示代码模块的基础类，衍生出很多子类用于处理不同的情况，关于代码模块的所有信息都会存在 module 实例中，例如 dependencies 记录代码模块的依赖等。
当一个 module 实例被创建后，比较重要的一步是执行 compilation.buildModule 这个方法，它会调用 module 实例的 build 方法来创建 module 实例所需要的一些东西，然后调用自身的 runloaders 方法。runloaders：loader-runner，执行对应的 loaders，将代码源码内容一一交由配置中指定的 loader 处理后，再把处理 的结果保存起来。

5、Parser，基于 acorn 来分析 ast 语法树，解析出代码模块的依赖。

6、dependency，解析时用于保存代码模块对应的依赖使用的对象。module 实例的 build 方法，在执行完对应的 loader 时，处理完模块自身的转换后，继续调用 parser 实例来解析自身依赖的模块，解析后的结果存放在 module.denpendencies 中，首先保存的是依赖的路径，后续会经由 compilation.processModuleDependencies 方法，再来处理各个依赖模块，递归的去简历整个依赖。

7、Template，生成最终代码要使用到的代码模块，像上述提到的胶水代码就是用对应的 template 来生成。
