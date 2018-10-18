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

5、解析入口文件 SingleEntryPlugin ，并调用doBuild 方法执行loader。

6、执行完loader之后，调用acorn.parse 生成 AST 依赖树。

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

Adds an entry chunk on compilation. The chunk is named chunkName and contains only one module (plus dependencies). The module is resolved from request in context (absolute path).

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
