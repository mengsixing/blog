# webpack 打包 modules 流程分析

最近在研究 webpack，对 webpack 的运行流程有了一个新的认识。

## webpack 打包后文件分析

webpack 打包后的代码并不复杂，下面是对打包后的结果的一个简化版：

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
  return __webpack_require__("./example/entry.js");
})({
  "./example/entry.js": function(
    module,
    __webpack_exports__,
    __webpack_require__
  ) {
    // code...
  }
});
```

1、最外层由一个自执行函数所包裹。

2、只执行函数会传递一个 modules 参数，这个参数是由文件路径为 key，文件代码被封装到一个单独的作用域中。

3、内部自定义一个 require 执行器，用来执行导入的文件，并导出 exports。

4、执行入口 entry 文件，在内部会递归执行所依赖的文件，并将结果挂载到 exports 对象上。

## 手动实现一个模块打包流程

为了更好的理解 webpack 打包运行机制，参考官网的教程，写了一个简单的模块打包 demo，我们一起来看一下。

### 整体流程分析

1、读取入口文件。

2、将内容转换成 ast 语法树。

3、深度遍历语法树，找到所有的依赖，并加入到一个数组中。

4、将 ast 代码转换回可执行的 js 代码。

5、编写 require 函数，根据入口文件，自动执行完所有的依赖。

### craeteAsset

创建资源：将一个单独的文件模块，处理成我们需要的对象。

- 经过 ast 语法树处理对应的依赖关系
- 使用 babel 将 ast 代码转换成可执行的代码

```js
function craeteAsset(filename) {
  var code = fs.readFileSync(filename, "utf-8");
  var dependencies = [];
  var ast = babely.parse(code, {
    sourceType: "module"
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
    presets: ["@babel/preset-env"]
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

1、使用 nodejs 中的 file 模块获取文件内容。

2、使用 @babel/parser 将文件内容转换成 ast 抽象语法树。

3、使用 @babel/traverse 对 ast 进行遍历，将入口文件的依赖保存起来。

4、使用 babel.transformFromAstSync 将 ast 转换成可执行的 js 代码。

5、返回一个模块，包含：模块 id，filename，dependencies，code 字段。

### createGraph

根据入口文件，遍历所有依赖的资源对象，输出一个包含所有资源对象的数组。

```js
// 深度遍历
function createGraph(entry) {
  var mainAsset = craeteAsset(entry);
  var queue = [mainAsset];

  for (let asset of queue) {
    var baseDirPath = path.dirname(asset.filename);
    asset.mapping = {};
    asset.dependencies.forEach(filename => {
      var realPath = path.join(baseDirPath, filename);
      var childAsset = craeteAsset(realPath);
      // 给子依赖项赋值
      asset.mapping[filename] = childAsset.id;
      queue.push(childAsset);
    });
  }
  return queue;
}
```

主要流程如下：

1、接收入口文件路径，处理入口模块，调用 craeteAsset 生成处理好的模块。

2、新建一个数组，深度遍历入口文件以及入口文件的依赖文件，并将 craeteAsset 生成后的文件加入数组中。

3、返回数组。

### bundle

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

  modules += "}";

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

1、传入 createGraph 生成的数组。

2、遍历数组，把执行的 code 加入到一个函数级作用域中，并增加一个子依赖的属性 mapping。

3、编写一个 require 方法（因为打包出来的代码是 commonjs 语法，这里为了解析 require 方法）。

4、require 中循环加载所有依赖项，并执行。

5、返回处理结果。

### 执行构建

```js
var graph = createGraph("./example/entry.js");
var result = bundle(graph);
// 这里就是打包后的结果了
console.log(result);
```

---

参考资料：

[手写 webpack 模块解析器](https://github.com/yhlben/diy-webpack)
