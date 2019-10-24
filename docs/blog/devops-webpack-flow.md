# Webpack 系列（二）手写模块打包代码

最近在学习 webpack，参考官网的 demo，编写了一个简版的模块加载器，对 webpack 的运行流程有了一个新的认识。

- Webpack 打包后文件分析
- 手写一个模块打包器

## Webpack 打包后文件分析

为了更好的理解 webpack 模块打包机制，我们先来看一下 webpack 打包后的文件。

```js
(function(modules) {
  function __webpack_require__(moduleId) {
    var module = {
      exports: {}
    };
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    return module.exports;
  }
  return __webpack_require__('./example/entry.js');
})({
  './example/entry.js': function(
    module,
    __webpack_exports__,
    __webpack_require__
  ) {
    // code...
  }
});
```

上述代码主要由以下几个部分组成：

- 最外层由一个自执行函数所包裹。
- 自执行函数会传递一个 modules 参数，这个参数是一个对象，`{key: 文件路径,value: 函数}`，value 中的函数内部是打包前模块的 js 代码。
- 内部自定义一个 require 执行器，用来执行导入的文件，并导出 exports。
- 执行入口 entry 文件，在内部会递归执行所有依赖的文件，并将结果挂载到 exports 对象上。

## 手写一个模块打包器

参考官网的教程，写了一个简单的模块打包 demo，我们一起来看一下。

### 整体流程分析

- 读取入口文件。
- 将内容转换成 ast 语法树。
- 深度遍历语法树，找到所有的依赖，并加入到一个数组中。
- 将 ast 代码转换为可执行的 js 代码。
- 编写 require 函数，根据入口文件，自动执行完所有的依赖。

### 代码分层

代码主要分为以下 3 个部分：

- createAsset，处理单个资源，生成资源对象。
- createGraph，循环遍历，生成所有资源对象数组。
- bundle，封装 require 函数，实现依赖注入。

#### createAsset

创建资源：将一个单独的文件模块，处理成我们需要的对象。

- 使用 ast 语法树处理对应的依赖关系。
- 使用 babel 将 ast 代码转换成可执行的代码。

```js
function createAsset(filename) {
  var code = fs.readFileSync(filename, 'utf-8');
  var dependencies = [];
  var ast = babely.parse(code, {
    sourceType: 'module'
  });
  // 把依赖的文件写入进来
  traverse(ast, {
    // 每当遍历到import语法的时候
    ImportDeclaration: ({ node }) => {
      // 把依赖的模块加入到数组中
      dependencies.push(node.source.value);
    }
  });

  const result = babel.transformFromAstSync(ast, null, {
    presets: ['@babel/preset-env']
  });

  var module = {
    id: id++,
    filename: filename,
    dependencies,
    code: result.code
  };
  return module;
}
```

主要流程如下：

- 使用 nodejs 中的 file 模块获取文件内容。
- 使用 @babel/parser 将文件内容转换成 ast 抽象语法树。
- 使用 @babel/traverse 对 ast 进行遍历，将入口文件的依赖保存起来。
- 使用 babel.transformFromAstSync 将 ast 转换成可执行的 js 代码。
- 返回一个模块，包含：模块 id，filename，dependencies，code 字段。

#### createGraph

根据入口文件，遍历所有依赖的资源对象，输出一个包含所有资源对象的数组。

```js
// 深度遍历
function createGraph(entry) {
  var mainAsset = createAsset(entry);
  var queue = [mainAsset];

  for (let asset of queue) {
    var baseDirPath = path.dirname(asset.filename);
    asset.mapping = {};
    asset.dependencies.forEach(filename => {
      var realPath = path.join(baseDirPath, filename);
      var childAsset = createAsset(realPath);
      // 给子依赖项赋值
      asset.mapping[filename] = childAsset.id;
      queue.push(childAsset);
    });
  }
  return queue;
}
```

主要流程如下：

- 接收入口文件路径，处理入口模块，调用 createAsset 生成处理好的模块。
- 新建一个数组，深度遍历入口文件以及入口文件的依赖文件，并将 createAsset 生成后的文件加入数组中。
- 返回数组。

#### bundle

封装自执行函数，创建 require 方法，处理文件相互依赖。

```js
function bundle(graph) {
  var modules = `{`;
  // 拼接modules字符串
  graph.forEach((item, index) => {
    modules += `
      ${index}:{
        fn:function(require,module,exports){
          ${item.code}
        },
        mapping:${JSON.stringify(item.mapping)}
      },
    `;
  });

  modules += '}';

  var result = `
  (function(graph){
    var module = {exports:{}};
    function require(id){
      var {fn,mapping} = graph[id];
      function localRequire(name){
        // 处理依赖映射，把依赖的文件名，转换成对应的对象索引
        return require(mapping[name]);
      }
      // 运行asset代码
      fn(localRequire,module,module.exports);
      return module.exports;
    }
    // 运行入口文件
    return require(0);
  })(${modules})
  `;
  return result;
}
```

主要流程如下：

- 传入 createGraph 生成的数组。
- 遍历数组，把执行的 code 加入到一个函数级作用域中，并增加一个子依赖的属性 mapping。
- 编写一个 require 方法（因为打包出来的代码是 commonjs 语法，这里为了解析 require 方法）。
- require 中循环加载所有依赖项，并执行。
- 返回处理结果。

### 执行构建

接下来使用自己编写的打包代码，进行项目打包。

```js
var graph = createGraph('./example/entry.js');
var result = bundle(graph);
// 这里就是打包后的结果了，和webpaack 打包后的结果是一致的。
console.log(result);
```

## 总结

本文实现了一个非常精简的打包工具。打包后的文件和源生 webpack 保持了一致，但剔除了 loader ， plugin 机制，以保持项目简洁。通过这次实践，也让我更加了解 webpack 的打包机制。

## 相关链接

- [手写 webpack 模块解析器](https://github.com/lmjben/diy-webpack)
- [Webpack 系列（一）使用总结](devops-webpack.html)
- [Webpack 系列（三）打包 modules 流程分析](devops-webpack-entry.html)
